import { Period, OvulationLog } from '../types';
import { differenceInDays, addDays, parseISO, subDays } from 'date-fns';

export function calculatePrediction(periods: Period[]) {
  if (periods.length < 3) {
    return null;
  }

  const sortedPeriods = [...periods].sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const cycleLengths = [];
  for (let i = 1; i < sortedPeriods.length; i++) {
    const cycleLength = differenceInDays(
      parseISO(sortedPeriods[i].start_date),
      parseISO(sortedPeriods[i - 1].start_date)
    );
    cycleLengths.push(cycleLength);
  }

  const averageCycleLength = Math.round(
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  );

  const variance = cycleLengths.reduce(
    (sum, length) => sum + Math.pow(length - averageCycleLength, 2),
    0
  ) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);

  const maxAcceptableDeviation = 5;
  const confidenceLevel = Math.min(
    100,
    Math.max(
      0,
      100 * (1 - standardDeviation / (maxAcceptableDeviation * 2))
    )
  );

  const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
  const predictedDate = addDays(parseISO(lastPeriod.start_date), averageCycleLength);

  const zScore50 = 0.674;
  const zScore90 = 1.645;

  const margin50 = Math.ceil(zScore50 * standardDeviation);
  const margin90 = Math.ceil(zScore90 * standardDeviation);

  return {
    predictedDate,
    confidenceLevel,
    averageCycleLength,
    confidence50Lower: subDays(predictedDate, margin50),
    confidence50Upper: addDays(predictedDate, margin50),
    confidence90Lower: subDays(predictedDate, margin90),
    confidence90Upper: addDays(predictedDate, margin90),
  };
}

export function calculateOvulationPrediction(
  periods: Period[],
  ovulationLogs: OvulationLog[]
) {
  if (periods.length < 3) {
    return null;
  }

  const sortedPeriods = [...periods].sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const cycleLengths = [];
  for (let i = 1; i < sortedPeriods.length; i++) {
    const cycleLength = differenceInDays(
      parseISO(sortedPeriods[i].start_date),
      parseISO(sortedPeriods[i - 1].start_date)
    );
    cycleLengths.push(cycleLength);
  }

  const averageCycleLength =
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;

  let ovulationDayFromPeriod = 14;

  if (ovulationLogs.length >= 2) {
    const confirmedOvulations = ovulationLogs.filter(
      log => log.ovulation_test === 'positive' || log.cervical_mucus === 'egg-white'
    );

    if (confirmedOvulations.length >= 2) {
      const ovulationOffsets = confirmedOvulations
        .map(log => {
          const ovulationDate = parseISO(log.date);
          const nearestPeriod = sortedPeriods
            .filter(p => parseISO(p.start_date) <= ovulationDate)
            .sort((a, b) =>
              parseISO(b.start_date).getTime() - parseISO(a.start_date).getTime()
            )[0];

          if (nearestPeriod) {
            return differenceInDays(ovulationDate, parseISO(nearestPeriod.start_date));
          }
          return null;
        })
        .filter(offset => offset !== null) as number[];

      if (ovulationOffsets.length > 0) {
        ovulationDayFromPeriod = Math.round(
          ovulationOffsets.reduce((sum, offset) => sum + offset, 0) / ovulationOffsets.length
        );
      }
    }
  }

  const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
  const predictedDate = addDays(parseISO(lastPeriod.start_date), ovulationDayFromPeriod);

  const variance = cycleLengths.reduce(
    (sum, length) => sum + Math.pow(length - averageCycleLength, 2),
    0
  ) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);

  const ovulationVariance = Math.max(2, standardDeviation * 0.5);

  const confidenceLevel = Math.min(
    100,
    Math.max(
      0,
      100 * (1 - ovulationVariance / 8)
    )
  );

  const zScore50 = 0.674;
  const zScore90 = 1.645;

  const margin50 = Math.ceil(zScore50 * ovulationVariance);
  const margin90 = Math.ceil(zScore90 * ovulationVariance);

  return {
    predictedDate,
    confidenceLevel,
    confidence50Lower: subDays(predictedDate, margin50),
    confidence50Upper: addDays(predictedDate, margin50),
    confidence90Lower: subDays(predictedDate, margin90),
    confidence90Upper: addDays(predictedDate, margin90),
  };
}