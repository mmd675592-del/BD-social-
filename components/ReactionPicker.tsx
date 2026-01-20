
import React from 'react';
import { ReactionType } from '../types';

interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void;
}

const REACTIONS: { type: ReactionType; label: string; icon: string; color: string }[] = [
  { type: 'like', label: 'Like', icon: '👍', color: 'text-blue-500' },
  { type: 'love', label: 'Love', icon: '❤️', color: 'text-red-500' },
  { type: 'care', label: 'Care', icon: '🥰', color: 'text-yellow-500' },
  { type: 'haha', label: 'Haha', icon: '😆', color: 'text-yellow-500' },
  { type: 'wow', label: 'Wow', icon: '😮', color: 'text-yellow-500' },
  { type: 'sad', label: 'Sad', icon: '😢', color: 'text-yellow-500' },
  { type: 'angry', label: 'Angry', icon: '😡', color: 'text-orange-600' },
];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white shadow-2xl rounded-full px-2 py-1.5 flex items-center gap-1 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
      {REACTIONS.map((reaction, index) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          className="hover:scale-150 transition-all duration-200 p-1 group relative animate-in fade-in zoom-in-50 duration-300 fill-mode-backwards"
          style={{ animationDelay: `${index * 40}ms` }}
          title={reaction.label}
        >
          <span className="text-2xl block group-hover:-translate-y-1 transition-transform">{reaction.icon}</span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none">
            {reaction.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
