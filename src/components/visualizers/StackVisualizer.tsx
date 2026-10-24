import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  RotateCcw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Layers,
  Link,
  Plus,
} from 'lucide-react';

interface LLStackNode {
  id: string;
  data: number;
  simAddress: string;
  nextAddress: string | null;
}

interface StackStep {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: {
    english: string;
    hinglish: string;
  };
  cCodeLine: number;
  cCodeSnippet: {
    title: string;
    lines: string[];
  };
  // Array stack state
  arrayState?: {
    items: number[];
    top: number;
  };
  // Linked list stack state
  llState?: {
    nodes: LLStackNode[];
    topAddress: string | null;
    floatingNewNode?: LLStackNode | null;
  };
  highlightIndex?: number;
  isError?: boolean;
}

export const StackVisualizer: React.FC = () => {
  const { hinglish } = useProgress();
  const MAX_CAPACITY = 6;
  const [implementation, setImplementation] = useState<'array' | 'linked-list'>('array');

  // Base state for Array Stack
  const [arrayStack, setArrayStack] = useState<number[]>([10, 20, 30]);
  const [arrayTop, setArrayTop] = useState<number>(2);

  // Base state for Linked List Stack
  const [llStack, setLlStack] = useState<LLStackNode[]>([
    { id: 'll-3', data: 30, simAddress: '0x30C0', nextAddress: '0x2080' },
    { id: 'll-2', data: 20, simAddress: '0x2080', nextAddress: '0x1040' },
    { id: 'll-1', data: 10, simAddress: '0x1040', nextAddress: null },
  ]);

  const [inputVal, setInputVal] = useState<string>('40');

  // Stepper state
  const [steps, setSteps] = useState<StackStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1200);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateAddress = () => {
    const hex = Math.floor(0x1000 + Math.random() * 0x8000).toString(16).toUpperCase();
    return `0x${hex}`;
  };

  // Determine currently displayed visual state (from active step or current baseline)
  const currentStep = steps.length > 0 ? steps[currentStepIdx] : null;

  const displayArrayItems = currentStep?.arrayState
    ? currentStep.arrayState.items
    : arrayStack;
  const displayArrayTop = currentStep?.arrayState
    ? currentStep.arrayState.top
    : arrayTop;

  const displayLlNodes = currentStep?.llState
    ? currentStep.llState.nodes
    : llStack;
  const displayLlTop = currentStep?.llState
    ? currentStep.llState.topAddress
    : llStack.length > 0
    ? llStack[0].simAddress
    : null;
  const displayLlFloatingNode = currentStep?.llState?.floatingNewNode;

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speedMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, steps.length, speedMs]);

  // Commit operation results when stepping completes
  useEffect(() => {
    if (steps.length > 0 && currentStepIdx === steps.length - 1) {
      const finalStep = steps[steps.length - 1];
      if (finalStep.arrayState && !finalStep.isError) {
        setArrayStack(finalStep.arrayState.items);
        setArrayTop(finalStep.arrayState.top);
      }
      if (finalStep.llState && !finalStep.isError) {
        setLlStack(finalStep.llState.nodes);
      }
    }
  }, [currentStepIdx, steps]);

  // ==========================================
  // ARRAY STACK STEP GENERATORS
  // ==========================================

  const generateArrayPushSteps = () => {
    setErrorNotice(null);
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorNotice('Please enter a valid numeric value.');
      return;
    }
    setIsPlaying(false);

    const codeLines = [
      'if (top == MAX - 1) {',
      '    printf("Stack Overflow!\\n"); return; /* Bound check */',
      '}',
      'top = top + 1;     /* Increment top pointer */',
      'stack[top] = val;  /* Insert value into array slot */',
    ];

    const stepList: StackStep[] = [];

    // Step 1: Overflow Check
    const isOverflow = arrayTop >= MAX_CAPACITY - 1;
    stepList.push({
      stepIndex: 1,
      totalSteps: isOverflow ? 2 : 3,
      title: 'Check Overflow Condition',
      explanation: {
        english: `Step 1: Check if top == MAX - 1 (${arrayTop} == ${MAX_CAPACITY - 1}). ${
          isOverflow
            ? 'TRUE! The array is full. Memory bounds prevent pushing.'
            : 'FALSE. There is free capacity in the array.'
        }`,
        hinglish: `Step 1: Check karte hain kya top == MAX - 1 (${arrayTop} == ${MAX_CAPACITY - 1}) hai? ${
          isOverflow
            ? 'HAAN! Stack poori tarah bhar chuka hai (Overflow).'
            : 'NAHI. Array mein abhi khali slot maujood hai.'
        }`,
      },
      cCodeLine: 1,
      cCodeSnippet: { title: 'Array Stack Push(val) [O(1)]', lines: codeLines },
      arrayState: { items: [...arrayStack], top: arrayTop },
      isError: isOverflow,
    });

    if (isOverflow) {
      stepList.push({
        stepIndex: 2,
        totalSteps: 2,
        title: 'STACK OVERFLOW! Execution Blocked',
        explanation: {
          english: `STACK OVERFLOW! Cannot push ${val} because top (${arrayTop}) equals MAX - 1 (${MAX_CAPACITY - 1}). In C, writing beyond array bounds would corrupt adjacent RAM (Buffer Overflow)!`,
          hinglish: `STACK OVERFLOW! Stack full hone ki wajah se ${val} push nahi ho sakta. C mein boundary ke bahar likhne se memory crash ho sakti hai!`,
        },
        cCodeLine: 2,
        cCodeSnippet: { title: 'Array Stack Push(val) [O(1)]', lines: codeLines },
        arrayState: { items: [...arrayStack], top: arrayTop },
        isError: true,
      });
      setSteps(stepList);
      setCurrentStepIdx(0);
      setIsPlaying(true);
      return;
    }

    // Step 2: top = top + 1
    const newTop = arrayTop + 1;
    stepList.push({
      stepIndex: 2,
      totalSteps: 3,
      title: 'Increment top: top = top + 1',
      explanation: {
        english: `Step 2: top = top + 1. The top pointer advances from index ${arrayTop} to ${newTop}, preparing slot [${newTop}] for data storage.`,
        hinglish: `Step 2: top = top + 1. Top pointer index ${arrayTop} se badhkar ${newTop} ho jata hai.`,
      },
      cCodeLine: 4,
      cCodeSnippet: { title: 'Array Stack Push(val) [O(1)]', lines: codeLines },
      arrayState: { items: [...arrayStack], top: newTop },
    });

    // Step 3: stack[top] = val
    const updated = [...arrayStack, val];
    stepList.push({
      stepIndex: 3,
      totalSteps: 3,
      title: 'Assign Data: stack[top] = val',
      explanation: {
        english: `Step 3: stack[top] = ${val}. Stored integer ${val} at index ${newTop}. Push completed in O(1) constant time without element shifting!`,
        hinglish: `Step 3: stack[top] = ${val}. Index ${newTop} par value ${val} store ho gayi. O(1) time mein push complete!`,
      },
      cCodeLine: 5,
      cCodeSnippet: { title: 'Array Stack Push(val) [O(1)]', lines: codeLines },
      arrayState: { items: updated, top: newTop },
      highlightIndex: newTop,
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const generateArrayPopSteps = () => {
    setErrorNotice(null);
    setIsPlaying(false);

    const codeLines = [
      'if (top == -1) {',
      '    printf("Stack Underflow!\\n"); return -1; /* Empty check */',
      '}',
      'int val = stack[top]; /* Capture top element */',
      'top = top - 1;        /* Decrement top index */',
      'return val;',
    ];

    const stepList: StackStep[] = [];

    // Step 1: Underflow check
    const isUnderflow = arrayTop === -1 || arrayStack.length === 0;
    stepList.push({
      stepIndex: 1,
      totalSteps: isUnderflow ? 2 : 3,
      title: 'Check Underflow Condition',
      explanation: {
        english: `Step 1: Check if top == -1 (${arrayTop} == -1). ${
          isUnderflow
            ? 'TRUE! Stack is empty. Cannot pop.'
            : 'FALSE. Stack contains elements.'
        }`,
        hinglish: `Step 1: Check karte hain kya top == -1 hai? ${
          isUnderflow ? 'HAAN! Stack khali hai (Underflow).' : 'NAHI. Stack mein elements hain.'
        }`,
      },
      cCodeLine: 1,
      cCodeSnippet: { title: 'Array Stack Pop() [O(1)]', lines: codeLines },
      arrayState: { items: [...arrayStack], top: arrayTop },
      isError: isUnderflow,
    });

    if (isUnderflow) {
      stepList.push({
        stepIndex: 2,
        totalSteps: 2,
        title: 'STACK UNDERFLOW! Operation Terminated',
        explanation: {
          english: 'STACK UNDERFLOW! Attempting to pop from an empty stack (top == -1) returns error code -1.',
          hinglish: 'STACK UNDERFLOW! Khali stack mein se kuch pop nahi kiya ja sakta.',
        },
        cCodeLine: 2,
        cCodeSnippet: { title: 'Array Stack Pop() [O(1)]', lines: codeLines },
        arrayState: { items: [], top: -1 },
        isError: true,
      });
      setSteps(stepList);
      setCurrentStepIdx(0);
      setIsPlaying(true);
      return;
    }

    const poppedVal = arrayStack[arrayStack.length - 1];

    // Step 2: Capture val = stack[top]
    stepList.push({
      stepIndex: 2,
      totalSteps: 3,
      title: `Capture Data: val = stack[${arrayTop}] (${poppedVal})`,
      explanation: {
        english: `Step 2: int val = stack[top]. Stored value ${poppedVal} from current top index ${arrayTop} into return variable.`,
        hinglish: `Step 2: Top element (${poppedVal}) ko return karne ke liye variable mein pakad liya.`,
      },
      cCodeLine: 4,
      cCodeSnippet: { title: 'Array Stack Pop() [O(1)]', lines: codeLines },
      arrayState: { items: [...arrayStack], top: arrayTop },
      highlightIndex: arrayTop,
    });

    // Step 3: top = top - 1
    const newItems = arrayStack.slice(0, -1);
    const newTop = arrayTop - 1;
    stepList.push({
      stepIndex: 3,
      totalSteps: 3,
      title: 'Decrement top: top = top - 1',
      explanation: {
        english: `Step 3: top = top - 1. Top index lowered from ${arrayTop} to ${newTop}. Value ${poppedVal} successfully popped in O(1) time!`,
        hinglish: `Step 3: top = top - 1. Top index ghat kar ${newTop} ho gaya. Pop operation complete!`,
      },
      cCodeLine: 5,
      cCodeSnippet: { title: 'Array Stack Pop() [O(1)]', lines: codeLines },
      arrayState: { items: newItems, top: newTop },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const generateArrayPeekSteps = () => {
    setErrorNotice(null);
    setIsPlaying(false);

    const codeLines = [
      'if (top == -1) {',
      '    printf("Stack is Empty!\\n"); return -1;',
      '}',
      'return stack[top]; /* Return without modifying top */',
    ];

    const stepList: StackStep[] = [];
    if (arrayTop === -1 || arrayStack.length === 0) {
      stepList.push({
        stepIndex: 1,
        totalSteps: 1,
        title: 'Stack Underflow on Peek',
        explanation: {
          english: 'Cannot peek an empty stack (top == -1). Returns NULL or error value.',
          hinglish: 'Khali stack par peek karne se kuch nahi milta.',
        },
        cCodeLine: 2,
        cCodeSnippet: { title: 'Array Stack Peek() [O(1)]', lines: codeLines },
        arrayState: { items: [], top: -1 },
        isError: true,
      });
    } else {
      const topVal = arrayStack[arrayStack.length - 1];
      stepList.push({
        stepIndex: 1,
        totalSteps: 1,
        title: `Peek: Inspecting stack[${arrayTop}] = ${topVal}`,
        explanation: {
          english: `Peek(): Inspecting current top element (${topVal}) at index ${arrayTop}. CRUCIAL: The top pointer remains completely unchanged at ${arrayTop}. Peek never removes elements!`,
          hinglish: `Peek(): Top element (${topVal}) ko dekh rahe hain. Top index mein koi badlaav nahi hota. Peek se element delete nahi hota!`,
        },
        cCodeLine: 4,
        cCodeSnippet: { title: 'Array Stack Peek() [O(1)]', lines: codeLines },
        arrayState: { items: [...arrayStack], top: arrayTop },
        highlightIndex: arrayTop,
      });
    }

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // ==========================================
  // LINKED LIST STACK STEP GENERATORS
  // ==========================================

  const generateLlPushSteps = () => {
    setErrorNotice(null);
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorNotice('Please enter a valid numeric value.');
      return;
    }
    setIsPlaying(false);

    const newAddr = generateAddress();
    const newId = `ll-${Date.now()}`;
    const currentTopAddr = llStack.length > 0 ? llStack[0].simAddress : null;

    const codeLines = [
      'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
      'newNode->data = val;',
      'newNode->next = top; /* Link new node down to current top */',
      'top = newNode;       /* Top pointer moves to new node */',
    ];

    const stepList: StackStep[] = [];
    const freshNode: LLStackNode = {
      id: newId,
      data: val,
      simAddress: newAddr,
      nextAddress: null,
    };

    // Step 1: Allocate in heap
    stepList.push({
      stepIndex: 1,
      totalSteps: 4,
      title: 'Allocate Node in Heap Memory',
      explanation: {
        english: `Step 1: malloc(sizeof(struct Node)) requests memory from Heap. Node allocated at address ${newAddr}. Note: Unlike arrays, linked list stack never overflows unless computer RAM is 100% full!`,
        hinglish: `Step 1: malloc() se heap memory mein naya node bana address ${newAddr} par. Linked list stack tabhi overflow hota hai jab poori RAM bhar jaye!`,
      },
      cCodeLine: 1,
      cCodeSnippet: { title: 'Linked List Stack Push(val) [O(1)]', lines: codeLines },
      llState: {
        nodes: [...llStack],
        topAddress: currentTopAddr,
        floatingNewNode: freshNode,
      },
    });

    // Step 2: Assign data
    stepList.push({
      stepIndex: 2,
      totalSteps: 4,
      title: 'Assign Data: newNode->data = val',
      explanation: {
        english: `Step 2: newNode->data = ${val}. The integer value ${val} is written into node ${newAddr}.`,
        hinglish: `Step 2: Node ke data part mein ${val} store ho gaya.`,
      },
      cCodeLine: 2,
      cCodeSnippet: { title: 'Linked List Stack Push(val) [O(1)]', lines: codeLines },
      llState: {
        nodes: [...llStack],
        topAddress: currentTopAddr,
        floatingNewNode: { ...freshNode },
      },
    });

    // Step 3: Link newNode->next = top
    const linkedNode: LLStackNode = {
      ...freshNode,
      nextAddress: currentTopAddr,
    };
    stepList.push({
      stepIndex: 3,
      totalSteps: 4,
      title: 'Link newNode->next = top (CRITICAL ORDER)',
      explanation: {
        english: `Step 3: newNode->next = top. The new node links to point downward to the existing top node (${currentTopAddr || 'NULL'}). Must link first before moving top pointer!`,
        hinglish: `Step 3: newNode->next = top. Naya node purane top node ko point karne lagta hai.`,
      },
      cCodeLine: 3,
      cCodeSnippet: { title: 'Linked List Stack Push(val) [O(1)]', lines: codeLines },
      llState: {
        nodes: [...llStack],
        topAddress: currentTopAddr,
        floatingNewNode: linkedNode,
      },
    });

    // Step 4: top = newNode
    const updatedNodes = [linkedNode, ...llStack];
    stepList.push({
      stepIndex: 4,
      totalSteps: 4,
      title: 'Update Top Pointer: top = newNode',
      explanation: {
        english: `Step 4: top = newNode. The TOP pointer now points directly to node ${newAddr}. Dynamic LIFO Push complete in O(1) time!`,
        hinglish: `Step 4: top = newNode. TOP pointer ab naye node ${newAddr} ko point karta hai. O(1) time mein push poora hua!`,
      },
      cCodeLine: 4,
      cCodeSnippet: { title: 'Linked List Stack Push(val) [O(1)]', lines: codeLines },
      llState: {
        nodes: updatedNodes,
        topAddress: newAddr,
        floatingNewNode: null,
      },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const generateLlPopSteps = () => {
    setErrorNotice(null);
    setIsPlaying(false);

    const codeLines = [
      'if (top == NULL) {',
      '    printf("Stack Underflow!\\n"); return -1;',
      '}',
      'struct Node* temp = top;  /* Hold node to free */',
      'int val = top->data;      /* Capture popped data */',
      'top = top->next;          /* Advance top down */',
      'free(temp);               /* Reclaim heap memory */',
      'return val;',
    ];

    const stepList: StackStep[] = [];
    const isUnderflow = llStack.length === 0;

    stepList.push({
      stepIndex: 1,
      totalSteps: isUnderflow ? 2 : 4,
      title: 'Check Underflow: if (top == NULL)',
      explanation: {
        english: `Step 1: Check if top == NULL. ${
          isUnderflow ? 'TRUE! Stack is empty.' : 'FALSE. Top points to valid node.'
        }`,
        hinglish: `Step 1: Check kiya kya top == NULL hai? ${
          isUnderflow ? 'HAAN! Stack khali hai.' : 'NAHI. Stack mein node maujood hai.'
        }`,
      },
      cCodeLine: 1,
      cCodeSnippet: { title: 'Linked List Stack Pop() [O(1)]', lines: codeLines },
      llState: {
        nodes: [...llStack],
        topAddress: llStack.length > 0 ? llStack[0].simAddress : null,
      },
      isError: isUnderflow,
    });

    if (isUnderflow) {
      stepList.push({
        stepIndex: 2,
        totalSteps: 2,
        title: 'STACK UNDERFLOW! Empty Linked List',
        explanation: {
          english: 'STACK UNDERFLOW! Cannot pop from empty linked list stack (top == NULL).',
          hinglish: 'STACK UNDERFLOW! Khali linked list stack mein se kuch pop nahi ho sakta.',
        },
        cCodeLine: 2,
        cCodeSnippet: { title: 'Linked List Stack Pop() [O(1)]', lines: codeLines },
        llState: { nodes: [], topAddress: null },
        isError: true,
      });
      setSteps(stepList);
      setCurrentStepIdx(0);
      setIsPlaying(true);
      return;
    }

    const poppedNode = llStack[0];
    const newTopAddr = llStack.length > 1 ? llStack[1].simAddress : null;

    // Step 2: temp = top; val = top->data
    stepList.push({
      stepIndex: 2,
      totalSteps: 4,
      title: `Capture Data & Pointer: temp = top (${poppedNode.simAddress})`,
      explanation: {
        english: `Step 2: struct Node* temp = top; int val = top->data (${poppedNode.data}). Holding reference in temp so we can free it later.`,
        hinglish: `Step 2: temp mein top node ka address pakad liya taaki memory leak na ho. Data value = ${poppedNode.data}.`,
      },
      cCodeLine: 4,
      cCodeSnippet: { title: 'Linked List Stack Pop() [O(1)]', lines: codeLines },
      llState: {
        nodes: [...llStack],
        topAddress: poppedNode.simAddress,
      },
    });

    // Step 3: top = top->next
    const remaining = llStack.slice(1);
    stepList.push({
      stepIndex: 3,
      totalSteps: 4,
      title: 'Advance Top: top = top->next',
      explanation: {
        english: `Step 3: top = top->next. TOP pointer advances downward to the next node (${newTopAddr || 'NULL'}).`,
        hinglish: `Step 3: top = top->next. TOP pointer niche agle node par shift ho jata hai.`,
      },
      cCodeLine: 6,
      cCodeSnippet: { title: 'Linked List Stack Pop() [O(1)]', lines: codeLines },
      llState: {
        nodes: remaining,
        topAddress: newTopAddr,
      },
    });

    // Step 4: free(temp)
    stepList.push({
      stepIndex: 4,
      totalSteps: 4,
      title: 'Release Memory: free(temp)',
      explanation: {
        english: `Step 4: free(temp). Reclaimed heap memory for node ${poppedNode.data} at address ${poppedNode.simAddress}. Popped in O(1) time!`,
        hinglish: `Step 4: free(temp). Deleted node ki memory OS ko wapas kar di gayi. O(1) time mein pop complete!`,
      },
      cCodeLine: 7,
      cCodeSnippet: { title: 'Linked List Stack Pop() [O(1)]', lines: codeLines },
      llState: {
        nodes: remaining,
        topAddress: newTopAddr,
      },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const generateLlPeekSteps = () => {
    setErrorNotice(null);
    setIsPlaying(false);

    const codeLines = [
      'if (top == NULL) {',
      '    printf("Stack is Empty!\\n"); return -1;',
      '}',
      'return top->data; /* Return top node data */',
    ];

    const stepList: StackStep[] = [];
    if (llStack.length === 0) {
      stepList.push({
        stepIndex: 1,
        totalSteps: 1,
        title: 'Stack Underflow on Peek',
        explanation: {
          english: 'Cannot peek empty linked list stack (top == NULL).',
          hinglish: 'Khali linked list stack par peek karne se kuch nahi milta.',
        },
        cCodeLine: 2,
        cCodeSnippet: { title: 'Linked List Stack Peek() [O(1)]', lines: codeLines },
        llState: { nodes: [], topAddress: null },
        isError: true,
      });
    } else {
      const topNode = llStack[0];
      stepList.push({
        stepIndex: 1,
        totalSteps: 1,
        title: `Peek: Top Node Data = ${topNode.data}`,
        explanation: {
          english: `Peek(): Inspecting top->data = ${topNode.data} at address ${topNode.simAddress}. The top pointer remains unchanged at ${topNode.simAddress}.`,
          hinglish: `Peek(): Top node ka data ${topNode.data} dekha. Top pointer mein koi badlaav nahi hota.`,
        },
        cCodeLine: 4,
        cCodeSnippet: { title: 'Linked List Stack Peek() [O(1)]', lines: codeLines },
        llState: { nodes: [...llStack], topAddress: topNode.simAddress },
      });
    }

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleResetStack = () => {
    setIsPlaying(false);
    setArrayStack([10, 20, 30]);
    setArrayTop(2);
    setLlStack([
      { id: 'll-3', data: 30, simAddress: '0x30C0', nextAddress: '0x2080' },
      { id: 'll-2', data: 20, simAddress: '0x2080', nextAddress: '0x1040' },
      { id: 'll-1', data: 10, simAddress: '0x1040', nextAddress: null },
    ]);
    setSteps([]);
    setCurrentStepIdx(0);
    setErrorNotice(null);
  };

  const handleClearStack = () => {
    setIsPlaying(false);
    setArrayStack([]);
    setArrayTop(-1);
    setLlStack([]);
    setSteps([]);
    setCurrentStepIdx(0);
    setErrorNotice(null);
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Implementation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🥞 Stack ADT Interactive Engine (LIFO)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between Fixed-Array Stack vs Dynamic Linked-List Stack. Observe Top pointer movements, overflow &amp; underflow.
          </p>
        </div>

        {/* Implementation pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setImplementation('array');
              handleResetStack();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              implementation === 'array'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Array Stack (Fixed MAX = {MAX_CAPACITY})</span>
          </button>
          <button
            onClick={() => {
              setImplementation('linked-list');
              handleResetStack();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              implementation === 'linked-list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Linked List Stack (Dynamic Heap)</span>
          </button>
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Value:
          </label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-24 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 40"
          />
        </div>

        <button
          onClick={
            implementation === 'array' ? generateArrayPushSteps : generateLlPushSteps
          }
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" /> Push(val) [O(1)]
        </button>

        <button
          onClick={
            implementation === 'array' ? generateArrayPopSteps : generateLlPopSteps
          }
          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <ArrowUp className="w-3.5 h-3.5" /> Pop() [O(1)]
        </button>

        <button
          onClick={
            implementation === 'array' ? generateArrayPeekSteps : generateLlPeekSteps
          }
          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> Peek() [O(1)]
        </button>

        <button
          onClick={handleResetStack}
          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset (3 items)
        </button>

        <button
          onClick={handleClearStack}
          className="px-2.5 py-1.5 bg-slate-100 dark:bg-navy-950 text-slate-500 hover:text-rose-500 rounded-lg text-xs"
        >
          Clear (Empty)
        </button>
      </div>

      {/* Error / Warning Alert Banner */}
      {errorNotice && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Step Controller Bar */}
      {steps.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                if (currentStepIdx > 0) setCurrentStepIdx((prev) => prev - 1);
              }}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:border-indigo-500"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play All'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                if (currentStepIdx < steps.length - 1) setCurrentStepIdx((prev) => prev + 1);
              }}
              disabled={currentStepIdx === steps.length - 1}
              className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:border-indigo-500"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
              Step {currentStepIdx + 1} of {steps.length}:{' '}
              <span className={steps[currentStepIdx].isError ? 'text-rose-500' : 'text-indigo-500'}>
                {steps[currentStepIdx].title}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>Speed:</span>
              <input
                type="range"
                min={400}
                max={2500}
                step={100}
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-20 accent-indigo-600 cursor-pointer"
              />
              <span>{(speedMs / 1000).toFixed(1)}s</span>
            </div>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(0);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-200"
              title="Rewind to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step Explanation Banner */}
      {currentStep && (
        <div
          className={`p-4 rounded-xl border space-y-1 ${
            currentStep.isError
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              : 'bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>State Transition Breakdown:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {hinglish ? currentStep.explanation.hinglish : currentStep.explanation.english}
          </p>
        </div>
      )}

      {/* Visual Canvas: Array Stack Bucket vs Linked List Stack */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Data Structure Visual representation */}
        <div className="md:col-span-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-end min-h-[320px]">
          {implementation === 'array' ? (
            /* ================= ARRAY STACK BUCKET ================= */
            <div className="w-full flex flex-col items-center">
              <div className="text-xs font-bold font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between w-48">
                <span>MAX Limit</span>
                <span className="text-rose-400">idx: {MAX_CAPACITY - 1}</span>
              </div>

              {/* Bucket Container */}
              <div className="w-52 border-x-4 border-b-4 border-slate-400 dark:border-slate-600 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 bg-slate-100/50 dark:bg-navy-900/40 min-h-[220px] justify-start relative shadow-inner">
                <div className="text-[10px] text-center text-slate-400 italic mb-0.5">
                  ── Bottom of Stack (idx: 0) ──
                </div>

                {displayArrayItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic py-10">
                    <span>Stack Underflow</span>
                    <span className="text-[10px] font-mono mt-1">top == -1 (Empty)</span>
                  </div>
                ) : (
                  displayArrayItems.map((item, idx) => {
                    const isTop = idx === displayArrayTop;
                    const isHighlighted = currentStep?.highlightIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-mono font-bold shadow-md transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 animate-pulse'
                            : isTop
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{item}</span>
                        <span className="text-[10px] font-sans font-normal opacity-80">
                          idx: {idx} {isTop && '← TOP'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Top pointer status */}
              <div className="mt-4 flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">top index:</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 font-bold rounded">
                  {displayArrayTop}
                </span>
                <span className="text-slate-400 text-[11px]">
                  ({displayArrayItems.length === 0 ? 'EMPTY' : displayArrayItems.length >= MAX_CAPACITY ? 'FULL' : 'OK'})
                </span>
              </div>
            </div>
          ) : (
            /* ================= LINKED LIST STACK ================= */
            <div className="w-full flex flex-col items-center">
              {/* TOP Pointer Badge */}
              <div className="flex flex-col items-center mb-3">
                <div className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow">
                  TOP
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">points to:</div>
                <div className="font-mono text-xs text-amber-500 font-bold">
                  {displayLlTop || 'NULL'}
                </div>
                <div className="w-0.5 h-4 bg-amber-500 my-1"></div>
                <div className="text-amber-500 text-xs">▼</div>
              </div>

              {/* Floating Node while being pushed */}
              {displayLlFloatingNode && (
                <div className="mb-3 border-2 border-dashed border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 p-2.5 rounded-xl shadow-lg flex flex-col items-center animate-bounce">
                  <span className="text-[9px] text-cyan-400 font-bold mb-1">
                    newNode in Heap ({displayLlFloatingNode.simAddress})
                  </span>
                  <div className="flex border-2 border-cyan-500 rounded-lg bg-white dark:bg-navy-900 overflow-hidden text-xs font-mono">
                    <div className="px-3 py-1.5 font-bold text-cyan-400 border-r border-cyan-500">
                      {displayLlFloatingNode.data}
                    </div>
                    <div className="px-2 py-1.5 text-[10px] text-slate-400 bg-slate-100 dark:bg-navy-800">
                      next: {displayLlFloatingNode.nextAddress || 'NULL'}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty linked list stack state */}
              {displayLlNodes.length === 0 && !displayLlFloatingNode && (
                <div className="p-8 text-center text-slate-400 text-xs italic font-mono">
                  Stack Underflow: top == NULL (Empty Stack).
                </div>
              )}

              {/* Stack Nodes Chain (Vertical from Top down to NULL) */}
              <div className="space-y-2 w-full max-w-xs">
                {displayLlNodes.map((node, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div key={node.id} className="flex flex-col items-center">
                      <div className="w-full flex items-center justify-between p-2.5 bg-white dark:bg-navy-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-sm font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Loc: {node.simAddress}</span>
                          <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                            {node.data}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-100 dark:bg-navy-800 px-2 py-1 rounded">
                          next: <span className="text-cyan-400">{node.nextAddress || 'NULL'}</span>
                        </div>
                      </div>
                      <div className="text-slate-400 text-xs font-bold py-0.5">▼</div>
                    </div>
                  );
                })}

                {displayLlNodes.length > 0 && (
                  <div className="text-center font-mono text-xs text-slate-400 bg-slate-200 dark:bg-navy-800 py-1 rounded-lg">
                    NULL (Bottom of Stack)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Synchronized C Implementation with Line-by-Line Highlight */}
        <div className="md:col-span-6 bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans pb-2 mb-3 border-b border-slate-800">
              <span className="font-bold text-white">
                {currentStep?.cCodeSnippet.title ||
                  (implementation === 'array'
                    ? 'Array Stack Implementation in C'
                    : 'Linked List Stack Implementation in C')}
              </span>
              <span className="text-indigo-400 text-[11px]">Synchronized with State</span>
            </div>

            <div className="space-y-1.5">
              {(
                currentStep?.cCodeSnippet.lines ||
                (implementation === 'array'
                  ? [
                      'if (top == MAX - 1) { printf("Overflow\\n"); return; }',
                      'top = top + 1;',
                      'stack[top] = val;',
                    ]
                  : [
                      'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
                      'newNode->data = val;',
                      'newNode->next = top;',
                      'top = newNode;',
                    ])
              ).map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrentLine = currentStep ? currentStep.cCodeLine === lineNum : false;

                return (
                  <div
                    key={idx}
                    className={`flex items-center px-2 py-1 rounded transition-colors ${
                      isCurrentLine
                        ? 'bg-indigo-950/80 text-cyan-300 border-l-4 border-cyan-400 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-6 text-slate-600 mr-2 select-none text-[11px]">
                      {lineNum}:
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Takeaway Box */}
          <div className="p-3 bg-slate-900 rounded-xl text-[11px] text-slate-300 border border-slate-800 mt-4 space-y-1">
            <div className="text-indigo-400 font-bold font-sans">
              {implementation === 'array' ? 'Array Stack Takeaway:' : 'Linked List Stack Takeaway:'}
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              {implementation === 'array'
                ? 'Array stack uses fixed contiguous RAM. Push and Pop are strictly O(1) time and require checking top == MAX - 1 for overflow and top == -1 for underflow.'
                : 'Linked list stack never has a fixed MAX capacity limit. All pushes and pops occur at the HEAD node in O(1) time without shifting. Each node consumes pointer storage overhead.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
