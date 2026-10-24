import { UnitInfo } from '../types';

export const UNITS_DATA: UnitInfo[] = [
  {
    id: 1,
    title: 'Unit I — Foundations & Arrays',
    subtitle: 'Data Types, Complexity, 1D/2D/3D Arrays, Searching & Sorting',
    description: 'Master time/space complexity (Big O, Theta, Omega), row-major vs column-major address calculation, sparse matrices, search techniques, and all 6 classical sorting algorithms.',
    topicsCount: 12,
    icon: 'Layers',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Unit II — Linked Lists & Hashing',
    subtitle: 'Singly, Doubly, Circular Lists, Polynomials & Hash Tables',
    description: 'Demystify pointers, dynamic memory allocation (malloc/free), singly/doubly/circular linked lists, polynomial arithmetic, hash collision resolution (chaining & open addressing).',
    topicsCount: 11,
    icon: 'Link',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 3,
    title: 'Unit III — Stacks, Recursion & Queues',
    subtitle: 'LIFO, Infix-to-Postfix, Call Stacks, Hanoi, Circular Queues, Deque',
    description: 'Understand stack operations, prefix/postfix conversions, recursion mechanisms, Tower of Hanoi, circular queue wraparound formula, and priority queues.',
    topicsCount: 12,
    icon: 'Layers3',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 4,
    title: 'Unit IV — Trees & Binary Search Trees',
    subtitle: 'Binary Trees, BST, Traversals, Threaded Trees, AVL, B-Trees & Heaps',
    description: 'Construct binary trees, master Inorder/Preorder/Postorder traversals, BST insert/delete, Huffman coding, AVL rotations, B-Trees, and binary heap operations.',
    topicsCount: 12,
    icon: 'GitFork',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 5,
    title: 'Unit V — Graphs & Algorithms',
    subtitle: 'Adjacency Matrices/Lists, BFS, DFS, MST (Prim/Kruskal), Dijkstra & Warshall',
    description: 'Analyze graph representations, traverse with BFS/DFS, find Minimum Spanning Trees using Prim and Kruskal, compute shortest paths via Dijkstra, and calculate transitive closure with Warshall.',
    topicsCount: 10,
    icon: 'Network',
    color: 'from-amber-500 to-orange-500',
  },
];

export const UNITS = UNITS_DATA;
