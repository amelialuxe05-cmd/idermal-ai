import { Check, Sun, Moon, CheckCircle2, Circle } from 'lucide-react';
import { useRoutines } from '../hooks/useAppData';
import { useState } from 'react';

export function RoutineTab() {
  const today = new Date().toISOString().split('T')[0];
  const { morningRoutines, eveningRoutines, toggleRoutine } = useRoutines(today);
  const [activeView, setActiveView] = useState<'morning' | 'evening'>('morning');

  const morningCompleted = morningRoutines.filter(r => r.is_completed).length;
  const eveningCompleted = eveningRoutines.filter(r => r.is_completed).length;

  const activeRoutines = activeView === 'morning' ? morningRoutines : eveningRoutines;
  const totalSteps = activeRoutines.length;
  const completedSteps = activeRoutines.filter(r => r.is_completed).length;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-semibold">Skincare Routine</h1>
          <p className="text-teal-100 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Progress Overview */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-500 text-sm">Today's Progress</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {morningCompleted + eveningCompleted}/{morningRoutines.length + eveningRoutines.length}
              </p>
              <p className="text-teal-600 text-sm font-medium">steps completed</p>
            </div>
            <div className="w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="6"
                  strokeDasharray={`${((morningCompleted + eveningCompleted) / (morningRoutines.length + eveningRoutines.length)) * 213.6} 213.6`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>

          {/* Time Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('morning')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                activeView === 'morning'
                  ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-2 border-transparent'
              }`}
            >
              <Sun className="w-5 h-5" />
              Morning ({morningCompleted}/{morningRoutines.length})
            </button>
            <button
              onClick={() => setActiveView('evening')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                activeView === 'evening'
                  ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-slate-50 text-slate-500 border-2 border-transparent'
              }`}
            >
              <Moon className="w-5 h-5" />
              Evening ({eveningCompleted}/{eveningRoutines.length})
            </button>
          </div>
        </div>

        {/* Routine Steps */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              {activeView === 'morning' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
              {activeView === 'morning' ? 'Morning Routine' : 'Evening Routine'}
            </h2>
            <span className="text-sm text-slate-500">{completedSteps}/{totalSteps}</span>
          </div>

          <div className="space-y-3">
            {activeRoutines.map((routine, index) => (
              <button
                key={routine.id}
                onClick={() => toggleRoutine(routine.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border transition-all text-left hover:shadow-md group"
                style={{
                  borderColor: routine.is_completed ? '#14b8a6' : '#f1f5f9',
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${
                    routine.is_completed
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                  }`}>
                    {routine.is_completed ? <Check className="w-5 h-5" /> : index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium transition-all ${
                        routine.is_completed ? 'text-teal-700' : 'text-slate-800'
                      }`}>
                        {routine.name}
                      </h3>
                      {routine.is_completed && (
                        <CheckCircle2 className="w-4 h-4 text-teal-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{routine.description}</p>
                    {routine.product_name && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg text-xs text-slate-600">
                        <span>Product:</span>
                        <span className="font-medium">{routine.product_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Toggle Indicator */}
                  <div className="flex-shrink-0">
                    {routine.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 text-teal-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                </div>

                {/* Completed Time */}
                {routine.is_completed && routine.completed_at && (
                  <div className="mt-3 pt-3 border-t border-teal-100 text-xs text-teal-600">
                    Completed at {new Date(routine.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Completion Message */}
          {completedSteps === totalSteps && totalSteps > 0 && (
            <div className="mt-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-2" />
              <h3 className="text-white font-semibold text-lg">
                {activeView === 'morning' ? 'Morning Routine Complete!' : 'Evening Routine Complete!'}
              </h3>
              <p className="text-teal-100 text-sm mt-1">Great job maintaining your skincare consistency!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
