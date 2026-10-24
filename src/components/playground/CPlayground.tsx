import React, { useState } from 'react';
import { Play, Copy, Check, RotateCcw, HelpCircle, Terminal, FileCode } from 'lucide-react';

interface SimulationStep {
  line: number;
  vars: Record<string, any>;
  stdout: string;
  explanation: string;
}

interface PlaygroundSample {
  id: string;
  title: string;
  description: string;
  unit: string;
  code: string[];
  steps: SimulationStep[];
  predictChallenge?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const PLAYGROUND_SAMPLES: PlaygroundSample[] = [
  {
    id: 'singly-ll-head-insert',
    title: 'Singly Linked List: Safe Pointer Order Insertion',
    description: 'Trace pointers and heap memory to understand why `newNode->next = head` must precede `head = newNode`.',
    unit: 'Unit II',
    code: [
      '#include <stdio.h>',
      '#include <stdlib.h>',
      'struct Node { int data; struct Node* next; };',
      'int main() {',
      '    struct Node* head = NULL;',
      '    // Step 1: Allocate newNode in heap',
      '    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
      '    newNode->data = 10;',
      '    // Step 2: Link newNode to current head',
      '    newNode->next = head;',
      '    // Step 3: Move head pointer to newNode',
      '    head = newNode;',
      '    printf("Head data: %d, Next addr: %p\\n", head->data, (void*)head->next);',
      '    return 0;',
      '}'
    ],
    steps: [
      {
        line: 5,
        vars: { head: 'NULL' },
        stdout: '',
        explanation: 'Head pointer initialized to NULL. List is currently empty.'
      },
      {
        line: 7,
        vars: { head: 'NULL', newNode: '0x10A4', 'newNode->data': 10, 'newNode->next': 'uninitialized' },
        stdout: '',
        explanation: 'malloc() requested memory from heap. A node is created at simulated address 0x10A4.'
      },
      {
        line: 10,
        vars: { head: 'NULL', newNode: '0x10A4', 'newNode->next': 'NULL' },
        stdout: '',
        explanation: 'CRUCIAL STEP: newNode->next is linked to current head (NULL). Existing nodes are preserved!'
      },
      {
        line: 12,
        vars: { head: '0x10A4', 'head->data': 10, 'head->next': 'NULL' },
        stdout: '',
        explanation: 'Head pointer updated to point to newNode (0x10A4). New node is now the official start of the list.'
      },
      {
        line: 13,
        vars: { head: '0x10A4', 'head->data': 10, 'head->next': 'NULL' },
        stdout: 'Head data: 10, Next addr: (nil)\n',
        explanation: 'printf executed. Program output rendered to terminal.'
      }
    ],
    predictChallenge: {
      question: 'What would happen if line 12 (`head = newNode`) was executed BEFORE line 10 (`newNode->next = head`) on a non-empty list?',
      options: [
        'The program would still work identically',
        'All existing list nodes would be permanently lost (Memory Leak / Dangling)',
        'Compile-time syntax error',
        'The node would be appended at the end instead'
      ],
      correctIndex: 1,
      explanation: 'Overwriting `head` first destroys the sole pointer reference to the previous chain of nodes, causing a fatal memory leak.'
    }
  },
  {
    id: 'stack-postfix-sim',
    title: 'Stack ADT: Postfix Expression Evaluation',
    description: 'Simulate evaluating postfix expression "5 3 + 2 *" step by step on the evaluation stack.',
    unit: 'Unit III',
    code: [
      '#include <stdio.h>',
      '// Expression to evaluate: "5 3 + 2 *"',
      'int main() {',
      '    int stack[10]; int top = -1;',
      '    // Token "5": Push operand',
      '    stack[++top] = 5;',
      '    // Token "3": Push operand',
      '    stack[++top] = 3;',
      '    // Operator "+": Pop op2, Pop op1, compute op1 + op2',
      '    int op2 = stack[top--]; int op1 = stack[top--];',
      '    stack[++top] = op1 + op2;',
      '    // Token "2": Push operand',
      '    stack[++top] = 2;',
      '    // Operator "*": Pop op2, Pop op1, compute op1 * op2',
      '    op2 = stack[top--]; op1 = stack[top--];',
      '    stack[++top] = op1 * op2;',
      '    printf("Final Result: %d\\n", stack[top]);',
      '    return 0;',
      '}'
    ],
    steps: [
      {
        line: 4,
        vars: { top: -1, 'stack[]': '[]' },
        stdout: '',
        explanation: 'Stack initialized to empty (top = -1).'
      },
      {
        line: 6,
        vars: { top: 0, 'stack[]': '[5]' },
        stdout: '',
        explanation: 'Token "5" is an operand. Pushed to stack. top is now 0.'
      },
      {
        line: 8,
        vars: { top: 1, 'stack[]': '[5, 3]' },
        stdout: '',
        explanation: 'Token "3" is an operand. Pushed to stack. top is now 1.'
      },
      {
        line: 10,
        vars: { op2: 3, op1: 5, top: -1, 'stack[]': '[]' },
        stdout: '',
        explanation: 'Operator "+": Popped op2=3, popped op1=5. Note: First popped is right operand!'
      },
      {
        line: 11,
        vars: { top: 0, 'stack[]': '[8]' },
        stdout: '',
        explanation: '5 + 3 = 8. Pushed 8 back onto the stack.'
      },
      {
        line: 13,
        vars: { top: 1, 'stack[]': '[8, 2]' },
        stdout: '',
        explanation: 'Token "2" pushed to stack.'
      },
      {
        line: 16,
        vars: { top: 0, 'stack[]': '[16]' },
        stdout: '',
        explanation: 'Operator "*": Popped 2 and 8. 8 * 2 = 16 pushed back to stack.'
      },
      {
        line: 17,
        vars: { top: 0, 'stack[top]': 16 },
        stdout: 'Final Result: 16\n',
        explanation: 'End of expression reached. The remaining value on stack is the final evaluated result: 16.'
      }
    ]
  }
];

export const CPlayground: React.FC = () => {
  const [activeSample, setActiveSample] = useState<PlaygroundSample>(PLAYGROUND_SAMPLES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [showChallengeFeedback, setShowChallengeFeedback] = useState<boolean>(false);

  const currentStep = activeSample.steps[currentStepIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSample.code.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeSample.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetSimulation = () => {
    setCurrentStepIndex(0);
    setSelectedChallengeOption(null);
    setShowChallengeFeedback(false);
  };

  return (
    <div className="space-y-6">
      {/* Sample selector */}
      <div className="flex flex-wrap items-center gap-2">
        {PLAYGROUND_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => {
              setActiveSample(sample);
              setCurrentStepIndex(0);
              setSelectedChallengeOption(null);
              setShowChallengeFeedback(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              activeSample.id === sample.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{sample.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded">{sample.unit}</span>
          </button>
        ))}
      </div>

      {/* Main Playground Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer with Active Line Highlight */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">source.c (Step Simulator)</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy C Code'}</span>
            </button>
          </div>

          <div className="p-4 font-mono text-xs overflow-x-auto leading-6 space-y-0.5">
            {activeSample.code.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentStep.line === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-center px-2 py-0.5 rounded transition-all duration-200 ${
                    isCurrentLine
                      ? 'bg-indigo-950/80 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-inner'
                      : 'hover:bg-slate-900/50 text-slate-300'
                  }`}
                >
                  <span className="w-8 text-slate-500 select-none text-right mr-4 text-[11px]">
                    {lineNum}
                  </span>
                  <span className="flex-1 whitespace-pre">{lineText}</span>
                </div>
              );
            })}
          </div>

          {/* Stepper Controls */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded transition-colors"
              >
                ◀ Prev Line
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === activeSample.steps.length - 1}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded transition-colors"
              >
                Next Line ▶
              </button>
              <button
                onClick={handleResetSimulation}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <span className="font-mono text-slate-400">
              Step {currentStepIndex + 1} of {activeSample.steps.length}
            </span>
          </div>
        </div>

        {/* Right: Step Inspector & Variable Memory Table */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step Explanation */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Current Line Explanation
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {currentStep.explanation}
            </p>
          </div>

          {/* Variable State Table */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Variable & Pointer State (RAM Snapshot)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">Variable / Symbol</th>
                    <th className="pb-2">Current Value / Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {Object.entries(currentStep.vars).map(([name, val], idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                      <td className="py-2 text-cyan-600 dark:text-cyan-400 font-bold">{name}</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Console stdout */}
          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-2 uppercase font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Standard Output (Console)</span>
            </div>
            <div className="bg-slate-900/80 rounded p-2.5 min-h-[44px] text-emerald-400 text-[12px]">
              {currentStep.stdout ? currentStep.stdout : <span className="text-slate-600 italic">No output produced at this step</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Predict the Output Quiz Challenge */}
      {activeSample.predictChallenge && (
        <div className="bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Predict the Output / Exam Challenge
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            {activeSample.predictChallenge.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
            {activeSample.predictChallenge.options.map((opt, oIdx) => {
              const isSelected = selectedChallengeOption === oIdx;
              const isCorrect = oIdx === activeSample.predictChallenge?.correctIndex;
              let btnStyle = 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200';
              if (showChallengeFeedback) {
                if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold';
                else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
              } else if (isSelected) {
                btnStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    setSelectedChallengeOption(oIdx);
                    setShowChallengeFeedback(true);
                  }}
                  className={`p-3 rounded-lg text-left text-xs border transition-all ${btnStyle}`}
                >
                  <span className="font-mono mr-2 font-bold opacity-60">
                    {String.fromCharCode(65 + oIdx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {showChallengeFeedback && (
            <div className="p-3 bg-slate-900 text-xs rounded-lg border border-slate-800 text-slate-300">
              <span className="font-bold text-cyan-400">Explanation: </span>
              {activeSample.predictChallenge.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
