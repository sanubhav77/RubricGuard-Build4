
import React, { useState } from 'react';
import { COURSES, ASSIGNMENTS, RUBRICS } from '../constants';
import { ScreenId } from '../types';

interface ScreenS1Props {
  onNext: () => void;
}

const ScreenS1: React.FC<ScreenS1Props> = ({ onNext }) => {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].id);
  const [selectedAssignment, setSelectedAssignment] = useState(ASSIGNMENTS[0].id);
  const [aiEnabled, setAiEnabled] = useState(true);

  const currentAssignment = ASSIGNMENTS.find(a => a.id === selectedAssignment);
  const currentRubric = RUBRICS.find(r => r.id === currentAssignment?.rubricId);

  return (
    <div id="S1_Setup" className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Session Setup</h2>
        <p className="text-slate-500">Configure your course and assignment to begin the assisted grading session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Assignment</label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {ASSIGNMENTS.filter(a => a.id.startsWith('a')).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700">AI Grading Assistant</p>
              <p className="text-xs text-slate-500">Real-time justification validation</p>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${aiEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${aiEnabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Rubric Preview
          </h3>
          <div className="space-y-4">
            {currentRubric?.criteria.map(c => (
              <div key={c.id} className="pb-3 border-b border-slate-100 last:border-0">
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
        >
          Begin Calibration
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ScreenS1;
