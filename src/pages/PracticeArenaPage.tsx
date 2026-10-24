import React, { useState } from 'react';
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions';
import { useProgress } from '../context/ProgressContext';
import { PracticeQuestion, UnitId } from '../types';
import {
  Trophy,
  Filter,
  CheckCircle,
  XCircle,
  Sparkles,
  Award,
  ChevronRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const PracticeArenaPage: React.FC = () => {
  const { recordQuizAttempt, progress } = useProgress();
  const [selectedUnit, setSelectedUnit] = useState<UnitId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Exam Level'>('All');
  
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) => {
    const matchesUnit = selectedUnit === 'all' || q.unit === selectedUnit;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesUnit && matchesDiff;
  });

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (submittedQuestions[qId]) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = (q: PracticeQuestion) => {
    const chosen = userAnswers[q.id];
    if (chosen === undefined) return;

    const isCorrect = chosen === q.correctAnswer;
    setSubmittedQuestions((prev) => ({ ...prev, [q.id]: true }));

    recordQuizAttempt({
      questionId: q.id,
      isCorrect,
      selectedAnswer: chosen,
      unit: q.unit,
      topicId: q.topicId,
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">
            Interactive Testing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            DSA Practice Arena
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test yourself with MCQs, pointer tracing, and code output predictions. Every answer helps identify your weak topics!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs font-mono">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-slate-700 dark:text-slate-300">
            Total Answered: <strong>{progress.quizAttempts.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Unit Filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedUnit === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u as UnitId)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                selectedUnit === u ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              U{u}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
          {(['All', 'Easy', 'Medium', 'Exam Level'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDifficulty === diff ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 ml-auto font-mono">
          Showing {filteredQuestions.length} Questions
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const selected = userAnswers[q.id];
          const isSubmitted = submittedQuestions[q.id];
          const isCorrect = selected === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-navy-900 border rounded-2xl p-6 shadow-sm transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-rose-500/40 bg-rose-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    Unit {q.unit}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 font-mono">
                    Type: {q.type}
                  </span>
                </div>

                {isSubmitted && (
                  <div className="flex items-center gap-1 text-xs font-bold font-mono">
                    {isCorrect ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> +15 XP
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> +5 XP (Reviewed)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {qIndex + 1}. {q.question}
              </h3>

              {/* Optional Code Snippet */}
              {q.codeSnippet && (
                <div className="my-3 p-3.5 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs border border-slate-800 overflow-x-auto">
                  <pre>{q.codeSnippet}</pre>
                </div>
              )}

              {/* Options Grid */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selected === oIdx;
                    let btnStyle = 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500';

                    if (isSubmitted) {
                      if (oIdx === q.correctAnswer) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
                      } else {
                        btnStyle = 'opacity-40 bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-400';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, oIdx)}
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
              )}

              {/* Submit Button */}
              {!isSubmitted && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                  <button
                    disabled={selected === undefined}
                    onClick={() => handleSubmit(q)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {/* Explanation Banner */}
              {isSubmitted && (
                <div className="mt-4 p-4 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Detailed Examination Explanation:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300 font-sans">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
