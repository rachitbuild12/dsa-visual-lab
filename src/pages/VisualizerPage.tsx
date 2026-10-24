import React from 'react';
import { VisualizerContainer } from '../components/visualizers/VisualizerContainer';
import { Eye, Sparkles } from 'lucide-react';

export const VisualizerPage: React.FC = () => {
  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Visualization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          DSA Visual Laboratory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
          Control execution step by step. Watch memory allocations, pointer updates, and algorithmic state changes in real time.
        </p>
      </div>

      <VisualizerContainer />
    </div>
  );
};
