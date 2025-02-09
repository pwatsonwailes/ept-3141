import React from 'react';
import { format, formatDistance } from 'date-fns';
import { PredictionResult } from '../types';
import { CalendarClock } from 'lucide-react';

interface PeriodPredictionProps {
  prediction: PredictionResult;
}

export function PeriodPrediction({ prediction }: PeriodPredictionProps) {
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
      <div className="flex items-start gap-4">
        <CalendarClock className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Next Period Prediction</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              Predicted start date:{' '}
              <span className="font-medium">
                {format(prediction.predictedDate, 'MMMM d, yyyy')}
              </span>
              {' '}
              <span className="text-gray-500">
                ({formatDistance(prediction.predictedDate, new Date(), { addSuffix: true })})
              </span>
            </p>
            <p className="text-gray-700">
              Average cycle length:{' '}
              <span className="font-medium">{prediction.averageCycleLength} days</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Confidence:</span>
              <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${prediction.confidenceLevel}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.round(prediction.confidenceLevel)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}