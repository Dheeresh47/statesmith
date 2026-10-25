import type { FSMMachine } from '../types/machine';

export interface MachineExample {
  id: string;
  name: string;
  description: string;
  defaultInput: string;
  acceptedInputsSample: string[];
  rejectedInputsSample: string[];
  machine: FSMMachine;
}

export const PRESET_EXAMPLES: MachineExample[] = [
  {
    id: 'binary-ending-01',
    name: 'Binary strings ending in "01"',
    description: 'Accepts any binary string (alphabet {0, 1}) that terminates with the pattern "01".',
    defaultInput: '1101',
    acceptedInputsSample: ['01', '101', '1101', '0001', '10101'],
    rejectedInputsSample: ['0', '1', '10', '100', '1110', '010'],
    machine: {
      initialStateId: 'q0',
      acceptingStateIds: ['q2'],
      alphabet: ['0', '1'],
      states: [
        { id: 'q0', name: 'q0', x: 150, y: 220, isInitial: true, isAccepting: false },
        { id: 'q1', name: 'q1', x: 400, y: 220, isInitial: false, isAccepting: false },
        { id: 'q2', name: 'q2', x: 650, y: 220, isInitial: false, isAccepting: true },
      ],
      transitions: [
        { id: 't-q0-q0', source: 'q0', target: 'q0', symbols: ['1'] },
        { id: 't-q0-q1', source: 'q0', target: 'q1', symbols: ['0'] },
        { id: 't-q1-q1', source: 'q1', target: 'q1', symbols: ['0'] },
        { id: 't-q1-q2', source: 'q1', target: 'q2', symbols: ['1'] },
        { id: 't-q2-q1', source: 'q2', target: 'q1', symbols: ['0'] },
        { id: 't-q2-q0', source: 'q2', target: 'q0', symbols: ['1'] },
      ],
    },
  },
  {
    id: 'binary-contains-101',
    name: 'Binary strings containing "101"',
    description: 'Accepts any binary string containing the substring "101" at least once.',
    defaultInput: '001011',
    acceptedInputsSample: ['101', '0101', '11010', '001011'],
    rejectedInputsSample: ['0', '1', '10', '010', '1100', '1111'],
    machine: {
      initialStateId: 'q0',
      acceptingStateIds: ['q3'],
      alphabet: ['0', '1'],
      states: [
        { id: 'q0', name: 'q0', x: 120, y: 220, isInitial: true, isAccepting: false },
        { id: 'q1', name: 'q1', x: 320, y: 220, isInitial: false, isAccepting: false },
        { id: 'q2', name: 'q2', x: 520, y: 220, isInitial: false, isAccepting: false },
        { id: 'q3', name: 'q3', x: 720, y: 220, isInitial: false, isAccepting: true },
      ],
      transitions: [
        { id: 't-q0-q0', source: 'q0', target: 'q0', symbols: ['0'] },
        { id: 't-q0-q1', source: 'q0', target: 'q1', symbols: ['1'] },
        { id: 't-q1-q1', source: 'q1', target: 'q1', symbols: ['1'] },
        { id: 't-q1-q2', source: 'q1', target: 'q2', symbols: ['0'] },
        { id: 't-q2-q0', source: 'q2', target: 'q0', symbols: ['0'] },
        { id: 't-q2-q3', source: 'q2', target: 'q3', symbols: ['1'] },
        { id: 't-q3-q3', source: 'q3', target: 'q3', symbols: ['0', '1'] },
      ],
    },
  },
  {
    id: 'even-number-ones',
    name: 'Binary strings with even number of 1s',
    description: 'Accepts binary strings containing an even number of "1" bits (including 0 ones).',
    defaultInput: '1010',
    acceptedInputsSample: ['0', '00', '11', '101', '1001', '1111'],
    rejectedInputsSample: ['1', '01', '10', '111', '0100'],
    machine: {
      initialStateId: 'qEven',
      acceptingStateIds: ['qEven'],
      alphabet: ['0', '1'],
      states: [
        { id: 'qEven', name: 'qEven', x: 220, y: 220, isInitial: true, isAccepting: true },
        { id: 'qOdd', name: 'qOdd', x: 520, y: 220, isInitial: false, isAccepting: false },
      ],
      transitions: [
        { id: 't-qEven-qEven', source: 'qEven', target: 'qEven', symbols: ['0'] },
        { id: 't-qEven-qOdd', source: 'qEven', target: 'qOdd', symbols: ['1'] },
        { id: 't-qOdd-qOdd', source: 'qOdd', target: 'qOdd', symbols: ['0'] },
        { id: 't-qOdd-qEven', source: 'qOdd', target: 'qEven', symbols: ['1'] },
      ],
    },
  },
  {
    id: 'turnstile-machine',
    name: 'Simple Turnstile Machine',
    description: 'Simulates a turnstile barrier. Coins unlock it; pushing locks it back.',
    defaultInput: 'Coin,Push,Coin,Push',
    acceptedInputsSample: ['Coin,Push', 'Coin,Coin,Push'],
    rejectedInputsSample: ['Push', 'Coin,Push,Push'],
    machine: {
      initialStateId: 'Locked',
      acceptingStateIds: ['Unlocked'],
      alphabet: ['Coin', 'Push'],
      states: [
        { id: 'Locked', name: 'Locked', x: 220, y: 220, isInitial: true, isAccepting: false },
        { id: 'Unlocked', name: 'Unlocked', x: 520, y: 220, isInitial: false, isAccepting: true },
      ],
      transitions: [
        { id: 't-Locked-Locked', source: 'Locked', target: 'Locked', symbols: ['Push'] },
        { id: 't-Locked-Unlocked', source: 'Locked', target: 'Unlocked', symbols: ['Coin'] },
        { id: 't-Unlocked-Unlocked', source: 'Unlocked', target: 'Unlocked', symbols: ['Coin'] },
        { id: 't-Unlocked-Locked', source: 'Unlocked', target: 'Locked', symbols: ['Push'] },
      ],
    },
  },
  {
    id: 'vending-machine',
    name: '15-Cent Coffee Vending Machine',
    description: 'Accepts 5c and 10c coins until 15c is collected, then vends coffee.',
    defaultInput: '5,10',
    acceptedInputsSample: ['5,10', '10,5', '5,5,5'],
    rejectedInputsSample: ['5', '10', '5,5'],
    machine: {
      initialStateId: '0c',
      acceptingStateIds: ['15c'],
      alphabet: ['5', '10'],
      states: [
        { id: '0c', name: '0¢', x: 120, y: 220, isInitial: true, isAccepting: false },
        { id: '5c', name: '5¢', x: 320, y: 150, isInitial: false, isAccepting: false },
        { id: '10c', name: '10¢', x: 320, y: 300, isInitial: false, isAccepting: false },
        { id: '15c', name: '15¢ (Vend)', x: 580, y: 220, isInitial: false, isAccepting: true },
      ],
      transitions: [
        { id: 't-0c-5c', source: '0c', target: '5c', symbols: ['5'] },
        { id: 't-0c-10c', source: '0c', target: '10c', symbols: ['10'] },
        { id: 't-5c-10c', source: '5c', target: '10c', symbols: ['5'] },
        { id: 't-5c-15c', source: '5c', target: '15c', symbols: ['10'] },
        { id: 't-10c-15c', source: '10c', target: '15c', symbols: ['5', '10'] },
        { id: 't-15c-0c', source: '15c', target: '0c', symbols: ['Reset'] },
      ],
    },
  },
];
