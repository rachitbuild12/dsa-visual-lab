import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // UNIT 1: FOUNDATIONS & ARRAYS
  {
    id: 'pq-1',
    type: 'output',
    unit: 1,
    topicId: 'arrays',
    difficulty: 'Easy',
    question: 'What is the output of the following C code snippet?',
    codeSnippet: `int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;
printf("%d", *(p + 3));`,
    options: ['10', '30', '40', '50'],
    correctAnswer: 2,
    explanation: 'Pointer arithmetic: arr decays to &arr[0]. p + 3 points to arr[3], which is 40. Dereferencing *(p + 3) gives 40.'
  },
  {
    id: 'pq-2',
    type: 'mcq',
    unit: 1,
    topicId: 'complexity',
    difficulty: 'Medium',
    question: 'What is the worst-case time complexity of Quick Sort when elements are already sorted and the last element is chosen as pivot?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correctAnswer: 1,
    explanation: 'When already sorted and extreme element is chosen as pivot, partitions become completely unbalanced (sizes 0 and n-1), resulting in O(n²) worst-case performance.'
  },
  {
    id: 'pq-3',
    type: 'fill-blank',
    unit: 1,
    topicId: 'arrays',
    difficulty: 'Exam Level',
    question: 'In a 2D array A[M][N] stored in Row-Major order starting at Base Address BA with element size W, the address formula for A[i][j] (0-indexed) is: BA + W * (____ + j)',
    options: ['i * M', 'i * N', 'j * M', 'j * N'],
    correctAnswer: 1,
    explanation: 'In Row-Major order, each of the i preceding rows contains N columns, so we skip i * N elements before adding column offset j.'
  },
  {
    id: 'pq-4',
    type: 'trace',
    unit: 1,
    topicId: 'sorting',
    difficulty: 'Medium',
    question: 'Given the array [5, 1, 4, 2, 8], what is the array state after Pass 1 of standard Bubble Sort (ascending)?',
    options: ['[1, 5, 4, 2, 8]', '[1, 4, 2, 5, 8]', '[1, 2, 4, 5, 8]', '[5, 4, 2, 1, 8]'],
    correctAnswer: 1,
    explanation: 'Comparing pairs: (5,1)->swap [1,5,4,2,8]; (5,4)->swap [1,4,5,2,8]; (5,2)->swap [1,4,2,5,8]; (5,8)->no swap. Final after pass 1: [1, 4, 2, 5, 8]. The largest element (8) is now in place.'
  },

  // UNIT 2: LINKED LISTS & HASHING
  {
    id: 'pq-5',
    type: 'output',
    unit: 2,
    topicId: 'linked-list',
    difficulty: 'Medium',
    question: 'What is the output of the following linked list operation snippet?',
    codeSnippet: `struct Node { int val; struct Node* next; };
// List: 10 -> 20 -> 30 -> NULL (head at 10)
struct Node* p = head;
p->next = p->next->next;
// printf("%d", head->next->val);`,
    options: ['20', '30', '10', 'Segmentation Fault'],
    correctAnswer: 1,
    explanation: 'p is head (10). p->next was 20. By setting p->next = p->next->next, head->next now bypasses 20 and points to 30. Printing head->next->val yields 30.'
  },
  {
    id: 'pq-6',
    type: 'mcq',
    unit: 2,
    topicId: 'hashing',
    difficulty: 'Easy',
    question: 'In a hash table using open addressing with linear probing, what phenomenon occurs when long sequences of occupied slots form, degrading search performance?',
    options: ['Thrashing', 'Primary Clustering', 'Secondary Clustering', 'Dangling Pointers'],
    correctAnswer: 1,
    explanation: 'Primary clustering occurs in linear probing because any key that hashes to any slot in an occupied cluster lengthens that cluster.'
  },
  {
    id: 'pq-7',
    type: 'mcq',
    unit: 2,
    topicId: 'linked-list',
    difficulty: 'Exam Level',
    question: 'Why does inserting at the beginning of a Singly Linked List take O(1) time whereas inserting at the beginning of an Array takes O(n) time?',
    options: [
      'Arrays use more RAM than linked lists',
      'Arrays require shifting all n existing elements right by one position; linked lists only update 2 pointer addresses',
      'Linked lists are always cached in CPU registers',
      'Pointers operate in parallel hardware'
    ],
    correctAnswer: 1,
    explanation: 'In contiguous arrays, inserting at index 0 requires shifting all existing n elements one spot right to make room. In linked lists, we simply allocate a node, point its next to head, and update head in O(1) without shifting anything!'
  },

  // UNIT 3: STACKS, RECURSION & QUEUES
  {
    id: 'pq-8',
    type: 'trace',
    unit: 3,
    topicId: 'stack',
    difficulty: 'Exam Level',
    question: 'Evaluate the postfix expression: "6 2 / 3 + 4 *" using a stack. What is the final value?',
    options: ['24', '18', '20', '16'],
    correctAnswer: 0,
    explanation: 'Tokens: 6, 2: stack=[6,2]. Op "/": 6/2=3. stack=[3]. Token 3: stack=[3,3]. Op "+": 3+3=6. stack=[6]. Token 4: stack=[6,4]. Op "*": 6*4=24. Final result is 24.'
  },
  {
    id: 'pq-9',
    type: 'mcq',
    unit: 3,
    topicId: 'queue',
    difficulty: 'Medium',
    question: 'In a circular queue of capacity MAX = 6, if front = 4 and rear = 3, what is the state of the queue?',
    options: ['Queue is empty', 'Queue is full', 'Contains 2 items', 'Invalid state'],
    correctAnswer: 1,
    explanation: '(rear + 1) % MAX = (3 + 1) % 6 = 4 == front. Therefore, the circular queue is completely full.'
  },
  {
    id: 'pq-10',
    type: 'output',
    unit: 3,
    topicId: 'recursion',
    difficulty: 'Medium',
    question: 'What is returned by this recursive C function for mystery(4)?',
    codeSnippet: `int mystery(int n) {
    if (n <= 1) return 1;
    return n * mystery(n - 1);
}`,
    options: ['10', '24', '12', '16'],
    correctAnswer: 1,
    explanation: 'This is the factorial function: mystery(4) = 4 * 3 * 2 * 1 = 24.'
  },

  // UNIT 4: TREES & BST
  {
    id: 'pq-11',
    type: 'mcq',
    unit: 4,
    topicId: 'tree',
    difficulty: 'Easy',
    question: 'Given a Binary Tree with Preorder: "A B D E C" and Inorder: "D B E A C", which node is the root?',
    options: ['D', 'B', 'A', 'C'],
    correctAnswer: 2,
    explanation: 'In Preorder traversal (Root -> Left -> Right), the very first symbol is always the overall root of the tree: Node A.'
  },
  {
    id: 'pq-12',
    type: 'mcq',
    unit: 4,
    topicId: 'tree',
    difficulty: 'Exam Level',
    question: 'If a node in a Binary Search Tree has two children, which node is used to replace it during deletion?',
    options: [
      'Inorder Successor (min in right subtree) or Inorder Predecessor (max in left subtree)',
      'Any random leaf node',
      'The left child directly',
      'The root of the tree'
    ],
    correctAnswer: 0,
    explanation: 'Replacing with the Inorder Successor or Inorder Predecessor preserves the fundamental BST property that all left descendants < node < all right descendants.'
  },
  {
    id: 'pq-13',
    type: 'mcq',
    unit: 4,
    topicId: 'tree',
    difficulty: 'Medium',
    question: 'In an AVL Tree, if an insertion into the right subtree of the left child causes an imbalance (+2), what type of rotation is required?',
    options: ['Single Left Rotation (RR)', 'Single Right Rotation (LL)', 'Left-Right Double Rotation (LR)', 'Right-Left Double Rotation (RL)'],
    correctAnswer: 2,
    explanation: 'Right subtree of Left child is an LR imbalance. It requires an LR double rotation: first a left rotation on the left child, followed by a right rotation on the parent.'
  },

  // UNIT 5: GRAPHS & ALGORITHMS
  {
    id: 'pq-14',
    type: 'mcq',
    unit: 5,
    topicId: 'graph',
    difficulty: 'Medium',
    question: 'Which algorithm is used to find the Transitive Closure of a directed graph in O(V³) time?',
    options: ['Dijkstra\'s Algorithm', 'Warshall\'s Algorithm', 'Kruskal\'s Algorithm', 'Prim\'s Algorithm'],
    correctAnswer: 1,
    explanation: 'Warshall\'s algorithm uses dynamic programming with three nested loops to compute reachability matrix W^(k)[i][j] in O(V³) time.'
  },
  {
    id: 'pq-15',
    type: 'mcq',
    unit: 5,
    topicId: 'graph',
    difficulty: 'Exam Level',
    question: 'Why does Dijkstra\'s algorithm fail on graphs with negative edge weights?',
    options: [
      'It cannot divide by negative numbers',
      'It greedily assumes once a vertex is marked visited, its shortest distance is finalized and can never decrease',
      'The queue overflows',
      'Adjacency matrices cannot store negative values in C'
    ],
    correctAnswer: 1,
    explanation: 'Dijkstra is a greedy algorithm. Once a vertex is finalized in the visited set, Dijkstra never re-checks it. A negative edge encountered later could produce a shorter path, invalidating Dijkstra\'s greedy guarantee.'
  }
];
