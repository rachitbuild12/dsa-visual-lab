import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, PracticeQuestion, Achievement, UnitId } from '../types';
import confetti from 'canvas-confetti';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Completed your very first DSA lesson!',
    icon: '🚀',
    condition: 'Complete 1 lesson',
    xpReward: 50,
  },
  {
    id: 'pointer-beginner',
    title: 'Pointer Beginner',
    description: 'Mastered dynamic memory & singly linked list concepts.',
    icon: '🎯',
    condition: 'Complete Linked List lessons',
    xpReward: 100,
  },
  {
    id: 'stack-master',
    title: 'Stack Master',
    description: 'Understood LIFO, push/pop, and postfix expression evaluation.',
    icon: '🥞',
    condition: 'Complete Stack lessons',
    xpReward: 100,
  },
  {
    id: 'recursion-explorer',
    title: 'Recursion Explorer',
    description: 'Traced recursive call stacks and solved Tower of Hanoi.',
    icon: '🔄',
    condition: 'Complete Recursion lessons',
    xpReward: 120,
  },
  {
    id: 'tree-traversal-pro',
    title: 'Tree Traversal Pro',
    description: 'Conquered BST operations and Inorder/Preorder/Postorder traversals.',
    icon: '🌲',
    condition: 'Complete Tree lessons',
    xpReward: 150,
  },
  {
    id: 'graph-explorer',
    title: 'Graph Explorer',
    description: 'Navigated BFS, DFS, Dijkstra, and Minimum Spanning Trees.',
    icon: '🕸️',
    condition: 'Complete Graph lessons',
    xpReward: 150,
  },
  {
    id: 'quiz-whiz',
    title: 'Quiz Whiz',
    description: 'Answered 10 practice questions correctly.',
    icon: '⚡',
    condition: 'Answer 10 practice questions correctly',
    xpReward: 100,
  },
  {
    id: 'exam-ready',
    title: 'Exam Ready',
    description: 'Attempted a full mock test and scored 70% or higher.',
    icon: '🏆',
    condition: 'Score >= 70% in any Mock Test',
    xpReward: 250,
  },
];

interface ProgressContextType {
  progress: UserProgress;
  theme: 'dark' | 'light';
  hinglish: boolean;
  beginnerMode: boolean;
  toggleTheme: () => void;
  toggleHinglish: () => void;
  toggleBeginnerMode: () => void;
  markLessonComplete: (lessonId: string) => void;
  recordQuizAttempt: (attempt: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: any;
    unit: UnitId;
    topicId: string;
  }) => void;
  addXP: (amount: number, reason?: string) => void;
  resetProgress: () => void;
  toggleBookmark: (lessonId: string) => void;
  saveNote: (lessonId: string, note: string) => void;
  weakTopics: { unit: UnitId; topicId: string; incorrectCount: number; totalAttempts: number }[];
  recentlyUnlockedBadge: Achievement | null;
  dismissBadgeNotification: () => void;
}

const STORAGE_KEY = 'dsa_visual_lab_progress_v1';
const SETTINGS_KEY = 'dsa_visual_lab_settings_v1';

const getInitialProgress = (): UserProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read progress from localStorage', e);
  }

  const today = new Date().toISOString().split('T')[0];
  return {
    completedLessons: [],
    quizAttempts: [],
    xp: 0,
    streak: 1,
    lastActiveDate: today,
    unlockedAchievements: [],
    bookmarkedLessons: [],
    notes: {},
  };
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved).theme || 'dark';
      }
    } catch {}
    return 'dark';
  });

  const [hinglish, setHinglish] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return !!JSON.parse(saved).hinglish;
      }
    } catch {}
    return false;
  });

  const [beginnerMode, setBeginnerMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved).beginnerMode ?? true;
      }
    } catch {}
    return true; // default true for first/second year students!
  });

  const [recentlyUnlockedBadge, setRecentlyUnlockedBadge] = useState<Achievement | null>(null);

  // Sync theme to document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, hinglish, beginnerMode }));
    } catch {}
  }, [theme, hinglish, beginnerMode]);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Streak verification on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.lastActiveDate;
    if (lastActive && lastActive !== today) {
      const lastDate = new Date(lastActive);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        setProgress((prev) => ({
          ...prev,
          streak: prev.streak + 1,
          lastActiveDate: today,
        }));
      } else if (diffDays > 1) {
        // Friendly streak reset
        setProgress((prev) => ({
          ...prev,
          streak: 1,
          lastActiveDate: today,
        }));
      }
    }
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'],
      });
    } catch (e) {}
  };

  const checkUnlockAchievement = (achId: string) => {
    if (!progress.unlockedAchievements.includes(achId)) {
      const ach = ALL_ACHIEVEMENTS.find((a) => a.id === achId);
      if (ach) {
        setRecentlyUnlockedBadge(ach);
        triggerCelebration();
        setProgress((prev) => ({
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, achId],
          xp: prev.xp + ach.xpReward,
        }));
      }
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const updated = [...progress.completedLessons, lessonId];
      setProgress((prev) => ({
        ...prev,
        completedLessons: updated,
        xp: prev.xp + 40,
      }));

      // Check achievements
      if (updated.length >= 1) checkUnlockAchievement('first-step');
      if (lessonId.startsWith('linked-list')) checkUnlockAchievement('pointer-beginner');
      if (lessonId.startsWith('stack')) checkUnlockAchievement('stack-master');
      if (lessonId.startsWith('recursion')) checkUnlockAchievement('recursion-explorer');
      if (lessonId.startsWith('tree')) checkUnlockAchievement('tree-traversal-pro');
      if (lessonId.startsWith('graph')) checkUnlockAchievement('graph-explorer');
    }
  };

  const recordQuizAttempt = (attempt: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: any;
    unit: UnitId;
    topicId: string;
  }) => {
    const newAttempt = {
      ...attempt,
      timestamp: Date.now(),
    };

    setProgress((prev) => {
      const updatedAttempts = [...prev.quizAttempts, newAttempt];
      const xpGain = attempt.isCorrect ? 15 : 5; // encouraging XP even on learning from mistakes!
      
      const correctCount = updatedAttempts.filter((a) => a.isCorrect).length;
      if (correctCount >= 10) {
        setTimeout(() => checkUnlockAchievement('quiz-whiz'), 100);
      }

      return {
        ...prev,
        quizAttempts: updatedAttempts,
        xp: prev.xp + xpGain,
      };
    });
  };

  const addXP = (amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const resetProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const fresh: UserProgress = {
      completedLessons: [],
      quizAttempts: [],
      xp: 0,
      streak: 1,
      lastActiveDate: today,
      unlockedAchievements: [],
      bookmarkedLessons: [],
      notes: {},
    };
    setProgress(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleBookmark = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter((id) => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId],
      };
    });
  };

  const saveNote = (lessonId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: note },
    }));
  };

  // Compute weak topics from actual user quiz answers
  const weakTopics = React.useMemo(() => {
    const topicStats: Record<string, { unit: UnitId; topicId: string; incorrectCount: number; totalAttempts: number }> = {};
    progress.quizAttempts.forEach((attempt) => {
      const key = `${attempt.unit}-${attempt.topicId}`;
      if (!topicStats[key]) {
        topicStats[key] = {
          unit: attempt.unit,
          topicId: attempt.topicId,
          incorrectCount: 0,
          totalAttempts: 0,
        };
      }
      topicStats[key].totalAttempts += 1;
      if (!attempt.isCorrect) {
        topicStats[key].incorrectCount += 1;
      }
    });

    return Object.values(topicStats)
      .filter((stat) => stat.incorrectCount > 0)
      .sort((a, b) => b.incorrectCount / b.totalAttempts - a.incorrectCount / a.totalAttempts);
  }, [progress.quizAttempts]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        theme,
        hinglish,
        beginnerMode,
        toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
        toggleHinglish: () => setHinglish((h) => !h),
        toggleBeginnerMode: () => setBeginnerMode((b) => !b),
        markLessonComplete,
        recordQuizAttempt,
        addXP,
        resetProgress,
        toggleBookmark,
        saveNote,
        weakTopics,
        recentlyUnlockedBadge,
        dismissBadgeNotification: () => setRecentlyUnlockedBadge(null),
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
