from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, Any, Dict
import os
from dotenv import load_dotenv
import uvicorn
from datetime import datetime
import io
from PIL import Image
import numpy as np
from bson import ObjectId

from models.database import MongoDB
from models.ml_model import WasteClassifier
from utils.image_processing import preprocess_image
from utils.text_processing import preprocess_text
from utils.mongodb_starter import start_mongodb, stop_mongodb, is_port_in_use
import atexit

load_dotenv()

mongodb_process = None
MONGODB_PORT = int(os.getenv("MONGODB_PORT", 27017))

def startup_mongodb():
    global mongodb_process
    print("🚀 Démarrage de MongoDB...")
    mongodb_process = start_mongodb(port=MONGODB_PORT)
    if mongodb_process is None and not is_port_in_use(MONGODB_PORT):
        print(" MongoDB n'a pas pu démarrer. L'application continuera sans base de données.")
    return mongodb_process

def shutdown_mongodb():
    global mongodb_process
    if mongodb_process:
        print(" Arrêt de MongoDB...")
        stop_mongodb(mongodb_process)
        mongodb_process = None

atexit.register(shutdown_mongodb)

app = FastAPI(title="SmartSort API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    global db
    startup_mongodb()
    try:
        import time
        time.sleep(1)
        
        local_uri = f"mongodb://localhost:{MONGODB_PORT}/"
        db = MongoDB(mongodb_uri=local_uri)
        print("Connexion à MongoDB établie")
    except Exception as e:
        print(f"Erreur lors de la connexion à MongoDB: {e}")
        print("L'application continuera sans base de données")
        db = None

@app.on_event("shutdown")
async def shutdown_event():
    shutdown_mongodb()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = WasteClassifier()

db = None

WASTE_CATEGORIES = {
    0: {"name": "Verre", "icon": "🟢", "color": "#10B981"},
    1: {"name": "Métal", "icon": "⚙️", "color": "#6B7280"},
    2: {"name": "Organique", "icon": "🌱", "color": "#22C55E"},
    3: {"name": "Autre", "icon": "⚫", "color": "#1F2937"},
    4: {"name": "Papier", "icon": "📄", "color": "#F59E0B"},
    5: {"name": "Plastique", "icon": "🔵", "color": "#3B82F6"}
}

def serialize_for_json(obj: Any) -> Any:
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: serialize_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_for_json(item) for item in obj]
    elif isinstance(obj, (datetime,)):
        return obj.isoformat()
    else:
        return obj

@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur SmartSort API",
        "version": "1.0.0",
        "endpoints": {
            "classify_image": "/api/classify/image",
            "classify_text": "/api/classify/text",
            "history": "/api/history",
            "stats": "/api/stats"
        }
    }

@app.post("/api/classify/image")
async def classify_image(file: UploadFile = File(...)):
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Le fichier doit être une image")
        
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Le fichier est vide")
        
        image = Image.open(io.BytesIO(contents))
        processed_image = preprocess_image(image)
        
        prediction = classifier.predict_image(processed_image)
        if prediction is None:
            raise HTTPException(status_code=500, detail="Erreur lors de la prédiction: résultat vide")
        
        category_id = int(prediction.get('category_id', 5))
        confidence = float(prediction.get('confidence', 0.0))
        
        category_info = WASTE_CATEGORIES.get(category_id, WASTE_CATEGORIES[5])
        
        result = {
            "type": "image",
            "category": category_info["name"],
            "category_id": category_id,
            "icon": category_info["icon"],
            "color": category_info["color"],
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat(),
            "filename": file.filename
        }
        
        if db:
            try:
                db.save_classification(result)
            except Exception as e:
                print(f"Erreur lors de la sauvegarde en base de données: {e}")
        
        serialized_result = serialize_for_json(result)
        return JSONResponse(content=serialized_result)
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Erreur lors de la classification d'image: {e}")
        print(f"Détails: {error_details}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la classification: {str(e)}")

@app.post("/api/classify/text")
async def classify_text(description: str = Form(...)):
    try:
        if not description or len(description.strip()) == 0:
            raise HTTPException(status_code=400, detail="La description ne peut pas être vide")
        
        processed_text = preprocess_text(description)
        prediction = classifier.predict_text(processed_text)
        if prediction is None:
            raise HTTPException(status_code=500, detail="Erreur lors de la prédiction: résultat vide")
        
        category_id = int(prediction.get('category_id', 5))
        confidence = float(prediction.get('confidence', 0.0))
        
        category_info = WASTE_CATEGORIES.get(category_id, WASTE_CATEGORIES[5])
        
        result = {
            "type": "text",
            "category": category_info["name"],
            "category_id": category_id,
            "icon": category_info["icon"],
            "color": category_info["color"],
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat(),
            "description": description
        }
        
        if db:
            try:
                db.save_classification(result)
            except Exception as e:
                print(f"Erreur lors de la sauvegarde en base de données: {e}")
        
        serialized_result = serialize_for_json(result)
        return JSONResponse(content=serialized_result)
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f" Erreur lors de la classification de texte: {e}")
        print(f" Détails: {error_details}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la classification: {str(e)}")

@app.get("/api/history")
async def get_history(limit: int = 50):
    if db is None:
        raise HTTPException(status_code=503, detail="Base de données non disponible")
    try:
        history = db.get_history(limit=limit)
        result = {"history": history, "total": len(history)}
        serialized_result = serialize_for_json(result)
        return JSONResponse(content=serialized_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération de l'historique: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    if db is None:
        raise HTTPException(status_code=503, detail="Base de données non disponible")
    try:
        stats = db.get_statistics()
        serialized_stats = serialize_for_json(stats)
        return JSONResponse(content=serialized_stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des statistiques: {str(e)}")

@app.delete("/api/history/{item_id}")
async def delete_history_item(item_id: str):
    if db is None:
        raise HTTPException(status_code=503, detail="Base de données non disponible")
    try:
        result = db.delete_classification(item_id)
        if result:
            return JSONResponse(content={"message": "Élément supprimé avec succès"})
        else:
            raise HTTPException(status_code=404, detail="Élément non trouvé")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression: {str(e)}")

@app.get("/api/categories")
async def get_categories():
    return JSONResponse(content=WASTE_CATEGORIES)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)