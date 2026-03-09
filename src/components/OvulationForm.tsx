import React from 'react';
import { OvulationLog } from '../types';
import { Activity, X } from 'lucide-react';

interface OvulationFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentLog: Partial<OvulationLog>;
  setCurrentLog: (log: Partial<OvulationLog>) => void;
  onClose: () => void;
  isEditing: boolean;
}

export function OvulationForm({
  onSubmit,
  currentLog,
  setCurrentLog,
  onClose,
  isEditing,
}: OvulationFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-teal-600" />
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Ovulation Log' : 'Log Ovulation Data'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={currentLog.date}
              onChange={(e) => setCurrentLog({ ...currentLog, date: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basal Body Temperature (°C)
            </label>
            <input
              type="number"
              step="0.01"
              min="35"
              max="40"
              value={currentLog.basal_temp || ''}
              onChange={(e) => setCurrentLog({
                ...currentLog,
                basal_temp: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              placeholder="e.g., 36.5"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Take temperature first thing in the morning before getting out of bed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cervical Mucus
            </label>
            <select
              value={currentLog.cervical_mucus || ''}
              onChange={(e) => setCurrentLog({
                ...currentLog,
                cervical_mucus: e.target.value as OvulationLog['cervical_mucus']
              })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
            >
              <option value="">Select...</option>
              <option value="dry">Dry - No mucus present</option>
              <option value="sticky">Sticky - Thick, pasty</option>
              <option value="creamy">Creamy - Lotion-like</option>
              <option value="watery">Watery - Thin, clear</option>
              <option value="egg-white">Egg White - Stretchy, clear (most fertile)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ovulation Test Result
            </label>
            <select
              value={currentLog.ovulation_test || ''}
              onChange={(e) => setCurrentLog({
                ...currentLog,
                ovulation_test: e.target.value as OvulationLog['ovulation_test']
              })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
            >
              <option value="">Not tested</option>
              <option value="negative">Negative</option>
              <option value="positive">Positive - LH surge detected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={currentLog.notes || ''}
              onChange={(e) => setCurrentLog({ ...currentLog, notes: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
              rows={3}
              placeholder="Any other observations..."
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
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
