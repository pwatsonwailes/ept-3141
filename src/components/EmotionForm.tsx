import React, { useState } from 'react';
import { format } from 'date-fns';
import { Emotion, EMOTIONS_LIST } from '../types';
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

  const filteredEmotions = searchTerm
    ? EMOTIONS_LIST.filter(e =>
        e.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : EMOTIONS_LIST;

  const selectedEmotions = (currentEmotion.emotion_types || []) as string[];

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
              Emotions (select one or more)
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
              {filteredEmotions.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion);
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setCurrentEmotion({
                          ...currentEmotion,
                          emotion_types: selectedEmotions.filter(e => e !== emotion)
                        });
                      } else {
                        setCurrentEmotion({
                          ...currentEmotion,
                          emotion_types: [...selectedEmotions, emotion]
                        });
                      }
                    }}
                    className={`p-3 rounded-md text-left transition-all ${
                      isSelected
                        ? 'bg-rose-100 border-2 border-rose-600 text-rose-900'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span className="font-medium">{emotion}</span>
                  </button>
                );
              })}
            </div>
            {selectedEmotions.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Please select at least one emotion
              </p>
            )}
            {selectedEmotions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedEmotions.map(emotion => (
                  <span key={emotion} className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm">
                    {emotion}
                    <button
                      type="button"
                      onClick={() => setCurrentEmotion({
                        ...currentEmotion,
                        emotion_types: selectedEmotions.filter(e => e !== emotion)
                      })}
                      className="ml-1 hover:text-rose-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              disabled={!selectedEmotions.length}
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
