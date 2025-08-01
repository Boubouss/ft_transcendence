FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@latest

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
    # npm ci for clean install

COPY . .

RUN npx prisma generate

USER node

EXPOSE 3000

CMD ["npm", "start"]