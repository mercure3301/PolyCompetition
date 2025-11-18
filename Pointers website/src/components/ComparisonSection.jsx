import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, Scale } from 'lucide-react'
import CodeExample from './CodeExample'

const ComparisonSection = () => {
  const [activeTab, setActiveTab] = useState('syntax')

  const comparisonExample = `// POINTEURS
int x = 10;
int* ptr = &x;      // Déclaration avec *
*ptr = 20;          // Déréférencement avec *
ptr = nullptr;      // Peut être nul
ptr = &y;           // Peut être réassigné

// RÉFÉRENCES
int x = 10;
int& ref = x;       // Déclaration avec &
ref = 20;           // Pas de déréférencement
// ref = nullptr;   // ERREUR: ne peut pas être nul
// ref = y;         // ERREUR: ne peut pas être réassignée`

  const functionExample = `// Passage par pointeur
void fonctionPointeur(int* p) {
    if (p != nullptr) {  // Vérification nécessaire
        *p = 100;
    }
}
fonctionPointeur(&x);  // Passage de l'adresse

// Passage par référence
void fonctionReference(int& r) {
    r = 100;  // Pas de vérification nécessaire
}
fonctionReference(x);  // Passage direct`

  const useCases = [
    {
      title: 'Quand utiliser un pointeur',
      items: [
        'Allocation dynamique de mémoire (new/delete)',
        'Tableaux dynamiques',
        'Structures de données complexes (listes chaînées, arbres)',
        'Quand la valeur peut être absente (nullptr)',
        'Quand vous devez réassigner la cible',
        'Interfaçage avec du code C',
      ],
      color: 'primary',
    },
    {
      title: 'Quand utiliser une référence',
      items: [
        'Passage de paramètres à une fonction (recommandé)',
        'Retour de valeurs depuis une fonction',
        'Boucles for basées sur des plages (range-based for)',
        'Surcharge d\'opérateurs',
        'Quand la valeur existe toujours',
        'Code moderne C++ (préféré aux pointeurs quand possible)',
      ],
      color: 'indigo',
    },
  ]

  const comparisonTable = [
    {
      critere: 'Initialisation',
      pointeur: 'Optionnelle (peut être nullptr)',
      reference: 'Obligatoire',
    },
    {
      critere: 'Réassignation',
      pointeur: 'Possible',
      reference: 'Impossible',
    },
    {
      critere: 'Valeur nulle',
      pointeur: 'Oui (nullptr)',
      reference: 'Non',
    },
    {
      critere: 'Déréférencement',
      pointeur: 'Nécessaire (*ptr)',
      reference: 'Automatique',
    },
    {
      critere: 'Adresse',
      pointeur: 'Peut être récupérée (&ptr)',
      reference: 'Même adresse que la variable',
    },
    {
      critere: 'Syntaxe',
      pointeur: 'Plus verbeuse',
      reference: 'Plus simple',
    },
    {
      critere: 'Sécurité',
      pointeur: 'Risque de nullptr',
      reference: 'Plus sûr',
    },
  ]

  return (
    <section id="comparison" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full mb-6">
            <Scale className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comparaison Détaillée
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprendre les différences clés entre pointeurs et références pour
            faire le bon choix
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('syntax')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'syntax'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Syntaxe
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'table'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Tableau Comparatif
            </button>
            <button
              onClick={() => setActiveTab('use')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'use'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Cas d'Usage
            </button>
          </div>
        </div>

        {activeTab === 'syntax' && (
          <div>
            <CodeExample
              code={comparisonExample}
              title="Comparaison de syntaxe"
              explanation="Les pointeurs nécessitent l'opérateur * pour la déclaration et le déréférencement, tandis que les références utilisent & uniquement à la déclaration."
            />
            <CodeExample
              code={functionExample}
              title="Passage dans les fonctions"
              explanation="Les références offrent une syntaxe plus naturelle pour le passage de paramètres, sans besoin de vérifier nullptr."
            />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="section-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">
                    Critère
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-primary-600">
                    Pointeur
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-indigo-600">
                    Référence
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {row.critere}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{row.pointeur}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {row.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'use' && (
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className={`section-card border-l-4 ${
                  useCase.color === 'primary'
                    ? 'border-primary-500'
                    : 'border-indigo-500'
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    useCase.color === 'primary'
                      ? 'text-primary-600'
                      : 'text-indigo-600'
                  }`}
                >
                  {useCase.title}
                </h3>
                <ul className="space-y-3">
                  {useCase.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start space-x-3 text-gray-700"
                    >
                      <div
                        className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          useCase.color === 'primary'
                            ? 'bg-primary-500'
                            : 'bg-indigo-500'
                        }`}
                      ></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ComparisonSection


