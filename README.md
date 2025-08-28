# ft_transcendence

## Prérequis

-   Assurez-vous d'avoir **Docker** et **Docker Compose** installés.
-   Des fichier `.env` basés sur les fichiers `.env.example` fournis

## Lancement de l'application

Pour démarrer l’ensemble des services :

```bash
docker compose up --build -d
```

## Structure de l’application

-   **Frontend** : servi par **nginx** (production-ready)
-   **Backend** : plusieurs micro-services (game, logic, user)
-   **Base de données** : on utilise **Prisma** comme ORM
-   **Reverse proxy** : nginx gère la mise en place du HTTPS et le routage interne
-   **Exposition publique** : actuellement via un tunnel **ngrok**

## Arret de l'application

Pour arrêter l’ensemble des services :

```bash
docker compose down
```

Pour egalement supprimer les images générés lors du build + volumes :

```bash
docker compose down --rmi all -v
```
