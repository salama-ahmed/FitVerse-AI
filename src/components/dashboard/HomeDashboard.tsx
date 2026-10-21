import React from 'react';
import { ExerciseId } from '../../types/fitness';
import { TODAY_WORKOUT_PLAN, EXERCISES } from '../../data/exercises';
import { 
  Flame, 
  Clock, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

interface HomeDashboardProps {
  onStartWorkout: (exerciseId: ExerciseId) => void;
  onNavigateToTab: (tab: 'dashboard' | 'trainer' | 'workouts' | 'progress' | 'coach') => void;
  todayReps: number;
  todayCalories: number;
  averageFormScore: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartWorkout,
  onNavigateToTab,
  todayReps,
  todayCalories,
  averageFormScore,
}) => {
  const activeCalories = 280 + todayCalories;
  const activeReps = 45 + todayReps;
  const activeMinutes = Math.round(18 + todayReps * 0.25);

  const featuredExercises = EXERCISES.filter((e) => e.has3DAnimation);

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Hero Welcome & Today's Workout Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 glass-panel-accent p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Today's Biomechanics Challenge</span>
            </span>
            <span className="text-xs text-slate-400">Day 4 of 7 Streak 🔥</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-3">
            Ready to train with <span className="text-emerald-400">FitVerse AI</span>?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Experience real-time computer vision coaching. Watch our 3D avatar demonstrate flawless kinematics, then step in front of your camera for live rep counting and joint angle feedback.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartWorkout('squats')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-xl hover:shadow-emerald-500/30 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 3D Squat Trainer</span>
            </button>

            <button
              onClick={() => onStartWorkout('boxing')}
              className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-sm flex items-center gap-2 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Cardio Boxing Combos</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow accents */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Fitness Progress Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Today's Fitness Telemetry</span>
          </h2>
          <span className="text-xs text-slate-400">Live updated from workouts</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>ACTIVE ENERGY</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold font-heading text-white">{activeCalories}</div>
              <div className="text-xs text-slate-400 mt-1">Goal: 500 kcal ({Math.round((activeCalories / 500) * 100)}%)</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeCalories / 500) * 100)}%` }}
              />
            </div>
          </div>

          {/* Active Minutes */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>TIME IN MOTION</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold font-heading text-white">{activeMinutes}</div>
              <div className="text-xs text-slate-400 mt-1">Goal: 45 min ({Math.round((activeMinutes / 45) * 100)}%)</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeMinutes / 45) * 100)}%` }}
              />
            </div>
          </div>

          {/* Repetitions */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>TRACKED REPS</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold font-heading text-white">{activeReps}</div>
              <div className="text-xs text-slate-400 mt-1">Across 3 exercise sets</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeReps / 80) * 100)}%` }}
              />
            </div>
          </div>

          {/* Biomechanical Accuracy */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>FORM ACCURACY</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold font-heading text-indigo-400">{averageFormScore}%</div>
              <div className="text-xs text-slate-400 mt-1">Knee & elbow kinematics</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${averageFormScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3D Animated Workouts Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Interactive 3D Virtual Training Library</span>
            </h2>
            <p className="text-xs text-slate-400">Full Three.js animations with simultaneous MediaPipe camera tracking</p>
          </div>

          <button
            onClick={() => onNavigateToTab('workouts')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Exercises</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {exercise.difficulty}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {exercise.caloriesPerMin} kcal/min
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
                  {exercise.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {exercise.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {exercise.targetMuscles.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartWorkout(exercise.id)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 3D Trainer</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Streak Bar Chart & AI Coach Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Streak Activity */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Weekly Movement Consistency</span>
              </h3>
              <p className="text-xs text-slate-400">4 days completed this week</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Active Streak 🔥
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 pb-2 items-end h-44">
            {[
              { day: 'Mon', value: 38, active: true },
              { day: 'Tue', value: 52, active: true },
              { day: 'Wed', value: 24, active: true },
              { day: 'Thu', value: 65, active: true },
              { day: 'Fri', value: 45, today: true, active: true },
              { day: 'Sat', value: 0, active: false },
              { day: 'Sun', value: 0, active: false },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[10px] text-slate-400 font-mono">
                  {d.value > 0 ? `${d.value}m` : '-'}
                </div>
                <div className="w-full max-w-[36px] bg-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-end h-28">
                  <div
                    className={`w-full rounded-xl transition-all ${
                      d.today
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_12px_#10b981]'
                        : d.active
                        ? 'bg-slate-600'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${(d.value / 70) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${d.today ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Coach Apex Callout */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Coach Apex</h4>
                <p className="text-[11px] text-cyan-400">Biomechanics & Nutrition Specialist</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "Great work on your squat depth today! To maximize quad recruitment without knee strain, keep pushing your knees outward in line with your second toe during the eccentric descent."
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask about joint angles & form fixes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom HIIT workout splits</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('coach')}
            className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Chat with Coach Apex</span>
          </button>
        </div>
      </div>
    </div>
  );
};
