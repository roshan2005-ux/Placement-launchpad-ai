import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Python Developer',
  'Java Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'Cybersecurity Analyst',
];

const Assessment = () => {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionString }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('intro'); // 'intro', 'quiz', 'result'
  const [previousAssessment, setPreviousAssessment] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user profile to detect target role
      const profileData = await api.getProfile().catch(() => null);
      const role = profileData?.profile?.targetJobRole || 'Full Stack Developer';
      setSelectedRole(role);

      // Check if user already has a saved assessment
      const latestData = await api.getLatestAssessment().catch(() => null);
      if (latestData?.assessment) {
        setPreviousAssessment(latestData.assessment);
      }
    } catch (err) {
      console.error('Failed to initialize assessment:', err);
      setError('Unable to load assessment profile.');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (roleToUse) => {
    const role = roleToUse || selectedRole;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAssessmentQuestions(role);
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setAnswers({});
        setCurrentIdx(0);
        setResult(null);
        setMode('quiz');
      } else {
        setError('No questions available for the selected role.');
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError(err.message || 'Failed to fetch assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit? Unanswered questions will be marked incorrect.`
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Format answers for submission
      const payloadAnswers = questions.map((q) => ({
        questionId: q.questionId || q.id,
        selectedAnswer: answers[q.questionId || q.id] || null,
      }));

      const res = await api.submitAssessment({
        role: selectedRole,
        answers: payloadAnswers,
      });

      if (res.assessment) {
        setResult(res.assessment);
        setPreviousAssessment(res.assessment);
        setMode('result');
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      setError(err.message || 'Failed to evaluate assessment submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && mode === 'intro') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Initializing standardized assessment bank...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: QUIZ MODE
  // ==========================================
  if (mode === 'quiz' && questions.length > 0) {
    const currentQ = questions[currentIdx];
    const qId = currentQ.questionId || currentQ.id;
    const selectedAnswer = answers[qId];
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                Technical Benchmark
              </div>
              <h1 className="text-lg font-bold text-white">{selectedRole} Skill Assessment</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
                Answered: {answeredCount} / {questions.length}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Leave assessment? Your current progress will be lost.')) {
                    setMode('intro');
                  }
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Question Nav Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((q, idx) => {
              const answered = Boolean(answers[q.questionId || q.id]);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.questionId || q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : answered
                      ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {currentQ.category || 'Technical'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentQ.difficulty || 'Medium'}
              </span>
              <span className="text-xs text-slate-500">Question {currentIdx + 1} of {questions.length}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed mb-6">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(qId, opt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 group ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: RESULTS MODE
  // ==========================================
  const activeResult = result || previousAssessment;
  if ((mode === 'result' && result) || (mode === 'history' && previousAssessment)) {
    const passed = activeResult.score >= 60;
    const catScores = activeResult.categoryScores || activeResult.categoryBreakdown || {};

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Return / Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Evaluation Report</div>
              <h1 className="text-2xl font-black text-white">{activeResult.targetJobRole || selectedRole} Assessment Results</h1>
            </div>
            <button
              onClick={() => setMode('intro')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
            >
              Back to Overview
            </button>
          </div>

          {/* Hero Score Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Score Display */}
              <div className="flex items-center space-x-6">
                <div className="relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="8"
                      className={passed ? 'text-emerald-500' : 'text-amber-500'}
                      fill="transparent"
                      strokeDasharray={289.02}
                      strokeDashoffset={289.02 - (289.02 * activeResult.score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{activeResult.score}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${
                      passed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {passed ? 'Passed Standard' : 'Needs Review'}
                  </span>
                  <div className="text-sm font-semibold text-slate-200">
                    {activeResult.correctAnswers} of {activeResult.totalQuestions} Correct
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Benchmark threshold: 60%
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Proficiency</div>
                {Object.entries(catScores).map(([cat, val]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cat}</span>
                      <span className="font-bold text-white">{val}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${val >= 70 ? 'bg-emerald-500' : val >= 50 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => startQuiz(activeResult.targetJobRole || selectedRole)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 text-center"
                >
                  Retake Assessment
                </button>
                <Link
                  to="/interview"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all text-center"
                >
                  Practice AI Mock Interview
                </Link>
                <Link
                  to="/readiness"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all text-center"
                >
                  View Overall Readiness
                </Link>
              </div>
            </div>
          </div>

          {/* Strong / Weak Areas Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-emerald-400 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-sm">Demonstrated Strengths</h3>
              </div>
              {activeResult.strongAreas && activeResult.strongAreas.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeResult.strongAreas.map((area, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{area} Mastery</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Review foundational concepts to build proven strengths.</p>
              )}
            </div>

            <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-amber-400 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-bold text-sm">Targeted Improvement Areas</h3>
              </div>
              {activeResult.weakAreas && activeResult.weakAreas.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeResult.weakAreas.map((area, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{area} - Review curriculum milestones</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Excellent performance! All categories met threshold.</p>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Detailed Question Review & Explanations</h3>
            {(activeResult.detailedResults || activeResult.answers || []).map((ans, idx) => (
              <div
                key={idx}
                className={`bg-slate-900/70 border rounded-2xl p-5 transition-all ${
                  ans.isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      ans.isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {ans.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mb-3">{ans.question}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Your Answer</div>
                    <div className={ans.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {ans.selectedAnswer || '(Unanswered)'}
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-1">Correct Answer</div>
                    <div className="text-emerald-400 font-medium">{ans.correctAnswer}</div>
                  </div>
                </div>

                {ans.explanation && (
                  <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-200/90 leading-relaxed">
                    <span className="font-bold text-indigo-300">Explanation: </span>
                    {ans.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: INTRO / DASHBOARD MODE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <span>Standardized Technical Evaluation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Role-Based Skill Assessment
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Evaluate your technical depth, problem-solving, and aptitude against industry benchmarks for your target job role.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Role Selector Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4">Select Target Job Role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  selectedRole === role
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 space-y-1">
              <div>• 10 Standardized multiple-choice questions</div>
              <div>• Covers Technical, Aptitude, and Role-specific problem solving</div>
              <div>• Instant feedback, strong/weak area diagnostics, and readiness weight (25%)</div>
            </div>

            <button
              onClick={() => startQuiz(selectedRole)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Assessment</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Previous Assessment Card (if available) */}
        {previousAssessment && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Previous Assessment Record
                </div>
                <div className="text-lg font-bold text-white">
                  {previousAssessment.targetJobRole} — {previousAssessment.score}% Score
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Completed on {new Date(previousAssessment.completedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => setMode('history')}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                View Detailed Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
