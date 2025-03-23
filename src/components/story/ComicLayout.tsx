import React from 'react';
import { Page } from '../types';
import { ComicPanel } from './ComicPanel';
import { StoryControls } from './StoryControls';

interface ComicLayoutProps {
  currentPage: Page;
  currentPageNumber: string;
  totalPages: number;
  imageIndex: number;
  fadeIn: boolean;
  isEnding: boolean;
  handleChoice: (targetId: string | null) => void;
  handleRestart: () => void;
  hasHistory: boolean;
  handleGoBack: () => void;
}

export function ComicLayout({
  currentPage,
  currentPageNumber,
  totalPages,
  imageIndex,
  fadeIn,
  isEnding,
  handleChoice,
  handleRestart,
  hasHistory,
  handleGoBack
}: ComicLayoutProps) {
  return (
    <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Title Bar */}
      <div className="text-center py-4 border-b border-yellow-900/30">
        <h2 className="text-2xl font-bold text-amber-300">
          {currentPage.title || ""}
        </h2>
      </div>
      
      {/* Comic layout */}
      <div className="comic-layout">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-auto md:grid-rows-2 min-h-screen">
          {/* Top Left Panel */}
          <ComicPanel 
            imageUrl={currentPage.images?.[0]} 
            clipPath="polygon(0 0, 100% 0, 85% 100%, 0 100%)" 
            altText="Scene 1"
          />
          
          {/* Top Right Panel */}
          <ComicPanel 
            imageUrl={currentPage.images?.[1]} 
            fallbackImageUrl={currentPage.images?.[0]} 
            clipPath="polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" 
            altText="Scene 2"
          />
          
          {/* Bottom Left Panel */}
          <ComicPanel 
            imageUrl={currentPage.images?.[2]} 
            fallbackImageUrl={currentPage.images?.[0]} 
            clipPath="polygon(0 0, 100% 0, 100% 100%, 15% 100%)" 
            altText="Scene 3"
          />
          
          {/* Bottom Right Panel - Text and Choices */}
          <div className="relative overflow-hidden bg-white h-96 md:h-auto">
            <div className="absolute inset-0 z-10 text-black p-4 overflow-auto" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
              <div className="h-full flex flex-col">
                {/* Scrollable content area */}
                <div className="flex-grow overflow-auto pr-2">
                  <p className="text-sm leading-tight md:text-base md:leading-normal">
                    {currentPage.content}
                  </p>
                </div>
                
                {/* Page Counter */}
                <div className="text-center text-black text-xs my-2">
                  Page {currentPageNumber} of {totalPages}
                </div>
                
                {/* Choice Buttons */}
                <StoryControls 
                  isEnding={isEnding}
                  decisions={currentPage.decisions || []}
                  handleChoice={handleChoice}
                  handleRestart={handleRestart}
                  hasHistory={hasHistory}
                  handleGoBack={handleGoBack}
                />
              </div>
            </div>
            {/* Border for the panel */}
            <div className="absolute inset-0 border border-gray-800 z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}