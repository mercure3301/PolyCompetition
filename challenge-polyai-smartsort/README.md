# SmartSort 🌱

Application intelligente de classification des déchets utilisant l'intelligence artificielle pour identifier et catégoriser les déchets à partir d'images ou de descriptions textuelles.

## 📋 Table des matières

- [Architecture du projet](#architecture-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation et exécution](#installation-et-exécution)
- [Modèles IA et justification](#modèles-ia-et-justification)
- [Catégories de déchets](#catégories-de-déchets)

## 🏗️ Architecture du projet

Le projet est divisé en trois parties principales :

```
SmartSort/
├── frontend/          # Interface utilisateur React + Vite
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # API client
│   │   └── App.jsx        # Application principale
│   └── package.json
│
├── backend/           # API FastAPI + MongoDB
│   ├── models/           # Modèles ML et base de données
│   ├── utils/            # Utilitaires (preprocessing, MongoDB)
│   ├── app.py            # Serveur FastAPI
│   └── requirements.txt
│
└── ml-model/          # Entraînement des modèles
    ├── garbage-classification/  # Dataset d'images
    ├── train_image_model.py     # Entraînement modèle image
    ├── train_text_model.py      # Entraînement modèle texte
    └── test_model.py            # Tests du modèle
```

### Frontend (React + Vite + Tailwind CSS)
- Upload d'images avec prévisualisation
- Classification par description textuelle
- Historique des classifications
- Statistiques et visualisations

### Backend (FastAPI + MongoDB)
- API RESTful pour la classification
- Gestion de la base de données MongoDB
- Preprocessing des images et textes
- Endpoints pour historique et statistiques

### ML Models
- **Modèle d'images** : MobileNetV2 avec transfer learning
- **Modèle de texte** : TF-IDF + Random Forest

## 🛠️ Technologies utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool rapide
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **Axios** - Client HTTP

### Backend
- **FastAPI** - Framework web Python
- **TensorFlow/Keras** - Deep learning
- **MongoDB** - Base de données NoSQL
- **Pillow** - Traitement d'images
- **scikit-learn** - Machine learning classique

## 🚀 Installation et exécution

### Prérequis
- Python 3.8+
- Node.js 16+

## Installation de MongoDB (Windows)

1. Téléchargez MongoDB Community Server :  
   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. Lancez l’installation et sélectionnez “Complete”.
3. Vérifiez l’installation :
```bash
   mongod --version
```

### 1. Installation du Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
# Créer un fichier .env avec:
MONGODB_URI=mongodb://localhost:27017/
MONGODB_PORT=27017

# Lancer le serveur
python app.py
```

Le backend sera accessible sur `http://localhost:8000`

### 2. Installation du Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### 3. Entraînement des modèles (optionnel)

Si vous souhaitez réentraîner les modèles :

```bash
cd ml-model

# Entraîner le modèle d'images
python train_image_model.py

# Entraîner le modèle de texte
python train_text_model.py

# Tester le modèle d'images
python test_model.py
```

Après l'entraînement, copiez les modèles générés vers le backend (ils sont deja mis de base):
```bash
copy models\waste_classifier_image.h5 ..\backend\models\
copy models\waste_classifier_text.pkl ..\backend\models\
copy models\text_vectorizer.pkl ..\backend\models\
```

## Modèles IA et justification

### Modèle de classification d'images : MobileNetV2

**Choix du modèle :**
- **MobileNetV2** : On a utilisé ce model car c'est un réseau de neurones convolutif optimisé pour les applications mobiles et embarquées. Il a une architecture légère (3.4M paramètres) mais performante et est pré-entraîné sur ImageNet (1.4M images, 1000 classes)

**Justification :**
1. **Performance** : Excellente précision pour la classification d'images (86,5% de accuracy pour la validation)
2. **Efficacité** : Rapide en inférence, idéal pour une application web
3. **Transfer Learning** : Les features apprises sur ImageNet sont transférables à notre tâche
4. **Taille réduite** : Modèle léger (~14MB) facile à déployer

**Techniques utilisées :**
- Data augmentation pour éviter l'overfitting
- Dropout pour la régularisation
- Early stopping pour éviter le surapprentissage
- ReduceLROnPlateau pour ajuster le learning rate
- ModelCheckpoint pour sauvegarder le meilleur modèle (basé sur val_accuracy)

### Modèle de classification de texte : TF-IDF + Random Forest

**Choix du modèle :**
- **TF-IDF** (Term Frequency-Inverse Document Frequency) pour la vectorisation
- **Random Forest** pour la classification

**Justification :**
1. **Simplicité** : Facile à entraîner et à déployer
2. **Robustesse** : Fonctionne bien avec peu de données
3. **Interprétabilité** : On peut comprendre quels mots influencent la classification
4. **Performance** : Suffisant pour des descriptions courtes de déchets

## Catégories de déchets

Le système classifie les déchets en 6 catégories :

| Catégorie | Icône | Exemples |
|-----------|-------|----------|
| **Verre** | 🟢 | Bouteilles, pots, bocaux |
| **Métal** | ⚙️ | Canettes, conserves, aluminium |
| **Organique** | 🌱 | Restes alimentaires, épluchures |
| **Autre** | ⚫ | Déchets non recyclables ou autre |
| **Papier** | 📄 | Journaux, cartons, magazines |
| **Plastique** | 🔵 | Bouteilles, emballages, sacs |

## Fonctionnalités

- Classification par image (upload ou drag & drop)
- Classification par description textuelle
- Historique des classifications
- Statistiques et visualisations
- Interface responsive et moderne
- Base de données MongoDB pour la persistance

## API Endpoints

- `POST /api/classify/image` - Classifier une image
- `POST /api/classify/text` - Classifier un texte
- `GET /api/history` - Récupérer l'historique
- `GET /api/stats` - Récupérer les statistiques
- `DELETE /api/history/{item_id}` - Supprimer un élément
- `GET /api/categories` - Liste des catégories

## Notes

- Le modèle d'images attend des images de 224x224 pixels (redimensionnement automatique)
- Les images sont prétraitées automatiquement (normalisation, augmentation)
- MongoDB démarre automatiquement avec le backend
- Les modèles pré-entraînés sont inclus dans le dossier `backend/models/`

## Crédits

Moi même
