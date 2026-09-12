import { AlertTriangle, CheckCircle2, Info, ArrowUpDown } from 'lucide-react';
import type { ValidationResult } from '@/types';

interface Props {
  validation: ValidationResult;
  onRearrange?: () => void;
}

export default function ValidationBanner({ validation, onRearrange }: Props) {
  const { isDiagonallyDominant, rowDetails, canRearrange, rearrangedIndices } = validation;

  if (isDiagonallyDominant) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Matrix is Diagonally Dominant</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Convergence is guaranteed. The Gauss-Seidel method will converge to the solution.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {rowDetails.map((r) => (
              <span
                key={r.row}
                className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium"
              >
                Row {r.row + 1}: |{r.diagonalAbs.toFixed(2)}| &gt; {r.otherSum.toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-800">Matrix is NOT Diagonally Dominant</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Convergence is not guaranteed. The method may still converge, but it could also diverge.
          You can still run the calculation to observe the behavior.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {rowDetails.map((r) => (
            <span
              key={r.row}
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                r.isDominant
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              Row {r.row + 1}: |{r.diagonalAbs.toFixed(2)}| {r.isDominant ? '>' : '≤'} {r.otherSum.toFixed(2)}
            </span>
          ))}
        </div>
        {canRearrange && rearrangedIndices && (
          <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-100 rounded-lg p-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              A diagonally dominant arrangement exists by reordering rows to: {rearrangedIndices.map((i) => `Row ${i + 1}`).join(' → ')}.
              Consider reordering your equations for guaranteed convergence.
            </span>
            {onRearrange && (
              <button
                onClick={onRearrange}
                className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-md transition-colors flex-shrink-0"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Rearrange Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
