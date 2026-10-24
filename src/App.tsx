import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, AppPage } from './components/layout/Sidebar';
import { SearchModal } from './components/layout/SearchModal';
import { AchievementModal } from './components/layout/AchievementModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { PracticeArenaPage } from './pages/PracticeArenaPage';
import { ExamPrepPage } from './pages/ExamPrepPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { CodeLibraryPage } from './pages/CodeLibraryPage';
import { CPlayground } from './components/playground/CPlayground';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [currentLessonId, setCurrentLessonId] = useState<string>('u2-singly-linked-list');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentPage('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
          {currentPage === 'landing' && (
            <LandingPage onNavigate={handleNavigate} onSelectLesson={handleSelectLesson} />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} onSelectLesson={handleSelectLesson} />
          )}

          {currentPage === 'roadmap' && (
            <RoadmapPage onNavigate={handleNavigate} onSelectLesson={handleSelectLesson} />
          )}

          {currentPage === 'lesson' && (
            <LessonDetailPage
              lessonId={currentLessonId}
              onNavigate={handleNavigate}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentPage === 'visualizer' && <VisualizerPage />}

          {currentPage === 'code-library' && (
            <CodeLibraryPage
              onNavigate={handleNavigate}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentPage === 'playground' && (
            <div className="space-y-6 py-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 font-mono">
                  Integrated C Simulation
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  C Code Playground &amp; Step Simulator
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Line-by-line pointer simulation, variable state tracking, and output prediction challenges without external compiler dependencies.
                </p>
              </div>
              <CPlayground />
            </div>
          )}

          {currentPage === 'practice' && <PracticeArenaPage />}

          {currentPage === 'exam-prep' && <ExamPrepPage />}

          {currentPage === 'analytics' && (
            <ProgressAnalyticsPage onNavigate={handleNavigate} onSelectLesson={handleSelectLesson} />
          )}
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
      />

      {/* Achievement Unlock Popup */}
      <AchievementModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>DSA Visual Lab</strong> — "See It. Understand It. Code It. Pass It."
          </span>
          <span>Designed for B.Tech CSE / AIML University Exam Excellence</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <MainApp />
    </ProgressProvider>
  );
}
