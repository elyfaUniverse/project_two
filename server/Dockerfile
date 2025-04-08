FROM node:18-alpine

# Установка curl для healthcheck
RUN apk add --no-cache \
    curl \
    openssl \
    python3 \
    make \
    g++

WORKDIR /app

# Генерируем package-lock.json если его нет
RUN if [ ! -f package-lock.json ]; then npm install; fi

# Устанавливаем зависимости для production
RUN npm ci --omit=dev && \
    npx prisma generate

# Копируем остальные файлы
COPY . .

# Указываем порт
EXPOSE 5000



CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]