import React, { useState } from 'react';
import { Search, Plus, Trash2, RotateCcw, Info, AlertCircle } from 'lucide-react';

export const ArrayVisualizer: React.FC = () => {
  const MAX_SIZE = 8;
  const [array, setArray] = useState<number[]>([12, 24, 35, 47, 58, 69]);
  const [inputValue, setInputValue] = useState<string>('50');
  const [indexValue, setIndexValue] = useState<string>('2');
  const [searchTarget, setSearchTarget] = useState<string>('47');
  const [searchMode, setSearchMode] = useState<'linear' | 'binary'>('binary');
  
  // Highlight states
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lowIndex, setLowIndex] = useState<number | null>(null);
  const [midIndex, setMidIndex] = useState<number | null>(null);
  const [highIndex, setHighIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  
  const [statusMessage, setStatusMessage] = useState<string>('Array initialized. Select an operation below.');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearHighlights = () => {
    setActiveIndex(null);
    setLowIndex(null);
    setMidIndex(null);
    setHighIndex(null);
    setFoundIndex(null);
    setErrorMessage(null);
  };

  // Insertion at Index
  const handleInsert = () => {
    clearHighlights();
    const val = parseInt(inputValue);
    const idx = parseInt(indexValue);

    if (isNaN(val) || isNaN(idx)) {
      setErrorMessage('Please enter valid numeric values for data and index.');
      return;
    }

    if (array.length >= MAX_SIZE) {
      setErrorMessage(`Array Overflow! Array has reached max size (${MAX_SIZE}).`);
      return;
    }

    if (idx < 0 || idx > array.length) {
      setErrorMessage(`Invalid Index! Index must be between 0 and ${array.length}.`);
      return;
    }

    setIsBusy(true);
    setStatusMessage(`Step 1: Shift all elements from index ${array.length - 1} down to ${idx} one position to the right to make space...`);

    // Animate shifting
    setTimeout(() => {
      const updated = [...array];
      updated.splice(idx, 0, val);
      setArray(updated);
      setActiveIndex(idx);
      setStatusMessage(`Step 2: Inserted ${val} at index ${idx}. Operation complete in O(n) time due to shifting.`);
      setIsBusy(false);
    }, 1000);
  };

  // Deletion at Index
  const handleDelete = () => {
    clearHighlights();
    const idx = parseInt(indexValue);

    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setErrorMessage(`Invalid Index! Enter an index between 0 and ${array.length - 1}.`);
      return;
    }

    if (array.length === 0) {
      setErrorMessage('Array Underflow! Array is empty.');
      return;
    }

    setIsBusy(true);
    setActiveIndex(idx);
    const removedVal = array[idx];
    setStatusMessage(`Step 1: Removing element ${removedVal} at index ${idx}...`);

    setTimeout(() => {
      setStatusMessage(`Step 2: Shifting all subsequent elements left to close the gap...`);
      setTimeout(() => {
        const updated = [...array];
        updated.splice(idx, 1);
        setArray(updated);
        setActiveIndex(null);
        setStatusMessage(`Deleted ${removedVal} from index ${idx}. O(n) time due to left-shifting.`);
        setIsBusy(false);
      }, 700);
    }, 700);
  };

  // Linear Search
  const handleLinearSearch = () => {
    clearHighlights();
    const target = parseInt(searchTarget);
    if (isNaN(target)) {
      setErrorMessage('Please enter a valid search target.');
      return;
    }

    setIsBusy(true);
    let i = 0;
    setStatusMessage(`Starting Linear Search for ${target} from index 0...`);

    const interval = setInterval(() => {
      if (i < array.length) {
        setActiveIndex(i);
        setStatusMessage(`Checking index ${i}: arr[${i}] = ${array[i]} == ${target}?`);
        if (array[i] === target) {
          clearInterval(interval);
          setFoundIndex(i);
          setStatusMessage(`Target ${target} FOUND at index ${i}! Total comparisons: ${i + 1}.`);
          setIsBusy(false);
          return;
        }
        i++;
      } else {
        clearInterval(interval);
        setActiveIndex(null);
        setStatusMessage(`Target ${target} NOT FOUND after checking all ${array.length} elements. Time: O(n).`);
        setIsBusy(false);
      }
    }, 800);
  };

  // Binary Search
  const handleBinarySearch = () => {
    clearHighlights();
    const target = parseInt(searchTarget);
    if (isNaN(target)) {
      setErrorMessage('Please enter a valid search target.');
      return;
    }

    // Verify sorted
    const isSorted = array.every((val, i, arr) => !i || arr[i - 1] <= val);
    if (!isSorted) {
      setErrorMessage('Binary Search requires a SORTED array! Sorting array first...');
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      return;
    }

    setIsBusy(true);
    let low = 0;
    let high = array.length - 1;
    let stepCount = 0;

    const step = () => {
      if (low <= high) {
        stepCount++;
        const mid = Math.floor((low + high) / 2);
        setLowIndex(low);
        setMidIndex(mid);
        setHighIndex(high);
        setStatusMessage(`Step ${stepCount}: low=${low}, high=${high}, mid=${mid} (arr[mid] = ${array[mid]}). Comparing ${array[mid]} with ${target}...`);

        setTimeout(() => {
          if (array[mid] === target) {
            setFoundIndex(mid);
            setStatusMessage(`SUCCESS! Target ${target} found at mid index ${mid} in just ${stepCount} steps! Time: O(log n).`);
            setIsBusy(false);
          } else if (array[mid] < target) {
            setStatusMessage(`${array[mid]} < ${target}. Target is in RIGHT half. Eliminating indices 0 to ${mid}. Setting low = mid + 1.`);
            low = mid + 1;
            setTimeout(step, 1000);
          } else {
            setStatusMessage(`${array[mid]} > ${target}. Target is in LEFT half. Eliminating indices ${mid} to ${high}. Setting high = mid - 1.`);
            high = mid - 1;
            setTimeout(step, 1000);
          }
        }, 1200);
      } else {
        clearHighlights();
        setStatusMessage(`Target ${target} NOT FOUND in array after ${stepCount} steps. Terminated in O(log n).`);
        setIsBusy(false);
      }
    };

    step();
  };

  const handleReset = () => {
    setArray([12, 24, 35, 47, 58, 69]);
    clearHighlights();
    setIsBusy(false);
    setStatusMessage('Array reset to default sorted values.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📊 Interactive Array & Search Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Contiguous indexed memory, insertion shifting cost, linear scan vs divide-and-conquer binary search (low/mid/high).
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={isBusy}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Array
        </button>
      </div>

      {/* Array Display */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 overflow-x-auto flex flex-col items-center justify-center min-h-[180px]">
        <div className="flex items-center gap-2 min-w-max">
          {array.map((val, idx) => {
            const isMid = midIndex === idx;
            const isLow = lowIndex === idx;
            const isHigh = highIndex === idx;
            const isActive = activeIndex === idx;
            const isFound = foundIndex === idx;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer tags */}
                <div className="h-6 flex items-center gap-1 mb-1 text-[11px] font-bold font-mono">
                  {isLow && <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded">LOW</span>}
                  {isMid && <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded">MID</span>}
                  {isHigh && <span className="px-1.5 py-0.2 bg-purple-500 text-white rounded">HIGH</span>}
                  {isFound && <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded animate-pulse">FOUND!</span>}
                </div>

                {/* Array cell */}
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-lg shadow-sm border-2 transition-all duration-300 ${
                    isFound
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 scale-110 shadow-emerald-500/30'
                      : isMid
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-105'
                      : isActive
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 scale-105'
                      : isLow || isHigh
                      ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {val}
                </div>

                {/* Index label */}
                <div className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">
                  [{idx}]
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Explanation: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insertion & Deletion */}
        <div className="p-4 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Array Modification (Element Shifting)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500">Value:</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isBusy}
                className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500">Index (0 to {array.length}):</label>
              <input
                type="number"
                value={indexValue}
                onChange={(e) => setIndexValue(e.target.value)}
                disabled={isBusy}
                className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInsert}
              disabled={isBusy}
              className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Insert at Index [O(n)]
            </button>
            <button
              onClick={handleDelete}
              disabled={isBusy}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete at Index [O(n)]
            </button>
          </div>
        </div>

        {/* Searching */}
        <div className="p-4 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Searching Algorithms
          </h4>
          <div>
            <label className="text-[11px] text-slate-500">Target Value:</label>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              disabled={isBusy}
              className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLinearSearch}
              disabled={isBusy}
              className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Search className="w-3.5 h-3.5" /> Linear Search [O(n)]
            </button>
            <button
              onClick={handleBinarySearch}
              disabled={isBusy}
              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Search className="w-3.5 h-3.5" /> Binary Search [O(log n)]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
