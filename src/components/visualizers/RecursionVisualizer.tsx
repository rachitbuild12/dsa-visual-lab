import React, { useState } from 'react';
import { Play, RotateCcw, ChevronRight, Info } from 'lucide-react';

export const RecursionVisualizer: React.FC = () => {
  const [problemType, setProblemType] = useState<'hanoi' | 'factorial'>('hanoi');

  // Hanoi state
  const [hanoiDisks, setHanoiDisks] = useState<number>(3);
  const [pegs, setPegs] = useState<{ A: number[]; B: number[]; C: number[] }>({
    A: [3, 2, 1],
    B: [],
    C: [],
  });
  const [hanoiStep, setHanoiStep] = useState<number>(0);
  const [hanoiMoves, setHanoiMoves] = useState<{ disk: number; from: 'A' | 'B' | 'C'; to: 'A' | 'B' | 'C' }[]>([]);
  const [isHanoiPlaying, setIsHanoiPlaying] = useState<boolean>(false);

  // Factorial call stack state
  const [factInput, setFactInput] = useState<number>(4);
  const [callStack, setCallStack] = useState<{ frame: string; status: 'calling' | 'returned'; val?: number }[]>([]);
  const [factorialResult, setFactorialResult] = useState<number | null>(null);

  // Compute Tower of Hanoi moves
  const generateHanoiMoves = (n: number, from: 'A' | 'B' | 'C', to: 'A' | 'B' | 'C', aux: 'A' | 'B' | 'C', moves: any[]) => {
    if (n === 1) {
      moves.push({ disk: 1, from, to });
      return;
    }
    generateHanoiMoves(n - 1, from, aux, to, moves);
    moves.push({ disk: n, from, to });
    generateHanoiMoves(n - 1, aux, to, from, moves);
  };

  const startHanoi = () => {
    const moves: { disk: number; from: 'A' | 'B' | 'C'; to: 'A' | 'B' | 'C' }[] = [];
    generateHanoiMoves(hanoiDisks, 'A', 'C', 'B', moves);
    setHanoiMoves(moves);
    setHanoiStep(0);
    setIsHanoiPlaying(true);

    const initialA = [];
    for (let i = hanoiDisks; i >= 1; i--) initialA.push(i);
    let currPegs = { A: [...initialA], B: [], C: [] };
    setPegs(currPegs);

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < moves.length) {
        const move = moves[idx];
        setHanoiStep(idx + 1);

        currPegs = {
          ...currPegs,
          [move.from]: currPegs[move.from].slice(0, -1),
          [move.to]: [...currPegs[move.to], move.disk],
        };
        setPegs({ ...currPegs });
        idx++;
      } else {
        clearInterval(timer);
        setIsHanoiPlaying(false);
      }
    }, 900);
  };

  const resetHanoi = () => {
    setIsHanoiPlaying(false);
    const initialA = [];
    for (let i = hanoiDisks; i >= 1; i--) initialA.push(i);
    setPegs({ A: initialA, B: [], C: [] });
    setHanoiStep(0);
    setHanoiMoves([]);
  };

  // Factorial Animation
  const startFactorial = () => {
    setCallStack([]);
    setFactorialResult(null);

    const frames: { frame: string; status: 'calling' | 'returned'; val?: number }[] = [];
    for (let n = factInput; n >= 1; n--) {
      frames.push({ frame: `factorial(${n})`, status: 'calling' });
    }

    setCallStack([...frames]);

    // Unwinding
    let currentUnwind = 1;
    let accumulated = 1;

    const timer = setInterval(() => {
      if (currentUnwind <= factInput) {
        accumulated *= currentUnwind;
        setCallStack((prev) =>
          prev.map((f, i) =>
            i === prev.length - currentUnwind
              ? { ...f, status: 'returned', val: accumulated }
              : f
          )
        );
        currentUnwind++;
      } else {
        clearInterval(timer);
        setFactorialResult(accumulated);
      }
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🔄 Recursion Visualizer & Call Stack Inspector
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Witness how the OS Runtime Call Stack winds up with frames and unwinds upon hitting the Base Case.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setProblemType('hanoi'); resetHanoi(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              problemType === 'hanoi'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
            }`}
          >
            Tower of Hanoi (Visual Pegs)
          </button>
          <button
            onClick={() => setProblemType('factorial')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              problemType === 'factorial'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
            }`}
          >
            Factorial Call Stack Unwinding
          </button>
        </div>
      </div>

      {problemType === 'hanoi' ? (
        <div>
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Disks (2 to 5):</label>
              <select
                value={hanoiDisks}
                onChange={(e) => {
                  setHanoiDisks(Number(e.target.value));
                  resetHanoi();
                }}
                disabled={isHanoiPlaying}
                className="bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
              >
                <option value={2}>2 Disks (3 moves)</option>
                <option value={3}>3 Disks (7 moves)</option>
                <option value={4}>4 Disks (15 moves)</option>
                <option value={5}>5 Disks (31 moves)</option>
              </select>
            </div>

            <button
              onClick={startHanoi}
              disabled={isHanoiPlaying}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Animate All Moves
            </button>
            <button
              onClick={resetHanoi}
              disabled={isHanoiPlaying}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Pegs
            </button>

            <div className="ml-auto text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/30">
              Move: {hanoiStep} / {Math.pow(2, hanoiDisks) - 1} (Formula: 2ⁿ - 1)
            </div>
          </div>

          {/* Tower of Hanoi Pegs Canvas */}
          <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 mb-6 grid grid-cols-3 gap-6 min-h-[260px]">
            {(['A', 'B', 'C'] as const).map((pegKey) => {
              const diskList = pegs[pegKey];
              const pegLabels = {
                A: 'Peg A (Source)',
                B: 'Peg B (Auxiliary)',
                C: 'Peg C (Destination)',
              };

              return (
                <div key={pegKey} className="flex flex-col items-center justify-end relative h-56">
                  {/* Central Rod */}
                  <div className="w-3 h-44 bg-slate-300 dark:bg-slate-700 rounded-t-full absolute bottom-4 z-0"></div>

                  {/* Disks stacked vertically */}
                  <div className="flex flex-col-reverse items-center gap-1 w-full z-10 mb-4">
                    {diskList.map((size) => {
                      const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500'];
                      const color = colors[(size - 1) % colors.length];
                      const widthPercent = 30 + size * 14;

                      return (
                        <div
                          key={size}
                          style={{ width: `${widthPercent}%` }}
                          className={`h-6 ${color} text-white font-mono text-[11px] font-bold rounded-md shadow-md flex items-center justify-center transition-all duration-300`}
                        >
                          Disk {size}
                        </div>
                      );
                    })}
                  </div>

                  {/* Base board */}
                  <div className="w-full h-3 bg-slate-400 dark:bg-slate-600 rounded-full z-10"></div>

                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                    {pegLabels[pegKey]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {/* Factorial Call Stack Visualizer */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Calculate n! :</label>
              <input
                type="number"
                min={1}
                max={6}
                value={factInput}
                onChange={(e) => setFactInput(Number(e.target.value))}
                className="w-20 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={startFactorial}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Trace Call Stack Frames
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Visual Call Stack */}
            <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-end min-h-[260px]">
              <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
                Operating System Runtime Call Stack (LIFO)
              </div>
              <div className="w-full max-w-sm mx-auto border-x-4 border-b-4 border-slate-400 dark:border-slate-600 rounded-b-xl p-3 flex flex-col-reverse gap-2 bg-slate-100/40 dark:bg-navy-900/40 min-h-[180px] justify-start">
                {callStack.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-6 text-center">
                    Call stack is currently empty.
                    <br />
                    Click "Trace Call Stack" to begin execution.
                  </div>
                ) : (
                  callStack.map((f, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg text-xs font-mono flex items-center justify-between border shadow-sm transition-all duration-300 ${
                        f.status === 'returned'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-indigo-600 text-white border-indigo-400'
                      }`}
                    >
                      <span className="font-bold">{f.frame}</span>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-black/20">
                        {f.status === 'returned' ? `Returned ${f.val}` : 'Waiting on base case...'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-bold mb-2">Recursive Mechanics:</div>
                <div className="space-y-2 text-[11px] text-slate-300">
                  <p>
                    <span className="text-amber-400 font-semibold">1. Winding:</span> Each call allocates a stack frame storing parameter n and return address. factorial(4) calls factorial(3) ... down to factorial(1).
                  </p>
                  <p>
                    <span className="text-cyan-400 font-semibold">2. Base Case:</span> When n == 1, recursion stops and returns 1.
                  </p>
                  <p>
                    <span className="text-emerald-400 font-semibold">3. Unwinding:</span> Stack frames pop in reverse order: 2 * 1 = 2; 3 * 2 = 6; 4 * 6 = 24!
                  </p>
                </div>
              </div>

              {factorialResult !== null && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded-lg text-emerald-300 font-bold text-center mt-4">
                  Final Computed Result: {factInput}! = {factorialResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
