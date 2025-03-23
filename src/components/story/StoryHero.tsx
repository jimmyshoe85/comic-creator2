import React from 'react';
import { ChevronDown } from 'lucide-react';

interface StoryHeroProps {
  title: string;
  pageTitle?: string;
  scrollToStory: () => void;
}

export function StoryHero({ title, pageTitle, scrollToStory }: StoryHeroProps) {
  return (
    <div className="max-w-4xl mx-auto z-0">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-amber-200">
        {title}
      </h1>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-amber-100/90">
        {pageTitle || ""}
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
  );
}