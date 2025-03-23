import { useState, useEffect } from 'react';
import { Page, StoryData } from '../types';

export function useStoryData(storyData: StoryData) {
  const [pages, setPages] = useState<Record<string, Page>>({});
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      console.log("Processing story data...");
      
      // Process nodes into pages
      const pagesMap: Record<string, Page> = {};
      
      if (!storyData || !storyData.nodes || !Array.isArray(storyData.nodes)) {
        throw new Error("Invalid story data structure - missing nodes array");
      }
      
      storyData.nodes.forEach((node) => {
        // Set ending type based on node type
        let isEnding = false;
        let endingType = undefined;
        
        if (node.type === 'badEnding') {
          isEnding = true;
          endingType = 'bad';
        } else if (node.type === 'goodEnding') {
          isEnding = true;
          endingType = 'good';
        } else if (node.type === 'bestEnding') {
          isEnding = true;
          endingType = 'best';
        }
        
        // Handle decisions/choices field variations - THIS IS THE CRITICAL PART
        let decisions = [];
        if (Array.isArray(node.decisions)) {
          decisions = node.decisions.map((decision, idx) => {
            // If the decision already has a targetId, use it
            if (decision.targetId) {
              return decision;
            }
            
            // Otherwise, look for a connection
            const connection = storyData.connections.find(
              conn => conn.sourceId === node.id && 
                    (conn.sourceHandle === undefined || conn.sourceHandle === idx)
            );
            
            return {
              ...decision,
              targetId: connection?.targetId || null
            };
          });
        } else if (Array.isArray(node.choices)) {
          // Handle choice format instead of decisions
          decisions = node.choices.map(choice => ({
            text: choice.text,
            targetId: choice.nextPage || null,
          }));
        }
        
        // Make sure images is always an array
        const images = Array.isArray(node.images) ? node.images : [];
        
        pagesMap[node.id] = {
          ...node,
          decisions,
          images,
          isEnding,
          endingType,
        };
      });
      
      setPages(pagesMap);
      
      // Find starting node - prioritize page with pageNumber "1" over intro type
      const pageWithNumber1 = storyData.nodes.find(node => node.pageNumber === '1');
      const introNode = storyData.nodes.find(node => node.type === 'intro');
      const firstNode = storyData.nodes[0];
      
      // Use the page with number 1 if available, otherwise fall back to intro or first node
      const startNode = pageWithNumber1 || introNode || firstNode;
      
      if (startNode) {
        console.log("Setting starting node:", startNode.id, startNode.title, startNode.type);
        setCurrentPageId(startNode.id);
        setHistory([startNode.id]);
      } else {
        setError('No valid starting node found in the story data');
      }
      
      // Log some debug info
      console.log(`Processed ${Object.keys(pagesMap).length} pages`);
      console.log(`Found ${storyData.connections?.length || 0} connections`);
      
      // Log the first few pages to verify decisions are properly processed
      const sampleKeys = Object.keys(pagesMap).slice(0, 3);
      sampleKeys.forEach(key => {
        const page = pagesMap[key];
        console.log(`Page ${key} (${page.title}) has ${page.decisions?.length || 0} decisions:`);
        page.decisions?.forEach((decision, i) => {
          console.log(`  ${i}: "${decision.text}" -> targetId: ${decision.targetId || 'null'}`);
        });
      });
      
    } catch (err: any) {
      console.error('Error processing story data:', err);
      setError(err.message || 'Failed to process story data');
    }
  }, [storyData]);

  return {
    pages,
    currentPageId,
    setCurrentPageId,
    history,
    setHistory,
    error
  };
}