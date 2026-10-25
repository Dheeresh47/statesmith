import type { FSMMachine } from '../types/machine';
import { validateMachineStructure } from './validation';

export function exportMachineToJSON(machine: FSMMachine): string {
  const exportData = {
    name: "StateSmith FSM Export",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    initialStateId: machine.initialStateId,
    acceptingStateIds: machine.acceptingStateIds,
    states: machine.states.map((s) => ({
      id: s.id,
      name: s.name,
      x: Math.round(s.x),
      y: Math.round(s.y),
      isInitial: s.id === machine.initialStateId,
      isAccepting: machine.acceptingStateIds.includes(s.id),
    })),
    transitions: machine.transitions.map((t) => ({
      id: t.id,
      source: t.source,
      target: t.target,
      symbols: t.symbols,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export function importMachineFromJSON(jsonString: string): { machine: FSMMachine | null; error: string | null } {
  try {
    const parsed = JSON.parse(jsonString);
    const result = validateMachineStructure(parsed);

    if (!result.valid || !result.machine) {
      return { machine: null, error: result.message || 'Invalid machine schema.' };
    }

    return { machine: result.machine, error: null };
  } catch (e: any) {
    return { machine: null, error: `JSON Parse Error: ${e?.message || 'Invalid JSON format'}` };
  }
}
