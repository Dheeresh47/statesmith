import React from 'react';
import { Plus, Play, CheckCircle, HelpCircle, Layers, Trash2 } from 'lucide-react';
import type { FSMMachine } from '../../types/machine';

interface ToolsPanelProps {
  machine: FSMMachine;
  onAddState: () => void;
  onSetInitialState: (stateId: string) => void;
  onToggleAcceptingState: (stateId: string) => void;
  onClearAll: () => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  machine,
  onAddState,
  onSetInitialState,
  onToggleAcceptingState,
  onClearAll,
}) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-3 flex flex-col justify-between shadow-lg overflow-y-auto select-none shrink-0">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 m-0">FSM Builder Controls</h2>
        </div>

        <button
          onClick={onAddState}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2.5 px-3 rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add State (q{machine.states.length})</span>
        </button>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            States Overview ({machine.states.length})
          </label>

          {machine.states.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
              No states created yet
            </p>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {machine.states.map((st) => {
                const isInitial = machine.initialStateId === st.id;
                const isAccepting = machine.acceptingStateIds.includes(st.id);

                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg p-2 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">{st.name}</span>
                      {isInitial && (
                        <span className="bg-amber-500/10 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-amber-500/30">
                          START
                        </span>
                      )}
                      {isAccepting && (
                        <span className="bg-emerald-500/10 text-emerald-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                          ACCEPT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSetInitialState(st.id)}
                        title={isInitial ? 'Current Initial State' : 'Set as Initial'}
                        className={`p-1 rounded transition-colors ${
                          isInitial ? 'text-amber-400 bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onToggleAcceptingState(st.id)}
                        title={isAccepting ? 'Accepting State' : 'Set as Accepting'}
                        className={`p-1 rounded transition-colors ${
                          isAccepting ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Quick Shortcuts</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-slate-300">Connect:</strong> Drag from node handle to target node.
            </li>
            <li>
              <strong className="text-slate-300">Self Loop:</strong> Drag from handle back to the same state node.
            </li>
            <li>
              <strong className="text-slate-300">Edit Label:</strong> Click symbol pill on transition line.
            </li>
            <li>
              <strong className="text-slate-300">Delete:</strong> Hover node/edge and click trash icon or press Backspace.
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800">
        <button
          onClick={onClearAll}
          className="w-full flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 text-xs py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>
    </aside>
  );
};
