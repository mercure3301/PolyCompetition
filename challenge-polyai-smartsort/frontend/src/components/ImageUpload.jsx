import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

function ImageUpload({ onClassify, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onClassify(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Classification par Image
      </h2>
      <p className="text-gray-600 mb-6">
        Prenez ou uploadez une photo de votre déchet pour identifier sa catégorie de tri
      </p>

      {!preview ? (
        <div
          className="border-3 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-700 mb-2">
            Glissez une image ici ou cliquez pour sélectionner
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, JPEG jusqu'à 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                loading
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
                'Classifier cette image'
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;