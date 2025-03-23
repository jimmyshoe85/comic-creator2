import React from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Page } from '../../types';

interface ComicLayoutProps {
  currentPage: Page;
  currentPageNumber: string;
  totalPages: number;
  imageIndex: number;
  fadeIn: boolean;
  isEnding: boolean;
  handleChoice: (targetId: string | null) => void;
  handleRestart: () => void;
  handleImageChange?: () => void;
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
  handleImageChange,
  hasHistory,
  handleGoBack
}: ComicLayoutProps) {
  // THIS IS A CRITICAL AREA - Choice Button Handler
  const onChoiceClick = (targetId: string | null) => {
    console.log("🔘 Choice button clicked with targetId:", targetId);
    if (targetId) {
      try {
        handleChoice(targetId);
      } catch (err) {
        console.error("Error in choice handler:", err);
      }
    } else {
      console.warn("Choice clicked but targetId is null or empty");
    }
  };

  // Helper function to get ending styles
  const getEndingStyle = () => {
    if (currentPage.type === 'badEnding' || currentPage.endingType === 'bad') {
      return 'bg-red-950/30 border-red-900/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]';
    } else if (currentPage.type === 'goodEnding' || currentPage.endingType === 'good') {
      return 'bg-blue-950/30 border-blue-900/50 shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]';
    } else if (currentPage.type === 'bestEnding' || currentPage.endingType === 'best') {
      return 'bg-amber-950/30 border-amber-900/50 shadow-[inset_0_0_30px_rgba(245,158,11,0.2)]';
    }
    return 'bg-gray-900/30 border-gray-800/50 shadow-[inset_0_0_30px_rgba(255,255,255,0.03)]';
  };

  // Get ending label text
  const getEndingLabel = () => {
    if (currentPage.type === 'badEnding' || currentPage.endingType === 'bad') {
      return 'Bad Ending';
    } else if (currentPage.type === 'goodEnding' || currentPage.endingType === 'good') {
      return 'Good Ending';
    } else if (currentPage.type === 'bestEnding' || currentPage.endingType === 'best') {
      return 'Best Ending';
    }
    return '';
  };

  // Function to render comic panels with images
  const renderComicPanels = () => {
    // No images case
    if (!currentPage.images || currentPage.images.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No images available for this scene
        </div>
      );
    }

    // Get all available images
    const images = currentPage.images;
    
    // Comic panel styling variants
    const panelStyles = [
      "skew-x-1 rotate-1",
      "skew-x-0 -rotate-1",
      "-skew-x-1 rotate-0.5",
      "skew-x-0.5 -rotate-0.5"
    ];

    // Different grid layouts depending on number of images
    switch (images.length) {
      case 1:
        return (
          <div className="h-full">
            <div className={`h-full overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[0]}`}>
              <img
                src={images[0]}
                alt="Scene"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onClick={handleImageChange}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x800/222/333?text=Image+Not+Available";
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[idx % panelStyles.length]}`}
              >
                <img
                  src={img}
                  alt={`Scene ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onClick={handleImageChange}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/222/333?text=Image+Not+Available";
                  }}
                />
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="h-full grid grid-rows-2 gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className={`overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[0]}`}>
                <img
                  src={images[0]}
                  alt="Scene 1"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onClick={handleImageChange}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/222/333?text=Image+Not+Available";
                  }}
                />
              </div>
              <div className={`overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[1]}`}>
                <img
                  src={images[1]}
                  alt="Scene 2"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onClick={handleImageChange}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/222/333?text=Image+Not+Available";
                  }}
                />
              </div>
            </div>
            <div className={`overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[2]}`}>
              <img
                src={images[2]}
                alt="Scene 3"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onClick={handleImageChange}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/800x400/222/333?text=Image+Not+Available";
                }}
              />
            </div>
          </div>
        );

      default: // 4 or more images
        return (
          <div className="h-full grid grid-cols-2 grid-rows-2 gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className={`overflow-hidden rounded-lg border border-gray-800 shadow-lg transform ${panelStyles[idx % panelStyles.length]}`}
              >
                <img
                  src={img}
                  alt={`Scene ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onClick={handleImageChange}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/222/333?text=Image+Not+Available";
                  }}
                />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Comic Panel Layout - Takes 3 columns on large screens */}
          <div className="lg:col-span-3 aspect-[4/3] bg-black">
            {renderComicPanels()}
          </div>

          {/* Story Text Panel - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className={`relative p-6 rounded-xl border backdrop-blur-sm h-full ${getEndingStyle()}`}>
              {isEnding && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-medium border bg-black/80 backdrop-blur-sm">
                  {getEndingLabel()}
                </div>
              )}
              
              {currentPage.title && (
                <h2 className="text-xl font-semibold text-amber-300 mb-4">{currentPage.title}</h2>
              )}
              
              <div className="prose prose-invert prose-amber max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line text-amber-100/90">
                  {currentPage.content || "No content available for this page"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and Choices Section - Full width */}
        <div className="mt-8">
          {isEnding ? (
            <div className="flex justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/30 rounded-lg text-amber-200 font-medium transition duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPage.decisions && currentPage.decisions
                .filter(choice => choice.text && choice.text !== 'N/A')
                .map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => onChoiceClick(choice.targetId)}
                    disabled={!choice.targetId}
                    className={`text-left px-6 py-4 bg-gray-900/40 hover:bg-gray-900/60 border border-gray-800/30 rounded-lg text-amber-100/90 transition duration-300 flex items-center gap-3 group ${!choice.targetId ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              disabled={!hasHistory}
              className={`px-4 py-2 rounded-lg ${!hasHistory ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-amber-400 hover:text-amber-300'}`}
            >
              ← Previous Page
            </button>
            
            <div className="text-sm text-amber-400/70">
              Page {currentPageNumber} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}