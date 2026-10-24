import React, { useState } from 'react';
import { DIFFERENCES_DATA, MOCK_TESTS, LAST_MINUTE_REVISION_TIPS } from '../data/examNotes';
import { useProgress } from '../context/ProgressContext';
import {
  GraduationCap,
  Sparkles,
  Clock,
  CheckCircle,
  HelpCircle,
  FileText,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ExamPrepPage: React.FC = () => {
  const { progress, addXP } = useProgress();
  const [activeTab, setActiveTab] = useState<'cheat-sheet' | 'differences' | 'mock-tests'>('cheat-sheet');

  // Mock Test State
  const [activeTestIndex, setActiveTestIndex] = useState<number>(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);

  const currentTest = MOCK_TESTS[activeTestIndex];

  const handleSelectMockOption = (qId: string, optIndex: number) => {
    if (isTestSubmitted) return;
    setTestAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleMockSubmit = () => {
    setIsTestSubmitted(true);
    let totalScore = 0;
    currentTest.questions.forEach((q) => {
      if (testAnswers[q.id] === q.correctIndex) {
        totalScore += q.marks;
      }
    });
    addXP(100);
  };

  const handleResetTest = () => {
    setTestAnswers({});
    setIsTestSubmitted(false);
  };

  // Compute test results
  let earnedMarks = 0;
  if (isTestSubmitted) {
    currentTest.questions.forEach((q) => {
      if (testAnswers[q.id] === q.correctIndex) {
        earnedMarks += q.marks;
      }
    });
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Pass With Confidence — University Exam Prep</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Exam Preparation Center
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Everything you need for your theory papers: 5-mark differences, last-minute formula sheets, and timed mock examinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            MCS-301 Theory
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('cheat-sheet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cheat-sheet'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ⚡ Last-Minute Formula Sheet
        </button>
        <button
          onClick={() => setActiveTab('differences')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'differences'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ⚖️ High-Yield Differences Tables (5 Marks)
        </button>
        <button
          onClick={() => setActiveTab('mock-tests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'mock-tests'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 University Mock Test Simulator
        </button>
      </div>

      {/* Tab 1: Last-Minute Cheat Sheet */}
      {activeTab === 'cheat-sheet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Golden Formulas &amp; Must-Remember Exam Pointers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Memorize these formulas before stepping into the exam hall.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAST_MINUTE_REVISION_TIPS.map((tip, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                    #{idx + 1} {tip.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                    High Frequency
                  </span>
                </div>
                <div className="p-3 bg-slate-950 text-cyan-300 rounded-xl font-mono text-xs font-bold border border-slate-800 overflow-x-auto">
                  {tip.formula}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  <strong className="text-slate-900 dark:text-white font-semibold">Exam Tip: </strong>
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Differences Tables */}
      {activeTab === 'differences' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              University 5-Mark Comparison Tables
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In university examinations, writing answers in a structured comparison table secures maximum marks.
            </p>
          </div>

          <div className="space-y-6">
            {DIFFERENCES_DATA.map((diff) => (
              <div
                key={diff.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Difference Between <span className="text-cyan-500">{diff.topicA}</span> and{' '}
                    <span className="text-indigo-500">{diff.topicB}</span>
                  </h4>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500">
                    Unit {diff.unit} • 5 Marks
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  Summary: {diff.summary}
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 font-bold">
                        <th className="p-3 w-1/4">Aspect / Basis</th>
                        <th className="p-3 w-3/8 text-cyan-600 dark:text-cyan-400">{diff.topicA}</th>
                        <th className="p-3 w-3/8 text-indigo-600 dark:text-indigo-400">{diff.topicB}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {diff.comparisons.map((c, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            {c.aspect}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                            {c.sideA}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                            {c.sideB}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Mock Test Simulator */}
      {activeTab === 'mock-tests' && (
        <div className="space-y-6">
          {/* Test Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {MOCK_TESTS.map((test, tIdx) => (
              <button
                key={test.id}
                onClick={() => {
                  setActiveTestIndex(tIdx);
                  handleResetTest();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeTestIndex === tIdx
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {test.title}
              </button>
            ))}
          </div>

          {/* Test Header */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentTest.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 font-mono">
                <span>Total Marks: {currentTest.totalMarks}</span>
                <span>•</span>
                <span>Duration: {currentTest.durationMinutes} Minutes</span>
                <span>•</span>
                <span>{currentTest.questions.length} Questions</span>
              </div>
            </div>

            {isTestSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Score Achieved:</div>
                  <div className="text-lg font-extrabold font-mono text-emerald-500">
                    {earnedMarks} / {currentTest.totalMarks} Marks ({Math.round((earnedMarks / currentTest.totalMarks) * 100)}%)
                  </div>
                </div>
                <button
                  onClick={handleResetTest}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-attempt
                </button>
              </div>
            ) : (
              <button
                onClick={handleMockSubmit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Submit Mock Test
              </button>
            )}
          </div>

          {/* Questions Container */}
          <div className="space-y-6">
            {currentTest.questions.map((q, qIdx) => {
              const selected = testAnswers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-navy-900 border rounded-2xl p-6 shadow-sm transition-all ${
                    isTestSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-rose-500/40 bg-rose-500/5'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-indigo-500 font-bold uppercase">
                      Topic: {q.topic}
                    </span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-500">
                      {q.marks} Marks
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
                    Q{qIdx + 1}. {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isThisSelected = selected === oIdx;
                      let btnStyle = 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200';

                      if (isTestSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                        } else if (isThisSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-50 dark:bg-navy-950 text-slate-400 border-slate-200 dark:border-slate-800';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-500 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isTestSubmitted}
                          onClick={() => handleSelectMockOption(q.id, oIdx)}
                          className={`p-3 rounded-xl text-left text-xs border transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold opacity-60">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isTestSubmitted && (
                    <div className="mt-4 p-3 bg-slate-900 text-slate-300 rounded-xl text-xs border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-400">Model Answer Explanation: </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
