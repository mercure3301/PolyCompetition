import numpy as np
import tensorflow as tf
from tensorflow import keras
import pickle
import os
from typing import Dict

class WasteClassifier:
    def __init__(self):
        self.image_model = None
        self.text_model = None
        self.text_vectorizer = None
        self.categories = ["Verre", "Métal", "Organique", "Autre", "Papier", "Plastique"] 
        
        self._load_models()
    
    def _load_models(self):
        try:
            image_model_path = "models/waste_classifier_image.h5"
            if os.path.exists(image_model_path):
                self.image_model = keras.models.load_model(image_model_path)
                print("Modèle d'images chargé")
            else:
                print("Modèle d'images non trouvé, utilisation du modèle par défaut")
                self._create_default_image_model()
            
            text_model_path = "models/waste_classifier_text.pkl"
            vectorizer_path = "models/text_vectorizer.pkl"
            
            if os.path.exists(text_model_path) and os.path.exists(vectorizer_path):
                with open(text_model_path, 'rb') as f:
                    self.text_model = pickle.load(f)
                with open(vectorizer_path, 'rb') as f:
                    self.text_vectorizer = pickle.load(f)
                print("Modèle de texte chargé")
                self._init_text_keywords()
            else:
                print("Modèle de texte non trouvé, utilisation du modèle par défaut")
                self._create_default_text_model()
                
        except Exception as e:
            print(f"Erreur lors du chargement des modèles: {e}")
            self._create_default_image_model()
            self._create_default_text_model()
    
    def _create_default_image_model(self):
        base_model = keras.applications.MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        self.image_model = keras.Sequential([
            base_model,
            keras.layers.GlobalAveragePooling2D(),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(len(self.categories), activation='softmax')
        ])
        
        self.image_model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        print("Modèle d'images par défaut créé")
    
    def _init_text_keywords(self):
        self.text_keywords = {
            0: ["plastique", "bouteille", "sac", "emballage", "pet", "polystyrène", "sachet"],
            1: ["verre", "bouteille verre", "pot", "bocal", "vitre"],
            2: ["papier", "carton", "journal", "magazine", "boîte carton", "enveloppe"],
            3: ["métal", "aluminium", "conserve", "canette", "fer", "acier"],
            4: ["organique", "compost", "fruit", "légume", "épluchure", "reste", "nourriture"],
            5: ["autre", "déchet", "inconnu"]
        }
    
    def _create_default_text_model(self):
        self._init_text_keywords()
    
    def predict_image(self, image_array: np.ndarray) -> Dict:
        try:
            if len(image_array.shape) == 3:
                image_array = np.expand_dims(image_array, axis=0)
            predictions = self.image_model.predict(image_array, verbose=0)
            category_id = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][category_id])
            
            return {
                "category_id": category_id,
                "confidence": confidence,
                "all_predictions": {
                    self.categories[i]: float(predictions[0][i]) 
                    for i in range(len(self.categories))
                }
            }
        except Exception as e:
            print(f"Erreur lors de la prédiction d'image: {e}")
            return {
                "category_id": 5,  # Autre
                "confidence": 0.5,
                "all_predictions": {}
            }
    
    def predict_text(self, text: str) -> Dict:
        try:
            if self.text_model is not None and self.text_vectorizer is not None:
                try:
                    text_vec = self.text_vectorizer.transform([text])
                    prediction = self.text_model.predict(text_vec)[0]
                    proba = self.text_model.predict_proba(text_vec)[0]
                    
                    # Mapping de l'ordre du modèle vers l'ordre de l'API
                    text_model_to_api = {
                        0: 5,
                        1: 0,
                        2: 4,
                        3: 1,
                        4: 2,
                        5: 3
                    }
                    
                    category_id = text_model_to_api[int(prediction)]
                    confidence = float(proba[prediction])
                    
                    return {
                        "category_id": category_id,
                        "confidence": confidence,
                        "all_predictions": {
                            self.categories[text_model_to_api[i]]: float(proba[i]) 
                            for i in range(len(proba))
                        }
                    }
                except Exception as e:
                    print(f"Erreur lors de la prédiction avec le modèle ML: {e}, utilisation du fallback")
            
            if not hasattr(self, 'text_keywords') or self.text_keywords is None:
                self._init_text_keywords()
            
            text_lower = text.lower()
            scores = {i: 0 for i in range(len(self.categories))}
            
            for category_id, keywords in self.text_keywords.items():
                for keyword in keywords:
                    if keyword in text_lower:
                        scores[category_id] += 1
            
            if max(scores.values()) > 0:
                category_id = max(scores, key=scores.get)
                confidence = min(scores[category_id] * 0.2 + 0.5, 0.95)
            else:
                category_id = 5
                confidence = 0.3
            
            return {
                "category_id": category_id,
                "confidence": confidence,
                "matched_keywords": scores
            }
        except Exception as e:
            print(f"Erreur lors de la prédiction de texte: {e}")
            return {
                "category_id": 5,
                "confidence": 0.3,
                "matched_keywords": {}
            }
    
    def get_category_name(self, category_id: int) -> str:
        if 0 <= category_id < len(self.categories):
            return self.categories[category_id]
        return "Autre"