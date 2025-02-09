import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Period, PredictionResult } from '../types';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { calculatePrediction } from '../lib/predictions';
import { PeriodForm } from './PeriodForm';
import { PeriodPrediction } from './PeriodPrediction';
import { PeriodList } from './PeriodList';

export function PeriodTracker() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
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

      let error;
      if (editingPeriod) {
        ({ error } = await supabase
          .from('periods')
          .update(periodData)
          .eq('id', editingPeriod.id));
      } else {
        ({ error } = await supabase.from('periods').insert([periodData]));
      }

      if (error) throw error;

      setShowForm(false);
      setEditingPeriod(null);
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

  const handleEdit = (period: Period) => {
    setEditingPeriod(period);
    setCurrentPeriod({
      start_date: period.start_date,
      flow_level: period.flow_level,
      symptoms: period.symptoms || [],
      notes: period.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('periods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPeriods();
    } catch (error) {
      console.error('Error deleting period:', error);
      alert('Failed to delete period. Please try again.');
    }
  };

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

        {prediction && <PeriodPrediction prediction={prediction} />}

        <button
          onClick={() => {
            setEditingPeriod(null);
            setCurrentPeriod({
              start_date: format(new Date(), 'yyyy-MM-dd'),
              flow_level: 3,
              symptoms: [],
              notes: '',
            });
            setShowForm(true);
          }}
          className="mb-6 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add New Period
        </button>

        {showForm && (
          <PeriodForm
            onSubmit={handleSubmit}
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
            onClose={() => {
              setShowForm(false);
              setEditingPeriod(null);
            }}
            isEditing={!!editingPeriod}
          />
        )}

        <PeriodList
          periods={periods}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}