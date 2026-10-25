export interface FSMState {
  id: string; // unique identifier, e.g. "q0"
  name: string; // display label, e.g. "q0"
  x: number;
  y: number;
  isInitial: boolean;
  isAccepting: boolean;
}

export interface FSMTransition {
  id: string; // e.g. "q0-q1-0"
  source: string; // source state id
  target: string; // target state id
  symbols: string[]; // input symbols triggering this transition, e.g. ["0", "1"]
}

export interface FSMMachine {
  states: FSMState[];
  transitions: FSMTransition[];
  initialStateId: string | null;
  acceptingStateIds: string[];
  alphabet: string[];
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'accepted' | 'rejected';

export interface StepTrace {
  stepIndex: number;
  currentStateId: string;
  symbolProcessed: string | null; // null for step 0
  transitionId: string | null;
  nextStateId: string | null;
  remainingInput: string;
  isAccepted: boolean | null;
  reason?: string;
}

export interface SimulationState {
  inputString: string;
  currentIndex: number;
  currentStateId: string | null;
  status: SimulationStatus;
  activeTransitionId: string | null;
  history: StepTrace[];
  speedMs: number;
  rejectionReason?: string;
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  stateId?: string;
  transitionId?: string;
}

export interface MachineAnalysisResult {
  stateCount: number;
  transitionCount: number;
  initialState: FSMState | null;
  acceptingStates: FSMState[];
  alphabet: string[];
  reachableStateIds: string[];
  unreachableStateIds: string[];
  deadStateIds: string[];
  isDeterministic: boolean;
  nondeterministicReason?: string;
  issues: ValidationIssue[];
}
