
type Step = {
    id: number;
    type: 'intro' | 'comparison' | 'quiz'| 'concept';
    title: string;
    description: string;
    illustration?: string;
    options?: string[];
    correctAnswer?: string;
  };

  interface LevelData {
    lesson: number;
    steps: Step[];
    xp: number;
    title: string;
    badges: string[];
    points: number;
    megaLevel?: int; // Optional field to indicate if this is a mega level
  }