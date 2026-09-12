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

const MockInterview = () => {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [session, setSession] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [latestEval, setLatestEval] = useState(null);
  const [error, setError] = useState(null);
  const [previousInterview, setPreviousInterview] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile to detect target role
      const profileData = await api.getProfile().catch(() => null);
      const role = profileData?.profile?.targetJobRole || 'Full Stack Developer';
      setSelectedRole(role);

      // Check if user already has a completed interview session
      const latestData = await api.getLatestInterview().catch(() => null);
      if (latestData?.interview) {
        setPreviousInterview(latestData.interview);
      }
    } catch (err) {
      console.error('Failed to load initial interview data:', err);
      setError('Failed to initialize interview profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (roleToUse) => {
    const role = roleToUse || selectedRole;
    try {
      setLoading(true);
      setError(null);
      setLatestEval(null);
      setViewHistory(false);

      const res = await api.startMockInterview(role);
      if (res.interview) {
        setSession(res.interview);
        setCurrentQuestionIdx(0);
        setAnswerText('');
      }
    } catch (err) {
      console.error('Failed to start mock interview:', err);
      setError(err.message || 'Failed to initialize AI mock interview.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      setError('Please provide a substantive answer before submitting.');
      return;
    }

    try {
      setEvaluating(true);
      setError(null);

      const interviewId = session._id || session.id;
      const res = await api.submitInterviewAnswer(interviewId, {
        questionIndex: currentQuestionIdx,
        answer: answerText.trim(),
      });

      if (res.interview) {
        setSession(res.interview);
        const answeredQ = res.interview.questions[currentQuestionIdx];
        setLatestEval(answeredQ?.evaluation || {
          score: answeredQ?.score,
          dimensions: answeredQ?.dimensions,
          feedback: answeredQ?.feedback,
          improvementTip: answeredQ?.improvementTip,
        });

        if (res.interview.status === 'completed') {
          setPreviousInterview(res.interview);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setLatestEval(null);
    setAnswerText('');
    setCurrentQuestionIdx((prev) => prev + 1);
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Initializing AI Mock Interview Simulator...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: COMPLETED INTERVIEW REPORT
  // ==========================================
  const activeReport = (session && session.status === 'completed') ? session : (viewHistory ? previousInterview : null);
  if (activeReport) {
    const overallScore = activeReport.overallScore || 0;
    const isPassing = overallScore >= 65;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Technical Interview Report</div>
              <h1 className="text-2xl font-black text-white">{activeReport.targetJobRole || selectedRole} Interview Performance</h1>
            </div>
            <button
              onClick={() => {
                setSession(null);
                setViewHistory(false);
              }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
            >
              Back to Overview
            </button>
          </div>

          {/* Hero Performance Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Overall Ring */}
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
                      className={isPassing ? 'text-emerald-500' : 'text-amber-500'}
                      fill="transparent"
                      strokeDasharray={289.02}
                      strokeDashoffset={289.02 - (289.02 * overallScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{overallScore}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${
                      isPassing
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isPassing ? 'Interview Ready' : 'Needs Practice'}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">
                    Evaluated across 5 key hiring dimensions
                  </div>
                </div>
              </div>

              {/* Dimension Metrics */}
              <div className="space-y-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Performance</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Technical Performance</span>
                      <span className="font-bold text-white">{activeReport.technicalPerformance || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${activeReport.technicalPerformance || 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Answer Relevance</span>
                      <span className="font-bold text-white">{activeReport.answerRelevance || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${activeReport.answerRelevance || 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Communication & Clarity</span>
                      <span className="font-bold text-white">{activeReport.communication || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${activeReport.communication || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleStartSession(activeReport.targetJobRole || selectedRole)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 text-center"
                >
                  Start New Interview
                </button>
                <Link
                  to="/readiness"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all text-center"
                >
                  View Placement Readiness
                </Link>
                <Link
                  to="/roadmap"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all text-center"
                >
                  Go to Learning Roadmap
                </Link>
              </div>
            </div>

            {/* AI Executive Feedback */}
            {activeReport.aiFeedback && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Hiring Manager Feedback</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                  {activeReport.aiFeedback}
                </p>
              </div>
            )}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-emerald-400 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-sm">Key Interview Strengths</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(activeReport.strengths || ['Solid technical fundamentals']).map((str, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-amber-400 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-bold text-sm">Actionable Areas to Improve</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(activeReport.areasToImprove || activeReport.improvements || ['Practice concise delivery']).map((imp, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-Question Evaluation List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Question Evaluation Breakdown</h3>
            {(activeReport.questions || []).map((q, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {q.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Score: {q.score}%
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mb-3">{q.question}</h4>

                <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 text-xs mb-3">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Your Answer</div>
                  <p className="text-slate-200 leading-relaxed italic">"{q.studentAnswer}"</p>
                </div>

                {q.feedback && (
                  <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-200/90 leading-relaxed mb-2">
                    <span className="font-bold text-indigo-300">Evaluation: </span>
                    {q.feedback}
                  </div>
                )}

                {q.improvementTip && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-200/90 leading-relaxed">
                    <span className="font-bold text-emerald-300">Tip: </span>
                    {q.improvementTip}
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
  // VIEW: LIVE INTERVIEW SESSION
  // ==========================================
  if (session && session.status === 'in_progress') {
    const questions = session.questions || [];
    const currentQ = questions[currentQuestionIdx];
    const totalQ = questions.length;
    const progressPercent = Math.round(((currentQuestionIdx + 1) / totalQ) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Live AI Interview Session</span>
              </div>
              <h1 className="text-lg font-bold text-white">{session.targetJobRole} Simulation</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
                Question {currentQuestionIdx + 1} of {totalQ}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Quit interview session? Progress will not be recorded.')) {
                    setSession(null);
                  }
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Quit
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

          {/* Question Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {currentQ?.category || 'Technical Fundamentals'}
              </span>
              <span className="text-xs text-slate-500">
                Role: {session.targetJobRole}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed mb-6">
              {currentQ?.question}
            </h2>

            {/* Answer Input Textarea (visible if not yet evaluated for this turn) */}
            {!latestEval ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={6}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your structured answer here. Explain the core mechanism, architectural rationale, and practical application..."
                    className="w-full rounded-xl bg-slate-800/40 border border-slate-700/60 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono">
                    {answerText.trim().split(/\s+/).filter(Boolean).length} words | {answerText.length} chars
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !answerText.trim()}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Answer</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Immediate Evaluation Feedback Box */
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">AI Evaluation Feedback</span>
                    <span className="text-sm font-black px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                      Score: {latestEval.score}%
                    </span>
                  </div>

                  {/* 5 Dimensions Grid */}
                  {latestEval.dimensions && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                      {Object.entries(latestEval.dimensions).map(([dim, val]) => (
                        <div key={dim} className="bg-slate-900/60 rounded-lg p-2 border border-slate-700/50 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 truncate mb-0.5">{dim}</div>
                          <div className="text-xs font-bold text-white">{val}%</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-slate-200 leading-relaxed mb-3">
                    <span className="font-bold text-indigo-300">Critique: </span>
                    {latestEval.feedback}
                  </div>

                  {latestEval.improvementTip && (
                    <div className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                      <span className="font-bold text-emerald-400">Actionable Tip: </span>
                      {latestEval.improvementTip}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  {currentQuestionIdx < totalQ - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2"
                    >
                      <span>Next Question</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // All questions complete
                        setLatestEval(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2"
                    >
                      <span>View Final Interview Report</span>
                    </button>
                  )}
                </div>
              </div>
            )}
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
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Role-Based Technical Mock Interview
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Simulate realistic technical placement rounds with instant AI feedback across correctness, relevance, technical depth, clarity, and communication.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Role Selector Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4">Select Target Interview Role</h2>
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
              <div>• 5 Structured technical, system design, scenario & behavioral questions</div>
              <div>• Instant AI evaluation on 5 hiring dimensions with tailored improvement tips</div>
              <div>• Direct contribution to your Placement Readiness score (25% weight)</div>
            </div>

            <button
              onClick={() => handleStartSession(selectedRole)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Interview Session</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Previous Interview Summary Card */}
        {previousInterview && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Previous Interview Session
                </div>
                <div className="text-lg font-bold text-white">
                  {previousInterview.targetJobRole} — {previousInterview.overallScore}% Overall Score
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Completed on {new Date(previousInterview.completedAt || previousInterview.createdAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => setViewHistory(true)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                View Performance Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
