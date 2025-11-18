import React from 'react'
import { Pointer, AlertCircle, CheckCircle } from 'lucide-react'
import CodeExample from './CodeExample'

const PointerSection = () => {
  const pointerExample1 = `int x = 10;
int* ptr = &x;  // ptr contient l'adresse de x

cout << "Valeur de x: " << x << endl;        // 10
cout << "Adresse de x: " << &x << endl;      // 0x7fcf5faff6ac
cout << "Valeur de ptr: " << ptr << endl;    // 0x7fcf5faff6ac
cout << "Valeur pointée: " << *ptr << endl;  // 10 (déréférencement)

*ptr = 20;  // Modifie la valeur de x
cout << "Nouvelle valeur de x: " << x << endl;  // 20`

  const pointerExample2 = `void modifier(int* p) {
    *p = 100;  // Modifie la valeur pointée
}

int main() {
    int nombre = 5;
    modifier(&nombre);  // Passe l'adresse
    cout << nombre << endl;  // Affiche 100
    return 0;
}`

  const pointerExample3 = `int* ptr = nullptr;  // Pointeur nul (C++11)
// ou
int* ptr = NULL;     // Pointeur nul (ancien style)

if (ptr != nullptr) {
    *ptr = 10;  // Sécurisé
}

// Allocation dynamique
int* dynamicPtr = new int(42);
// ...utilisation...
delete dynamicPtr;  // Libération mémoire`

  const characteristics = [
    {
      icon: <Pointer className="w-6 h-6" />,
      title: 'Peut être nul',
      description: 'Un pointeur peut pointer vers nullptr, permettant de représenter aucune valeur',
    },
    {
      icon: <Pointer className="w-6 h-6" />,
      title: 'Peut être réassigné',
      description: 'Un pointeur peut pointer vers différentes variables au cours de son existence',
    },
    {
      icon: <Pointer className="w-6 h-6" />,
      title: 'Nécessite le déréférencement',
      description: 'Il faut utiliser l\'opérateur * pour accéder à la valeur pointée',
    },
    {
      icon: <Pointer className="w-6 h-6" />,
      title: 'Gestion manuelle de la mémoire',
      description: 'Avec new/delete, vous devez gérer manuellement l\'allocation et la libération',
    },
  ]

  return (
    <section id="pointers" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Pointer className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Les Pointeurs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un pointeur est une variable qui stocke l'adresse mémoire d'une
            autre variable. Il permet un accès indirect aux données.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {characteristics.map((char, index) => (
            <div
              key={index}
              className="section-card hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {char.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {char.title}
                  </h3>
                  <p className="text-gray-600">{char.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Exemples de Code
          </h3>

          <CodeExample
            code={pointerExample1}
            title="1. Déclaration et utilisation de base"
            explanation="Un pointeur stocke une adresse mémoire. L'opérateur & récupère l'adresse, et l'opérateur * déréférence le pointeur pour accéder à la valeur."
          />

          <CodeExample
            code={pointerExample2}
            title="2. Passage par pointeur dans une fonction"
            explanation="En passant un pointeur à une fonction, on peut modifier la valeur de la variable originale. C'est ce qu'on appelle le passage par adresse."
          />

          <CodeExample
            code={pointerExample3}
            title="3. Pointeurs nuls et allocation dynamique"
            explanation="Les pointeurs peuvent être nuls (nullptr) et permettent l'allocation dynamique de mémoire avec new/delete. Attention à la gestion de la mémoire!"
          />
        </div>

        <div className="section-card bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-amber-900 mb-2">
                Attention !!!!
              </h4>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                <li>
                  Toujours vérifier qu'un pointeur n'est pas nullptr avant de le
                  déréférencer
                </li>
                <li>
                  Ne pas oublier de libérer la mémoire allouée avec delete
                </li>
                <li>
                  Éviter les pointeurs pendants (dangling pointers) après
                  libération
                </li>
                <li>
                  Utiliser des pointeurs intelligents (smart pointers) en C++
                  moderne
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PointerSection


