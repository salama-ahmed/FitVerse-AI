import React, { useState } from 'react';
import { ExerciseId } from '../../types/fitness';
import { EXERCISES } from '../../data/exercises';
import { Avatar3DView } from '../avatar/Avatar3DView';
import { PoseTrackerView } from '../tracker/PoseTrackerView';
import { 
  SplitSquareVertical, 
  Maximize2, 
  Info, 
  Dumbbell, 
  Flame, 
  Check, 
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

interface VirtualTrainerWorkspaceProps {
  selectedExerciseId: ExerciseId;
  onSelectExercise: (id: ExerciseId) => void;
  onRepCountUpdate?: (exerciseId: ExerciseId, reps: number, accuracy: number) => void;
}

export const VirtualTrainerWorkspace: React.FC<VirtualTrainerWorkspaceProps> = ({
  selectedExerciseId,
  onSelectExercise,
  onRepCountUpdate,
}) => {
  const [layoutMode, setLayoutMode] = useState<'split' | 'avatarOnly' | 'cameraOnly'>('split');
  const [showInstructions, setShowInstructions] = useState(false);

  const currentExercise = EXERCISES.find((e) => e.id === selectedExerciseId) || EXERCISES[0];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentExercise.category}
            </span>
            <span className="text-xs text-slate-400">
              Target: {currentExercise.targetMuscles.slice(0, 2).join(', ')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
            <span>{currentExercise.name}</span>
            {currentExercise.has3DAnimation && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                3D Animated
              </span>
            )}
          </h1>
        </div>

        {/* Layout & Mode Switchers */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'split'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split Dual View</span>
              <span className="md:hidden">Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('avatarOnly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'avatarOnly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>3D Avatar</span>
            </button>
            <button
              onClick={() => setLayoutMode('cameraOnly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'cameraOnly'
                  ? 'bg-indigo-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pose Cam</span>
            </button>
          </div>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
              showInstructions
                ? 'bg-slate-800 text-slate-100 border-slate-600'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Exercise Form Guide"
          >
            <Info className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className={`grid gap-6 ${
        layoutMode === 'split'
          ? 'grid-cols-1 lg:grid-cols-2'
          : 'grid-cols-1'
      }`}>
        {/* Left Column: 3D Virtual Humanoid Trainer Avatar */}
        {(layoutMode === 'split' || layoutMode === 'avatarOnly') && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                VIRTUAL TRAINER (3D DEMO)
              </span>
              <span className="text-[11px] text-slate-500">Drag to rotate • Scroll to zoom</span>
            </div>

            <div className="h-[460px] sm:h-[520px] w-full">
              <Avatar3DView
                exerciseId={selectedExerciseId}
                onExerciseChange={onSelectExercise}
              />
            </div>
          </div>
        )}

        {/* Right Column: Real-Time MediaPipe Camera Pose Tracker & Rep Counter */}
        {(layoutMode === 'split' || layoutMode === 'cameraOnly') && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                YOUR MOVEMENT (MEDIAPIPE AI POSE TRACKER)
              </span>
              <span className="text-[11px] text-slate-500">Live angle calculation & rep counter</span>
            </div>

            <div className="w-full">
              <PoseTrackerView
                exerciseId={selectedExerciseId}
                targetReps={currentExercise.defaultTargetReps}
                onRepCompleted={(r, acc) => onRepCountUpdate?.(selectedExerciseId, r, acc)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Biomechanical Coaching Guide Drawer */}
      {showInstructions && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" />
              <span>Biomechanical Setup & Kinetic Checkpoints</span>
            </h3>
            <span className="text-xs text-slate-400">Burn rate: ~{currentExercise.caloriesPerMin} kcal/min</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Step-by-step setup */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Kinetic Setup</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                {currentExercise.setupInstructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Keys */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Form Keys (AI Tracking)</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                {currentExercise.formTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Mistakes to Avoid</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                {currentExercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
