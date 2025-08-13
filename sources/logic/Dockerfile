# Multi-stage build plus adaptee la prod

FROM node:24-alpine AS build

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm i

COPY src ./src
COPY script ./script

RUN npm run build

FROM node:24-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

# COPY --from=build /app/node_modules ./node_modules

COPY package.json tsconfig.json ./

RUN npm install --only=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]

# # Version ghetto pour dev

# FROM node:24-alpine

# WORKDIR /usr/src/app

# COPY package.json tsconfig.json ./
# RUN npm install

# COPY src ./src
# COPY script ./script

# CMD ["npm", "start"]
