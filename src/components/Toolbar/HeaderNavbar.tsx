import React from 'react';
import {
  Cpu,
  Download,
  Upload,
  RotateCcw,
  FilePlus,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { PRESET_EXAMPLES, type MachineExample } from '../../data/examples';

interface HeaderNavbarProps {
  onSelectExample: (example: MachineExample) => void;
  onNewMachine: () => void;
  onClearCanvas: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  currentExampleId?: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onSelectExample,
  onNewMachine,
  onClearCanvas,
  onOpenImport,
  onOpenExport,
  currentExampleId,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md z-40 select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white m-0">StateSmith</h1>
          </div>
          <p className="text-[11px] text-slate-400 m-0">Finite State Machine Design & Simulation Studio</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 cursor-pointer transition-colors shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium truncate max-w-[180px]">
              {PRESET_EXAMPLES.find((e) => e.id === currentExampleId)?.name || 'Load Preset Machine'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800/80">
              Classic FSM Examples
            </div>
            {PRESET_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onSelectExample(ex)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                  currentExampleId === ex.id
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{ex.name}</span>
                <span className="text-[10px] text-slate-400 truncate">{ex.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onNewMachine}
          title="Create a fresh state machine"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>New</span>
        </button>

        <button
          onClick={onClearCanvas}
          title="Clear all states from canvas"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onOpenImport}
          title="Import FSM from JSON file"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-sky-400" />
          <span>Import</span>
        </button>

        <button
          onClick={onOpenExport}
          title="Export current FSM as JSON file"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
