export interface LogEntry {
  patient_id: string;
  timestamp: string; // ISO format
  type: string; // 'Glucose', 'Blood Pressure', etc
  value: number;
  unit: string;
  extra_data?: Record<string, any> | null;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  medications: string[];
}

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  date?: string; // ISO Date String
}

export interface Task {
  task: string;
  time: string;
}

export interface Plan {
  message: string;
  tasks: Task[];
  targets: {
    glucose_min?: number;
    glucose_max?: number;
    bp_systolic_max?: number;
    weight_target?: number;
  };
  citations?: Article[]; // References to guidelines
}

export interface Trends {
  insight: string;
  stats: {
    tir?: number;
    bp_control?: number;
    streak?: number;
  };
}
