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

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion_type: string;
  intensity: number;
  notes?: string;
  created_at: string;
}

export interface OvulationLog {
  id: string;
  user_id: string;
  date: string;
  basal_temp?: number;
  cervical_mucus?: 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg-white' | '';
  ovulation_test?: 'negative' | 'positive' | '';
  notes?: string;
  created_at: string;
}

export interface PredictionResult {
  predictedDate: Date;
  confidenceLevel: number;
  averageCycleLength: number;
  confidence50Lower?: Date;
  confidence50Upper?: Date;
  confidence90Lower?: Date;
  confidence90Upper?: Date;
}

export interface OvulationPrediction {
  predictedDate: Date;
  confidenceLevel: number;
  confidence50Lower?: Date;
  confidence50Upper?: Date;
  confidence90Lower?: Date;
  confidence90Upper?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface UserSettings {
  theme: ThemeColors;
}

export const PANAS_EMOTIONS = {
  positive: [
    'interested',
    'excited',
    'strong',
    'enthusiastic',
    'proud',
    'alert',
    'inspired',
    'determined',
    'attentive',
    'active'
  ],
  negative: [
    'distressed',
    'upset',
    'guilty',
    'scared',
    'hostile',
    'irritable',
    'ashamed',
    'nervous',
    'jittery',
    'afraid'
  ]
} as const;