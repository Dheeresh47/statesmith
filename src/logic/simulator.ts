import type { FSMMachine, SimulationState, StepTrace } from '../types/machine';

export function initSimulation(machine: FSMMachine, inputString: string): SimulationState {
  const initialState = machine.states.find((s) => s.id === machine.initialStateId);

  if (!machine.initialStateId || !initialState) {
    return {
      inputString,
      currentIndex: 0,
      currentStateId: null,
      status: 'rejected',
      activeTransitionId: null,
      history: [],
      speedMs: 800,
      rejectionReason: 'No initial state defined for this machine.',
    };
  }

  if (inputString.trim().length === 0) {
    const isAccepted = machine.acceptingStateIds.includes(initialState.id);
    return {
      inputString: '',
      currentIndex: 0,
      currentStateId: initialState.id,
      status: isAccepted ? 'accepted' : 'rejected',
      activeTransitionId: null,
      history: [
        {
          stepIndex: 0,
          currentStateId: initialState.id,
          symbolProcessed: null,
          transitionId: null,
          nextStateId: null,
          remainingInput: 'ε (empty string)',
          isAccepted,
          reason: isAccepted
            ? `Empty string accepted at initial state "${initialState.name}".`
            : `Empty string rejected: initial state "${initialState.name}" is not an accepting state.`,
        },
      ],
      speedMs: 800,
      rejectionReason: isAccepted
        ? undefined
        : `Initial state "${initialState.name}" is not accepting for empty string.`,
    };
  }

  const initialTrace: StepTrace = {
    stepIndex: 0,
    currentStateId: initialState.id,
    symbolProcessed: null,
    transitionId: null,
    nextStateId: null,
    remainingInput: inputString,
    isAccepted: null,
  };

  return {
    inputString,
    currentIndex: 0,
    currentStateId: initialState.id,
    status: 'idle',
    activeTransitionId: null,
    history: [initialTrace],
    speedMs: 800,
  };
}

export function stepForward(machine: FSMMachine, state: SimulationState): SimulationState {
  if (state.status === 'accepted' || state.status === 'rejected') {
    return state;
  }

  const currentState = machine.states.find((s) => s.id === state.currentStateId);
  if (!currentState) {
    return {
      ...state,
      status: 'rejected',
      rejectionReason: 'Invalid simulation state: current state does not exist.',
    };
  }

  if (state.currentIndex >= state.inputString.length) {
    const isAccepted = machine.acceptingStateIds.includes(currentState.id);
    const finalStatus = isAccepted ? 'accepted' : 'rejected';
    const reason = isAccepted
      ? `String successfully processed. Ended in accepting state "${currentState.name}".`
      : `String processed. Machine halted in non-accepting state "${currentState.name}".`;

    return {
      ...state,
      status: finalStatus,
      activeTransitionId: null,
      rejectionReason: isAccepted ? undefined : reason,
      history: [
        ...state.history,
        {
          stepIndex: state.history.length,
          currentStateId: currentState.id,
          symbolProcessed: null,
          transitionId: null,
          nextStateId: currentState.id,
          remainingInput: 'ε (complete)',
          isAccepted,
          reason,
        },
      ],
    };
  }

  const currentSymbol = state.inputString[state.currentIndex];
  const remainingInput = state.inputString.slice(state.currentIndex + 1);

  const matchingTransition = machine.transitions.find(
    (t) => t.source === currentState.id && t.symbols.includes(currentSymbol)
  );

  if (!matchingTransition) {
    const reason = `No transition defined from state "${currentState.name}" on symbol '${currentSymbol}'.`;
    return {
      ...state,
      status: 'rejected',
      activeTransitionId: null,
      rejectionReason: reason,
      history: [
        ...state.history,
        {
          stepIndex: state.history.length,
          currentStateId: currentState.id,
          symbolProcessed: currentSymbol,
          transitionId: null,
          nextStateId: null,
          remainingInput: state.inputString.slice(state.currentIndex),
          isAccepted: false,
          reason,
        },
      ],
    };
  }

  const nextState = machine.states.find((s) => s.id === matchingTransition.target);
  if (!nextState) {
    return {
      ...state,
      status: 'rejected',
      rejectionReason: `Target state for transition does not exist.`,
    };
  }

  const nextIndex = state.currentIndex + 1;
  const isLastSymbol = nextIndex === state.inputString.length;

  let newStatus: SimulationState['status'] = 'running';
  let isAccepted: boolean | null = null;
  let reason: string | undefined = undefined;

  if (isLastSymbol) {
    const endStateAccepting = machine.acceptingStateIds.includes(nextState.id);
    newStatus = endStateAccepting ? 'accepted' : 'rejected';
    isAccepted = endStateAccepting;
    reason = endStateAccepting
      ? `Reached accepting state "${nextState.name}" on symbol '${currentSymbol}'.`
      : `Ended in non-accepting state "${nextState.name}" on symbol '${currentSymbol}'.`;
  }

  const newStepTrace: StepTrace = {
    stepIndex: state.history.length,
    currentStateId: currentState.id,
    symbolProcessed: currentSymbol,
    transitionId: matchingTransition.id,
    nextStateId: nextState.id,
    remainingInput: remainingInput || 'ε',
    isAccepted,
    reason,
  };

  return {
    ...state,
    currentIndex: nextIndex,
    currentStateId: nextState.id,
    activeTransitionId: matchingTransition.id,
    status: newStatus,
    rejectionReason: newStatus === 'rejected' ? reason : undefined,
    history: [...state.history, newStepTrace],
  };
}

export function runFullSimulation(machine: FSMMachine, inputString: string): { finalState: SimulationState; trace: StepTrace[] } {
  let simState = initSimulation(machine, inputString);
  let steps = 0;
  const maxSteps = inputString.length + 5;

  while ((simState.status === 'idle' || simState.status === 'running') && steps < maxSteps) {
    simState = stepForward(machine, simState);
    steps++;
  }

  return {
    finalState: simState,
    trace: simState.history,
  };
}
