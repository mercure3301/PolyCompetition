import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

function TextInput({ onClassify, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onClassify(text.trim());
    }
  };

  const exampleTexts = [
    'bouteille en plastique',
    'bocal en verre',
    'journal',
    'canette de soda',
    'épluchures de légumes',
  ];

  const handleExampleClick = (example) => {
    setText(example);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Classification par Texte
      </h2>
      <p className="text-gray-600 mb-6">
        Décrivez votre déchet en quelques mots pour identifier sa catégorie de tri
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description du déchet
          </label>
          <textarea
            id="description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex: bouteille en plastique, boîte de conserve, papier journal..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows="4"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() || loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
            !text.trim() || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Classification en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Classifier ce texte
            </span>
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Exemples rapides :</p>
        <div className="flex flex-wrap gap-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 rounded-full text-sm transition-colors disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextInput;