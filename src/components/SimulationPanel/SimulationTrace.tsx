import React from 'react';
import type { StepTrace, FSMMachine } from '../../types/machine';
import { ArrowRight, History, Check, X } from 'lucide-react';

interface SimulationTraceProps {
  machine: FSMMachine;
  history: StepTrace[];
}

export const SimulationTrace: React.FC<SimulationTraceProps> = ({ machine, history }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
            Execution Path & Step Trace ({history.length})
          </h3>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-950 rounded-lg border border-slate-800">
          No simulation history yet. Click "Run" or "Step" to process input.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-2">Step</th>
                <th className="p-2">Current State</th>
                <th className="p-2 text-center">Symbol</th>
                <th className="p-2 text-center">Action / Next</th>
                <th className="p-2 text-right">Remaining Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((step, idx) => {
                const currState = machine.states.find((s) => s.id === step.currentStateId);
                const nextState = machine.states.find((s) => s.id === step.nextStateId);

                return (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-2 text-slate-500">#{step.stepIndex}</td>
                    <td className="p-2">
                      <span className="font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                        {currState?.name || step.currentStateId}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      {step.symbolProcessed ? (
                        <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          '{step.symbolProcessed}'
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">Start</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {nextState ? (
                        <div className="inline-flex items-center gap-1 text-slate-300">
                          <ArrowRight className="w-3 h-3 text-indigo-400" />
                          <span className="font-bold text-indigo-300">{nextState.name}</span>
                        </div>
                      ) : step.isAccepted === false ? (
                        <span className="text-rose-400 text-[11px] font-sans flex items-center justify-center gap-1">
                          <X className="w-3 h-3" /> Trap / Halt
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-sans flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> Accepted
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right text-slate-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                        {step.remainingInput}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
