
import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight, Eye, ThumbsUp, Heart, Smile } from 'lucide-react';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const story = stories[currentIndex];

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Simple progress bar effect
  useEffect(() => {
    const timer = setTimeout(nextStory, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const totalReactions = story.reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex flex-col gap-2 z-10 bg-gradient-to-b from-black/60 to-transparent">
        {/* Progress Bars */}
        <div className="flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${i < currentIndex ? 'w-full' : i === currentIndex ? 'w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img src={story.user.avatar} className="w-10 h-10 rounded-full border-2 border-[#1877F2]" alt={story.user.name} />
            <div>
              <p className="font-bold text-sm">{story.user.name}</p>
              <p className="text-xs opacity-80">{story.timestamp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevStory}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-0 transition-opacity z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button 
        onClick={nextStory}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Story Image */}
      <div className="w-full h-full flex items-center justify-center max-w-lg relative">
        <img 
          src={story.image} 
          className="max-h-full w-auto object-contain rounded-xl shadow-2xl"
          alt="Story content" 
        />
        
        {/* View Count & Reactions Overlay */}
        <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between text-white">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-bold">{story.viewCount} views</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                 <div className="flex -space-x-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 border-2 border-transparent" />
                    <ThumbsUp className="w-4 h-4 text-blue-500 fill-blue-500 border-2 border-transparent" />
                 </div>
                 <span className="text-sm font-bold">{totalReactions} reactions</span>
              </div>
           </div>

           <div className="flex gap-2">
              <button className="p-3 bg-white/20 hover:bg-[#1877F2] rounded-full transition-colors group">
                 <ThumbsUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-3 bg-white/20 hover:bg-pink-500 rounded-full transition-colors group">
                 <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-3 bg-white/20 hover:bg-yellow-500 rounded-full transition-colors group">
                 <Smile className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
