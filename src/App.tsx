import { useState } from 'react';
import { Sigma, BookOpen } from 'lucide-react';
import InputPanel from '@/components/InputPanel';
import ValidationBanner from '@/components/ValidationBanner';
import SystemSummary from '@/components/SystemSummary';
import SolutionBlock from '@/components/SolutionBlock';
import IterationTable from '@/components/IterationTable';
import type { MatrixConfig, SolveResult } from '@/types';
import { solveGaussSeidel, getDefaultConfig, validateMatrix } from '@/lib/gaussSeidel';

export default function App() {
  const [config, setConfig] = useState<MatrixConfig>(() => getDefaultConfig(3));
  const [result, setResult] = useState<SolveResult | null>(null);
  const [validation, setValidation] = useState(() => validateMatrix(config.coefficients, config.size));

  const handleSolve = () => {
    const v = validateMatrix(config.coefficients, config.size);
    setValidation(v);
    const res = solveGaussSeidel(config);
    setResult(res);
  };

  const handleReset = () => {
    const fresh = getDefaultConfig(config.size);
    setConfig(fresh);
    setValidation(validateMatrix(fresh.coefficients, fresh.size));
    setResult(null);
  };

  const handleRearrange = () => {
    if (!validation.rearrangedIndices) return;
    const newOrder = validation.rearrangedIndices;
    const newCoeffs = newOrder.map((i) => [...config.coefficients[i]]);
    const newConstants = newOrder.map((i) => config.constants[i]);
    const newConfig = { ...config, coefficients: newCoeffs, constants: newConstants };
    setConfig(newConfig);
    setValidation(validateMatrix(newCoeffs, config.size));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 rounded-xl p-2">
              <Sigma className="w-7 h-7 text-slate-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Gauss-Seidel Matrix Calculator</h1>
              <p className="text-sm text-slate-400">Step-by-step iterative solver for systems of linear equations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Info Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            The <strong>Gauss-Seidel method</strong> solves Ax = B by iteratively updating each variable
            using the <em>latest computed values</em> within the same iteration. Unlike the Jacobi method,
            each variable immediately uses the freshest results — making convergence faster when the matrix
            is diagonally dominant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-2">
            <InputPanel config={config} onConfigChange={setConfig} onSolve={handleSolve} onReset={handleReset} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Validation */}
            <ValidationBanner validation={validation} onRearrange={handleRearrange} />

            {/* System Summary */}
            <SystemSummary config={config} />

            {/* Results */}
            {result && (
              <>
                <SolutionBlock
                  finalValues={result.finalValues}
                  converged={result.converged}
                  convergenceIteration={result.convergenceIteration}
                  precision={config.precision}
                />
                <IterationTable
                  iterations={result.iterations}
                  size={config.size}
                  precision={config.precision}
                />
              </>
            )}

            {!result && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                <Sigma className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">
                  Configure your system and click <span className="font-medium text-slate-600">Solve System</span> to see the step-by-step iteration history.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pt-4 pb-2">
          BTech CSE Numerical Methods Assignment &middot; Gauss-Seidel Iterative Method
        </footer>
      </main>
    </div>
  );
}
