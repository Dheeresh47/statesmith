import React, { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FSMMachine, SimulationState } from '../../types/machine';
import { clsx } from 'clsx';

interface SimulationControlPanelProps {
  machine: FSMMachine;
  simState: SimulationState;
  onInputChange: (newInput: string) => void;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({
  machine,
  simState,
  onInputChange,
  onRun,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}) => {
  const previousStatus = useRef<SimulationState['status']>(simState.status);

  useEffect(() => {
    if (simState.status === 'accepted' && previousStatus.current !== 'accepted') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f43f5e'],
      });
    }
    previousStatus.current = simState.status;
  }, [simState.status]);

  const currentStateObj = machine.states.find((s) => s.id === simState.currentStateId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4 select-none">
      {/* Header title & Speed Control */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0 truncate">Input Simulator</h3>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="hidden sm:inline">Speed:</span>
          <select
            value={simState.speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-xs font-mono focus:outline-none w-24 cursor-pointer"
          >
            <option value={1200}>1.2s (Slow)</option>
            <option value={800}>0.8s (Norm)</option>
            <option value={400}>0.4s (Fast)</option>
            <option value={150}>0.15s (Max)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Input String <span className="text-slate-500 font-normal">(e.g. 1101)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={simState.inputString}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={simState.status === 'running'}
            placeholder="Enter input symbols (e.g. 101101)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-sky-300 text-sm font-mono rounded-lg px-3 py-2 focus:outline-none tracking-widest disabled:opacity-60"
          />
        </div>
      </div>

      {simState.inputString.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
            <span>Symbol Progress</span>
            <span className="font-mono text-slate-400">
              Step {simState.currentIndex} / {simState.inputString.length}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800 overflow-x-auto font-mono text-sm">
            {simState.inputString.split('').map((char, index) => {
              const isProcessed = index < simState.currentIndex;
              const isCurrent = index === simState.currentIndex && simState.status !== 'accepted' && simState.status !== 'rejected';

              return (
                <div
                  key={index}
                  className={clsx(
                    'min-w-[28px] h-7 flex items-center justify-center rounded font-bold transition-all duration-200',
                    isCurrent && 'bg-sky-500 text-slate-950 ring-2 ring-sky-400 scale-110 shadow-lg shadow-sky-500/40',
                    isProcessed && 'bg-slate-800 text-slate-500 line-through',
                    !isCurrent && !isProcessed && 'bg-slate-900 text-slate-300 border border-slate-800'
                  )}
                >
                  {char}
                </div>
              );
            })}
            {simState.currentIndex >= simState.inputString.length && (
              <span className="text-xs font-mono text-emerald-400 ml-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                ε (End)
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {simState.status === 'running' ? (
          <button
            onClick={onPause}
            className="flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs py-2 px-2 rounded-lg shadow transition-colors cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            disabled={simState.status === 'accepted' || simState.status === 'rejected'}
            className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs py-2 px-2 rounded-lg shadow transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run</span>
          </button>
        )}

        <button
          onClick={onStep}
          disabled={simState.status === 'running' || simState.status === 'accepted' || simState.status === 'rejected'}
          className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium text-xs py-2 px-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <SkipForward className="w-3.5 h-3.5 text-sky-400" />
          <span>Step</span>
        </button>

        <button
          onClick={onReset}
          className="col-span-2 flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs py-2 px-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Sim</span>
        </button>
      </div>

      <div className="space-y-2">
        {simState.status === 'accepted' && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 flex items-start gap-3 shadow-lg animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-300 font-mono tracking-wider">
                  ✓ ACCEPTED
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  State: {currentStateObj?.name}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                The input string was fully consumed and the finite state machine halted in an accepting state.
              </p>
            </div>
          </div>
        )}

        {simState.status === 'rejected' && (
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-3 flex items-start gap-3 shadow-lg animate-in zoom-in-95 duration-200">
            <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-300 font-mono tracking-wider">
                  ✕ REJECTED
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                {simState.rejectionReason || 'The string was rejected by the finite automaton.'}
              </p>
            </div>
          </div>
        )}

        {simState.status === 'idle' && (
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Current State:</span>
            <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {currentStateObj?.name || 'q0'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
