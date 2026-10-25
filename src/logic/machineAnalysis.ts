import type { FSMMachine, MachineAnalysisResult, ValidationIssue } from '../types/machine';

export function analyzeMachine(machine: FSMMachine): MachineAnalysisResult {
  const issues: ValidationIssue[] = [];

  const alphabetSet = new Set<string>();
  machine.transitions.forEach((t) => {
    t.symbols.forEach((sym) => {
      if (sym.trim() !== '') {
        alphabetSet.add(sym.trim());
      }
    });
  });
  const alphabet = Array.from(alphabetSet).sort();

  const initialState = machine.states.find((s) => s.id === machine.initialStateId) || null;
  const acceptingStates = machine.states.filter((s) => machine.acceptingStateIds.includes(s.id));

  if (!initialState) {
    issues.push({
      id: 'no-initial-state',
      type: 'error',
      message: 'No initial state defined for this finite state machine.',
    });
  }

  if (acceptingStates.length === 0) {
    issues.push({
      id: 'no-accepting-state',
      type: 'warning',
      message: 'No accepting states defined. Machine will reject all non-empty inputs.',
    });
  }

  const reachableSet = new Set<string>();
  if (initialState) {
    const queue: string[] = [initialState.id];
    reachableSet.add(initialState.id);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const outgoing = machine.transitions.filter((t) => t.source === curr);
      outgoing.forEach((t) => {
        if (!reachableSet.has(t.target)) {
          reachableSet.add(t.target);
          queue.push(t.target);
        }
      });
    }
  }

  const reachableStateIds = Array.from(reachableSet);
  const unreachableStateIds = machine.states
    .filter((s) => !reachableSet.has(s.id))
    .map((s) => s.id);

  unreachableStateIds.forEach((id) => {
    const st = machine.states.find((s) => s.id === id);
    issues.push({
      id: `unreachable-${id}`,
      type: 'warning',
      message: `State "${st?.name || id}" is unreachable from the initial state.`,
      stateId: id,
    });
  });

  const canReachAcceptingSet = new Set<string>();
  const reverseAdj: Record<string, string[]> = {};

  machine.states.forEach((s) => {
    reverseAdj[s.id] = [];
  });

  machine.transitions.forEach((t) => {
    if (reverseAdj[t.target]) {
      reverseAdj[t.target].push(t.source);
    }
  });

  const acceptQueue: string[] = [];
  acceptingStates.forEach((s) => {
    canReachAcceptingSet.add(s.id);
    acceptQueue.push(s.id);
  });

  while (acceptQueue.length > 0) {
    const curr = acceptQueue.shift()!;
    const incomingSources = reverseAdj[curr] || [];
    incomingSources.forEach((src) => {
      if (!canReachAcceptingSet.has(src)) {
        canReachAcceptingSet.add(src);
        acceptQueue.push(src);
      }
    });
  }

  const deadStateIds = machine.states
    .filter((s) => !canReachAcceptingSet.has(s.id))
    .map((s) => s.id);

  deadStateIds.forEach((id) => {
    const st = machine.states.find((s) => s.id === id);
    issues.push({
      id: `dead-${id}`,
      type: 'warning',
      message: `State "${st?.name || id}" is a dead-end state (cannot reach any accepting state).`,
      stateId: id,
    });
  });

  let isDeterministic = true;
  let nondeterministicReason = '';

  machine.states.forEach((state) => {
    const symbolMap: Record<string, string[]> = {};

    const outgoing = machine.transitions.filter((t) => t.source === state.id);
    outgoing.forEach((t) => {
      t.symbols.forEach((sym) => {
        if (!symbolMap[sym]) symbolMap[sym] = [];
        symbolMap[sym].push(t.target);
      });
    });

    Object.entries(symbolMap).forEach(([sym, targets]) => {
      if (targets.length > 1) {
        isDeterministic = false;
        nondeterministicReason = `State "${state.name}" has multiple transitions for symbol '${sym}'.`;
        issues.push({
          id: `nfa-multi-${state.id}-${sym}`,
          type: 'warning',
          message: `Non-deterministic: State "${state.name}" has ${targets.length} transitions for symbol '${sym}'.`,
          stateId: state.id,
        });
      }
    });

    if (alphabet.length > 0) {
      const missingSymbols = alphabet.filter((sym) => !symbolMap[sym] || symbolMap[sym].length === 0);
      if (missingSymbols.length > 0) {
        issues.push({
          id: `incomplete-${state.id}`,
          type: 'info',
          message: `State "${state.name}" missing explicit transitions for symbol(s): [${missingSymbols.join(', ')}].`,
          stateId: state.id,
        });
      }
    }
  });

  return {
    stateCount: machine.states.length,
    transitionCount: machine.transitions.length,
    initialState,
    acceptingStates,
    alphabet,
    reachableStateIds,
    unreachableStateIds,
    deadStateIds,
    isDeterministic,
    nondeterministicReason: nondeterministicReason || undefined,
    issues,
  };
}
