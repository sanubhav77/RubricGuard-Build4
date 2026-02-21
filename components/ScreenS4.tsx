
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Grade, ScreenId } from '../types';
import { COLORS } from '../constants';

interface ScreenS4Props {
  grades: Grade[];
  onBack: () => void;
}

const ScreenS4: React.FC<ScreenS4Props> = ({ grades, onBack }) => {
  // Mock data for charts
  const driftData = [
    { time: '0m', drift: 0 },
    { time: '5m', drift: 1.2 },
    { time: '10m', drift: 2.5 },
    { time: '15m', drift: 3.1 },
    { time: '20m', drift: 4.2 },
    { time: '25m', drift: 3.8 },
  ];

  const criterionHeatmap = [
    { name: 'Thesis', value: 92, status: 'Stable' },
    { name: 'Evidence', value: 78, status: 'Drifting' },
    { name: 'Structure', value: 88, status: 'Stable' },
    { name: 'Grammar', value: 65, status: 'High Risk' },
  ];

  const highRiskDecisions = grades.filter(g => g.validationStatus === 'Not Supported').slice(0, 3);

  return (
    <div id="S4_LiveAnalytics" className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Session Dashboard</h2>
          <p className="text-slate-500">In-depth analysis of grading patterns and AI validations.</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm"
        >
          Return to Grading
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Validity %', value: '88%', color: 'text-green-600' },
          { label: 'Avg Drift', value: '3.2%', color: 'text-amber-600' },
          { label: 'Total Scored', value: grades.length, color: 'text-blue-600' },
          { label: 'Flags', value: '4', color: 'text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Drift Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driftData}>
                <defs>
                  <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip />
                <Area type="monotone" dataKey="drift" stroke="#3B82F6" fillOpacity={1} fill="url(#colorDrift)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Criterion Heatmap</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criterionHeatmap} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {criterionHeatmap.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value < 70 ? COLORS.notSupported : entry.value < 85 ? COLORS.partially : COLORS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 uppercase">High-Risk Decisions</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Submission</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Criterion</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Score</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">AI Verdict</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {highRiskDecisions.map((g, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-slate-700">#00{i+1} - {g.submissionId}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{g.criterionId}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-900">{g.score}/10</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase">Unsupported</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase">Review</button>
                </td>
              </tr>
            ))}
            {highRiskDecisions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                  No high-risk decisions detected in this session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScreenS4;
