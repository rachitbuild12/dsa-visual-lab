import React, { useState } from 'react';
import { Play, RotateCcw, Search, Plus, Trash2, Info } from 'lucide-react';

interface BSTNode {
  val: number;
  left?: BSTNode;
  right?: BSTNode;
  x?: number;
  y?: number;
}

export const TreeVisualizer: React.FC = () => {
  // Initial BST tree
  const initialTree: BSTNode = {
    val: 50,
    left: {
      val: 30,
      left: { val: 20 },
      right: { val: 40 },
    },
    right: {
      val: 70,
      left: { val: 60 },
      right: { val: 80 },
    },
  };

  const [root, setRoot] = useState<BSTNode | null>(initialTree);
  const [inputVal, setInputVal] = useState<string>('25');
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [activeNodeVal, setActiveNodeVal] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Binary Search Tree initialized. Left < Root < Right.');
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  // BST Insert Helper
  const insertNode = (current: BSTNode | null, val: number): BSTNode => {
    if (!current) return { val };
    if (val < current.val) {
      return { ...current, left: insertNode(current.left || null, val) };
    } else if (val > current.val) {
      return { ...current, right: insertNode(current.right || null, val) };
    }
    return current; // no duplicates
  };

  const handleInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    const newRoot = insertNode(root, val);
    setRoot(newRoot);
    setStatusMessage(`Inserted ${val} into BST satisfying Left < Root < Right property.`);
    setActiveNodeVal(val);
    setTimeout(() => setActiveNodeVal(null), 1500);
  };

  // BST Search Helper
  const handleSearch = () => {
    const target = parseInt(inputVal);
    if (isNaN(target)) return;

    let curr = root;
    const path: number[] = [];
    while (curr) {
      path.push(curr.val);
      if (curr.val === target) {
        break;
      } else if (target < curr.val) {
        curr = curr.left || null;
      } else {
        curr = curr.right || null;
      }
    }

    let i = 0;
    setIsTraversing(true);
    const interval = setInterval(() => {
      if (i < path.length) {
        setActiveNodeVal(path[i]);
        setStatusMessage(`Comparing target ${target} with current node ${path[i]}...`);
        i++;
      } else {
        clearInterval(interval);
        setIsTraversing(false);
        if (path[path.length - 1] === target) {
          setStatusMessage(`FOUND! Element ${target} located in BST in O(log n) time!`);
        } else {
          setStatusMessage(`Element ${target} does not exist in BST.`);
          setActiveNodeVal(null);
        }
      }
    }, 700);
  };

  // Traversals
  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    setTraversalType(type);
    setTraversalResult([]);
    const sequence: number[] = [];

    const inorder = (node: BSTNode | null) => {
      if (!node) return;
      inorder(node.left || null);
      sequence.push(node.val);
      inorder(node.right || null);
    };

    const preorder = (node: BSTNode | null) => {
      if (!node) return;
      sequence.push(node.val);
      preorder(node.left || null);
      preorder(node.right || null);
    };

    const postorder = (node: BSTNode | null) => {
      if (!node) return;
      postorder(node.left || null);
      postorder(node.right || null);
      sequence.push(node.val);
    };

    if (type === 'inorder') inorder(root);
    else if (type === 'preorder') preorder(root);
    else postorder(root);

    let idx = 0;
    setIsTraversing(true);
    const interval = setInterval(() => {
      if (idx < sequence.length) {
        setActiveNodeVal(sequence[idx]);
        setTraversalResult(sequence.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setActiveNodeVal(null);
        setIsTraversing(false);
        setStatusMessage(
          type === 'inorder'
            ? 'Inorder traversal finished! Notice it produces elements in ascending sorted order!'
            : `${type.toUpperCase()} traversal completed.`
        );
      }
    }, 600);
  };

  const handleReset = () => {
    setRoot(initialTree);
    setTraversalResult([]);
    setActiveNodeVal(null);
    setStatusMessage('Tree reset to default 7-node balanced BST.');
  };

  // Render SVG Tree coordinates
  interface RenderNode {
    val: number;
    x: number;
    y: number;
    left?: RenderNode;
    right?: RenderNode;
  }

  const computeLayout = (node: BSTNode | null, x: number, y: number, offset: number): RenderNode | null => {
    if (!node) return null;
    return {
      val: node.val,
      x,
      y,
      left: computeLayout(node.left || null, x - offset, y + 60, offset / 1.8) || undefined,
      right: computeLayout(node.right || null, x + offset, y + 60, offset / 1.8) || undefined,
    };
  };

  const layoutRoot = computeLayout(root, 280, 40, 110);

  const renderEdges = (node: RenderNode | null): React.ReactNode => {
    if (!node) return null;
    return (
      <React.Fragment key={`${node.x}-${node.y}`}>
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        {renderEdges(node.left || null)}
        {renderEdges(node.right || null)}
      </React.Fragment>
    );
  };

  const renderNodes = (node: RenderNode | null): React.ReactNode => {
    if (!node) return null;
    const isActive = activeNodeVal === node.val;
    return (
      <React.Fragment key={node.val}>
        <g className="transition-all duration-300">
          <circle
            cx={node.x}
            cy={node.y}
            r={19}
            className={`transition-all duration-300 ${
              isActive
                ? 'fill-amber-400 stroke-amber-200 stroke-[3px] filter drop-shadow(0 0 8px rgba(251,191,36,0.6))'
                : 'fill-indigo-600 stroke-indigo-400 stroke-2'
            }`}
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {node.val}
          </text>
        </g>
        {renderNodes(node.left || null)}
        {renderNodes(node.right || null)}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🌲 Interactive Binary Search Tree (BST) Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dynamic node construction, BST property enforcement, and animated Inorder, Preorder, and Postorder traversals.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Tree
        </button>
      </div>

      {/* Control bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-3 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Node Val:</label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTraversing}
            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
            placeholder="e.g. 25"
          />
        </div>

        <div className="md:col-span-9 flex flex-wrap items-center gap-2">
          <button
            onClick={handleInsert}
            disabled={isTraversing}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Insert BST [O(log n)]
          </button>
          <button
            onClick={handleSearch}
            disabled={isTraversing}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" /> Search BST
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

          <button
            onClick={() => runTraversal('inorder')}
            disabled={isTraversing}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            Inorder (Sorted)
          </button>
          <button
            onClick={() => runTraversal('preorder')}
            disabled={isTraversing}
            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            Preorder
          </button>
          <button
            onClick={() => runTraversal('postorder')}
            disabled={isTraversing}
            className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
          >
            Postorder
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Explanation: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 flex flex-col items-center justify-center overflow-x-auto min-h-[260px]">
        <svg width="560" height="230" className="overflow-visible">
          {renderEdges(layoutRoot)}
          {renderNodes(layoutRoot)}
        </svg>
      </div>

      {/* Live Traversal Output Strip */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            {traversalType.toUpperCase()} Traversal Sequence Queue:
          </span>
          {traversalType === 'inorder' && (
            <span className="text-emerald-400 text-[11px] font-bold">
              ✓ Strictly Ascending Sorted Order!
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
          {traversalResult.length === 0 ? (
            <span className="text-slate-500 text-xs italic">
              Click Inorder, Preorder, or Postorder to animate live traversal sequence.
            </span>
          ) : (
            traversalResult.map((val, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-indigo-600 text-white font-mono font-bold text-xs rounded-md shadow-sm border border-indigo-400 animate-fadeIn"
              >
                {val}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
