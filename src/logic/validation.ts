import type { FSMMachine, FSMState, FSMTransition } from '../types/machine';

export function parseSymbolsInput(rawInput: string): string[] {
  if (!rawInput) return [];
  return rawInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function isValidStateName(name: string, stateId: string, existingStates: FSMState[]): { valid: boolean; message?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, message: 'State name cannot be empty.' };
  }
  const duplicate = existingStates.find((s) => s.id !== stateId && s.name.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    return { valid: false, message: `A state named "${trimmed}" already exists.` };
  }
  return { valid: true };
}

export function validateMachineStructure(obj: any): { valid: boolean; message?: string; machine?: FSMMachine } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, message: 'Invalid JSON object: Root must be a JSON object.' };
  }

  if (!Array.isArray(obj.states)) {
    return { valid: false, message: 'Invalid JSON: "states" property must be an array.' };
  }

  if (!Array.isArray(obj.transitions)) {
    return { valid: false, message: 'Invalid JSON: "transitions" property must be an array.' };
  }

  const states: FSMState[] = [];
  const stateIds = new Set<string>();

  for (let i = 0; i < obj.states.length; i++) {
    const s = obj.states[i];
    if (!s || typeof s !== 'object' || typeof s.id !== 'string') {
      return { valid: false, message: `State at index ${i} is missing a valid string "id".` };
    }
    states.push({
      id: s.id,
      name: typeof s.name === 'string' ? s.name : s.id,
      x: typeof s.x === 'number' ? s.x : 100 + i * 120,
      y: typeof s.y === 'number' ? s.y : 150 + (i % 2) * 100,
      isInitial: Boolean(s.isInitial),
      isAccepting: Boolean(s.isAccepting),
    });
    stateIds.add(s.id);
  }

  const transitions: FSMTransition[] = [];
  for (let i = 0; i < obj.transitions.length; i++) {
    const t = obj.transitions[i];
    if (!t || typeof t !== 'object') {
      return { valid: false, message: `Transition at index ${i} is invalid.` };
    }
    if (typeof t.source !== 'string' || !stateIds.has(t.source)) {
      return { valid: false, message: `Transition at index ${i} references invalid source state "${t.source}".` };
    }
    if (typeof t.target !== 'string' || !stateIds.has(t.target)) {
      return { valid: false, message: `Transition at index ${i} references invalid target state "${t.target}".` };
    }

    let symbols: string[] = [];
    if (Array.isArray(t.symbols)) {
      symbols = t.symbols.map(String).map((s: string) => s.trim()).filter(Boolean);
    } else if (typeof t.symbols === 'string') {
      symbols = parseSymbolsInput(t.symbols);
    }

    transitions.push({
      id: typeof t.id === 'string' ? t.id : `t-${t.source}-${t.target}-${i}`,
      source: t.source,
      target: t.target,
      symbols,
    });
  }

  const initialFromState = states.find((s) => s.isInitial)?.id;
  const initialStateId = typeof obj.initialStateId === 'string'
    ? obj.initialStateId
    : typeof obj.initialState === 'string'
    ? obj.initialState
    : initialFromState || (states.length > 0 ? states[0].id : null);

  const acceptingFromStates = states.filter((s) => s.isAccepting).map((s) => s.id);
  const acceptingStateIds: string[] = Array.isArray(obj.acceptingStateIds)
    ? obj.acceptingStateIds.filter((id: any) => typeof id === 'string' && stateIds.has(id))
    : Array.isArray(obj.acceptingStates)
    ? obj.acceptingStates.filter((id: any) => typeof id === 'string' && stateIds.has(id))
    : acceptingFromStates;

  const alphabetSet = new Set<string>();
  transitions.forEach((t) => t.symbols.forEach((sym) => alphabetSet.add(sym)));
  const alphabet = Array.from(alphabetSet).sort();

  return {
    valid: true,
    machine: {
      states,
      transitions,
      initialStateId,
      acceptingStateIds,
      alphabet,
    },
  };
}
