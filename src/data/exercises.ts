import { Exercise, DailyWorkoutPlan } from '../types/fitness';

export const EXERCISES: Exercise[] = [
  {
    id: 'squats',
    name: 'Dynamic Biomechanical Squat',
    category: 'Strength',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core Stabilizers'],
    difficulty: 'Beginner',
    caloriesPerMin: 8.5,
    has3DAnimation: true,
    hasPoseTracking: true,
    description: 'The king of lower-body exercises. Builds functional power, strengthens knees, and develops quad and glute hypertrophy while training core bracing.',
    setupInstructions: [
      'Stand feet shoulder-width apart, toes turned outward 15 to 30 degrees.',
      'Inhale deep into your diaphragm and brace your core like preparing for impact.',
      'Hinge hips backward while tracking knees in line with second toes.',
      'Descend until thighs are parallel to ground (around 90° knee flexion).',
      'Drive aggressively through mid-foot and heels to return to standing lockout.'
    ],
    formTips: [
      'Maintain an upright neutral spine; keep chest proud.',
      'Push knees outward to prevent valgus knee collapse.',
      'Keep weight centered through heels and midfoot, avoid lifting heels.'
    ],
    commonMistakes: [
      'Knees caving inward during ascent.',
      'Rounding lower lumbar back at bottom of squat ("butt wink").',
      'Shifting weight onto toes.'
    ],
    defaultTargetReps: 15
  },
  {
    id: 'boxing',
    name: 'Cardio Boxing Jab-Cross',
    category: 'Cardio / HIIT',
    targetMuscles: ['Deltoids', 'Rotator Cuff', 'Pectorals', 'Transverse Abdominis', 'Calves'],
    difficulty: 'Intermediate',
    caloriesPerMin: 11.2,
    has3DAnimation: true,
    hasPoseTracking: true,
    description: 'High-intensity rotational striking drill. Combines lead jab with rear cross, driving explosive kinetic energy through the hips, core, and shoulder chain.',
    setupInstructions: [
      'Assume orthodox stance: non-dominant foot forward, hands shielding jawline.',
      'Elbows tucked into ribs, chin dipped, weight balanced 50/50 on balls of feet.',
      'Snap lead jab straight ahead, rotating fist horizontally upon full extension.',
      'Quickly retract lead hand to guard while driving rear foot pivot for the rear cross.',
      'Exhale sharply on each strike to engage core stabilizers.'
    ],
    formTips: [
      'Generate punch force from foot pivot and hip torque, not just arm pushing.',
      'Never drop your non-striking hand away from cheek guard.',
      'Keep your chin tucked and shoulders raised to shield the jaw.'
    ],
    commonMistakes: [
      'Flaring elbows out ("chicken winging") before punching.',
      'Overextending or hyper-locking the elbow joint.',
      'Flat-footed stance with no hip pivot.'
    ],
    defaultTargetReps: 20
  },
  {
    id: 'jumping_jacks',
    name: 'Kinetic Jumping Jacks',
    category: 'Cardio / HIIT',
    targetMuscles: ['Calves', 'Deltoids', 'Abductors', 'Cardiovascular System'],
    difficulty: 'Beginner',
    caloriesPerMin: 9.0,
    has3DAnimation: true,
    hasPoseTracking: true,
    description: 'Dynamic full-body plyometric exercise elevating metabolic rate, improving lymphatic drainage, and promoting shoulder abduction mobility.',
    setupInstructions: [
      'Begin standing tall with feet together, arms resting naturally at your sides.',
      'Jump lightly off the balls of feet, spreading legs outward beyond shoulder width.',
      'Simultaneously sweep arms overhead in wide arcs until hands meet.',
      'Reverse motion rhythmically back to starting posture with soft knees.'
    ],
    formTips: [
      'Land softly on the balls of your feet to cushion knee and ankle impact.',
      'Maintain steady breathing rhythm synchronized with jumps.',
      'Keep core lightly engaged to prevent excessive lumbar arching.'
    ],
    commonMistakes: [
      'Stiff-legged landing causing harsh joint shock.',
      'Incomplete arm sweeps stopping at shoulder height.'
    ],
    defaultTargetReps: 25
  },
  {
    id: 'high_knees',
    name: 'Explosive High Knees',
    category: 'Cardio / HIIT',
    targetMuscles: ['Hip Flexors', 'Quadriceps', 'Calves', 'Lower Abdominals'],
    difficulty: 'Intermediate',
    caloriesPerMin: 10.5,
    has3DAnimation: true,
    hasPoseTracking: true,
    description: 'Sprint-conditioning drill designed to maximize stride frequency, hip flexor drive, and core stability.',
    setupInstructions: [
      'Stand tall with feet hip-width apart.',
      'Drive right knee up toward chest until thigh reaches parallel (90°).',
      'Rapidly switch legs, pumping opposite arm forward in runner’s cadence.',
      'Stay bouncy on the balls of your feet with rapid ground contact.'
    ],
    formTips: [
      'Keep torso upright; do not lean backward to cheat height.',
      'Drive knees with intention and pump elbows 90 degrees.',
      'Land quietly on forefoot with springy ankles.'
    ],
    commonMistakes: [
      'Leaning torso backward.',
      'Not driving knees high enough.'
    ],
    defaultTargetReps: 30
  },
  {
    id: 'pushups',
    name: 'Standard Military Push-ups',
    category: 'Strength',
    targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoids', 'Core'],
    difficulty: 'Intermediate',
    caloriesPerMin: 7.5,
    has3DAnimation: false,
    hasPoseTracking: false,
    description: 'The foundational upper-body bodyweight movement. Develops pushing power and rigid anti-extension core integrity.',
    setupInstructions: [
      'Place hands slightly wider than shoulder-width on the floor.',
      'Form straight plank line from head to heels, squeezing glutes.',
      'Lower chest towards floor until elbows bend to 90 degrees.',
      'Press firmly through palms to full lockout.'
    ],
    formTips: [
      'Keep elbows at 45° angle to torso, not flared out at 90°.',
      'Do not let hips sag or hike into a pyramid.'
    ],
    commonMistakes: [
      'Flaring elbows out perpendicular to torso.',
      'Sagging lower back.'
    ],
    defaultTargetReps: 12
  },
  {
    id: 'lunges',
    name: 'Forward Walking Lunges',
    category: 'Strength',
    targetMuscles: ['Glutes', 'Quads', 'Hamstrings', 'Calves'],
    difficulty: 'Intermediate',
    caloriesPerMin: 8.0,
    has3DAnimation: false,
    hasPoseTracking: false,
    description: 'Unilateral leg development that exposes and corrects strength imbalances while enhancing hip stability.',
    setupInstructions: [
      'Step forward with one leg, bending both knees to 90 degrees.',
      'Keep front knee directly over ankle, rear knee hovering 1 inch off floor.',
      'Drive back to starting position through front heel.'
    ],
    formTips: [
      'Keep torso upright and pelvis level.',
      'Do not allow front knee to cave inward.'
    ],
    commonMistakes: [
      'Front knee shooting far past toes.',
      'Banging rear knee into the hard floor.'
    ],
    defaultTargetReps: 16
  },
  {
    id: 'plank',
    name: 'Isometric Core Plank',
    category: 'Core',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Glutes', 'Deltoids'],
    difficulty: 'Beginner',
    caloriesPerMin: 5.0,
    has3DAnimation: false,
    hasPoseTracking: false,
    description: 'Static core bracing posture creating an unbreakable natural weight belt around spine and viscera.',
    setupInstructions: [
      'Rest on forearms with elbows under shoulders.',
      'Extend legs back, toes tucked, maintaining rigid spine.',
      'Squeeze glutes and press floor away with shoulder blades.'
    ],
    formTips: [
      'Breathe through stomach while maintaining tension.',
      'Never allow lumbar spine to bow towards floor.'
    ],
    commonMistakes: [
      'Hips dropping down or lifting too high.',
      'Holding breath.'
    ],
    defaultTargetReps: 45
  },
  {
    id: 'bicep_curls',
    name: 'Standing Kinetic Bicep Curls',
    category: 'Strength',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis'],
    difficulty: 'Beginner',
    caloriesPerMin: 6.0,
    has3DAnimation: false,
    hasPoseTracking: false,
    description: 'Classic elbow flexion exercise isolating arm pull strength with continuous muscle tension.',
    setupInstructions: [
      'Stand feet hip-width with arms extended at sides.',
      'Curl forearms upward while keeping elbows pinned close to ribs.',
      'Squeeze biceps hard at top contraction, then control eccentric descent.'
    ],
    formTips: [
      'Do not swing torso for momentum.',
      'Control the lowering phase for 2 full seconds.'
    ],
    commonMistakes: [
      'Rocking back and using momentum.',
      'Letting elbows drift forward.'
    ],
    defaultTargetReps: 12
  }
];

export const TODAY_WORKOUT_PLAN: DailyWorkoutPlan = {
  title: 'Full Body Biomechanics & Cardio Sculpt',
  focus: 'Lower Body Power, Rotational Core & Cardiovascular Threshold',
  durationMinutes: 25,
  targetCalories: 240,
  exercises: [
    { exerciseId: 'squats', sets: 3, reps: 15, completed: false },
    { exerciseId: 'boxing', sets: 3, reps: 20, completed: false },
    { exerciseId: 'jumping_jacks', sets: 2, reps: 25, completed: false },
    { exerciseId: 'high_knees', sets: 2, reps: 30, completed: false }
  ]
};
