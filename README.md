# DSA Visual Lab — Pass with Confidence
> **"See It. Understand It. Code It. Pass It."**

A complete, beginner-friendly, interactive Data Structures and Algorithms (DSA) learning platform engineered specifically for first- and second-year B.Tech CSE/AIML college students preparing for university theory and practical examinations (MCS-301 Syllabus).

---

## 🌟 Key Features

### 1. Interactive Visualizer Engine (No Static Pictures)
Genuine dynamic interactive animations with step-by-step playback, speed sliders, custom values, and synchronized C code highlights:
- **Linked Lists**: Singly, Doubly, and Circular Linked Lists with simulated heap memory addresses (`0x10A4`), pointer update order safety explanations, and insert/delete operations.
- **Stacks (LIFO)**: Array-based with fixed `MAX` vs Dynamic Linked List stack, live top pointer tracking, overflow and underflow demonstration.
- **Queues (FIFO)**: Linear queue false overflow demonstration vs Circular queue modulo wraparound `(rear + 1) % MAX`.
- **Arrays & Search**: Contiguous memory cell index representation, insertion shifting cost, linear scan vs divide-and-conquer binary search (low, mid, high).
- **Recursion & Hanoi**: Function call stack frames (arguments, return addresses, winding vs unwinding) + interactive Tower of Hanoi with animated disks moving across pegs A, B, and C (formula $2^n - 1$).
- **Trees & BST**: Dynamic SVG binary search tree rendering, BST property enforcement, search path tracing, and animated Inorder (sorted), Preorder, and Postorder traversals.
- **Graphs**: Side-by-side Adjacency Matrix and Adjacency List representations, BFS queue traversal, DFS stack traversal, and Dijkstra greedy shortest path edge relaxation.
- **Sorting Lab**: Bubble, Selection, and Insertion Sort with comparative bar heights, comparison/swap counters, and stability tracking.
- **Hashing**: Hash index calculation $h(k) = k \bmod 7$, collision handling via Open Addressing (Linear Probing) vs Open Hashing (Separate Chaining).

### 2. Universal 11-Step Pedagogical Format
Every concept is taught with zero assumed knowledge:
1. **"What is it?"** — Simple jargon-free definition (with instant English & Hinglish toggle).
2. **"Imagine this"** — Memorable real-life analogy.
3. **"See it"** — Live interactive visualization.
4. **"Understand it"** — Numbered logical breakdown.
5. **"Write it"** — Clean pseudocode algorithm.
6. **"Code it"** — Complete, compilable C implementation (C99 / GCC compatible).
7. **"Understand the code"** — Line-by-line pointer and memory breakdown.
8. **"Analyze it"** — Best, average, and worst-case Big-O with mathematical reasoning.
9. **"Exam answer"** — Exact 2-mark and 5-mark templates ready for university answer sheets.
10. **"Common mistakes"** — Traps students fall into and how to fix them.
11. **"Test yourself"** — Self-check question with instant explanation.

### 3. Integrated C Code Playground
- Step-by-step C execution simulator.
- Variable memory table (RAM snapshot).
- Standard output console.
- "Predict the Output" exam exercises.
- One-click C code copy functionality.

### 4. University Exam Preparation Center
- **Last-Minute Formula Sheet**: The 8 golden exam formulas (Row-Major/Column-Major address calculation, Circular Queue wraparound, Hanoi moves, BST traversal rules, Warshall transitive closure).
- **High-Yield 5-Mark Comparison Tables**: Array vs Linked List, Stack vs Queue, BFS vs DFS, Prim vs Kruskal.
- **Mock Test Simulator**: Timed multi-question mock exams with marks, scoring, and complete model answer explanations.

### 5. Gamification & Diagnostics
- **Daily Learning Streak**: Encouraging habit formation without punitive streak loss.
- **XP Points System**: +40 XP per completed lesson, +15 XP per correct quiz answer, +5 XP for reviewing mistakes.
- **Achievement Badges**: *First Step*, *Pointer Beginner*, *Stack Master*, *Recursion Explorer*, *Tree Traversal Pro*, *Graph Explorer*, *Quiz Whiz*, *Exam Ready*.
- **Weak Topics Diagnostics**: Analyzes your actual quiz mistakes to generate a personalized revision checklist.
- **Local Storage Persistence**: Works 100% offline without requiring sign-up or API keys.

---

## 📚 Complete Syllabus Coverage (MCS-301)

- **UNIT I: Foundations & Arrays**
  - Time & space complexity, Asymptotic notations (Big O, Big Theta, Big Omega), time-space trade-offs.
  - 1D, 2D, 3D arrays, Row-Major vs Column-Major memory storage and address calculation formulas.
  - Searching (Linear Search, Binary Search) and Sorting (Bubble, Selection, Insertion, Quick, Merge, Radix).
- **UNIT II: Linked Lists & Hashing**
  - Singly, Doubly, and Circular Linked Lists; pointer manipulation, dynamic memory (`malloc`, `free`).
  - Polynomial representation and addition using linked lists.
  - Hash tables, collision resolution (Linear Probing, Quadratic Probing, Double Hashing, Separate Chaining).
- **UNIT III: Stacks, Recursion & Queues**
  - Stack ADT, push/pop/peek, overflow/underflow, array vs linked-list implementations.
  - Expression conversion (Infix to Postfix) and Postfix evaluation.
  - Recursion mechanisms, call stack frames, Tower of Hanoi mathematical proof.
  - Linear Queue space wastage problem vs Circular Queue wraparound `(rear + 1) % MAX`.
- **UNIT IV: Trees**
  - Binary Trees, strictly binary, complete binary, tree representations.
  - Binary Search Trees (BST): insertion, searching, 3 deletion cases (leaf, 1 child, 2 children / inorder successor).
  - Tree traversals (Inorder, Preorder, Postorder).
  - AVL trees, balance factor, 4 rotations (LL, RR, LR, RL), heaps and heap sort.
- **UNIT V: Graphs**
  - Directed, undirected, weighted graphs; Adjacency Matrix vs Adjacency List.
  - Traversals: Breadth-First Search (BFS with Queue) and Depth-First Search (DFS with Stack).
  - Minimum Spanning Trees (MST): Prim's Algorithm vs Kruskal's Algorithm.
  - Shortest Path: Dijkstra's Algorithm with edge relaxation.
  - Transitive Closure: Warshall's algorithm.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS with custom Dark Navy design system (`#060d17`, `#0a192f`, cyan & indigo accents)
- **Icons**: Lucide React
- **Animations / Effects**: Canvas-Confetti, Tailwind transitions
- **Storage**: LocalStorage with automatic hydration & state reconciliation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or 20+)
- npm (version 9+)

### Installation
```bash
# Clone or navigate into project directory
cd d:/Colleges/DS

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
The website will start at `http://localhost:5173`. Open this URL in any browser.

### Building for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### Previewing the Production Build
```bash
npm run preview
```

---

## 🔒 Security & Execution Philosophy

- **Zero Arbitrary Execution Risk**: This product utilizes a deterministic step simulator for C execution rather than executing arbitrary student code on the server, guaranteeing complete safety and zero backend vulnerabilities.
- **No External Paid AI Dependencies**: All syllabus explanations, analogies, Hinglish translations, algorithms, and exam answers are embedded locally. The app runs 100% offline without requiring paid API keys or user sign-in.
