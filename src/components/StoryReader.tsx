import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, ArrowLeft, ChevronDown } from 'lucide-react';
import { Page, StoryData } from '../types';

interface StoryReaderProps {
  storyData: StoryData;
  onExit?: () => void;
  backgroundImage?: string;
  title?: string;
}

export function StoryReader({ 
  storyData, 
  onExit, 
  backgroundImage = '', 
  title = 'Interactive Story' 
}: StoryReaderProps) {
  const [pages, setPages] = useState<Record<string, Page>>({});
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  // Process story data on mount
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
        
        // Handle decisions/choices field variations
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
      
      // Log all nodes for debugging
      storyData.nodes.forEach(node => {
        console.log(`Node: ${node.id}, Title: ${node.title}, Type: ${node.type}, PageNumber: ${node.pageNumber}`);
      });
    } catch (err: any) {
      console.error('Error processing story data:', err);
      setError(err.message || 'Failed to process story data');
    }
  }, [storyData]);

  const handleChoice = (targetId: string | null) => {
    if (targetId && pages[targetId]) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentPageId(targetId);
        setHistory(prev => [...prev, targetId]);
        setImageIndex(0); // Reset image index on page change
        setFadeIn(true);
        
        // Scroll to story content
        const storyContent = document.getElementById('story-content');
        if (storyContent) {
          storyContent.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      setFadeIn(false);
      setTimeout(() => {
        const newHistory = [...history];
        newHistory.pop(); // Remove current page
        const prevPageId = newHistory[newHistory.length - 1];
        setCurrentPageId(prevPageId);
        setHistory(newHistory);
        setImageIndex(0);
        setFadeIn(true);
      }, 300);
    }
  };

  const handleRestart = () => {
    // Find starting node again - prioritize page with pageNumber "1"
    const pageWithNumber1 = Object.values(pages).find(page => page.pageNumber === '1');
    const introNode = Object.values(pages).find(page => page.type === 'intro');
    const firstNode = Object.values(pages)[0];
    
    const startNode = pageWithNumber1 || introNode || firstNode;
    
    setFadeIn(false);
    setTimeout(() => {
      setCurrentPageId(startNode.id);
      setHistory([startNode.id]);
      setImageIndex(0);
      setFadeIn(true);
    }, 300);
  };

  const handleImageChange = () => {
    const currentPageObj = pages[currentPageId];
    if (currentPageObj?.images && currentPageObj.images.length > 1) {
      setImageIndex((prevIndex) => (prevIndex + 1) % currentPageObj.images.length);
    }
  };

  const scrollToStory = () => {
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
      storyContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  // If there's an error, display it
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        {onExit && (
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-600"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  // If no current page yet, show loading
  const currentPageObj = pages[currentPageId];
  if (!currentPageObj) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getEndingStyle = () => {
    if (currentPageObj.type === 'badEnding' || currentPageObj.endingType === 'bad') {
      return 'bg-red-950/30 border-red-900/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]';
    } else if (currentPageObj.type === 'goodEnding' || currentPageObj.endingType === 'good') {
      return 'bg-blue-950/30 border-blue-900/50 shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]';
    } else if (currentPageObj.type === 'bestEnding' || currentPageObj.endingType === 'best') {
      return 'bg-amber-950/30 border-amber-900/50 shadow-[inset_0_0_30px_rgba(245,158,11,0.2)]';
    }
    return 'bg-gray-900/30 border-gray-800/50 shadow-[inset_0_0_30px_rgba(255,255,255,0.03)]';
  };

  const isEnding = currentPageObj.isEnding || 
    ['badEnding', 'goodEnding', 'bestEnding'].includes(currentPageObj.type || '');

  const getEndingLabel = () => {
    if (currentPageObj.type === 'badEnding' || currentPageObj.endingType === 'bad') {
      return 'Bad Ending';
    } else if (currentPageObj.type === 'goodEnding' || currentPageObj.endingType === 'good') {
      return 'Good Ending';
    } else if (currentPageObj.type === 'bestEnding' || currentPageObj.endingType === 'best') {
      return 'Best Ending';
    }
    return '';
  };

  return (
    <div 
      className="min-h-screen bg-no-repeat bg-cover bg-fixed bg-center text-white"
      style={{
        backgroundImage: backgroundImage ? 
          `linear-gradient(to bottom, rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.95)), url(${backgroundImage})` :
          'none',
        backgroundColor: !backgroundImage ? '#111827' : undefined
      }}
    >
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative">
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {onExit && (
            <button 
              onClick={onExit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit
            </button>
          )}
          
          <button 
            onClick={toggleDebugMode}
            className="px-3 py-1 bg-purple-900/80 hover:bg-purple-800/80 rounded-lg text-white text-xs"
          >
            {debugMode ? "Hide Debug" : "Debug"}
          </button>
        </div>
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </button>
        </div>
        
        {debugMode && (
          <div className="absolute top-16 left-4 right-4 bg-gray-800/90 p-4 rounded-lg mb-4 text-xs overflow-auto max-h-72 z-10">
            <h3 className="font-bold text-amber-300 mb-2">Debug Information</h3>
            <p>Current Node ID: {currentPageId}</p>
            <p>Node Type: {currentPageObj.type}</p>
            <p>Title: {currentPageObj.title}</p>
            <p>Page Number: {currentPageObj.pageNumber || 'None'}</p>
            <p>Content Excerpt: {(currentPageObj.content || "").substring(0, 100)}...</p>
            <p>Decisions: {JSON.stringify(currentPageObj.decisions?.map(d => ({ text: d.text })))}</p>
            <p>Image Count: {currentPageObj.images?.length || 0}</p>
            <p>History: {JSON.stringify(history)}</p>
            
            <h4 className="font-bold text-amber-300 mt-4 mb-2">All Pages (first 5):</h4>
            <ul className="space-y-1">
              {Object.values(pages).slice(0, 5).map(page => (
                <li key={page.id} className="text-xs">
                  {page.id} - {page.title} - Type: {page.type} - PageNum: {page.pageNumber || 'None'}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto z-0">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-amber-200">
            {title}
          </h1>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-amber-100/90">
            {currentPageObj.title || ""}
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-amber-100/80 mb-10">
              Navigate through the story by making choices that affect the outcome. Your decisions will shape the narrative.
            </p>
          </div>
          
          <button
            onClick={scrollToStory}
            className="mt-8 flex flex-col items-center text-amber-300 hover:text-amber-200 transition-colors"
          >
            <span className="mb-2">Begin Reading</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>
      
      {/* Story Content Section */}
      <div id="story-content" className="min-h-screen bg-gray-900/80 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-2/3 w-full">
              <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`relative p-8 rounded-xl border backdrop-blur-sm ${getEndingStyle()}`}>
                  {isEnding && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-medium border bg-black/80 backdrop-blur-sm">
                      {getEndingLabel()}
                    </div>
                  )}
                  
                  {currentPageObj.title && (
                    <h2 className="text-xl font-semibold text-amber-300 mb-4">{currentPageObj.title}</h2>
                  )}
                  
                  <div className="prose prose-invert prose-amber max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-line text-amber-100/90">
                      {currentPageObj.content || "No content available for this page"}
                    </p>
                  </div>

                  {isEnding ? (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleRestart}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/30 rounded-lg text-amber-200 font-medium transition duration-300"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Start Over
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-4">
                      {currentPageObj.decisions && currentPageObj.decisions
                        .filter(choice => choice.text && choice.text !== 'N/A')
                        .map((choice, index) => (
                          <button
                            key={index}
                            onClick={() => handleChoice(choice.targetId || null)}
                            disabled={!choice.targetId}
                            className={`w-full text-left px-6 py-4 bg-gray-900/40 hover:bg-gray-900/60 border border-gray-800/30 rounded-lg text-amber-100/90 transition duration-300 flex items-center gap-3 group ${!choice.targetId ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <ChevronRight className="w-5 h-5 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                            <span>{choice.text}</span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Navigation controls */}
                  <div className="mt-8 flex justify-between">
                    <button 
                      onClick={handleGoBack} 
                      disabled={history.length <= 1}
                      className={`px-4 py-2 rounded-lg ${history.length <= 1 ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-amber-400 hover:text-amber-300'}`}
                    >
                      ← Previous Page
                    </button>
                    
                    <div className="text-sm text-amber-400/70">
                      Page {currentPageObj.pageNumber || history.length} of {Object.keys(pages).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 w-full sticky top-8">
              {currentPageObj.images && currentPageObj.images.length > 0 ? (
                <div 
                  className="relative overflow-hidden rounded-lg border border-gray-800 shadow-lg cursor-pointer aspect-[3/4]" 
                  onClick={handleImageChange}
                >
                  <img 
                    src={currentPageObj.images[imageIndex]} 
                    alt={`Scene from ${currentPageObj.title || 'the story'}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {currentPageObj.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {imageIndex + 1}/{currentPageObj.images.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-800 rounded-lg bg-gray-900/50">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}