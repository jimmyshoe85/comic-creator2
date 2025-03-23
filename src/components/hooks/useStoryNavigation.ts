import { useState } from 'react';
import { Page } from '../types';

export function useStoryNavigation(
  pages: Record<string, Page>,
  currentPageId: string, 
  setCurrentPageId: (id: string) => void,
  history: string[],
  setHistory: (history: string[]) => void
) {
  const [imageIndex, setImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  const handleChoice = (targetId: string | null) => {
    console.log("handleChoice called with targetId:", targetId);
    
    if (targetId && pages[targetId]) {
      console.log("Valid target page found:", pages[targetId].id, pages[targetId].title);
      
      setFadeIn(false);
      setTimeout(() => {
        setCurrentPageId(targetId);
        setHistory(prev => [...prev, targetId]);
        setImageIndex(0);
        setFadeIn(true);
        
        // Scroll to story content
        const storyContent = document.getElementById('story-content');
        if (storyContent) {
          storyContent.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      console.error("Invalid targetId or target page not found:", targetId);
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      setFadeIn(false);
      setTimeout(() => {
        const newHistory = [...history];
        newHistory.pop(); // Remove current page
        const prevPageId = newHistory[newHistory.length - 1];
        setCurrentPageId(prevPageId);
        setHistory(newHistory);
        setImageIndex(0);
        setFadeIn(true);
      }, 300);
    }
  };

  const handleRestart = () => {
    // Find starting node again - prioritize page with pageNumber "1"
    const pageWithNumber1 = Object.values(pages).find(page => page.pageNumber === '1');
    const introNode = Object.values(pages).find(page => page.type === 'intro');
    const firstNode = Object.values(pages)[0];
    
    const startNode = pageWithNumber1 || introNode || firstNode;
    
    if (!startNode) {
      console.error("No valid starting page found for restart");
      return;
    }
    
    setFadeIn(false);
    setTimeout(() => {
      setCurrentPageId(startNode.id);
      setHistory([startNode.id]);
      setImageIndex(0);
      setFadeIn(true);
    }, 300);
  };

  const handleImageChange = () => {
    const currentPage = pages[currentPageId];
    if (currentPage?.images && currentPage.images.length > 1) {
      setImageIndex((prevIndex) => (prevIndex + 1) % currentPage.images.length);
    }
  };

  const scrollToStory = () => {
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
      storyContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    imageIndex,
    setImageIndex,
    fadeIn,
    handleChoice,
    handleGoBack,
    handleRestart,
    handleImageChange,
    scrollToStory
  };
}