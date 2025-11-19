import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import os

IMG_SIZE = (224, 224)
CATEGORIES = ['glass', 'metal', 'organic', 'other', 'paper', 'plastic']

def preprocess_image(image_path):
    img = Image.open(image_path)
    
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
    
    img_array = np.array(img)
    
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def test_model(model_path='models/waste_classifier_image.h5'):
    print("Chargement du modèle...")
    try:
        model = keras.models.load_model(model_path)
        print("Modèle chargé avec succès\n")
    except Exception as e:
        print(f"Erreur lors du chargement du modèle: {e}")
        return
    
    print("Architecture du modèle:")
    model.summary()
    print("\n" + "="*60 + "\n")
    
    for i in range(1, 6):
        image_path = f'test{i}.jpg'
        
        if not os.path.exists(image_path):
            print(f"Image {image_path} non trouvée, ignorée\n")
            continue
        
        print(f"Test de l'image: {image_path}")
        
        try:
            img_array = preprocess_image(image_path)
            print(f"Shape de l'image: {img_array.shape}")
            print(f"Min/Max values: {img_array.min():.2f} / {img_array.max():.2f}")
            
            predictions = model.predict(img_array, verbose=0)
            
            print(f"\nProbabilités pour chaque catégorie:")
            for idx, category in enumerate(CATEGORIES):
                prob = predictions[0][idx] * 100
                bar = "█" * int(prob / 5)
                print(f"   {category:10s}: {prob:5.2f}% {bar}")
            
            predicted_idx = np.argmax(predictions[0])
            confidence = predictions[0][predicted_idx] * 100
            
            print(f"\nPrédiction: {CATEGORIES[predicted_idx].upper()}")
            print(f"Confiance: {confidence:.2f}%")
            print("\n" + "-"*60 + "\n")
            
        except Exception as e:
            print(f"Erreur lors du test: {e}\n")

if __name__ == "__main__":
    print("="*60)
    print(" TEST DU MODÈLE DE CLASSIFICATION D'IMAGES")
    print("="*60 + "\n")
    
    test_model()
    
    print("\nTests terminés!")
