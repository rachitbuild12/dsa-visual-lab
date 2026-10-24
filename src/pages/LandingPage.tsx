import React from 'react';
import { AppPage } from '../components/layout/Sidebar';
import { UNITS_DATA } from '../data/units';
import { useProgress } from '../context/ProgressContext';
import { LinkedListVisualizer } from '../components/visualizers/LinkedListVisualizer';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Eye,
  Code2,
  Trophy,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectLesson }) => {
  const { progress } = useProgress();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for B.Tech CSE / AIML University Exams</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            See It. Understand It.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Code It. Pass It.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Struggling with pointers, recursion, or binary trees? DSA Visual Lab turns abstract concepts into intuitive, interactive animations with complete C implementations, Hinglish explanations, and university exam-ready answers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all group"
            >
              <span>Start Learning Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('exam-prep')}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Exam Preparation Center</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-xs">
            <div>
              <div className="font-extrabold text-cyan-400 text-lg font-mono">5 Units</div>
              <div className="text-slate-400">Complete Syllabus</div>
            </div>
            <div>
              <div className="font-extrabold text-emerald-400 text-lg font-mono">100% C</div>
              <div className="text-slate-400">Compilable Code</div>
            </div>
            <div>
              <div className="font-extrabold text-amber-400 text-lg font-mono">Zero</div>
              <div className="text-slate-400">Assumed Knowledge</div>
            </div>
            <div>
              <div className="font-extrabold text-indigo-400 text-lg font-mono">Hinglish</div>
              <div className="text-slate-400">Dual Mode Audio/Text</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Data Structure Preview Teaser */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
              Interactive Preview
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Try the Pointer Mechanics Engine
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pointer operations fail students more than any other topic. Click the buttons below to see how nodes connect in real time!
            </p>
          </div>
          <button
            onClick={() => onNavigate('visualizer')}
            className="text-xs font-bold text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
          >
            <span>Open Full Visualizer Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Interactive Linked List component embedded right on the landing page */}
        <LinkedListVisualizer />
      </section>

      {/* 5 Units Course Overview Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            University Syllabus Coverage
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Master All 5 MCS-301 Units
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Structured step-by-step from Big-O and Arrays up to Shortest Path Algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNITS_DATA.map((unit) => (
            <div
              key={unit.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    Unit {unit.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {unit.topicsCount} Topics
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {unit.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-cyan-500 flex items-center gap-1 transition-colors"
                >
                  <span>Explore Unit Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Bonus Exam Pass Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-navy-950 border border-indigo-700/50 rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Exam Accelerator
              </span>
              <h3 className="text-lg font-bold text-white">
                "Pass Prep" Last-Minute Path
              </h3>
              <p className="text-xs text-slate-300">
                Limited time before the exam? Access high-frequency 5-mark differences, algorithm proofs, and mock exams designed to maximize your score.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-indigo-800/60">
              <button
                onClick={() => onNavigate('exam-prep')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                Start Last-Minute Revision
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Methodology (Universal 11-step Sequence) */}
      <section className="bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
            Teaching Methodology
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            The Universal 11-Step Learning Sequence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every concept follows this cognitive progression so weak students never feel lost.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { num: '1', title: 'What is it?', desc: 'One plain definition without jargon' },
            { num: '2', title: 'Imagine this', desc: 'Real-world analogies you already know' },
            { num: '3', title: 'See it', desc: 'Interactive step-by-step visualizer' },
            { num: '4', title: 'Understand it', desc: 'Numbered logical explanation' },
            { num: '5', title: 'Write it', desc: 'Clean pseudocode algorithm' },
            { num: '6', title: 'Code it', desc: 'Complete, compilable C implementation' },
            { num: '7', title: 'Understand code', desc: 'Line-by-line pointer breakdown' },
            { num: '8', title: 'Analyze it', desc: 'Best, average, and worst-case Big O' },
            { num: '9', title: 'Exam answer', desc: 'Exact university 2-mark & 5-mark templates' },
          ].map((step) => (
            <div
              key={step.num}
              className="p-4 bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                  {step.num}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {step.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
