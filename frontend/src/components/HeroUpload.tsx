"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseCSVFile, isValidCSVFile, formatFileSize } from "@/utils/csvParser";
import { MAX_FILE_SIZE } from "@/utils/constants";
import { CSVParsedData } from "@/types";

interface HeroUploadProps {
  onFileParsed: (data: CSVParsedData) => void;
  onFileCleared: () => void;
}

export default function HeroUpload({ onFileParsed, onFileCleared }: HeroUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setSelectedFile(file);
    if (!isValidCSVFile(file)) { setError("Invalid file type."); setSelectedFile(null); return; }
    if (file.size > MAX_FILE_SIZE) { setError("File too large."); setSelectedFile(null); return; }
    try {
      const parsedData = await parseCSVFile(file);
      onFileParsed(parsedData);
    } catch (err: any) {
      setError(err.message); setSelectedFile(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) processFile(acceptedFiles[0]);
  }, [onFileParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false, maxSize: MAX_FILE_SIZE,
  });

  const handleClear = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedFile(null); setError(null); onFileCleared(); };

  return (
    <div className="flex flex-col items-center text-center pt-24 pb-12">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        Powered by Gemini AI
      </div>

      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Intelligent CSV to{" "}
        <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
          CRM Import
        </span>
      </h1>
      
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        Drop any messy CSV file. Our AI automatically maps unknown columns into clean GrowEasy CRM records instantly.
      </p>

      <div
        {...getRootProps()}
        className={`group mt-10 flex h-56 w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.15)]" : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
        }`}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-2.5">
            <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">({formatFileSize(selectedFile.size)})</span>
            <button onClick={handleClear} className="ml-2 text-muted-foreground hover:text-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-full border border-border bg-secondary p-3 transition-transform group-hover:scale-110">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Drag & drop your CSV here, or{" "}
              <span className="font-medium text-blue-500">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">Supports Facebook, Google Ads, Excel exports, etc.</p>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {!selectedFile && (
        <div className="mt-12 flex items-center gap-8 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secure Processing
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI-Powered Mapping
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            100% Client-Side Preview
          </div>
        </div>
      )}
    </div>
  );
}