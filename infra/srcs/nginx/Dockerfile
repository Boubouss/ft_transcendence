FROM debian:bullseye

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y nginx

CMD ["nginx", "-g", "daemon off;"]
