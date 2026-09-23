import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Heart, Scale, Moon, Download, Loader2, Target, FileText, ChevronRight, Brain } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchHealthAnalytics } from '../services/analyticsApi';
import { useNavigate } from 'react-router-dom';

export const HealthProgress = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('6M');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchHealthAnalytics(timeRange);
        setData(result);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [timeRange]);

  const handleExport = () => {
    if (!data || !data.cards || data.cards.length === 0) {
      alert("No data available to export yet.");
      return;
    }
    const headers = "Metric,Current Value,Unit,Trend,Change\n";
    const csv = data.cards.map((c: any) => `${c.name},${c.current},${c.unit},${c.trend},${c.change}`).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'health_progress_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getIconForMetric = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('heart')) return <Heart className="w-5 h-5 text-rose-400" />;
    if (n.includes('blood pressure') || n.includes('bp')) return <Activity className="w-5 h-5 text-emerald-400" />;
    if (n.includes('weight')) return <Scale className="w-5 h-5 text-blue-400" />;
    if (n.includes('sleep')) return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Activity className="w-5 h-5 text-purple-400" />;
  };

  const getColorForMetric = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('heart')) return 'bg-rose-500/10 border-rose-500/20';
    if (n.includes('blood pressure') || n.includes('bp')) return 'bg-emerald-500/10 border-emerald-500/20';
    if (n.includes('weight')) return 'bg-blue-500/10 border-blue-500/20';
    if (n.includes('sleep')) return 'bg-indigo-500/10 border-indigo-500/20';
    return 'bg-purple-500/10 border-purple-500/20';
  };

  return (
    <div className="pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Health Progress</h1>
          <p className="text-slate-400 text-lg">Track and analyze your vital metrics over time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-dark-surface rounded-xl p-1.5 border border-white/10 flex shadow-sm">
            {['1M', '3M', '6M', '1Y'].map(t => (
              <button 
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeRange === t ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button onClick={handleExport} variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-primary-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-semibold animate-pulse">Running Data Analytics...</p>
        </div>
      ) : !data || (data.cards.length === 0 && data.charts.length === 0) ? (
        <div className="bg-dark-surface border border-white/5 rounded-3xl p-12 text-center shadow-xl">
          <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">Upload medical reports with test results (like Hemoglobin, Heart Rate, or Platelets) to unlock dynamic analytics and AI insights.</p>
          <Button onClick={() => navigate('/reports')}>Upload Medical Report</Button>
        </div>
      ) : (
        <>
          {/* Main Top Section: AI Score & Insights + Top Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overall Score & AI Insights */}
            <div className="lg:col-span-1 bg-gradient-to-br from-primary-900/40 to-dark-surface border border-primary-500/20 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Brain className="w-32 h-32 text-primary-400" /></div>
              
              <h3 className="text-sm font-bold text-primary-300 uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
                <Brain className="w-4 h-4" /> AI Health Analysis
              </h3>
              
              <div className="flex items-center gap-6 mb-6 relative z-10">
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (data.overall_score || 0)) / 100} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white leading-none">{data.overall_score || 0}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Score</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-200 font-semibold mb-1">Health Progress</p>
                  <p className="text-xs text-slate-400">Based on your recent medical report data and test results.</p>
                </div>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Key Insights</p>
                  <ul className="space-y-2">
                    {data.insights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                        <Activity className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" /> {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.cards.map((card: any, i: number) => (
                <Card key={i} className="p-5 flex flex-col justify-center border-white/5 hover:border-primary-500/30 transition-all hover:-translate-y-1 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg border ${getColorForMetric(card.name)}`}>
                      {getIconForMetric(card.name)}
                    </div>
                    <span className="text-sm font-semibold text-slate-300 truncate" title={card.name}>{card.name}</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <p className="text-3xl font-bold text-slate-50">{card.current}</p>
                    <span className="text-sm font-normal text-slate-500 mb-1">{card.unit}</span>
                  </div>
                  <div className="mt-auto">
                    <Badge variant={card.trend === 'Decreased' ? 'warning' : 'success'} className="text-[10px] py-0.5">
                      {card.trend} {card.change > 0 ? `+${card.change}` : card.change}
                    </Badge>
                  </div>
                </Card>
              ))}
              {data.cards.length === 0 && (
                <div className="col-span-full flex items-center justify-center p-8 bg-dark-surface rounded-3xl border border-white/5">
                  <p className="text-slate-500">No simple metrics extracted. Check the charts below.</p>
                </div>
              )}
            </div>
          </div>

          {/* Matplotlib Charts Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" /> Data Trends (Analytics Engine)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.charts.map((chart: any, i: number) => (
                <Card key={i} className="p-1 border-white/10 overflow-hidden shadow-xl bg-[#1E293B]">
                  {/* The chart is generated directly by python matplotlib with a dark background to match the theme */}
                  <img src={chart.image_base64} alt={`${chart.name} Chart`} className="w-full h-auto rounded-2xl" />
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Section: Goals & Recent Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Health Goals */}
            <div className="bg-dark-surface border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Target className="w-4 h-4" /> Active Health Goals
              </h3>
              
              {data.recommendations && data.recommendations.length > 0 ? (
                <div className="space-y-5">
                  {data.recommendations.map((rec: string, i: number) => {
                    // Fake a random progress for demo purposes based on index
                    const progress = [65, 30, 85, 40][i % 4]; 
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold text-slate-200">{rec.split('.')[0]}</span>
                          <span className="text-primary-400 font-bold">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic p-4 text-center bg-black/20 rounded-xl">No specific goals generated yet.</p>
              )}
            </div>

            {/* Recent Reports */}
            <div className="bg-dark-surface border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Recent Medical Reports
                </h3>
                <button onClick={() => navigate('/reports')} className="text-xs text-primary-400 hover:text-primary-300 flex items-center font-bold">
                  View All <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {data.recent_reports && data.recent_reports.length > 0 ? (
                  data.recent_reports.map((r: any) => (
                    <div key={r.id} onClick={() => navigate('/reports')} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary-500/30 cursor-pointer transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 text-primary-400 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 truncate max-w-[200px]">{r.title}</p>
                          <p className="text-xs text-slate-500">{r.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic p-4 text-center bg-black/20 rounded-xl h-full flex items-center justify-center">No reports analyzed recently.</p>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};