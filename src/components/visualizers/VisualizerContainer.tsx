import React, { useState } from 'react';
import { VisualizerType } from '../../types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { RecursionVisualizer } from './RecursionVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { SortingVisualizer } from './SortingVisualizer';
import { HashingVisualizer } from './HashingVisualizer';

interface VisualizerContainerProps {
  initialType?: VisualizerType;
}

export const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ initialType = 'linked-list' }) => {
  const [currentType, setCurrentType] = useState<VisualizerType>(initialType);

  const visualizerTabs: { id: VisualizerType; label: string; icon: string; unit: string }[] = [
    { id: 'linked-list', label: 'Linked List', icon: '🔗', unit: 'Unit II' },
    { id: 'stack', label: 'Stack (LIFO)', icon: '🥞', unit: 'Unit III' },
    { id: 'queue', label: 'Queue & Circular', icon: '🚶', unit: 'Unit III' },
    { id: 'array', label: 'Array & Search', icon: '📊', unit: 'Unit I' },
    { id: 'recursion', label: 'Recursion & Hanoi', icon: '🔄', unit: 'Unit III' },
    { id: 'tree', label: 'Trees & BST', icon: '🌲', unit: 'Unit IV' },
    { id: 'graph', label: 'Graphs & Dijkstra', icon: '🕸️', unit: 'Unit V' },
    { id: 'sorting', label: 'Sorting Algorithms', icon: '📶', unit: 'Unit I' },
    { id: 'hashing', label: 'Hashing & Probing', icon: '🔑', unit: 'Unit II' },
  ];

  return (
    <div className="space-y-6">
      {/* Visualizer selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {visualizerTabs.map((tab) => {
          const isActive = currentType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentType(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-500'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-cyan-600 text-cyan-100' : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
                }`}
              >
                {tab.unit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render active visualizer */}
      <div>
        {currentType === 'linked-list' && <LinkedListVisualizer />}
        {currentType === 'stack' && <StackVisualizer />}
        {currentType === 'queue' && <QueueVisualizer />}
        {currentType === 'array' && <ArrayVisualizer />}
        {currentType === 'recursion' && <RecursionVisualizer />}
        {currentType === 'tree' && <TreeVisualizer />}
        {currentType === 'graph' && <GraphVisualizer />}
        {currentType === 'sorting' && <SortingVisualizer />}
        {currentType === 'hashing' && <HashingVisualizer />}
      </div>
    </div>
  );
};
