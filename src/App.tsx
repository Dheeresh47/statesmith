import React, { useState, useEffect } from 'react';
import type { FSMMachine, SimulationState, FSMState } from './types/machine';
import { PRESET_EXAMPLES, type MachineExample } from './data/examples';
import { initSimulation, stepForward } from './logic/simulator';

// Components
import { HeaderNavbar } from './components/Toolbar/HeaderNavbar';
import { ToolsPanel } from './components/Toolbar/ToolsPanel';
import { FSMCanvas } from './components/Canvas/FSMCanvas';
import { SimulationControlPanel } from './components/SimulationPanel/SimulationControlPanel';
import { SimulationTrace } from './components/SimulationPanel/SimulationTrace';
import { TransitionTableView } from './components/TransitionTable/TransitionTableView';
import { AnalysisView } from './components/AnalysisPanel/AnalysisView';

// Modals
import { ExamplesModal } from './components/ExampleMachines/ExamplesModal';
import { ImportExportModal } from './components/ImportExport/ImportExportModal';

// Icons
import { Table, Activity, History } from 'lucide-react';
import { clsx } from 'clsx';

export const App: React.FC = () => {
  const [currentExampleId, setCurrentExampleId] = useState<string>('binary-ending-01');
  const [machine, setMachine] = useState<FSMMachine>(PRESET_EXAMPLES[0].machine);

  const [simState, setSimState] = useState<SimulationState>(() =>
    initSimulation(PRESET_EXAMPLES[0].machine, PRESET_EXAMPLES[0].defaultInput)
  );

  const [bottomTab, setBottomTab] = useState<'table' | 'analysis' | 'trace'>('table');

  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);
  const [importExportModal, setImportExportModal] = useState<{ isOpen: boolean; mode: 'import' | 'export' }>({
    isOpen: false,
    mode: 'import',
  });

  useEffect(() => {
    if (simState.status !== 'running') return;

    const timer = setInterval(() => {
      setSimState((prevSim) => {
        const nextSim = stepForward(machine, prevSim);
        return nextSim;
      });
    }, simState.speedMs);

    return () => clearInterval(timer);
  }, [simState.status, simState.speedMs, machine]);

  const handleSelectExample = (example: MachineExample) => {
    setCurrentExampleId(example.id);
    setMachine(example.machine);
    setSimState(initSimulation(example.machine, example.defaultInput));
  };

  const handleUpdateMachine = (updated: FSMMachine) => {
    setMachine(updated);
    setSimState(initSimulation(updated, simState.inputString));
  };

  const handleAddState = () => {
    const nextIndex = machine.states.length;
    const name = `q${nextIndex}`;
    const id = `q${Date.now().toString().slice(-4)}`;
    const isInitial = machine.states.length === 0;

    const newState: FSMState = {
      id,
      name,
      x: 180 + (nextIndex % 4) * 140,
      y: 180 + Math.floor(nextIndex / 4) * 100,
      isInitial,
      isAccepting: false,
    };

    const updatedMachine: FSMMachine = {
      ...machine,
      states: [...machine.states, newState],
      initialStateId: isInitial ? id : machine.initialStateId,
    };

    handleUpdateMachine(updatedMachine);
  };

  const handleSetInitialState = (stateId: string) => {
    const updated = {
      ...machine,
      initialStateId: stateId,
    };
    handleUpdateMachine(updated);
  };

  const handleToggleAcceptingState = (stateId: string) => {
    const exists = machine.acceptingStateIds.includes(stateId);
    const updatedAccepting = exists
      ? machine.acceptingStateIds.filter((id) => id !== stateId)
      : [...machine.acceptingStateIds, stateId];

    const updated = {
      ...machine,
      acceptingStateIds: updatedAccepting,
    };
    handleUpdateMachine(updated);
  };

  const handleClearCanvas = () => {
    const emptyMachine: FSMMachine = {
      states: [],
      transitions: [],
      initialStateId: null,
      acceptingStateIds: [],
      alphabet: [],
    };
    setMachine(emptyMachine);
    setSimState(initSimulation(emptyMachine, ''));
  };

  const handleNewMachine = () => {
    const newMachine: FSMMachine = {
      states: [{ id: 'q0', name: 'q0', x: 250, y: 220, isInitial: true, isAccepting: false }],
      transitions: [],
      initialStateId: 'q0',
      acceptingStateIds: [],
      alphabet: [],
    };
    setMachine(newMachine);
    setSimState(initSimulation(newMachine, '101'));
  };

  const handleInputChange = (newInput: string) => {
    setSimState(initSimulation(machine, newInput));
  };

  const handleRunSim = () => {
    if (simState.status === 'accepted' || simState.status === 'rejected') {
      const reset = initSimulation(machine, simState.inputString);
      setSimState({ ...reset, status: 'running' });
    } else {
      setSimState((prev) => ({ ...prev, status: 'running' }));
    }
  };

  const handlePauseSim = () => {
    setSimState((prev) => ({ ...prev, status: 'paused' }));
  };

  const handleStepSim = () => {
    setSimState((prev) => stepForward(machine, prev));
  };

  const handleResetSim = () => {
    setSimState(initSimulation(machine, simState.inputString));
  };

  const handleSpeedChange = (speedMs: number) => {
    setSimState((prev) => ({ ...prev, speedMs }));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <HeaderNavbar
        onSelectExample={handleSelectExample}
        onNewMachine={handleNewMachine}
        onClearCanvas={handleClearCanvas}
        onOpenImport={() => setImportExportModal({ isOpen: true, mode: 'import' })}
        onOpenExport={() => setImportExportModal({ isOpen: true, mode: 'export' })}
        currentExampleId={currentExampleId}
      />

      <div className="flex-1 flex overflow-hidden">
        <ToolsPanel
          machine={machine}
          onAddState={handleAddState}
          onSetInitialState={handleSetInitialState}
          onToggleAcceptingState={handleToggleAcceptingState}
          onClearAll={handleClearCanvas}
        />

        <main className="flex-1 flex flex-col min-w-0 p-3 gap-3 overflow-hidden bg-slate-950">
          <div className="flex-1 min-h-[350px] relative">
            <FSMCanvas
              machine={machine}
              onUpdateMachine={handleUpdateMachine}
              activeStateId={simState.currentStateId}
              activeTransitionId={simState.activeTransitionId}
              isRejectedState={simState.status === 'rejected'}
            />
          </div>

          <div className="h-64 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-1.5 select-none">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBottomTab('table')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    bottomTab === 'table'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  <Table className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transition Table δ</span>
                </button>

                <button
                  onClick={() => setBottomTab('analysis')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    bottomTab === 'analysis'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>Machine Analysis</span>
                </button>

                <button
                  onClick={() => setBottomTab('trace')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    bottomTab === 'trace'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Execution Trace ({simState.history.length})</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500 hidden sm:block">
                Academic FSM Verification Engine
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {bottomTab === 'table' && <TransitionTableView machine={machine} />}
              {bottomTab === 'analysis' && <AnalysisView machine={machine} />}
              {bottomTab === 'trace' && (
                <SimulationTrace machine={machine} history={simState.history} />
              )}
            </div>
          </div>
        </main>

        <aside className="w-80 p-3 bg-slate-950 border-l border-slate-800 overflow-y-auto shrink-0">
          <SimulationControlPanel
            machine={machine}
            simState={simState}
            onInputChange={handleInputChange}
            onRun={handleRunSim}
            onPause={handlePauseSim}
            onStep={handleStepSim}
            onReset={handleResetSim}
            onSpeedChange={handleSpeedChange}
          />
        </aside>
      </div>

      <ExamplesModal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
        onSelectExample={handleSelectExample}
      />

      <ImportExportModal
        isOpen={importExportModal.isOpen}
        mode={importExportModal.mode}
        machine={machine}
        onClose={() => setImportExportModal({ isOpen: false, mode: 'import' })}
        onImportMachine={handleUpdateMachine}
      />
    </div>
  );
};

export default App;
