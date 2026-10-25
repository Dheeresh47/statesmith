import React from 'react';
import type { FSMMachine } from '../../types/machine';
import { analyzeMachine } from '../../logic/machineAnalysis';
import { Activity, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AnalysisViewProps {
  machine: FSMMachine;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ machine }) => {
  const analysis = analyzeMachine(machine);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
            FSM Structural Analysis & Verification
          </h3>
        </div>
        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
            analysis.isDeterministic
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
        >
          {analysis.isDeterministic ? 'DFA (Deterministic)' : 'NFA (Non-Deterministic)'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total States |Q|</span>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5">{analysis.stateCount}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Transitions |δ|</span>
          <div className="text-xl font-bold font-mono text-sky-400 mt-0.5">{analysis.transitionCount}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Accepting States</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{analysis.acceptingStates.length}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Alphabet |Σ|</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{analysis.alphabet.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
          <span className="font-semibold text-slate-300 block">State Reachability</span>
          <div className="space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">Reachable from start:</span>{' '}
              {analysis.reachableStateIds.length > 0 ? (
                <span className="text-emerald-400 font-bold">
                  [{analysis.reachableStateIds.map((id) => machine.states.find((s) => s.id === id)?.name).join(', ')}]
                </span>
              ) : (
                <span className="text-slate-600">None</span>
              )}
            </div>
            <div>
              <span className="text-slate-500">Unreachable:</span>{' '}
              {analysis.unreachableStateIds.length > 0 ? (
                <span className="text-rose-400 font-bold">
                  [{analysis.unreachableStateIds.map((id) => machine.states.find((s) => s.id === id)?.name).join(', ')}]
                </span>
              ) : (
                <span className="text-emerald-400">None (All states reachable)</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
          <span className="font-semibold text-slate-300 block">Dead-End States</span>
          <div className="space-y-1 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">Dead states (Cannot reach accept):</span>{' '}
              {analysis.deadStateIds.length > 0 ? (
                <span className="text-rose-400 font-bold">
                  [{analysis.deadStateIds.map((id) => machine.states.find((s) => s.id === id)?.name).join(', ')}]
                </span>
              ) : (
                <span className="text-emerald-400">None (Path to accepting state exists)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Validation Warnings & Recommendations ({analysis.issues.length})
        </label>

        {analysis.issues.length === 0 ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Machine structure is complete and fully valid with zero warnings!</span>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {analysis.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                  issue.type === 'error'
                    ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                    : issue.type === 'warning'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {issue.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : issue.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{issue.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
