import React from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Period } from '../types';
import { Calendar, Droplets, Edit2, Trash2, ArrowDown } from 'lucide-react';

interface PeriodListProps {
  periods: Period[];
  onEdit: (period: Period) => void;
  onDelete: (id: string) => void;
}

export function PeriodList({ periods, onEdit, onDelete }: PeriodListProps) {
  return (
    <div className="grid gap-4">
      {periods.map((period, index) => (
        <React.Fragment key={period.id}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">
                  {format(new Date(period.start_date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-purple-600" />
                  <span>Flow Level: {period.flow_level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(period)}
                    className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(period.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {period.notes && (
              <p className="mt-2 text-gray-600">{period.notes}</p>
            )}
          </div>
          {index < periods.length - 1 && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <ArrowDown className="h-4 w-4" />
              <span>
                {differenceInDays(
                  parseISO(period.start_date),
                  parseISO(periods[index + 1].start_date)
                )}{' '}
                days
              </span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}