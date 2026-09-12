import { useState } from 'react';
import { Copy, Check, Target } from 'lucide-react';

interface Props {
  finalValues: number[];
  converged: boolean;
  convergenceIteration: number | null;
  precision: number;
}

export default function SolutionBlock({ finalValues, converged, convergenceIteration, precision }: Props) {
  const [copied, setCopied] = useState(false);

  const solutionStr = finalValues.map((v, i) => `x${i + 1} = ${v.toFixed(precision)}`).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-300" />
          Final Approximated Solution
        </h3>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="px-6 pb-5">
        <div className="flex flex-wrap gap-3">
          {finalValues.map((v, i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg px-4 py-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-slate-400 font-medium">x{i + 1}</span>
              <span className="text-xl font-bold text-white tabular-nums mt-0.5">{v.toFixed(precision)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          {converged ? (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-medium">
              Converged at iteration {convergenceIteration}
            </span>
          ) : (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-medium">
              Did not converge within max iterations
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
