import { CProgram, UnitId, ProgramCategory } from '../../types';
import { unit1Programs } from './unit1';
import { unit2Programs } from './unit2';
import { unit3Programs } from './unit3';
import { unit4Programs } from './unit4';
import { unit5Programs } from './unit5';

export const allCPrograms: CProgram[] = [
  ...unit1Programs,
  ...unit2Programs,
  ...unit3Programs,
  ...unit4Programs,
  ...unit5Programs,
];

export const getCProgramsByUnit = (unitId: UnitId): CProgram[] => {
  return allCPrograms.filter((p) => p.unitId === unitId);
};

export const getCProgramsByCategory = (category: ProgramCategory): CProgram[] => {
  return allCPrograms.filter((p) => p.category === category);
};

export const searchCPrograms = (query: string): CProgram[] => {
  const q = query.toLowerCase().trim();
  if (!q) return allCPrograms;
  return allCPrograms.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
  );
};

export interface CoverageStats {
  total: number;
  complete: number;
  partial: number;
  missing: number;
  byUnit: Record<UnitId, { total: number; complete: number; partial: number; missing: number }>;
}

export const getCoverageStats = (): CoverageStats => {
  const stats: CoverageStats = {
    total: allCPrograms.length,
    complete: 0,
    partial: 0,
    missing: 0,
    byUnit: {
      1: { total: 0, complete: 0, partial: 0, missing: 0 },
      2: { total: 0, complete: 0, partial: 0, missing: 0 },
      3: { total: 0, complete: 0, partial: 0, missing: 0 },
      4: { total: 0, complete: 0, partial: 0, missing: 0 },
      5: { total: 0, complete: 0, partial: 0, missing: 0 },
    },
  };

  allCPrograms.forEach((p) => {
    if (p.status === 'COMPLETE') {
      stats.complete++;
      stats.byUnit[p.unitId].complete++;
    } else if (p.status === 'PARTIAL') {
      stats.partial++;
      stats.byUnit[p.unitId].partial++;
    } else {
      stats.missing++;
      stats.byUnit[p.unitId].missing++;
    }
    stats.byUnit[p.unitId].total++;
  });

  return stats;
};
