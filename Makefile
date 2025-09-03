DOCKER_COMPOSE = docker compose

# Cible par défaut
.DEFAULT_GOAL := up
.PHONY: clean

up: 
	./scriptenv.sh && docker compose up --build

down:
	docker compose down

re: clean  
	docker compose up --build
# Nettoie conteneurs, images et volumes du projet
clean:
	docker compose down -v --rmi all --remove-orphans

fclean: clean
	rm .env