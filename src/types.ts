export interface MatrixConfig {
  size: number;
  coefficients: number[][];
  constants: number[];
  initialGuesses: number[];
  maxIterations: number;
  precision: number;
  tolerance: number;
  useTolerance: boolean;
}

export interface SubStep {
  iteration: number;
  variableIndex: number;
  variableName: string;
  formula: string;
  computedValue: number;
  previousValue: number;
  currentValues: number[];
  isNewlyComputed: boolean;
  updatedThisIteration: Set<number>;
}

export interface IterationRow {
  iteration: number;
  values: number[];
  subSteps: SubStep[];
}

export interface ValidationResult {
  isDiagonallyDominant: boolean;
  rowDetails: {
    row: number;
    diagonalAbs: number;
    otherSum: number;
    isDominant: boolean;
  }[];
  canRearrange: boolean;
  rearrangedIndices: number[] | null;
}

export interface SolveResult {
  iterations: IterationRow[];
  finalValues: number[];
  converged: boolean;
  convergenceIteration: number | null;
  validation: ValidationResult;
  maxPossibleError: number | null;
}
