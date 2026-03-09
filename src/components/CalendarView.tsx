import React, { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  addDays,
  subDays
} from 'date-fns';
import { Period, Emotion, OvulationLog, PredictionResult, OvulationPrediction } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  periods: Period[];
  emotions: Emotion[];
  ovulationLogs: OvulationLog[];
  periodPrediction: PredictionResult | null;
  ovulationPrediction: OvulationPrediction | null;
  onDateClick: (date: Date) => void;
}

export function CalendarView({
  currentMonth,
  onMonthChange,
  periods,
  emotions,
  ovulationLogs,
  periodPrediction,
  ovulationPrediction,
  onDateClick,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dayData = useMemo(() => {
    const data: Record<string, {
      isPeriod: boolean;
      emotions: Emotion[];
      ovulation: OvulationLog | null;
      isPredictedPeriod: boolean;
      isPeriod50: boolean;
      isPeriod90: boolean;
      isPredictedOvulation: boolean;
      isOvulation50: boolean;
      isOvulation90: boolean;
    }> = {};

    calendarDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      data[dateStr] = {
        isPeriod: false,
        emotions: [],
        ovulation: null,
        isPredictedPeriod: false,
        isPeriod50: false,
        isPeriod90: false,
        isPredictedOvulation: false,
        isOvulation50: false,
        isOvulation90: false,
      };
    });

    periods.forEach(period => {
      const startDate = parseISO(period.start_date);
      const endDate = period.end_date ? parseISO(period.end_date) : addDays(startDate, 5);

      calendarDays.forEach(day => {
        if (isWithinInterval(day, { start: startDate, end: endDate })) {
          const dateStr = format(day, 'yyyy-MM-dd');
          if (data[dateStr]) {
            data[dateStr].isPeriod = true;
          }
        }
      });
    });

    emotions.forEach(emotion => {
      const dateStr = emotion.date;
      if (data[dateStr]) {
        data[dateStr].emotions.push(emotion);
      }
    });

    ovulationLogs.forEach(log => {
      const dateStr = log.date;
      if (data[dateStr]) {
        data[dateStr].ovulation = log;
      }
    });

    if (periodPrediction) {
      const predDate = format(periodPrediction.predictedDate, 'yyyy-MM-dd');
      if (data[predDate]) {
        data[predDate].isPredictedPeriod = true;
      }

      if (periodPrediction.confidence50Lower && periodPrediction.confidence50Upper) {
        calendarDays.forEach(day => {
          if (isWithinInterval(day, {
            start: periodPrediction.confidence50Lower!,
            end: periodPrediction.confidence50Upper!
          })) {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (data[dateStr]) {
              data[dateStr].isPeriod50 = true;
            }
          }
        });
      }

      if (periodPrediction.confidence90Lower && periodPrediction.confidence90Upper) {
        calendarDays.forEach(day => {
          if (isWithinInterval(day, {
            start: periodPrediction.confidence90Lower!,
            end: periodPrediction.confidence90Upper!
          })) {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (data[dateStr]) {
              data[dateStr].isPeriod90 = true;
            }
          }
        });
      }
    }

    if (ovulationPrediction) {
      const predDate = format(ovulationPrediction.predictedDate, 'yyyy-MM-dd');
      if (data[predDate]) {
        data[predDate].isPredictedOvulation = true;
      }

      if (ovulationPrediction.confidence50Lower && ovulationPrediction.confidence50Upper) {
        calendarDays.forEach(day => {
          if (isWithinInterval(day, {
            start: ovulationPrediction.confidence50Lower!,
            end: ovulationPrediction.confidence50Upper!
          })) {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (data[dateStr]) {
              data[dateStr].isOvulation50 = true;
            }
          }
        });
      }

      if (ovulationPrediction.confidence90Lower && ovulationPrediction.confidence90Upper) {
        calendarDays.forEach(day => {
          if (isWithinInterval(day, {
            start: ovulationPrediction.confidence90Lower!,
            end: ovulationPrediction.confidence90Upper!
          })) {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (data[dateStr]) {
              data[dateStr].isOvulation90 = true;
            }
          }
        });
      }
    }

    return data;
  }, [calendarDays, periods, emotions, ovulationLogs, periodPrediction, ovulationPrediction]);

  const getEmotionColor = (emotions: Emotion[]) => {
    if (emotions.length === 0) return null;

    const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
    const hasPositive = emotions.some(e =>
      ['interested', 'excited', 'strong', 'enthusiastic', 'proud', 'alert', 'inspired', 'determined', 'attentive', 'active'].includes(e.emotion_type)
    );
    const hasNegative = emotions.some(e =>
      ['distressed', 'upset', 'guilty', 'scared', 'hostile', 'irritable', 'ashamed', 'nervous', 'jittery', 'afraid'].includes(e.emotion_type)
    );

    if (hasPositive && !hasNegative) {
      return avgIntensity > 3 ? 'bg-green-400' : 'bg-green-200';
    } else if (hasNegative && !hasPositive) {
      return avgIntensity > 3 ? 'bg-red-400' : 'bg-red-200';
    } else {
      return 'bg-yellow-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onMonthChange(subDays(monthStart, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        </div>
        <button
          onClick={() => onMonthChange(addDays(monthEnd, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const data = dayData[dateStr];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const emotionColor = getEmotionColor(data?.emotions || []);

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(day)}
              className={`
                relative min-h-20 p-2 rounded-lg border transition-all hover:shadow-md
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${data?.isPeriod ? 'bg-rose-100 border-rose-300' : ''}
                ${data?.isPeriod90 && !data?.isPeriod ? 'bg-rose-50' : ''}
                ${data?.isOvulation90 && !data?.ovulation ? 'bg-teal-50' : ''}
              `}
            >
              <div className="text-right text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {data?.isPeriod && (
                  <div className="w-full h-1 bg-rose-600 rounded"></div>
                )}

                {data?.isPredictedPeriod && (
                  <div className="w-full h-1 bg-rose-400 rounded border border-rose-600 border-dashed"></div>
                )}

                {data?.ovulation && (
                  <div className="w-full h-1 bg-teal-600 rounded"></div>
                )}

                {data?.isPredictedOvulation && (
                  <div className="w-full h-1 bg-teal-400 rounded border border-teal-600 border-dashed"></div>
                )}

                {emotionColor && (
                  <div className={`w-full h-1 ${emotionColor} rounded`}></div>
                )}

                {data?.emotions && data.emotions.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {data.emotions.length} emotion{data.emotions.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {data?.isPeriod50 && !data?.isPeriod && (
                <div className="absolute inset-0 border-2 border-rose-300 border-dashed rounded-lg pointer-events-none"></div>
              )}

              {data?.isOvulation50 && !data?.ovulation && (
                <div className="absolute inset-0 border-2 border-teal-300 border-dashed rounded-lg pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-rose-600 rounded"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-rose-400 rounded border border-rose-600 border-dashed"></div>
            <span>Predicted Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-rose-50 border-2 border-rose-300 border-dashed rounded"></div>
            <span>50-90% Period Range</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-teal-600 rounded"></div>
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-teal-400 rounded border border-teal-600 border-dashed"></div>
            <span>Predicted Ovulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-green-400 rounded"></div>
            <span>Positive Emotions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-red-400 rounded"></div>
            <span>Negative Emotions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
