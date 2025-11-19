import { BarChart3, TrendingUp, Image as ImageIcon, Type } from 'lucide-react';

function Stats({ stats }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="w-24 h-24 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune statistique disponible
        </h3>
        <p className="text-gray-500">
          Commencez par classifier des déchets pour voir les statistiques
        </p>
      </div>
    );
  }

  const categoryColors = {
    'Plastique': '#3B82F6',
    'Verre': '#10B981',
    'Papier': '#F59E0B',
    'Métal': '#6B7280',
    'Organique': '#22C55E',
    'Autre': '#1F2937',
  };

  const categoryIcons = {
    'Plastique': '🔵',
    'Verre': '🟢',
    'Papier': '📄',
    'Métal': '⚙️',
    'Organique': '🌱',
    'Autre': '⚫',
  };

  // Trouver le total pour calculer les pourcentages
  const totalCategories = stats.category_distribution.reduce((sum, item) => sum + item.count, 0);

  // Distribution par type
  const imageCount = stats.type_distribution.find(t => t._id === 'image')?.count || 0;
  const textCount = stats.type_distribution.find(t => t._id === 'text')?.count || 0;

  return (
    <div className="space-y-6">
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total classifications */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total</p>
              <p className="text-4xl font-bold">{stats.total_classifications}</p>
              <p className="text-green-100 text-sm mt-1">Classifications</p>
            </div>
            <BarChart3 className="w-12 h-12 text-green-200" />
          </div>
        </div>

        {/* Catégorie la plus prédite */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Catégorie populaire</p>
              {stats.category_distribution.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{categoryIcons[stats.category_distribution[0]._id] || '⚫'}</span>
                    <p className="text-3xl font-bold">{stats.category_distribution[0]._id}</p>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">{stats.category_distribution[0].count} classifications</p>
                </>
              ) : (
                <p className="text-2xl font-bold">Aucune</p>
              )}
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        {/* Répartition image/texte */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Image / Texte</p>
              <p className="text-4xl font-bold">{imageCount} / {textCount}</p>
              <p className="text-purple-100 text-sm mt-1">Classifications</p>
            </div>
            <div className="flex space-x-2">
              <ImageIcon className="w-8 h-8 text-purple-200" />
              <Type className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution par catégorie */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Distribution par catégorie
        </h3>

        {stats.category_distribution.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-4">
            {stats.category_distribution.map((item) => {
              const percentage = ((item.count / totalCategories) * 100).toFixed(1);
              const color = categoryColors[item._id] || '#1F2937';
              const icon = categoryIcons[item._id] || '⚫';

              return (
                <div key={item._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-semibold text-gray-800">{item._id}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{item.count}</span>
                      <span className="text-gray-500 text-sm ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Graphique circulaire visuel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Répartition visuelle
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {stats.category_distribution.map((item) => {
            const percentage = ((item.count / totalCategories) * 100).toFixed(0);
            const color = categoryColors[item._id] || '#1F2937';
            const icon = categoryIcons[item._id] || '⚫';

            return (
              <div
                key={item._id}
                className="flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-shadow"
                style={{ backgroundColor: `${color}20` }}
              >
                <div className="text-4xl mb-2">{icon}</div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{item._id}</p>
                  <p className="text-2xl font-bold" style={{ color }}>{percentage}%</p>
                  <p className="text-sm text-gray-600">{item.count} items</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Stats;