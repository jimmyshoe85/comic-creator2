import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StoryData } from '../types';
import { StoryReader } from '../components/StoryReader';
import { Loader2 } from 'lucide-react';

export function StoryPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    loadProject();
  }, [folderId]);

  async function loadProject() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('story_data, title, background_url')
        .eq('folder_id', folderId)
        .single();

      if (error) throw error;

      console.log("Loaded project data:", data);
      
      setTitle(data.title || 'Untitled Story');
      setBackgroundImage(data.background_url || '');
      
      // Verify data structure
      if (!data.story_data) {
        throw new Error('No story data found in the project');
      }
      
      if (!data.story_data.nodes || !Array.isArray(data.story_data.nodes)) {
        throw new Error('Invalid story data format: missing nodes array');
      }
      
      console.log(`Story has ${data.story_data.nodes.length} nodes and ${data.story_data.connections?.length || 0} connections`);
      
      // Log a few sample nodes to debug
      if (data.story_data.nodes.length > 0) {
        console.log("First node:", data.story_data.nodes[0]);
      }
      
      setStoryData(data.story_data);
    } catch (err: any) {
      console.error('Error loading project:', err);
      setError(err.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">No story data found</p>
        <button 
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <StoryReader
      storyData={storyData}
      onExit={handleBackToDashboard}
      backgroundImage={backgroundImage}
      title={title}
    />
  );
}