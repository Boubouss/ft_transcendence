# Multi-stage build plus adaptee la prod

# FROM node:24-alpine AS build

# WORKDIR /app

# COPY package.json tsconfig.json ./
# RUN npm install

# COPY src ./src
# COPY script ./script

# RUN npm run build
# RUN npm prune --omit=dev

# FROM node:24-alpine

# WORKDIR /usr/src/app
# ENV NODE_ENV=production

# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/dist ./dist

# CMD ["node", "dist/index.js"]

# Version ghetto pour dev

FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

RUN rm -rf ./node_modules/ || true

RUN npm install

CMD ["npm", "start"]
