import React, { useState, useMemo } from 'react';
import { Lesson, UnitId, UnitInfo } from '../types';
import { ALL_LESSONS } from '../data/lessons';
import { useProgress } from '../context/ProgressContext';
import { AppPage } from '../components/layout/Sidebar';
import { UNITS } from '../data/units';
import { LinkedListVisualizer } from '../components/visualizers/LinkedListVisualizer';
import { StackVisualizer } from '../components/visualizers/StackVisualizer';
import { QueueVisualizer } from '../components/visualizers/QueueVisualizer';
import { ArrayVisualizer } from '../components/visualizers/ArrayVisualizer';
import { TreeVisualizer } from '../components/visualizers/TreeVisualizer';
import { GraphVisualizer } from '../components/visualizers/GraphVisualizer';
import { SortingVisualizer } from '../components/visualizers/SortingVisualizer';
import { HashingVisualizer } from '../components/visualizers/HashingVisualizer';
import { RecursionVisualizer } from '../components/visualizers/RecursionVisualizer';
import {
  CheckCircle,
  Copy,
  Check,
  Eye,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  ChevronRight,
  ChevronDown,
  Search,
  FileCode2,
  Trophy,
  Code2,
  Menu,
  X,
} from 'lucide-react';

interface LessonDetailPageProps {
  lessonId: string;
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (id: string) => void;
}

export const LessonDetailPage: React.FC<LessonDetailPageProps> = ({
  lessonId,
  onNavigate,
  onSelectLesson,
}) => {
  const { progress, markLessonComplete, hinglish, beginnerMode, toggleBookmark, recordQuizAttempt } = useProgress();
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedQuickAnswer, setSelectedQuickAnswer] = useState<Record<string, number>>({});
  const [showAnswerExplanation, setShowAnswerExplanation] = useState<Record<string, boolean>>({});
  const [syllabusSearch, setSyllabusSearch] = useState<string>('');
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [isMobileSyllabusOpen, setIsMobileSyllabusOpen] = useState<boolean>(false);

  const lesson = ALL_LESSONS.find((l) => l.id === lessonId) || ALL_LESSONS[0];
  const isCompleted = progress.completedLessons.includes(lesson.id);
  const isBookmarked = progress.bookmarkedLessons.includes(lesson.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(lesson.cCode.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleComplete = () => {
    markLessonComplete(lesson.id);
  };

  // Find previous and next lessons
  const currentIndex = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? ALL_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIndex + 1] : null;

  // Toggle unit expansion in syllabus tree
  const toggleUnit = (uId: number) => {
    setExpandedUnits((prev) => ({ ...prev, [uId]: !prev[uId] }));
  };

  // Filter lessons by syllabus search
  const lessonsByUnit = useMemo(() => {
    const map: Record<UnitId, Lesson[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const q = syllabusSearch.toLowerCase().trim();

    ALL_LESSONS.forEach((l) => {
      if (!q || l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q)) {
        map[l.unitId].push(l);
      }
    });

    return map;
  }, [syllabusSearch]);

  const currentUnitInfo = UNITS.find((u: UnitInfo) => u.id === lesson.unitId) || UNITS[0];

  return (
    <div className="py-4 space-y-6">
      {/* Mobile Syllabus Drawer Trigger */}
      <div className="lg:hidden flex items-center justify-between bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
        <button
          onClick={() => setIsMobileSyllabusOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-cyan-500 hover:text-cyan-400"
        >
          <Menu className="w-4 h-4" />
          <span>Syllabus Topics (Unit {lesson.unitId})</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">
          Lesson {currentIndex + 1} of {ALL_LESSONS.length}
        </span>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Syllabus Navigation Tree */}
        <div
          className={`fixed inset-0 z-50 lg:z-10 lg:static bg-black/60 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none lg:block lg:col-span-4 ${
            isMobileSyllabusOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setIsMobileSyllabusOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm lg:w-full h-full lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 bg-white dark:bg-navy-900 border-r lg:border border-slate-200 dark:border-slate-800 rounded-none lg:rounded-2xl p-4 flex flex-col justify-between shadow-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tree Header & Search */}
            <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Syllabus Navigator</span>
                </div>
                <button
                  onClick={() => setIsMobileSyllabusOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={syllabusSearch}
                  onChange={(e) => setSyllabusSearch(e.target.value)}
                  placeholder="Filter lessons..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Tree Units & Topics List */}
            <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1 scrollbar-thin">
              {UNITS.map((unit: UnitInfo) => {
                const unitLessons = lessonsByUnit[unit.id];
                if (unitLessons.length === 0 && syllabusSearch) return null;
                const isExpanded = expandedUnits[unit.id] ?? true;

                return (
                  <div key={unit.id} className="space-y-1">
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{unit.icon}</span>
                        <span className="truncate">Unit {unit.id}: {unit.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-4 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                        {unitLessons.map((l: Lesson) => {
                          const isCurrent = l.id === lesson.id;
                          const isLessonDone = progress.completedLessons.includes(l.id);

                          return (
                            <button
                              key={l.id}
                              onClick={() => {
                                onSelectLesson(l.id);
                                setIsMobileSyllabusOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 ${
                                isCurrent
                                  ? 'bg-cyan-500 text-white font-bold shadow-sm shadow-cyan-500/20'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <div className="truncate flex-1">
                                <div className="truncate">{l.title}</div>
                                <div className={`text-[10px] truncate ${isCurrent ? 'text-cyan-100' : 'text-slate-400'}`}>
                                  {l.readTimeMin} min &bull; {l.category}
                                </div>
                              </div>
                              {isLessonDone && (
                                <CheckCircle
                                  className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                                    isCurrent ? 'text-white' : 'text-emerald-500'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tree Footer Link to Roadmap */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-cyan-500 hover:text-cyan-400 font-semibold"
              >
                Roadmap Overview
              </button>
              <button
                onClick={() => onNavigate('code-library')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                C Library (60+)
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Lesson Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Top Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => onNavigate('roadmap')}
              className="hover:text-cyan-500 transition-colors"
            >
              Roadmap
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
              Unit {lesson.unitId}: {currentUnitInfo.title}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[200px]">
              {lesson.title}
            </span>
          </nav>

          {/* Quick Action Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100/70 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => onNavigate('code-library')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Open in C Library</span>
            </button>

            {lesson.visualizerType && (
              <button
                onClick={() => onNavigate('visualizer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Visualizer</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('playground')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Simulate in Playground</span>
            </button>

            <button
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Practice MCQs</span>
            </button>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  Unit {lesson.unitId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold uppercase font-mono">
                  {lesson.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lesson.readTimeMin} min read</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(lesson.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    isBookmarked
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                      : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark for Revision'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isCompleted ? 'Lesson Completed (+40 XP)' : 'Mark as Complete (+40 XP)'}</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lesson.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {lesson.subtitle}
              </p>
            </div>
          </div>

          {/* 1. What is it? */}
          <section className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                What is it?
              </h3>
              {hinglish && (
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-bold">
                  Hinglish Mode Active
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
              {hinglish ? lesson.whatIsIt.hinglish : lesson.whatIsIt.english}
            </p>

            {/* Beginner Mode Glossary */}
            {beginnerMode && lesson.beginnerGlossary && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Beginner Glossary (Terms Explained Simply)</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {lesson.beginnerGlossary.map((g, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                        {g.term}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {hinglish && g.hinglishExplanation ? g.hinglishExplanation : g.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 2. Imagine this (Analogy) */}
          <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Imagine This: {lesson.analogy.title}</span>
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{hinglish ? lesson.analogy.hinglish : lesson.analogy.english}"
            </p>
          </section>

          {/* 3. See it (Interactive Visualizer Embedded) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>See It: Interactive Visualization</span>
              </h3>
            </div>

            {lesson.visualizerType === 'linked-list' && <LinkedListVisualizer />}
            {lesson.visualizerType === 'stack' && <StackVisualizer />}
            {lesson.visualizerType === 'queue' && <QueueVisualizer />}
            {lesson.visualizerType === 'array' && <ArrayVisualizer />}
            {lesson.visualizerType === 'recursion' && <RecursionVisualizer />}
            {lesson.visualizerType === 'tree' && <TreeVisualizer />}
            {lesson.visualizerType === 'graph' && <GraphVisualizer />}
            {lesson.visualizerType === 'sorting' && <SortingVisualizer />}
            {lesson.visualizerType === 'hashing' && <HashingVisualizer />}
          </section>

          {/* 4 & 5. Algorithm Pseudocode */}
          <section className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                4-5
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Algorithm Pseudocode: {lesson.algorithm.title}
              </h3>
            </div>

            <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono list-decimal pl-5 leading-relaxed">
              {lesson.algorithm.steps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* 6 & 7. Compilable C Implementation & Line Breakdown */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                  6-7
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Complete Compilable C Code &amp; Breakdown
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied C Code!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Code block */}
            <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{lesson.cCode.title}</span>
                <span className="text-emerald-400">Standard C99 / gcc compilable</span>
              </div>
              <pre className="p-5 font-mono text-xs overflow-x-auto leading-6 text-slate-200">
                <code>{lesson.cCode.code}</code>
              </pre>
              {lesson.cCode.expectedOutput && (
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 font-mono text-xs">
                  <span className="text-slate-400 block mb-1 font-sans font-bold">Standard Output:</span>
                  <pre className="text-cyan-400 whitespace-pre">{lesson.cCode.expectedOutput}</pre>
                </div>
              )}
            </div>

            {/* Line-by-Line explanations */}
            {lesson.lineExplanations.length > 0 && (
              <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Crucial Line Operations Explained
                </h4>
                <div className="space-y-3">
                  {lesson.lineExplanations.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl space-y-1">
                      <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        Line {exp.line}: {exp.code}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {exp.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 8. Complexity Analysis */}
          <section className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                8
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Time &amp; Space Complexity Analysis
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Best Time</div>
                <div className="font-mono font-bold text-emerald-500 text-xs mt-1">
                  {lesson.complexity.timeBest}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Time</div>
                <div className="font-mono font-bold text-cyan-500 text-xs mt-1">
                  {lesson.complexity.timeAverage}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Worst Time</div>
                <div className="font-mono font-bold text-rose-500 text-xs mt-1">
                  {lesson.complexity.timeWorst}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Space Overhead</div>
                <div className="font-mono font-bold text-indigo-500 text-xs mt-1">
                  {lesson.complexity.space}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              <strong className="text-slate-900 dark:text-white">Mathematical Reasoning: </strong>
              {hinglish && lesson.complexity.hinglishReasoning
                ? lesson.complexity.hinglishReasoning
                : lesson.complexity.reasoning}
            </p>
          </section>

          {/* 9. Exam Ready Answer (2 & 5 Marks) */}
          <section className="bg-gradient-to-br from-indigo-900/10 via-navy-900/40 to-cyan-900/10 border border-indigo-500/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                9
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Exam Ready Answers (Write This in Your University Answer Sheet)
              </h3>
            </div>

            <div className="space-y-4">
              {lesson.examAnswers.map((ea, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {ea.question}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">
                      {ea.marks} Marks
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {ea.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Common Mistakes & Pitfalls */}
          <section className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                10
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Common Exam Mistakes &amp; How to Avoid Them</span>
              </h3>
            </div>

            <div className="space-y-3">
              {lesson.commonMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-navy-900 border border-rose-200 dark:border-rose-900/40 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="font-bold text-rose-600 dark:text-rose-400">
                    ❌ Mistake: {m.mistake}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    <strong>Why students do it:</strong> {m.whyItHappens}
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ How to fix: {m.howToFix}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11. Test Yourself (Quick Self-Check) */}
          {lesson.quickQuestions.length > 0 && (
            <section className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                  11
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Test Yourself (Quick Check)
                </h3>
              </div>

              <div className="space-y-4">
                {lesson.quickQuestions.map((q) => {
                  const selected = selectedQuickAnswer[q.id];
                  const isAnswered = selected !== undefined;

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 dark:bg-navy-950 rounded-xl space-y-3 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {q.question}
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isThisSelected = selected === oIdx;
                            let btnStyle = 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                            if (isAnswered) {
                              if (oIdx === q.correctAnswer) {
                                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold';
                              } else if (isThisSelected) {
                                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isAnswered}
                                onClick={() => {
                                  setSelectedQuickAnswer((prev) => ({ ...prev, [q.id]: oIdx }));
                                  setShowAnswerExplanation((prev) => ({ ...prev, [q.id]: true }));
                                  recordQuizAttempt({
                                    questionId: q.id,
                                    isCorrect: oIdx === q.correctAnswer,
                                    selectedAnswer: oIdx,
                                    unit: q.unit,
                                    topicId: q.topicId,
                                  });
                                }}
                                className={`p-3 rounded-lg text-left border transition-all ${btnStyle}`}
                              >
                                <span className="font-mono mr-2 font-bold opacity-60">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {showAnswerExplanation[q.id] && (
                        <div className="p-3 bg-slate-900 text-slate-300 rounded-lg border border-slate-800 text-xs">
                          <span className="font-bold text-cyan-400">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Navigation Footer (Previous and Next Lesson) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevLesson ? (
              <button
                onClick={() => {
                  onSelectLesson(prevLesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-cyan-500 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev: {prevLesson.title.split(':')[0]}</span>
              </button>
            ) : (
              <div />
            )}

            {nextLesson && (
              <button
                onClick={() => {
                  onSelectLesson(nextLesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next: {nextLesson.title.split(':')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
