import React from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Target, 
  Zap,
  BarChart2
} from 'lucide-react';

interface ProgressViewProps {
  todayReps: number;
  todayCalories: number;
  averageFormScore: number;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  todayReps,
  todayCalories,
  averageFormScore,
}) => {
  const totalReps = 320 + todayReps;
  const totalCalories = 1450 + todayCalories;
  const totalMinutes = 185;

  const badges = [
    {
      title: 'First 10 Clean Reps',
      description: 'Completed your first set with verified MediaPipe depth.',
      unlocked: true,
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'Biomechanic Master (90%+)',
      description: 'Achieved over 90% posture precision in squats.',
      unlocked: averageFormScore >= 90,
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: 'Cardio Striker',
      description: 'Maintained fast cadence in boxing jab-cross combinations.',
      unlocked: true,
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      title: 'Century Club (100+ Reps)',
      description: 'Crossed 100 cumulative exercise repetitions.',
      unlocked: totalReps >= 100,
      icon: Trophy,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
          <span>Biomechanical Progress & Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Historical training volume, joint kinematic accuracy, and performance achievements.
        </p>
      </div>

      {/* Lifetime Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>LIFETIME REPETITIONS</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-400">{totalReps}</div>
          <div className="text-xs text-slate-400 mt-1">Verified with camera computer vision</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL CALORIES</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-400">{totalCalories}</div>
          <div className="text-xs text-slate-400 mt-1">Metabolic output across sessions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL TRAINING TIME</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-cyan-400">{totalMinutes}m</div>
          <div className="text-xs text-slate-400 mt-1">Average 24 mins per workout</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>AVERAGE FORM SCORE</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-indigo-400">{averageFormScore}%</div>
          <div className="text-xs text-slate-400 mt-1">Continuous angle precision</div>
        </div>
      </div>

      {/* Kinematic Quality & Biomechanics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Accuracy by Movement Pattern */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Kinematic Accuracy by Exercise</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">MediaPipe Evaluated</span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Squat Parallel Depth & Valgus Control', score: 95, target: '90° Knee Flexion', status: 'Optimal' },
              { name: 'Boxing Jab-Cross Reach & Guard Retract', score: 91, target: 'Full Extension >150°', status: 'Great' },
              { name: 'Jumping Jacks Arm Abduction Amplitude', score: 96, target: 'Overhead Touch', status: 'Flawless' },
              { name: 'High Knees Hip Flexor Drive', score: 88, target: 'Pelvis Height 90°', status: 'Good' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.name}</span>
                  <span className="text-emerald-400 font-bold">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target: {item.target}</span>
                  <span className="text-slate-300 font-medium">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Volume Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Training Volume Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-4">
            {[
              { category: 'Lower Body (Squats & Lunges)', pct: 45, reps: 144, color: 'bg-emerald-500' },
              { category: 'Rotational Cardio (Boxing Combos)', pct: 35, reps: 112, color: 'bg-cyan-500' },
              { category: 'High-Cadence Plyometrics (Jumping Jacks)', pct: 20, reps: 64, color: 'bg-indigo-500' },
            ].map((cat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-200">{cat.category}</span>
                  <span className="text-slate-300 font-mono">{cat.pct}% ({cat.reps} reps)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges and Milestones Showcase */}
      <div>
        <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Earned Biomechanical Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${badge.color} glass-panel flex flex-col justify-between`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mb-1">{badge.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlocked & Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
