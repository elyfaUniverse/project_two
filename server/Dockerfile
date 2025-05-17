FROM node:18-alpine

# Установка зависимостей для Prisma
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY prisma/schema.prisma ./prisma/

RUN npm install && \
    npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]
