"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroUpload from "@/components/HeroUpload";
import CSVPreview from "@/components/CSVPreview";
import ResultsDashboard from "@/components/ResultsDashboard";
import { MagicProgress } from "@/components/ui/magic-progress";
import { uploadAndProcessCSV } from "@/services/api";
import { CSVParsedData, ImportResult } from "@/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [csvData, setCsvData] = useState<CSVParsedData | null>(null);
  const [parsedResult, setParsedResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  const startProgressSimulation = () => {
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const increment = prev < 30 ? 2 : prev < 70 ? 1 : 0.5;
        if (prev >= 95) {
          clearInterval(progressInterval.current!);
          return 95; 
        }
        return prev + increment;
      });
    }, 100);
  };

  const stopProgressSimulation = (success: boolean) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    setProgress(success ? 100 : 0);
  };

  const handleFileParsed = (data: CSVParsedData) => {
    setCsvData(data);
    setParsedResult(null);
    setError(null);
    setTimeout(() => {
      previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // THIS FUNCTION NOW HANDLES RESETTING EVERYTHING
  const handleFileCleared = () => {
    setCsvData(null);
    setParsedResult(null);
    setError(null);
    // Smoothly scroll back to the very top where the Hero is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmImport = async () => {
    if (!csvData) return;
    setIsLoading(true);
    setError(null);
    setParsedResult(null);
    startProgressSimulation();

    try {
      const result = await uploadAndProcessCSV(csvData.rows);
      setParsedResult(result);
      stopProgressSimulation(true);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to process CSV.');
      stopProgressSimulation(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Phase 1: Hero & Upload */}
      {!csvData && <HeroUpload onFileParsed={handleFileParsed} onFileCleared={handleFileCleared} />}

      <div className="mx-auto max-w-6xl px-6 pb-20">
        
        {/* Phase 2: Preview & Action */}
        {csvData && !isLoading && !parsedResult && (
          <div ref={previewSectionRef} className="pt-24 scroll-mt-24 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Preview Data</h2>
                <p className="text-sm text-muted-foreground">{csvData.totalRows} rows found in CSV</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none" onClick={handleFileCleared}>
                  Upload Different File
                </Button>
                <Button 
                  onClick={handleConfirmImport} 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-1 sm:flex-none justify-center"
                >
                  Run AI Import
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
              </div>
            </div>
            <CSVPreview data={csvData} />
          </div>
        )}

        {/* Phase 3: Loading */}
        {isLoading && (
          <div className="pt-24 scroll-mt-24 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Processing with AI...</h2>
                <p className="text-sm text-muted-foreground mt-1">Mapping {csvData?.totalRows} rows via Gemini</p>
              </div>
              <span className="font-mono text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
            </div>
            <MagicProgress value={progress} />
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Extracting entities and formatting records
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="pt-24 scroll-mt-24 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={handleFileCleared}>
              Try Again
            </Button>
          </div>
        )}

        {/* Phase 4: Results Dashboard */}
        {parsedResult && (
          <div className="pt-24 scroll-mt-24 space-y-6">
            {/* --- ADDED THIS ACTION BAR HERE --- */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Import Complete</h2>
                <p className="text-sm text-muted-foreground">Your data has been successfully mapped.</p>
              </div>
              <Button 
                onClick={handleFileCleared} 
                variant="outline"
                className="border-border text-foreground hover:bg-accent"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Upload New File
              </Button>
            </div>
            {/* --------------------------------- */}
            
            <ResultsDashboard result={parsedResult} />
          </div>
        )}
      </div>
    </main>
  );
}