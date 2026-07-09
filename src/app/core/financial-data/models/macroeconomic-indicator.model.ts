export type MacroeconomicIndicatorType = 'SELIC' | 'IPCA';

export interface MacroeconomicDataPoint {
  date: string;
  value: number;
}

export interface MacroeconomicIndicator {
  type: MacroeconomicIndicatorType;
  name: string;
  seriesCode: number;
  latestValue: number;
  previousValue?: number;
  absoluteChange?: number;
  percentageChange?: number;
  referenceDate: string;
  history: MacroeconomicDataPoint[];
  synchronizedAt: string;
}
