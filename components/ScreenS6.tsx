
import React from 'react';
import { Grade } from '../types';

interface ScreenS6Props {
  grades: Grade[];
}

const ScreenS6: React.FC<ScreenS6Props> = ({ grades }) => {
  const confidence = 94.2;
  const adherence = 97.5;
  const drift = 1.8;

  return (
    <div id="S6_Finalization" className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Session Ready for Submission</h2>
          <p className="text-blue-100 mt-1">RubricGuard AI has verified your consistency profile.</p>
        </div>

        <div className="p-8 grid grid-cols-3 gap-8 text-center border-b border-slate-100">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
            <p className="text-2xl font-bold text-slate-900">{confidence}%</p>
          </div>
          <div className="border-x border-slate-100 px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adherence</p>
            <p className="text-2xl font-bold text-slate-900">{adherence}%</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drift</p>
            <p className="text-2xl font-bold text-green-600">{drift}%</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">AI Assistance Summary</h3>
            <ul className="space-y-3">
              {[
                { label: 'Justifications Validated', value: grades.length },
                { label: 'Real-time Challenges', value: 4 },
                { label: 'Drift Alerts Mitigated', value: 2 },
                { label: 'Avg Time Per Grade', value: '3m 12s' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => alert('Grades exported to mock LMS successfully!')}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Submit Grades to LMS
            </button>
            <button className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
              Download Consistency Report (PDF)
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs mt-8">
        RubricGuard AI: Session ID #RG-2024-8812 • Verified Academic Assistance Tool
      </p>
    </div>
  );
};

export default ScreenS6;
