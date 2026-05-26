import { TrendingUp, TrendingDown, Minus, Calendar, Droplets, Shield, Activity } from 'lucide-react';
import { useProgress } from '../hooks/useAppData';
import { useSkinAnalysis } from '../hooks/useAppData';

export function ProgressTab() {
  const { progressLogs } = useProgress();
  const { analysis } = useSkinAnalysis();

  // Get last 7 days data
  const last7Days = progressLogs.slice(-7);
  const previous7Days = progressLogs.slice(-14, -7);

  // Calculate trends
  const avgCurrent = last7Days.reduce((sum, log) => sum + log.overall_score, 0) / last7Days.length || 0;
  const avgPrevious = previous7Days.reduce((sum, log) => sum + log.overall_score, 0) / previous7Days.length || avgCurrent;
  const trendPercent = avgPrevious > 0 ? ((avgCurrent - avgPrevious) / avgPrevious) * 100 : 0;

  const getTrendIcon = () => {
    if (trendPercent > 2) return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    if (trendPercent < -2) return <TrendingDown className="w-5 h-5 text-rose-500" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
  };

  // Simple chart - draw bars
  const chartHeight = 200;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-semibold">Your Progress</h1>
          <p className="text-teal-100 text-sm mt-1">Track your skin health journey</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Current Average</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-slate-800">{Math.round(avgCurrent)}</span>
                <span className="text-slate-400 text-lg">/100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                {getTrendIcon()}
                <span className={`font-medium ${
                  trendPercent > 2 ? 'text-emerald-500' : trendPercent < -2 ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  {trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">vs last week</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Droplets className="w-5 h-5 text-blue-500 mx-auto" />
              <p className="text-lg font-bold text-blue-700 mt-1">{analysis?.hydration_score ?? 85}</p>
              <p className="text-xs text-blue-600">Hydration</p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-3 text-center">
              <Activity className="w-5 h-5 text-cyan-500 mx-auto" />
              <p className="text-lg font-bold text-cyan-700 mt-1">{analysis?.clarity_score ?? 90}</p>
              <p className="text-xs text-cyan-600">Clarity</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <Shield className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="text-lg font-bold text-emerald-700 mt-1">{analysis?.barrier_score ?? 88}</p>
              <p className="text-xs text-emerald-600">Barrier</p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-800">Weekly Overview</h2>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Last 7 days
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative" style={{ height: chartHeight }}>
            {/* Y-axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[100, 75, 50, 25, 0].map(val => (
                <div key={val} className="flex items-center w-full">
                  <span className="text-xs text-slate-400 w-8">{val}</span>
                  <div className="flex-1 border-t border-dashed border-slate-100" />
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-around items-end" style={{ height: chartHeight - 20 }}>
              {last7Days.map((log) => {
                const height = (log.overall_score / 100) * (chartHeight - 40);
                const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
                const isToday = log.date === new Date().toISOString().split('T')[0];

                return (
                  <div key={log.id} className="flex flex-col items-center">
                    <div
                      className={`w-8 rounded-t-lg transition-all hover:opacity-80 ${
                        isToday ? 'bg-teal-500' : 'bg-teal-300'
                      }`}
                      style={{ height }}
                    />
                    <span className={`text-xs mt-2 ${isToday ? 'text-teal-600 font-medium' : 'text-slate-400'}`}>
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Logs */}
        <div className="mt-6">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {progressLogs.slice(-5).reverse().map(log => {
              const date = new Date(log.date);
              const isToday = log.date === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                      isToday ? 'bg-teal-50' : 'bg-slate-50'
                    }`}>
                      <span className={`text-lg font-bold ${isToday ? 'text-teal-600' : 'text-slate-600'}`}>
                        {date.getDate()}
                      </span>
                      <span className={`text-xs ${isToday ? 'text-teal-500' : 'text-slate-400'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <p className={`font-medium ${isToday ? 'text-teal-700' : 'text-slate-700'}`}>
                        {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" />
                          {log.hydration_score}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-cyan-400" />
                          {log.clarity_score}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          {log.barrier_score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-800">{log.overall_score}</span>
                    <span className="text-slate-400 text-sm">/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
