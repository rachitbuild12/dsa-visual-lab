import { CProgram } from '../../types';

export const unit3Programs: CProgram[] = [
  {
    id: 'u3-stack-array',
    unitId: 3,
    topic: 'Stack Operations',
    title: 'Stack Implementation Using Fixed-Size Array',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Implements a LIFO stack using a fixed-capacity static array. Features push, pop, peek, isEmpty, isFull operations, with explicit checks for overflow and underflow conditions.',
    timeComplexity: 'Push, Pop, Peek, IsEmpty, IsFull: all O(1)',
    spaceComplexity: 'O(CAPACITY) static memory allocation',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Initialize top = -1.',
      'push(x): If top == CAPACITY - 1, display Overflow and reject. Otherwise top = top + 1; stack[top] = x.',
      'pop(): If top == -1, display Underflow and reject. Otherwise val = stack[top]; top = top - 1; return val.',
      'peek(): If top == -1, return error. Otherwise return stack[top].'
    ],
    edgeCases: [
      'Popping or peeking from an empty stack (underflow check)',
      'Pushing into an already filled stack (overflow check)',
      'Stack with exactly 1 element'
    ],
    sampleInput: 'Push 10, 20, 30. Peek, Pop, Pop, Pop.',
    expectedOutput: 'Top: 30, Popped: 30, Popped: 20, Popped: 10, Underflow on next pop.',
    code: `#include <stdio.h>
#define CAPACITY 5

typedef struct {
    int data[CAPACITY];
    int top;
} ArrayStack;

void init(ArrayStack *s) {
    s->top = -1;
}

int isFull(ArrayStack *s) {
    return s->top == CAPACITY - 1;
}

int isEmpty(ArrayStack *s) {
    return s->top == -1;
}

int push(ArrayStack *s, int val) {
    if (isFull(s)) {
        printf("Error: Stack Overflow! Cannot push %d (Capacity %d reached)\\n", val, CAPACITY);
        return 0;
    }
    s->top++;
    s->data[s->top] = val;
    printf("Pushed: %d (Current Top index: %d)\\n", val, s->top);
    return 1;
}

int pop(ArrayStack *s, int *poppedVal) {
    if (isEmpty(s)) {
        printf("Error: Stack Underflow! Cannot pop from empty stack\\n");
        return 0;
    }
    *poppedVal = s->data[s->top];
    s->top--;
    return 1;
}

int peek(ArrayStack *s, int *topVal) {
    if (isEmpty(s)) {
        printf("Stack is empty, no top element.\\n");
        return 0;
    }
    *topVal = s->data[s->top];
    return 1;
}

void display(ArrayStack *s) {
    if (isEmpty(s)) {
        printf("[ Empty Stack ]\\n");
        return;
    }
    printf("Stack (Top -> Bottom): ");
    for (int i = s->top; i >= 0; i--) {
        printf("[%d] ", s->data[i]);
    }
    printf("\\n");
}

int main() {
    ArrayStack s;
    init(&s);
    int val;

    printf("=== Array Stack Demonstration ===\\n");
    push(&s, 10);
    push(&s, 20);
    push(&s, 30);
    display(&s);

    if (peek(&s, &val)) printf("Peek: %d\\n", val);

    pop(&s, &val); printf("Popped: %d\\n", val);
    pop(&s, &val); printf("Popped: %d\\n", val);
    display(&s);

    pop(&s, &val); printf("Popped: %d\\n", val);
    pop(&s, &val); // Triggers underflow

    return 0;
}`
  },
  {
    id: 'u3-stack-linked-list',
    unitId: 3,
    topic: 'Stack Operations',
    title: 'Stack Implementation Using Linked List (Dynamic Memory)',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Implements a dynamic LIFO stack where nodes are allocated on the heap at runtime. The top pointer points to the head of the list, ensuring O(1) push and pop operations without arbitrary capacity limits.',
    timeComplexity: 'Push, Pop, Peek, IsEmpty: all O(1)',
    spaceComplexity: 'O(N) dynamic heap memory for N elements',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Initialize top = NULL.',
      'push(val): newNode = malloc(sizeof(StackNode)). newNode->data = val; newNode->next = top; top = newNode.',
      'pop(): If top == NULL, return Underflow. temp = top; val = temp->data; top = top->next; free(temp); return val.',
      'peek(): If top == NULL, return error. Return top->data.'
    ],
    edgeCases: [
      'Underflow when popping from an empty list (top == NULL)',
      'Heap exhaustion on malloc failure',
      'Freeing the popped node memory to prevent memory leaks'
    ],
    sampleInput: 'Push 100, 200, 300, Pop 2 elements',
    expectedOutput: 'Pushed 100, 200, 300. Popped 300, Popped 200. Remaining: [100].',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct StackNode {
    int data;
    struct StackNode *next;
} StackNode;

typedef struct {
    StackNode *top;
    int size;
} LinkedStack;

void init(LinkedStack *s) {
    s->top = NULL;
    s->size = 0;
}

int isEmpty(LinkedStack *s) {
    return s->top == NULL;
}

void push(LinkedStack *s, int val) {
    StackNode *newNode = (StackNode*)malloc(sizeof(StackNode));
    if (!newNode) {
        printf("Error: Heap memory allocation failed!\\n");
        return;
    }
    newNode->data = val;
    newNode->next = s->top;
    s->top = newNode;
    s->size++;
    printf("Pushed: %d (Heap Address: %p)\\n", val, (void*)newNode);
}

int pop(LinkedStack *s, int *poppedVal) {
    if (isEmpty(s)) {
        printf("Error: Stack Underflow!\\n");
        return 0;
    }
    StackNode *temp = s->top;
    *poppedVal = temp->data;
    s->top = s->top->next;
    free(temp);
    s->size--;
    return 1;
}

int peek(LinkedStack *s, int *topVal) {
    if (isEmpty(s)) return 0;
    *topVal = s->top->data;
    return 1;
}

void display(LinkedStack *s) {
    StackNode *curr = s->top;
    printf("Linked Stack (Top -> Bottom): ");
    while (curr) {
        printf("[%d] -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL (Size: %d)\\n", s->size);
}

int main() {
    LinkedStack s;
    init(&s);
    int val;

    printf("=== Dynamic Linked-List Stack ===\\n");
    push(&s, 100);
    push(&s, 200);
    push(&s, 300);
    display(&s);

    pop(&s, &val); printf("Popped: %d\\n", val);
    pop(&s, &val); printf("Popped: %d\\n", val);
    display(&s);

    return 0;
}`
  },
  {
    id: 'u3-balanced-parentheses',
    unitId: 3,
    topic: 'Stack Applications',
    title: 'Balanced Parentheses & Bracket Matching Validator',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Validates nested expression brackets (), {}, and [] using a character stack. Detects mismatched pairs, unclosed openings, and premature closings.',
    timeComplexity: 'O(n) where n is the length of expression',
    spaceComplexity: 'O(n) worst-case stack space for nested opening brackets',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Iterate through character string from left to right.',
      'If character is opening bracket (, {, or [, push onto stack.',
      'If character is closing bracket ), }, or ]:',
      '  If stack is empty, return false (premature closing).',
      '  Pop top bracket. If popped opening does not match closing type, return false.',
      'After full scan, if stack is empty return true (balanced), otherwise false (unclosed openings).'
    ],
    edgeCases: [
      'Empty string (trivially balanced)',
      'Expression starting with a closing bracket (e.g. ")(")',
      'Mismatched bracket types (e.g. "(]")',
      'Unbalanced open brackets at the end (e.g. "((()")'
    ],
    sampleInput: 'Expression: "{[()]}", Expression: "{[(])}"',
    expectedOutput: '"{[()]}" is Balanced. "{[(])}" is NOT Balanced (mismatch).',
    code: `#include <stdio.h>
#include <string.h>

int isMatchingPair(char open, char close) {
    if (open == '(' && close == ')') return 1;
    if (open == '{' && close == '}') return 1;
    if (open == '[' && close == ']') return 1;
    return 0;
}

int isBalanced(const char *expr) {
    char stack[100];
    int top = -1;

    for (int i = 0; expr[i] != '\\0'; i++) {
        char ch = expr[i];
        if (ch == '(' || ch == '{' || ch == '[') {
            stack[++top] = ch; // Push
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (top == -1) {
                return 0; // Closing bracket with empty stack
            }
            char open = stack[top--]; // Pop
            if (!isMatchingPair(open, ch)) {
                return 0; // Mismatched bracket types
            }
        }
    }
    return (top == -1); // If empty, balanced; else unclosed
}

int main() {
    const char *test1 = "{[()]}";
    const char *test2 = "{[(])}";
    const char *test3 = "((())";
    const char *test4 = ")([]";

    printf("=== Balanced Parentheses Validation ===\\n");
    printf("Expr '%s': %s\\n", test1, isBalanced(test1) ? "BALANCED" : "NOT BALANCED");
    printf("Expr '%s': %s\\n", test2, isBalanced(test2) ? "BALANCED" : "NOT BALANCED");
    printf("Expr '%s': %s\\n", test3, isBalanced(test3) ? "BALANCED" : "NOT BALANCED");
    printf("Expr '%s': %s\\n", test4, isBalanced(test4) ? "BALANCED" : "NOT BALANCED");

    return 0;
}`
  },
  {
    id: 'u3-infix-to-postfix',
    unitId: 3,
    topic: 'Expression Conversion',
    title: 'Infix to Postfix Conversion (Shunting-Yard Precedence Stack)',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Converts standard infix arithmetic expressions containing operators +, -, *, /, ^ and parentheses () into Reverse Polish Notation (postfix) using operator precedence and associativity.',
    timeComplexity: 'O(n) where n is expression length',
    spaceComplexity: 'O(n) for operator stack and postfix output buffer',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Operands (letters/numbers) go directly to output.',
      'Opening parenthesis ( pushed to stack.',
      'Closing parenthesis ): pop operators from stack to output until matching ( is popped.',
      'Operator encountered: while stack top operator has higher or equal precedence (and is left-associative), pop to output. Then push current operator.',
      'At end of expression: pop all remaining operators from stack to output.'
    ],
    edgeCases: [
      'Right-associative operator ^ (power) does not pop equal precedence ^',
      'Nested parentheses: ((A+B)*C)',
      'Complex operator precedence: ^ > * / > + -'
    ],
    sampleInput: 'Infix: "A+B*(C^D-E)"',
    expectedOutput: 'Postfix: "ABCD^E-*+"',
    code: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

int isRightAssociative(char op) {
    return (op == '^');
}

void infixToPostfix(const char *infix, char *postfix) {
    char stack[100];
    int top = -1;
    int k = 0;

    for (int i = 0; infix[i] != '\\0'; i++) {
        char ch = infix[i];

        if (isalnum(ch)) {
            postfix[k++] = ch; // Operands appended directly
        } else if (ch == '(') {
            stack[++top] = ch;
        } else if (ch == ')') {
            while (top != -1 && stack[top] != '(') {
                postfix[k++] = stack[top--];
            }
            if (top != -1) top--; // Discard '('
        } else {
            // Operator
            while (top != -1 && stack[top] != '(' &&
                   (precedence(stack[top]) > precedence(ch) ||
                   (precedence(stack[top]) == precedence(ch) && !isRightAssociative(ch)))) {
                postfix[k++] = stack[top--];
            }
            stack[++top] = ch;
        }
    }

    while (top != -1) {
        postfix[k++] = stack[top--];
    }
    postfix[k] = '\\0';
}

int main() {
    const char *infix = "A+B*(C^D-E)";
    char postfix[100];

    infixToPostfix(infix, postfix);
    printf("=== Infix to Postfix Conversion ===\\n");
    printf("Infix Expression:   %s\\n", infix);
    printf("Postfix Expression: %s\\n", postfix);
    return 0;
}`
  },
  {
    id: 'u3-infix-to-prefix',
    unitId: 3,
    topic: 'Expression Conversion',
    title: 'Infix to Prefix Conversion',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Converts infix expression to Polish Notation (prefix) by reversing infix, inverting parentheses, running modified infix-to-postfix, and reversing the result.',
    timeComplexity: 'O(n) linear time',
    spaceComplexity: 'O(n) buffer space',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Reverse the infix string.',
      'Swap all ( with ) and all ) with (.',
      'Convert to postfix using modified operator precedence (treating left/right associativity correctly).',
      'Reverse the resulting postfix expression to obtain final prefix expression.'
    ],
    edgeCases: [
      'Expressions with multiple levels of nested parentheses',
      'Operators with differing precedence levels'
    ],
    sampleInput: 'Infix: "(A-B/C)*(A/K-L)"',
    expectedOutput: 'Prefix: "* - A / B C - / A K L"',
    code: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void reverseStr(char *str) {
    int n = strlen(str);
    for (int i = 0; i < n / 2; i++) {
        char t = str[i];
        str[i] = str[n - 1 - i];
        str[n - 1 - i] = t;
    }
}

void infixToPrefix(char *infix, char *prefix) {
    reverseStr(infix);
    for (int i = 0; infix[i] != '\\0'; i++) {
        if (infix[i] == '(') infix[i] = ')';
        else if (infix[i] == ')') infix[i] = '(';
    }

    char stack[100];
    int top = -1, k = 0;
    for (int i = 0; infix[i] != '\\0'; i++) {
        char ch = infix[i];
        if (isalnum(ch)) {
            prefix[k++] = ch;
        } else if (ch == '(') {
            stack[++top] = ch;
        } else if (ch == ')') {
            while (top != -1 && stack[top] != '(') {
                prefix[k++] = stack[top--];
            }
            if (top != -1) top--;
        } else {
            while (top != -1 && stack[top] != '(' && precedence(stack[top]) > precedence(ch)) {
                prefix[k++] = stack[top--];
            }
            stack[++top] = ch;
        }
    }
    while (top != -1) prefix[k++] = stack[top--];
    prefix[k] = '\\0';

    reverseStr(prefix);
}

int main() {
    char infix[] = "(A-B/C)*(A/K-L)";
    char prefix[100];

    printf("=== Infix to Prefix Conversion ===\\n");
    printf("Infix:  %s\\n", infix);
    infixToPrefix(infix, prefix);
    printf("Prefix: %s\\n", prefix);
    return 0;
}`
  },
  {
    id: 'u3-postfix-evaluation',
    unitId: 3,
    topic: 'Expression Evaluation',
    title: 'Multi-Token Postfix Expression Evaluator',
    category: 'Stacks',
    status: 'COMPLETE',
    description: 'Evaluates postfix arithmetic expressions containing numbers and operators (+, -, *, /, ^) using an operand stack. Supports space-delimited multi-digit integers.',
    timeComplexity: 'O(n) where n is number of tokens',
    spaceComplexity: 'O(n) operand stack space',
    isStandalone: true,
    relatedLessonId: 'u3-stacks-intro',
    relatedVisualizer: 'stack',
    algorithmSteps: [
      'Tokenize postfix expression.',
      'If token is a number, push onto operand stack.',
      'If token is operator op, pop operand2, pop operand1.',
      'Compute result = operand1 op operand2.',
      'Push result back onto stack.',
      'Final result is the single value remaining on the stack.'
    ],
    edgeCases: [
      'Division by zero check',
      'Operand stack underflow (malformed expression)',
      'Multiple leftover operands on stack (missing operator)'
    ],
    sampleInput: 'Postfix: "10 5 + 60 6 / *"',
    expectedOutput: 'Result: (10 + 5) * (60 / 6) = 15 * 10 = 150',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

int evaluatePostfix(char *expr) {
    int stack[100];
    int top = -1;
    char *token = strtok(expr, " ");

    while (token != NULL) {
        if (strcmp(token, "+") == 0 || strcmp(token, "-") == 0 ||
            strcmp(token, "*") == 0 || strcmp(token, "/") == 0 ||
            strcmp(token, "^") == 0) {
            
            if (top < 1) {
                printf("Error: Malformed expression!\\n");
                return 0;
            }
            int op2 = stack[top--];
            int op1 = stack[top--];
            int res = 0;

            if (strcmp(token, "+") == 0) res = op1 + op2;
            else if (strcmp(token, "-") == 0) res = op1 - op2;
            else if (strcmp(token, "*") == 0) res = op1 * op2;
            else if (strcmp(token, "/") == 0) {
                if (op2 == 0) { printf("Error: Division by zero!\\n"); return 0; }
                res = op1 / op2;
            } else if (strcmp(token, "^") == 0) res = (int)pow(op1, op2);

            stack[++top] = res;
        } else {
            // Number
            stack[++top] = atoi(token);
        }
        token = strtok(NULL, " ");
    }
    return stack[top];
}

int main() {
    char expr[] = "10 5 + 60 6 / *";
    printf("=== Postfix Expression Evaluator ===\\n");
    printf("Expression: %s\\n", expr);
    int result = evaluatePostfix(expr);
    printf("Evaluation Result: %d\\n", result);
    return 0;
}`
  },
  {
    id: 'u3-factorial-iter-rec',
    unitId: 3,
    topic: 'Recursion',
    title: 'Factorial: Iterative vs Recursive Comparison',
    category: 'Recursion',
    status: 'COMPLETE',
    description: 'Compares iterative loop versus recursive stack-frame call tree execution for computing n!. Illustrates call-stack activation records and memory overhead.',
    timeComplexity: 'Both: O(n)',
    spaceComplexity: 'Iterative: O(1), Recursive: O(n) activation stack frames',
    isStandalone: true,
    relatedLessonId: 'u3-recursion-basics',
    relatedVisualizer: 'recursion',
    algorithmSteps: [
      'Iterative: result = 1. Loop i from 2 to n: result *= i. Return result.',
      'Recursive: Base case if n <= 1 return 1. Else return n * fact(n - 1).'
    ],
    edgeCases: [
      'n = 0 and n = 1 (base cases returning 1)',
      'Negative inputs (invalid for standard factorial)',
      'Integer overflow for n > 12 with standard 32-bit signed ints'
    ],
    sampleInput: 'Compute factorial for n = 5',
    expectedOutput: 'Iterative: 120, Recursive: 120 with 5 stack frames traced.',
    code: `#include <stdio.h>

long long factIterative(int n) {
    long long res = 1;
    for (int i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

long long factRecursive(int n, int depth) {
    for (int i = 0; i < depth; i++) printf("  ");
    printf("-> fact(%d) [Stack Frame #%d]\\n", n, depth);

    if (n <= 1) {
        for (int i = 0; i < depth; i++) printf("  ");
        printf("<- Return 1 (Base Case)\\n");
        return 1;
    }

    long long subResult = factRecursive(n - 1, depth + 1);
    long long total = n * subResult;

    for (int i = 0; i < depth; i++) printf("  ");
    printf("<- Return %d * %lld = %lld\\n", n, subResult, total);
    return total;
}

int main() {
    int n = 5;
    printf("=== Factorial: Iterative vs Recursive ===\\n");
    printf("Iterative result for %d! = %lld (Space: O(1))\\n\\n", n, factIterative(n));

    printf("Recursive call trace with stack frames (Space: O(n)):\\n");
    long long recRes = factRecursive(n, 0);
    printf("\\nFinal Recursive Result: %lld\\n", recRes);
    return 0;
}`
  },
  {
    id: 'u3-fibonacci-iter-rec',
    unitId: 3,
    topic: 'Recursion',
    title: 'Fibonacci Series: Iterative vs Recursive',
    category: 'Recursion',
    status: 'COMPLETE',
    description: 'Demonstrates exponential O(2^n) call tree in naive recursive Fibonacci versus linear O(n) iterative approach with two state variables.',
    timeComplexity: 'Iterative: O(n), Naive Recursive: O(2^n)',
    spaceComplexity: 'Iterative: O(1), Recursive: O(n) stack depth',
    isStandalone: true,
    relatedLessonId: 'u3-recursion-basics',
    relatedVisualizer: 'recursion',
    algorithmSteps: [
      'Iterative: if n <= 1 return n. Maintain prev=0, curr=1. Loop n-1 times: next = prev + curr; prev = curr; curr = next.',
      'Recursive: if n <= 1 return n. Return fib(n-1) + fib(n-2).'
    ],
    edgeCases: [
      'n = 0 returns 0',
      'n = 1 returns 1',
      'Large n causing exponential call explosion in naive recursion'
    ],
    sampleInput: 'Compute Fibonacci term 7',
    expectedOutput: 'Iterative: 13, Recursive: 13 with call count recorded.',
    code: `#include <stdio.h>

int recCallCount = 0;

int fibRecursive(int n) {
    recCallCount++;
    if (n <= 1) return n;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

int fibIterative(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    int n = 7;
    printf("=== Fibonacci: Iterative vs Recursive ===\\n");
    printf("Iterative fib(%d) = %d [O(n) time, O(1) space]\\n", n, fibIterative(n));

    recCallCount = 0;
    int res = fibRecursive(n);
    printf("Recursive fib(%d) = %d [Total function calls: %d (O(2^n))]\\n", n, res, recCallCount);
    return 0;
}`
  },
  {
    id: 'u3-tower-of-hanoi',
    unitId: 3,
    topic: 'Recursion',
    title: 'Tower of Hanoi Recursive Solver',
    category: 'Recursion',
    status: 'COMPLETE',
    description: 'Solves classic Tower of Hanoi puzzle for N discs using 3 rods (Source, Auxiliary, Destination). Demonstrates recursive problem decomposition requiring 2^n - 1 moves.',
    timeComplexity: 'O(2^n) time complexity',
    spaceComplexity: 'O(n) recursive call stack space',
    isStandalone: true,
    relatedLessonId: 'u3-recursion-basics',
    relatedVisualizer: 'recursion',
    algorithmSteps: [
      'Base condition: if n == 1, move disk 1 directly from source to destination rod.',
      'Step 1: Move top n - 1 disks from source to auxiliary rod using destination as helper.',
      'Step 2: Move disk n directly from source to destination rod.',
      'Step 3: Move n - 1 disks from auxiliary rod to destination rod using source as helper.'
    ],
    edgeCases: [
      'n = 1 disk (requires exactly 1 move)',
      'n = 3 disks (requires exactly 2^3 - 1 = 7 moves)'
    ],
    sampleInput: 'Disks: 3, Rods: A (Source), B (Auxiliary), C (Destination)',
    expectedOutput: '7 sequential disk moves transferring all discs legally.',
    code: `#include <stdio.h>

int moveCount = 0;

void towerOfHanoi(int n, char fromRod, char toRod, char auxRod) {
    if (n == 1) {
        moveCount++;
        printf("Move %2d: Move disk 1 from rod %c -> rod %c\\n", moveCount, fromRod, toRod);
        return;
    }
    // Move n-1 disks from source to auxiliary
    towerOfHanoi(n - 1, fromRod, auxRod, toRod);

    // Move nth disk from source to destination
    moveCount++;
    printf("Move %2d: Move disk %d from rod %c -> rod %c\\n", moveCount, n, fromRod, toRod);

    // Move n-1 disks from auxiliary to destination
    towerOfHanoi(n - 1, auxRod, toRod, fromRod);
}

int main() {
    int n = 3;
    printf("=== Tower of Hanoi (%d Disks) ===\\n", n);
    towerOfHanoi(n, 'A', 'C', 'B');
    printf("Total moves required: %d (Formula: 2^%d - 1 = %d)\\n", moveCount, n, (1 << n) - 1);
    return 0;
}`
  },
  {
    id: 'u3-tail-recursion-elimination',
    unitId: 3,
    topic: 'Recursion',
    title: 'Tail Recursion Elimination & Optimization',
    category: 'Recursion',
    status: 'COMPLETE',
    description: 'Demonstrates how tail-recursive algorithms (where recursive call is the final statement) can be mechanically transformed into iterative while-loops, saving O(n) stack memory.',
    timeComplexity: 'Both: O(log(min(a, b))) for Euclidean GCD',
    spaceComplexity: 'Tail-recursive: O(k) stack frames without compiler optimization, Iterative: O(1)',
    isStandalone: true,
    relatedLessonId: 'u3-recursion-basics',
    relatedVisualizer: 'recursion',
    algorithmSteps: [
      'Identify tail recursion: return gcd(b, a % b).',
      'Replace tail call with parameter reassignment and loop jump:',
      '  while (b != 0) { temp = a % b; a = b; b = temp; } return a;'
    ],
    edgeCases: [
      'b = 0 (immediate termination with return a)',
      'a < b (first modulo operation automatically swaps parameters)'
    ],
    sampleInput: 'GCD of 48 and 18',
    expectedOutput: 'GCD is 6, computed both tail-recursively and via eliminated loop.',
    code: `#include <stdio.h>

// Tail Recursive: recursive call is the very last operation
int gcdTailRecursive(int a, int b) {
    if (b == 0) return a;
    return gcdTailRecursive(b, a % b); // Tail call
}

// Mechanically eliminated iterative version: NO stack frames
int gcdIterative(int a, int b) {
    while (b != 0) {
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    return a;
}

int main() {
    int a = 48, b = 18;
    printf("=== Tail Recursion Elimination (Euclidean GCD) ===\\n");
    printf("Tail-Recursive GCD(%d, %d) = %d\\n", a, b, gcdTailRecursive(a, b));
    printf("Iterative Loop GCD(%d, %d) = %d (Space optimized to O(1))\\n", a, b, gcdIterative(a, b));
    return 0;
}`
  },
  {
    id: 'u3-queue-array',
    unitId: 3,
    topic: 'Queue Operations',
    title: 'Linear Queue Using Array & False Overflow Demonstration',
    category: 'Queues',
    status: 'COMPLETE',
    description: 'Implements standard linear FIFO queue using an array. Demonstrates the critical flaw of false overflow where rear reaches CAPACITY-1 despite empty vacated slots at the front.',
    timeComplexity: 'Enqueue: O(1), Dequeue: O(1)',
    spaceComplexity: 'O(CAPACITY) array space',
    isStandalone: true,
    relatedLessonId: 'u3-queues-intro',
    relatedVisualizer: 'queue',
    algorithmSteps: [
      'Initialize front = -1, rear = -1.',
      'Enqueue(x): if rear == CAPACITY - 1, false overflow! If front == -1, front = 0; rear = rear + 1; queue[rear] = x.',
      'Dequeue(): if front == -1 or front > rear, underflow. Val = queue[front]; front = front + 1.'
    ],
    edgeCases: [
      'False Overflow: rear == CAPACITY - 1 while front > 0',
      'Empty queue when front > rear',
      'Resetting front and rear to -1 when queue becomes empty'
    ],
    sampleInput: 'Enqueue 1, 2, 3. Dequeue 2 elements. Enqueue 4, 5. Attempt Enqueue 6.',
    expectedOutput: 'False overflow triggered when attempting to insert beyond array end.',
    code: `#include <stdio.h>
#define CAPACITY 4

typedef struct {
    int data[CAPACITY];
    int front;
    int rear;
} LinearQueue;

void init(LinearQueue *q) {
    q->front = -1;
    q->rear = -1;
}

int enqueue(LinearQueue *q, int val) {
    if (q->rear == CAPACITY - 1) {
        printf("FALSE OVERFLOW: rear=%d reached CAPACITY-1! Cannot enqueue %d, even though front=%d slots are empty!\\n",
               q->rear, val, q->front);
        return 0;
    }
    if (q->front == -1) q->front = 0;
    q->rear++;
    q->data[q->rear] = val;
    printf("Enqueued %d (front: %d, rear: %d)\\n", val, q->front, q->rear);
    return 1;
}

int dequeue(LinearQueue *q, int *val) {
    if (q->front == -1 || q->front > q->rear) {
        printf("Underflow: Queue is empty!\\n");
        return 0;
    }
    *val = q->data[q->front];
    q->front++;
    return 1;
}

int main() {
    LinearQueue q;
    init(&q);
    int val;

    printf("=== Linear Queue (False Overflow Demo) ===\\n");
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    enqueue(&q, 40); // Queue full

    dequeue(&q, &val); // Frees slot 0
    dequeue(&q, &val); // Frees slot 1

    printf("\\nAttempting to enqueue into vacated slots...\\n");
    enqueue(&q, 50); // Fails due to linear false overflow!
    return 0;
}`
  },
  {
    id: 'u3-queue-linked-list',
    unitId: 3,
    topic: 'Queue Operations',
    title: 'Queue Implementation Using Linked List',
    category: 'Queues',
    status: 'COMPLETE',
    description: 'Dynamic FIFO queue maintaining front and rear pointers to head and tail of linked list. Guarantees O(1) enqueue and dequeue operations without capacity bounds or false overflow.',
    timeComplexity: 'Enqueue, Dequeue, Peek, IsEmpty: all O(1)',
    spaceComplexity: 'O(N) heap memory for N nodes',
    isStandalone: true,
    relatedLessonId: 'u3-queues-intro',
    relatedVisualizer: 'queue',
    algorithmSteps: [
      'Initialize front = NULL, rear = NULL.',
      'Enqueue(val): newNode = malloc(). newNode->data = val; newNode->next = NULL. If rear == NULL, front = rear = newNode; else rear->next = newNode; rear = newNode.',
      'Dequeue(): If front == NULL, underflow. temp = front; val = temp->data; front = front->next; if (front == NULL) rear = NULL; free(temp); return val.'
    ],
    edgeCases: [
      'Dequeue from empty queue',
      'Dequeuing the only element in queue (both front and rear reset to NULL)',
      'Memory management (freeing dequeued node)'
    ],
    sampleInput: 'Enqueue 10, 20, 30. Dequeue 1. Enqueue 40.',
    expectedOutput: 'Queue: [20 -> 30 -> 40 -> NULL].',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct QNode {
    int data;
    struct QNode *next;
} QNode;

typedef struct {
    QNode *front;
    QNode *rear;
} LinkedQueue;

void init(LinkedQueue *q) {
    q->front = q->rear = NULL;
}

void enqueue(LinkedQueue *q, int val) {
    QNode *newNode = (QNode*)malloc(sizeof(QNode));
    newNode->data = val;
    newNode->next = NULL;
    if (q->rear == NULL) {
        q->front = q->rear = newNode;
        return;
    }
    q->rear->next = newNode;
    q->rear = newNode;
}

int dequeue(LinkedQueue *q, int *val) {
    if (q->front == NULL) {
        printf("Queue Underflow!\\n");
        return 0;
    }
    QNode *temp = q->front;
    *val = temp->data;
    q->front = q->front->next;
    if (q->front == NULL) {
        q->rear = NULL;
    }
    free(temp);
    return 1;
}

void display(LinkedQueue *q) {
    QNode *curr = q->front;
    printf("Queue: ");
    while (curr) {
        printf("[%d] -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    LinkedQueue q;
    init(&q);
    int val;

    printf("=== Dynamic Linked Queue ===\\n");
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    display(&q);

    dequeue(&q, &val);
    printf("Dequeued: %d\\n", val);
    enqueue(&q, 40);
    display(&q);
    return 0;
}`
  },
  {
    id: 'u3-circular-queue',
    unitId: 3,
    topic: 'Queue Operations',
    title: 'Circular Queue Using Array (Modulo Arithmetic)',
    category: 'Queues',
    status: 'COMPLETE',
    description: 'Implements circular queue using modulo arithmetic (rear + 1) % CAPACITY, completely eliminating false overflow and recycling slots efficiently.',
    timeComplexity: 'Enqueue, Dequeue, Peek: all O(1)',
    spaceComplexity: 'O(CAPACITY) array storage',
    isStandalone: true,
    relatedLessonId: 'u3-queues-intro',
    relatedVisualizer: 'queue',
    algorithmSteps: [
      'Full condition: (rear + 1) % CAPACITY == front.',
      'Empty condition: front == -1.',
      'Enqueue(val): If full, report overflow. If empty, front = 0; rear = (rear + 1) % CAPACITY; arr[rear] = val.',
      'Dequeue(): If empty, report underflow. Val = arr[front]. If front == rear (last element), reset front = rear = -1; else front = (front + 1) % CAPACITY.'
    ],
    edgeCases: [
      'Full queue: next rear equals current front',
      'Dequeuing last remaining element resets front and rear to -1',
      'Rear wrapping around from CAPACITY-1 to index 0'
    ],
    sampleInput: 'Queue of size 4. Enqueue 4 items, Dequeue 2, Enqueue 2 new items wrapping around.',
    expectedOutput: 'Successfully reuses slots 0 and 1 without false overflow.',
    code: `#include <stdio.h>
#define CAPACITY 4

typedef struct {
    int data[CAPACITY];
    int front;
    int rear;
} CircularQueue;

void init(CircularQueue *q) {
    q->front = q->rear = -1;
}

int isFull(CircularQueue *q) {
    return (q->rear + 1) % CAPACITY == q->front;
}

int isEmpty(CircularQueue *q) {
    return q->front == -1;
}

int enqueue(CircularQueue *q, int val) {
    if (isFull(q)) {
        printf("Circular Queue Full! Cannot enqueue %d\\n", val);
        return 0;
    }
    if (isEmpty(q)) {
        q->front = 0;
    }
    q->rear = (q->rear + 1) % CAPACITY;
    q->data[q->rear] = val;
    printf("Enqueued %d at index %d (front: %d, rear: %d)\\n", val, q->rear, q->front, q->rear);
    return 1;
}

int dequeue(CircularQueue *q, int *val) {
    if (isEmpty(q)) {
        printf("Circular Queue Empty!\\n");
        return 0;
    }
    *val = q->data[q->front];
    if (q->front == q->rear) {
        // Queue had one element, now empty
        q->front = q->rear = -1;
    } else {
        q->front = (q->front + 1) % CAPACITY;
    }
    return 1;
}

void display(CircularQueue *q) {
    if (isEmpty(q)) {
        printf("[ Empty Circular Queue ]\\n");
        return;
    }
    printf("Circular Queue elements: ");
    int i = q->front;
    while (1) {
        printf("[%d: val %d] ", i, q->data[i]);
        if (i == q->rear) break;
        i = (i + 1) % CAPACITY;
    }
    printf("\\n");
}

int main() {
    CircularQueue q;
    init(&q);
    int val;

    printf("=== Circular Queue Modulo Arithmetic ===\\n");
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    enqueue(&q, 40);
    display(&q);

    dequeue(&q, &val); printf("Dequeued: %d\\n", val);
    dequeue(&q, &val); printf("Dequeued: %d\\n", val);
    display(&q);

    printf("\\nWrapping around index boundary:\\n");
    enqueue(&q, 50); // Placed at index 0!
    enqueue(&q, 60); // Placed at index 1!
    display(&q);
    return 0;
}`
  },
  {
    id: 'u3-deque',
    unitId: 3,
    topic: 'Queue Operations',
    title: 'Double-Ended Queue (Deque - Input & Output Restricted)',
    category: 'Queues',
    status: 'COMPLETE',
    description: 'Implements Double-Ended Queue (Deque) allowing insertion and deletion at both front and rear ends using circular indexing.',
    timeComplexity: 'All 4 operations (insertFront, insertRear, deleteFront, deleteRear): O(1)',
    spaceComplexity: 'O(CAPACITY) circular array storage',
    isStandalone: true,
    relatedLessonId: 'u3-queues-intro',
    relatedVisualizer: 'queue',
    algorithmSteps: [
      'insertRear: rear = (rear + 1) % CAPACITY; arr[rear] = val.',
      'insertFront: front = (front - 1 + CAPACITY) % CAPACITY; arr[front] = val.',
      'deleteFront: val = arr[front]; front = (front + 1) % CAPACITY.',
      'deleteRear: val = arr[rear]; rear = (rear - 1 + CAPACITY) % CAPACITY.'
    ],
    edgeCases: [
      'Full condition: (rear + 1) % CAPACITY == front',
      'Underflow condition: front == -1',
      'Circular wrap-around when inserting at front index 0'
    ],
    sampleInput: 'insertRear 5, 10. insertFront 2. deleteRear. deleteFront.',
    expectedOutput: 'Operations at both extremities demonstrated cleanly.',
    code: `#include <stdio.h>
#define CAPACITY 5

typedef struct {
    int data[CAPACITY];
    int front;
    int rear;
} Deque;

void init(Deque *dq) { dq->front = dq->rear = -1; }
int isFull(Deque *dq) { return (dq->rear + 1) % CAPACITY == dq->front; }
int isEmpty(Deque *dq) { return dq->front == -1; }

void insertRear(Deque *dq, int val) {
    if (isFull(dq)) { printf("Deque Full!\\n"); return; }
    if (isEmpty(dq)) dq->front = 0;
    dq->rear = (dq->rear + 1) % CAPACITY;
    dq->data[dq->rear] = val;
}

void insertFront(Deque *dq, int val) {
    if (isFull(dq)) { printf("Deque Full!\\n"); return; }
    if (isEmpty(dq)) { dq->front = dq->rear = 0; }
    else { dq->front = (dq->front - 1 + CAPACITY) % CAPACITY; }
    dq->data[dq->front] = val;
}

int deleteFront(Deque *dq, int *val) {
    if (isEmpty(dq)) return 0;
    *val = dq->data[dq->front];
    if (dq->front == dq->rear) dq->front = dq->rear = -1;
    else dq->front = (dq->front + 1) % CAPACITY;
    return 1;
}

int deleteRear(Deque *dq, int *val) {
    if (isEmpty(dq)) return 0;
    *val = dq->data[dq->rear];
    if (dq->front == dq->rear) dq->front = dq->rear = -1;
    else dq->rear = (dq->rear - 1 + CAPACITY) % CAPACITY;
    return 1;
}

void display(Deque *dq) {
    if (isEmpty(dq)) { printf("Deque Empty\\n"); return; }
    printf("Deque: ");
    int i = dq->front;
    while (1) {
        printf("[%d] ", dq->data[i]);
        if (i == dq->rear) break;
        i = (i + 1) % CAPACITY;
    }
    printf("\\n");
}

int main() {
    Deque dq;
    init(&dq);
    int val;

    printf("=== Double Ended Queue (Deque) ===\\n");
    insertRear(&dq, 10);
    insertRear(&dq, 20);
    insertFront(&dq, 5);
    display(&dq);

    deleteRear(&dq, &val); printf("Deleted from rear: %d\\n", val);
    deleteFront(&dq, &val); printf("Deleted from front: %d\\n", val);
    display(&dq);
    return 0;
}`
  },
  {
    id: 'u3-priority-queue',
    unitId: 3,
    topic: 'Queue Operations',
    title: 'Priority Queue (Ascending Priority Order)',
    category: 'Queues',
    status: 'COMPLETE',
    description: 'Implements an ordered array Priority Queue where elements with lower numerical priority values are served first. Insertion maintains sorted order in O(n), dequeue takes O(1).',
    timeComplexity: 'Enqueue: O(n) sorted insertion, Dequeue: O(1)',
    spaceComplexity: 'O(CAPACITY) array space',
    isStandalone: true,
    relatedLessonId: 'u3-queues-intro',
    relatedVisualizer: 'queue',
    algorithmSteps: [
      'Each item stores value and priority.',
      'Enqueue: search for slot from rear where item.priority < new.priority. Shift elements right and insert.',
      'Dequeue: extract highest priority element from index 0 in O(1).'
    ],
    edgeCases: [
      'Enqueue when priority queue is at max capacity',
      'Multiple items with identical priority (FIFO order maintained)'
    ],
    sampleInput: 'Task A (prio 3), Task B (prio 1), Task C (prio 2)',
    expectedOutput: 'Served in order: Task B (1), Task C (2), Task A (3).',
    code: `#include <stdio.h>
#define CAPACITY 5

typedef struct {
    int val;
    int priority; // Lower integer = higher priority
} Element;

typedef struct {
    Element arr[CAPACITY];
    int size;
} PriorityQueue;

void init(PriorityQueue *pq) { pq->size = 0; }

void enqueue(PriorityQueue *pq, int val, int priority) {
    if (pq->size == CAPACITY) {
        printf("Priority Queue Full!\\n");
        return;
    }
    int i = pq->size - 1;
    // Shift elements that have lower priority (higher numerical value)
    while (i >= 0 && pq->arr[i].priority > priority) {
        pq->arr[i + 1] = pq->arr[i];
        i--;
    }
    pq->arr[i + 1].val = val;
    pq->arr[i + 1].priority = priority;
    pq->size++;
}

int dequeue(PriorityQueue *pq, Element *out) {
    if (pq->size == 0) return 0;
    *out = pq->arr[0];
    for (int i = 0; i < pq->size - 1; i++) {
        pq->arr[i] = pq->arr[i + 1];
    }
    pq->size--;
    return 1;
}

int main() {
    PriorityQueue pq;
    init(&pq);
    Element e;

    printf("=== Priority Queue (Lower Value = Higher Priority) ===\\n");
    enqueue(&pq, 101, 3); // Job 101 (Prio 3)
    enqueue(&pq, 102, 1); // Job 102 (Prio 1 - Emergency)
    enqueue(&pq, 103, 2); // Job 103 (Prio 2)

    while (dequeue(&pq, &e)) {
        printf("Processed Val: %d [Priority: %d]\\n", e.val, e.priority);
    }
    return 0;
}`
  }
];
