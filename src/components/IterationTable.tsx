import { useState } from 'react';
import { ChevronDown, ChevronRight, Calculator } from 'lucide-react';
import type { IterationRow, SubStep } from '@/types';

interface Props {
  iterations: IterationRow[];
  size: number;
  precision: number;
}

export default function IterationTable({ iterations, size, precision }: Props) {
  const [expandedIters, setExpandedIters] = useState<Set<number>>(new Set([1]));

  const toggleIter = (iter: number) => {
    setExpandedIters((prev) => {
      const next = new Set(prev);
      if (next.has(iter)) next.delete(iter);
      else next.add(iter);
      return next;
    });
  };

  const expandAll = () => setExpandedIters(new Set(iterations.map((i) => i.iteration)));
  const collapseAll = () => setExpandedIters(new Set());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-slate-300" />
          Iteration History ({iterations.length} iterations)
        </h3>
        <div className="flex gap-2">
          <button onClick={expandAll} className="text-xs text-slate-300 hover:text-white transition-colors">
            Expand All
          </button>
          <span className="text-slate-600">|</span>
          <button onClick={collapseAll} className="text-xs text-slate-300 hover:text-white transition-colors">
            Collapse All
          </button>
        </div>
      </div>

      <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-4 text-xs">
        <span className="text-slate-400 font-medium">Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span>
          <span className="text-slate-600">Newly computed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></span>
          <span className="text-slate-600">Updated this iteration</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white border border-slate-200"></span>
          <span className="text-slate-600">Previous step</span>
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {iterations.map((iter) => {
          const expanded = expandedIters.has(iter.iteration);
          return (
            <div key={iter.iteration}>
              {/* Iteration Header Row */}
              <button
                onClick={() => toggleIter(iter.iteration)}
                className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-sm font-semibold text-slate-700">
                    Iteration {iter.iteration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {iter.values.map((v, i) => (
                    <span key={i} className="text-xs font-mono text-slate-500">
                      x{i + 1}=<span className="text-slate-700 font-medium">{v.toFixed(precision)}</span>
                    </span>
                  ))}
                </div>
              </button>

              {/* Expanded Sub-Steps */}
              {expanded && (
                <div className="px-6 pb-4 bg-slate-50/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-2 text-xs font-medium text-slate-400 w-40">Sub-Step</th>
                        {Array.from({ length: size }, (_, i) => (
                          <th key={i} className="text-center py-2 px-2 text-xs font-medium text-slate-400">
                            x{i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {iter.subSteps.map((step) => (
                        <SubStepRow key={step.variableIndex} step={step} size={size} precision={precision} />
                      ))}
                      {/* Final iteration summary row */}
                      <tr className="border-t-2 border-slate-200 bg-slate-100/60">
                        <td className="py-2.5 px-2 text-xs font-semibold text-slate-600">
                          End of Iteration {iter.iteration}
                        </td>
                        {iter.values.map((v, i) => (
                          <td key={i} className="text-center py-2.5 px-2 font-mono text-slate-700 font-medium">
                            {v.toFixed(precision)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  {/* Formula Display */}
                  <div className="mt-3 space-y-1.5">
                    {iter.subSteps.map((step) => (
                      <div key={step.variableIndex} className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-600 min-w-[60px]">{step.variableName}:</span>
                        <code className="font-mono text-slate-500 bg-white rounded px-2 py-1 border border-slate-200">
                          {step.formula}
                        </code>
                        <span className="text-slate-400">=</span>
                        <span className="font-mono font-semibold text-slate-800 bg-blue-50 px-2 py-0.5 rounded">
                          {step.computedValue.toFixed(precision)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubStepRow({ step, size, precision }: { step: SubStep; size: number; precision: number }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-2.5 px-2 text-xs text-slate-600">
        <span className="font-medium">Finding x{step.variableIndex + 1}</span>
        <span className="text-slate-400 ml-1">(iter {step.iteration})</span>
      </td>
      {Array.from({ length: size }, (_, i) => {
        const isComputed = i === step.variableIndex;
        const isUpdated = step.updatedThisIteration.has(i) && !isComputed;
        const val = step.currentValues[i];
        return (
          <td
            key={i}
            className={`text-center py-2.5 px-2 font-mono transition-colors ${
              isComputed
                ? 'bg-blue-100 text-slate-900 font-bold border-x border-blue-300'
                : isUpdated
                ? 'bg-emerald-50 text-slate-700'
                : 'text-slate-500'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>{val.toFixed(precision)}</span>
              <span className={`text-[10px] mt-0.5 ${
                isComputed
                  ? 'text-blue-600 font-semibold'
                  : isUpdated
                  ? 'text-emerald-600 font-medium'
                  : 'text-slate-400'
              }`}>
                {isComputed ? '(new)' : isUpdated ? '(updated)' : '(previous step)'}
              </span>
            </div>
          </td>
        );
      })}
    </tr>
  );
}
