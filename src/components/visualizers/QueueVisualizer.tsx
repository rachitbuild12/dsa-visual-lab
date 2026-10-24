import React, { useState } from 'react';
import { RotateCcw, ArrowRight, ArrowLeft, Info, AlertTriangle } from 'lucide-react';

export const QueueVisualizer: React.FC = () => {
  const MAX = 5;
  const [queueType, setQueueType] = useState<'linear' | 'circular'>('circular');
  const [items, setItems] = useState<(number | null)[]>([10, 20, 30, null, null]);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(2);
  const [inputVal, setInputVal] = useState<string>('40');
  const [statusMessage, setStatusMessage] = useState<string>('Queue has 3 elements. front=0, rear=2.');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isLinearFull = rear === MAX - 1;
  const isCircularFull = (rear + 1) % MAX === front;
  const isEmpty = front === -1;

  const handleEnqueue = () => {
    setErrorNotice(null);
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorNotice('Enter a valid numeric value to enqueue.');
      return;
    }

    if (queueType === 'linear') {
      if (rear === MAX - 1) {
        if (front > 0) {
          setErrorNotice(`FALSE OVERFLOW! In Linear Queue, rear == MAX - 1 (${rear}), so insertion is blocked, even though slots 0 to ${front - 1} are completely empty! Switch to Circular Queue to solve this.`);
        } else {
          setErrorNotice('LINEAR QUEUE OVERFLOW! Queue is full.');
        }
        return;
      }

      const newRear = rear + 1;
      const updated = [...items];
      updated[newRear] = val;
      const newFront = front === -1 ? 0 : front;

      setItems(updated);
      setRear(newRear);
      setFront(newFront);
      setStatusMessage(`Linear Enqueue: items[++rear] = ${val}. rear is now ${newRear}.`);
    } else {
      // Circular queue
      if (isCircularFull) {
        setErrorNotice(`CIRCULAR QUEUE FULL! Condition (rear + 1) % MAX == front (${(rear + 1) % MAX} == ${front}) is true.`);
        return;
      }

      const newFront = front === -1 ? 0 : front;
      const newRear = (rear + 1) % MAX;
      const updated = [...items];
      updated[newRear] = val;

      setItems(updated);
      setRear(newRear);
      setFront(newFront);
      setStatusMessage(`Circular Enqueue: rear = (rear + 1) % ${MAX} = ${newRear}. Value ${val} stored! (front=${newFront}, rear=${newRear}).`);
    }
  };

  const handleDequeue = () => {
    setErrorNotice(null);
    if (isEmpty || (front === -1 && rear === -1)) {
      setErrorNotice('QUEUE UNDERFLOW! Queue is empty (front == -1).');
      return;
    }

    const val = items[front];
    const updated = [...items];
    updated[front] = null; // Clear dequeued cell

    if (front === rear) {
      // Only 1 item was present
      setItems(updated);
      setFront(-1);
      setRear(-1);
      setStatusMessage(`Dequeued last element ${val}. Queue is now reset to empty (front = -1, rear = -1).`);
    } else {
      let newFront = 0;
      if (queueType === 'linear') {
        newFront = front + 1;
        setFront(newFront);
        setStatusMessage(`Linear Dequeue: Removed ${val}. front shifted forward to ${newFront}. Previous cell is now wasted space!`);
      } else {
        newFront = (front + 1) % MAX;
        setFront(newFront);
        setStatusMessage(`Circular Dequeue: Removed ${val}. front = (front + 1) % ${MAX} = ${newFront}.`);
      }
      setItems(updated);
    }
  };

  const handleReset = () => {
    setItems([10, 20, 30, null, null]);
    setFront(0);
    setRear(2);
    setErrorNotice(null);
    setStatusMessage('Queue reset to initial 3 elements.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🚶 Queue Visualizer: Linear vs Circular Wraparound
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            FIFO line dynamics. See firsthand why Linear Queues waste space and how the Circular modulo formula achieves 100% memory reuse.
          </p>
        </div>

        {/* Toggle queue type */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setQueueType('circular'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              queueType === 'circular'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Circular Queue (Wraparound)
          </button>
          <button
            onClick={() => { setQueueType('linear'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              queueType === 'linear'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Linear Queue (Space Wastage Demo)
          </button>
        </div>
      </div>

      {/* Control row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-3 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Value:</label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-white"
            placeholder="e.g. 40"
          />
        </div>

        <div className="md:col-span-9 flex flex-wrap items-center gap-2">
          <button
            onClick={handleEnqueue}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Enqueue(val) [Rear]
          </button>
          <button
            onClick={handleDequeue}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dequeue() [Front]
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Live State: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Array Ring Visualization */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-3">
          {items.map((val, idx) => {
            const isFront = idx === front;
            const isRear = idx === rear;
            const isEmptyCell = val === null;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer markers above */}
                <div className="h-6 flex items-center gap-1 mb-1 text-[10px] font-mono font-bold">
                  {isFront && (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded shadow-sm">
                      FRONT
                    </span>
                  )}
                  {isRear && (
                    <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded shadow-sm">
                      REAR
                    </span>
                  )}
                </div>

                {/* Queue cell */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono font-bold text-lg border-2 shadow-sm transition-all duration-300 ${
                    isEmptyCell
                      ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-navy-900/50 text-slate-400'
                      : isFront
                      ? 'border-amber-400 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                      : isRear
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {val !== null ? val : '∅'}
                </div>

                {/* Index & status */}
                <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1.5">
                  Slot [{idx}]
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular wraparound arrow indicator */}
        {queueType === 'circular' && (
          <div className="mt-4 text-xs font-mono text-cyan-500 flex items-center gap-1.5">
            <span>⟲ Modulo Wraparound Active:</span>
            <span className="bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
              next_rear = (rear + 1) % {MAX} = {(rear + 1) % MAX}
            </span>
          </div>
        )}
      </div>

      {/* Exam takeaway box */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-lg text-xs font-mono border border-slate-800">
        <div className="text-cyan-400 font-bold mb-1">Key Formulas to Write in University Exam:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-[11px]">
          <div>
            <div className="text-slate-400 font-semibold font-sans">Full Condition:</div>
            <code className="text-white">(rear + 1) % MAX == front</code>
          </div>
          <div>
            <div className="text-slate-400 font-semibold font-sans">Empty Condition:</div>
            <code className="text-white">front == -1</code>
          </div>
          <div>
            <div className="text-slate-400 font-semibold font-sans">Enqueue Rear Update:</div>
            <code className="text-white">rear = (rear + 1) % MAX</code>
          </div>
          <div>
            <div className="text-slate-400 font-semibold font-sans">Dequeue Front Update:</div>
            <code className="text-white">front = (front + 1) % MAX</code>
          </div>
        </div>
      </div>
    </div>
  );
};
