from pymongo import MongoClient, DESCENDING
from datetime import datetime
import os
from typing import List, Dict, Optional
from bson import ObjectId

class MongoDB:
    def __init__(self, mongodb_uri=None):
        if mongodb_uri is None:
            port = int(os.getenv("MONGODB_PORT", 27017))
            mongodb_uri = f"mongodb://localhost:{port}/"
        
        if "localhost" not in mongodb_uri and "127.0.0.1" not in mongodb_uri:
            port = int(os.getenv("MONGODB_PORT", 27017))
            mongodb_uri = f"mongodb://localhost:{port}/"
            print(f"Utilisation de MongoDB local: {mongodb_uri}")
        
        self.client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        self.db = self.client["smartsort"]
        self.classifications = self.db["classifications"]
        
        try:
            self.client.admin.command('ping')
        except Exception as e:
            raise ConnectionError(f"Impossible de se connecter à MongoDB: {e}")
        
        self.classifications.create_index([("timestamp", DESCENDING)])
        self.classifications.create_index("category_id")
    
    def save_classification(self, classification_data: Dict) -> str:
        try:
            if "timestamp" not in classification_data:
                classification_data["timestamp"] = datetime.utcnow().isoformat()
            
            result = self.classifications.insert_one(classification_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Erreur lors de la sauvegarde: {e}")
            return None
    
    def get_history(self, limit: int = 50) -> List[Dict]:
        try:
            cursor = self.classifications.find().sort("timestamp", DESCENDING).limit(limit)
            history = []
            
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                history.append(doc)
            
            return history
        except Exception as e:
            print(f"Erreur lors de la récupération de l'historique: {e}")
            return []
    
    def get_classification_by_id(self, classification_id: str) -> Optional[Dict]:
        try:
            doc = self.classifications.find_one({"_id": ObjectId(classification_id)})
            if doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except Exception as e:
            print(f"Erreur lors de la récupération: {e}")
            return None
    
    def delete_classification(self, classification_id: str) -> bool:
        try:
            result = self.classifications.delete_one({"_id": ObjectId(classification_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Erreur lors de la suppression: {e}")
            return False
    
    def get_statistics(self) -> Dict:
        try:
            total = self.classifications.count_documents({})
            
            pipeline = [
                {
                    "$group": {
                        "_id": "$category",
                        "count": {"$sum": 1}
                    }
                },
                {
                    "$sort": {"count": -1}
                }
            ]
            
            category_distribution = list(self.classifications.aggregate(pipeline))
            
            type_pipeline = [
                {
                    "$group": {
                        "_id": "$type",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            type_distribution = list(self.classifications.aggregate(type_pipeline))
            
            avg_confidence_pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "avg_confidence": {"$avg": "$confidence"}
                    }
                }
            ]
            
            avg_confidence_result = list(self.classifications.aggregate(avg_confidence_pipeline))
            avg_confidence = avg_confidence_result[0]["avg_confidence"] if avg_confidence_result else 0
            
            return {
                "total_classifications": total,
                "category_distribution": category_distribution,
                "type_distribution": type_distribution,
                "average_confidence": round(avg_confidence, 2)
            }
        except Exception as e:
            print(f"Erreur lors du calcul des statistiques: {e}")
            return {
                "total_classifications": 0,
                "category_distribution": [],
                "type_distribution": [],
                "average_confidence": 0
            }
    
    def clear_history(self) -> bool:
        try:
            self.classifications.delete_many({})
            return True
        except Exception as e:
            print(f"Erreur lors de la suppression de l'historique: {e}")
            return False