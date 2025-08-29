FROM node:22-alpine AS builder

WORKDIR /app

# COPY package.json tsconfig.json ./
COPY . .

RUN npm i

RUN npm run build

# Ce conteneur sert juste à générer les fichiers

FROM nginx:alpine

COPY nginx.conf /etc/nginx

RUN chmod -R 755 /usr/share/nginx/html

COPY --from=builder /app/dist /usr/share/nginx/html/


ENTRYPOINT ["nginx", "-g", "daemon off;"]