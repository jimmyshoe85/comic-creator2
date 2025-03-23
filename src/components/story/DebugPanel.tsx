import React from 'react';
import { Page } from '../types';

interface DebugPanelProps {
  currentPageId: string;
  currentPage: Page;
  history: string[];
}

export function DebugPanel({ currentPageId, currentPage, history }: DebugPanelProps) {
  return (
    <div className="absolute top-16 left-4 right-4 bg-gray-800/90 p-4 rounded-lg mb-4 text-xs overflow-auto max-h-72 z-10">
      <h3 className="font-bold text-amber-300 mb-2">Debug Information</h3>
      <p>Current Node ID: {currentPageId}</p>
      <p>Node Type: {currentPage.type}</p>
      <p>Title: {currentPage.title}</p>
      <p>Page Number: {currentPage.pageNumber || 'None'}</p>
      <p>Content Excerpt: {(currentPage.content || "").substring(0, 100)}...</p>
      <div className="mt-2">
        <p>Decisions ({currentPage.decisions?.length || 0}):</p>
        {currentPage.decisions?.map((decision, idx) => (
          <p key={idx}>
            {idx}: "{decision.text}" → targetId: {decision.targetId || 'null'}
          </p>
        ))}
      </div>
      <p>Image Count: {currentPage.images?.length || 0}</p>
      <p>History: {history.join(' → ')}</p>
    </div>
  );
}