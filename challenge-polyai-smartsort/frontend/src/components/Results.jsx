import { CheckCircle, AlertCircle } from 'lucide-react';

function Results({ result }) {
  if (!result) return null;

  const getRecyclingInfo = (category) => {
    const info = {
      'Plastique': {
        tip: 'Rincez les emballages avant de les jeter. Compressez les bouteilles pour gagner de l\'espace.',
        bin: 'Bac jaune',
      },
      'Verre': {
        tip: 'Retirez les bouchons et couvercles. Le verre se recycle à l\'infini !',
        bin: 'Conteneur à verre',
      },
      'Papier': {
        tip: 'Gardez le papier sec et propre. Retirez les agrafes et clips.',
        bin: 'Bac bleu',
      },
      'Métal': {
        tip: 'Rincez les boîtes de conserve. Les métaux sont 100% recyclables.',
        bin: 'Bac jaune',
      },
      'Organique': {
        tip: 'Compostez les déchets organiques pour créer un engrais naturel.',
        bin: 'Composteur ou bac brun',
      },
      'Autre': {
        tip: 'Vérifiez les instructions spécifiques de votre municipalité.',
        bin: 'Poubelle générale',
      },
    };

    return info[category] || info['Autre'];
  };

  const info = getRecyclingInfo(result.category);
  const confidencePercent = (result.confidence * 100).toFixed(1);
  const isHighConfidence = result.confidence >= 0.7;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Résultat de la classification</h3>
        {isHighConfidence ? (
          <CheckCircle className="w-8 h-8 text-green-500" />
        ) : (
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        )}
      </div>

      {/* Catégorie principale */}
      <div 
        className="rounded-lg p-6 mb-6"
        style={{ backgroundColor: `${result.color}20`, borderLeft: `4px solid ${result.color}` }}
      >
        <div className="flex items-center space-x-4">
          <div className="text-6xl">{result.icon}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Catégorie identifiée</p>
            <h4 className="text-3xl font-bold text-gray-900">{result.category}</h4>
            <div className="mt-2 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${confidencePercent}%`,
                    backgroundColor: result.color 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {confidencePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de tri */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h5 className="font-semibold text-blue-900 mb-2">🗑️ Bac de tri</h5>
          <p className="text-blue-800">{info.bin}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h5 className="font-semibold text-green-900 mb-2">💡 Conseil</h5>
          <p className="text-green-800">{info.tip}</p>
        </div>
      </div>

      {/* Avertissement si confiance faible */}
      {!isHighConfidence && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800">
              La confiance de cette prédiction est faible. Vérifiez les instructions de tri de votre municipalité.
            </p>
          </div>
        </div>
      )}

      {/* Métadonnées */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Type: {result.type === 'image' ? 'Image' : 'Texte'}</span>
          <span>{new Date(result.timestamp).toLocaleString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}

export default Results;