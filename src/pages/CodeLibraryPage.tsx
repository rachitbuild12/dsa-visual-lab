import React, { useState, useMemo } from 'react';
import { allCPrograms, getCoverageStats, searchCPrograms } from '../data/cPrograms';
import { CProgram, UnitId, ProgramCategory } from '../types';
import {
  FileCode2,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Play,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  Code,
  Clock,
  HardDrive,
  AlertTriangle,
} from 'lucide-react';

interface CodeLibraryPageProps {
  onNavigate?: (page: any) => void;
  onSelectLesson?: (lessonId: string) => void;
}

export const CodeLibraryPage: React.FC<CodeLibraryPageProps> = ({
  onNavigate,
  onSelectLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<UnitId | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory | 'ALL'>('ALL');
  const [activeProgramId, setActiveProgramId] = useState<string>(allCPrograms[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => getCoverageStats(), []);

  // Filter programs based on search, unit, and category
  const filteredPrograms = useMemo(() => {
    let result = searchQuery ? searchCPrograms(searchQuery) : allCPrograms;

    if (selectedUnit !== 'ALL') {
      result = result.filter((p) => p.unitId === selectedUnit);
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedUnit, selectedCategory]);

  const activeProgram = useMemo(() => {
    return allCPrograms.find((p) => p.id === activeProgramId) || filteredPrograms[0] || allCPrograms[0];
  }, [activeProgramId, filteredPrograms]);

  const handleCopyCode = () => {
    if (!activeProgram) return;
    navigator.clipboard.writeText(activeProgram.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories: (ProgramCategory | 'ALL')[] = [
    'ALL',
    'Arrays',
    'Searching',
    'Sorting',
    'Linked Lists',
    'Polynomials',
    'Hashing',
    'Stacks',
    'Queues',
    'Recursion',
    'Trees',
    'Heaps',
    'Graphs',
  ];

  return (
    <div className="space-y-6 py-4">
      {/* Page Title & Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono font-bold uppercase tracking-wider">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>MCS-301 Standalone C Programs &bull; Zero Missing Code</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          C Code Library &amp; Syllabus Coverage
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl mt-1">
          Every algorithm, data structure, and exam question has a complete, standalone C implementation with #include, main(), input/output verification, and step-by-step logic.
        </p>
      </div>

      {/* Coverage Status Bar */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                MCS-301 Syllabus Coverage
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{stats.complete} of {stats.total} Standalone C Implementations Complete</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  100% Compilable
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status breakdown:</span>
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium">
              COMPLETE: {stats.complete}
            </span>
            <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-medium">
              PARTIAL: {stats.partial}
            </span>
            <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 font-medium">
              MISSING: {stats.missing}
            </span>
          </div>
        </div>

        {/* Unit Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {[1, 2, 3, 4, 5].map((u) => {
            const unitStats = stats.byUnit[u as UnitId];
            const isSelected = selectedUnit === u;
            return (
              <button
                key={u}
                onClick={() => setSelectedUnit(isSelected ? 'ALL' : (u as UnitId))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 ring-1 ring-cyan-500'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Unit {u}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {unitStats.complete} Progs
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {u === 1 && 'Arrays & Sorting'}
                  {u === 2 && 'Lists & Hashing'}
                  {u === 3 && 'Stacks & Queues'}
                  {u === 4 && 'Trees & Heaps'}
                  {u === 5 && 'Graphs & Paths'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search C programs by name, algorithm, data structure, or concept..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedUnit('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Program List + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Programs */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <span>SHOWING {filteredPrograms.length} PROGRAMS</span>
            {selectedUnit !== 'ALL' && <span>UNIT {selectedUnit}</span>}
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <Code className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No C programs found matching "{searchQuery}"
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for 'binary search', 'linked list', 'quick sort', or 'dijkstra'.
              </p>
            </div>
          ) : (
            filteredPrograms.map((program) => {
              const isSelected = activeProgram?.id === program.id;
              return (
                <button
                  key={program.id}
                  onClick={() => setActiveProgramId(program.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-slate-900 dark:text-white ring-1 ring-cyan-500/50 shadow-sm'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-navy-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-cyan-400 font-bold">
                      U{program.unitId} &bull; {program.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {program.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mt-2 leading-snug">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-2.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {program.timeComplexity.split(',')[0]}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Active Program Detail Panel */}
        <div className="lg:col-span-7 space-y-4">
          {activeProgram && (
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                      Unit {activeProgram.unitId}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                      {activeProgram.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy C Code</span>
                        </>
                      )}
                    </button>

                    {activeProgram.relatedVisualizer && onNavigate && (
                      <button
                        onClick={() => onNavigate('visualizer')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Interactive Visualizer</span>
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {activeProgram.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {activeProgram.description}
                </p>
              </div>

              {/* Complexity Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Time Complexity</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {activeProgram.timeComplexity}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                    <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Space Complexity</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {activeProgram.spaceComplexity}
                  </div>
                </div>
              </div>

              {/* Algorithm Steps */}
              {activeProgram.algorithmSteps && activeProgram.algorithmSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Step-by-Step Algorithm</span>
                  </h4>
                  <div className="space-y-1.5 bg-slate-50 dark:bg-navy-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    {activeProgram.algorithmSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <span className="font-mono font-bold text-cyan-500 flex-shrink-0 mt-0.5">
                          {idx + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* C Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Complete, Standalone C Code (C99)</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    #include &bull; main() &bull; printf()
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-navy-950">
                  <div className="max-h-[380px] overflow-y-auto p-4 font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
                    <pre className="overflow-x-auto whitespace-pre font-mono">
                      {activeProgram.code}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sample Input & Expected Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Sample Test Input
                  </span>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">
                    {activeProgram.sampleInput}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Expected Output
                  </span>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {activeProgram.expectedOutput}
                  </div>
                </div>
              </div>

              {/* Edge Cases */}
              {activeProgram.edgeCases && activeProgram.edgeCases.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Exam &amp; Edge Cases to Handle</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {activeProgram.edgeCases.map((ec, idx) => (
                      <li key={idx}>{ec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom Quick Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {activeProgram.relatedLessonId && onSelectLesson && (
                    <button
                      onClick={() => onSelectLesson(activeProgram.relatedLessonId!)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Complete Concept Lesson</span>
                    </button>
                  )}
                </div>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('playground')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    <span>Run in C Playground</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
