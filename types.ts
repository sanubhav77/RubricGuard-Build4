
export enum ScreenId {
  S1_Setup = 'S1_Setup',
  S2_Calibration = 'S2_Calibration',
  S3_ActiveGrading = 'S3_ActiveGrading',
  S4_LiveAnalytics = 'S4_LiveAnalytics',
  S5_Reflection = 'S5_Reflection',
  S6_Finalization = 'S6_Finalization'
}

export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
}

export interface Rubric {
  id: string;
  title: string;
  criteria: RubricCriterion[];
}

export interface Submission {
  id: string;
  studentName: string;
  text: string;
}

export interface Comment {
  id: string;
  submissionId: string;
  selection: string;
  feedback: string;
  aiGuidance?: string;
  status: 'Pending' | 'Validated' | 'Challenged';
  timestamp: number;
}

export interface Grade {
  submissionId: string;
  criterionId: string;
  score: number;
  justification: string;
  validationStatus: 'Supported' | 'Partially Supported' | 'Not Supported' | 'Pending';
  aiFeedback?: string;
  timestamp: number;
  isOverride?: boolean;
}

export interface Course {
  id: string;
  name: string;
}

export interface Assignment {
  id: string;
  name: string;
  rubricId: string;
}

export interface ValidationResponse {
  status: 'Supported' | 'Partially Supported' | 'Not Supported';
  reason: string;
  excerpt?: string;
}
