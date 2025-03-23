import { Page, StoryData, Choice } from '../types';

/**
 * Normalizes a story data object to ensure it has all required properties
 * and correct structure regardless of the input format
 */
export function normalizeStoryData(data: any): StoryData {
  // If the data already has nodes and connections, it's in the expected format
  if (data.nodes && data.connections) {
    return data as StoryData;
  }
  
  // Otherwise, try to convert from other formats
  let nodes: any[] = [];
  let connections: any[] = [];
  
  // Check if it's a record of pages (like in story.ts)
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    // Convert from Record<string, Page> format
    const pages = data as Record<string, Page>;
    
    nodes = Object.values(pages).map(page => {
      const node = {
        id: page.id,
        type: page.isEnding ? (page.endingType || 'badEnding') : 'story',
        title: page.title || '',
        content: page.content,
        decisions: page.choices?.map(choice => ({
          text: choice.text,
          // Save nextPage in a temporary property to use for connections
          nextPage: choice.nextPage,
          targetId: null
        })) || [],
        images: page.images || [],
        pageNumber: '',
        isEnding: page.isEnding,
        endingType: page.endingType
      };
      
      return node;
    });
    
    // Create connections based on choices
    nodes.forEach(node => {
      if (node.decisions) {
        node.decisions.forEach((decision: any, index: number) => {
          if (decision.nextPage) {
            // Find target node id
            const targetNode = nodes.find(n => n.id === decision.nextPage);
            if (targetNode) {
              connections.push({
                sourceId: node.id,
                targetId: targetNode.id,
                sourceHandle: index
              });
              
              // Update the decision with the targetId
              decision.targetId = targetNode.id;
            }
            
            // Remove the temporary nextPage property
            delete decision.nextPage;
          }
        });
      }
    });
  }
  
  return {
    nodes,
    connections
  };
}

/**
 * Processes connections in a story to ensure all choices have targetId values
 */
export function processConnections(storyData: StoryData): StoryData {
  const nodes = storyData.nodes.map(node => {
    // Skip if node has no decisions
    if (!node.decisions) return node;
    
    // Update each decision with targetId from connections if not already set
    const decisions = node.decisions.map((decision, index) => {
      if (decision.targetId) return decision;
      
      // Find matching connection
      const connection = storyData.connections.find(
        conn => conn.sourceId === node.id && 
               (conn.sourceHandle === undefined || conn.sourceHandle === index)
      );
      
      return {
        ...decision,
        targetId: connection?.targetId || null
      };
    });
    
    return {
      ...node,
      decisions
    };
  });
  
  return {
    ...storyData,
    nodes
  };
}

/**
 * Finds the appropriate starting page for a story
 */
export function findStartingPage(storyData: StoryData): string {
  // Try different strategies to find a starting page
  const startNode = 
    storyData.nodes.find(node => node.type === 'intro') || 
    storyData.nodes.find(node => node.pageNumber === '1') || 
    storyData.nodes.find(node => node.id.includes('start')) ||
    storyData.nodes[0];
  
  return startNode?.id || '';
}

/**
 * Determines if a node represents an ending
 */
export function isEndingNode(node: any): boolean {
  return (
    node.isEnding === true || 
    node.type === 'badEnding' || 
    node.type === 'goodEnding' || 
    node.type === 'bestEnding' ||
    (node.decisions && node.decisions.length === 0)
  );
}