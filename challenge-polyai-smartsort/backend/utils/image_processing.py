import numpy as np
from PIL import Image
from typing import Union

def preprocess_image(image: Union[Image.Image, np.ndarray], target_size=(224, 224)) -> np.ndarray:
    try:
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image = image.resize(target_size, Image.Resampling.LANCZOS)
        image_array = np.array(image)
        image_array = image_array.astype('float32')
        
        return image_array
    
    except Exception as e:
        print(f"Erreur lors du prétraitement de l'image: {e}")
        return np.zeros((*target_size, 3), dtype='float32')

def resize_image(image: Image.Image, max_size: int = 800) -> Image.Image:
    width, height = image.size
    
    if width > max_size or height > max_size:
        if width > height:
            new_width = max_size
            new_height = int((max_size / width) * height)
        else:
            new_height = max_size
            new_width = int((max_size / height) * width)
        
        return image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return image

def augment_image(image: np.ndarray) -> np.ndarray:
    if np.random.random() > 0.5:
        angle = np.random.randint(-30, 30)
        pil_img = Image.fromarray((image * 255).astype(np.uint8))
        pil_img = pil_img.rotate(angle)
        image = np.array(pil_img) / 255.0
    
    if np.random.random() > 0.5:
        image = np.fliplr(image)
    
    if np.random.random() > 0.5:
        factor = np.random.uniform(0.8, 1.2)
        image = np.clip(image * factor, 0, 1)
    
    return image

def validate_image(image: Image.Image) -> bool:
    try:
        width, height = image.size
        if width < 32 or height < 32:
            return False
        
        image.verify()
        
        return True
    except Exception:
        return False