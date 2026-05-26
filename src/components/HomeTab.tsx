import { TrendingUp, Droplets, Shield, Sparkles, ChevronRight, Calendar, Loader2, Activity } from 'lucide-react';
import { useProfile, useSkinAnalysis } from '../hooks/useAppData';

interface HomeTabProps {
  onNavigate: (tab: 'scan' | 'routine' | 'progress') => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  const { profile } = useProfile();
  const { analysis, isScanning, scanProgress, startScan } = useSkinAnalysis();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const score = analysis?.overall_score ?? 85;
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    return 'Needs Attention';
  };

  const handleStartAnalysis = () => {
    startScan();
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-teal-100 text-sm font-medium">{greeting}</p>
          <h1 className="text-white text-2xl font-semibold mt-1">{profile?.full_name || 'Sarah Johnson'}</h1>
          <p className="text-teal-100 text-sm mt-2">Let's check your skin health today</p>
        </div>
      </div>

      {/* Main Score Card */}
      <div className="max-w-lg mx-auto px-6 -mt-12">
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Skin Health Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-5xl font-bold transition-all duration-500 ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-slate-400 text-lg">/100</span>
              </div>
              <p className="text-sm font-medium mt-1" style={{ color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e' }}>
                {getScoreLabel(score)}
              </p>
            </div>
            <div className="relative">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'}
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isScanning ? (
                  <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                ) : (
                  <Sparkles className="w-8 h-8 text-teal-500" />
                )}
              </div>
            </div>
          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                  Analyzing skin...
                </span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-200"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleStartAnalysis}
            disabled={isScanning}
            className={`w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
              isScanning
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 shadow-teal-200'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Start New Analysis
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-lg mx-auto px-6 mt-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-slate-500">Hydration</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">{analysis?.hydration_score ?? 85}%</span>
            <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${analysis?.hydration_score ?? 85}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-slate-500">Barrier</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">{analysis?.barrier_score ?? 88}%</span>
            <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${analysis?.barrier_score ?? 88}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              <span className="text-xs text-slate-500">Clarity</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">{analysis?.clarity_score ?? 90}%</span>
            <div className="mt-2 h-1.5 bg-cyan-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${analysis?.clarity_score ?? 90}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto px-6 mt-6 space-y-3">
        <button
          onClick={() => onNavigate('routine')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:border-teal-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">Today's Routine</p>
              <p className="text-sm text-slate-500">5 steps remaining</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:border-teal-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">View Progress</p>
              <p className="text-sm text-slate-500">Track your improvements</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
