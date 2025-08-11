FROM node:22-alpine AS build

RUN npm install -g npm@latest
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env .env
USER node

CMD ["npm", "start"]
