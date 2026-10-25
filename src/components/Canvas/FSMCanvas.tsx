import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  MarkerType,
  BackgroundVariant,
  Panel,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import { StateNode, type StateNodeData } from './StateNode';
import { CustomEdge, type CustomEdgeData } from './CustomEdge';
import type { FSMMachine, FSMState, FSMTransition } from '../../types/machine';
import { Plus, Sparkles } from 'lucide-react';

interface FSMCanvasProps {
  machine: FSMMachine;
  onUpdateMachine: (updated: FSMMachine) => void;
  activeStateId: string | null;
  activeTransitionId: string | null;
  isRejectedState?: boolean;
}

export const FSMCanvas: React.FC<FSMCanvasProps> = ({
  machine,
  onUpdateMachine,
  activeStateId,
  activeTransitionId,
  isRejectedState = false,
}) => {
  const nodeTypes: NodeTypes = useMemo(() => ({ stateNode: StateNode as any }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ customEdge: CustomEdge as any }), []);

  const [symbolModalEdge, setSymbolModalEdge] = useState<{ source: string; target: string } | null>(null);
  const [modalSymbolInput, setModalSymbolInput] = useState('0');

  const nodes: Node[] = useMemo(() => {
    return machine.states.map((st) => {
      const nodeData: StateNodeData = {
        name: st.name,
        isInitial: st.id === machine.initialStateId,
        isAccepting: machine.acceptingStateIds.includes(st.id),
        isActive: activeStateId === st.id,
        isRejectedState: activeStateId === st.id && isRejectedState,
        onSetInitial: (id) => {
          onUpdateMachine({
            ...machine,
            initialStateId: id,
          });
        },
        onToggleAccepting: (id) => {
          const exists = machine.acceptingStateIds.includes(id);
          const updated = exists
            ? machine.acceptingStateIds.filter((a) => a !== id)
            : [...machine.acceptingStateIds, id];
          onUpdateMachine({
            ...machine,
            acceptingStateIds: updated,
          });
        },
        onRename: (id, newName) => {
          onUpdateMachine({
            ...machine,
            states: machine.states.map((s) => (s.id === id ? { ...s, name: newName } : s)),
          });
        },
        onDelete: (id) => {
          onUpdateMachine({
            ...machine,
            states: machine.states.filter((s) => s.id !== id),
            transitions: machine.transitions.filter((t) => t.source !== id && t.target !== id),
            initialStateId: machine.initialStateId === id ? null : machine.initialStateId,
            acceptingStateIds: machine.acceptingStateIds.filter((a) => a !== id),
          });
        },
      };

      return {
        id: st.id,
        type: 'stateNode',
        position: { x: st.x, y: st.y },
        data: nodeData,
      };
    });
  }, [machine, activeStateId, isRejectedState, onUpdateMachine]);

  const transitionPairsMap = useMemo(() => {
    const map = new Set<string>();
    machine.transitions.forEach((t) => {
      map.add(`${t.source}->${t.target}`);
    });
    return map;
  }, [machine.transitions]);

  const edges: Edge[] = useMemo(() => {
    return machine.transitions.map((tr) => {
      const isBiDirectional =
        tr.source !== tr.target && transitionPairsMap.has(`${tr.target}->${tr.source}`);
      const isActive = activeTransitionId === tr.id;

      const edgeData: CustomEdgeData = {
        symbols: tr.symbols,
        isActive,
        isBiDirectional,
        onEditSymbols: (edgeId, newSymbols) => {
          onUpdateMachine({
            ...machine,
            transitions: machine.transitions.map((t) => (t.id === edgeId ? { ...t, symbols: newSymbols } : t)),
          });
        },
        onDeleteEdge: (edgeId) => {
          onUpdateMachine({
            ...machine,
            transitions: machine.transitions.filter((t) => t.id !== edgeId),
          });
        },
      };

      return {
        id: tr.id,
        source: tr.source,
        target: tr.target,
        type: 'customEdge',
        data: edgeData,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: isActive ? '#38bdf8' : '#64748b',
        },
      };
    });
  }, [machine, activeTransitionId, transitionPairsMap, onUpdateMachine]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          const updatedStates = machine.states.map((st) =>
            st.id === change.id ? { ...st, x: change.position!.x, y: change.position!.y } : st
          );
          onUpdateMachine({
            ...machine,
            states: updatedStates,
          });
        }
      });
    },
    [machine, onUpdateMachine]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          onUpdateMachine({
            ...machine,
            transitions: machine.transitions.filter((t) => t.id !== change.id),
          });
        }
      });
    },
    [machine, onUpdateMachine]
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const existing = machine.transitions.find(
        (t) => t.source === params.source && t.target === params.target
      );

      if (existing) {
        setSymbolModalEdge({ source: params.source, target: params.target });
        setModalSymbolInput(existing.symbols.join(', '));
      } else {
        setSymbolModalEdge({ source: params.source, target: params.target });
        setModalSymbolInput('0');
      }
    },
    [machine]
  );

  const handleConfirmAddTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbolModalEdge) return;

    const parsedSymbols = modalSymbolInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalSymbols = parsedSymbols.length > 0 ? parsedSymbols : ['0'];
    const { source, target } = symbolModalEdge;

    const existingIndex = machine.transitions.findIndex((t) => t.source === source && t.target === target);

    let newTransitions = [...machine.transitions];

    if (existingIndex >= 0) {
      newTransitions[existingIndex] = {
        ...newTransitions[existingIndex],
        symbols: Array.from(new Set([...newTransitions[existingIndex].symbols, ...finalSymbols])),
      };
    } else {
      const newTr: FSMTransition = {
        id: `t-${source}-${target}-${Date.now().toString().slice(-4)}`,
        source,
        target,
        symbols: finalSymbols,
      };
      newTransitions.push(newTr);
    }

    onUpdateMachine({
      ...machine,
      transitions: newTransitions,
    });

    setSymbolModalEdge(null);
  };

  const handleAddState = () => {
    const nextIndex = machine.states.length;
    const name = `q${nextIndex}`;
    const id = `q${Date.now().toString().slice(-4)}`;
    const isInitial = machine.states.length === 0;

    const newState: FSMState = {
      id,
      name,
      x: 200 + (nextIndex % 4) * 120,
      y: 200 + Math.floor(nextIndex / 4) * 100,
      isInitial,
      isAccepting: false,
    };

    onUpdateMachine({
      ...machine,
      states: [...machine.states, newState],
      initialStateId: isInitial ? id : machine.initialStateId,
    });
  };

  return (
    <div className="w-full h-full relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: 'customEdge' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls position="bottom-left" />

        <Panel position="top-right">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">Drag handles to connect transitions • Click state for options</span>
          </div>
        </Panel>

        {machine.states.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 backdrop-blur-xs z-10">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">Canvas is Empty</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              Add your first state or load a preset machine to start simulating.
            </p>
            <button
              onClick={handleAddState}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add State (q0)
            </button>
          </div>
        )}
      </ReactFlow>

      {symbolModalEdge && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150">
          <form
            onSubmit={handleConfirmAddTransition}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-80 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-semibold text-slate-200">Set Transition Symbols</h4>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {machine.states.find((s) => s.id === symbolModalEdge.source)?.name} →{' '}
                {machine.states.find((s) => s.id === symbolModalEdge.target)?.name}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Input Symbol(s) <span className="text-slate-500">(comma-separated)</span>
              </label>
              <input
                type="text"
                autoFocus
                value={modalSymbolInput}
                onChange={(e) => setModalSymbolInput(e.target.value)}
                placeholder="e.g. 0, 1 or a, b"
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-indigo-200 text-sm font-mono rounded-lg px-3 py-2 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Multiple symbols will all trigger this transition.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSymbolModalEdge(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md transition-colors"
              >
                Add Transition
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
