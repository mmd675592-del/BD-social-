
import React from 'react';
import { Story, User } from '../types';
import { Plus } from 'lucide-react';

interface StorySectionProps {
  currentUser: User;
  stories: Story[];
  onViewStory: (index: number) => void;
}

const StorySection: React.FC<StorySectionProps> = ({ currentUser, stories, onViewStory }) => {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
      {/* Create Story */}
      <div className="flex-shrink-0 w-24 h-40 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer relative group border border-gray-200">
        <div className="h-2/3 overflow-hidden">
          <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Me" />
        </div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1877F2] p-1 rounded-full border-2 border-white">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <div className="h-1/3 flex items-end justify-center pb-2">
          <span className="text-[10px] font-bold text-gray-800">Create story</span>
        </div>
      </div>

      {/* User Stories */}
      {stories.map((story, idx) => (
        <div 
          key={story.id} 
          onClick={() => onViewStory(idx)}
          className="flex-shrink-0 w-24 h-40 rounded-xl shadow-sm overflow-hidden cursor-pointer relative group border border-gray-200"
        >
          <img src={story.image} className="w-full h-full object-cover" alt="Story" />
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="absolute top-2 left-2 ring-2 ring-[#1877F2] rounded-full overflow-hidden w-8 h-8 border border-white">
            <img src={story.user.avatar} className="w-full h-full object-cover" alt={story.user.name} />
          </div>
          
          <div className="absolute bottom-2 left-2 right-2">
            <span className="text-[10px] font-bold text-white line-clamp-1 drop-shadow-md">{story.user.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StorySection;
