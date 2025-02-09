export interface Period {
  id: string;
  user_id: string;
  start_date: string;
  end_date?: string;
  symptoms?: string[];
  notes?: string;
  flow_level: number;
  created_at: string;
}

export interface PredictionResult {
  predictedDate: Date;
  confidenceLevel: number;
  averageCycleLength: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}