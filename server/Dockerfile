FROM node:18-alpine

# Установка curl для healthcheck
RUN apk add --no-cache \
    curl \
    openssl \
    python3 \
    make \
    g++

WORKDIR /app

# Копируем зависимости первыми для кэширования
COPY package*.json ./
COPY prisma ./prisma/

# Чистая установка для production
RUN npm ci --only=production && \
    npx prisma generate

# Копируем остальные файлы
COPY . .

# Указываем порт
EXPOSE 5000

# Healthcheck для Render
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]