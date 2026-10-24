import { CProgram } from '../../types';

export const unit2Programs: CProgram[] = [
  {
    id: 'u2-array-based-linked-list',
    unitId: 2,
    topic: 'Linked List Representations',
    title: 'Array-Based Linked List (Cursor / Static Array with Free List)',
    category: 'Linked Lists',
    status: 'COMPLETE',
    description: 'Implements a linked list inside a static array using integer indices as pointers. Manages an explicit available/free-list stack to allocate and deallocate node slots without malloc() or free().',
    timeComplexity: 'Allocation/Free: O(1), Insertion: O(1) at head, Traversal: O(n)',
    spaceComplexity: 'O(CAPACITY) fixed static buffer',
    isStandalone: true,
    relatedLessonId: 'u2-singly-linked-list',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Initialize array nodes: node[i].next = i + 1, node[MAX-1].next = -1. Set freeHead = 0, listHead = -1.',
      'allocateNode(): pop index from free list: slot = freeHead, freeHead = node[slot].next. Return slot.',
      'freeNode(slot): push slot back to free list: node[slot].next = freeHead, freeHead = slot.',
      'insertHead(val): slot = allocateNode(), node[slot].data = val, node[slot].next = listHead, listHead = slot.',
      'traverse(): start at curr = listHead, follow curr = node[curr].next until -1.'
    ],
    edgeCases: [
      'Free list exhausted (out of simulated memory)',
      'Traversing an empty list (listHead == -1)',
      'Freeing an invalid or already freed node slot'
    ],
    sampleInput: 'Insert 10, 20, 30 at head, delete head, traverse',
    expectedOutput: 'List: [ 20 -> 10 -> NULL ], Free slots correctly recycled.',
    code: `#include <stdio.h>
#define MAX_NODES 10

typedef struct {
    int data;
    int next; // Array index acting as memory pointer
} CursorNode;

CursorNode pool[MAX_NODES];
int freeHead = 0;
int listHead = -1;

void initPool() {
    for (int i = 0; i < MAX_NODES - 1; i++) {
        pool[i].next = i + 1;
    }
    pool[MAX_NODES - 1].next = -1;
    freeHead = 0;
    listHead = -1;
}

int allocateNode() {
    if (freeHead == -1) {
        printf("Error: Memory pool exhausted! No free nodes.\\n");
        return -1;
    }
    int slot = freeHead;
    freeHead = pool[freeHead].next;
    pool[slot].next = -1;
    return slot;
}

void freeNode(int slot) {
    if (slot < 0 || slot >= MAX_NODES) return;
    pool[slot].next = freeHead;
    freeHead = slot;
}

void insertBeginning(int val) {
    int slot = allocateNode();
    if (slot == -1) return;
    pool[slot].data = val;
    pool[slot].next = listHead;
    listHead = slot;
}

void deleteBeginning() {
    if (listHead == -1) {
        printf("List is empty! Nothing to delete.\\n");
        return;
    }
    int slotToDelete = listHead;
    listHead = pool[listHead].next;
    freeNode(slotToDelete);
    printf("Deleted node from head (slot %d recycled).\\n", slotToDelete);
}

void displayList() {
    int curr = listHead;
    printf("Cursor List: ");
    while (curr != -1) {
        printf("[Slot %d: %d] -> ", curr, pool[curr].data);
        curr = pool[curr].next;
    }
    printf("NULL\\n");
}

int main() {
    initPool();
    printf("=== Array-Based (Cursor) Linked List ===\\n");
    insertBeginning(10);
    insertBeginning(20);
    insertBeginning(30);
    displayList();

    deleteBeginning();
    displayList();

    insertBeginning(40);
    displayList();
    return 0;
}`
  },
  {
    id: 'u2-singly-linked-list',
    unitId: 2,
    topic: 'Singly Linked List',
    title: 'Singly Linked List Complete CRUD, Reverse & Search',
    category: 'Linked Lists',
    status: 'COMPLETE',
    description: 'Full dynamic Singly Linked List in C with dynamic allocation (malloc/free). Includes insertion at beginning/end/position, deletion from beginning/end/position, iterative list reversal, and linear search.',
    timeComplexity: 'Insert/Delete Head: O(1), Insert/Delete End/Pos: O(n), Reverse: O(n)',
    spaceComplexity: 'O(1) auxiliary space (dynamic heap nodes)',
    isStandalone: true,
    relatedLessonId: 'u2-singly-linked-list',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Insert Head: newNode->next = head; head = newNode.',
      'Insert End: Traverse to last node (temp->next == NULL); temp->next = newNode.',
      'Insert Pos: Traverse to (pos-1); newNode->next = temp->next; temp->next = newNode.',
      'Delete Head: toDelete = head; head = head->next; free(toDelete).',
      'Reverse: Maintain prev=NULL, curr=head, next=NULL. In loop: next=curr->next; curr->next=prev; prev=curr; curr=next. Finally head = prev.'
    ],
    edgeCases: [
      'Operations on NULL empty list',
      'Single node list deletion (head becomes NULL)',
      'Position index out of bounds (> length of list)',
      'Memory leak prevention by always calling free() on deleted nodes'
    ],
    sampleInput: 'Insert 10, 20, 30. Reverse list. Delete middle node.',
    expectedOutput: 'List transitions displayed with simulated memory addresses.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* createNode(int val) {
    Node *newNode = (Node*)malloc(sizeof(Node));
    if (!newNode) {
        printf("Memory allocation failed!\\n");
        exit(1);
    }
    newNode->data = val;
    newNode->next = NULL;
    return newNode;
}

void insertBeginning(Node **head, int val) {
    Node *newNode = createNode(val);
    newNode->next = *head;
    *head = newNode;
}

void insertEnd(Node **head, int val) {
    Node *newNode = createNode(val);
    if (*head == NULL) {
        *head = newNode;
        return;
    }
    Node *temp = *head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
}

void insertAtPosition(Node **head, int val, int pos) {
    if (pos == 1) {
        insertBeginning(head, val);
        return;
    }
    Node *newNode = createNode(val);
    Node *temp = *head;
    for (int i = 1; i < pos - 1 && temp != NULL; i++) {
        temp = temp->next;
    }
    if (temp == NULL) {
        printf("Position %d out of bounds!\\n", pos);
        free(newNode);
        return;
    }
    newNode->next = temp->next;
    temp->next = newNode;
}

void deleteBeginning(Node **head) {
    if (*head == NULL) {
        printf("List is empty!\\n");
        return;
    }
    Node *temp = *head;
    *head = (*head)->next;
    free(temp);
}

void deleteEnd(Node **head) {
    if (*head == NULL) return;
    if ((*head)->next == NULL) {
        free(*head);
        *head = NULL;
        return;
    }
    Node *temp = *head;
    while (temp->next->next != NULL) {
        temp = temp->next;
    }
    free(temp->next);
    temp->next = NULL;
}

void reverseList(Node **head) {
    Node *prev = NULL;
    Node *curr = *head;
    Node *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    *head = prev;
}

void display(Node *head) {
    Node *temp = head;
    printf("List: ");
    while (temp != NULL) {
        printf("[%d | %p] -> ", temp->data, (void*)temp->next);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    Node *head = NULL;
    printf("=== Singly Linked List CRUD & Reverse ===\\n");

    insertBeginning(&head, 20);
    insertBeginning(&head, 10);
    insertEnd(&head, 40);
    insertAtPosition(&head, 30, 3);
    display(head);

    printf("\\nReversing list in-place...\\n");
    reverseList(&head);
    display(head);

    printf("\\nDeleting beginning and end...\\n");
    deleteBeginning(&head);
    deleteEnd(&head);
    display(head);

    return 0;
}`
  },
  {
    id: 'u2-doubly-linked-list',
    unitId: 2,
    topic: 'Doubly Linked List',
    title: 'Doubly Linked List (Two-Way Traversal & Pointer Updates)',
    category: 'Linked Lists',
    status: 'COMPLETE',
    description: 'Implements a two-way linked list where each node contains pointers to both previous and next nodes. Demonstrates forward and backward traversals and safe pointer updates.',
    timeComplexity: 'Insert/Delete Head/Tail: O(1) with tail pointer, Traversal: O(n)',
    spaceComplexity: 'O(1) auxiliary space (dynamic nodes)',
    isStandalone: true,
    relatedLessonId: 'u2-singly-linked-list',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Each node has struct DLLNode { int data; DLLNode *prev; DLLNode *next; }.',
      'Insert Head: newNode->next = head; if (head) head->prev = newNode; head = newNode.',
      'Insert End: Traverse to tail. tail->next = newNode; newNode->prev = tail.',
      'Delete Node curr: if (curr->prev) curr->prev->next = curr->next; if (curr->next) curr->next->prev = curr->prev; free(curr).'
    ],
    edgeCases: [
      'Deleting head of list (head->prev is NULL)',
      'Deleting tail of list (tail->next is NULL)',
      'Deleting only remaining node in list (head becomes NULL)',
      'Backward traversal from an empty list'
    ],
    sampleInput: 'Insert 10, 20, 30. Forward display, Backward display.',
    expectedOutput: 'Forward: 10 <-> 20 <-> 30. Backward: 30 <-> 20 <-> 10.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct DLLNode {
    int data;
    struct DLLNode *prev;
    struct DLLNode *next;
} DLLNode;

DLLNode* createDLLNode(int val) {
    DLLNode *node = (DLLNode*)malloc(sizeof(DLLNode));
    node->data = val;
    node->prev = NULL;
    node->next = NULL;
    return node;
}

void insertHead(DLLNode **head, int val) {
    DLLNode *node = createDLLNode(val);
    node->next = *head;
    if (*head != NULL) {
        (*head)->prev = node;
    }
    *head = node;
}

void insertTail(DLLNode **head, int val) {
    DLLNode *node = createDLLNode(val);
    if (*head == NULL) {
        *head = node;
        return;
    }
    DLLNode *temp = *head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = node;
    node->prev = temp;
}

void deleteNode(DLLNode **head, DLLNode *del) {
    if (*head == NULL || del == NULL) return;
    if (*head == del) {
        *head = del->next;
    }
    if (del->next != NULL) {
        del->next->prev = del->prev;
    }
    if (del->prev != NULL) {
        del->prev->next = del->next;
    }
    free(del);
}

void displayForward(DLLNode *head) {
    printf("Forward:  NULL <- ");
    DLLNode *temp = head;
    while (temp != NULL) {
        printf("[%d] %s", temp->data, temp->next ? "<=> " : "-> NULL\\n");
        temp = temp->next;
    }
}

void displayBackward(DLLNode *head) {
    if (head == NULL) return;
    DLLNode *temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    printf("Backward: NULL <- ");
    while (temp != NULL) {
        printf("[%d] %s", temp->data, temp->prev ? "<=> " : "-> NULL\\n");
        temp = temp->prev;
    }
}

int main() {
    DLLNode *head = NULL;
    printf("=== Doubly Linked List Demonstration ===\\n");
    insertTail(&head, 10);
    insertTail(&head, 20);
    insertTail(&head, 30);
    insertHead(&head, 5);

    displayForward(head);
    displayBackward(head);

    printf("\\nDeleting node with value 20...\\n");
    DLLNode *curr = head;
    while (curr && curr->data != 20) curr = curr->next;
    if (curr) deleteNode(&head, curr);

    displayForward(head);
    displayBackward(head);
    return 0;
}`
  },
  {
    id: 'u2-circular-singly-linked-list',
    unitId: 2,
    topic: 'Circular Linked List',
    title: 'Circular Singly Linked List (Last->Next Points to Head)',
    category: 'Linked Lists',
    status: 'COMPLETE',
    description: 'Implements a Circular Singly Linked List where the last node points back to the first node. Demonstrates do-while traversal and insertion/deletion without terminating at NULL.',
    timeComplexity: 'Insertion at Head/Tail: O(n) or O(1) with tail pointer, Traversal: O(n)',
    spaceComplexity: 'O(1) auxiliary space',
    isStandalone: true,
    relatedLessonId: 'u2-singly-linked-list',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'In a circular list, no node has next == NULL. Last node points to head.',
      'Insert Head: newNode->next = head. Traverse to find last node; last->next = newNode; head = newNode.',
      'Traversal: If head != NULL, set temp = head; do { print(temp->data); temp = temp->next; } while (temp != head);'
    ],
    edgeCases: [
      'Empty list condition (head == NULL)',
      'Single node pointing to itself (head->next == head)',
      'Loop termination guarantee using do-while condition temp != head'
    ],
    sampleInput: 'Insert 10, 20, 30 into circular list, traverse, delete head',
    expectedOutput: 'Circular traversal loops through 10 -> 20 -> 30 -> (back to 10).',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* createNode(int val) {
    Node *newNode = (Node*)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = NULL;
    return newNode;
}

void insertBeginning(Node **head, int val) {
    Node *newNode = createNode(val);
    if (*head == NULL) {
        newNode->next = newNode; // Points to itself
        *head = newNode;
        return;
    }
    // Find last node
    Node *last = *head;
    while (last->next != *head) {
        last = last->next;
    }
    newNode->next = *head;
    last->next = newNode;
    *head = newNode;
}

void deleteBeginning(Node **head) {
    if (*head == NULL) return;
    if ((*head)->next == *head) {
        free(*head);
        *head = NULL;
        return;
    }
    Node *last = *head;
    while (last->next != *head) {
        last = last->next;
    }
    Node *temp = *head;
    last->next = (*head)->next;
    *head = (*head)->next;
    free(temp);
}

void display(Node *head) {
    if (head == NULL) {
        printf("Circular List is empty.\\n");
        return;
    }
    Node *temp = head;
    printf("Circular List: ");
    do {
        printf("[%d] -> ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("(Head: %d)\\n", head->data);
}

int main() {
    Node *head = NULL;
    printf("=== Circular Singly Linked List ===\\n");
    insertBeginning(&head, 30);
    insertBeginning(&head, 20);
    insertBeginning(&head, 10);
    display(head);

    printf("\\nDeleting beginning element (10)...\\n");
    deleteBeginning(&head);
    display(head);
    return 0;
}`
  },
  {
    id: 'u2-circular-doubly-linked-list',
    unitId: 2,
    topic: 'Circular Linked List',
    title: 'Circular Doubly Linked List',
    category: 'Linked Lists',
    status: 'COMPLETE',
    description: 'Implements a two-way circular list where head->prev points to tail, and tail->next points to head. Allows O(1) access to both ends.',
    timeComplexity: 'Insert/Delete at either end: O(1)',
    spaceComplexity: 'O(1) auxiliary space',
    isStandalone: true,
    relatedLessonId: 'u2-singly-linked-list',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Empty list: newNode->next = newNode; newNode->prev = newNode; head = newNode.',
      'Insert End: tail = head->prev; tail->next = newNode; newNode->prev = tail; newNode->next = head; head->prev = newNode.'
    ],
    edgeCases: [
      'Single node whose next and prev both point to itself',
      'Empty list insertion and deletion'
    ],
    sampleInput: 'Insert 100, 200, 300, forward and backward circular traversal',
    expectedOutput: 'Forward: 100 <=> 200 <=> 300. Backward: 300 <=> 200 <=> 100.',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct CDLLNode {
    int data;
    struct CDLLNode *prev;
    struct CDLLNode *next;
} CDLLNode;

CDLLNode* createNode(int val) {
    CDLLNode *node = (CDLLNode*)malloc(sizeof(CDLLNode));
    node->data = val;
    node->next = node->prev = node;
    return node;
}

void insertEnd(CDLLNode **head, int val) {
    CDLLNode *node = createNode(val);
    if (*head == NULL) {
        *head = node;
        return;
    }
    CDLLNode *tail = (*head)->prev;
    tail->next = node;
    node->prev = tail;
    node->next = *head;
    (*head)->prev = node;
}

void display(CDLLNode *head) {
    if (!head) { printf("Empty\\n"); return; }
    CDLLNode *temp = head;
    printf("CDLL: ");
    do {
        printf("[%d] <=> ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("(head %d)\\n", head->data);
}

int main() {
    CDLLNode *head = NULL;
    printf("=== Circular Doubly Linked List ===\\n");
    insertEnd(&head, 100);
    insertEnd(&head, 200);
    insertEnd(&head, 300);
    display(head);
    return 0;
}`
  },
  {
    id: 'u2-single-var-polynomial',
    unitId: 2,
    topic: 'Polynomial Operations',
    title: 'Single-Variable Polynomial Representation & Addition',
    category: 'Polynomials',
    status: 'COMPLETE',
    description: 'Represents single-variable polynomials P(x) = sum(c_i * x^e_i) as sorted linked lists of terms by descending exponent. Implements polynomial addition in O(n + m) time.',
    timeComplexity: 'O(n + m) where n, m are term counts',
    spaceComplexity: 'O(n + m) for result polynomial list',
    isStandalone: true,
    relatedLessonId: 'u2-polynomials',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Each node stores: coeff, exp, and next pointer.',
      'Maintain two pointers p1 and p2 at the heads of Poly1 and Poly2.',
      'While p1 and p2 are non-null:',
      '  If p1->exp == p2->exp: add coefficients. If sum != 0, append term (sum, exp). Advance both.',
      '  If p1->exp > p2->exp: append copy of p1 term. Advance p1.',
      '  If p2->exp > p1->exp: append copy of p2 term. Advance p2.',
      'Append any remaining terms from p1 or p2.'
    ],
    edgeCases: [
      'Coefficients cancelling out to zero (sum == 0, do not include term)',
      'Polynomials with completely disjoint powers (e.g., 3x^4 and 2x^2 + 1)',
      'One or both polynomials being empty (0)'
    ],
    sampleInput: 'P1: 5x^3 + 4x^2 + 2x^0, P2: 5x^3 - 4x^2 + 7x^1',
    expectedOutput: 'Result: 10x^3 + 7x^1 + 2x^0 (x^2 terms cancel out)',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct PolyTerm {
    int coeff;
    int exp;
    struct PolyTerm *next;
} PolyTerm;

PolyTerm* createTerm(int coeff, int exp) {
    PolyTerm *t = (PolyTerm*)malloc(sizeof(PolyTerm));
    t->coeff = coeff;
    t->exp = exp;
    t->next = NULL;
    return t;
}

void appendTerm(PolyTerm **head, int coeff, int exp) {
    if (coeff == 0) return; // Do not store zero terms
    PolyTerm *newTerm = createTerm(coeff, exp);
    if (*head == NULL) {
        *head = newTerm;
        return;
    }
    PolyTerm *curr = *head;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = newTerm;
}

PolyTerm* addPolynomials(PolyTerm *p1, PolyTerm *p2) {
    PolyTerm *result = NULL;
    while (p1 != NULL && p2 != NULL) {
        if (p1->exp == p2->exp) {
            int sumCoeff = p1->coeff + p2->coeff;
            if (sumCoeff != 0) {
                appendTerm(&result, sumCoeff, p1->exp);
            }
            p1 = p1->next;
            p2 = p2->next;
        } else if (p1->exp > p2->exp) {
            appendTerm(&result, p1->coeff, p1->exp);
            p1 = p1->next;
        } else {
            appendTerm(&result, p2->coeff, p2->exp);
            p2 = p2->next;
        }
    }
    while (p1 != NULL) {
        appendTerm(&result, p1->coeff, p1->exp);
        p1 = p1->next;
    }
    while (p2 != NULL) {
        appendTerm(&result, p2->coeff, p2->exp);
        p2 = p2->next;
    }
    return result;
}

void displayPoly(PolyTerm *head) {
    if (head == NULL) {
        printf("0\\n");
        return;
    }
    PolyTerm *curr = head;
    while (curr != NULL) {
        printf("%d*x^%d", curr->coeff, curr->exp);
        if (curr->next != NULL && curr->next->coeff > 0) {
            printf(" + ");
        } else if (curr->next != NULL) {
            printf(" ");
        }
        curr = curr->next;
    }
    printf("\\n");
}

int main() {
    PolyTerm *p1 = NULL;
    PolyTerm *p2 = NULL;

    printf("=== Single-Variable Polynomial Addition ===\\n");
    // P1 = 5x^3 + 4x^2 + 2x^0
    appendTerm(&p1, 5, 3);
    appendTerm(&p1, 4, 2);
    appendTerm(&p1, 2, 0);

    // P2 = 5x^3 - 4x^2 + 7x^1
    appendTerm(&p2, 5, 3);
    appendTerm(&p2, -4, 2);
    appendTerm(&p2, 7, 1);

    printf("P1(x) = "); displayPoly(p1);
    printf("P2(x) = "); displayPoly(p2);

    PolyTerm *sum = addPolynomials(p1, p2);
    printf("Sum   = "); displayPoly(sum);

    return 0;
}`
  },
  {
    id: 'u2-two-var-polynomial',
    unitId: 2,
    topic: 'Polynomial Operations',
    title: 'Two-Variable Polynomial Representation & Addition',
    category: 'Polynomials',
    status: 'COMPLETE',
    description: 'Extends polynomial representation to two variables P(x, y) = sum(c * x^px * y^py). Ordered lexicographically by power of x, then power of y.',
    timeComplexity: 'O(n + m) for addition of sorted terms',
    spaceComplexity: 'O(n + m) auxiliary space',
    isStandalone: true,
    relatedLessonId: 'u2-polynomials',
    relatedVisualizer: 'linked-list',
    algorithmSteps: [
      'Each term stores coeff, px, py, and next pointer.',
      'Comparison order: if px1 != px2, compare px; else compare py.',
      'Add like terms when both px1 == px2 and py1 == py2.'
    ],
    edgeCases: [
      'Terms with same x-power but different y-powers (cannot combine)',
      'Like terms cancelling out completely'
    ],
    sampleInput: 'P1: 4x^2y^1 + 3x^1y^2, P2: 2x^2y^1 + 5x^0y^0',
    expectedOutput: 'Sum: 6x^2y^1 + 3x^1y^2 + 5x^0y^0',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Term2D {
    int coeff;
    int px; // power of x
    int py; // power of y
    struct Term2D *next;
} Term2D;

Term2D* createTerm2D(int c, int px, int py) {
    Term2D *t = (Term2D*)malloc(sizeof(Term2D));
    t->coeff = c;
    t->px = px;
    t->py = py;
    t->next = NULL;
    return t;
}

void append2D(Term2D **head, int c, int px, int py) {
    if (c == 0) return;
    Term2D *node = createTerm2D(c, px, py);
    if (!*head) { *head = node; return; }
    Term2D *curr = *head;
    while (curr->next) curr = curr->next;
    curr->next = node;
}

Term2D* add2D(Term2D *p1, Term2D *p2) {
    Term2D *res = NULL;
    while (p1 && p2) {
        if (p1->px == p2->px && p1->py == p2->py) {
            int sc = p1->coeff + p2->coeff;
            if (sc != 0) append2D(&res, sc, p1->px, p1->py);
            p1 = p1->next; p2 = p2->next;
        } else if (p1->px > p2->px || (p1->px == p2->px && p1->py > p2->py)) {
            append2D(&res, p1->coeff, p1->px, p1->py);
            p1 = p1->next;
        } else {
            append2D(&res, p2->coeff, p2->px, p2->py);
            p2 = p2->next;
        }
    }
    while (p1) { append2D(&res, p1->coeff, p1->px, p1->py); p1 = p1->next; }
    while (p2) { append2D(&res, p2->coeff, p2->px, p2->py); p2 = p2->next; }
    return res;
}

void print2D(Term2D *h) {
    while (h) {
        printf("%d(x^%d)(y^%d)%s", h->coeff, h->px, h->py, h->next ? " + " : "\\n");
        h = h->next;
    }
}

int main() {
    Term2D *p1 = NULL, *p2 = NULL;
    printf("=== Two-Variable Polynomial Addition ===\\n");
    append2D(&p1, 4, 2, 1);
    append2D(&p1, 3, 1, 2);

    append2D(&p2, 2, 2, 1);
    append2D(&p2, 5, 0, 0);

    printf("P1: "); print2D(p1);
    printf("P2: "); print2D(p2);

    Term2D *sum = add2D(p1, p2);
    printf("Sum: "); print2D(sum);
    return 0;
}`
  },
  {
    id: 'u2-hash-chaining',
    unitId: 2,
    topic: 'Hashing',
    title: 'Hash Table with Separate Chaining',
    category: 'Hashing',
    status: 'COMPLETE',
    description: 'Implements collision resolution using Separate Chaining: an array of linked list heads. Supports insert, search, and delete without clustering degradation.',
    timeComplexity: 'Average: O(1 + alpha) where alpha = N / TABLE_SIZE, Worst: O(N)',
    spaceComplexity: 'O(N + TABLE_SIZE) dynamic node storage',
    isStandalone: true,
    relatedLessonId: 'u2-hashing',
    relatedVisualizer: 'hashing',
    algorithmSteps: [
      'Hash function: slot = key % TABLE_SIZE.',
      'Insert: create new node, prepend to bucket list at table[slot].',
      'Search: traverse table[slot]; if node->key == target, return node.',
      'Delete: traverse table[slot] with previous pointer, unlink node and free memory.'
    ],
    edgeCases: [
      'Collisions occurring on the exact same bucket',
      'Deleting a key that is the head of a chain',
      'Searching for a key whose bucket is NULL'
    ],
    sampleInput: 'Keys: 15, 25, 35, 12, 22 in table of size 10',
    expectedOutput: 'Bucket 5 contains 35 -> 25 -> 15. Bucket 2 contains 22 -> 12.',
    code: `#include <stdio.h>
#include <stdlib.h>
#define TABLE_SIZE 7

typedef struct HashNode {
    int key;
    int value;
    struct HashNode *next;
} HashNode;

HashNode* table[TABLE_SIZE];

int hashFunction(int key) {
    return key % TABLE_SIZE;
}

void insert(int key, int value) {
    int slot = hashFunction(key);
    HashNode *newNode = (HashNode*)malloc(sizeof(HashNode));
    newNode->key = key;
    newNode->value = value;
    newNode->next = table[slot];
    table[slot] = newNode;
}

int search(int key, int *outValue) {
    int slot = hashFunction(key);
    HashNode *curr = table[slot];
    while (curr) {
        if (curr->key == key) {
            *outValue = curr->value;
            return 1;
        }
        curr = curr->next;
    }
    return 0;
}

void display() {
    printf("=== Hash Table (Separate Chaining) ===\\n");
    for (int i = 0; i < TABLE_SIZE; i++) {
        printf("Bucket [%d]: ", i);
        HashNode *curr = table[i];
        while (curr) {
            printf("[K:%d V:%d] -> ", curr->key, curr->value);
            curr = curr->next;
        }
        printf("NULL\\n");
    }
}

int main() {
    for (int i = 0; i < TABLE_SIZE; i++) table[i] = NULL;

    insert(10, 100);
    insert(17, 200); // 17 % 7 = 3 (collides with 10 % 7 = 3)
    insert(24, 300); // 24 % 7 = 3 (collides with 17 & 10)
    insert(5, 500);

    display();

    int val;
    if (search(17, &val)) {
        printf("\\nKey 17 found with value %d\\n", val);
    } else {
        printf("\\nKey 17 not found\\n");
    }
    return 0;
}`
  },
  {
    id: 'u2-hash-linear-probing',
    unitId: 2,
    topic: 'Hashing',
    title: 'Hash Table with Linear Probing & Tombstone Deletion',
    category: 'Hashing',
    status: 'COMPLETE',
    description: 'Implements Open Addressing with Linear Probing: index = (h(k) + i) % m. Uses a tombstone value (-1) to allow search probes to continue correctly past deleted entries without breaking search chains.',
    timeComplexity: 'Average: O(1 / (1 - alpha)), Worst: O(m) with primary clustering',
    spaceComplexity: 'O(TABLE_SIZE) fixed array',
    isStandalone: true,
    relatedLessonId: 'u2-hashing',
    relatedVisualizer: 'hashing',
    algorithmSteps: [
      'Slot empty: 0; Tombstone (deleted): -1.',
      'Insert: probe i = 0, 1, 2... slot = (key + i) % TABLE_SIZE. Insert into first empty or tombstone slot.',
      'Search: probe until slot matches key (found) or empty 0 slot encountered (not found). Tombstone (-1) does NOT stop search.',
      'Delete: mark slot as -1 (tombstone) to avoid breaking probe sequence of subsequent keys.'
    ],
    edgeCases: [
      'Table full condition (probe loop wraps completely)',
      'Primary clustering where occupied slots coalesce into large contiguous runs',
      'Searching for a key inserted after a deleted key'
    ],
    sampleInput: 'Keys 12, 22, 32 with table size 10 (all hash to index 2)',
    expectedOutput: 'Stored at slots 2, 3, 4. Deleting 22 leaves tombstone; searching 32 succeeds.',
    code: `#include <stdio.h>
#define SIZE 10
#define EMPTY 0
#define TOMBSTONE -1

int table[SIZE];

void initTable() {
    for (int i = 0; i < SIZE; i++) table[i] = EMPTY;
}

int insert(int key) {
    for (int i = 0; i < SIZE; i++) {
        int idx = (key + i) % SIZE;
        if (table[idx] == EMPTY || table[idx] == TOMBSTONE) {
            table[idx] = key;
            return idx;
        }
    }
    printf("Table full! Cannot insert %d\\n", key);
    return -1;
}

int search(int key) {
    for (int i = 0; i < SIZE; i++) {
        int idx = (key + i) % SIZE;
        if (table[idx] == EMPTY) return -1; // End of chain
        if (table[idx] == key) return idx;  // Found
        // If TOMBSTONE, continue probing!
    }
    return -1;
}

int deleteKey(int key) {
    int idx = search(key);
    if (idx != -1) {
        table[idx] = TOMBSTONE; // Mark as tombstone
        return 1;
    }
    return 0;
}

void display() {
    printf("Hash Table (Linear Probing):\\n");
    for (int i = 0; i < SIZE; i++) {
        if (table[i] == EMPTY) printf("[%d]: EMPTY\\n", i);
        else if (table[i] == TOMBSTONE) printf("[%d]: TOMBSTONE (-1)\\n", i);
        else printf("[%d]: %d\\n", i, table[i]);
    }
}

int main() {
    initTable();
    printf("=== Linear Probing with Tombstones ===\\n");
    insert(12); // idx 2
    insert(22); // idx 3
    insert(32); // idx 4
    display();

    printf("\\nDeleting key 22...\\n");
    deleteKey(22);
    display();

    printf("\\nSearching for 32...\\n");
    int found = search(32);
    if (found != -1) printf("Key 32 successfully found at slot %d (probe passed tombstone!)\\n", found);
    else printf("Key 32 not found!\\n");

    return 0;
}`
  },
  {
    id: 'u2-hash-quadratic-probing',
    unitId: 2,
    topic: 'Hashing',
    title: 'Hash Table with Quadratic Probing',
    category: 'Hashing',
    status: 'COMPLETE',
    description: 'Implements Quadratic Probing: index = (h(k) + c1*i + c2*i^2) % m. Mitigates primary clustering by spacing probe points quadratically.',
    timeComplexity: 'Average: O(1 / (1 - alpha))',
    spaceComplexity: 'O(TABLE_SIZE) fixed array',
    isStandalone: true,
    relatedLessonId: 'u2-hashing',
    relatedVisualizer: 'hashing',
    algorithmSteps: [
      'Slot computation: idx = (key % SIZE + i * i) % SIZE for probe i = 0, 1, 2...',
      'Check if slot is empty; if so, insert and return.',
      'Stop if probe count reaches SIZE (avoid infinite loop).'
    ],
    edgeCases: [
      'Secondary clustering (keys with identical initial hash follow same quadratic path)',
      'Table size not being prime (can fail to find an empty slot even if table is half empty)'
    ],
    sampleInput: 'Keys: 25, 35, 45 with table size 11',
    expectedOutput: '25 at 3, 35 probes (3 + 1^2) = 4, 45 probes (3 + 1^2) -> (3 + 2^2) = 7.',
    code: `#include <stdio.h>
#define SIZE 11
#define EMPTY -1

int table[SIZE];

void init() { for (int i = 0; i < SIZE; i++) table[i] = EMPTY; }

int insert(int key) {
    int h = key % SIZE;
    for (int i = 0; i < SIZE; i++) {
        int idx = (h + i * i) % SIZE;
        if (table[idx] == EMPTY) {
            table[idx] = key;
            return idx;
        }
    }
    printf("Quadratic probe failed to place key %d\\n", key);
    return -1;
}

int main() {
    init();
    printf("=== Quadratic Probing (Table Size %d) ===\\n", SIZE);
    insert(25); // 25 % 11 = 3
    insert(36); // 36 % 11 = 3 -> probes 3 + 1^2 = 4
    insert(47); // 47 % 11 = 3 -> probes 3 + 1^2 = 4 (taken) -> 3 + 2^2 = 7

    for (int i = 0; i < SIZE; i++) {
        if (table[i] != EMPTY) printf("[%d]: %d\\n", i, table[i]);
        else printf("[%d]: EMPTY\\n", i);
    }
    return 0;
}`
  },
  {
    id: 'u2-hash-double-hashing',
    unitId: 2,
    topic: 'Hashing',
    title: 'Hash Table with Double Hashing',
    category: 'Hashing',
    status: 'COMPLETE',
    description: 'Implements Double Hashing: index = (h1(key) + i * h2(key)) % m. Eliminates both primary and secondary clustering by utilizing two independent hash functions.',
    timeComplexity: 'Average: O(1 / (1 - alpha))',
    spaceComplexity: 'O(TABLE_SIZE) fixed array',
    isStandalone: true,
    relatedLessonId: 'u2-hashing',
    relatedVisualizer: 'hashing',
    algorithmSteps: [
      'h1(k) = k % TABLE_SIZE',
      'h2(k) = PRIME - (k % PRIME), ensuring h2(k) > 0 and coprime to TABLE_SIZE',
      'Probe equation: slot = (h1(k) + i * h2(k)) % TABLE_SIZE for i = 0, 1, 2...'
    ],
    edgeCases: [
      'h2(k) returning 0 (would cause infinite loop on same slot; prevented by PRIME - (k % PRIME))',
      'TABLE_SIZE chosen as a prime number (e.g. 11, 13) to ensure full period'
    ],
    sampleInput: 'Keys: 19, 27, 36, 10 into table of size 11 with secondary prime 7',
    expectedOutput: 'Collision resolution spreads keys across distinct steps per key.',
    code: `#include <stdio.h>
#define SIZE 11
#define PRIME 7
#define EMPTY -1

int table[SIZE];

int h1(int key) { return key % SIZE; }
int h2(int key) { return PRIME - (key % PRIME); } // Must be non-zero

int insert(int key) {
    int base = h1(key);
    int step = h2(key);

    for (int i = 0; i < SIZE; i++) {
        int idx = (base + i * step) % SIZE;
        if (table[idx] == EMPTY) {
            table[idx] = key;
            return idx;
        }
    }
    printf("Table full! Cannot insert %d\\n", key);
    return -1;
}

int main() {
    for (int i = 0; i < SIZE; i++) table[i] = EMPTY;
    printf("=== Double Hashing (h1: k %% %d, h2: %d - (k %% %d)) ===\\n", SIZE, PRIME, PRIME);

    insert(19); // h1=8
    insert(30); // h1=8 -> collision! h2 = 7 - (30%7) = 5. idx = (8 + 1*5)%11 = 2
    insert(41); // h1=8 -> collision! h2 = 7 - (41%7) = 1. idx = (8 + 1*1)%11 = 9

    for (int i = 0; i < SIZE; i++) {
        if (table[i] != EMPTY) printf("[%d]: %d\\n", i, table[i]);
        else printf("[%d]: EMPTY\\n", i);
    }
    return 0;
}`
  }
];
