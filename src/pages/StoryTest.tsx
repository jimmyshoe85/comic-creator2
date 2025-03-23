import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryReader } from '../components/StoryReader';
import { Upload, Loader2 } from 'lucide-react';
import { StoryData } from '../types';

export function StoryTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        // Check if it has the required structure
        if (!jsonData.nodes || !Array.isArray(jsonData.nodes)) {
          throw new Error('Invalid story format: Missing nodes array');
        }
        if (!jsonData.connections || !Array.isArray(jsonData.connections)) {
          throw new Error('Invalid story format: Missing connections array');
        }
        
        setStoryData(jsonData);
        setTitle(file.name.replace('.json', ''));
      } catch (err: any) {
        console.error('Error parsing JSON:', err);
        setError(err.message || 'Failed to parse JSON file');
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };

  const handleBackgroundUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundUrl(e.target.value);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (storyData) {
    return (
      <StoryReader
        storyData={storyData}
        onExit={() => setStoryData(null)}
        backgroundImage={backgroundUrl}
        title={title}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Story Tester</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter story title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Image URL (optional)
            </label>
            <input
              type="text"
              value={backgroundUrl}
              onChange={handleBackgroundUrlChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Story JSON
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-amber-500 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-sm text-gray-400">
                  {loading ? "Processing..." : "Click to upload story JSON file"}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </label>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleBackToDashboard}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Back to Dashboard"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}