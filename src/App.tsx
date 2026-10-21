import React, { useState } from 'react';
import { ExerciseId } from './types/fitness';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { VirtualTrainerWorkspace } from './components/trainer/VirtualTrainerWorkspace';
import { WorkoutLibrary } from './components/workouts/WorkoutLibrary';
import { ProgressView } from './components/progress/ProgressView';
import { AiTrainerChat } from './components/chat/AiTrainerChat';
import { 
  LayoutDashboard, 
  Dumbbell, 
  BookOpen, 
  TrendingUp, 
  Bot, 
  Flame, 
  Zap,
  Activity,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

type Tab = 'dashboard' | 'trainer' | 'workouts' | 'progress' | 'coach';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedExerciseId, setSelectedExerciseId] = useState<ExerciseId>('squats');

  // Global session stats accumulator
  const [sessionReps, setSessionReps] = useState<Record<ExerciseId, number>>({
    squats: 12,
    boxing: 20,
    jumping_jacks: 0,
    high_knees: 0,
    pushups: 0,
    lunges: 0,
    plank: 0,
    bicep_curls: 0,
  });

  const [sessionCalories, setSessionCalories] = useState(65);
  const [formAccuracy, setFormAccuracy] = useState(94);

  // Callback from tracker when a rep is counted
  const handleRepCompleted = (exerciseId: ExerciseId, newCount: number, accuracy: number) => {
    setSessionReps((prev) => ({
      ...prev,
      [exerciseId]: newCount,
    }));
    setSessionCalories((prev) => prev + 1);
    setFormAccuracy((prev) => Math.round((prev * 4 + accuracy) / 5));
  };

  const handleStartWorkout = (exerciseId: ExerciseId) => {
    setSelectedExerciseId(exerciseId);
    setActiveTab('trainer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCompletedReps = Object.values(sessionReps).reduce((a, b) => a + b, 0);

  const navItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainer' as Tab, label: 'Virtual Trainer', icon: Dumbbell, highlight: true },
    { id: 'workouts' as Tab, label: 'Workouts', icon: BookOpen },
    { id: 'progress' as Tab, label: 'Progress', icon: TrendingUp },
    { id: 'coach' as Tab, label: 'AI Coach', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black font-heading tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FITVERSE
                </span>
                <span className="text-xs font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium uppercase hidden sm:block">
                3D Avatar • MediaPipe Vision
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Right Quick Session Telemetry */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {sessionCalories} kcal
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <Activity className="w-3.5 h-3.5" />
                {totalCompletedReps} reps
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedExerciseId('squats');
                setActiveTab('trainer');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Train Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            onStartWorkout={handleStartWorkout}
            onNavigateToTab={setActiveTab}
            todayReps={totalCompletedReps}
            todayCalories={sessionCalories}
            averageFormScore={formAccuracy}
          />
        )}

        {activeTab === 'trainer' && (
          <VirtualTrainerWorkspace
            selectedExerciseId={selectedExerciseId}
            onSelectExercise={(id) => setSelectedExerciseId(id)}
            onRepCountUpdate={handleRepCompleted}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutLibrary
            onSelectExercise={handleStartWorkout}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            todayReps={totalCompletedReps}
            todayCalories={sessionCalories}
            averageFormScore={formAccuracy}
          />
        )}

        {activeTab === 'coach' && (
          <div className="max-w-4xl mx-auto">
            <AiTrainerChat
              currentExerciseId={selectedExerciseId}
              currentReps={sessionReps[selectedExerciseId] || 0}
              currentAccuracy={formAccuracy}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
