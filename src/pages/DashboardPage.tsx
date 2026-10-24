import React from 'react';
import { AppPage } from '../components/layout/Sidebar';
import { useProgress, ALL_ACHIEVEMENTS } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/lessons';
import {
  Trophy,
  Flame,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectLesson }) => {
  const { progress, weakTopics, resetProgress } = useProgress();

  const totalLessons = ALL_LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Determine next recommended lesson (first incomplete lesson)
  const nextLesson = ALL_LESSONS.find((l) => !progress.completedLessons.includes(l.id)) || ALL_LESSONS[0];

  const totalQuizzes = progress.quizAttempts.length;
  const correctQuizzes = progress.quizAttempts.filter((q) => q.isCorrect).length;
  const quizAccuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Student Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Welcome Back, Scholar! 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              You are on a <span className="text-amber-400 font-bold">{progress.streak}-day streak</span>! Consistent daily practice is the fastest way to crack your university DSA examination.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectLesson(nextLesson.id);
                onNavigate('lesson');
              }}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue: {nextLesson.title.split(':')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Course Progress</span>
            <CheckCircle className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-400">
              ({completedCount}/{totalLessons} lessons)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* Total XP */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Learning XP</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {progress.xp}
            </span>
            <span className="text-xs text-slate-400">XP points</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Earn +40 XP per completed lesson &amp; +15 XP per correct quiz!
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-500">
              {progress.streak}
            </span>
            <span className="text-xs text-slate-400">consecutive days</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Daily goal: 1 lesson + 2 practice questions
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Quiz Accuracy</span>
            <Trophy className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-500">
              {quizAccuracy}%
            </span>
            <span className="text-xs text-slate-400">
              ({correctQuizzes}/{totalQuizzes} correct)
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            {totalQuizzes === 0 ? 'No quizzes taken yet' : `${totalQuizzes} total questions attempted`}
          </div>
        </div>
      </div>

      {/* Main Row: Next Lesson Recommendation & Weak Topics Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Next Lesson Card */}
        <div className="lg:col-span-7 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                Recommended Next Step
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                Unit {nextLesson.unitId}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {nextLesson.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {nextLesson.subtitle}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 line-clamp-3">
              {nextLesson.whatIsIt.english}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{nextLesson.readTimeMin} min read</span>
            </div>
            <button
              onClick={() => {
                onSelectLesson(nextLesson.id);
                onNavigate('lesson');
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Start This Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Identified Weak Topics from Real Answers */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Weak Topics</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Targeted Revision Needed
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Analyzed from your incorrect answers in practice arena and mock tests:
            </p>

            <div className="space-y-2 mt-4">
              {weakTopics.length === 0 ? (
                <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-xl text-xs text-slate-400 text-center italic">
                  No weak topics identified yet! Answer questions in the Practice Arena to unlock your personalized diagnostics.
                </div>
              ) : (
                weakTopics.slice(0, 3).map((wt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-rose-600 dark:text-rose-400 capitalize">
                        {wt.topicId} (Unit {wt.unit})
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {wt.incorrectCount} mistakes out of {wt.totalAttempts} attempts
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('practice')}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] rounded-lg"
                    >
                      Drill
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('practice')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              <span>Take Quiz in Practice Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements Showcase */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Achievement Badges
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Milestones unlocked based on genuine concept mastery and exam practice.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-500">
            {progress.unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                title={`${ach.title}: ${ach.description}`}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-navy-950/60 border-slate-200 dark:border-slate-800/80 opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{ach.icon}</div>
                <div className="text-[11px] font-bold line-clamp-1">{ach.title}</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  +{ach.xpReward} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
