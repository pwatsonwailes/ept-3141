import { Period } from '../types';
import { differenceInDays, addDays, parseISO } from 'date-fns';

export function calculatePrediction(periods: Period[]) {
  if (periods.length < 3) {
    return null;
  }

  // Sort periods by start date in ascending order
  const sortedPeriods = [...periods].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Calculate cycle lengths
  const cycleLengths = [];
  for (let i = 1; i < sortedPeriods.length; i++) {
    const cycleLength = differenceInDays(
      parseISO(sortedPeriods[i].start_date),
      parseISO(sortedPeriods[i - 1].start_date)
    );
    cycleLengths.push(cycleLength);
  }

  // Calculate average cycle length
  const averageCycleLength = Math.round(
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  );

  // Calculate variance and standard deviation
  const variance = cycleLengths.reduce(
    (sum, length) => sum + Math.pow(length - averageCycleLength, 2),
    0
  ) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate confidence level (0-100)
  // Lower standard deviation means higher confidence
  const maxAcceptableDeviation = 5; // 5 days variation is considered normal
  const confidenceLevel = Math.min(
    100,
    Math.max(
      0,
      100 * (1 - standardDeviation / (maxAcceptableDeviation * 2))
    )
  );

  // Predict next period
  const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
  const predictedDate = addDays(parseISO(lastPeriod.start_date), averageCycleLength);

  return {
    predictedDate,
    confidenceLevel,
    averageCycleLength,
  };
}