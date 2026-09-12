import type {
  MatrixConfig,
  SolveResult,
  IterationRow,
  SubStep,
  ValidationResult,
} from '@/types';

export function validateMatrix(
  coefficients: number[][],
  size: number
): ValidationResult {
  const rowDetails = [];
  let allDominant = true;

  for (let i = 0; i < size; i++) {
    const diagAbs = Math.abs(coefficients[i][i]);
    let otherSum = 0;
    for (let j = 0; j < size; j++) {
      if (j !== i) otherSum += Math.abs(coefficients[i][j]);
    }
    const isDominant = diagAbs > otherSum;
    if (!isDominant) allDominant = false;
    rowDetails.push({ row: i, diagonalAbs: diagAbs, otherSum, isDominant });
  }

  // Try to find a rearrangement that makes it diagonally dominant
  const indices = Array.from({ length: size }, (_, i) => i);
  let rearranged: number[] | null = null;

  function tryPermute(arr: number[], from: number): boolean {
    if (from === arr.length) {
      // Check if this permutation is diagonally dominant
      for (let i = 0; i < size; i++) {
        const row = arr[i];
        const diagAbs = Math.abs(coefficients[row][i]);
        let otherSum = 0;
        for (let j = 0; j < size; j++) {
          if (j !== i) otherSum += Math.abs(coefficients[row][j]);
        }
        if (diagAbs <= otherSum) return false;
      }
      return true;
    }
    for (let i = from; i < arr.length; i++) {
      [arr[from], arr[i]] = [arr[i], arr[from]];
      if (tryPermute(arr, from + 1)) return true;
      [arr[from], arr[i]] = [arr[i], arr[from]];
    }
    return false;
  }

  const perm = [...indices];
  if (!allDominant && tryPermute(perm, 0)) {
    rearranged = [...perm];
  }

  return {
    isDiagonallyDominant: allDominant,
    rowDetails,
    canRearrange: rearranged !== null,
    rearrangedIndices: rearranged,
  };
}

function roundTo(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function formatNum(value: number, precision: number): string {
  return value.toFixed(precision);
}

export function solveGaussSeidel(config: MatrixConfig): SolveResult {
  const { size, coefficients, constants, initialGuesses, maxIterations, precision, tolerance, useTolerance } = config;
  const iterations: IterationRow[] = [];
  let currentValues = [...initialGuesses];
  let converged = false;
  let convergenceIteration: number | null = null;

  for (let iter = 0; iter < maxIterations; iter++) {
    const subSteps: SubStep[] = [];
    const valuesAtStart = [...currentValues];
    const updatedThisIteration = new Set<number>();

    for (let varIdx = 0; varIdx < size; varIdx++) {
      const prevVal = currentValues[varIdx];

      // Build the formula: x_i = (b_i - sum(a_ij * x_j for j != i)) / a_ii
      let sum = constants[varIdx];
      let formulaParts: string[] = [];

      for (let j = 0; j < size; j++) {
        if (j !== varIdx) {
          const coeff = coefficients[varIdx][j];
          const val = currentValues[j];
          sum -= coeff * val;
          const sign = coeff >= 0 ? '-' : '+';
          const absCoeff = Math.abs(coeff);
          formulaParts.push(`${sign} ${absCoeff.toFixed(precision)}*${formatNum(val, precision)}`);
        }
      }

      const diagCoeff = coefficients[varIdx][varIdx];
      const computedValue = roundTo(sum / diagCoeff, precision);

      // Build clean formula: x1 = (b1 - a12*x2 - a13*x3) / a11
      const cleanParts: string[] = [];
      for (let j = 0; j < size; j++) {
        if (j !== varIdx) {
          const coeff = coefficients[varIdx][j];
          const sign = coeff >= 0 ? '-' : '+';
          const absCoeff = Math.abs(coeff);
          cleanParts.push(`${sign} ${absCoeff.toFixed(precision)}*x${j + 1}`);
        }
      }
      const formula = `x${varIdx + 1} = (b${varIdx + 1} ${cleanParts.join(' ')}) / a${varIdx + 1}${varIdx + 1}`;

      currentValues[varIdx] = computedValue;
      updatedThisIteration.add(varIdx);

      subSteps.push({
        iteration: iter + 1,
        variableIndex: varIdx,
        variableName: `x${varIdx + 1}`,
        formula,
        computedValue,
        previousValue: prevVal,
        currentValues: [...currentValues],
        isNewlyComputed: true,
        updatedThisIteration: new Set(updatedThisIteration),
      });
    }

    // Check convergence
    let maxDiff = 0;
    for (let i = 0; i < size; i++) {
      const diff = Math.abs(currentValues[i] - valuesAtStart[i]);
      if (diff > maxDiff) maxDiff = diff;
    }

    iterations.push({
      iteration: iter + 1,
      values: [...currentValues],
      subSteps,
    });

    if (useTolerance && maxDiff < tolerance) {
      converged = true;
      convergenceIteration = iter + 1;
      break;
    }
  }

  return {
    iterations,
    finalValues: currentValues,
    converged,
    convergenceIteration,
    validation: validateMatrix(coefficients, size),
    maxPossibleError: null,
  };
}

export function getDefaultConfig(size: number): MatrixConfig {
  const coefficients: number[][] = [];
  const constants: number[] = [];
  const initialGuesses: number[] = [];

  // Default: a diagonally dominant 3x3 system
  if (size === 3) {
    coefficients.push([10, -1, 2]);
    coefficients.push([-1, 11, -1]);
    coefficients.push([2, -1, 10]);
    constants.push(7, -23, 15);
  } else {
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        if (i === j) row.push(size * 2);
        else row.push(i === j - 1 ? -1 : j === i - 1 ? -1 : 0);
      }
      coefficients.push(row);
      constants.push(i + 1);
    }
  }

  for (let i = 0; i < size; i++) initialGuesses.push(0);

  return {
    size,
    coefficients,
    constants,
    initialGuesses,
    maxIterations: 15,
    precision: 4,
    tolerance: 0.0001,
    useTolerance: true,
  };
}

export function resizeConfig(config: MatrixConfig, newSize: number): MatrixConfig {
  const coefficients: number[][] = [];
  const constants: number[] = [];
  const initialGuesses: number[] = [];

  for (let i = 0; i < newSize; i++) {
    const row: number[] = [];
    for (let j = 0; j < newSize; j++) {
      if (i < config.coefficients.length && j < config.coefficients[i].length) {
        row.push(config.coefficients[i][j]);
      } else if (i === j) {
        row.push(newSize * 2);
      } else {
        row.push(Math.abs(i - j) === 1 ? -1 : 0);
      }
    }
    coefficients.push(row);
    constants.push(i < config.constants.length ? config.constants[i] : i + 1);
    initialGuesses.push(i < config.initialGuesses.length ? config.initialGuesses[i] : 0);
  }

  return {
    ...config,
    size: newSize,
    coefficients,
    constants,
    initialGuesses,
  };
}
