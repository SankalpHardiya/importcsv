import Papa from 'papaparse';
import { CSVRow, CSVParsedData } from '@/types';

/**
 * Parse CSV file to structured data
 * @param file - CSV file from input
 * @returns Promise with parsed CSV data
 */
export function parseCSVFile(file: File): Promise<CSVParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        // Check for parsing errors
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }

        // Validate we have data
        if (!results.data || results.data.length === 0) {
          reject(new Error('CSV file is empty or has no valid data'));
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data as CSVRow[];

        resolve({
          headers,
          rows,
          totalRows: rows.length,
        });
      },
      error: (error: Error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Validate if file is a valid CSV
 * @param file - File to validate
 * @returns boolean indicating if file is valid CSV
 */
export function isValidCSVFile(file: File): boolean {
  const validExtensions = ['.csv', '.txt'];
  const validMimeTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
  
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  const hasValidExtension = validExtensions.includes(extension);
  const hasValidMimeType = validMimeTypes.includes(file.type) || file.type === '';
  
  return hasValidExtension || hasValidMimeType;
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}