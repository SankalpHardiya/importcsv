// Types for CSV data
export interface CSVRow {
  [key: string]: string | number | undefined;
}

// Types for Parsed CSV Preview
export interface CSVParsedData {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
}

// Types for CRM Fields (GrowEasy Format)
export interface CRMRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

// Types for Skipped Record
export interface SkippedRecord {
  originalData: CSVRow;
  reason: string;
}

// Types for API Response
export interface ImportResult {
  parsedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
  totalImported: number;
  totalSkipped: number;
}

// Types for API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Upload progress type
export interface UploadProgress {
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
}