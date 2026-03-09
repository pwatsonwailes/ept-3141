import React from 'react';
import { format, formatDistance } from 'date-fns';
import { PredictionResult, OvulationPrediction } from '../types';
import { CalendarClock, Activity } from 'lucide-react';

interface PredictionDisplayProps {
  periodPrediction: PredictionResult | null;
  ovulationPrediction: OvulationPrediction | null;
}

export function PredictionDisplay({ periodPrediction, ovulationPrediction }: PredictionDisplayProps) {
  if (!periodPrediction && !ovulationPrediction) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {periodPrediction && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-rose-600">
          <div className="flex items-start gap-4">
            <CalendarClock className="h-6 w-6 text-rose-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Next Period Prediction</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Predicted start date:{' '}
                  <span className="font-medium">
                    {format(periodPrediction.predictedDate, 'MMMM d, yyyy')}
                  </span>
                  {' '}
                  <span className="text-gray-500">
                    ({formatDistance(periodPrediction.predictedDate, new Date(), { addSuffix: true })})
                  </span>
                </p>
                <p className="text-gray-700">
                  Average cycle length:{' '}
                  <span className="font-medium">{periodPrediction.averageCycleLength} days</span>
                </p>

                {periodPrediction.confidence50Lower && periodPrediction.confidence50Upper && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Confidence Intervals:</p>
                    <div className="ml-4 space-y-1 text-sm text-gray-600">
                      <p>
                        50% confidence: {format(periodPrediction.confidence50Lower, 'MMM d')} - {format(periodPrediction.confidence50Upper, 'MMM d, yyyy')}
                      </p>
                      {periodPrediction.confidence90Lower && periodPrediction.confidence90Upper && (
                        <p>
                          90% confidence: {format(periodPrediction.confidence90Lower, 'MMM d')} - {format(periodPrediction.confidence90Upper, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Confidence:</span>
                  <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-rose-600 h-2.5 rounded-full"
                      style={{ width: `${periodPrediction.confidenceLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(periodPrediction.confidenceLevel)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {ovulationPrediction && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-600">
          <div className="flex items-start gap-4">
            <Activity className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Next Ovulation Prediction</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Predicted ovulation:{' '}
                  <span className="font-medium">
                    {format(ovulationPrediction.predictedDate, 'MMMM d, yyyy')}
                  </span>
                  {' '}
                  <span className="text-gray-500">
                    ({formatDistance(ovulationPrediction.predictedDate, new Date(), { addSuffix: true })})
                  </span>
                </p>

                {ovulationPrediction.confidence50Lower && ovulationPrediction.confidence50Upper && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Confidence Intervals:</p>
                    <div className="ml-4 space-y-1 text-sm text-gray-600">
                      <p>
                        50% confidence: {format(ovulationPrediction.confidence50Lower, 'MMM d')} - {format(ovulationPrediction.confidence50Upper, 'MMM d, yyyy')}
                      </p>
                      {ovulationPrediction.confidence90Lower && ovulationPrediction.confidence90Upper && (
                        <p>
                          90% confidence: {format(ovulationPrediction.confidence90Lower, 'MMM d')} - {format(ovulationPrediction.confidence90Upper, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Confidence:</span>
                  <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full"
                      style={{ width: `${ovulationPrediction.confidenceLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(ovulationPrediction.confidenceLevel)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { PredictionDisplay as PeriodPrediction };