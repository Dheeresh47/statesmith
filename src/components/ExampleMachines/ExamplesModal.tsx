import React from 'react';
import { PRESET_EXAMPLES, type MachineExample } from '../../data/examples';
import { Sparkles, X } from 'lucide-react';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExample: (example: MachineExample) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({ isOpen, onClose, onSelectExample }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white m-0">Preset Finite State Machines</h2>
            <p className="text-xs text-slate-400 m-0">Select a textbook machine example to load into the visual studio canvas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {PRESET_EXAMPLES.map((ex) => (
            <div
              key={ex.id}
              onClick={() => {
                onSelectExample(ex);
                onClose();
              }}
              className="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg group space-y-2"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 m-0 font-mono">
                  {ex.name}
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                  {ex.machine.states.length} states
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed m-0">{ex.description}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Default Test String:</span>
                <span className="text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  '{ex.defaultInput}'
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
