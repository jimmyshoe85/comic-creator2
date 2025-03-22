import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Page, StoryData } from '../types';
import { StoryPage as StoryPageComponent } from '../components/StoryPage';

export function StoryPage() {
  const { folderId } = useParams();
  const [pages, setPages] = useState<Record<string, Page>>({});
  const [currentPage, setCurrentPage] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadProject();
  }, [folderId]);

  async function loadProject() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('story_data')
        .eq('folder_id', folderId)
        .single();

      if (error) throw error;

      const storyData: StoryData = data.story_data;
      
      // Convert nodes array to a map for easier access
      const pagesMap: Record<string, Page> = {};
      storyData.nodes.forEach(node => {
        // Set ending type based on node type
        if (node.type === 'badEnding') {
          node.isEnding = true;
          node.endingType = 'bad';
        } else if (node.type === 'goodEnding') {
          node.isEnding = true;
          node.endingType = 'good';
        } else if (node.type === 'bestEnding') {
          node.isEnding = true;
          node.endingType = 'best';
        }
        
        // Add connections to decisions
        const nodeConnections = storyData.connections.filter(conn => conn.sourceId === node.id);
        node.decisions = node.decisions.map((decision, index) => ({
          ...decision,
          targetId: nodeConnections[index]?.targetId || null
        }));
        
        pagesMap[node.id] = node;
      });

      setPages(pagesMap);
      // Find the first node (usually has type 'intro' or similar)
      const startNode = storyData.nodes.find(node => node.type === 'intro') || storyData.nodes[0];
      setCurrentPage(startNode.id);
      setHistory([startNode.id]);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  }

  const handleChoice = (choice: Choice) => {
    if (choice.targetId) {
      setCurrentPage(choice.targetId);
      setHistory(prev => [...prev, choice.targetId]);
    }
  };

  const handleRestart = () => {
    const startNode = Object.values(pages).find(page => page.type === 'intro') || Object.values(pages)[0];
    setCurrentPage(startNode.id);
    setHistory([startNode.id]);
  };

  if (!pages[currentPage]) {
    return <div>Loading...</div>;
  }

  return (
    <StoryPageComponent
      page={pages[currentPage]}
      onChoice={handleChoice}
      onRestart={handleRestart}
    />
  );
}