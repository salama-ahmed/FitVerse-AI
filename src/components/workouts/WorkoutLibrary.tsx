import React, { useState } from 'react';
import { Exercise, ExerciseId, Category, Difficulty } from '../../types/fitness';
import { EXERCISES } from '../../data/exercises';
import { 
  Flame, 
  Dumbbell, 
  Play, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  X, 
  Filter, 
  Layers,
  ShieldCheck,
  Video
} from 'lucide-react';

interface WorkoutLibraryProps {
  onSelectExercise: (id: ExerciseId) => void;
}

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ onSelectExercise }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const categories: Category[] = ['All', 'Strength', 'Cardio / HIIT', 'Core'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="w-full flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
            <span>Exercise & Biomechanics Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore exercises calibrated with 3D kinematic avatars and computer-vision MediaPipe tracking.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-800 text-slate-200 rounded-lg px-2.5 py-1 border border-slate-700 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {exercise.difficulty}
                </span>

                <div className="flex items-center gap-1.5">
                  {exercise.has3DAnimation && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      3D Model
                    </span>
                  )}
                  {exercise.hasPoseTracking && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      AI Pose Cam
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
                {exercise.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {exercise.description}
              </p>

              {/* Target Muscles */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Target Muscles
                </div>
                <div className="flex flex-wrap gap-1">
                  {exercise.targetMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-slate-400 py-3 border-t border-slate-800/80 mb-4">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exercise.caloriesPerMin} kcal/min</span>
                </span>
                <span>•</span>
                <span>Target: {exercise.defaultTargetReps} Reps</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setActiveExerciseModal(exercise)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Biomechanics Guide
              </button>

              <button
                onClick={() => onSelectExercise(exercise.id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                title="Launch in Virtual Trainer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Train</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Modal Details */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveExerciseModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeExerciseModal.category}
              </span>
              <span className="text-xs text-slate-400">{activeExerciseModal.difficulty}</span>
            </div>

            <h2 className="text-2xl font-bold font-heading text-white mb-3">
              {activeExerciseModal.name}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeExerciseModal.description}
            </p>

            {/* Kinetic Setup Steps */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Kinetic Execution Steps
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {activeExerciseModal.setupInstructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Keys & Mistakes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>AI Form Checkpoints</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeExerciseModal.formTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Common Pitfalls</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeExerciseModal.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Launch in Virtual Trainer Button */}
            <button
              onClick={() => {
                const id = activeExerciseModal.id;
                setActiveExerciseModal(null);
                onSelectExercise(id);
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-emerald-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch in 3D Virtual Trainer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
