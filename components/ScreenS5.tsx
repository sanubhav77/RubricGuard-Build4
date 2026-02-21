
import React from 'react';
import { Grade } from '../types';

interface ScreenS5Props {
  grades: Grade[];
  onProceed: () => void;
}

const ScreenS5: React.FC<ScreenS5Props> = ({ grades, onProceed }) => {
  const overrides = grades.filter(g => g.validationStatus === 'Not Supported').length;
  const earlyAvg = grades.slice(0, Math.floor(grades.length/2)).reduce((a,b) => a+b.score, 0) / (grades.length/2);
  const lateAvg = grades.slice(Math.floor(grades.length/2)).reduce((a,b) => a+b.score, 0) / (grades.length/2);
  const scoreDiff = (lateAvg - earlyAvg).toFixed(2);

  return (
    <div id="S5_Reflection" className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Reflection</h2>
        <p className="text-slate-500">A final review of your grading consistency before finalizing scores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Grading Shift</h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs text-slate-500">Session Trend</p>
              <p className={`text-xl font-bold ${parseFloat(scoreDiff) > 0 ? 'text-blue-600' : 'text-slate-700'}`}>
                {parseFloat(scoreDiff) > 0 ? '+' : ''}{scoreDiff} pts
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Comparison</p>
              <p className="text-xs text-slate-600">Early vs Late Submissions</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 italic">
            "You tended to grade slightly higher as the session progressed. This is a common pattern often called 'grading fatigue adjustment'."
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">AI Override Summary</h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
              <span className="text-lg font-bold text-slate-800">{overrides}</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#EF4444" strokeWidth="8" strokeDasharray={`${(overrides/grades.length)*226} 226`} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Flagged & Overridden</p>
              <p className="text-xs text-slate-500">Cases where you chose to keep a score despite AI warning.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase">Review Flagged Decisions</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {grades.filter(g => g.validationStatus !== 'Supported').map((g, i) => (
            <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{g.criterionId} - Student {g.submissionId}</p>
                <p className="text-[10px] text-slate-500 mt-1 italic">"{g.justification}"</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${g.validationStatus === 'Not Supported' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  {g.validationStatus}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Score: {g.score}/10</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onProceed}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
        >
          Proceed to Finalization
        </button>
      </div>
    </div>
  );
};

export default ScreenS5;
