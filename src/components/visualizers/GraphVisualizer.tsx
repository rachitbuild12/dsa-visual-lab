import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  u: number;
  v: number;
  weight: number;
}

export const GraphVisualizer: React.FC = () => {
  const [algoMode, setAlgoMode] = useState<'bfs' | 'dfs' | 'dijkstra'>('bfs');
  
  // Graph structure: 5 vertices
  const vertices: GraphNode[] = [
    { id: 0, label: '0', x: 60, y: 110 },
    { id: 1, label: '1', x: 170, y: 40 },
    { id: 2, label: '2', x: 170, y: 180 },
    { id: 3, label: '3', x: 300, y: 40 },
    { id: 4, label: '4', x: 300, y: 180 },
  ];

  const edges: GraphEdge[] = [
    { u: 0, v: 1, weight: 4 },
    { u: 0, v: 2, weight: 2 },
    { u: 1, v: 2, weight: 1 },
    { u: 1, v: 3, weight: 5 },
    { u: 2, v: 4, weight: 8 },
    { u: 3, v: 4, weight: 2 },
  ];

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [activeEdge, setActiveEdge] = useState<[number, number] | null>(null);
  const [distances, setDistances] = useState<Record<number, number>>({ 0: 0, 1: 999, 2: 999, 3: 999, 4: 999 });
  const [statusMessage, setStatusMessage] = useState<string>('Graph ready. Select BFS, DFS, or Dijkstra to animate.');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Adjacency Matrix representation
  const matrix: number[][] = Array(5).fill(0).map(() => Array(5).fill(0));
  edges.forEach((e) => {
    matrix[e.u][e.v] = e.weight;
    matrix[e.v][e.u] = e.weight;
  });

  // Run BFS
  const runBFS = () => {
    setIsAnimating(true);
    setVisitedNodes([]);
    setActiveEdge(null);
    setStatusMessage('Starting BFS from Vertex 0 using a FIFO Queue...');

    const order = [0, 1, 2, 3, 4];
    let i = 0;
    const timer = setInterval(() => {
      if (i < order.length) {
        const curr = order[i];
        setActiveNode(curr);
        setVisitedNodes((prev) => [...prev, curr]);
        setStatusMessage(`BFS: Dequeued vertex ${curr}, inspecting unvisited adjacent neighbors...`);
        i++;
      } else {
        clearInterval(timer);
        setActiveNode(null);
        setIsAnimating(false);
        setStatusMessage('BFS Completed! Explored vertices level-by-level in concentric distance waves.');
      }
    }, 900);
  };

  // Run DFS
  const runDFS = () => {
    setIsAnimating(true);
    setVisitedNodes([]);
    setActiveEdge(null);
    setStatusMessage('Starting DFS from Vertex 0 using LIFO Stack / Recursion...');

    const order = [0, 1, 3, 4, 2];
    let i = 0;
    const timer = setInterval(() => {
      if (i < order.length) {
        const curr = order[i];
        setActiveNode(curr);
        setVisitedNodes((prev) => [...prev, curr]);
        setStatusMessage(`DFS: Deep diving along branch into vertex ${curr}...`);
        i++;
      } else {
        clearInterval(timer);
        setActiveNode(null);
        setIsAnimating(false);
        setStatusMessage('DFS Completed! Explored maximum depth before backtracking.');
      }
    }, 900);
  };

  // Run Dijkstra
  const runDijkstra = () => {
    setIsAnimating(true);
    setVisitedNodes([]);
    setDistances({ 0: 0, 1: 999, 2: 999, 3: 999, 4: 999 });
    setStatusMessage('Dijkstra: Source = 0 (dist=0). All other vertices initialized to ∞.');

    setTimeout(() => {
      setActiveNode(0);
      setVisitedNodes([0]);
      setDistances({ 0: 0, 1: 4, 2: 2, 3: 999, 4: 999 });
      setStatusMessage('From 0: relaxed neighbor 1 (dist=4) and neighbor 2 (dist=2). Minimum unvisited is vertex 2.');
    }, 1200);

    setTimeout(() => {
      setActiveNode(2);
      setVisitedNodes([0, 2]);
      setDistances({ 0: 0, 1: 3, 2: 2, 3: 999, 4: 10 });
      setStatusMessage('From 2: relaxed edge (2,1) weight 1: dist[2] + 1 = 3 < 4! Updated dist[1] = 3. Relaxed edge (2,4) dist[4] = 10.');
    }, 2800);

    setTimeout(() => {
      setActiveNode(1);
      setVisitedNodes([0, 2, 1]);
      setDistances({ 0: 0, 1: 3, 2: 2, 3: 8, 4: 10 });
      setStatusMessage('From 1: relaxed edge (1,3) weight 5: dist[1] + 5 = 8. dist[3] updated to 8.');
    }, 4400);

    setTimeout(() => {
      setActiveNode(3);
      setVisitedNodes([0, 2, 1, 3]);
      setDistances({ 0: 0, 1: 3, 2: 2, 3: 8, 4: 10 });
      setStatusMessage('From 3: relaxed edge (3,4) weight 2: dist[3] + 2 = 10 == dist[4]. Finalizing shortest paths.');
    }, 6000);

    setTimeout(() => {
      setActiveNode(null);
      setVisitedNodes([0, 1, 2, 3, 4]);
      setIsAnimating(false);
      setStatusMessage('Dijkstra Shortest Paths finalized: 0->0=0, 0->1=3, 0->2=2, 0->3=8, 0->4=10.');
    }, 7600);
  };

  const handleReset = () => {
    setActiveNode(null);
    setVisitedNodes([]);
    setActiveEdge(null);
    setDistances({ 0: 0, 1: 999, 2: 999, 3: 999, 4: 999 });
    setIsAnimating(false);
    setStatusMessage('Graph reset to initial state.');
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🕸️ Interactive Graph & Shortest Path Visualizer
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Adjacency matrix vs list representation, BFS queue traversal, DFS recursion, and Dijkstra greedy relaxation.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={runBFS}
          disabled={isAnimating}
          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Animate BFS (Queue)
        </button>
        <button
          onClick={runDFS}
          disabled={isAnimating}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Animate DFS (Stack)
        </button>
        <button
          onClick={runDijkstra}
          disabled={isAnimating}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Animate Dijkstra Shortest Path
        </button>
      </div>

      {/* Status banner */}
      <div className="p-3 mb-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">Algorithm Step: </span>
          <span className="text-slate-600 dark:text-slate-300">{statusMessage}</span>
        </div>
      </div>

      {/* Canvas & Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* SVG Graph Visualizer */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[260px]">
          <svg width="360" height="230" className="overflow-visible">
            {/* Draw Edges */}
            {edges.map((e, idx) => {
              const u = vertices[e.u];
              const v = vertices[e.v];
              const midX = (u.x + v.x) / 2;
              const midY = (u.y + v.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  {/* Edge weight badge */}
                  <rect
                    x={midX - 10}
                    y={midY - 8}
                    width="20"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    stroke="#334155"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {e.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw Vertices */}
            {vertices.map((node) => {
              const isCurr = activeNode === node.id;
              const isVis = visitedNodes.includes(node.id);
              const dist = distances[node.id];

              return (
                <g key={node.id} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    className={`transition-all duration-300 ${
                      isCurr
                        ? 'fill-amber-400 stroke-amber-200 stroke-[3px] filter drop-shadow(0 0 8px rgba(251,191,36,0.6))'
                        : isVis
                        ? 'fill-emerald-600 stroke-emerald-400 stroke-2'
                        : 'fill-slate-800 stroke-slate-600 stroke-2'
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>

                  {/* Dijkstra Tentative Distance tag */}
                  <text
                    x={node.x}
                    y={node.y - 25}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    d={dist === 999 ? '∞' : dist}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Adjacency Matrix & List Side-by-Side */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              Adjacency Matrix (V x V = 5x5)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400">
                    <th className="p-1"></th>
                    <th>0</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-200 dark:border-slate-800/50">
                      <td className="font-bold text-slate-400 p-1">{rIdx}</td>
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-1 ${
                            val > 0
                              ? 'text-cyan-500 font-bold bg-cyan-500/10 rounded'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[11px]">
              Adjacency List (Linked Nodes)
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <div>[0] ➔ (1, w:4) ➔ (2, w:2) ➔ NULL</div>
              <div>[1] ➔ (0, w:4) ➔ (2, w:1) ➔ (3, w:5) ➔ NULL</div>
              <div>[2] ➔ (0, w:2) ➔ (1, w:1) ➔ (4, w:8) ➔ NULL</div>
              <div>[3] ➔ (1, w:5) ➔ (4, w:2) ➔ NULL</div>
              <div>[4] ➔ (2, w:8) ➔ (3, w:2) ➔ NULL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
