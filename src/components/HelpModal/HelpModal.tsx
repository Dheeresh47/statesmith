import React from 'react';
import { X, BookOpen, CheckCircle, Cpu, Award } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white m-0">StateSmith — Academic Guide & Viva FAQs</h2>
            <p className="text-xs text-slate-400 m-0">
              Automata Theory & Compiler Design Course Project Demonstration Guide
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Formal Mathematical Definition: 5-Tuple M = (Q, Σ, δ, q₀, F)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <strong className="text-sky-400">Q:</strong> Finite set of states (e.g. &#123;q0, q1, q2&#125;)
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <strong className="text-amber-400">Σ:</strong> Finite input alphabet (e.g. &#123;0, 1&#125;)
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <strong className="text-emerald-400">δ:</strong> Transition function δ: Q × Σ → Q
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <strong className="text-purple-400">q₀ ∈ Q:</strong> Start/Initial state
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800 sm:col-span-2">
              <strong className="text-rose-400">F ⊆ Q:</strong> Set of accepting/final states
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 m-0">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Viva Examination Quick Reference</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-indigo-300 block">Q1: How does string acceptance work in a Deterministic Finite Automaton (DFA)?</strong>
              <p className="text-slate-400 leading-relaxed m-0">
                A string w is accepted by a DFA if, starting from initial state q₀ and following transition function δ for each symbol in w, the automaton ends in a state q_final such that q_final ∈ F.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-indigo-300 block">Q2: What happens if a state does not have an outgoing transition for a given symbol?</strong>
              <p className="text-slate-400 leading-relaxed m-0">
                In formal DFA definitions, δ must be total (defined for every (q, σ)). If an explicit transition is omitted in practice, the machine implicitly transitions to a dead/trap state, causing immediate rejection.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-indigo-300 block">Q3: How are unreachable and dead states defined?</strong>
              <p className="text-slate-400 leading-relaxed m-0">
                • <strong>Unreachable State:</strong> A state q for which no path exists from start state q₀.<br/>
                • <strong>Dead State:</strong> A state q from which no path exists to any accepting state in F.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-300">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            <span>Recommended 60-Second Demo Script for Viva</span>
          </div>
          <ol className="list-decimal pl-5 text-slate-300 space-y-1.5 leading-relaxed">
            <li>Load preset <strong>"Binary strings ending in 01"</strong> from top navbar.</li>
            <li>Enter input string <code className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-300 font-mono">1101</code> and click <strong>Run</strong>.</li>
            <li>Observe active node glowing cyan, path highlighting, and final <strong>✓ ACCEPTED</strong> status.</li>
            <li>Enter input string <code className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-300 font-mono">1100</code> to show immediate <strong>✕ REJECTED</strong> status.</li>
            <li>Switch to <strong>Transition Table</strong> tab to demonstrate the transition matrix δ(q, a).</li>
            <li>Switch to <strong>Analysis</strong> tab to show reachability graph and structural validation.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
