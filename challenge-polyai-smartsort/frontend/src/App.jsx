import { useState, useEffect } from 'react';
import { Recycle, Image as ImageIcon, Type, History, BarChart3 } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import TextInput from './components/TextInput';
import Results from './components/Results';
import HistoryList from './components/History';
import Stats from './components/Stats';
import api from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleImageClassification = async (file) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.classifyImage(file);
      setResult(data);
      loadHistory();
      loadStats();
    } catch (error) {
      console.error('Erreur de classification:', error);
      alert('Erreur lors de la classification de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const handleTextClassification = async (text) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.classifyText(text);
      setResult(data);
      loadHistory();
      loadStats();
    } catch (error) {
      console.error('Erreur de classification:', error);
      alert('Erreur lors de la classification du texte');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await api.deleteHistoryItem(id);
      loadHistory();
      loadStats();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b-2 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SmartSort</h1>
                <p className="text-sm text-gray-600">Tri intelligent des déchets</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-all ${
              activeTab === 'upload'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Image</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-all ${
              activeTab === 'text'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Type className="w-5 h-5" />
            <span>Texte</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-all ${
              activeTab === 'history'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History className="w-5 h-5" />
            <span>Historique</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-all ${
              activeTab === 'stats'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Stats</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <ImageUpload onClassify={handleImageClassification} loading={loading} />
            {result && <Results result={result} />}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6">
            <TextInput onClassify={handleTextClassification} loading={loading} />
            {result && <Results result={result} />}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryList history={history} onDelete={handleDeleteHistoryItem} />
        )}

        {activeTab === 'stats' && (
          <Stats stats={stats} />
        )}
      </main>

    </div>
  );
}

export default App;