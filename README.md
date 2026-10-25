# StateSmith – Interactive Finite-State-Machine Design & Simulation Studio

StateSmith is an interactive web-based studio for designing, visualizing, analyzing, and simulating Finite-State Machines (FSMs). It provides a visual environment for creating states and transitions, testing input sequences, and understanding machine behavior.

## Features

- **Visual FSM Designer:** Create and connect states and transitions using an interactive canvas.
- **Machine Simulation:** Execute input sequences and observe state transitions step by step.
- **Machine Analysis:** Inspect machine properties and analyze its structure.
- **Transition Table:** View the machine's transitions in a structured tabular format.
- **Example Machines:** Explore predefined FSM examples to understand different machine designs.
- **Import and Export:** Use the available import/export functionality to save or load machine definitions.
- **Validation:** Check machine definitions for structural or configuration issues.
- **Simulation Trace:** Follow execution history to understand how the machine processes inputs.

## Tech Stack

- React
- TypeScript
- Vite
- React Flow (`@xyflow/react`, if used in the project)
- CSS

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dheeresh47/statesmith.git
   ```

2. Navigate to the project directory:

   ```bash
   cd statesmith
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal.

## Build

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── AnalysisPanel/
│   ├── Canvas/
│   ├── ExampleMachines/
│   ├── HelpModal/
│   ├── ImportExport/
│   ├── SimulationPanel/
│   ├── Toolbar/
│   └── TransitionTable/
├── data/
├── logic/
└── types/
```

- `components/` — User interface components for designing, analyzing, and simulating machines.
- `data/` — Example machine definitions.
- `logic/` — Simulation, validation, analysis, and serialization logic.
- `types/` — TypeScript types for machine definitions.

## Purpose

StateSmith brings FSM design and execution into one interactive environment, making it easier to experiment with state-based systems, inspect transitions, and understand machine behavior.

## Future Enhancements

Potential improvements include support for additional automata models, enhanced machine analysis, and exporting simulation traces for documentation and testing.
