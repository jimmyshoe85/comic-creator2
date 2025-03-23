import { useState, useRef, useCallback } from 'react';
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
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<number | null>(null);
  
  // Clean up any pending timeouts when component unmounts
  const clearNavigationTimeout = useCallback(() => {
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, []);
  
  const handleChoice = useCallback((targetId: string | null) => {
    console.log("⚡ handleChoice called with targetId:", targetId);
    
    // Prevent multiple navigation attempts
    if (isNavigating) {
      console.log("🛑 Navigation already in progress, ignoring request");
      return;
    }
    
    if (!targetId) {
      console.error("❌ Invalid targetId: null or undefined");
      return;
    }
    
    // Check if target page exists
    if (!pages[targetId]) {
      console.error("❌ Target page not found:", targetId);
      console.log("📋 Available pages:", Object.keys(pages));
      return;
    }
    
    try {
      console.log("✅ Valid target page found:", pages[targetId].id, pages[targetId].title);
      
      // Set navigating flag to prevent multiple navigation attempts
      setIsNavigating(true);
      
      // Disable fade animation for direct navigation
      setFadeIn(false);
      
      // Use a timeout to handle the navigation after fade out
      clearNavigationTimeout();
      navigationTimeoutRef.current = window.setTimeout(() => {
        try {
          // Update state with new page and history
          setCurrentPageId(targetId);
          setHistory(prev => [...prev, targetId]);
          setImageIndex(0);
          
          // Reset fade in after state has been updated
          setFadeIn(true);
          setIsNavigating(false);
          
          // Scroll to story content
          const storyContent = document.getElementById('story-content');
          if (storyContent) {
            storyContent.scrollIntoView({ behavior: 'smooth' });
          }
          
          console.log("✅ Navigation completed successfully to:", targetId);
        } catch (err) {
          console.error("❌ Error during navigation state update:", err);
          setIsNavigating(false);
        }
      }, 300);
    } catch (err) {
      console.error("❌ Error during navigation:", err);
      setIsNavigating(false);
    }
  }, [pages, currentPageId, setCurrentPageId, setHistory, isNavigating, clearNavigationTimeout]);

  const handleGoBack = useCallback(() => {
    if (history.length <= 1 || isNavigating) {
      return;
    }
    
    setIsNavigating(true);
    setFadeIn(false);
    
    clearNavigationTimeout();
    navigationTimeoutRef.current = window.setTimeout(() => {
      try {
        const newHistory = [...history];
        newHistory.pop(); // Remove current page
        const prevPageId = newHistory[newHistory.length - 1];
        
        setCurrentPageId(prevPageId);
        setHistory(newHistory);
        setImageIndex(0);
        setFadeIn(true);
        setIsNavigating(false);
      } catch (err) {
        console.error("❌ Error during back navigation:", err);
        setIsNavigating(false);
      }
    }, 300);
  }, [history, setCurrentPageId, setHistory, isNavigating, clearNavigationTimeout]);

  const handleRestart = useCallback(() => {
    if (isNavigating) {
      return;
    }
    
    // Find starting node again
    const pageWithNumber1 = Object.values(pages).find(page => page.pageNumber === '1');
    const introNode = Object.values(pages).find(page => page.type === 'intro');
    const firstNode = Object.values(pages)[0];
    
    const startNode = pageWithNumber1 || introNode || firstNode;
    
    if (!startNode) {
      console.error("No valid starting page found for restart");
      return;
    }
    
    setIsNavigating(true);
    setFadeIn(false);
    
    clearNavigationTimeout();
    navigationTimeoutRef.current = window.setTimeout(() => {
      try {
        setCurrentPageId(startNode.id);
        setHistory([startNode.id]);
        setImageIndex(0);
        setFadeIn(true);
        setIsNavigating(false);
      } catch (err) {
        console.error("❌ Error during restart:", err);
        setIsNavigating(false);
      }
    }, 300);
  }, [pages, setCurrentPageId, setHistory, isNavigating, clearNavigationTimeout]);

  const handleImageChange = useCallback(() => {
    const currentPage = pages[currentPageId];
    if (currentPage?.images && currentPage.images.length > 1) {
      setImageIndex((prevIndex) => (prevIndex + 1) % currentPage.images.length);
    }
  }, [currentPageId, pages]);

  const scrollToStory = useCallback(() => {
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
      storyContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return {
    imageIndex,
    fadeIn,
    isNavigating,
    handleChoice,
    handleGoBack,
    handleRestart,
    handleImageChange,
    scrollToStory
  };
}