import React from 'react';
import { Page, Choice } from '../types';
import { Scroll, Sparkles } from 'lucide-react';

interface StoryPageProps {
  page: Page;
  onChoice: (choice: Choice) => void;
  onRestart: () => void;
}

export function StoryPage({ page, onChoice, onRestart }: StoryPageProps) {
  const getEndingStyle = () => {
    switch (page.endingType) {
      case 'bad':
        return 'bg-red-950/30 border-red-900/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]';
      case 'good':
        return 'bg-blue-950/30 border-blue-900/50 shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]';
      case 'best':
        return 'bg-amber-950/30 border-amber-900/50 shadow-[inset_0_0_30px_rgba(245,158,11,0.2)]';
      default:
        return 'bg-gray-900/30 border-gray-800/50 shadow-[inset_0_0_30px_rgba(255,255,255,0.03)]';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div 
        className={`relative p-8 rounded-xl border backdrop-blur-sm ${getEndingStyle()}`}
      >
        {page.isEnding && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-medium border bg-black/80 backdrop-blur-sm">
            {page.endingType === 'bad' && 'Bad Ending'}
            {page.endingType === 'good' && 'Good Ending'}
            {page.endingType === 'best' && 'Best Ending'}
          </div>
        )}
        
        <div className="prose prose-invert prose-amber max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-line text-amber-100/90">
            {page.content}
          </p>
        </div>

        {page.isEnding ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/30 rounded-lg text-amber-200 font-medium transition duration-300"
            >
              <Scroll className="w-5 h-5" />
              Start Over
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {page.decisions?.map((choice, index) => (
              <button
                key={index}
                onClick={() => onChoice(choice)}
                className="w-full text-left px-6 py-4 bg-gray-900/40 hover:bg-gray-900/60 border border-gray-800/30 rounded-lg text-amber-100/90 transition duration-300 flex items-center gap-3 group"
              >
                <Sparkles className="w-5 h-5 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}