import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Period, Emotion, OvulationLog, PredictionResult, OvulationPrediction } from '../types';
import { Plus, Heart, Activity, Calendar as CalendarIcon, List } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';
import { calculatePrediction, calculateOvulationPrediction } from '../lib/predictions';
import { PeriodForm } from './PeriodForm';
import { EmotionForm } from './EmotionForm';
import { OvulationForm } from './OvulationForm';
import { PeriodPrediction } from './PeriodPrediction';
import { PeriodList } from './PeriodList';
import { CalendarView } from './CalendarView';

export function PeriodTracker() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [ovulationLogs, setOvulationLogs] = useState<OvulationLog[]>([]);
  const [periodPrediction, setPeriodPrediction] = useState<PredictionResult | null>(null);
  const [ovulationPrediction, setOvulationPrediction] = useState<OvulationPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [showEmotionForm, setShowEmotionForm] = useState(false);
  const [showOvulationForm, setShowOvulationForm] = useState(false);

  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  const [editingOvulation, setEditingOvulation] = useState<OvulationLog | null>(null);

  const [currentPeriod, setCurrentPeriod] = useState<Partial<Period>>({
    start_date: format(new Date(), 'yyyy-MM-dd'),
    flow_level: 3,
    symptoms: [],
    notes: '',
  });

  const [currentEmotion, setCurrentEmotion] = useState<Partial<Emotion>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    intensity: 3,
    notes: '',
  });

  const [currentOvulation, setCurrentOvulation] = useState<Partial<OvulationLog>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (periods.length >= 3) {
      const pred = calculatePrediction(periods);
      setPeriodPrediction(pred);

      const ovuPred = calculateOvulationPrediction(periods, ovulationLogs);
      setOvulationPrediction(ovuPred);
    }
  }, [periods, ovulationLogs]);

  async function fetchAllData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const [periodsData, emotionsData, ovulationData] = await Promise.all([
        supabase.from('periods').select('*').order('start_date', { ascending: false }),
        supabase.from('emotions').select('*').order('date', { ascending: false }),
        supabase.from('ovulation_logs').select('*').order('date', { ascending: false }),
      ]);

      if (periodsData.error) throw periodsData.error;
      if (emotionsData.error) throw emotionsData.error;
      if (ovulationData.error) throw ovulationData.error;

      setPeriods(periodsData.data || []);
      setEmotions(emotionsData.data || []);
      setOvulationLogs(ovulationData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePeriodSubmit(e: React.FormEvent) {
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

      setShowPeriodForm(false);
      setEditingPeriod(null);
      setCurrentPeriod({
        start_date: format(new Date(), 'yyyy-MM-dd'),
        flow_level: 3,
        symptoms: [],
        notes: '',
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error saving period:', error);
      alert('Failed to save period. Please try again.');
    }
  }

  async function handleEmotionSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const emotionData = {
        ...currentEmotion,
        user_id: user.id
      };

      let error;
      if (editingEmotion) {
        ({ error } = await supabase
          .from('emotions')
          .update(emotionData)
          .eq('id', editingEmotion.id));
      } else {
        ({ error } = await supabase.from('emotions').insert([emotionData]));
      }

      if (error) throw error;

      setShowEmotionForm(false);
      setEditingEmotion(null);
      setCurrentEmotion({
        date: format(new Date(), 'yyyy-MM-dd'),
        intensity: 3,
        notes: '',
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error saving emotion:', error);
      alert('Failed to save emotion. Please try again.');
    }
  }

  async function handleOvulationSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const ovulationData = {
        ...currentOvulation,
        user_id: user.id
      };

      let error;
      if (editingOvulation) {
        ({ error } = await supabase
          .from('ovulation_logs')
          .update(ovulationData)
          .eq('id', editingOvulation.id));
      } else {
        ({ error } = await supabase.from('ovulation_logs').insert([ovulationData]));
      }

      if (error) throw error;

      setShowOvulationForm(false);
      setEditingOvulation(null);
      setCurrentOvulation({
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error saving ovulation log:', error);
      alert('Failed to save ovulation log. Please try again.');
    }
  }

  const handlePeriodEdit = (period: Period) => {
    setEditingPeriod(period);
    setCurrentPeriod({
      start_date: period.start_date,
      flow_level: period.flow_level,
      symptoms: period.symptoms || [],
      notes: period.notes || '',
    });
    setShowPeriodForm(true);
  };

  const handlePeriodDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('periods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting period:', error);
      alert('Failed to delete period. Please try again.');
    }
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setCurrentEmotion({ date: dateStr, intensity: 3, notes: '' });
    setShowEmotionForm(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Period Tracker</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-md hover:bg-gray-50 shadow-sm"
            >
              {view === 'list' ? (
                <>
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </>
              ) : (
                <>
                  <List className="h-5 w-5" />
                  <span>List</span>
                </>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        <PeriodPrediction
          periodPrediction={periodPrediction}
          ovulationPrediction={ovulationPrediction}
        />

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => {
              setEditingPeriod(null);
              setCurrentPeriod({
                start_date: format(new Date(), 'yyyy-MM-dd'),
                flow_level: 3,
                symptoms: [],
                notes: '',
              });
              setShowPeriodForm(true);
            }}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700"
          >
            <Plus className="h-5 w-5" />
            Log Period
          </button>

          <button
            onClick={() => {
              setEditingEmotion(null);
              setCurrentEmotion({
                date: format(new Date(), 'yyyy-MM-dd'),
                intensity: 3,
                notes: '',
              });
              setShowEmotionForm(true);
            }}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          >
            <Heart className="h-5 w-5" />
            Log Emotion
          </button>

          <button
            onClick={() => {
              setEditingOvulation(null);
              setCurrentOvulation({
                date: format(new Date(), 'yyyy-MM-dd'),
                notes: '',
              });
              setShowOvulationForm(true);
            }}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            <Activity className="h-5 w-5" />
            Log Ovulation
          </button>
        </div>

        {view === 'calendar' ? (
          <CalendarView
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            periods={periods}
            emotions={emotions}
            ovulationLogs={ovulationLogs}
            periodPrediction={periodPrediction}
            ovulationPrediction={ovulationPrediction}
            onDateClick={handleDateClick}
          />
        ) : (
          <PeriodList
            periods={periods}
            onEdit={handlePeriodEdit}
            onDelete={handlePeriodDelete}
          />
        )}

        {showPeriodForm && (
          <PeriodForm
            onSubmit={handlePeriodSubmit}
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
            onClose={() => {
              setShowPeriodForm(false);
              setEditingPeriod(null);
            }}
            isEditing={!!editingPeriod}
          />
        )}

        {showEmotionForm && (
          <EmotionForm
            onSubmit={handleEmotionSubmit}
            currentEmotion={currentEmotion}
            setCurrentEmotion={setCurrentEmotion}
            onClose={() => {
              setShowEmotionForm(false);
              setEditingEmotion(null);
            }}
            isEditing={!!editingEmotion}
          />
        )}

        {showOvulationForm && (
          <OvulationForm
            onSubmit={handleOvulationSubmit}
            currentLog={currentOvulation}
            setCurrentLog={setCurrentOvulation}
            onClose={() => {
              setShowOvulationForm(false);
              setEditingOvulation(null);
            }}
            isEditing={!!editingOvulation}
          />
        )}
      </div>
    </div>
  );
}
