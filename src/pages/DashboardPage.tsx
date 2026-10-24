import React from 'react';
import { AppPage } from '../components/layout/Sidebar';
import { useProgress, ALL_ACHIEVEMENTS } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/lessons';
import { UNITS } from '../data/units';
import { UnitId, UnitInfo } from '../types';
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
  FileCode2,
  Eye,
  GraduationCap,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectLesson }) => {
  const { progress, weakTopics } = useProgress();

  const totalLessons = ALL_LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Determine next recommended lesson (first incomplete lesson)
  const nextLesson = ALL_LESSONS.find((l) => !progress.completedLessons.includes(l.id)) || ALL_LESSONS[0];

  const totalQuizzes = progress.quizAttempts.length;
  const correctQuizzes = progress.quizAttempts.filter((q) => q.isCorrect).length;
  const quizAccuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;

  // Calculate unit-wise completion
  const unitProgress = [1, 2, 3, 4, 5].map((uId) => {
    const unitLessons = ALL_LESSONS.filter((l) => l.unitId === uId);
    const unitCompleted = unitLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const unitPercent = unitLessons.length > 0 ? Math.round((unitCompleted / unitLessons.length) * 100) : 0;
    const unitInfo = UNITS.find((u: UnitInfo) => u.id === uId);
    return {
      unitId: uId as UnitId,
      title: unitInfo?.title || `Unit ${uId}`,
      icon: unitInfo?.icon || '📚',
      total: unitLessons.length,
      completed: unitCompleted,
      percent: unitPercent,
    };
  });

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Student Dashboard &bull; MCS-301 DSA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Welcome Back, Scholar! 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              You are on a <span className="text-amber-400 font-bold">{progress.streak}-day streak</span>! Consistent daily practice and visual understanding is the fastest way to master DSA and score top marks in your university exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectLesson(nextLesson.id);
                onNavigate('lesson');
              }}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue: {nextLesson.title.split(':')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Feature Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('visualizer')}
          className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 text-left transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              9 Engines
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Visualizer Lab</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Step-by-step memory animations</div>
        </button>

        <button
          onClick={() => onNavigate('code-library')}
          className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCode2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              60+ Programs
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">C Code Library</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Standalone, compilable C99 programs</div>
        </button>

        <button
          onClick={() => onNavigate('exam-prep')}
          className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              Pass Fast
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Exam Prep Center</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Notes, differences, 2/5/10-marks</div>
        </button>

        <button
          onClick={() => onNavigate('practice')}
          className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              MCQs
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Practice Arena</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Instant feedback &amp; output prediction</div>
        </button>
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
            Earn +40 XP per lesson &amp; +15 XP per correct quiz
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Study Streak</span>
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
            {totalQuizzes === 0 ? 'No quizzes taken yet' : `${totalQuizzes} questions attempted`}
          </div>
        </div>
      </div>

      {/* Unit-Wise Syllabus Progress (Units 1 to 5) */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              <span>Unit-Wise Syllabus Completion</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tracks actual completed lessons across all 5 syllabus modules for MCS-301.
            </p>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-semibold text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
          >
            <span>View Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {unitProgress.map((u) => (
            <div
              key={u.unitId}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {u.icon} Unit {u.unitId}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {u.percent}%
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {u.title}
              </div>
              <div className="w-full bg-slate-200 dark:bg-navy-800 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${u.percent}%` }}
                  className="bg-cyan-500 h-full rounded-full transition-all"
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {u.completed} of {u.total} lessons complete
              </div>
            </div>
          ))}
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
              Targeted Revision Diagnostics
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pinpointed automatically from your practice attempts:
            </p>

            <div className="space-y-2 mt-4">
              {weakTopics.length === 0 ? (
                <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-xl text-xs text-slate-400 text-center italic">
                  No weak topics detected yet! Solve practice problems to generate diagnostic weakness reports.
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
                        {wt.incorrectCount} incorrect out of {wt.totalAttempts} attempts
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('practice')}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] rounded-lg"
                    >
                      Drill Topic
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
