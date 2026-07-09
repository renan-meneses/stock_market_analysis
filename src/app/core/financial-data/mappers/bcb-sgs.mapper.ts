import { MacroeconomicIndicator, MacroeconomicIndicatorType, MacroeconomicDataPoint } from '../models/macroeconomic-indicator.model';

export interface BcbSgsResponseItem {
  data: string;
  valor: string;
}

const INDICATOR_NAMES: Record<MacroeconomicIndicatorType, string> = {
  SELIC: 'Selic',
  IPCA: 'IPCA',
};

function parseBcbDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

export function mapBcbSgsResponse(
  type: MacroeconomicIndicatorType,
  seriesCode: number,
  items: BcbSgsResponseItem[]
): MacroeconomicIndicator {
  const now = new Date().toISOString();
  const history: MacroeconomicDataPoint[] = items.map(item => ({
    date: parseBcbDate(item.data),
    value: parseFloat(item.valor) || 0,
  }));

  history.sort((a, b) => a.date.localeCompare(b.date));

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : undefined;

  return {
    type,
    name: INDICATOR_NAMES[type],
    seriesCode,
    latestValue: latest?.value || 0,
    previousValue: previous?.value,
    absoluteChange: latest && previous ? latest.value - previous.value : undefined,
    percentageChange: latest && previous && previous.value !== 0
      ? ((latest.value - previous.value) / previous.value) * 100
      : undefined,
    referenceDate: latest?.date || '',
    history,
    synchronizedAt: now,
  };
}
