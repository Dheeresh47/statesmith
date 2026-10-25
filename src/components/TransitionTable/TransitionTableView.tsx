import React from 'react';
import type { FSMMachine } from '../../types/machine';
import { Table } from 'lucide-react';

interface TransitionTableViewProps {
  machine: FSMMachine;
}

export const TransitionTableView: React.FC<TransitionTableViewProps> = ({ machine }) => {
  const alphabetSet = new Set<string>();
  machine.transitions.forEach((t) => {
    t.symbols.forEach((s) => {
      if (s.trim()) alphabetSet.add(s.trim());
    });
  });
  const alphabet = Array.from(alphabetSet).sort();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
            FSM Transition Matrix δ(q, σ)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Alphabet Σ = &#123;{alphabet.length > 0 ? alphabet.join(', ') : 'ε'}&#125;
        </span>
      </div>

      {machine.states.length === 0 ? (
        <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-950 rounded-lg border border-slate-800">
          No states in machine to display transition table.
        </p>
      ) : alphabet.length === 0 ? (
        <p className="text-xs text-amber-400/80 italic p-4 text-center bg-amber-500/10 rounded-lg border border-amber-500/20">
          No transition symbols defined yet. Add transitions to view the transition matrix.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="p-2.5 border-r border-slate-800">State q ∈ Q</th>
                {alphabet.map((sym) => (
                  <th key={sym} className="p-2.5 text-center border-r border-slate-800">
                    Input '{sym}'
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {machine.states.map((state) => {
                const isInitial = machine.initialStateId === state.id;
                const isAccepting = machine.acceptingStateIds.includes(state.id);

                return (
                  <tr key={state.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-2.5 border-r border-slate-800 font-bold">
                      <div className="flex items-center gap-2">
                        {isInitial && (
                          <span className="text-amber-400 flex items-center gap-0.5 text-[10px] font-mono bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/30">
                            → Start
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded border ${isAccepting ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-bold' : 'bg-slate-950 text-slate-200 border-slate-800'}`}>
                          {isAccepting ? `(( ${state.name} ))` : state.name}
                        </span>
                        {isAccepting && (
                          <span className="text-emerald-400 text-[10px]">
                            [Accept]
                          </span>
                        )}
                      </div>
                    </td>

                    {alphabet.map((sym) => {
                      const transitionsForSymbol = machine.transitions.filter(
                        (t) => t.source === state.id && t.symbols.includes(sym)
                      );

                      if (transitionsForSymbol.length === 0) {
                        return (
                          <td key={sym} className="p-2.5 text-center border-r border-slate-800 text-slate-600 bg-slate-950/40">
                            <span className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors" title="Missing transition for symbol">
                              —
                            </span>
                          </td>
                        );
                      }

                      const targetNames = transitionsForSymbol.map((t) => {
                        const tgt = machine.states.find((s) => s.id === t.target);
                        return tgt ? tgt.name : t.target;
                      });

                      return (
                        <td key={sym} className="p-2.5 text-center border-r border-slate-800">
                          {targetNames.length > 1 ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-xs font-bold">
                              &#123;{targetNames.join(', ')}&#125;
                            </span>
                          ) : (
                            <span className="bg-sky-500/10 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded text-xs font-bold">
                              {targetNames[0]}
                            </span>
                          )}
                        </td>
                      );
                    })}
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
