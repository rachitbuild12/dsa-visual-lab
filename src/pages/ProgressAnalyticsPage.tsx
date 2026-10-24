import React, { useState } from 'react';
import { useProgress, ALL_ACHIEVEMENTS } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/lessons';
import { AppPage } from '../components/layout/Sidebar';
import {
  LineChart,
  CheckCircle,
  AlertTriangle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  ListTodo,
} from 'lucide-react';

interface ProgressAnalyticsPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (id: string) => void;
}

export const ProgressAnalyticsPage: React.FC<ProgressAnalyticsPageProps> = ({
  onNavigate,
  onSelectLesson,
}) => {
  const { progress, weakTopics, resetProgress } = useProgress();
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('dsa_revision_checklist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'check-1': false,
      'check-2': false,
      'check-3': false,
      'check-4': false,
      'check-5': false,
      'check-6': false,
    };
  });

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('dsa_revision_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const completedCount = progress.completedLessons.length;
  const totalLessons = ALL_LESSONS.length;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">
            Performance Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Progress &amp; Diagnostics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking of syllabus mastery, error patterns, and personalized revision checklist.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your learning progress and quiz history?')) {
              resetProgress();
            }
          }}
          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Syllabus Completion
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-500">
            {Math.round((completedCount / totalLessons) * 100)}%
          </div>
          <p className="text-xs text-slate-500">
            {completedCount} of {totalLessons} syllabus lessons completed
          </p>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Practice Questions Solved
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-500">
            {progress.quizAttempts.length}
          </div>
          <p className="text-xs text-slate-500">
            {progress.quizAttempts.filter((q) => q.isCorrect).length} correct answers recorded
          </p>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Total XP Points
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-500">
            {progress.xp}
          </div>
          <p className="text-xs text-slate-500">
            {progress.unlockedAchievements.length} achievements unlocked
          </p>
        </div>
      </div>

      {/* Weak Topics Analysis */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Targeted Weak Topics Diagnostic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated automatically from your mistakes in the Practice Arena. Revisit these topics before university examinations:
            </p>
          </div>
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-navy-950 rounded-xl">
            🎉 Excellent work! No recurring weak topics detected yet. Keep testing your skills in the Practice Arena.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakTopics.map((wt, idx) => (
              <div
                key={idx}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-rose-500 px-2 py-0.5 bg-rose-500/10 rounded">
                    Unit {wt.unit}
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-1">
                    {wt.topicId}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {wt.incorrectCount} mistakes ({Math.round((wt.incorrectCount / wt.totalAttempts) * 100)}% error rate)
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('practice')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  Practice Topic
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generated Revision Checklist */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personalized University Exam Revision Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check off core milestones as you prepare for your final examination:
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { id: 'check-1', title: 'Row-Major & Column-Major address formulas memorized & practiced with numericals' },
            { id: 'check-2', title: 'Singly Linked list insert/delete at beginning and end written in C without notes' },
            { id: 'check-3', title: 'Postfix evaluation with stack trace table practiced (remember operand pop order)' },
            { id: 'check-4', title: 'Circular queue full condition (rear + 1) % MAX == front and wraparound code revised' },
            { id: 'check-5', title: 'Binary Search Tree 3 deletion cases (leaf, 1-child, inorder successor) diagrammed' },
            { id: 'check-6', title: 'Dijkstra shortest path and Prim vs Kruskal MST comparison table reviewed' },
          ].map((item) => {
            const isChecked = checklist[item.id] || false;
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-400 dark:border-slate-600'
                  }`}
                >
                  {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs ${isChecked ? 'line-through opacity-80' : 'font-medium'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
