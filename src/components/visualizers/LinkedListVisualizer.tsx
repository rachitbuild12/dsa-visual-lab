import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Sliders,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';

export interface LLNode {
  id: string;
  data: number;
  simAddress: string;
  nextAddress: string | null;
  prevAddress?: string | null;
}

export interface ActivePointer {
  name: 'HEAD' | 'temp' | 'newNode' | 'prev' | 'toDelete';
  targetAddress: string | null;
  color: string;
}

export interface LLStep {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: {
    english: string;
    hinglish: string;
  };
  cCodeLine: number;
  nodes: LLNode[];
  newNode?: LLNode | null;
  headAddress: string | null;
  activePointers: ActivePointer[];
  highlightedNodeId?: string | null;
  cCodeSnippet: {
    title: string;
    lines: string[];
  };
}

export const LinkedListVisualizer: React.FC = () => {
  const { hinglish } = useProgress();
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly');

  // Base list state
  const [nodes, setNodes] = useState<LLNode[]>([
    { id: 'node-1', data: 10, simAddress: '0x1040', nextAddress: '0x1080', prevAddress: null },
    { id: 'node-2', data: 20, simAddress: '0x1080', nextAddress: '0x10C0', prevAddress: '0x1040' },
    { id: 'node-3', data: 30, simAddress: '0x10C0', nextAddress: null, prevAddress: '0x1080' },
  ]);

  // Operation inputs
  const [inputVal, setInputVal] = useState<string>('25');
  const [positionInput, setPositionInput] = useState<string>('1');

  // Stepper state
  const [steps, setSteps] = useState<LLStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1200);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync circular links when listType changes
  useEffect(() => {
    setNodes((prev) => {
      if (prev.length === 0) return prev;
      const headAddr = prev[0].simAddress;
      return prev.map((n, idx) => {
        if (idx === prev.length - 1) {
          return { ...n, nextAddress: listType === 'circular' ? headAddr : null };
        }
        return n;
      });
    });
    setSteps([]);
    setCurrentStepIdx(0);
  }, [listType]);

  const generateAddress = () => {
    const hex = Math.floor(0x1000 + Math.random() * 0x8000).toString(16).toUpperCase();
    return `0x${hex}`;
  };

  // Helper to get active step or fallback to current state
  const currentStep: LLStep | null = steps.length > 0 ? steps[currentStepIdx] : null;
  const displayNodes = currentStep ? currentStep.nodes : nodes;
  const displayHeadAddress = currentStep
    ? currentStep.headAddress
    : nodes.length > 0
    ? nodes[0].simAddress
    : null;
  const displayNewNode = currentStep?.newNode;
  const displayPointers = currentStep
    ? currentStep.activePointers
    : [
        {
          name: 'HEAD' as const,
          targetAddress: displayHeadAddress,
          color: 'bg-amber-500 text-slate-950',
        },
      ];

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speedMs);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIdx, steps.length, speedMs]);

  // Commit operation results to nodes when reaching last step
  useEffect(() => {
    if (steps.length > 0 && currentStepIdx === steps.length - 1) {
      setNodes(steps[steps.length - 1].nodes);
    }
  }, [currentStepIdx, steps]);

  // ==========================================
  // OPERATION GENERATORS (Discrete Steps)
  // ==========================================

  // 1. Insert at Beginning
  const generateInsertBeginningSteps = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorMessage('Please enter a valid integer data value.');
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    const newAddr = generateAddress();
    const newId = `node-${Date.now()}`;
    const initialHead = nodes.length > 0 ? nodes[0].simAddress : null;

    const codeLines = [
      'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
      'newNode->data = value;',
      'newNode->next = head; /* Link new node to current head */',
      'head = newNode;       /* Move head to point to new node */',
    ];

    const stepList: LLStep[] = [];

    // Step 1: Allocate in heap
    const freshNode: LLNode = {
      id: newId,
      data: val,
      simAddress: newAddr,
      nextAddress: null,
      prevAddress: null,
    };
    stepList.push({
      stepIndex: 1,
      totalSteps: 4,
      title: 'Allocate Memory in Heap',
      explanation: {
        english: `Step 1: malloc(sizeof(struct Node)) requests bytes from OS heap memory. A new node is created at address ${newAddr} with uninitialized next pointer.`,
        hinglish: `Step 1: malloc() heap memory se ek naya node banata hai address ${newAddr} par. Iska next pointer abhi NULL hai.`,
      },
      cCodeLine: 1,
      nodes: [...nodes],
      newNode: freshNode,
      headAddress: initialHead,
      activePointers: [
        { name: 'HEAD', targetAddress: initialHead, color: 'bg-amber-500 text-slate-950' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: 'Insert at Beginning: O(1)', lines: codeLines },
    });

    // Step 2: Assign data
    stepList.push({
      stepIndex: 2,
      totalSteps: 4,
      title: 'Assign Data Value',
      explanation: {
        english: `Step 2: newNode->data = ${val}. The integer value ${val} is written into the data compartment of node ${newAddr}.`,
        hinglish: `Step 2: newNode->data = ${val} likhne se naye node ke andar ${val} value store ho jaati hai.`,
      },
      cCodeLine: 2,
      nodes: [...nodes],
      newNode: { ...freshNode },
      headAddress: initialHead,
      activePointers: [
        { name: 'HEAD', targetAddress: initialHead, color: 'bg-amber-500 text-slate-950' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: 'Insert at Beginning: O(1)', lines: codeLines },
    });

    // Step 3: Link newNode->next = head (CRITICAL POINTER ORDER)
    const linkedFreshNode: LLNode = {
      ...freshNode,
      nextAddress: initialHead || (listType === 'circular' ? newAddr : null),
    };
    stepList.push({
      stepIndex: 3,
      totalSteps: 4,
      title: 'Link newNode->next = head (CRITICAL ORDER)',
      explanation: {
        english: `Step 3: newNode->next = head. The new node now safely points to ${initialHead || 'NULL'}. CRITICAL RULE: You MUST link new node first before updating head! If head was updated first, the address of the rest of the list would be overwritten and permanently lost (Memory Leak)!`,
        hinglish: `Step 3: newNode->next = head. Naya node pehle se maujood list ko point karne lagta hai. DHYAN DEIN: Agar hum pehle head ko badal dete, toh purani poori list RAM mein kho jaati (Memory Leak)!`,
      },
      cCodeLine: 3,
      nodes: [...nodes],
      newNode: linkedFreshNode,
      headAddress: initialHead,
      activePointers: [
        { name: 'HEAD', targetAddress: initialHead, color: 'bg-amber-500 text-slate-950' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: 'Insert at Beginning: O(1)', lines: codeLines },
    });

    // Step 4: head = newNode
    let finalNodes: LLNode[] = [];
    if (nodes.length === 0) {
      finalNodes = [
        {
          ...linkedFreshNode,
          nextAddress: listType === 'circular' ? newAddr : null,
        },
      ];
    } else {
      finalNodes = [
        linkedFreshNode,
        ...nodes.map((n, idx) => {
          if (idx === 0 && listType === 'doubly') {
            return { ...n, prevAddress: newAddr };
          }
          if (idx === nodes.length - 1 && listType === 'circular') {
            return { ...n, nextAddress: newAddr };
          }
          return n;
        }),
      ];
    }

    stepList.push({
      stepIndex: 4,
      totalSteps: 4,
      title: 'Update HEAD Pointer',
      explanation: {
        english: `Step 4: head = newNode. The HEAD pointer now points directly to node ${newAddr}. The insertion is complete in O(1) constant time without shifting any elements!`,
        hinglish: `Step 4: head = newNode. HEAD ab naye node ${newAddr} ko point karta hai. Yeh insertion O(1) constant time mein bina kisi element ko shift kiye poora ho gaya!`,
      },
      cCodeLine: 4,
      nodes: finalNodes,
      newNode: null,
      headAddress: newAddr,
      activePointers: [
        { name: 'HEAD', targetAddress: newAddr, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: 'Insert at Beginning: O(1)', lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // 2. Insert at End
  const generateInsertEndSteps = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) {
      setErrorMessage('Please enter a valid integer data value.');
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    if (nodes.length === 0) {
      generateInsertBeginningSteps();
      return;
    }

    const newAddr = generateAddress();
    const newId = `node-${Date.now()}`;
    const codeLines = [
      'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
      'newNode->data = value; newNode->next = NULL;',
      'struct Node* temp = head;',
      'while (temp->next != NULL) temp = temp->next;',
      'temp->next = newNode; /* Link last node to new node */',
    ];

    const stepList: LLStep[] = [];
    const freshNode: LLNode = {
      id: newId,
      data: val,
      simAddress: newAddr,
      nextAddress: listType === 'circular' ? nodes[0].simAddress : null,
      prevAddress: listType === 'doubly' ? nodes[nodes.length - 1].simAddress : null,
    };

    // Step 1: Allocate
    stepList.push({
      stepIndex: 1,
      totalSteps: 3 + nodes.length,
      title: 'Allocate New Node in Heap',
      explanation: {
        english: `Step 1: Allocated new node at heap address ${newAddr} with data ${val} and next = NULL.`,
        hinglish: `Step 1: Address ${newAddr} par naya node allocate kiya data = ${val} ke saath.`,
      },
      cCodeLine: 1,
      nodes: [...nodes],
      newNode: freshNode,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: 'Insert at End: O(n)', lines: codeLines },
    });

    // Step 2: Traverse with temp
    let currentStepNum = 2;
    for (let i = 0; i < nodes.length; i++) {
      const isLast = i === nodes.length - 1;
      stepList.push({
        stepIndex: currentStepNum++,
        totalSteps: 3 + nodes.length,
        title: `Traverse: temp = ${isLast ? 'Last Node' : 'Node #' + i}`,
        explanation: {
          english: isLast
            ? `Found the last node at address ${nodes[i].simAddress} where next == ${listType === 'circular' ? 'head' : 'NULL'}! Traversal stops here.`
            : `temp = temp->next. Currently visiting node with data ${nodes[i].data} at address ${nodes[i].simAddress}. Moving forward...`,
          hinglish: isLast
            ? `Aakhri node mil gaya address ${nodes[i].simAddress} par! Yahan next == ${listType === 'circular' ? 'head' : 'NULL'} hai.`
            : `temp aage badh raha hai: node ${nodes[i].data} par visit kiya.`,
        },
        cCodeLine: 4,
        nodes: [...nodes],
        newNode: freshNode,
        headAddress: nodes[0].simAddress,
        activePointers: [
          { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
          { name: 'temp', targetAddress: nodes[i].simAddress, color: 'bg-purple-500 text-white' },
          { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
        ],
        highlightedNodeId: nodes[i].id,
        cCodeSnippet: { title: 'Insert at End: O(n)', lines: codeLines },
      });
    }

    // Step 3: Link lastNode->next = newNode
    const updated = nodes.map((n, idx) => {
      if (idx === nodes.length - 1) {
        return { ...n, nextAddress: newAddr };
      }
      return n;
    });
    updated.push(freshNode);

    stepList.push({
      stepIndex: currentStepNum,
      totalSteps: 3 + nodes.length,
      title: 'Link temp->next = newNode',
      explanation: {
        english: `Final Step: temp->next = newNode. The previous last node now points to ${newAddr}. newNode is successfully attached to the end in O(n) traversal time!`,
        hinglish: `Aakhri Step: temp->next = newNode. Purana aakhri node ab naye node ${newAddr} ko point karta hai. O(n) traversal time mein insert ho gaya!`,
      },
      cCodeLine: 5,
      nodes: updated,
      newNode: null,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: 'Insert at End: O(n)', lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // 3. Insert at Selected Position (0-indexed or 1-based)
  const generateInsertAtPositionSteps = () => {
    const val = parseInt(inputVal);
    const pos = parseInt(positionInput);

    if (isNaN(val) || isNaN(pos)) {
      setErrorMessage('Please enter valid numeric values for data and position.');
      return;
    }

    if (pos < 0 || pos > nodes.length) {
      setErrorMessage(`Invalid Position! Must be between 0 and ${nodes.length} (current list size).`);
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    if (pos === 0) {
      generateInsertBeginningSteps();
      return;
    }
    if (pos === nodes.length) {
      generateInsertEndSteps();
      return;
    }

    const newAddr = generateAddress();
    const newId = `node-${Date.now()}`;
    const codeLines = [
      'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
      'newNode->data = val;',
      'struct Node* temp = head;',
      'for (int i = 0; i < pos - 1; i++) temp = temp->next;',
      'newNode->next = temp->next; /* Link newNode to successor first! */',
      'temp->next = newNode;       /* Link predecessor to newNode */',
    ];

    const stepList: LLStep[] = [];
    const freshNode: LLNode = {
      id: newId,
      data: val,
      simAddress: newAddr,
      nextAddress: null,
      prevAddress: listType === 'doubly' ? nodes[pos - 1].simAddress : null,
    };

    // Step 1: Allocate newNode
    stepList.push({
      stepIndex: 1,
      totalSteps: 4 + pos,
      title: 'Allocate New Node in Heap',
      explanation: {
        english: `Step 1: Allocated new node at heap address ${newAddr} for data ${val}.`,
        hinglish: `Step 1: Naya node allocate kiya address ${newAddr} par data = ${val} ke liye.`,
      },
      cCodeLine: 1,
      nodes: [...nodes],
      newNode: freshNode,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: `Insert at Position ${pos}: O(n)`, lines: codeLines },
    });

    // Step 2: Traverse temp to index pos - 1
    let stepCount = 2;
    for (let i = 0; i < pos; i++) {
      const isTargetPredecessor = i === pos - 1;
      stepList.push({
        stepIndex: stepCount++,
        totalSteps: 4 + pos,
        title: isTargetPredecessor ? `Found Predecessor Node (Index ${i})` : `Traverse to Predecessor (Index ${i})`,
        explanation: {
          english: isTargetPredecessor
            ? `temp reached index ${i} (predecessor). Its next pointer points to index ${pos} (${nodes[i].nextAddress}). We will insert newNode between index ${i} and index ${pos}.`
            : `temp = temp->next. Currently at index ${i} (data: ${nodes[i].data}). Moving toward index ${pos - 1}...`,
          hinglish: isTargetPredecessor
            ? `temp index ${i} par pahunch gaya. Ab naya node index ${i} aur ${pos} ke beech mein insert hoga.`
            : `temp aage badh raha hai: index ${i} par pahuncha.`,
        },
        cCodeLine: 4,
        nodes: [...nodes],
        newNode: freshNode,
        headAddress: nodes[0].simAddress,
        activePointers: [
          { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
          { name: 'temp', targetAddress: nodes[i].simAddress, color: 'bg-purple-500 text-white' },
          { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
        ],
        highlightedNodeId: nodes[i].id,
        cCodeSnippet: { title: `Insert at Position ${pos}: O(n)`, lines: codeLines },
      });
    }

    // Step 3: Link newNode->next = temp->next
    const successorAddr = nodes[pos].simAddress;
    const linkedNode: LLNode = {
      ...freshNode,
      nextAddress: successorAddr,
    };

    stepList.push({
      stepIndex: stepCount++,
      totalSteps: 4 + pos,
      title: 'CRITICAL ORDER: newNode->next = temp->next',
      explanation: {
        english: `Step: newNode->next = temp->next. New node now points to successor node at ${successorAddr}. WARNING: If temp->next was updated first, the link to the entire second half of the list would be permanently broken!`,
        hinglish: `Step: newNode->next = temp->next. Naya node pehle agle node (${successorAddr}) se judta hai. DHYAN DEIN: Agar temp->next pehle badal dete toh baaki ki poori list disconnect ho jaati!`,
      },
      cCodeLine: 5,
      nodes: [...nodes],
      newNode: linkedNode,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'temp', targetAddress: nodes[pos - 1].simAddress, color: 'bg-purple-500 text-white' },
        { name: 'newNode', targetAddress: newAddr, color: 'bg-cyan-500 text-white' },
      ],
      cCodeSnippet: { title: `Insert at Position ${pos}: O(n)`, lines: codeLines },
    });

    // Step 4: temp->next = newNode
    const resultNodes = [...nodes];
    resultNodes[pos - 1] = {
      ...resultNodes[pos - 1],
      nextAddress: newAddr,
    };
    resultNodes.splice(pos, 0, linkedNode);

    stepList.push({
      stepIndex: stepCount,
      totalSteps: 4 + pos,
      title: 'Update temp->next = newNode',
      explanation: {
        english: `Final Step: temp->next = newNode. Predecessor node now points to newNode (${newAddr}). Insertion at position ${pos} complete!`,
        hinglish: `Aakhri Step: temp->next = newNode. Predecessor node ab naye node ko point karne laga. Insertion position ${pos} par poora hua!`,
      },
      cCodeLine: 6,
      nodes: resultNodes,
      newNode: null,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: `Insert at Position ${pos}: O(n)`, lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // 4. Delete at Beginning
  const generateDeleteBeginningSteps = () => {
    if (nodes.length === 0) {
      setErrorMessage('LIST UNDERFLOW! Cannot delete from an empty linked list (head == NULL).');
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    const targetNode = nodes[0];
    const newHeadAddr = nodes.length > 1 ? nodes[1].simAddress : null;

    const codeLines = [
      'if (head == NULL) return NULL; /* Underflow check */',
      'struct Node* temp = head;     /* Store node to free */',
      'head = head->next;            /* Advance head pointer */',
      'free(temp);                   /* Release heap memory */',
    ];

    const stepList: LLStep[] = [];

    // Step 1: Assign temp = head
    stepList.push({
      stepIndex: 1,
      totalSteps: 3,
      title: 'Hold Reference: temp = head',
      explanation: {
        english: `Step 1: struct Node* temp = head. Storing the address of the first node (${targetNode.simAddress}) in temp so we can safely free() its memory after unlinking.`,
        hinglish: `Step 1: temp = head. Pehle node ka address temp mein save kar liya taaki use unlinking ke baad free() kiya ja sake.`,
      },
      cCodeLine: 2,
      nodes: [...nodes],
      headAddress: targetNode.simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: targetNode.simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'temp', targetAddress: targetNode.simAddress, color: 'bg-rose-500 text-white' },
      ],
      highlightedNodeId: targetNode.id,
      cCodeSnippet: { title: 'Delete at Beginning: O(1)', lines: codeLines },
    });

    // Step 2: head = head->next
    const remainingAfterUnlink = nodes.slice(1);
    stepList.push({
      stepIndex: 2,
      totalSteps: 3,
      title: 'Advance HEAD: head = head->next',
      explanation: {
        english: `Step 2: head = head->next. HEAD moves to the second node (${newHeadAddr || 'NULL'}). The first node is now detached from the main chain.`,
        hinglish: `Step 2: head = head->next. HEAD pointer agle node (${newHeadAddr || 'NULL'}) par shift ho gaya.`,
      },
      cCodeLine: 3,
      nodes: remainingAfterUnlink,
      headAddress: newHeadAddr,
      activePointers: [
        { name: 'HEAD', targetAddress: newHeadAddr, color: 'bg-amber-500 text-slate-950' },
        { name: 'toDelete', targetAddress: targetNode.simAddress, color: 'bg-rose-500 text-white' },
      ],
      cCodeSnippet: { title: 'Delete at Beginning: O(1)', lines: codeLines },
    });

    // Step 3: free(temp)
    let finalRemaining = [...remainingAfterUnlink];
    if (listType === 'circular' && finalRemaining.length > 0) {
      finalRemaining[finalRemaining.length - 1].nextAddress = finalRemaining[0].simAddress;
    }
    if (listType === 'doubly' && finalRemaining.length > 0) {
      finalRemaining[0].prevAddress = null;
    }

    stepList.push({
      stepIndex: 3,
      totalSteps: 3,
      title: 'Release Memory: free(temp)',
      explanation: {
        english: `Step 3: free(temp). The memory block at address ${targetNode.simAddress} holding value ${targetNode.data} is reclaimed by the OS heap. Zero memory leak! Complete in O(1) time.`,
        hinglish: `Step 3: free(temp). Address ${targetNode.simAddress} ki memory OS ko wapas de di gayi taaki memory leak na ho! O(1) time mein complete.`,
      },
      cCodeLine: 4,
      nodes: finalRemaining,
      headAddress: newHeadAddr,
      activePointers: [
        { name: 'HEAD', targetAddress: newHeadAddr, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: 'Delete at Beginning: O(1)', lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // 5. Delete at End
  const generateDeleteEndSteps = () => {
    if (nodes.length === 0) {
      setErrorMessage('LIST UNDERFLOW! Cannot delete from an empty linked list.');
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    if (nodes.length === 1) {
      generateDeleteBeginningSteps();
      return;
    }

    const codeLines = [
      'struct Node* temp = head; struct Node* prev = NULL;',
      'while (temp->next != NULL) { prev = temp; temp = temp->next; }',
      'prev->next = NULL; /* Sever pointer to last node */',
      'free(temp);        /* Release last node from heap */',
    ];

    const stepList: LLStep[] = [];
    const lastNode = nodes[nodes.length - 1];
    const secondLastNode = nodes[nodes.length - 2];

    // Step 1: Traversal
    for (let i = 0; i < nodes.length; i++) {
      const isLast = i === nodes.length - 1;
      stepList.push({
        stepIndex: i + 1,
        totalSteps: nodes.length + 2,
        title: isLast ? 'Found Last Node to Delete' : `Traversing: Visiting Node #${i}`,
        explanation: {
          english: isLast
            ? `temp reached last node (data: ${nodes[i].data}, addr: ${nodes[i].simAddress}). prev holds second-to-last node at ${secondLastNode.simAddress}.`
            : `Traversing: prev = temp (${i > 0 ? nodes[i - 1].simAddress : 'NULL'}); temp = temp->next (${nodes[i].simAddress}).`,
          hinglish: isLast
            ? `temp aakhri node (${nodes[i].data}) par pahunch gaya jise delete karna hai. prev second-last node par hai.`
            : `Traverse ho raha hai: aakhri node tak jaane ke liye.`,
        },
        cCodeLine: 2,
        nodes: [...nodes],
        headAddress: nodes[0].simAddress,
        activePointers: [
          { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
          { name: 'temp', targetAddress: nodes[i].simAddress, color: 'bg-rose-500 text-white' },
          ...(i > 0
            ? [
                {
                  name: 'prev' as const,
                  targetAddress: nodes[i - 1].simAddress,
                  color: 'bg-purple-500 text-white',
                },
              ]
            : []),
        ],
        highlightedNodeId: nodes[i].id,
        cCodeSnippet: { title: 'Delete at End: O(n)', lines: codeLines },
      });
    }

    // Step 2: Sever link prev->next = NULL
    const remaining = nodes.slice(0, -1).map((n, idx) => {
      if (idx === nodes.length - 2) {
        return {
          ...n,
          nextAddress: listType === 'circular' ? nodes[0].simAddress : null,
        };
      }
      return n;
    });

    stepList.push({
      stepIndex: nodes.length + 1,
      totalSteps: nodes.length + 2,
      title: 'Sever Link: prev->next = NULL',
      explanation: {
        english: `prev->next = ${listType === 'circular' ? 'head' : 'NULL'}. The second-to-last node now becomes the new tail. Last node is detached.`,
        hinglish: `prev->next = NULL. Second-last node ab naya tail ban gaya. Aakhri node chain se alag ho gaya.`,
      },
      cCodeLine: 3,
      nodes: remaining,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'prev', targetAddress: secondLastNode.simAddress, color: 'bg-purple-500 text-white' },
        { name: 'toDelete', targetAddress: lastNode.simAddress, color: 'bg-rose-500 text-white' },
      ],
      cCodeSnippet: { title: 'Delete at End: O(n)', lines: codeLines },
    });

    // Step 3: free(temp)
    stepList.push({
      stepIndex: nodes.length + 2,
      totalSteps: nodes.length + 2,
      title: 'Free Last Node Memory',
      explanation: {
        english: `free(temp). Memory for deleted node ${lastNode.data} at address ${lastNode.simAddress} is returned to the OS. O(n) traversal complete.`,
        hinglish: `free(temp). Deleted node ki memory OS ko return kar di gayi. Delete at end complete!`,
      },
      cCodeLine: 4,
      nodes: remaining,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: 'Delete at End: O(n)', lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // 6. Delete at Selected Position
  const generateDeleteAtPositionSteps = () => {
    const pos = parseInt(positionInput);
    if (isNaN(pos)) {
      setErrorMessage('Please enter a valid position index to delete.');
      return;
    }

    if (nodes.length === 0) {
      setErrorMessage('LIST UNDERFLOW! Cannot delete from an empty linked list.');
      return;
    }

    if (pos < 0 || pos >= nodes.length) {
      setErrorMessage(`Invalid Position! Must be between 0 and ${nodes.length - 1}.`);
      return;
    }
    setErrorMessage(null);
    setIsPlaying(false);

    if (pos === 0) {
      generateDeleteBeginningSteps();
      return;
    }
    if (pos === nodes.length - 1) {
      generateDeleteEndSteps();
      return;
    }

    const targetNode = nodes[pos];
    const prevNode = nodes[pos - 1];
    const successorNode = nodes[pos + 1];

    const codeLines = [
      'struct Node* temp = head;',
      'for (int i = 0; i < pos - 1; i++) temp = temp->next;',
      'struct Node* toDelete = temp->next;',
      'temp->next = toDelete->next; /* Bypass target node */',
      'free(toDelete);              /* Release from heap */',
    ];

    const stepList: LLStep[] = [];

    // Step 1: Traverse to pos - 1
    let stepCount = 1;
    for (let i = 0; i < pos; i++) {
      stepList.push({
        stepIndex: stepCount++,
        totalSteps: pos + 3,
        title: i === pos - 1 ? 'Located Predecessor Node' : `Traversing: Index ${i}`,
        explanation: {
          english:
            i === pos - 1
              ? `temp is at predecessor node (index ${i}, addr: ${nodes[i].simAddress}). Its next pointer currently points to node to be deleted (index ${pos}, data: ${targetNode.data}).`
              : `Traversing: temp = temp->next. Currently visiting index ${i}.`,
          hinglish:
            i === pos - 1
              ? `temp predecessor node par aa gaya. Iska next pointer delete hone wale node ko point karta hai.`
              : `temp aage badh raha hai index ${i} par.`,
        },
        cCodeLine: 2,
        nodes: [...nodes],
        headAddress: nodes[0].simAddress,
        activePointers: [
          { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
          { name: 'temp', targetAddress: nodes[i].simAddress, color: 'bg-purple-500 text-white' },
        ],
        highlightedNodeId: nodes[i].id,
        cCodeSnippet: { title: `Delete at Position ${pos}: O(n)`, lines: codeLines },
      });
    }

    // Step 2: Mark toDelete = temp->next
    stepList.push({
      stepIndex: stepCount++,
      totalSteps: pos + 3,
      title: 'Store Target: toDelete = temp->next',
      explanation: {
        english: `toDelete = temp->next. Safely stored address of target node (${targetNode.simAddress}) in toDelete pointer.`,
        hinglish: `toDelete = temp->next. Delete hone wale node ka address toDelete pointer mein save kiya.`,
      },
      cCodeLine: 3,
      nodes: [...nodes],
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'temp', targetAddress: prevNode.simAddress, color: 'bg-purple-500 text-white' },
        { name: 'toDelete', targetAddress: targetNode.simAddress, color: 'bg-rose-500 text-white' },
      ],
      highlightedNodeId: targetNode.id,
      cCodeSnippet: { title: `Delete at Position ${pos}: O(n)`, lines: codeLines },
    });

    // Step 3: Bypass temp->next = toDelete->next
    const bypassedNodes = nodes.filter((_, idx) => idx !== pos).map((n, idx) => {
      if (idx === pos - 1) {
        return { ...n, nextAddress: successorNode.simAddress };
      }
      return n;
    });

    stepList.push({
      stepIndex: stepCount++,
      totalSteps: pos + 3,
      title: 'Bypass Node: temp->next = toDelete->next',
      explanation: {
        english: `temp->next = toDelete->next. Predecessor node now links directly past node ${targetNode.data} to successor node (${successorNode.simAddress}). Target node is detached!`,
        hinglish: `temp->next = toDelete->next. Predecessor node ab target node ko bypass karke agle node se jud gaya!`,
      },
      cCodeLine: 4,
      nodes: bypassedNodes,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
        { name: 'temp', targetAddress: prevNode.simAddress, color: 'bg-purple-500 text-white' },
        { name: 'toDelete', targetAddress: targetNode.simAddress, color: 'bg-rose-500 text-white' },
      ],
      cCodeSnippet: { title: `Delete at Position ${pos}: O(n)`, lines: codeLines },
    });

    // Step 4: free(toDelete)
    stepList.push({
      stepIndex: stepCount,
      totalSteps: pos + 3,
      title: 'Free Target Node: free(toDelete)',
      explanation: {
        english: `free(toDelete). Reclaimed memory at address ${targetNode.simAddress} for node with data ${targetNode.data}. Deletion at position ${pos} complete!`,
        hinglish: `free(toDelete). Target node ki memory heap mein free kar di gayi. Position ${pos} par deletion complete!`,
      },
      cCodeLine: 5,
      nodes: bypassedNodes,
      headAddress: nodes[0].simAddress,
      activePointers: [
        { name: 'HEAD', targetAddress: nodes[0].simAddress, color: 'bg-amber-500 text-slate-950' },
      ],
      cCodeSnippet: { title: `Delete at Position ${pos}: O(n)`, lines: codeLines },
    });

    setSteps(stepList);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleResetToDefault = () => {
    setIsPlaying(false);
    setNodes([
      { id: 'node-1', data: 10, simAddress: '0x1040', nextAddress: '0x1080', prevAddress: null },
      { id: 'node-2', data: 20, simAddress: '0x1080', nextAddress: '0x10C0', prevAddress: '0x1040' },
      { id: 'node-3', data: 30, simAddress: '0x10C0', nextAddress: null, prevAddress: '0x1080' },
    ]);
    setSteps([]);
    setCurrentStepIdx(0);
    setErrorMessage(null);
  };

  const handleClearList = () => {
    setIsPlaying(false);
    setNodes([]);
    setSteps([]);
    setCurrentStepIdx(0);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Header & List Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🔗 Linked List Interactive Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step state engine with bidirectional controls. Observe heap addresses, pointer rewiring, and order safeguards.
          </p>
        </div>

        {/* List type pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {(['singly', 'doubly', 'circular'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setListType(t);
                handleResetToDefault();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                listType === t
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
              }`}
            >
              {t} List
            </button>
          ))}
        </div>
      </div>

      {/* Control Dashboard: Inputs & Operations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Value & Position Inputs */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Data Value:
            </label>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. 25"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Position Index:
            </label>
            <input
              type="number"
              min={0}
              max={nodes.length}
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              placeholder={`0 to ${nodes.length}`}
            />
          </div>
        </div>

        {/* Operation Action Buttons */}
        <div className="md:col-span-8 flex flex-wrap items-end gap-2">
          {/* Insertion Group */}
          <button
            onClick={generateInsertBeginningSteps}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Insert Beginning [O(1)]
          </button>
          <button
            onClick={generateInsertAtPositionSteps}
            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Insert at Pos {positionInput} [O(n)]
          </button>
          <button
            onClick={generateInsertEndSteps}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Insert End [O(n)]
          </button>

          {/* Deletion Group */}
          <button
            onClick={generateDeleteBeginningSteps}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Front [O(1)]
          </button>
          <button
            onClick={generateDeleteAtPositionSteps}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete at Pos {positionInput} [O(n)]
          </button>
          <button
            onClick={generateDeleteEndSteps}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete End [O(n)]
          </button>

          {/* Reset buttons */}
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Default 3 Nodes
          </button>
          <button
            onClick={handleClearList}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-navy-950 text-slate-500 hover:text-rose-500 rounded-lg text-xs"
          >
            Clear (Empty)
          </button>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step Controller Bar: Prev, Next, Play/Pause, Step Scrubber, Speed */}
      {steps.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                if (currentStepIdx > 0) setCurrentStepIdx((prev) => prev - 1);
              }}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:border-cyan-500"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
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
              className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:border-cyan-500"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
              Step {currentStepIdx + 1} of {steps.length}:{' '}
              <span className="text-cyan-500">{steps[currentStepIdx].title}</span>
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
                className="w-20 accent-cyan-500 cursor-pointer"
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
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent border border-cyan-500/30 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>State Transition Explanation:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {hinglish ? currentStep.explanation.hinglish : currentStep.explanation.english}
          </p>
        </div>
      )}

      {/* Visual Canvas Area: Renders Nodes & Floating Pointers */}
      <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-h-[260px] overflow-x-auto flex flex-col justify-center relative">
        <div className="flex items-center gap-4 min-w-max py-6">
          {/* HEAD Pointer */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow">
              HEAD
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">points to:</div>
            <div className="font-mono text-xs text-amber-500 font-bold">
              {displayHeadAddress || 'NULL'}
            </div>
            <div className="w-0.5 h-6 bg-amber-500 my-1"></div>
            <div className="text-amber-500 text-xs">▼</div>
          </div>

          {/* New Node Floating Preview while being linked */}
          {displayNewNode && (
            <div className="border-2 border-dashed border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 p-3 rounded-xl shadow-lg flex flex-col items-center animate-pulse">
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold mb-1">
                newNode in Heap ({displayNewNode.simAddress})
              </span>
              <div className="flex border-2 border-cyan-500 rounded-lg bg-white dark:bg-navy-900 overflow-hidden text-xs shadow-md">
                <div className="px-3 py-2 font-bold text-cyan-600 dark:text-cyan-300 border-r border-cyan-500 font-mono text-sm">
                  {displayNewNode.data}
                </div>
                <div className="px-2.5 py-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-navy-800 flex flex-col justify-center">
                  <span>next:</span>
                  <span className="text-cyan-400 font-bold">
                    {displayNewNode.nextAddress || 'NULL'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty list indicator */}
          {displayNodes.length === 0 && !displayNewNode && (
            <div className="p-8 text-center text-slate-400 text-xs italic font-mono">
              List is currently empty: head == NULL. Use "Insert Beginning" to add your first node!
            </div>
          )}

          {/* Node Chain */}
          {displayNodes.map((node, index) => {
            const isHighlighted = currentStep?.highlightedNodeId === node.id;
            // Check active pointers on this node
            const matchedPointers = displayPointers.filter(
              (p) => p.targetAddress === node.simAddress
            );

            return (
              <React.Fragment key={node.id}>
                <div className="relative flex flex-col items-center transition-all duration-300">
                  {/* Floating Named Pointer Tags on this Node */}
                  <div className="h-6 flex items-center gap-1 mb-1">
                    {matchedPointers.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shadow-sm ${p.color}`}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Simulated Address Tag */}
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1">
                    Loc: {node.simAddress}
                  </span>

                  {/* Node Container Box */}
                  <div
                    className={`flex items-stretch rounded-xl shadow-md border-2 overflow-hidden transition-all duration-200 ${
                      isHighlighted
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 scale-105'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900'
                    }`}
                  >
                    {/* Doubly List Prev Compartment */}
                    {listType === 'doubly' && (
                      <div className="px-2.5 py-3 bg-slate-100 dark:bg-navy-800 border-r border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
                        <div className="text-[9px] text-slate-400 uppercase">prev</div>
                        <div className="text-[10px] font-mono text-indigo-500 font-bold">
                          {node.prevAddress || 'NULL'}
                        </div>
                      </div>
                    )}

                    {/* Data Compartment */}
                    <div className="px-4 py-3 min-w-[58px] flex flex-col items-center justify-center">
                      <div className="text-[9px] text-slate-400 uppercase font-medium">data</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                        {node.data}
                      </div>
                    </div>

                    {/* Next Pointer Compartment */}
                    <div className="px-3 py-3 bg-slate-100 dark:bg-navy-800 border-l border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                      <div className="text-[9px] text-slate-400 uppercase font-medium">next</div>
                      <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {node.nextAddress ? node.nextAddress : 'NULL'}
                      </div>
                    </div>
                  </div>

                  {/* Index marker */}
                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    [Index {index}]
                  </span>
                </div>

                {/* Connecting Arrow */}
                {index < displayNodes.length - 1 && (
                  <div className="flex items-center text-cyan-500 font-bold text-lg px-1">
                    {listType === 'doubly' ? '⇄' : '➔'}
                  </div>
                )}

                {/* Last Node Arrow */}
                {index === displayNodes.length - 1 && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-1">
                    {listType === 'circular' ? (
                      <span className="text-cyan-400 text-xs px-2.5 py-1 bg-cyan-950/80 border border-cyan-800 rounded-lg">
                        ⟲ points back to Head ({displayNodes[0].simAddress})
                      </span>
                    ) : (
                      <>
                        <span className="text-slate-400">➔</span>
                        <span className="px-2 py-1 bg-slate-200 dark:bg-navy-800 rounded text-slate-600 dark:text-slate-400 text-xs">
                          NULL
                        </span>
                      </>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Synchronized C Implementation with Line-by-Line Highlight */}
      <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs border border-slate-800 shadow-md">
        <div className="flex items-center justify-between text-slate-400 text-xs font-sans pb-2 mb-3 border-b border-slate-800">
          <span className="font-bold text-white">
            {currentStep?.cCodeSnippet.title || 'C Implementation: Dynamic Pointer Operations'}
          </span>
          <span className="text-cyan-400 text-[11px]">Active Line Synchronized with Memory</span>
        </div>

        <div className="space-y-1.5">
          {(
            currentStep?.cCodeSnippet.lines || [
              'struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
              'newNode->data = val;',
              'newNode->next = head; /* Link new node to head */',
              'head = newNode;       /* Move head to new node */',
            ]
          ).map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrentLine = currentStep ? currentStep.cCodeLine === lineNum : false;

            return (
              <div
                key={idx}
                className={`flex items-center px-2 py-1 rounded transition-colors ${
                  isCurrentLine
                    ? 'bg-cyan-950/80 text-cyan-300 border-l-4 border-cyan-400 font-bold'
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
    </div>
  );
};
