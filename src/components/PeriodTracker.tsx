import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Period, PredictionResult } from '../types';
import { Calendar, Droplets, Plus, CalendarClock } from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { calculatePrediction } from '../lib/predictions';

export function PeriodTracker() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<Partial<Period>>({
    start_date: format(new Date(), 'yyyy-MM-dd'),
    flow_level: 3,
    symptoms: [],
    notes: '',
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  useEffect(() => {
    if (periods.length >= 3) {
      const newPrediction = calculatePrediction(periods);
      setPrediction(newPrediction);
    }
  }, [periods]);

  async function fetchPeriods() {
    try {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setPeriods(data || []);
    } catch (error) {
      console.error('Error fetching periods:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const periodData = {
        ...currentPeriod,
        user_id: user.id
      };

      const { error } = await supabase.from('periods').insert([periodData]);
      if (error) throw error;

      setShowForm(false);
      setCurrentPeriod({
        start_date: format(new Date(), 'yyyy-MM-dd'),
        flow_level: 3,
        symptoms: [],
        notes: '',
      });
      await fetchPeriods();
    } catch (error) {
      console.error('Error saving period:', error);
      alert('Failed to save period. Please try again.');
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Period Tracker</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Sign Out
          </button>
        </div>

        {prediction && (
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
        )}

        <button
          onClick={() => setShowForm(true)}
          className="mb-6 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add New Period
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Log Period</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">
                    {format(new Date(period.start_date), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-purple-600" />
                  <span>Flow Level: {period.flow_level}</span>
                </div>
              </div>
              {period.notes && (
                <p className="mt-2 text-gray-600">{period.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}