import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, ArrowUp, ArrowDown, Eye, Info } from 'lucide-react';

export const StackVisualizer: React.FC = () => {
  const MAX_CAPACITY = 6;
  const [implementation, setImplementation] = useState<'array' | 'linked-list'>('array');
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [inputVal, setInputVal] = useState<string>('40');
  const [topIndex, setTopIndex] = useState<number>(2);
  const [statusMessage, setStatusMessage] = useState<string>('Stack initialized with 3 elements. Current top index is 2.');
  const [highlightAction, setHighlightAction] = useState<'push' | 'pop' | 'peek' | null>(null);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handlePush = () => {
    setErrorNotice(null);
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorNotice('Please enter a valid numeric value.');
      return;
    }

    if (implementation === 'array' && stack.length >= MAX_CAPACITY) {
      setErrorNotice(`STACK OVERFLOW! The stack is at maximum capacity (MAX = ${MAX_CAPACITY}). Cannot push ${val}.`);
      setActiveCodeLine(1);
      return;
    }

    setHighlightAction('push');
    setActiveCodeLine(2);
    setStatusMessage(`Step 1: Check if top == MAX - 1. False. Incrementing top: top = top + 1 (from ${topIndex} to ${topIndex + 1}).`);

    setTimeout(() => {
      const updated = [...stack, val];
      setStack(updated);
      setTopIndex(updated.length - 1);
      setActiveCodeLine(3);
      setStatusMessage(`Step 2: Assign stack[top] = ${val}. Element pushed successfully in O(1) time.`);
      
      setTimeout(() => {
        setHighlightAction(null);
      }, 800);
    }, 600);
  };

  const handlePop = () => {
    setErrorNotice(null);
    if (stack.length === 0) {
      setErrorNotice('STACK UNDERFLOW! Cannot pop from an empty stack (top == -1).');
      setActiveCodeLine(4);
      return;
    }

    setHighlightAction('pop');
    const poppedVal = stack[stack.length - 1];
    setActiveCodeLine(5);
    setStatusMessage(`Step 1: Save element at top: val = stack[top] (${poppedVal}).`);

    setTimeout(() => {
      const updated = stack.slice(0, -1);
      setStack(updated);
      setTopIndex(updated.length - 1);
      setActiveCodeLine(6);
      setStatusMessage(`Step 2: Decrement top: top = top - 1. Returned ${poppedVal}. O(1) time.`);
      
      setTimeout(() => {
        setHighlightAction(null);
      }, 800);
    }, 600);
  };

  const handlePeek = () => {
    setErrorNotice(null);
    if (stack.length === 0) {
      setErrorNotice('Stack is empty! Peek returns NULL or error indicator.');
      return;
    }
    setHighlightAction('peek');
    const topVal = stack[stack.length - 1];
    setStatusMessage(`Peek: Inspecting stack[top]. Top value is ${topVal} at index ${topIndex}. Top pointer is NOT modified.`);
    setTimeout(() => {
      setHighlightAction(null);
    }, 1200);
  };

  const handleReset = () => {
    setStack([10, 20, 30]);
    setTopIndex(2);
    setErrorNotice(null);
    setHighlightAction(null);
    setActiveCodeLine(0);
    setStatusMessage('Stack reset to initial state with 3 items.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🥞 Interactive Stack Visualizer (LIFO)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last-In First-Out mechanism with array bounds checking, top pointer tracking, and call-stack synchronization.
          </p>
        </div>

        {/* Implementation toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setImplementation('array')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              implementation === 'array'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
            }`}
          >
            Array Implementation (Fixed MAX)
          </button>
          <button
            onClick={() => setImplementation('linked-list')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              implementation === 'linked-list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
            }`}
          >
            Linked List Stack (Dynamic)
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-3 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Value:</label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            placeholder="e.g. 40"
          />
        </div>

        <div className="md:col-span-9 flex flex-wrap items-center gap-2">
          <button
            onClick={handlePush}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5" /> Push(val) [O(1)]
          </button>
          <button
            onClick={handlePop}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Pop() [O(1)]
          </button>
          <button
            onClick={handlePeek}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Peek() [O(1)]
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Error / Warning Notice */}
      {errorNotice && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Execution State: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Stack Physical Representation */}
        <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-end min-h-[300px]">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {implementation === 'array' ? `Array Stack (Capacity = ${MAX_CAPACITY})` : 'Linked List Stack (Heap Nodes)'}
          </div>

          {/* Vertical Container (U-shape bucket for array stack) */}
          <div className="w-48 border-x-4 border-b-4 border-slate-400 dark:border-slate-600 rounded-b-xl p-2 flex flex-col-reverse gap-2 bg-slate-100/50 dark:bg-navy-900/50 min-h-[220px] justify-start relative">
            {implementation === 'array' && (
              <div className="text-[10px] text-center text-slate-400 italic mb-1">
                ── Bottom of Stack ──
              </div>
            )}

            {stack.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-10">
                Stack Underflow (Empty)
                <br />
                top = -1
              </div>
            ) : (
              stack.map((item, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-between text-xs font-mono font-bold shadow-md transition-all duration-300 ${
                      isTop
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-[1.02]'
                        : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-[10px] font-sans font-normal opacity-80">
                      idx: {idx} {isTop && '← TOP'}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Top Indicator */}
          <div className="mt-3 flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Current Top Index:</span>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 font-bold rounded">
              {topIndex}
            </span>
            <span className="text-slate-400 text-[11px]">
              ({stack.length === 0 ? 'Empty' : stack.length === MAX_CAPACITY ? 'Full' : 'Available'})
            </span>
          </div>
        </div>

        {/* Synchronized C Implementation Code Panel */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-[11px] mb-2 font-sans font-semibold flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Stack Core C Operations</span>
              <span className="text-indigo-400">LIFO Logic</span>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className={`p-1 rounded ${activeCodeLine === 1 ? 'bg-rose-900/60 text-rose-200 border-l-2 border-rose-400' : ''}`}>
                <span className="text-slate-500">1:</span> if (top == MAX - 1) &#123; printf("Overflow!\\n"); return; &#125;
              </div>
              <div className={`p-1 rounded ${activeCodeLine === 2 ? 'bg-indigo-900/60 text-indigo-200 border-l-2 border-indigo-400' : ''}`}>
                <span className="text-slate-500">2:</span> top = top + 1;
              </div>
              <div className={`p-1 rounded ${activeCodeLine === 3 ? 'bg-emerald-900/60 text-emerald-200 border-l-2 border-emerald-400' : ''}`}>
                <span className="text-slate-500">3:</span> stack[top] = value; <span className="text-emerald-400">// Pushed</span>
              </div>
              <div className="border-t border-slate-800 my-1"></div>
              <div className={`p-1 rounded ${activeCodeLine === 4 ? 'bg-rose-900/60 text-rose-200 border-l-2 border-rose-400' : ''}`}>
                <span className="text-slate-500">4:</span> if (top == -1) &#123; printf("Underflow!\\n"); return -1; &#125;
              </div>
              <div className={`p-1 rounded ${activeCodeLine === 5 ? 'bg-indigo-900/60 text-indigo-200 border-l-2 border-indigo-400' : ''}`}>
                <span className="text-slate-500">5:</span> int val = stack[top];
              </div>
              <div className={`p-1 rounded ${activeCodeLine === 6 ? 'bg-amber-900/60 text-amber-200 border-l-2 border-amber-400' : ''}`}>
                <span className="text-slate-500">6:</span> top = top - 1; return val; <span className="text-amber-400">// Popped</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg text-[11px] text-slate-400 border border-slate-800 mt-4">
            <span className="text-indigo-400 font-semibold">Exam Tip: </span>
            In C, writing <code className="text-slate-200">stack[++top] = val</code> performs lines 2 &amp; 3 in a single statement. Writing <code className="text-slate-200">return stack[top--]</code> returns value then decrements top!
          </div>
        </div>
      </div>
    </div>
  );
};
