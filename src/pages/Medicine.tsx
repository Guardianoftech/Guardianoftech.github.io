import React, { useState, useRef } from 'react';
import { Upload, Pill, AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Medicine = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/medicine/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze medicine');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while analyzing the medicine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-8 text-center bg-gradient-to-b from-teal-900/40 to-transparent p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/20 rounded-2xl mb-4 text-teal-400 border border-teal-500/30">
          <Pill className="w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold tracking-tight">Medicine Information</h1>
        </div>
        <p className="text-xl text-teal-100 font-medium mb-2">Know What Your Medicine is For</p>
        <p className="text-teal-400/80 text-sm tracking-widest uppercase font-semibold">"Upload a photo to get instant details"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-6 text-white border-b border-white/10">
            <h2 className="text-lg font-bold flex items-center"><Upload className="mr-2 h-5 w-5 text-teal-400" /> Upload Medicine Image</h2>
          </div>
          <div className="p-8 flex flex-col items-center">
            
            <div 
              className="w-full border-2 border-dashed border-teal-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-teal-50/50 hover:bg-teal-50 transition-colors cursor-pointer min-h-[300px]"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full h-full flex justify-center">
                  <img src={preview} alt="Medicine Preview" className="max-h-[250px] object-contain rounded-xl shadow-sm" />
                </div>
              ) : (
                <>
                  <div className="bg-teal-100 p-4 rounded-full mb-4">
                    <Pill className="w-10 h-10 text-teal-600" />
                  </div>
                  <p className="font-bold text-slate-700 text-lg mb-2">Tap to Select Image</p>
                  <p className="text-sm text-slate-500 text-center">Take a clear photo of the medicine strip or bottle.</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <Button 
              variant="primary" 
              className="w-full mt-6 py-4 bg-teal-600 hover:bg-teal-700 font-bold rounded-xl shadow-lg"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Activity className="animate-spin -ml-1 mr-3 h-5 w-5" /> Analyzing...
                </span>
              ) : (
                'Analyze Medicine'
              )}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm font-semibold flex items-center w-full">
                <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-6 text-white border-b border-white/10">
            <h2 className="text-lg font-bold flex items-center"><Info className="mr-2 h-5 w-5 text-teal-400" /> Analysis Result</h2>
          </div>
          
          <div className="p-8">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16">
                <Info className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Upload a medicine to see its details here.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-teal-600 py-16">
                <Activity className="w-16 h-16 mb-4 animate-spin opacity-50" />
                <p className="text-lg font-medium animate-pulse">Our AI is reading the label...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Medicine Name</h3>
                  <div className="text-2xl font-black text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {result.name}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-teal-600 flex items-center uppercase tracking-wider mb-2">
                    <CheckCircle className="w-4 h-4 mr-1" /> Primary Use (What is it for?)
                  </h3>
                  <div className="text-lg font-medium text-teal-900 bg-teal-50 p-4 rounded-xl border border-teal-200">
                    {result.primary_use}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Ingredients</h3>
                    <ul className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      {result.active_ingredients?.length > 0 ? (
                        result.active_ingredients.map((ing: string, i: number) => (
                          <li key={i} className="text-slate-700 font-medium text-sm">• {ing}</li>
                        ))
                      ) : (
                        <li className="text-slate-500 text-sm italic">Not identified</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-2">Common Side Effects</h3>
                    <ul className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-1">
                      {result.side_effects?.length > 0 ? (
                        result.side_effects.map((se: string, i: number) => (
                          <li key={i} className="text-rose-700 font-medium text-sm flex items-start">
                            <AlertTriangle className="w-3 h-3 mr-1 mt-1 shrink-0 opacity-70" /> {se}
                          </li>
                        ))
                      ) : (
                        <li className="text-rose-500 text-sm italic">Not identified</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <p>Disclaimer: This is AI-generated information based on the image uploaded. It is not professional medical advice. Always consult your doctor before taking any medication.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
