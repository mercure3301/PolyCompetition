import requests
import json
from pathlib import Path

API_URL = "http://localhost:8000"

def test_root():
    print("\nTest 1: Endpoint root...")
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200:
            print("Endpoint root OK")
            print(f"Message: {response.json()['message']}")
            return True
        else:
            print(f"Erreur: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Erreur de connexion: {e}")
        print("Vérifiez que le backend est démarré sur http://localhost:8000")
        return False

def test_classify_text():
    print("\n🧪 Test 2: Classification par texte...")
    
    test_cases = [
        ("bouteille en plastique", "Plastique"),
        ("bocal en verre", "Verre"),
        ("journal", "Papier"),
        ("canette", "Métal"),
        ("épluchures", "Organique"),
    ]
    
    success_count = 0
    for text, expected_category in test_cases:
        try:
            response = requests.post(
                f"{API_URL}/api/classify/text",
                data={"description": text}
            )
            
            if response.status_code == 200:
                result = response.json()
                category = result['category']
                confidence = result['confidence']
                
                status = "Good" if category == expected_category else "Bad"
                print(f"   {status} '{text}' → {category} ({confidence:.0%})")
                
                if category == expected_category:
                    success_count += 1
            else:
                print(f"Erreur pour '{text}': {response.status_code}")
        except Exception as e:
            print(f"Erreur pour '{text}': {e}")
    
    print(f"\n   Score: {success_count}/{len(test_cases)} réussis")
    return success_count > 0

def test_history():
    print("\nTest 3: Historique...")
    try:
        response = requests.get(f"{API_URL}/api/history")
        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            print(f"Historique OK - {total} élément(s)")
            return True
        else:
            print(f"Erreur: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Erreur: {e}")
        return False

def test_stats():
    print("\nTest 4: Statistiques...")
    try:
        response = requests.get(f"{API_URL}/api/stats")
        if response.status_code == 200:
            data = response.json()
            total = data.get('total_classifications', 0)
            avg_conf = data.get('average_confidence', 0)
            print(f"Stats OK")
            print(f"Total classifications: {total}")
            print(f"Confiance moyenne: {avg_conf:.0%}")
            return True
        else:
            print(f"Erreur: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Erreur: {e}")
        return False

def test_categories():
    print("\nTest 5: Catégories...")
    try:
        response = requests.get(f"{API_URL}/api/categories")
        if response.status_code == 200:
            categories = response.json()
            print(f"Catégories OK - {len(categories)} catégories:")
            for cat_id, info in categories.items():
                print(f"{info['icon']} {info['name']}")
            return True
        else:
            print(f"Erreur: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Erreur: {e}")
        return False

def run_all_tests():
    print("="*60)
    print(" SmartSort API - Suite de tests")
    print("="*60)
    
    results = []
    
    # Test 1: Root endpoint
    results.append(("Root endpoint", test_root()))
    
    # Test 2: Classification par texte
    results.append(("Classification texte", test_classify_text()))
    
    # Test 3: Historique
    results.append(("Historique", test_history()))
    
    # Test 4: Statistiques
    results.append(("Statistiques", test_stats()))
    
    # Test 5: Catégories
    results.append(("Catégories", test_categories()))
    
    # Résumé
    print("\n" + "="*60)
    print("Résumé des tests")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*60)
    print(f"Score final: {passed}/{total} tests réussis ({passed/total*100:.0f}%)")
    print("="*60)
    
    if passed == total:
        print("\nTous les tests sont réussis ! L'API fonctionne correctement.")
    else:
        print("\nCertains tests ont échoué. Vérifiez les erreurs ci-dessus.")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)