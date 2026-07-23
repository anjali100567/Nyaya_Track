import apiClient from './client';

export interface FIR {
  id: number;
  fir_number: string;
  incident_type: string;
  date: string;
  location: string;
  description: string;
  status: string;
  is_zero_fir: boolean;
  tracking_code: string;
  created_at: string;
  citizen_name: string;
  station_name: string;
  case_details?: {
    assigned_officer_name?: string;
  };
}

export const getMyFIRs = async (): Promise<FIR[]> => {
  const response = await apiClient.get<FIR[]>('/firs/');
  return response.data;
};

export const createFIR = async (data: any): Promise<FIR> => {
  const response = await apiClient.post<FIR>('/firs/', data);
  return response.data;
};
