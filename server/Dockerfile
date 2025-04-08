FROM node:18-alpine

# Установка зависимостей для Prisma
RUN apk add --no-cache openssl python3 make g++

# Создаем рабочую директорию
WORKDIR /app

# Копируем ТОЛЬКО файлы зависимостей сначала
COPY package.json .
COPY package-lock.json .
COPY prisma/schema.prisma ./prisma/

# Устанавливаем зависимости
RUN npm install && \
    npx prisma generate

# Копируем остальные файлы проекта
COPY . .

# Открываем порт
EXPOSE 5000

# Запускаем сервер
CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]