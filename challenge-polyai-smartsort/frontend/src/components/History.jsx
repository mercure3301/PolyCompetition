import { Trash2, Image as ImageIcon, Type } from 'lucide-react';

function HistoryList({ history, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucun historique
        </h3>
        <p className="text-gray-500">
          Commencez par classifier des déchets pour voir l'historique ici
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Historique des classifications
        </h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {history.length} {history.length > 1 ? 'éléments' : 'élément'}
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-2 rounded-lg ${
                item.type === 'image' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {item.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                ) : (
                  <Type className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <div className="text-3xl">{item.icon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{item.category}</h4>
                  <span 
                    className="px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                  <span>
                    {item.type === 'image' && item.filename ? item.filename : item.description}
                  </span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleDateString('fr-FR')}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDelete(item._id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;