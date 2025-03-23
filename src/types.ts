// Choice represents a user decision
export interface Choice {
  text: string;
  nextPage?: string; // Used in direct Page format
  targetId?: string | null; // Used in flow-based format
}

// Page represents a single story screen
export interface Page {
  id: string;
  type?: string;
  title?: string;
  content: string;
  choices?: Choice[]; // Used in direct Page format
  decisions?: Choice[]; // Used in flow-based format
  images?: string[];
  pageNumber?: string;
  isEnding?: boolean;
  endingType?: 'bad' | 'good' | 'best';
  position?: { x: number; y: number }; // For node positioning in editor
}

// Connection represents a link between story pages
export interface Connection {
  sourceId: string;
  targetId: string;
  sourceHandle?: number;
}

// StoryData represents the complete story structure
export interface StoryData {
  nodes: Page[];
  connections: Connection[];
}

// GameState represents the player's current progress
export interface GameState {
  currentPage: string;
  history: string[];
}

// Project represents a story project in the database
export interface Project {
  id: string;
  title: string;
  folder_id: string;
  background_url: string;
  story_data: StoryData;
  created_at: string;
  user_id?: string;
}