FROM node:22-alpine AS builder

WORKDIR /app

# COPY package*.json ./
COPY . .

RUN npm ci

RUN npm run build

FROM alpine:latest

WORKDIR /usr/src/app

COPY --from=builder /app/dist ./
# Ce conteneur sert juste à générer les fichiers