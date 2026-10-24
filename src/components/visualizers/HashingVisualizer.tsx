import React, { useState } from 'react';
import { RotateCcw, Plus, Info, AlertTriangle } from 'lucide-react';

export const HashingVisualizer: React.FC = () => {
  const TABLE_SIZE = 7;
  const [technique, setTechnique] = useState<'linear-probing' | 'separate-chaining'>('linear-probing');
  const [inputKey, setInputKey] = useState<string>('17');
  
  // Linear probing array: -1 represents empty
  const [probingTable, setProbingTable] = useState<number[]>([10, -1, -1, -1, -1, -1, -1]);
  // Separate chaining array: array of numbers per bucket
  const [chainingTable, setChainingTable] = useState<number[][]>([[14], [], [], [10], [], [], []]);

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [collisionSlot, setCollisionSlot] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Hash Table ready. Hash function: h(k) = k % 7.');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleInsert = () => {
    setErrorNotice(null);
    const key = parseInt(inputKey);
    if (isNaN(key)) {
      setErrorNotice('Enter a valid numeric key.');
      return;
    }

    const baseIndex = key % TABLE_SIZE;
    setActiveSlot(baseIndex);
    setStatusMessage(`Step 1: Compute hash index: h(${key}) = ${key} % ${TABLE_SIZE} = ${baseIndex}.`);

    if (technique === 'linear-probing') {
      setTimeout(() => {
        if (probingTable[baseIndex] === -1) {
          // No collision
          const updated = [...probingTable];
          updated[baseIndex] = key;
          setProbingTable(updated);
          setStatusMessage(`Slot [${baseIndex}] was empty! Inserted key ${key} with 0 collisions.`);
          setTimeout(() => setActiveSlot(null), 1500);
        } else {
          // Collision!
          setCollisionSlot(baseIndex);
          setStatusMessage(`COLLISION AT SLOT [${baseIndex}]! Slot already occupied by ${probingTable[baseIndex]}. Probing next slots linearly: (index + i) % ${TABLE_SIZE}...`);

          let i = 1;
          const probeInterval = setInterval(() => {
            const probeIdx = (baseIndex + i) % TABLE_SIZE;
            setActiveSlot(probeIdx);

            if (probingTable[probeIdx] === -1) {
              clearInterval(probeInterval);
              const updated = [...probingTable];
              updated[probeIdx] = key;
              setProbingTable(updated);
              setCollisionSlot(null);
              setStatusMessage(`Empty slot found at index [${probeIdx}] after ${i} probes! Inserted ${key}.`);
              setTimeout(() => setActiveSlot(null), 1500);
            } else {
              i++;
              if (i >= TABLE_SIZE) {
                clearInterval(probeInterval);
                setErrorNotice('HASH TABLE FULL! All 7 slots are occupied. Cannot insert.');
                setCollisionSlot(null);
                setActiveSlot(null);
              }
            }
          }, 800);
        }
      }, 1000);
    } else {
      // Separate chaining
      setTimeout(() => {
        const updated = [...chainingTable];
        const isCollision = updated[baseIndex].length > 0;
        if (isCollision) {
          setCollisionSlot(baseIndex);
          setStatusMessage(`COLLISION at bucket [${baseIndex}]! Appending key ${key} to the linked list chain.`);
        } else {
          setStatusMessage(`Inserted key ${key} as head of bucket [${baseIndex}].`);
        }

        updated[baseIndex] = [...updated[baseIndex], key];
        setChainingTable(updated);

        setTimeout(() => {
          setActiveSlot(null);
          setCollisionSlot(null);
        }, 1500);
      }, 1000);
    }
  };

  const handleReset = () => {
    setProbingTable([10, -1, -1, -1, -1, -1, -1]);
    setChainingTable([[14], [], [], [10], [], [], []]);
    setActiveSlot(null);
    setCollisionSlot(null);
    setErrorNotice(null);
    setStatusMessage('Hash Table reset to default state.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🔑 Interactive Hashing & Collision Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hash calculation h(k) = k % 7, collision detection, Linear Probing open addressing vs Separate Chaining linked lists.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setTechnique('linear-probing'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              technique === 'linear-probing'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Linear Probing (Open Addressing)
          </button>
          <button
            onClick={() => { setTechnique('separate-chaining'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              technique === 'separate-chaining'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Separate Chaining (Linked Lists)
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Insert Key:</label>
          <input
            type="number"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-24 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
            placeholder="e.g. 17"
          />
        </div>

        <button
          onClick={handleInsert}
          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Compute Hash & Insert
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Table
        </button>
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
          <span className="font-semibold text-slate-900 dark:text-white">Explanation: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Table Visualization */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6">
        {technique === 'linear-probing' ? (
          /* Linear Probing Slots */
          <div className="grid grid-cols-7 gap-3">
            {probingTable.map((val, idx) => {
              const isCol = collisionSlot === idx;
              const isAct = activeSlot === idx;
              const isEmpty = val === -1;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    Index [{idx}]
                  </div>
                  <div
                    className={`w-full h-16 rounded-xl flex items-center justify-center font-mono font-bold text-base border-2 shadow-sm transition-all duration-300 ${
                      isCol
                        ? 'border-rose-500 bg-rose-500/20 text-rose-400 scale-105 animate-pulse'
                        : isAct
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 scale-105'
                        : isEmpty
                        ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-navy-900/40 text-slate-400'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white'
                    }`}
                  >
                    {isEmpty ? 'EMPTY' : val}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Separate Chaining Buckets */
          <div className="space-y-3">
            {chainingTable.map((chain, idx) => {
              const isAct = activeSlot === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                    isAct
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900'
                  }`}
                >
                  <div className="w-20 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    Bucket [{idx}] ➔
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {chain.length === 0 ? (
                      <span className="text-slate-400 text-xs italic">NULL (empty)</span>
                    ) : (
                      chain.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <div className="px-3 py-1.5 bg-indigo-600 text-white font-mono font-bold text-xs rounded-md shadow-sm border border-indigo-400">
                            {k}
                          </div>
                          <span className="text-cyan-500 text-xs font-bold">➔</span>
                        </React.Fragment>
                      ))
                    )}
                    {chain.length > 0 && (
                      <span className="text-slate-400 font-mono text-xs">NULL</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
