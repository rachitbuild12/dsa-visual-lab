export type UnitId = 1 | 2 | 3 | 4 | 5;

export interface UnitInfo {
  id: UnitId;
  title: string;
  subtitle: string;
  description: string;
  topicsCount: number;
  icon: string;
  color: string;
}

export interface BeginnerTerm {
  term: string;
  explanation: string;
  hinglishExplanation?: string;
}

export interface CodeLineExplanation {
  line: number;
  code: string;
  explanation: string;
  pointerDetails?: string;
}

export interface ComplexityInfo {
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  space: string;
  reasoning: string;
  hinglishReasoning?: string;
}

export interface ExamAnswer {
  marks: 2 | 5 | 10;
  question: string;
  answer: string;
  keyPoints: string[];
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'output' | 'fill-blank' | 'trace';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Exam Level';
  codeSnippet?: string;
  unit: UnitId;
  topicId: string;
}

export interface Lesson {
  id: string;
  unitId: UnitId;
  title: string;
  subtitle: string;
  category: 'core' | 'advanced';
  readTimeMin: number;
  visualizerType?: VisualizerType;
  
  // Universal 11-step format
  whatIsIt: {
    english: string;
    hinglish: string;
  };
  beginnerGlossary?: BeginnerTerm[];
  analogy: {
    title: string;
    english: string;
    hinglish: string;
  };
  algorithm: {
    title: string;
    steps: string[];
  };
  cCode: {
    title: string;
    code: string;
    isCompilable: boolean;
    sampleInput?: string;
    expectedOutput?: string;
  };
  lineExplanations: CodeLineExplanation[];
  complexity: ComplexityInfo;
  examAnswers: ExamAnswer[];
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    howToFix: string;
  }[];
  quickQuestions: PracticeQuestion[];
}

export type VisualizerType = 
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'recursion'
  | 'tree'
  | 'graph'
  | 'sorting'
  | 'hashing';

export type ProgramCategory =
  | 'Arrays'
  | 'Searching'
  | 'Sorting'
  | 'Linked Lists'
  | 'Polynomials'
  | 'Hashing'
  | 'Stacks'
  | 'Recursion'
  | 'Queues'
  | 'Trees'
  | 'Heaps'
  | 'Graphs';

export interface CProgram {
  id: string;
  unitId: UnitId;
  topic: string;
  title: string;
  category: ProgramCategory;
  status: 'COMPLETE' | 'PARTIAL' | 'MISSING';
  description: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  timeComplexity: string;
  spaceComplexity: string;
  edgeCases: string[];
  algorithmSteps: string[];
  isStandalone: boolean;
  relatedLessonId?: string;
  relatedVisualizer?: VisualizerType;
}

export interface VisualizerStep {
  description: string;
  hinglishDescription?: string;
  highlightedCodeLine?: number;
  state: any;
  actionType?: 'insert' | 'delete' | 'search' | 'compare' | 'swap' | 'traverse' | 'rotate' | 'push' | 'pop' | 'enqueue' | 'dequeue';
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  quizAttempts: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: any;
    timestamp: number;
    unit: UnitId;
    topicId: string;
  }[];
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  unlockedAchievements: string[]; // achievement ids
  bookmarkedLessons: string[];
  notes: Record<string, string>; // lessonId -> note text
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  xpReward: number;
}

export interface DifferenceItem {
  id: string;
  topicA: string;
  topicB: string;
  unit: UnitId;
  comparisons: {
    aspect: string;
    sideA: string;
    sideB: string;
  }[];
  summary: string;
}

export interface MockTest {
  id: string;
  unitId?: UnitId; // undefined for comprehensive test
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questions: {
    id: string;
    question: string;
    marks: number;
    options: string[];
    correctIndex: number;
    explanation: string;
    topic: string;
  }[];
}
