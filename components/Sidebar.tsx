
import React from 'react';
import { ScreenId } from '../types';

interface SidebarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  canNavigate: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate, canNavigate }) => {
  const items = [
    { id: ScreenId.S1_Setup, label: '1. Setup' },
    { id: ScreenId.S2_Calibration, label: '2. Calibration' },
    { id: ScreenId.S3_ActiveGrading, label: '3. Active Grading' },
    { id: ScreenId.S4_LiveAnalytics, label: '4. Live Analytics' },
    { id: ScreenId.S5_Reflection, label: '5. Reflection' },
    { id: ScreenId.S6_Finalization, label: '6. Finalization' }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          RubricGuard AI
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">LMS Grading Assistant</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            disabled={!canNavigate && item.id !== activeScreen}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeScreen === item.id
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-700 font-medium">AI Guard Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
