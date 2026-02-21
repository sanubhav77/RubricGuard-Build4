
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScreenS1 from './components/ScreenS1';
import ScreenS2 from './components/ScreenS2';
import ScreenS3 from './components/ScreenS3';
import ScreenS4 from './components/ScreenS4';
import ScreenS5 from './components/ScreenS5';
import ScreenS6 from './components/ScreenS6';
import { ScreenId, Grade } from './types';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(ScreenId.S1_Setup);
  const [calibrationGrades, setCalibrationGrades] = useState<Grade[]>([]);
  const [sessionGrades, setSessionGrades] = useState<Grade[]>([]);

  const handleCalibrationComplete = (grades: Grade[]) => {
    setCalibrationGrades(grades);
    setActiveScreen(ScreenId.S3_ActiveGrading);
  };

  const handleSessionComplete = (grades: Grade[]) => {
    setSessionGrades(grades);
    setActiveScreen(ScreenId.S5_Reflection);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenId.S1_Setup:
        return <ScreenS1 onNext={() => setActiveScreen(ScreenId.S2_Calibration)} />;
      case ScreenId.S2_Calibration:
        return <ScreenS2 onComplete={handleCalibrationComplete} />;
      case ScreenId.S3_ActiveGrading:
        return <ScreenS3 calibrationGrades={calibrationGrades} onComplete={handleSessionComplete} />;
      case ScreenId.S4_LiveAnalytics:
        return <ScreenS4 grades={sessionGrades} onBack={() => setActiveScreen(ScreenId.S3_ActiveGrading)} />;
      case ScreenId.S5_Reflection:
        return <ScreenS5 grades={sessionGrades} onProceed={() => setActiveScreen(ScreenId.S6_Finalization)} />;
      case ScreenId.S6_Finalization:
        return <ScreenS6 grades={sessionGrades} />;
      default:
        return <ScreenS1 onNext={() => setActiveScreen(ScreenId.S2_Calibration)} />;
    }
  };

  const canNavigate = sessionGrades.length > 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen} 
        canNavigate={canNavigate}
      />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
             <span className="font-bold text-slate-800">RubricGuard AI</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connected to Canvas LMS
             </div>
             <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </button>
          </div>
        </div>
        <div className="p-4">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
};

export default App;
