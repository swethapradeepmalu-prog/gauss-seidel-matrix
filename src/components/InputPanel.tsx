import { useState } from 'react';
import { Play, RotateCcw, Settings, Sliders } from 'lucide-react';
import type { MatrixConfig } from '@/types';
import { resizeConfig } from '@/lib/gaussSeidel';

interface Props {
  config: MatrixConfig;
  onConfigChange: (config: MatrixConfig) => void;
  onSolve: () => void;
  onReset: () => void;
}

export default function InputPanel({ config, onConfigChange, onSolve, onReset }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const { size, coefficients, constants, initialGuesses, maxIterations, precision, tolerance, useTolerance } = config;

  const updateCoeff = (row: number, col: number, value: string) => {
    const num = parseFloat(value);
    const newCoeffs = coefficients.map((r) => [...r]);
    newCoeffs[row][col] = isNaN(num) ? 0 : num;
    onConfigChange({ ...config, coefficients: newCoeffs });
  };

  const updateConstant = (row: number, value: string) => {
    const num = parseFloat(value);
    const newConstants = [...constants];
    newConstants[row] = isNaN(num) ? 0 : num;
    onConfigChange({ ...config, constants: newConstants });
  };

  const updateGuess = (index: number, value: string) => {
    const num = parseFloat(value);
    const newGuesses = [...initialGuesses];
    newGuesses[index] = isNaN(num) ? 0 : num;
    onConfigChange({ ...config, initialGuesses: newGuesses });
  };

  const handleSizeChange = (newSize: number) => {
    onConfigChange(resizeConfig(config, newSize));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-300" />
          System Configuration
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-300 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          <Sliders className="w-4 h-4" />
          {showSettings ? 'Hide' : 'Show'} Settings
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Matrix Size Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Matrix Size:</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleSizeChange(n)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  size === n
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n}x{n}
              </button>
            ))}
          </div>
        </div>

        {/* Coefficient Matrix + Constants */}
        <div>
          <p className="text-sm font-medium text-slate-600 mb-3">
            Coefficient Matrix <span className="text-slate-400">[A]</span> and Constants Vector <span className="text-slate-400">[B]</span>
          </p>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: size }, (_, j) => (
                    <th key={j} className="px-2 pb-2 text-xs font-medium text-slate-400 text-center">
                      x{j + 1}
                    </th>
                  ))}
                  <th className="px-3 pb-2" />
                  <th className="px-2 pb-2 text-xs font-medium text-slate-400 text-center">b</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: size }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: size }, (_, j) => (
                      <td key={j} className="p-0.5">
                        <input
                          type="number"
                          value={coefficients[i][j]}
                          onChange={(e) => updateCoeff(i, j, e.target.value)}
                          className={`w-16 text-center text-sm py-1.5 rounded border focus:ring-2 focus:outline-none transition-all ${
                            i === j
                              ? 'border-slate-400 bg-slate-50 font-semibold text-slate-800 focus:border-slate-600 focus:ring-slate-200'
                              : 'border-slate-200 bg-white text-slate-700 focus:border-slate-400 focus:ring-slate-100'
                          }`}
                        />
                      </td>
                    ))}
                    <td className="px-3 text-slate-300 text-xl">|</td>
                    <td className="p-0.5">
                      <input
                        type="number"
                        value={constants[i]}
                        onChange={(e) => updateConstant(i, e.target.value)}
                        className="w-16 text-center text-sm py-1.5 rounded border border-slate-300 bg-blue-50 text-slate-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Diagonal cells are highlighted. The system is: A&middot;x = B
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4 border border-slate-200">
            {/* Initial Guesses */}
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Initial Guesses</p>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: size }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-medium">x{i + 1} =</label>
                    <input
                      type="number"
                      value={initialGuesses[i]}
                      onChange={(e) => updateGuess(i, e.target.value)}
                      className="w-20 text-center text-sm py-1.5 rounded border border-slate-300 bg-white text-slate-700 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Max Iterations */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-600">Maximum Iterations</label>
                <span className="text-sm font-semibold text-slate-800 tabular-nums">{maxIterations}</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={maxIterations}
                onChange={(e) => onConfigChange({ ...config, maxIterations: parseInt(e.target.value) })}
                className="w-full accent-slate-700 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>1</span>
                <span>30</span>
              </div>
            </div>

            {/* Decimal Precision */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Decimal Precision</label>
              <select
                value={precision}
                onChange={(e) => onConfigChange({ ...config, precision: parseInt(e.target.value) })}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
              >
                {[2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={p}>{p} decimal places</option>
                ))}
              </select>
            </div>

            {/* Tolerance */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
                <input
                  type="checkbox"
                  checked={useTolerance}
                  onChange={(e) => onConfigChange({ ...config, useTolerance: e.target.checked })}
                  className="accent-slate-700 w-4 h-4 rounded"
                />
                Stop on convergence (tolerance)
              </label>
              {useTolerance && (
                <select
                  value={tolerance}
                  onChange={(e) => onConfigChange({ ...config, tolerance: parseFloat(e.target.value) })}
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
                >
                  <option value={0.1}>1e-1 (0.1)</option>
                  <option value={0.01}>1e-2 (0.01)</option>
                  <option value={0.001}>1e-3 (0.001)</option>
                  <option value={0.0001}>1e-4 (0.0001)</option>
                  <option value={0.00001}>1e-5 (0.00001)</option>
                  <option value={0.000001}>1e-6 (0.000001)</option>
                </select>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onSolve}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Play className="w-4 h-4" />
            Solve System
          </button>
          <button
            onClick={onReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}


