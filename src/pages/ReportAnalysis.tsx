import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Info, AlertTriangle, MessageSquare, Download, Loader2 } from 'lucide-react';
import { fetchReportAnalysis } from '../services/reportApi';

export const ReportAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        if (!id) return;
        const data = await fetchReportAnalysis(id);
        setReport(data);
      } catch (error) {
        console.error("Failed to load report analysis", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReport();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Report Not Found</h2>
        <p className="text-slate-400 mb-6">The report you are looking for does not exist or has been deleted.</p>
        <Button variant="primary" onClick={() => navigate('/reports')}>Back to Reports</Button>
      </div>
    );
  }

  const handleAskAI = (query: string) => {
    navigate(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-slate-50">{report.title}</h1>
            {report.analysis_status === 'completed' ? (
              <Badge variant="success">Analyzed</Badge>
            ) : (
              <Badge variant="warning">Pending Analysis</Badge>
            )}
          </div>
          <p className="text-slate-400">Uploaded on {new Date(report.uploaded_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => window.open(report.cloudinary_url, '_blank')}>
            View / Download
          </Button>
          <Button variant="primary" leftIcon={<MessageSquare className="w-4 h-4" />} onClick={() => handleAskAI(`Explain my report: ${report.title}`)}>
            Ask AI Assistant
          </Button>
        </div>
      </div>



      <Card className="overflow-hidden mb-8 !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 font-bold text-slate-200">Biomarker / Test</th>
                <th className="px-6 py-4 font-bold text-slate-200">Result</th>
                <th className="px-6 py-4 font-bold text-slate-200">Reference Range</th>
                <th className="px-6 py-4 font-bold text-slate-200 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {report.test_results && report.test_results.length > 0 ? (
                report.test_results.map((r: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-50">{r.test_name}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{r.value}</span>
                      {r.unit && <span className="text-slate-400 ml-1">{r.unit}</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{r.reference_range || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge 
                        variant={r.status?.toLowerCase().includes('high') || r.status?.toLowerCase().includes('low') || r.status?.toLowerCase().includes('abnormal') ? 'error' : r.status?.toLowerCase().includes('borderline') ? 'warning' : 'success'}
                        dot
                      >
                        {r.status || 'Unknown'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    {report.analysis_status === 'pending' ? 'Analysis is pending. Test results will appear here once complete.' : 'No test results found for this report.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {report.ai_summary && (
        <Card className="mb-8 bg-primary-900/10 border-primary-500/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary-400" />
            <h3 className="font-bold text-slate-50">AI Summary</h3>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {report.ai_summary}
          </p>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Card className="flex-1 p-6 bg-dark-surface/50 border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary-400" />
            <h3 className="font-bold text-slate-50">AI Explanations</h3>
          </div>
          <div className="space-y-3">
            {report.test_results?.slice(0, 2).map((r: any, idx: number) => (
               <button key={idx} onClick={() => handleAskAI(`Understand my ${r.test_name} result`)} className="w-full text-left bg-dark-surface p-4 rounded-xl border border-white/5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:border-primary-500/30 transition-all shadow-sm">
                 "Understand my {r.test_name} result"
               </button>
            ))}
            <button onClick={() => handleAskAI(`What questions should I ask my doctor about the report "${report.title}"?`)} className="w-full text-left bg-dark-surface p-4 rounded-xl border border-white/5 text-sm font-semibold text-slate-200 hover:bg-white/5 hover:border-primary-500/30 transition-all shadow-sm">
              "What questions should I ask my doctor?"
            </button>
          </div>
        </Card>
        
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-xs text-slate-500 flex items-start gap-1.5">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Reference ranges depend on the laboratory, testing method, and individual context (age, gender). Ranges provided are standard approximations.</span>
          </p>
        </div>
      </div>
    </div>
  );
};