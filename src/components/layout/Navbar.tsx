import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Sun, Moon, Search, Flame, Award, Menu, X, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onToggleMobileNav, isMobileNavOpen }) => {
  const { theme, toggleTheme, hinglish, toggleHinglish, beginnerMode, toggleBeginnerMode, progress } = useProgress();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <span className="font-mono font-bold text-sm">DS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  DSA Visual Lab
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  MCS-301
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                See It. Understand It. Code It. Pass It.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search button */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-900 text-slate-400 text-xs hover:border-cyan-500 transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search topics, algorithms, C code (e.g. Inorder, AVL, Queue)...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Gamification Badges, Hinglish/Beginner Toggles, Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Search icon for mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Daily Streak */}
          <div
            title="Daily Learning Streak"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{progress.streak}d</span>
          </div>

          {/* XP Counter */}
          <div
            title="Total Learning XP Points"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono"
          >
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Hinglish Mode Switch */}
          <button
            onClick={toggleHinglish}
            title={hinglish ? 'Switch to Pure English' : 'Switch to Hinglish Explanations'}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              hinglish
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            {hinglish ? '🇮🇳 Hinglish ON' : 'Hinglish'}
          </button>

          {/* Beginner Mode Switch */}
          <button
            onClick={toggleBeginnerMode}
            title={beginnerMode ? 'Beginner Mode ON (Glossary & Simple Steps)' : 'Exam Condensed Mode'}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              beginnerMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Beginner</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
