# OpenGL Visualisation 3D d'objets

Ce projet affiche trois objets 3D (cube, sphère, prisme hexagonal)

## Contrôles

- **1, 2, 3** : Changer d'objet (Cube, Sphère, Prisme hexagonal)
- **W, A, S, D** : Déplacer la caméra
- **Arrow keys** : Pour tourner l'objet
- **Molette** : Zoom avant/arrière

## Prérequis

- Docker
- Docker Compose

## Installation et Exécution

```bash
# Construire et lancer le conteneur
docker-compose up --build

# Une fois démarré, ouvrez votre navigateur à :
# http://localhost:6080/vnc.html
# et cliquez sur Connect dans novnc
```