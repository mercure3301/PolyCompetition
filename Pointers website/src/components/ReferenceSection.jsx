import React from 'react'
import { Link2, CheckCircle, AlertCircle } from 'lucide-react'
import CodeExample from './CodeExample'

const ReferenceSection = () => {
  const referenceExample1 = `int x = 10;
int& ref = x;  // ref est une référence à x

cout << "Valeur de x: " << x << endl;      // 10
cout << "Valeur de ref: " << ref << endl;  // 10

ref = 20;  // Modifie directement x
cout << "Nouvelle valeur de x: " << x << endl;  // 20

// ref et x sont maintenant la même variable
x = 30;
cout << "Valeur de ref: " << ref << endl;  // 30`

  const referenceExample2 = `void modifier(int& r) {
    r = 100;  // Modifie directement la variable originale
}

int main() {
    int nombre = 5;
    modifier(nombre);  // Passe la référence (pas besoin de &)
    cout << nombre << endl;  // Affiche 100
    return 0;
}`

  const referenceExample3 = `int x = 10;
int& ref1 = x;   // OK : référence initialisée
// int& ref2;    // ERREUR : une référence doit être initialisée

int y = 20;
ref1 = y;        // OK : assigne la valeur de y à x (pas la référence)
cout << x << endl;  // 20
cout << ref1 << endl;  // 20

// ref1 référence toujours x, pas y`

  const characteristics = [
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'Doit être initialisée',
      description: 'Une référence doit être initialisée lors de sa déclaration et ne peut pas être réassignée',
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'Ne peut pas être nulle',
      description: 'Une référence doit toujours référencer un objet valide, pas de concept de "référence nulle"',
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'Syntaxe simplifiée',
      description: 'Pas besoin d\'opérateur de déréférencement (*), utilisation comme une variable normale',
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'Plus sûr',
      description: 'Pas de gestion manuelle de la mémoire, moins de risques d\'erreurs',
    },
  ]

  return (
    <section id="references" className="py-20 px-4 bg-white/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <Link2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Les Références
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une référence est un alias pour une variable existante. Elle
            représente la même variable sous un autre nom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {characteristics.map((char, index) => (
            <div
              key={index}
              className="section-card hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
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
            code={referenceExample1}
            title="1. Déclaration et utilisation de base"
            explanation="Une référence est un alias. Quand on modifie ref, on modifie directement x. Il n'y a pas de déréférencement nécessaire."
          />

          <CodeExample
            code={referenceExample2}
            title="2. Passage par référence dans une fonction"
            explanation="Le passage par référence est très naturel en C++. Pas besoin d'utiliser & lors de l'appel, et la syntaxe dans la fonction est identique à une variable normale."
          />

          <CodeExample
            code={referenceExample3}
            title="3. Initialisation obligatoire et réassignation"
            explanation="Une référence doit être initialisée et ne peut pas être réassignée à une autre variable. Si on fait ref1 = y, on assigne la valeur de y à x, pas la référence elle-même."
          />
        </div>

        <div className="section-card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Avantages des références
              </h4>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                <li>
                  Syntaxe plus claire et intuitive que les pointeurs
                </li>
                <li>
                  Pas de risque de pointeur nul (nullptr)
                </li>
                <li>
                  Pas besoin de gestion manuelle de la mémoire
                </li>
                <li>
                  Meilleure performance que le passage par valeur (copie)
                </li>
                <li>
                  Idéal pour le passage de paramètres dans les fonctions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReferenceSection


