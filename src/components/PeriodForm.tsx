import React from 'react';
import { format } from 'date-fns';
import { Period } from '../types';

interface PeriodFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentPeriod: Partial<Period>;
  setCurrentPeriod: (period: Partial<Period>) => void;
  onClose: () => void;
  isEditing: boolean;
}

export function PeriodForm({
  onSubmit,
  currentPeriod,
  setCurrentPeriod,
  onClose,
  isEditing,
}: PeriodFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Period' : 'Log Period'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={currentPeriod.start_date}
              onChange={(e) => setCurrentPeriod({ ...currentPeriod, start_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Flow Level (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={currentPeriod.flow_level}
              onChange={(e) => setCurrentPeriod({ ...currentPeriod, flow_level: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={currentPeriod.notes}
              onChange={(e) => setCurrentPeriod({ ...currentPeriod, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}