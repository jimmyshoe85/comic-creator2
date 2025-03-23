import React from 'react';
import { Page } from '../types';

interface DebugPanelProps {
  currentPageId: string;
  currentPage: Page;
  history: string[];
  pages?: Record<string, Page>;
}

export function DebugPanel({ 
  currentPageId, 
  currentPage,
  history,
  pages = {}
}: DebugPanelProps) {
  return (
    <div className="absolute top-16 left-4 right-4 bg-gray-800/90 p-4 rounded-lg mb-4 text-xs overflow-auto max-h-72 z-10">
      <h3 className="font-bold text-amber-300 mb-2">Debug Information</h3>
      
      <div className="space-y-1">
        <p>Current Node ID: <span className="text-amber-200">{currentPageId}</span></p>
        <p>Node Type: <span className="text-amber-200">{currentPage.type || 'standard'}</span></p>
        <p>Title: <span className="text-amber-200">{currentPage.title || 'Untitled'}</span></p>
        <p>Page Number: <span className="text-amber-200">{currentPage.pageNumber || 'None'}</span></p>
        <p>Is Ending: <span className="text-amber-200">{currentPage.isEnding ? 'Yes' : 'No'}</span></p>
        
        {currentPage.decisions && currentPage.decisions.length > 0 && (
          <div>
            <p className="text-amber-300 mt-2">Decisions ({currentPage.decisions.length}):</p>
            <ul className="space-y-1 ml-4 mt-1">
              {currentPage.decisions.map((decision, index) => (
                <li key={index} className="flex">
                  <span className="mr-2">{index}:</span>
                  <span className="text-amber-200">"{decision.text}"</span>
                  <span className="text-amber-400 ml-2">→ targetId: {decision.targetId || 'null'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="text-amber-300 mt-2">Navigation History:</p>
        <div className="bg-gray-900/50 p-2 rounded text-amber-200 whitespace-nowrap overflow-x-auto">
          {history.map((id, index) => (
            <span key={id}>
              {index > 0 && ' → '}
              {id}
              {id === currentPageId && ' (current)'}
            </span>
          ))}
        </div>
        
        {pages && Object.keys(pages).length > 0 && (
          <div className="mt-2">
            <p className="text-amber-300">All Pages (showing first 5):</p>
            <ul className="space-y-1 mt-1">
              {Object.values(pages).slice(0, 5).map(page => (
                <li key={page.id} className="text-xs flex items-baseline">
                  <span className={`inline-block w-24 truncate ${page.id === currentPageId ? 'text-amber-400' : 'text-amber-200'}`}>
                    {page.id}
                  </span>
                  <span className="mx-1">-</span>
                  <span className="text-amber-200 mr-2">{page.title || 'Untitled'}</span>
                  <span className="text-gray-400">
                    Type: {page.type || 'standard'}, 
                    PageNum: {page.pageNumber || 'None'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}