import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle, Activity, ChevronRight, Eye } from 'lucide-react';
import { fetchReports, uploadReport, deleteReport } from '../services/reportApi';

export const MedicalReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReports();
      if (data && data.length > 0) {
        const sorted = data.sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
        setReports(sorted);
        if (!activeReport) {
          setActiveReport(sorted[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadReport(file, file.name, "Analysis");
      setActiveReport(result);
      setReports(prev => [result, ...prev]);
    } catch (error) {
      console.error("Failed to upload report", error);
      alert("Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Parse AI summary for the active report
  let aiData = { disease_prediction: "Pending Analysis", summary: "" };
  if (activeReport?.ai_summary) {
    try {
      aiData = JSON.parse(activeReport.ai_summary);
    } catch (e) {
      console.error("Failed to parse AI summary", e);
    }
  }

  const isAbnormal = (status: string) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return s.includes('low') || s.includes('high') || s.includes('abnormal');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
          AI Medical Report Analyzer
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Upload your blood test or medical report image. Our advanced AI will instantly analyze the results and predict potential conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDE: UPLOAD SECTION */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-dark-surface to-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center min-h-[400px]">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl mix-blend-screen" />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg"
            />

            <div 
              onClick={!isUploading ? handleUploadClick : undefined}
              className={`relative z-10 w-full mx-auto border-2 border-dashed ${isUploading ? 'border-primary-500/50 bg-primary-500/5' : 'border-slate-600 hover:border-primary-500 bg-slate-800/50 hover:bg-slate-800'} rounded-2xl p-10 cursor-pointer transition-all duration-300 group`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary-500/20 rounded-full">
                    <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
                  </div>
                  <p className="text-primary-300 font-medium text-lg animate-pulse">Analyzing Report with AI...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/5 group-hover:bg-primary-500/20 rounded-full transition-colors">
                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-slate-200 font-semibold text-lg">Click to Upload Report</p>
                    <p className="text-slate-500 text-sm mt-1">Supports JPG and PNG</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: HISTORY & ANALYSIS */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Right: History Reports */}
          <div className="bg-dark-surface border border-white/10 rounded-3xl p-6 shadow-xl max-h-[300px] overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Report History
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <p className="text-slate-400 text-sm text-center p-4">No reports uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    onClick={() => setActiveReport(report)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${activeReport?.id === report.id ? 'bg-primary-500/20 border border-primary-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                  >
                    <div className="w-12 h-12 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                       {report.cloudinary_url ? (
                         <img src={report.cloudinary_url} alt="report" className="w-full h-full object-cover opacity-80" />
                       ) : (
                         <FileText className="text-slate-500 w-5 h-5" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{report.original_filename}</p>
                      <p className="text-xs text-slate-400">{new Date(report.uploaded_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      {report.analysis_status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Right: Analyzed Report Disease */}
          {activeReport && activeReport.analysis_status === 'completed' && (
            <div className="bg-dark-surface border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-primary-400" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Analysis For: <span className="text-slate-300 ml-1">{activeReport.original_filename}</span></h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Disease Box */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-center">
                  <p className="text-sm text-red-400/80 mb-1 font-semibold">AI Diagnosis / Disease</p>
                  <h4 className="text-2xl font-bold text-red-400 leading-tight">{aiData.disease_prediction}</h4>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed border-t border-red-500/20 pt-3">
                    {aiData.summary}
                  </p>
                </div>

                {/* Metrics Box */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 max-h-[250px] overflow-y-auto custom-scrollbar">
                  <p className="text-sm text-slate-400 mb-3 font-semibold">Key Abnormal Metrics</p>
                  
                  {activeReport.test_results && activeReport.test_results.length > 0 ? (
                    <div className="space-y-2">
                      {activeReport.test_results.map((test: any, idx: number) => {
                        const abnormal = isAbnormal(test.status);
                        if (!abnormal) return null; // only show abnormal
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                            <div>
                              <p className="text-sm font-semibold text-slate-200">{test.test_name}</p>
                              <p className="text-[10px] text-slate-500">{test.reference_range}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-red-400">{test.value}</p>
                              <p className="text-[10px] text-red-400 font-bold uppercase">{test.status}</p>
                            </div>
                          </div>
                        );
                      })}
                      {activeReport.test_results.filter((t: any) => isAbnormal(t.status)).length === 0 && (
                        <p className="text-sm text-slate-400 italic">No abnormal metrics detected.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No metrics extracted.</p>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};