FROM nginx:alpine

COPY nginx.conf /etc/nginx

COPY ssl/ /etc/nginx/ssl/

CMD ["nginx", "-g", "daemon off;"]
