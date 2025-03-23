import React from 'react';

interface ComicPanelProps {
  imageUrl?: string;
  fallbackImageUrl?: string;
  clipPath: string;
  altText?: string;
}

export function ComicPanel({ 
  imageUrl, 
  fallbackImageUrl, 
  clipPath, 
  altText = "Scene" 
}: ComicPanelProps) {
  return (
    <div className="relative overflow-hidden bg-black h-64 md:h-auto">
      <div className="absolute inset-0 z-10" style={{ clipPath }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={altText} 
            className="w-full h-full object-cover"
          />
        ) : fallbackImageUrl ? (
          <img 
            src={fallbackImageUrl} 
            alt={`${altText} (fallback)`} 
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      {/* Border for the panel */}
      <div className="absolute inset-0 border border-gray-800 z-20" style={{ clipPath }}></div>
    </div>
  );
}