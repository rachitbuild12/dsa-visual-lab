import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface LLNode {
  id: string;
  data: number;
  simAddress: string;
  nextAddress: string | null;
  prevAddress?: string | null;
}

export const LinkedListVisualizer: React.FC = () => {
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly');
  const [nodes, setNodes] = useState<LLNode[]>([
    { id: 'n1', data: 10, simAddress: '0x1040', nextAddress: '0x1080', prevAddress: null },
    { id: 'n2', data: 20, simAddress: '0x1080', nextAddress: '0x10C0', prevAddress: '0x1040' },
    { id: 'n3', data: 30, simAddress: '0x10C0', nextAddress: null, prevAddress: '0x1080' },
  ]);

  const [inputVal, setInputVal] = useState<string>('40');
  const [positionInput, setPositionInput] = useState<string>('0');
  const [statusMessage, setStatusMessage] = useState<string>('Ready. Click an operation to see pointer updates step-by-step.');
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [newNodePreview, setNewNodePreview] = useState<LLNode | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize circular list pointer
  useEffect(() => {
    if (listType === 'circular') {
      setNodes((prev) => {
        if (prev.length === 0) return prev;
        const headAddr = prev[0].simAddress;
        return prev.map((n, idx) => {
          if (idx === prev.length - 1) {
            return { ...n, nextAddress: headAddr };
          }
          return n;
        });
      });
    } else {
      setNodes((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((n, idx) => {
          if (idx === prev.length - 1) {
            return { ...n, nextAddress: null };
          }
          return n;
        });
      });
    }
  }, [listType]);

  const generateAddress = () => {
    const hex = Math.floor(0x1000 + Math.random() * 0x8000).toString(16).toUpperCase();
    return `0x${hex}`;
  };

  const handleInsertBeginning = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorMsg('Please enter a valid numeric value.');
      return;
    }
    setErrorMsg(null);
    setIsAnimating(true);

    const newAddr = generateAddress();
    const tempNode: LLNode = {
      id: `node-${Date.now()}`,
      data: val,
      simAddress: newAddr,
      nextAddress: nodes.length > 0 ? nodes[0].simAddress : null,
      prevAddress: null,
    };

    setNewNodePreview(tempNode);
    setActiveCodeLine(1);
    setStatusMessage(`Step 1: Allocated new node at heap address ${newAddr} with data = ${val}. newNode->next = NULL.`);

    setTimeout(() => {
      setActiveCodeLine(2);
      setStatusMessage(`Step 2: Linking new node! newNode->next = head; (${newAddr} points to ${nodes.length > 0 ? nodes[0].simAddress : 'NULL'}). Note: If we moved head first, the rest of the list would be permanently lost!`);
    }, 1200);

    setTimeout(() => {
      setActiveCodeLine(3);
      setStatusMessage(`Step 3: Updating head! head = newNode; Head now points to ${newAddr}. Operation complete in O(1) time.`);
      
      const updatedNodes = [
        { ...tempNode, nextAddress: nodes.length > 0 ? nodes[0].simAddress : (listType === 'circular' ? newAddr : null) },
        ...nodes.map((n, idx) => {
          if (idx === 0 && listType === 'doubly') {
            return { ...n, prevAddress: newAddr };
          }
          return n;
        })
      ];

      if (listType === 'circular' && updatedNodes.length > 1) {
        updatedNodes[updatedNodes.length - 1].nextAddress = newAddr;
      }

      setNodes(updatedNodes);
      setNewNodePreview(null);
      setIsAnimating(false);
    }, 2500);
  };

  const handleInsertEnd = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorMsg('Please enter a valid numeric value.');
      return;
    }
    setErrorMsg(null);
    setIsAnimating(true);

    const newAddr = generateAddress();
    const tempNode: LLNode = {
      id: `node-${Date.now()}`,
      data: val,
      simAddress: newAddr,
      nextAddress: listType === 'circular' && nodes.length > 0 ? nodes[0].simAddress : null,
      prevAddress: nodes.length > 0 ? nodes[nodes.length - 1].simAddress : null,
    };

    if (nodes.length === 0) {
      handleInsertBeginning();
      return;
    }

    setStatusMessage(`Step 1: Traverse through nodes to find the last node (where next == ${listType === 'circular' ? 'head' : 'NULL'})...`);
    setActiveCodeLine(1);
    
    // Simulate traversal
    let step = 0;
    const interval = setInterval(() => {
      if (step < nodes.length) {
        setHighlightedNodeId(nodes[step].id);
        setStatusMessage(`Traversing: Visiting node with data ${nodes[step].data} at address ${nodes[step].simAddress}...`);
        step++;
      } else {
        clearInterval(interval);
        setStatusMessage(`Step 2: Found last node! Linking lastNode->next = newNode (${newAddr}). newNode->next = ${listType === 'circular' ? 'head' : 'NULL'}.`);
        setActiveCodeLine(2);

        setTimeout(() => {
          const updated = [...nodes];
          updated[updated.length - 1].nextAddress = newAddr;
          updated.push(tempNode);
          setNodes(updated);
          setHighlightedNodeId(null);
          setIsAnimating(false);
          setStatusMessage(`Insertion at end complete! Required O(n) traversal time.`);
          setActiveCodeLine(3);
        }, 1000);
      }
    }, 700);
  };

  const handleDeleteBeginning = () => {
    if (nodes.length === 0) {
      setErrorMsg('List Underflow! The linked list is empty.');
      return;
    }
    setErrorMsg(null);
    setIsAnimating(true);

    const targetNode = nodes[0];
    setHighlightedNodeId(targetNode.id);
    setActiveCodeLine(1);
    setStatusMessage(`Step 1: Store pointer to head in temp: struct Node* temp = head; (${targetNode.simAddress})`);

    setTimeout(() => {
      setActiveCodeLine(2);
      const nextAddr = targetNode.nextAddress;
      setStatusMessage(`Step 2: Advance head to next node: head = head->next; (head is now ${nextAddr || 'NULL'}).`);
    }, 1200);

    setTimeout(() => {
      setActiveCodeLine(3);
      setStatusMessage(`Step 3: Call free(temp) to return node ${targetNode.data} at address ${targetNode.simAddress} to the OS heap to avoid memory leaks!`);
      
      const remaining = nodes.slice(1);
      if (listType === 'circular' && remaining.length > 0) {
        remaining[remaining.length - 1].nextAddress = remaining[0].simAddress;
      }
      if (listType === 'doubly' && remaining.length > 0) {
        remaining[0].prevAddress = null;
      }

      setNodes(remaining);
      setHighlightedNodeId(null);
      setIsAnimating(false);
    }, 2400);
  };

  const handleReset = () => {
    setNodes([
      { id: 'n1', data: 10, simAddress: '0x1040', nextAddress: '0x1080', prevAddress: null },
      { id: 'n2', data: 20, simAddress: '0x1080', nextAddress: '0x10C0', prevAddress: '0x1040' },
      { id: 'n3', data: 30, simAddress: '0x10C0', nextAddress: null, prevAddress: '0x1080' },
    ]);
    setHighlightedNodeId(null);
    setNewNodePreview(null);
    setIsAnimating(false);
    setErrorMsg(null);
    setActiveCodeLine(0);
    setStatusMessage('List reset to default 3 nodes.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🔗 Interactive Linked List Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Observe pointer reassignments, heap memory addresses, and the critical order of pointer updates in real time.
          </p>
        </div>

        {/* List Type Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setListType('singly'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              listType === 'singly'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Singly
          </button>
          <button
            onClick={() => { setListType('doubly'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              listType === 'doubly'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Doubly
          </button>
          <button
            onClick={() => { setListType('circular'); handleReset(); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              listType === 'circular'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500'
            }`}
          >
            Circular
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-3 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Data Val:</label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isAnimating}
            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-white"
            placeholder="e.g. 40"
          />
        </div>

        <div className="md:col-span-9 flex flex-wrap items-center gap-2">
          <button
            onClick={handleInsertBeginning}
            disabled={isAnimating}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            + Insert Beginning [O(1)]
          </button>
          <button
            onClick={handleInsertEnd}
            disabled={isAnimating}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            + Insert End [O(n)]
          </button>
          <button
            onClick={handleDeleteBeginning}
            disabled={isAnimating}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            - Delete Front [O(1)]
          </button>
          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Status Banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Live Execution Status: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 min-h-[220px] overflow-x-auto flex flex-col justify-center mb-6 relative">
        <div className="flex items-center gap-4 min-w-max py-4">
          {/* Head Pointer Indicator */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow">
              HEAD
            </div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              points to:
            </div>
            <div className="font-mono text-xs text-amber-500 font-bold">
              {nodes.length > 0 ? nodes[0].simAddress : 'NULL'}
            </div>
            <div className="w-0.5 h-6 bg-amber-500 my-1"></div>
            <div className="text-amber-500 text-xs">▼</div>
          </div>

          {/* New Node Floating Preview during insertion */}
          {newNodePreview && (
            <div className="animate-bounce border-2 border-dashed border-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-lg shadow-lg flex flex-col items-center">
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mb-1">
                newNode in Heap ({newNodePreview.simAddress})
              </span>
              <div className="flex border border-cyan-500 rounded bg-white dark:bg-navy-900 overflow-hidden text-xs">
                <div className="px-3 py-2 font-bold text-cyan-600 dark:text-cyan-300 border-r border-cyan-500">
                  {newNodePreview.data}
                </div>
                <div className="px-2 py-2 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-navy-800">
                  next: {newNodePreview.nextAddress || 'NULL'}
                </div>
              </div>
            </div>
          )}

          {/* Empty list representation */}
          {nodes.length === 0 && !newNodePreview && (
            <div className="flex items-center gap-2 text-slate-400 text-sm italic py-8">
              List is currently empty (head == NULL). Click "+ Insert Beginning" to add a node!
            </div>
          )}

          {/* Nodes chain */}
          {nodes.map((node, index) => {
            const isHighlighted = highlightedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`relative flex flex-col items-center transition-all duration-300 ${
                    isHighlighted ? 'scale-105' : ''
                  }`}
                >
                  {/* Simulated Address Pill */}
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1">
                    Loc: {node.simAddress}
                  </span>

                  {/* Node container with data and pointer sections */}
                  <div
                    className={`flex items-stretch rounded-lg shadow-md border-2 overflow-hidden transition-all duration-200 ${
                      isHighlighted
                        ? 'border-amber-400 bg-amber-500/10 shadow-amber-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900'
                    }`}
                  >
                    {/* Optional Prev pointer for Doubly Linked List */}
                    {listType === 'doubly' && (
                      <div className="px-2 py-3 bg-slate-100 dark:bg-navy-800 border-r border-slate-200 dark:border-slate-700 text-center">
                        <div className="text-[9px] text-slate-400 uppercase">prev</div>
                        <div className="text-[10px] font-mono text-indigo-500 font-semibold">
                          {node.prevAddress || 'NULL'}
                        </div>
                      </div>
                    )}

                    {/* Data compartment */}
                    <div className="px-4 py-3 min-w-[54px] flex flex-col items-center justify-center bg-transparent">
                      <div className="text-[9px] text-slate-400 uppercase font-medium">data</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                        {node.data}
                      </div>
                    </div>

                    {/* Next pointer compartment */}
                    <div className="px-2.5 py-3 bg-slate-100 dark:bg-navy-800 border-l border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                      <div className="text-[9px] text-slate-400 uppercase font-medium">next</div>
                      <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {node.nextAddress ? node.nextAddress : 'NULL'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
                    Node #{index}
                  </span>
                </div>

                {/* Arrow to next node */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center text-cyan-500 font-bold text-lg px-1">
                    {listType === 'doubly' ? '⇄' : '➔'}
                  </div>
                )}

                {/* Last node arrow for circular or null */}
                {index === nodes.length - 1 && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 px-1">
                    {listType === 'circular' ? (
                      <span className="text-cyan-400 text-xs px-2 py-1 bg-cyan-950/60 border border-cyan-800 rounded">
                        ⟲ points to Head ({nodes[0].simAddress})
                      </span>
                    ) : (
                      <>
                        <span>➔</span>
                        <span className="px-2 py-1 bg-slate-200 dark:bg-navy-800 rounded text-slate-600 dark:text-slate-400 text-xs">
                          NULL
                        </span>
                      </>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Synchronized C Code Panel with highlighted active line */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-4 font-mono text-xs border border-slate-800">
        <div className="text-slate-400 text-[11px] mb-2 font-sans font-semibold flex items-center justify-between">
          <span>Corresponding C Implementation (Insert at Beginning)</span>
          <span className="text-cyan-400">Order of Operations Safeguard</span>
        </div>
        <div className="space-y-1">
          <div className={`p-1 rounded transition-colors ${activeCodeLine === 1 ? 'bg-cyan-900/60 text-cyan-200 border-l-2 border-cyan-400' : ''}`}>
            <span className="text-slate-500 mr-2">1:</span> struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
          </div>
          <div className={`p-1 rounded transition-colors ${activeCodeLine === 2 ? 'bg-cyan-900/60 text-cyan-200 border-l-2 border-cyan-400' : ''}`}>
            <span className="text-slate-500 mr-2">2:</span> newNode-&gt;data = val; newNode-&gt;next = head; <span className="text-amber-400">// Must link first!</span>
          </div>
          <div className={`p-1 rounded transition-colors ${activeCodeLine === 3 ? 'bg-cyan-900/60 text-cyan-200 border-l-2 border-cyan-400' : ''}`}>
            <span className="text-slate-500 mr-2">3:</span> head = newNode; <span className="text-emerald-400">// Update head safely</span>
          </div>
        </div>
      </div>
    </div>
  );
};
