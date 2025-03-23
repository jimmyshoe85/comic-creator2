import React, { useEffect, useState } from 'react';
import { Upload, Plus, Loader2, LogOut, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  folder_id: string;
  background_url: string;
  created_at: string;
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length !== 2) {
      alert('Please select both a JSON file and a background image URL file');
      return;
    }

    setUploading(true);
    try {
      const jsonFile = Array.from(files).find(file => file.name.endsWith('.json'));
      const urlFile = Array.from(files).find(file => !file.name.endsWith('.json'));

      if (!jsonFile || !urlFile) {
        throw new Error('Please select both a JSON file and a text file containing the background image URL');
      }

      // Read JSON file
      const jsonData = await new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            resolve(data);
          } catch (error) {
            reject(new Error('Invalid JSON file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading JSON file'));
        reader.readAsText(jsonFile);
      });

      // Read URL file
      const backgroundUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          resolve(url.trim());
        };
        reader.onerror = () => reject(new Error('Error reading URL file'));
        reader.readAsText(urlFile);
      });

      // Create project record
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          title: jsonData.title || 'Untitled Project',
          folder_id: crypto.randomUUID(),
          background_url: backgroundUrl,
          story_data: jsonData,
          user_id: user?.id
        });

      if (projectError) throw projectError;

      await loadProjects();
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert(error.message || 'Error creating project. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <div className="flex gap-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
              <button
                onClick={() => navigate('/story-test')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg"
              >
                <BookOpen className="w-5 h-5" />
                Test Story JSON
              </button>
            </div>
          </div>
          <label className="relative cursor-pointer">
            <input
              type="file"
              multiple
              accept=".json,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>New Project</span>
            </div>
          </label>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No projects yet. Create your first project by uploading a JSON story file and a text file containing the background image URL.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.folder_id}`)}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={project.background_url}
                  alt={project.title}
                  className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}