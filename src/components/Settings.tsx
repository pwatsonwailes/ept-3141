import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { ThemeColors } from '../types';
import { themeOptions } from '../lib/theme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColors;
  onThemeChange: (theme: ThemeColors) => void;
}

export function Settings({ isOpen, onClose, currentTheme, onThemeChange }: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Theme Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {themeOptions.map((theme) => (
              <button
                key={theme.name}
                onClick={() => onThemeChange(theme.colors)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  JSON.stringify(theme.colors) === JSON.stringify(currentTheme)
                    ? `border-${theme.colors.primary}-600 bg-${theme.colors.primary}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-full h-8 rounded bg-gradient-to-r from-${theme.colors.primary}-400 to-${theme.colors.secondary}-400`} />
                  <span className="text-sm font-medium">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}