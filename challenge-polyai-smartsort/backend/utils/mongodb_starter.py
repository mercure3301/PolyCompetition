import subprocess
import os
import sys
import time
import socket
from pathlib import Path
import platform

def check_mongodb_installed():
    try:
        result = subprocess.run(
            ["mongod", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False

def find_mongodb_path():
    common_paths = [
        r"C:\Program Files\MongoDB\Server\*\bin\mongod.exe",
        r"C:\mongodb\bin\mongod.exe",
        r"C:\Program Files (x86)\MongoDB\Server\*\bin\mongod.exe",
    ]
    
    try:
        if platform.system() == "Windows":
            result = subprocess.run(
                ["where.exe", "mongod"],
                capture_output=True,
                text=True,
                timeout=5,
                shell=True
            )
        else:
            result = subprocess.run(
                ["which", "mongod"],
                capture_output=True,
                text=True,
                timeout=5
            )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip().split('\n')[0]
    except:
        pass
    
    from glob import glob
    for pattern in common_paths:
        matches = glob(pattern)
        if matches:
            return matches[0]
    
    return None

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def start_mongodb(data_dir=None, port=27017):
    if is_port_in_use(port):
        print(f"MongoDB est déjà en cours d'exécution sur le port {port}")
        return None
    
    if data_dir is None:
        backend_dir = Path(__file__).parent.parent
        data_dir = backend_dir / "data" / "mongodb"
    
    data_dir = Path(data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    
    mongod_path = find_mongodb_path()
    
    if mongod_path is None:
        print("MongoDB n'est pas trouvé dans le PATH")
        print("Veuillez installer MongoDB ou l'ajouter au PATH")
        print("Téléchargement: https://www.mongodb.com/try/download/community")
        return None
    
    mongod_args = [
        mongod_path,
        "--dbpath", str(data_dir),
        "--port", str(port),
        "--bind_ip", "127.0.0.1",
        "--logpath", str(data_dir / "mongod.log"),
        "--logappend"
    ]
    
    try:
        if platform.system() == "Windows":
            process = subprocess.Popen(
                mongod_args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                creationflags=subprocess.CREATE_NO_WINDOW
            )
        else:
            process = subprocess.Popen(
                mongod_args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                start_new_session=True
            )
        
        time.sleep(2)
        
        if process.poll() is None:
            if is_port_in_use(port):
                print(f"MongoDB démarré avec succès sur le port {port}")
                print(f"Données stockées dans: {data_dir}")
                return process
            else:
                print("MongoDB n'a pas pu démarrer correctement")
                process.terminate()
                return None
        else:
            stdout, stderr = process.communicate()
            error_msg = stderr.decode() if stderr else stdout.decode()
            print(f"Erreur lors du démarrage de MongoDB: {error_msg[:200]}")
            return None
            
    except Exception as e:
        print(f"Erreur lors du démarrage de MongoDB: {e}")
        return None

def stop_mongodb(process):
    if process:
        try:
            process.terminate()
            process.wait(timeout=5)
            print("MongoDB arrêté")
        except subprocess.TimeoutExpired:
            process.kill()
            print("MongoDB forcé à s'arrêter")
        except Exception as e:
            print(f"Erreur lors de l'arrêt de MongoDB: {e}")

if __name__ == "__main__":
    print("Vérification de l'installation de MongoDB...")
    if check_mongodb_installed():
        print("MongoDB est installé")
        print("Démarrage de MongoDB...")
        process = start_mongodb()
        if process:
            print("MongoDB démarré avec succès!")
            input("Appuyez sur Entrée pour arrêter MongoDB...")
            stop_mongodb(process)
        else:
            print("Impossible de démarrer MongoDB")
    else:
        print("MongoDB n'est pas installé")
        print("Veuillez installer MongoDB depuis: https://www.mongodb.com/try/download/community")

