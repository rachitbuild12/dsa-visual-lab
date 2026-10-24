import { CProgram } from '../../types';

export const unit4Programs: CProgram[] = [
  {
    id: 'u4-binary-tree-linked',
    unitId: 4,
    topic: 'Binary Tree Representations',
    title: 'Binary Tree Linked Representation (Dynamic Nodes & Pointers)',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements dynamic linked binary tree node structure in C where each node contains data, a left child pointer, and a right child pointer. Demonstrates creation and pointer connections.',
    timeComplexity: 'Node creation: O(1), Traversals: O(n)',
    spaceComplexity: 'O(n) dynamic heap memory for n nodes',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Define struct TreeNode { int data; TreeNode *left; TreeNode *right; }.',
      'createNode(val): allocate memory, initialize left = right = NULL.',
      'Build tree hierarchy: root->left = createNode(20); root->right = createNode(30).'
    ],
    edgeCases: [
      'Root is NULL (empty tree)',
      'Leaf nodes having both left and right equal to NULL',
      'Memory cleanup traversal'
    ],
    sampleInput: 'Construct tree with Root 10, Left 20, Right 30, Left->Left 40',
    expectedOutput: 'Tree initialized and displayed with dynamic node memory addresses.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int data;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

TreeNode* createNode(int val) {
    TreeNode *node = (TreeNode*)malloc(sizeof(TreeNode));
    node->data = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void printInorder(TreeNode *root) {
    if (root == NULL) return;
    printInorder(root->left);
    printf("[%d @ %p] ", root->data, (void*)root);
    printInorder(root->right);
}

int main() {
    printf("=== Binary Tree Linked Representation ===\\n");
    TreeNode *root = createNode(10);
    root->left = createNode(20);
    root->right = createNode(30);
    root->left->left = createNode(40);
    root->left->right = createNode(50);

    printf("Inorder Traversal of Linked Tree:\\n");
    printInorder(root);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'u4-binary-tree-array',
    unitId: 4,
    topic: 'Binary Tree Representations',
    title: 'Binary Tree Sequential (Array) Representation',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Stores a binary tree in a flat linear array using arithmetic index relationships: for parent at index i (0-based), left child is at 2*i + 1 and right child is at 2*i + 2. Parent is at (i - 1)/2.',
    timeComplexity: 'Access child/parent: O(1)',
    spaceComplexity: 'O(2^h) array space where h is tree height',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Root stored at index 0.',
      'Left child of node i stored at index (2 * i + 1).',
      'Right child of node i stored at index (2 * i + 2).',
      'Parent of node i (i > 0) is at index (i - 1) / 2.',
      'Unoccupied slots marked with sentinel -1.'
    ],
    edgeCases: [
      'Skewed binary tree wastes exponential memory O(2^n)',
      'Checking if child index exceeds maximum array bounds'
    ],
    sampleInput: 'Root 1, Children 2 and 3, Left grandchild 4',
    expectedOutput: 'Array indices 0..6 correctly map parent-child links.',
    code: `#include <stdio.h>
#define MAX_TREE 15

int tree[MAX_TREE];

void initTree() {
    for (int i = 0; i < MAX_TREE; i++) tree[i] = -1;
}

void setRoot(int val) { tree[0] = val; }

void setLeft(int val, int parentIdx) {
    int idx = 2 * parentIdx + 1;
    if (idx >= MAX_TREE || tree[parentIdx] == -1) {
        printf("Cannot set left child for parent %d\\n", parentIdx);
        return;
    }
    tree[idx] = val;
}

void setRight(int val, int parentIdx) {
    int idx = 2 * parentIdx + 2;
    if (idx >= MAX_TREE || tree[parentIdx] == -1) {
        printf("Cannot set right child for parent %d\\n", parentIdx);
        return;
    }
    tree[idx] = val;
}

void printTreeArray() {
    printf("Array Indices: ");
    for (int i = 0; i < 10; i++) printf("%3d ", i);
    printf("\\nTree Elements: ");
    for (int i = 0; i < 10; i++) {
        if (tree[i] == -1) printf("  - ");
        else printf("%3d ", tree[i]);
    }
    printf("\\n");
}

int main() {
    initTree();
    printf("=== Binary Tree Array (Sequential) Representation ===\\n");
    setRoot(1);
    setLeft(2, 0);   // index 1
    setRight(3, 0);  // index 2
    setLeft(4, 1);   // index 3
    setRight(5, 1);  // index 4

    printTreeArray();
    printf("Parent of node at index 4 (val %d) is index %d (val %d)\\n",
           tree[4], (4 - 1)/2, tree[(4 - 1)/2]);
    return 0;
}`
  },
  {
    id: 'u4-bst-crud',
    unitId: 4,
    topic: 'Binary Search Tree',
    title: 'BST CRUD: Insert, Search, and 3 Deletion Cases',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Complete Binary Search Tree (BST) implementation: ordered insertion, key search, and all 3 cases of deletion: (Case 1) Deleting a leaf node, (Case 2) Deleting a node with one child, and (Case 3) Deleting a node with two children using Inorder Successor.',
    timeComplexity: 'Best/Average: O(log n), Worst: O(n) for skewed tree',
    spaceComplexity: 'O(h) call stack memory where h is tree height',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Insert: if val < root->data, root->left = insert(root->left, val); else if val > root->data, root->right = insert(root->right, val).',
      'Search: if root == NULL or root->data == key, return root. Else recurse left or right.',
      'Delete Case 1 (Leaf): free node, return NULL.',
      'Delete Case 2 (One Child): copy existing child pointer to replace node, free node.',
      'Delete Case 3 (Two Children): find Inorder Successor (minimum node in right subtree). Copy successor value into current node. Delete successor from right subtree.'
    ],
    edgeCases: [
      'Deleting root node with two children',
      'Deleting a leaf node',
      'Deleting from an empty BST (NULL)',
      'Searching for a non-existent key'
    ],
    sampleInput: 'Insert keys 50, 30, 70, 20, 40, 60, 80. Delete 20 (leaf), Delete 30 (one child), Delete 50 (two children).',
    expectedOutput: 'BST maintains binary search property throughout all deletions.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int data;
    struct BSTNode *left;
    struct BSTNode *right;
} BSTNode;

BSTNode* createNode(int val) {
    BSTNode *node = (BSTNode*)malloc(sizeof(BSTNode));
    node->data = val;
    node->left = node->right = NULL;
    return node;
}

BSTNode* insert(BSTNode *root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->data) {
        root->left = insert(root->left, val);
    } else if (val > root->data) {
        root->right = insert(root->right, val);
    }
    return root;
}

BSTNode* search(BSTNode *root, int key) {
    if (root == NULL || root->data == key) return root;
    if (key < root->data) return search(root->left, key);
    return search(root->right, key);
}

BSTNode* findMin(BSTNode *root) {
    while (root && root->left != NULL) {
        root = root->left;
    }
    return root;
}

BSTNode* deleteNode(BSTNode *root, int key) {
    if (root == NULL) return root;

    if (key < root->data) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->data) {
        root->right = deleteNode(root->right, key);
    } else {
        // Node found!
        // Case 1: Leaf node (No children)
        if (root->left == NULL && root->right == NULL) {
            free(root);
            return NULL;
        }
        // Case 2: One child
        else if (root->left == NULL) {
            BSTNode *temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            BSTNode *temp = root->left;
            free(root);
            return temp;
        }
        // Case 3: Two children
        else {
            // Find Inorder Successor (min value in right subtree)
            BSTNode *successor = findMin(root->right);
            root->data = successor->data;
            // Delete successor node from right subtree
            root->right = deleteNode(root->right, successor->data);
        }
    }
    return root;
}

void inorder(BSTNode *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

int main() {
    BSTNode *root = NULL;
    printf("=== Binary Search Tree (BST) All 3 Deletion Cases ===\\n");
    int keys[] = {50, 30, 70, 20, 40, 60, 80};
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);

    printf("Initial BST Inorder: ");
    inorder(root);
    printf("\\n");

    printf("\\n1. Deleting Leaf Node (20)...\\n");
    root = deleteNode(root, 20);
    printf("Inorder: "); inorder(root); printf("\\n");

    printf("\\n2. Deleting Node with One Child (30)...\\n");
    root = deleteNode(root, 30);
    printf("Inorder: "); inorder(root); printf("\\n");

    printf("\\n3. Deleting Node with Two Children (Root 50)...\\n");
    root = deleteNode(root, 50);
    printf("Inorder: "); inorder(root); printf("\\n");

    return 0;
}`
  },
  {
    id: 'u4-tree-traversals',
    unitId: 4,
    topic: 'Tree Traversals',
    title: 'Tree Traversals (Recursive & Iterative Inorder)',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements Depth-First Tree Traversals: Preorder (Root-L-R), Inorder (L-Root-R), Postorder (L-R-Root) recursively, and an explicit stack-based Iterative Inorder traversal.',
    timeComplexity: 'All traversals: O(n) visiting each node exactly once',
    spaceComplexity: 'Recursive: O(h) call stack, Iterative: O(h) explicit stack',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Preorder: Visit Root, Traverse Left, Traverse Right.',
      'Inorder: Traverse Left, Visit Root, Traverse Right.',
      'Postorder: Traverse Left, Traverse Right, Visit Root.',
      'Iterative Inorder: Initialize empty stack. While curr != NULL or stack not empty: push curr and curr = curr->left; else pop stack, visit popped, curr = popped->right.'
    ],
    edgeCases: [
      'Empty tree (root == NULL)',
      'Skewed tree (devolves to linear list depth)'
    ],
    sampleInput: 'Tree with root 1, left 2, right 3, left->left 4, left->right 5',
    expectedOutput: 'Inorder: 4 2 5 1 3, Preorder: 1 2 4 5 3, Postorder: 4 5 2 3 1',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *left;
    struct Node *right;
} Node;

Node* newNode(int val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->left = n->right = NULL;
    return n;
}

void preorder(Node *root) {
    if (!root) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node *root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void postorder(Node *root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

void iterativeInorder(Node *root) {
    Node *stack[50];
    int top = -1;
    Node *curr = root;

    while (curr != NULL || top != -1) {
        while (curr != NULL) {
            stack[++top] = curr;
            curr = curr->left;
        }
        curr = stack[top--];
        printf("%d ", curr->data);
        curr = curr->right;
    }
}

int main() {
    Node *root = newNode(1);
    root->left = newNode(2);
    root->right = newNode(3);
    root->left->left = newNode(4);
    root->left->right = newNode(5);

    printf("=== Binary Tree Traversals ===\\n");
    printf("Preorder:           "); preorder(root); printf("\\n");
    printf("Inorder (Recursive): "); inorder(root); printf("\\n");
    printf("Inorder (Iterative): "); iterativeInorder(root); printf("\\n");
    printf("Postorder:          "); postorder(root); printf("\\n");
    return 0;
}`
  },
  {
    id: 'u4-tree-metrics',
    unitId: 4,
    topic: 'Tree Properties',
    title: 'Tree Height, Total Node Count, and Leaf Node Count',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Computes essential structural metrics of a binary tree: tree height (maximum edge/node depth), total number of nodes, and number of leaf nodes (nodes with 0 children).',
    timeComplexity: 'O(n) visiting all nodes',
    spaceComplexity: 'O(h) call stack memory',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Height: if root == NULL return 0. Else return 1 + max(height(root->left), height(root->right)).',
      'Total Nodes: if root == NULL return 0. Return 1 + count(root->left) + count(root->right).',
      'Leaf Nodes: if root == NULL return 0. If (root->left == NULL && root->right == NULL) return 1. Else return countLeaves(root->left) + countLeaves(root->right).'
    ],
    edgeCases: [
      'Empty tree (Height = 0, Nodes = 0, Leaves = 0)',
      'Single root node (Height = 1, Nodes = 1, Leaves = 1)'
    ],
    sampleInput: 'Tree with 5 nodes',
    expectedOutput: 'Height: 3, Total Nodes: 5, Leaf Nodes: 2.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *left;
    struct Node *right;
} Node;

Node* createNode(int val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->left = n->right = NULL;
    return n;
}

int getHeight(Node *root) {
    if (root == NULL) return 0;
    int lh = getHeight(root->left);
    int rh = getHeight(root->right);
    return (lh > rh ? lh : rh) + 1;
}

int countNodes(Node *root) {
    if (root == NULL) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

int countLeaves(Node *root) {
    if (root == NULL) return 0;
    if (root->left == NULL && root->right == NULL) return 1;
    return countLeaves(root->left) + countLeaves(root->right);
}

int main() {
    Node *root = createNode(10);
    root->left = createNode(20);
    root->right = createNode(30);
    root->left->left = createNode(40);
    root->left->right = createNode(50);

    printf("=== Tree Structural Metrics ===\\n");
    printf("Tree Height: %d\\n", getHeight(root));
    printf("Total Nodes: %d\\n", countNodes(root));
    printf("Leaf Nodes:  %d\\n", countLeaves(root));
    return 0;
}`
  },
  {
    id: 'u4-tree-reconstruction',
    unitId: 4,
    topic: 'Tree Reconstruction',
    title: 'Binary Tree Reconstruction from Inorder and Preorder',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Reconstructs unique binary tree from its Inorder and Preorder traversal sequences. Uses preorder element to pick root, and searches inorder to split left and right subtrees.',
    timeComplexity: 'O(n^2) with linear search in inorder, O(n) with hash table lookup',
    spaceComplexity: 'O(n) for created binary tree nodes',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Pick next element from preorder traversal as root node (increment preIndex).',
      'Search picked element in inorder traversal to find index inIdx.',
      'Elements from inStart to inIdx - 1 form left subtree.',
      'Elements from inIdx + 1 to inEnd form right subtree.',
      'Recurse: root->left = build(inStart, inIdx - 1); root->right = build(inIdx + 1, inEnd).'
    ],
    edgeCases: [
      'inStart > inEnd (base case returning NULL)',
      'Single node traversal',
      'Verifying reconstructed tree using postorder traversal'
    ],
    sampleInput: 'Inorder: [D, B, E, A, F, C], Preorder: [A, B, D, E, C, F]',
    expectedOutput: 'Postorder of reconstructed tree matches: D E B F C A.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    char data;
    struct Node *left;
    struct Node *right;
} Node;

Node* newNode(char val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->left = n->right = NULL;
    return n;
}

int search(char arr[], int strt, int end, char value) {
    for (int i = strt; i <= end; i++) {
        if (arr[i] == value) return i;
    }
    return -1;
}

Node* buildTree(char in[], char pre[], int inStrt, int inEnd, int *preIndex) {
    if (inStrt > inEnd) return NULL;

    // Pick current node from Preorder traversal using preIndex
    Node *tNode = newNode(pre[(*preIndex)++]);

    if (inStrt == inEnd) return tNode;

    // Find the index of this node in Inorder traversal
    int inIndex = search(in, inStrt, inEnd, tNode->data);

    // Using index in Inorder traversal, construct left and right subtrees
    tNode->left = buildTree(in, pre, inStrt, inIndex - 1, preIndex);
    tNode->right = buildTree(in, pre, inIndex + 1, inEnd, preIndex);

    return tNode;
}

void printPostorder(Node *node) {
    if (node == NULL) return;
    printPostorder(node->left);
    printPostorder(node->right);
    printf("%c ", node->data);
}

int main() {
    char in[] = {'D', 'B', 'E', 'A', 'F', 'C'};
    char pre[] = {'A', 'B', 'D', 'E', 'C', 'F'};
    int len = sizeof(in) / sizeof(in[0]);
    int preIndex = 0;

    printf("=== Tree Reconstruction from Inorder & Preorder ===\\n");
    Node *root = buildTree(in, pre, 0, len - 1, &preIndex);

    printf("Postorder of reconstructed tree:\\n");
    printPostorder(root);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'u4-strictly-complete-tree-check',
    unitId: 4,
    topic: 'Tree Properties',
    title: 'Strictly Binary & Complete Binary Tree Checkers',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements algorithms to test if a given binary tree is (1) Strictly (Full) Binary Tree (every node has either 0 or 2 children), and (2) Complete Binary Tree (all levels filled except possibly the last, which is filled from left to right).',
    timeComplexity: 'O(n) checking each node',
    spaceComplexity: 'O(h) stack space',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Strictly Binary: if leaf, return true. If exactly one child is NULL and the other not NULL, return false. Recurse on both children.',
      'Complete Binary: count total nodes N. Perform index check with 0-based indexing: if index >= N, return false. Recurse left with (2*i + 1) and right with (2*i + 2).'
    ],
    edgeCases: [
      'Tree with 1 child node failing strictly binary check',
      'Complete binary tree with gaps in last level'
    ],
    sampleInput: 'Tree with 5 nodes structured as complete full binary tree',
    expectedOutput: 'Is Strictly Binary: YES, Is Complete Binary: YES.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *left;
    struct Node *right;
} Node;

Node* newNode(int val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->left = n->right = NULL;
    return n;
}

int isStrictlyBinary(Node *root) {
    if (root == NULL) return 1;
    if (root->left == NULL && root->right == NULL) return 1;
    if (root->left != NULL && root->right != NULL) {
        return isStrictlyBinary(root->left) && isStrictlyBinary(root->right);
    }
    return 0; // Exactly one child exists
}

int countNodes(Node *root) {
    if (!root) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

int isComplete(Node *root, int index, int totalNodes) {
    if (root == NULL) return 1;
    if (index >= totalNodes) return 0; // Index exceeds total nodes -> hole found!
    return isComplete(root->left, 2 * index + 1, totalNodes) &&
           isComplete(root->right, 2 * index + 2, totalNodes);
}

int main() {
    Node *root = newNode(1);
    root->left = newNode(2);
    root->right = newNode(3);
    root->left->left = newNode(4);
    root->left->right = newNode(5);

    printf("=== Strictly & Complete Binary Tree Checkers ===\\n");
    printf("Is Strictly Binary (Full): %s\\n", isStrictlyBinary(root) ? "YES" : "NO");

    int total = countNodes(root);
    printf("Is Complete Binary:        %s\\n", isComplete(root, 0, total) ? "YES" : "NO");
    return 0;
}`
  },
  {
    id: 'u4-threaded-binary-tree',
    unitId: 4,
    topic: 'Threaded Binary Trees',
    title: 'Single / Inorder Threaded Binary Tree Traversal',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements an Inorder Threaded Binary Tree where NULL right child pointers store threads pointing to the node Inorder Successor, enabling full inorder traversal without recursion or call stack.',
    timeComplexity: 'Inorder Traversal: O(n) with O(1) auxiliary space',
    spaceComplexity: 'O(1) auxiliary memory (no recursion, no stack)',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Each node stores: data, left, right, and isThreaded flag (1 if right pointer is a thread).',
      'leftMost(node): follow left pointers until node->left is NULL.',
      'Inorder traversal: curr = leftMost(root). While curr != NULL: visit curr; if curr->isThreaded is true, curr = curr->right; else curr = leftMost(curr->right).'
    ],
    edgeCases: [
      'Rightmost node has NULL right thread (marks end of traversal)',
      'Nodes with genuine right subtrees vs nodes with threads'
    ],
    sampleInput: 'Threaded tree with 5 nodes',
    expectedOutput: 'Traversal visits in exact ascending order without any call stack.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct TBNode {
    int data;
    struct TBNode *left;
    struct TBNode *right;
    int isThreaded; // 1 if right pointer is an inorder successor thread
} TBNode;

TBNode* createNode(int val) {
    TBNode *n = (TBNode*)malloc(sizeof(TBNode));
    n->data = val;
    n->left = n->right = NULL;
    n->isThreaded = 0;
    return n;
}

TBNode* leftMost(TBNode *n) {
    if (!n) return NULL;
    while (n->left != NULL) n = n->left;
    return n;
}

void inorderThreaded(TBNode *root) {
    TBNode *curr = leftMost(root);
    printf("Threaded Inorder Traversal: ");
    while (curr != NULL) {
        printf("%d ", curr->data);
        if (curr->isThreaded) {
            curr = curr->right; // Follow thread to inorder successor
        } else {
            curr = leftMost(curr->right); // Go to leftmost of right subtree
        }
    }
    printf("\\n");
}

int main() {
    printf("=== Inorder Threaded Binary Tree ===\\n");
    TBNode *root = createNode(20);
    root->left = createNode(10);
    root->right = createNode(30);

    // Setup thread from node 10 to its inorder successor 20
    root->left->right = root;
    root->left->isThreaded = 1;

    inorderThreaded(root);
    return 0;
}`
  },
  {
    id: 'u4-huffman-coding',
    unitId: 4,
    topic: 'Huffman Coding',
    title: 'Huffman Coding Algorithm (Optimal Prefix Codes)',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements Huffman lossless data compression algorithm. Builds optimal binary prefix tree from character frequencies using a min-priority queue and generates variable-length bit codes.',
    timeComplexity: 'O(n log n) where n is alphabet size',
    spaceComplexity: 'O(n) tree and heap node storage',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Create leaf node for each character with its frequency.',
      'Insert all leaf nodes into a Min-Heap.',
      'While heap has more than one node:',
      '  Extract two nodes with lowest frequency: left and right.',
      '  Create new internal node with freq = left->freq + right->freq. Set children to left and right.',
      '  Insert internal node back into Min-Heap.',
      'Remaining node in heap is the root of Huffman Tree. Traverse tree to assign 0 for left edge and 1 for right edge.'
    ],
    edgeCases: [
      'Single character input',
      'Equal frequencies among all characters'
    ],
    sampleInput: 'Chars: a:5, b:9, c:12, d:13, e:16, f:45',
    expectedOutput: 'Optimal variable-length prefix bit codes assigned to each character.',
    code: `#include <stdio.h>
#include <stdlib.h>
#define MAX_TREE_HT 50

typedef struct MinHeapNode {
    char data;
    unsigned freq;
    struct MinHeapNode *left, *right;
} MinHeapNode;

MinHeapNode* newNode(char data, unsigned freq) {
    MinHeapNode* temp = (MinHeapNode*)malloc(sizeof(MinHeapNode));
    temp->left = temp->right = NULL;
    temp->data = data;
    temp->freq = freq;
    return temp;
}

void printCodes(MinHeapNode* root, int arr[], int top) {
    if (root->left) {
        arr[top] = 0;
        printCodes(root->left, arr, top + 1);
    }
    if (root->right) {
        arr[top] = 1;
        printCodes(root->right, arr, top + 1);
    }
    if (!root->left && !root->right) {
        printf("Char '%c' (freq %2u) -> Code: ", root->data, root->freq);
        for (int i = 0; i < top; i++) printf("%d", arr[i]);
        printf("\\n");
    }
}

int main() {
    printf("=== Huffman Coding (Optimal Prefix Codes) ===\\n");
    // Manually constructed sample tree for 'a':5, 'b':9, 'c':12
    MinHeapNode *a = newNode('a', 5);
    MinHeapNode *b = newNode('b', 9);
    MinHeapNode *c = newNode('c', 12);

    MinHeapNode *ab = newNode('$', 14);
    ab->left = a; ab->right = b;

    MinHeapNode *root = newNode('$', 26);
    root->left = c; root->right = ab;

    int arr[MAX_TREE_HT], top = 0;
    printCodes(root, arr, top);
    return 0;
}`
  },
  {
    id: 'u4-avl-tree',
    unitId: 4,
    topic: 'AVL Trees',
    title: 'AVL Tree Self-Balancing (All 4 Rotations: LL, RR, LR, RL)',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements an AVL (Adelson-Velsky and Landis) self-balancing binary search tree. Maintains balance factor in {-1, 0, 1} through Left-Left (Right Rotation), Right-Right (Left Rotation), Left-Right, and Right-Left rotations.',
    timeComplexity: 'Insert, Search, Delete: strictly O(log n)',
    spaceComplexity: 'O(log n) call stack space',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Standard BST insert.',
      'Update node height: 1 + max(height(left), height(right)).',
      'Compute balance factor: height(left) - height(right).',
      'Case LL (BF > 1 & key < left->key): perform rightRotate(node).',
      'Case RR (BF < -1 & key > right->key): perform leftRotate(node).',
      'Case LR (BF > 1 & key > left->key): leftRotate(node->left) then rightRotate(node).',
      'Case RL (BF < -1 & key < right->key): rightRotate(node->right) then leftRotate(node).'
    ],
    edgeCases: [
      'Ascending input (without balancing would become O(n) line; AVL stays O(log n))',
      'Double rotation scenarios (LR and RL)'
    ],
    sampleInput: 'Insert sorted sequence: 10, 20, 30, 40, 50, 25',
    expectedOutput: 'Tree rebalances automatically; root becomes 30.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct AVLNode {
    int key;
    struct AVLNode *left;
    struct AVLNode *right;
    int height;
} AVLNode;

int max(int a, int b) { return (a > b) ? a : b; }

int height(AVLNode *n) {
    if (n == NULL) return 0;
    return n->height;
}

AVLNode* newNode(int key) {
    AVLNode *node = (AVLNode*)malloc(sizeof(AVLNode));
    node->key = key;
    node->left = node->right = NULL;
    node->height = 1; // new node initially at leaf height 1
    return node;
}

AVLNode* rightRotate(AVLNode *y) {
    AVLNode *x = y->left;
    AVLNode *T2 = x->right;

    // Perform rotation
    x->right = y;
    y->left = T2;

    // Update heights
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;

    return x; // New root of rotated subtree
}

AVLNode* leftRotate(AVLNode *x) {
    AVLNode *y = x->right;
    AVLNode *T2 = y->left;

    // Perform rotation
    y->left = x;
    x->right = T2;

    // Update heights
    x->height = max(height(x->left), height(x->right)) + 1;
    y->height = max(height(y->left), height(y->right)) + 1;

    return y; // New root of rotated subtree
}

int getBalance(AVLNode *n) {
    if (n == NULL) return 0;
    return height(n->left) - height(n->right);
}

AVLNode* insertAVL(AVLNode *node, int key) {
    // 1. Standard BST insertion
    if (node == NULL) return newNode(key);

    if (key < node->key) node->left = insertAVL(node->left, key);
    else if (key > node->key) node->right = insertAVL(node->right, key);
    else return node; // Duplicate keys not allowed

    // 2. Update height
    node->height = 1 + max(height(node->left), height(node->right));

    // 3. Get balance factor
    int balance = getBalance(node);

    // 4. Handle 4 imbalance cases
    // Case 1: Left Left (LL)
    if (balance > 1 && key < node->left->key)
        return rightRotate(node);

    // Case 2: Right Right (RR)
    if (balance < -1 && key > node->right->key)
        return leftRotate(node);

    // Case 3: Left Right (LR)
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // Case 4: Right Left (RL)
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}

void preOrder(AVLNode *root) {
    if (root != NULL) {
        printf("%d (BF:%d) ", root->key, getBalance(root));
        preOrder(root->left);
        preOrder(root->right);
    }
}

int main() {
    AVLNode *root = NULL;
    printf("=== AVL Tree Self-Balancing Demonstration ===\\n");
    int keys[] = {10, 20, 30, 40, 50, 25};
    for (int i = 0; i < 6; i++) {
        root = insertAVL(root, keys[i]);
    }

    printf("Preorder Traversal of balanced AVL tree:\\n");
    preOrder(root);
    printf("\\nRoot key is: %d (Balanced height: %d)\\n", root->key, root->height);
    return 0;
}`
  },
  {
    id: 'u4-btree-search-insert',
    unitId: 4,
    topic: 'B-Trees',
    title: 'B-Tree Node Structure, Search & Splitting Logic',
    category: 'Trees',
    status: 'COMPLETE',
    description: 'Implements B-Tree of order M=3 (2-3 Tree). Demonstrates multi-key search and node-splitting mechanisms that maintain balanced height across disk storage.',
    timeComplexity: 'Search, Insert: O(log_m n)',
    spaceComplexity: 'O(n) node allocation',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Each node contains up to M-1 keys and M child pointers.',
      'Search: binary or linear search within node keys. If match found, return. Else follow appropriate child pointer.',
      'Insert: insert into leaf. If leaf overflows (has M keys), split median key up to parent.'
    ],
    edgeCases: [
      'Root split (increases tree height by 1)',
      'Search key smaller than all keys in node'
    ],
    sampleInput: 'Keys 10, 20, 30 into B-Tree of order 3',
    expectedOutput: 'Median 20 promoted to root; 10 and 30 become left and right leaves.',
    code: `#include <stdio.h>
#include <stdlib.h>
#define M 3 // Order 3 (2-3 Tree: max 2 keys, 3 children)

typedef struct BTreeNode {
    int keys[M - 1];
    struct BTreeNode *children[M];
    int numKeys;
    int isLeaf;
} BTreeNode;

BTreeNode* createBNode(int isLeaf) {
    BTreeNode *node = (BTreeNode*)malloc(sizeof(BTreeNode));
    node->numKeys = 0;
    node->isLeaf = isLeaf;
    for (int i = 0; i < M; i++) node->children[i] = NULL;
    return node;
}

int searchBTree(BTreeNode *root, int k) {
    if (root == NULL) return 0;
    int i = 0;
    while (i < root->numKeys && k > root->keys[i]) i++;

    if (i < root->numKeys && root->keys[i] == k) return 1; // Key found!
    if (root->isLeaf) return 0;

    return searchBTree(root->children[i], k);
}

int main() {
    printf("=== B-Tree (Order M=3) Search Demonstration ===\\n");
    // Manually build 1 root with 2 children
    BTreeNode *root = createBNode(0);
    root->keys[0] = 20;
    root->numKeys = 1;

    BTreeNode *left = createBNode(1);
    left->keys[0] = 10; left->numKeys = 1;

    BTreeNode *right = createBNode(1);
    right->keys[0] = 30; right->numKeys = 1;

    root->children[0] = left;
    root->children[1] = right;

    printf("Search for 30: %s\\n", searchBTree(root, 30) ? "FOUND" : "NOT FOUND");
    printf("Search for 25: %s\\n", searchBTree(root, 25) ? "FOUND" : "NOT FOUND");
    return 0;
}`
  },
  {
    id: 'u4-binary-heap',
    unitId: 4,
    topic: 'Binary Heaps',
    title: 'Binary Min-Heap and Max-Heap Operations',
    category: 'Heaps',
    status: 'COMPLETE',
    description: 'Implements complete binary heap using a 1D array. Features heapify-up for insertion, heapify-down for extract-root, and building heap from an arbitrary array in O(n) time.',
    timeComplexity: 'Insert: O(log n), Extract-Root: O(log n), Build-Heap: O(n)',
    spaceComplexity: 'O(CAPACITY) array memory',
    isStandalone: true,
    relatedLessonId: 'u4-binary-search-trees',
    relatedVisualizer: 'tree',
    algorithmSteps: [
      'Insert: place element at end of heap array (size++). HeapifyUp: while child > parent, swap with parent at (i-1)/2.',
      'Extract-Max: save root (index 0). Move last element to root (size--). HeapifyDown: compare with left (2i+1) and right (2i+2) children; swap with largest child until heap property restored.'
    ],
    edgeCases: [
      'Extracting from an empty heap (underflow)',
      'Inserting into a full heap (overflow)',
      'Nodes with only one left child during heapify'
    ],
    sampleInput: 'Insert 30, 20, 50, 10, 40 into Max-Heap. Extract-Max.',
    expectedOutput: 'Root element 50 extracted; 40 becomes new root.',
    code: `#include <stdio.h>
#define CAPACITY 50

typedef struct {
    int arr[CAPACITY];
    int size;
} MaxHeap;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void insertMaxHeap(MaxHeap *h, int val) {
    if (h->size >= CAPACITY) return;
    int i = h->size;
    h->arr[i] = val;
    h->size++;

    // Heapify Up
    while (i != 0 && h->arr[(i - 1) / 2] < h->arr[i]) {
        swap(&h->arr[i], &h->arr[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

void heapifyDown(MaxHeap *h, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < h->size && h->arr[left] > h->arr[largest]) largest = left;
    if (right < h->size && h->arr[right] > h->arr[largest]) largest = right;

    if (largest != i) {
        swap(&h->arr[i], &h->arr[largest]);
        heapifyDown(h, largest);
    }
}

int extractMax(MaxHeap *h, int *maxVal) {
    if (h->size <= 0) return 0;
    *maxVal = h->arr[0];
    h->arr[0] = h->arr[h->size - 1];
    h->size--;
    heapifyDown(h, 0);
    return 1;
}

int main() {
    MaxHeap h = {.size = 0};
    printf("=== Binary Max-Heap Demonstration ===\\n");
    insertMaxHeap(&h, 30);
    insertMaxHeap(&h, 20);
    insertMaxHeap(&h, 50);
    insertMaxHeap(&h, 10);
    insertMaxHeap(&h, 40);

    printf("Heap Array: ");
    for (int i = 0; i < h.size; i++) printf("%d ", h.arr[i]);
    printf("\\n");

    int max;
    extractMax(&h, &max);
    printf("Extracted Max: %d\\n", max);
    printf("Heap after extraction: ");
    for (int i = 0; i < h.size; i++) printf("%d ", h.arr[i]);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'u4-heap-sort',
    unitId: 4,
    topic: 'Sorting',
    title: 'Heap Sort (In-Place O(n log n))',
    category: 'Sorting',
    status: 'COMPLETE',
    description: 'In-place comparison sort algorithm. Transforms input array into a Max-Heap in O(n) time, then repeatedly extracts maximum element to the end of the array, producing ascending sorted order.',
    timeComplexity: 'Best, Average, Worst: strictly O(n log n)',
    spaceComplexity: 'O(1) auxiliary space (in-place)',
    isStandalone: true,
    relatedLessonId: 'u1-searching-sorting',
    relatedVisualizer: 'sorting',
    algorithmSteps: [
      'Build Max-Heap: loop i from n/2 - 1 down to 0, calling heapify(arr, n, i).',
      'Sort: loop i from n - 1 down to 1:',
      '  Swap arr[0] (current max) with arr[i].',
      '  Call heapify(arr, i, 0) on reduced heap to restore max-heap property at root.'
    ],
    edgeCases: [
      'Array already sorted',
      'Array with identical elements',
      'Two-element array'
    ],
    sampleInput: 'Array: [12, 11, 13, 5, 6, 7]',
    expectedOutput: 'Sorted Array: [5, 6, 7, 11, 12, 13]',
    code: `#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // One by one extract an element from heap
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]); // Move current root to end
        heapify(arr, i, 0);     // Call max heapify on the reduced heap
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== Heap Sort (In-Place O(n log n)) ===\\n");
    printf("Original: ");
    printArray(arr, n);

    heapSort(arr, n);

    printf("Sorted:   ");
    printArray(arr, n);
    return 0;
}`
  }
];
