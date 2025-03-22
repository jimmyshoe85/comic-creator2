export interface Choice {
  text: string;
  targetId: string | null;
}

export interface Page {
  id: string;
  type: string;
  title: string;
  content: string;
  decisions: Choice[];
  images: string[];
  pageNumber: string;
  isEnding?: boolean;
  endingType?: 'bad' | 'good' | 'best';
}

export interface StoryData {
  nodes: Page[];
  connections: {
    sourceId: string;
    targetId: string;
    sourceHandle: number;
  }[];
}

export interface GameState {
  currentPage: string;
  history: string[];
}