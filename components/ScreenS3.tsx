
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MOCK_SUBMISSIONS, RUBRICS, COLORS } from '../constants';
import { Submission, Grade, ValidationResponse, Comment } from '../types';
import { validateGrading, validateComment } from '../services/geminiService';

interface ScreenS3Props {
  calibrationGrades: Grade[];
  onComplete: (sessionGrades: Grade[]) => void;
}

const ScreenS3: React.FC<ScreenS3Props> = ({ calibrationGrades, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionGrades, setSessionGrades] = useState<Grade[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [validations, setValidations] = useState<Record<string, ValidationResponse | null>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  // Selection/Commenting state
  const [selection, setSelection] = useState<{ text: string; top: number; left: number; range?: Range } | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentValidating, setIsCommentValidating] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const rubric = RUBRICS[0];
  const submission = MOCK_SUBMISSIONS[currentIdx];
  const typingTimer = useRef<Record<string, any>>({});
  const viewerRef = useRef<HTMLDivElement>(null);

  // Added triggerValidation to handle debounced AI checks
  const triggerValidation = (id: string, score: number, justification: string) => {
    if (typingTimer.current[id]) clearTimeout(typingTimer.current[id]);
    
    if (justification.length < 10) return;

    typingTimer.current[id] = setTimeout(async () => {
      setIsLoading(prev => ({ ...prev, [id]: true }));
      const criterion = rubric.criteria.find(c => c.id === id);
      if (criterion) {
        const result = await validateGrading(criterion, submission.text, score, justification);
        setValidations(prev => ({ ...prev, [id]: result }));
      }
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }, 800);
  };

  // Fixed missing handleScoreChange function
  const handleScoreChange = (id: string, value: number) => {
    const safeValue = isNaN(value) ? 0 : value;
    setScores(prev => ({ ...prev, [id]: safeValue }));
    if (justifications[id]) {
      triggerValidation(id, safeValue, justifications[id]);
    }
  };

  // Fixed missing handleJustificationChange function
  const handleJustificationChange = (id: string, value: string) => {
    setJustifications(prev => ({ ...prev, [id]: value }));
    triggerValidation(id, scores[id] || 0, value);
  };

  const handleTextSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0 && viewerRef.current) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parentRect = viewerRef.current.getBoundingClientRect();

      setSelection({
        text: sel.toString().trim(),
        top: rect.top - parentRect.top - 40,
        left: rect.left - parentRect.left + (rect.width / 2) - 40,
        range: range
      });
    } else {
      if (!isCommenting) setSelection(null);
    }
  };

  const addComment = async () => {
    if (!selection || !commentText) return;
    
    setIsCommentValidating(true);
    const aiResult = await validateComment(selection.text, commentText);
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      submissionId: submission.id,
      selection: selection.text,
      feedback: commentText,
      aiGuidance: aiResult.guidance,
      status: aiResult.status,
      timestamp: Date.now()
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setIsCommenting(false);
    setSelection(null);
    setIsCommentValidating(false);
    // Clear browser selection
    window.getSelection()?.removeAllRanges();
  };

  // Helper to render text with highlights
  // Fixed JSX namespace error by using React.ReactNode instead of JSX.Element
  const renderedContent = useMemo(() => {
    let text = submission.text;
    if (comments.length === 0) return text;

    let fragments: (string | React.ReactNode)[] = [text];

    comments.forEach(comment => {
      const newFragments: (string | React.ReactNode)[] = [];
      fragments.forEach(fragment => {
        if (typeof fragment === 'string') {
          const parts = fragment.split(comment.selection);
          parts.forEach((part, i) => {
            newFragments.push(part);
            if (i < parts.length - 1) {
              newFragments.push(
                <mark 
                  key={`${comment.id}-${i}`}
                  onClick={() => setActiveCommentId(comment.id)}
                  className={`cursor-pointer transition-all px-0.5 rounded ${
                    activeCommentId === comment.id 
                      ? 'bg-blue-300 ring-2 ring-blue-500' 
                      : comment.status === 'Validated' 
                        ? 'bg-green-200 hover:bg-green-300' 
                        : 'bg-amber-200 hover:bg-amber-300'
                  }`}
                >
                  {comment.selection}
                </mark>
              );
            }
          });
        } else {
          newFragments.push(fragment);
        }
      });
      fragments = newFragments;
    });

    return fragments;
  }, [submission.text, comments, activeCommentId]);

  const handleSaveAndNext = () => {
    const newGrades: Grade[] = rubric.criteria.map(c => ({
      submissionId: submission.id,
      criterionId: c.id,
      score: scores[c.id] || 0,
      justification: justifications[c.id] || '',
      validationStatus: validations[c.id]?.status || 'Pending',
      aiFeedback: validations[c.id]?.reason,
      timestamp: Date.now()
    }));

    const updated = [...sessionGrades, ...newGrades];
    setSessionGrades(updated);

    if (currentIdx < MOCK_SUBMISSIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setScores({});
      setJustifications({});
      setValidations({});
      setComments([]);
      setActiveCommentId(null);
    } else {
      onComplete(updated);
    }
  };

  // Fixed arithmetic operation error by ensuring explicit numeric types and safe defaults
  const calculateDrift = () => {
    if (calibrationGrades.length === 0) return "0.0";
    
    const currentValues = Object.values(scores);
    const criterionCount = rubric?.criteria.length || 1;
    const currentTotal = currentValues.reduce((a, b) => a + b, 0);
    const currentAvg = currentValues.length > 0 ? (currentTotal / criterionCount) : 0;

    const baselineTotal = calibrationGrades.reduce((a, b) => a + b.score, 0);
    const baselineAvg = baselineTotal / (calibrationGrades.length || 1);
    
    const diff = Math.abs(currentAvg - baselineAvg); 
    return (diff * 10).toFixed(1);
  };

  const driftValue = parseFloat(calculateDrift());

  return (
    <div id="S3_ActiveGrading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-[calc(100vh-64px)] overflow-hidden">
      {/* Column 1: Submission Text + Interactive Highlights */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
        <div 
          ref={viewerRef}
          onMouseUp={handleTextSelection}
          className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[55%] overflow-hidden relative"
        >
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">Interactive Submission</h3>
            <div className="flex gap-2">
               <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Live Highlighting</span>
               <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                {submission.studentName}
              </span>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto leading-relaxed text-slate-800 whitespace-pre-wrap select-text selection:bg-blue-100/50">
            {renderedContent}
          </div>

          {/* Floating Action Button */}
          {selection && !isCommenting && (
            <button 
              onClick={() => setIsCommenting(true)}
              style={{ top: Math.max(10, selection.top), left: Math.max(10, selection.left) }}
              className="absolute bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-2xl hover:scale-105 transition-all z-40 flex items-center gap-2 border border-slate-700"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Comment on Selection
            </button>
          )}

          {/* Comment Form Overlay */}
          {isCommenting && (
            <div className="absolute inset-0 bg-white/98 z-50 flex flex-col p-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drafting Selection Feedback</h4>
                <button onClick={() => setIsCommenting(false)} className="text-slate-400 hover:text-slate-600 p-1">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 mb-4 border border-blue-100 shadow-inner max-h-32 overflow-y-auto">
                <span className="font-bold text-blue-600 block mb-1 uppercase text-[9px]">Target Text:</span>
                "{selection?.text}"
              </div>
              <textarea
                autoFocus
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What feedback would you like to provide for this specific text? AI will check for clarity and accuracy..."
                className="flex-1 w-full p-4 bg-white text-black border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm"
              />
              <div className="mt-4 flex justify-between items-center">
                <p className="text-[10px] text-slate-400 italic italic">AI validates feedback live upon saving.</p>
                <button
                  disabled={!commentText || isCommentValidating}
                  onClick={addComment}
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isCommentValidating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Reasoning...
                    </>
                  ) : 'Verify & Add Comment'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comment List Sidebar (Vertical) */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feedback Threads</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {comments.length} Live Cards
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-slate-500">Select text to begin<br/>anchored commentary.</p>
              </div>
            ) : (
              comments.map((c) => (
                <div 
                  key={c.id} 
                  id={`comment-${c.id}`}
                  onClick={() => setActiveCommentId(c.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    activeCommentId === c.id 
                      ? 'border-blue-400 bg-blue-50/30 shadow-md ring-1 ring-blue-100' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${c.status === 'Validated' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">AI {c.status}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mb-2 line-clamp-2 border-l-2 border-slate-200 pl-2">"{c.selection}"</p>
                  <p className="text-sm font-semibold text-slate-800 mb-3">{c.feedback}</p>
                  
                  <div className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                    c.status === 'Validated' ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'
                  }`}>
                    <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                       c.status === 'Validated' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Guard Guidance
                    </p>
                    <p className="text-[11px] text-slate-700 leading-snug">{c.aiGuidance}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Column 2: Rubric & Justifications */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pb-8 pr-2">
        {rubric.criteria.map(criterion => (
          <div key={criterion.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="font-semibold text-slate-800">{criterion.name}</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max={criterion.maxPoints}
                  value={scores[criterion.id] || ''}
                  onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value))}
                  className="w-16 p-1 bg-white text-black border border-slate-300 rounded text-center focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <span className="text-xs font-bold text-slate-400">/ {criterion.maxPoints}</span>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={justifications[criterion.id] || ''}
                onChange={(e) => handleJustificationChange(criterion.id, e.target.value)}
                placeholder="Required justification for score..."
                className="w-full h-20 p-3 bg-white text-black border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
              
              <div className="mt-2 flex items-center justify-between min-h-[24px]">
                {isLoading[criterion.id] ? (
                  <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase animate-pulse">
                    AI Checking logic...
                  </div>
                ) : validations[criterion.id] && (
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    validations[criterion.id]?.status === 'Supported' ? 'bg-green-100 text-green-700' :
                    validations[criterion.id]?.status === 'Partially Supported' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {validations[criterion.id]?.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={handleSaveAndNext}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-2 flex items-center justify-center gap-2"
        >
          {currentIdx < MOCK_SUBMISSIONS.length - 1 ? 'Save & Next Student' : 'Finish Session'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Column 3: Compact Live Analytics */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4 overflow-hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Guard Console</h3>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-500">Grading Drift</span>
              <span className={`text-xs font-bold ${driftValue > 3 ? 'text-red-600' : 'text-green-600'}`}>
                {driftValue}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${driftValue > 3 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(driftValue * 10, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2">Drift Insight</h4>
             <p className="text-xs text-blue-800 leading-snug">
               {driftValue > 3 
                ? "Warning: Your scoring has drifted from the calibration baseline. AI suggests reviewing Criterion 1." 
                : "Consistency is high. Your grading mirrors the calibration baseline."}
             </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Annotation Health</h4>
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-600">Valid Feedback</span>
                <span className="text-[10px] font-bold text-green-600">92%</span>
             </div>
             <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenS3;
