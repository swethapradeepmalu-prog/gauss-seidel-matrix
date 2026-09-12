import type { MatrixConfig } from '@/types';

interface Props {
  config: MatrixConfig;
}

export default function SystemSummary({ config }: Props) {
  const { size, coefficients, constants } = config;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 px-6 py-3">
        <h3 className="text-sm font-semibold text-white">System of Linear Equations</h3>
      </div>
      <div className="p-5 space-y-3">
        {Array.from({ length: size }, (_, i) => {
          const terms: string[] = [];
          for (let j = 0; j < size; j++) {
            const c = coefficients[i][j];
            const sign = c >= 0 ? '+' : '-';
            const abs = Math.abs(c).toFixed(config.precision);
            if (j === 0) {
              terms.push(c >= 0 ? `${abs}x${j + 1}` : `-${abs}x${j + 1}`);
            } else {
              terms.push(`${sign} ${abs}x${j + 1}`);
            }
          }
          return (
            <div key={i} className="font-mono text-sm text-slate-700 bg-slate-50 rounded-lg px-4 py-2.5 flex items-center">
              <span className="text-slate-400 mr-2 text-xs">Eq {i + 1}:</span>
              <span>{terms.join(' ')} = {constants[i].toFixed(config.precision)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
