import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Info } from 'lucide-react';

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'insertion' | 'quick'>('bubble');
  const [array, setArray] = useState<number[]>([45, 18, 72, 29, 61, 12, 85, 33]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [swapsCount, setSwapsCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Select an algorithm and click Start Sorting.');
  const [speedMs, setSpeedMs] = useState<number>(300);

  const isStopRequested = useRef<boolean>(false);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetArray = () => {
    isStopRequested.current = true;
    setIsRunning(false);
    setArray([45, 18, 72, 29, 61, 12, 85, 33]);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisonsCount(0);
    setSwapsCount(0);
    setStatusMessage('Array reset to initial unsorted state.');
  };

  // Bubble Sort
  const runBubbleSort = async () => {
    setIsRunning(true);
    isStopRequested.current = false;
    let arr = [...array];
    let comps = 0;
    let swaps = 0;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let swappedInPass = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (isStopRequested.current) return;
        setComparing([j, j + 1]);
        comps++;
        setComparisonsCount(comps);
        setStatusMessage(`Pass ${i + 1}: Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]})...`);
        await sleep(speedMs);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          swaps++;
          setSwapsCount(swaps);
          setStatusMessage(`Swapping ${arr[j]} and ${arr[j + 1]} because ${arr[j]} > ${arr[j + 1]}.`);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          swappedInPass = true;
          await sleep(speedMs);
          setSwapping([]);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
      if (!swappedInPass) {
        setStatusMessage('Optimization triggered: No swaps occurred in this pass. Array is fully sorted!');
        break;
      }
    }
    setSortedIndices(arr.map((_, idx) => idx));
    setComparing([]);
    setIsRunning(false);
    setStatusMessage(`Bubble Sort complete! Total comparisons: ${comps}, Swaps: ${swaps}.`);
  };

  // Selection Sort
  const runSelectionSort = async () => {
    setIsRunning(true);
    isStopRequested.current = false;
    let arr = [...array];
    let comps = 0;
    let swaps = 0;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setStatusMessage(`Pass ${i + 1}: Finding minimum element from index ${i} to ${n - 1}...`);

      for (let j = i + 1; j < n; j++) {
        if (isStopRequested.current) return;
        setComparing([minIdx, j]);
        comps++;
        setComparisonsCount(comps);
        await sleep(speedMs);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setStatusMessage(`New minimum discovered: arr[${minIdx}] = ${arr[minIdx]}.`);
        }
      }

      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        swaps++;
        setSwapsCount(swaps);
        setStatusMessage(`Swapping minimum ${arr[minIdx]} into sorted position index ${i}.`);
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        await sleep(speedMs);
        setSwapping([]);
      }
      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices(arr.map((_, idx) => idx));
    setComparing([]);
    setIsRunning(false);
    setStatusMessage(`Selection Sort complete! Total comparisons: ${comps}, Swaps: ${swaps}.`);
  };

  // Insertion Sort
  const runInsertionSort = async () => {
    setIsRunning(true);
    isStopRequested.current = false;
    let arr = [...array];
    let comps = 0;
    let swaps = 0;
    const n = arr.length;

    setSortedIndices([0]);

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setStatusMessage(`Taking key ${key} at index ${i} to insert into sorted left portion...`);

      while (j >= 0 && arr[j] > key) {
        if (isStopRequested.current) return;
        setComparing([j, j + 1]);
        comps++;
        setComparisonsCount(comps);
        await sleep(speedMs);

        setSwapping([j, j + 1]);
        swaps++;
        setSwapsCount(swaps);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await sleep(speedMs);
        setSwapping([]);
        j = j - 1;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(Array.from({ length: i + 1 }, (_, idx) => idx));
    }

    setComparing([]);
    setIsRunning(false);
    setStatusMessage(`Insertion Sort complete! Total comparisons: ${comps}, Shifts: ${swaps}.`);
  };

  const handleStart = () => {
    if (algorithm === 'bubble') runBubbleSort();
    else if (algorithm === 'selection') runSelectionSort();
    else if (algorithm === 'insertion') runInsertionSort();
    else runBubbleSort();
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📶 Interactive Sorting Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare elements, observe swaps, track stability, and verify step-by-step Big-O comparisons and swaps.
          </p>
        </div>

        {/* Algorithm selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['bubble', 'selection', 'insertion'] as const).map((alg) => (
            <button
              key={alg}
              onClick={() => { setAlgorithm(alg); resetArray(); }}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                algorithm === alg
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
              }`}
            >
              {alg} Sort
            </button>
          ))}
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5" /> Start Sorting
        </button>
        <button
          onClick={resetArray}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>

        <div className="flex items-center gap-2 ml-4">
          <label className="text-xs font-semibold text-slate-500">Speed:</label>
          <input
            type="range"
            min={100}
            max={800}
            step={50}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="w-24 accent-indigo-600"
          />
          <span className="text-xs font-mono text-slate-400">{speedMs}ms</span>
        </div>

        <div className="ml-auto flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-100 dark:bg-navy-950 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            Comparisons: <span className="font-bold text-amber-500">{comparisonsCount}</span>
          </div>
          <div className="bg-slate-100 dark:bg-navy-950 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            Swaps / Shifts: <span className="font-bold text-rose-500">{swapsCount}</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Live Step: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Bars Chart Canvas */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 mb-6 flex items-end justify-center gap-3 min-h-[260px]">
        {array.map((val, idx) => {
          const isComp = comparing.includes(idx);
          const isSwap = swapping.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const heightPx = val * 2.2;

          let barColor = 'bg-slate-400 dark:bg-navy-700';
          if (isSorted) barColor = 'bg-emerald-500 dark:bg-emerald-500';
          if (isComp) barColor = 'bg-amber-400 dark:bg-amber-400';
          if (isSwap) barColor = 'bg-rose-500 dark:bg-rose-500';

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {val}
              </span>
              <div
                style={{ height: `${heightPx}px` }}
                className={`w-12 rounded-t-lg transition-all duration-200 shadow-md ${barColor}`}
              ></div>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-sans">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-500"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Sorted Position</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-400 dark:bg-navy-700"></div>
          <span>Unsorted</span>
        </div>
      </div>
    </div>
  );
};
