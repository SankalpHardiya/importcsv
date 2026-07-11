import axios, { AxiosProgressEvent } from 'axios';
import Papa from 'papaparse';
import { CSVRow, ImportResult, APIResponse, UploadProgress } from '@/types';

// API Base URL - change this when deploying
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
});

/**
 * Upload CSV file to backend for AI processing
 * @param csvData - Parsed CSV data as array of objects
 * @param onProgress - Optional callback for upload progress
 * @returns ImportResult with parsed and skipped records
 */
export async function uploadAndProcessCSV(
  csvData: CSVRow[],
  onProgress?: (progress: UploadProgress) => void
): Promise<ImportResult> {
  try {
    // Notify: Starting upload
    onProgress?.({
      stage: 'uploading',
      message: 'Uploading CSV file...',
      progress: 10
    });

    // Convert JSON data back to CSV string
    const csvString = Papa.unparse(csvData);

    // Create FormData with CSV file
    const formData = new FormData();
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    formData.append('csvFile', blob, 'upload.csv');

    // Notify: Processing
    onProgress?.({
      stage: 'processing',
      message: 'AI is processing your data...',
      progress: 30
    });

    // Make API call
    const response = await axios.post<APIResponse<ImportResult>>(
      `${API_BASE_URL}/csv/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.({
              stage: 'uploading',
              message: `Uploading... ${percentCompleted}%`,
              progress: 10 + (percentCompleted * 0.2) // 10-30% range for upload
            });
          }
        },
      }
    );

    // Notify: Complete
    onProgress?.({
      stage: 'complete',
      message: 'Processing complete!',
      progress: 100
    });

    return response.data.data;

  } catch (error: any) {
    // Notify: Error
    onProgress?.({
      stage: 'error',
      message: error.response?.data?.error || 'Failed to process CSV',
      progress: 0
    });

    throw new Error(
      error.response?.data?.error || 'Failed to process CSV file. Please try again.'
    );
  }
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<boolean> {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
}