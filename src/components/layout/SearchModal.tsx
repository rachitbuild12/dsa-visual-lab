import React, { useState, useEffect } from 'react';
import { ALL_LESSONS } from '../../data/lessons';
import { Search, X, BookOpen, ChevronRight, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectLesson }) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ALL_LESSONS.filter((lesson) => {
    const text = `${lesson.title} ${lesson.subtitle} ${lesson.whatIsIt.english} ${lesson.cCode.title}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any topic, algorithm, or C operation..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching lessons found for "{query}". Try searching for "BST", "Linked List", "Queue", or "Dijkstra".
            </div>
          ) : (
            filtered.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson.id);
                  onClose();
                }}
                className="w-full p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-navy-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase font-mono">
                      Unit {lesson.unitId}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {lesson.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {lesson.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search syllabus for university examinations</span>
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-navy-800 rounded font-mono text-[10px]">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};
