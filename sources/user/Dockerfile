# # Multi-stage build plus adaptee la prod

# FROM node:24-alpine AS build

# RUN npm install -g pnpm@latest-10
# WORKDIR /app

# COPY package.json tsconfig.json ./
# RUN pnpm install

# COPY src ./src
# COPY .env ./
# COPY prisma ./prisma

# RUN npx prisma generate
# RUN pnpm run build
# RUN pnpm prune --prod

# FROM node:24-alpine

# RUN npm install -g pnpm@latest-10
# WORKDIR /usr/src/app

# ENV NODE_ENV=production

# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/.env .env
# COPY --from=build /app/prisma ./prisma

# CMD ["node", "dist/index.js"]


# Version ghetto pour dev

FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npx prisma generate
RUN rm prisma/dev.db*
RUN npx prisma migrate dev

CMD ["npm", "run", "dev"]