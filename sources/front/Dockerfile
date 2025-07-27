FROM node:22-alpine AS builder

WORKDIR /app

# COPY package.json tsconfig.json ./
COPY . .

RUN npm i

RUN npm run build

FROM alpine:latest

WORKDIR /usr/src/app

COPY --from=builder /app/dist ./
# Ce conteneur sert juste à générer les fichiers