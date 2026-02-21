
import React, { useState } from 'react';
import { MOCK_SUBMISSIONS, RUBRICS } from '../constants';
import { Submission, Grade } from '../types';

interface ScreenS2Props {
  onComplete: (grades: Grade[]) => void;
}

const ScreenS2: React.FC<ScreenS2Props> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [currentJustification, setCurrentJustification] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  const rubric = RUBRICS[0];
  const submissions = MOCK_SUBMISSIONS.slice(0, 3);
  const submission = submissions[currentIdx];

  const handleNext = () => {
    const newGrades: Grade[] = rubric.criteria.map(c => ({
      submissionId: submission.id,
      criterionId: c.id,
      score: scores[c.id] || 0,
      justification: currentJustification,
      validationStatus: 'Supported',
      timestamp: Date.now()
    }));

    const updatedGrades = [...grades, ...newGrades];
    
    if (currentIdx < submissions.length - 1) {
      setGrades(updatedGrades);
      setCurrentIdx(currentIdx + 1);
      setCurrentJustification('');
      setScores({});
    } else {
      onComplete(updatedGrades);
    }
  };

  const isFormValid = rubric.criteria.every(c => scores[c.id] !== undefined) && currentJustification.length > 20;

  return (
    <div id="S2_Calibration" className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Baseline Calibration</h2>
          <p className="text-slate-500">Grade 3 sample submissions to establish your session's grading profile.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Progress</p>
          <div className="flex gap-1 mt-1">
            {submissions.map((_, i) => (
              <div key={i} className={`h-2 w-12 rounded-full ${i <= currentIdx ? 'bg-blue-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700">Submission Viewer</span>
            <span className="text-xs px-2 py-1 bg-slate-100 rounded-md font-mono">{submission.studentName}</span>
          </div>
          <div className="p-6 overflow-y-auto leading-relaxed text-slate-800 whitespace-pre-wrap">
            {submission.text}
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto h-[600px] pr-2">
          {rubric.criteria.map(criterion => (
            <div key={criterion.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900">{criterion.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Score</span>
                  <input
                    type="number"
                    min="0"
                    max={criterion.maxPoints}
                    value={scores[criterion.id] || ''}
                    onChange={(e) => setScores({ ...scores, [criterion.id]: parseInt(e.target.value) })}
                    className="w-16 p-1 text-center bg-white text-black border border-slate-300 rounded focus:border-blue-500 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">/ {criterion.maxPoints}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">{criterion.description}</p>
            </div>
          ))}

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-2">Overall Justification</h4>
            <textarea
              value={currentJustification}
              onChange={(e) => setCurrentJustification(e.target.value)}
              placeholder="Explain the reasoning for these scores based on evidence in the text..."
              className="w-full h-32 p-3 bg-white text-black border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="mt-2 text-[10px] text-slate-400">Min 20 characters required for calibration stability.</p>
          </div>

          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg"
          >
            {currentIdx === submissions.length - 1 ? 'Finish Calibration' : 'Next Submission'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenS2;
