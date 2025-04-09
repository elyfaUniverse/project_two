require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const express = require('express')
const argon2 = require('argon2')
const cors = require('cors')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const app = express()

const PORT = process.env.PORT || 5000

const corsOptions = {
	origin: [
		'https://project-two-two-omega.vercel.app',
		'https://project-gx4igamzj-elyfas-projects.vercel.app',
		'http://localhost:3000',
	],
	methods: 'GET,POST,PUT,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
}

// Middleware
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

// Проверка подключения к БД
const checkDbConnection = async () => {
	try {
		await prisma.$connect()
		console.log('✅ Successfully connected to PostgreSQL')
	} catch (err) {
		console.error('❌ DB connection error:', err)
		process.exit(1)
	}
}

checkDbConnection().then(() => {
	console.log('Using database URL:', process.env.DATABASE_URL)
})

// Ваши маршруты (без использования router)
app.get('/api/health', (req, res) => {
	res.status(200).json({ status: 'OK' })
})

// Остальные маршруты остаются без изменений...

// Обработчик ошибок
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Something broke!' })
})

process.on('unhandledRejection', err => {
	console.error('Unhandled rejection:', err)
})

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on port ${PORT}`)
})
