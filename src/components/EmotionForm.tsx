import React, { useState } from 'react';
import { format } from 'date-fns';
import { Emotion, PANAS_EMOTIONS } from '../types';
import { Heart, X, Search } from 'lucide-react';

interface EmotionFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentEmotion: Partial<Emotion>;
  setCurrentEmotion: (emotion: Partial<Emotion>) => void;
  onClose: () => void;
  isEditing: boolean;
}

export function EmotionForm({
  onSubmit,
  currentEmotion,
  setCurrentEmotion,
  onClose,
  isEditing,
}: EmotionFormProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allEmotions = [
    ...PANAS_EMOTIONS.positive.map(e => ({ name: e, category: 'positive' })),
    ...PANAS_EMOTIONS.negative.map(e => ({ name: e, category: 'negative' }))
  ];

  const filteredEmotions = searchTerm
    ? allEmotions.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allEmotions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-600" />
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Emotion' : 'Log Emotion'}
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
              value={currentEmotion.date}
              onChange={(e) => setCurrentEmotion({ ...currentEmotion, date: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emotion
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search emotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {filteredEmotions.map(({ name, category }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCurrentEmotion({ ...currentEmotion, emotion_type: name })}
                  className={`p-3 rounded-md text-left transition-all ${
                    currentEmotion.emotion_type === name
                      ? category === 'positive'
                        ? 'bg-green-100 border-2 border-green-600 text-green-900'
                        : 'bg-red-100 border-2 border-red-600 text-red-900'
                      : category === 'positive'
                      ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                      : 'bg-red-50 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <span className="capitalize font-medium">{name}</span>
                </button>
              ))}
            </div>
            {!currentEmotion.emotion_type && (
              <p className="text-sm text-gray-500 mt-2">
                Please select an emotion from the list above
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensity: {currentEmotion.intensity || 3}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Low</span>
              <input
                type="range"
                min="1"
                max="5"
                value={currentEmotion.intensity || 3}
                onChange={(e) => setCurrentEmotion({
                  ...currentEmotion,
                  intensity: parseInt(e.target.value)
                })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={currentEmotion.notes || ''}
              onChange={(e) => setCurrentEmotion({ ...currentEmotion, notes: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
              rows={3}
              placeholder="Add any additional context..."
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
              disabled={!currentEmotion.emotion_type}
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
