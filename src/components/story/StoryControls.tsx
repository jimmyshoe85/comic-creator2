import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Choice } from '../types';

interface StoryControlsProps {
  isEnding: boolean;
  decisions: Choice[];
  handleChoice: (targetId: string | null) => void;
  handleRestart: () => void;
  hasHistory: boolean;
  handleGoBack: () => void;
}

export function StoryControls({ 
  isEnding, 
  decisions, 
  handleChoice, 
  handleRestart,
  hasHistory,
  handleGoBack
}: StoryControlsProps) {
  return (
    <div className="mt-auto space-y-2">
      {isEnding ? (
        // In StoryControls.tsx
        <button
        key={index}
        onClick={() => {
            console.log(`🔘 Button ${index} clicked: "${choice.text}" -> ${choice.targetId}`);
            handleChoice(choice.targetId);
        }}
        disabled={!choice.targetId}
        className={`w-full px-2 py-1 bg-red-900 hover:bg-red-800 text-white text-sm rounded text-center flex items-center justify-center gap-1 ${!choice.targetId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
        <ChevronRight className="w-4 h-4" />
        <span>{choice.text}</span>
        </button>
      ) : (
        decisions.length > 0 ? (
          decisions
            .filter(choice => choice.text && choice.text !== 'N/A')
            .map((choice, index) => {
              console.log(`Rendering button ${index}: "${choice.text}" -> ${choice.targetId}`);
              return (
                <button
                  key={index}
                  onClick={() => {
                    console.log(`Button clicked: "${choice.text}" -> ${choice.targetId}`);
                    handleChoice(choice.targetId);
                  }}
                  disabled={!choice.targetId}
                  className={`w-full px-2 py-1 bg-red-900 hover:bg-red-800 text-white text-sm rounded text-center flex items-center justify-center gap-1 ${!choice.targetId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>{choice.text}</span>
                </button>
              );
            })
        ) : (
          <p className="text-black text-center text-sm">End of this branch</p>
        )
      )}
      
      {/* Back button */}
      {hasHistory && !isEnding && (
        <button 
          onClick={handleGoBack}
          className="w-full px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded text-center mt-4"
        >
          ← Go Back
        </button>
      )}
    </div>
  );
}