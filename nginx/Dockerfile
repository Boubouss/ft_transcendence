FROM nginx:alpine

COPY nginx.conf /etc/nginx

# RUN chmod -R 755 /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
