import { DifferenceItem, MockTest, UnitId } from '../types';

export const DIFFERENCES_DATA: DifferenceItem[] = [
  {
    id: 'diff-array-linkedlist',
    topicA: 'Array',
    topicB: 'Linked List',
    unit: 1,
    summary: 'Arrays excel at random indexed access and cache locality, while Linked Lists excel at dynamic resizing and O(1) insertions/deletions without element shifting.',
    comparisons: [
      {
        aspect: 'Memory Allocation',
        sideA: 'Contiguous block allocated at compile time (static) or dynamically via malloc.',
        sideB: 'Scattered non-contiguous heap memory allocated node-by-node on demand.'
      },
      {
        aspect: 'Size Flexibility',
        sideA: 'Fixed capacity. Resizing requires allocating a new array and copying all elements.',
        sideB: 'Dynamic. Grows and shrinks smoothly with each insertion and deletion.'
      },
      {
        aspect: 'Element Access Time',
        sideA: 'O(1) random access via formula: BaseAddress + index * size.',
        sideB: 'O(n) sequential access. Must follow pointer links from head.'
      },
      {
        aspect: 'Insertion/Deletion at Beginning',
        sideA: 'Costly: O(n) because all n existing elements must shift right.',
        sideB: 'Instant: O(1) by updating head and newNode->next pointers only.'
      },
      {
        aspect: 'Memory Overhead',
        sideA: 'Zero pointer overhead. Stores only pure data.',
        sideB: 'Stores data PLUS an extra pointer address (4 or 8 bytes) per node.'
      }
    ]
  },
  {
    id: 'diff-stack-queue',
    topicA: 'Stack',
    topicB: 'Queue',
    unit: 3,
    summary: 'Stack enforces Last-In First-Out (LIFO) through a single top pointer; Queue enforces First-In First-Out (FIFO) using separate front and rear pointers.',
    comparisons: [
      {
        aspect: 'Core Principle',
        sideA: 'LIFO (Last In, First Out). The newest item is removed first.',
        sideB: 'FIFO (First In, First Out). The oldest item is removed first.'
      },
      {
        aspect: 'Pointers Maintained',
        sideA: 'Single pointer: top. All pushes and pops happen at top.',
        sideB: 'Two pointers: front (for deletions) and rear (for insertions).'
      },
      {
        aspect: 'Primary Operations',
        sideA: 'push() to add, pop() to remove, peek() to inspect top.',
        sideB: 'enqueue() to add at rear, dequeue() to remove from front.'
      },
      {
        aspect: 'Key Real-World Applications',
        sideA: 'Function call stack, undo/redo in text editors, expression conversion.',
        sideB: 'CPU task scheduling, printer print queues, breadth-first search (BFS).'
      }
    ]
  },
  {
    id: 'diff-bfs-dfs',
    topicA: 'Breadth-First Search (BFS)',
    topicB: 'Depth-First Search (DFS)',
    unit: 5,
    summary: 'BFS expands horizontally in concentric waves using a Queue; DFS plunges vertically down a branch until dead-end using a Stack or recursion.',
    comparisons: [
      {
        aspect: 'Auxiliary Data Structure',
        sideA: 'Queue (FIFO).',
        sideB: 'Stack (LIFO) or System Call Stack.'
      },
      {
        aspect: 'Traversal Strategy',
        sideA: 'Explores level by level (nodes at distance 1, then distance 2, etc.).',
        sideB: 'Explores as deep as possible along each path before backtracking.'
      },
      {
        aspect: 'Shortest Path Property',
        sideA: 'Guarantees the shortest path in unweighted graphs.',
        sideB: 'Does NOT guarantee the shortest path.'
      },
      {
        aspect: 'Backtracking',
        sideA: 'No backtracking required.',
        sideB: 'Extensive backtracking when dead ends are encountered.'
      },
      {
        aspect: 'Key Applications',
        sideA: 'Finding shortest path, GPS navigation, peer-to-peer network discovery.',
        sideB: 'Cycle detection, topological sorting, maze solving, connected components.'
      }
    ]
  },
  {
    id: 'diff-prim-kruskal',
    topicA: 'Prim\'s Algorithm',
    topicB: 'Kruskal\'s Algorithm',
    unit: 5,
    summary: 'Both find Minimum Spanning Trees (MST) in weighted graphs using greedy strategies, but Prim grows a single tree vertex-by-vertex while Kruskal picks global lightest edges.',
    comparisons: [
      {
        aspect: 'Starting Point',
        sideA: 'Starts from an arbitrary chosen source vertex and grows a single tree.',
        sideB: 'Starts with all vertices disconnected and sorts all edges globally.'
      },
      {
        aspect: 'Graph Suitability',
        sideA: 'Better for DENSE graphs with many edges (E ≈ V²).',
        sideB: 'Better for SPARSE graphs with few edges (E ≈ V).'
      },
      {
        aspect: 'Cycle Handling',
        sideA: 'Inherently avoids cycles by always choosing edges connecting to outside vertices.',
        sideB: 'Explicit cycle detection required using Disjoint Set Union (DSU).'
      },
      {
        aspect: 'Time Complexity',
        sideA: 'O(V²) with adjacency matrix or O(E log V) with min-heap.',
        sideB: 'O(E log E) or O(E log V) dominated by sorting edges.'
      }
    ]
  }
];

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-unit-1-2',
    unitId: 1,
    title: 'Mid-Term Exam Simulator (Units I & II)',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'mq-1',
        topic: 'Complexity',
        marks: 2,
        question: 'Which of the following functions grows fastest as n -> infinity?',
        options: ['O(n²)', 'O(2ⁿ)', 'O(n log n)', 'O(n³)'],
        correctIndex: 1,
        explanation: 'Exponential growth 2ⁿ grows drastically faster than any polynomial function nᵏ.'
      },
      {
        id: 'mq-2',
        topic: 'Arrays',
        marks: 2,
        question: 'In row-major order for 2D array A[10][20] starting at address 2000 with 4-byte integers, address of A[3][5] (0-indexed) is:',
        options: ['2260', '2140', '2240', '2300'],
        correctIndex: 0,
        explanation: 'Address = 2000 + 4 * (3 * 20 + 5) = 2000 + 4 * (60 + 5) = 2000 + 4 * 65 = 2000 + 260 = 2260.'
      },
      {
        id: 'mq-3',
        topic: 'Linked List',
        marks: 2,
        question: 'To delete the node after node p in a singly linked list, which C statement is correct?',
        options: [
          'p = p->next;',
          'temp = p->next; p->next = temp->next; free(temp);',
          'free(p->next); p->next = NULL;',
          'p->next = p;'
        ],
        correctIndex: 1,
        explanation: 'We store pointer to the node to be deleted in temp, link p->next past it to temp->next, then free(temp).'
      },
      {
        id: 'mq-4',
        topic: 'Sorting',
        marks: 2,
        question: 'Which sorting algorithm divides the array into sorted and unsorted parts, picking the minimum from unsorted each pass?',
        options: ['Selection Sort', 'Insertion Sort', 'Bubble Sort', 'Quick Sort'],
        correctIndex: 0,
        explanation: 'Selection Sort repeatedly finds (selects) the minimum element from the unsorted sublist and swaps it to the front.'
      },
      {
        id: 'mq-5',
        topic: 'Hashing',
        marks: 2,
        question: 'What is the load factor λ of a hash table with 100 slots containing 70 keys?',
        options: ['0.7', '1.42', '7.0', '700'],
        correctIndex: 0,
        explanation: 'Load Factor λ = Number of keys / Number of slots = 70 / 100 = 0.7.'
      }
    ]
  },
  {
    id: 'mock-full-exam',
    title: 'University End-Semester Comprehensive Mock Examination (All Units)',
    durationMinutes: 30,
    totalMarks: 50,
    questions: [
      {
        id: 'fq-1',
        topic: 'Big-O',
        marks: 5,
        question: 'What is the tight bound time complexity of building a heap from an unsorted array of n elements (heapify)?',
        options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Building a heap bottom-up takes O(n) linear time because most nodes are near the leaves and require few down-heap swaps.'
      },
      {
        id: 'fq-2',
        topic: 'Stack',
        marks: 5,
        question: 'What is the postfix representation of the infix expression: (A + B) * (C - D)?',
        options: ['A B + C D - *', '* + A B - C D', 'A B + * C D -', 'A B C D + - *'],
        correctIndex: 0,
        explanation: '(A + B) becomes AB+. (C - D) becomes CD-. Multiplying them yields AB+ CD- *.'
      },
      {
        id: 'fq-3',
        topic: 'Trees',
        marks: 5,
        question: 'In a complete binary tree of height h with root at level 0, what is the maximum number of nodes?',
        options: ['2^(h+1) - 1', '2^h', '2h + 1', '2^(h-1)'],
        correctIndex: 0,
        explanation: 'Sum of geometric series 2⁰ + 2¹ + ... + 2ʰ = 2^(h+1) - 1.'
      },
      {
        id: 'fq-4',
        topic: 'Graphs',
        marks: 5,
        question: 'Dijkstra\'s algorithm is based on which algorithmic design paradigm?',
        options: ['Greedy Approach', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking'],
        correctIndex: 0,
        explanation: 'Dijkstra always greedily selects the unvisited node with the smallest tentative distance.'
      },
      {
        id: 'fq-5',
        topic: 'Queues',
        marks: 5,
        question: 'What is the full condition for a circular queue with array indices 0 to MAX-1?',
        options: [
          '(rear + 1) % MAX == front',
          'rear == front',
          'rear == MAX - 1',
          'front == 0 && rear == MAX'
        ],
        correctIndex: 0,
        explanation: 'When advancing rear by 1 with modulo reaches front, all slots are filled.'
      }
    ]
  }
];

export const LAST_MINUTE_REVISION_TIPS = [
  {
    title: 'Row-Major Address Calculation',
    formula: 'Address(A[i][j]) = BaseAddress + W * [(i - Lr) * N + (j - Lc)]',
    tip: 'N is the number of COLUMNS (Uc - Lc + 1). In exams, always show Lr, Lc, and calculate N first!'
  },
  {
    title: 'Column-Major Address Calculation',
    formula: 'Address(A[i][j]) = BaseAddress + W * [(j - Lc) * M + (i - Lr)]',
    tip: 'M is the number of ROWS (Ur - Lr + 1). Multiply column index by M!'
  },
  {
    title: 'Circular Queue Wrap-Around',
    formula: 'rear = (rear + 1) % MAX ; front = (front + 1) % MAX',
    tip: 'Full condition: (rear + 1) % MAX == front. Empty condition: front == -1.'
  },
  {
    title: 'Tower of Hanoi Total Moves',
    formula: 'Total Moves = 2ⁿ - 1',
    tip: 'For 3 disks = 7 moves. For 4 disks = 15 moves. Always state recurrence T(n) = 2T(n-1) + 1.'
  },
  {
    title: 'Inorder Traversal on BST',
    formula: 'Inorder(BST) = Strictly Ascending Sorted Order',
    tip: 'Examiner favorite: If Inorder is given, you instantly know the sorted order of keys.'
  },
  {
    title: 'Spanning Tree Edge Count',
    formula: 'Edges in Spanning Tree = V - 1',
    tip: 'For a graph with V vertices, any spanning tree must have exactly V - 1 edges and 0 cycles.'
  },
  {
    title: 'AVL Balance Factor',
    formula: 'BF(Node) = Height(Left Subtree) - Height(Right Subtree)',
    tip: 'Valid values: -1, 0, +1. If +2 or -2: identify LL (Right Rotate), RR (Left Rotate), LR, or RL.'
  },
  {
    title: 'Warshall\'s Transitive Closure',
    formula: 'W^(k)[i][j] = W^(k-1)[i][j] OR (W^(k-1)[i][k] AND W^(k-1)[k][j])',
    tip: 'Three nested loops: k from 0 to n-1, then i, then j. Represents path through intermediate node k.'
  }
];
