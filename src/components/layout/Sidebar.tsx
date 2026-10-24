import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  Home,
  LayoutDashboard,
  Map,
  Eye,
  BookOpen,
  Code2,
  FileCode2,
  Trophy,
  GraduationCap,
  LineChart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type AppPage =
  | 'landing'
  | 'dashboard'
  | 'roadmap'
  | 'lesson'
  | 'visualizer'
  | 'code-library'
  | 'playground'
  | 'practice'
  | 'exam-prep'
  | 'analytics';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { progress } = useProgress();

  const navItems: { id: AppPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Syllabus Roadmap (5 Units)', icon: <Map className="w-4 h-4" /> },
    { id: 'lesson', label: 'Concept Learning Page', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'visualizer', label: 'Interactive Visualizer', icon: <Eye className="w-4 h-4" />, badge: 'Core' },
    { id: 'code-library', label: 'C Code Library & Coverage', icon: <FileCode2 className="w-4 h-4" />, badge: '60+ Progs' },
    { id: 'playground', label: 'C Code Playground', icon: <Code2 className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice Arena (MCQs)', icon: <Trophy className="w-4 h-4" /> },
    { id: 'exam-prep', label: 'Exam Prep Center', icon: <GraduationCap className="w-4 h-4" />, badge: 'Pass Fast' },
    { id: 'analytics', label: 'Progress & Weak Topics', icon: <LineChart className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-30 w-64 h-full md:h-[calc(100vh-4rem)] bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Links */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
            Learning Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-cyan-600 text-cyan-100' : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Card: Student Quick Stat */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lessons Completed</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {progress.completedLessons.length} / 12
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (progress.completedLessons.length / 12) * 100)}%` }}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
