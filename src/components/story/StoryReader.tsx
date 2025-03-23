import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { StoryData } from '../types';
import { useStoryData } from '../hooks/useStoryData';
import { useStoryNavigation } from '../hooks/useStoryNavigation';
import { DebugPanel } from "./DebugPanel";
import { ComicLayout } from "./ComicLayout";
import { StoryHero } from "./StoryHero";

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
  const [debugMode, setDebugMode] = useState(false);
  
  // Use custom hooks to handle data and navigation
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    history,
    setHistory,
    error
  } = useStoryData(storyData);
  
  const {
    imageIndex,
    fadeIn,
    handleChoice,
    handleGoBack,
    handleRestart,
    scrollToStory
  } = useStoryNavigation(pages, currentPageId, setCurrentPageId, history, setHistory);

  const toggleDebugMode = () => setDebugMode(!debugMode);

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
  const currentPage = pages[currentPageId];
  if (!currentPage) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get current page number
  const currentPageNumber = currentPage.pageNumber || 
    (Object.keys(pages).indexOf(currentPageId) + 1).toString();
  const totalPages = Object.keys(pages).length;
    
  // Determine if this is an ending page
  const isEnding = currentPage.isEnding || 
    ['badEnding', 'goodEnding', 'bestEnding'].includes(currentPage.type || '');

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
          <DebugPanel 
            currentPageId={currentPageId}
            currentPage={currentPage}
            history={history}
          />
        )}
        
        <StoryHero 
          title={title} 
          pageTitle={currentPage.title} 
          scrollToStory={scrollToStory} 
        />
      </div>
      
      {/* Comic Book Layout */}
      <div id="story-content" className="min-h-screen bg-black">
        <ComicLayout 
          currentPage={currentPage}
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          imageIndex={imageIndex}
          fadeIn={fadeIn}
          isEnding={isEnding}
          handleChoice={handleChoice}
          handleRestart={handleRestart}
          hasHistory={history.length > 1}
          handleGoBack={handleGoBack}
        />
      </div>
    </div>
  );
}