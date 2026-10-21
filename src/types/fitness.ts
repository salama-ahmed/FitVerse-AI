export type ExerciseId = 
  | 'squats' 
  | 'boxing' 
  | 'jumping_jacks' 
  | 'high_knees' 
  | 'pushups' 
  | 'lunges' 
  | 'plank' 
  | 'bicep_curls';

export type Category = 'All' | 'Strength' | 'Cardio / HIIT' | 'Biomechanics' | 'Core';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: ExerciseId;
  name: string;
  category: 'Strength' | 'Cardio / HIIT' | 'Biomechanics' | 'Core';
  targetMuscles: string[];
  difficulty: Difficulty;
  caloriesPerMin: number;
  has3DAnimation: boolean;
  hasPoseTracking: boolean;
  description: string;
  setupInstructions: string[];
  formTips: string[];
  commonMistakes: string[];
  defaultTargetReps: number;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface BiomechanicsAngles {
  leftKneeAngle: number;
  rightKneeAngle: number;
  hipHingeAngle: number;
  leftElbowAngle: number;
  rightElbowAngle: number;
  torsoLeanAngle: number;
}

export interface WorkoutSessionState {
  currentExercise: ExerciseId;
  reps: number;
  targetReps: number;
  caloriesBurned: number;
  accuracyScore: number;
  durationSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  statePhase: 'up' | 'down' | 'punch_left' | 'punch_right' | 'idle' | 'hold';
  feedbackMessage: string;
  feedbackType: 'neutral' | 'success' | 'warning' | 'alert';
  isCameraActive: boolean;
  isPoseDetected: boolean;
  isSimulatorActive: boolean;
  trackingConfidence: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface DailyWorkoutPlan {
  title: string;
  focus: string;
  durationMinutes: number;
  targetCalories: number;
  exercises: {
    exerciseId: ExerciseId;
    sets: number;
    reps: number;
    completed: boolean;
  }[];
}
