import React, { useState, useEffect } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Use custom hooks to handle data and navigation
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    history,
    setHistory,
    error: dataError
  } = useStoryData(storyData);
  
  const {
    imageIndex,
    fadeIn,
    isNavigating,
    handleChoice,
    handleGoBack,
    handleRestart,
    scrollToStory
  } = useStoryNavigation(pages, currentPageId, setCurrentPageId, history, setHistory);

  // Set up global error handler to catch any navigation errors
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      // Log to original console.error
      originalConsoleError(...args);
      
      // Set error message for UI display
      const errorString = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setErrorMessage(prev => 
        prev ? `${prev}\n${errorString}` : errorString
      );
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const toggleDebugMode = () => setDebugMode(!debugMode);

  // Display any errors that we've accumulated
  const combinedError = dataError || errorMessage;
  if (combinedError) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-red-900/20 border border-red-900/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-300 mb-4">Error</h2>
          <pre className="text-red-200 whitespace-pre-wrap overflow-auto max-h-96">
            {combinedError}
          </pre>
          {onExit && (
            <button 
              onClick={onExit}
              className="mt-6 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-600"
            >
              Back
            </button>
          )}
        </div>
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
      {/* Loading overlay during navigation */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-black/80 p-4 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 border-t-2 border-amber-500 rounded-full animate-spin"></div>
            <span className="text-amber-300">Navigating...</span>
          </div>
        </div>
      )}
      
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
            pages={pages}
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