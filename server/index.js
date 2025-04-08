require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const express = require('express')
const argon2 = require('argon2')
const cors = require('cors')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(
	cors({
		origin: [
			'https://project-two-two-omega.vercel.app',
			'http://localhost:3000',
		],
		methods: 'GET,POST,PUT,DELETE',
		allowedHeaders: 'Content-Type,Authorization',
		credentials: true,
	})
)
app.use(cors(corsOptions))

// Проверка подключения к БД
prisma
	.$connect()
	.then(() => console.log('Connected to PostgreSQL'))
	.catch(err => console.error('DB connection error:', err))
console.log('Using database URL:', process.env.DATABASE_URL)

// Проверка подключения к БД с таймаутом
const checkDbConnection = async () => {
	try {
		await prisma.$connect()
		console.log('✅ Successfully connected to PostgreSQL')
	} catch (err) {
		console.error('❌ DB connection error:', err)
		process.exit(1)
	}
}

checkDbConnection()

app.options('*', cors(corsOptions)) // разрешаем preflight запросы
// Регистрация
app.post('/api/register', async (req, res) => {
	try {
		const { email, password, name } = req.body

		// Валидация
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' })
		}

		// Проверка существования пользователя
		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' })
		}

		// Хеширование пароля
		const hash = await argon2.hash(password)

		// Создание пользователя
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hash,
				name,
			},
		})

		// Генерация токена
		const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		})
		res.status(201).json({
			message: 'Registration successful',
			token,
			email: newUser.email,
			name: newUser.name,
			userId: newUser.id,
		})
	} catch (err) {
		console.error('Registration error:', err)
		res.status(500).json({
			error: 'Registration failed',
			details: err.message,
		})
	}
})

// Вход пользователя
app.post('/api/login', async (req, res) => {
	try {
		const { email, password } = req.body
		// Добавьте проверку
		if (!email) {
			return res.status(400).json({ error: 'Email is required' })
		}

		// Поиск пользователя в БД
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				name: true,
			},
		})

		if (!user || !(await argon2.verify(user.password, password))) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		// Генерация токена
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		})

		res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		})
	} catch (err) {
		console.error('Login error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})
app.get('/api/me', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				name: true, // Важно: выбираем имя
			},
		})

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		res.json(user)
	} catch (err) {
		res.status(401).json({ error: 'Invalid token' })
	}
})

app.post('/api/logout', (req, res) => {
	// Здесь можно добавить логику недействительности токена
	// (если используете blacklist токенов)
	res.json({ message: 'Logged out successfully' })
})

app.get('/api/films', async (req, res) => {
	try {
		const films = await prisma.film.findMany({
			select: {
				id: true,
				text: true,
				imageUrl: true,
				aggregateRating: true,
				year: true,
				canal_1: true,
				canal_2: true,
			},
		})
		res.json(films)
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ error: 'Failed to fetch films' })
	}
})

// Добавление/удаление из избранного
app.post('/api/films/:filmId/favorite', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const filmId = req.params.filmId

		// Проверяем, есть ли уже запись в избранном
		const existingFavorite = await prisma.favorite.findFirst({
			where: {
				userId: decoded.userId,
				filmId: filmId,
			},
		})

		if (existingFavorite) {
			// Удаляем из избранного
			await prisma.favorite.delete({
				where: { id: existingFavorite.id },
			})
			return res.json({ isFavorite: false })
		} else {
			// Добавляем в избранное
			await prisma.favorite.create({
				data: {
					userId: decoded.userId,
					filmId: filmId,
				},
			})
			return res.json({ isFavorite: true })
		}
	} catch (err) {
		console.error('Favorite toggle error:', err)
		res.status(500).json({ error: 'Failed to toggle favorite' })
	}
})

// Проверка, есть ли фильм в избранном
app.get('/api/films/:filmId/favorite', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) return res.json({ isFavorite: false })

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const filmId = req.params.filmId

		const favorite = await prisma.favorite.findFirst({
			where: {
				userId: decoded.userId,
				filmId: filmId,
			},
		})

		res.json({ isFavorite: !!favorite })
	} catch (err) {
		console.error('Check favorite error:', err)
		res.status(500).json({ error: 'Failed to check favorite status' })
	}
})
// Получение списка избранных фильмов пользователя
app.get('/api/favorites', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const favorites = await prisma.favorite.findMany({
			where: { userId: decoded.userId },
			select: { filmId: true },
		})

		res.json(favorites)
	} catch (err) {
		console.error('Get favorites error:', err)
		res.status(500).json({ error: 'Failed to get favorites' })
	}
})
// Эндпоинт для удаления из избранного (исправленный)
app.delete('/api/favorites/:filmId', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) return res.status(401).json({ error: 'Unauthorized' })

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const filmId = req.params.filmId

		// Находим запись для удаления
		const favorite = await prisma.favorite.findFirst({
			where: {
				userId: decoded.userId,
				filmId: filmId,
			},
		})

		if (!favorite) {
			return res.status(404).json({ error: 'Favorite not found' })
		}

		// Удаляем запись
		await prisma.favorite.delete({
			where: { id: favorite.id },
		})

		res.json({ success: true })
	} catch (err) {
		console.error('Delete favorite error:', err)
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Invalid token' })
		}
		res.status(500).json({ error: 'Failed to delete favorite' })
	}
})
// Простейший healthcheck
// Добавьте в ваш Express app
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'OK' })
})
app.listen(5000, '0.0.0.0', () => {
	console.log('Server is running on http://0.0.0.0:5000')
})
// Добавьте обработчик ошибок
process.on('unhandledRejection', err => {
	console.error('Unhandled rejection:', err)
})

/*const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)})*/
