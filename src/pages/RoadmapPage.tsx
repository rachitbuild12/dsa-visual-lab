import React, { useState } from 'react';
import { AppPage } from '../components/layout/Sidebar';
import { UNITS_DATA } from '../data/units';
import { ALL_LESSONS } from '../data/lessons';
import { useProgress } from '../context/ProgressContext';
import { UnitId } from '../types';
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate, onSelectLesson }) => {
  const { progress } = useProgress();
  const [selectedUnit, setSelectedUnit] = useState<UnitId | 'all'>('all');

  const filteredLessons = selectedUnit === 'all'
    ? ALL_LESSONS
    : ALL_LESSONS.filter((l) => l.unitId === selectedUnit);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">
          Structured Curriculum
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Complete MCS-301 Learning Roadmap
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
          Organized in pedagogical order from asymptotic foundations to minimum spanning trees. Every topic is accessible anytime.
        </p>
      </div>

      {/* Unit Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedUnit('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedUnit === 'all'
              ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
              : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
          }`}
        >
          All 5 Units
        </button>
        {UNITS_DATA.map((unit) => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnit(unit.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedUnit === unit.id
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
            }`}
          >
            Unit {unit.id}: {unit.title.split('—')[1]?.trim() || unit.title}
          </button>
        ))}
      </div>

      {/* Lessons List by Units */}
      <div className="space-y-6">
        {filteredLessons.map((lesson, index) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      Unit {lesson.unitId}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        lesson.category === 'core'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                      }`}
                    >
                      {lesson.category} topic
                    </span>

                    {isCompleted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lesson.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">
                    {lesson.whatIsIt.english}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:self-center pt-2 md:pt-0">
                  <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.readTimeMin} min</span>
                  </div>

                  {lesson.visualizerType && (
                    <button
                      onClick={() => onNavigate('visualizer')}
                      title="Open Interactive Visualizer for this topic"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onNavigate('lesson');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <span>{isCompleted ? 'Revisit Lesson' : 'Start Lesson'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
