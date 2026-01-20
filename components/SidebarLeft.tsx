
import React from 'react';
import { 
  Users, 
  Group, 
  ShoppingBag, 
  Clock, 
  Bookmark, 
  Flag, 
  ChevronDown 
} from 'lucide-react';

const SidebarItem: React.FC<{ icon: any, label: string, color?: string }> = ({ icon: Icon, label, color }) => (
  <div className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
    {typeof Icon === 'string' ? (
       <img src={Icon} className="w-8 h-8 rounded-full" alt={label} />
    ) : (
      <Icon className={`w-8 h-8 ${color || 'text-[#1877F2]'}`} />
    )}
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const SidebarLeft: React.FC = () => {
  return (
    <aside className="hidden lg:block fixed left-0 top-14 w-80 h-[calc(100vh-56px)] overflow-y-auto p-2">
      <SidebarItem icon="https://picsum.photos/seed/user123/40/40" label="John Doe" />
      <SidebarItem icon={Users} label="Find Friends" color="text-blue-500" />
      <SidebarItem icon={Group} label="Groups" color="text-blue-600" />
      <SidebarItem icon={ShoppingBag} label="Marketplace" color="text-blue-500" />
      <SidebarItem icon={Tv} label="Watch" color="text-blue-400" />
      <SidebarItem icon={Clock} label="Memories" color="text-blue-500" />
      <SidebarItem icon={Bookmark} label="Saved" color="text-purple-600" />
      <SidebarItem icon={Flag} label="Pages" color="text-orange-500" />
      <div className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
        <div className="bg-gray-200 rounded-full p-1">
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </div>
        <span className="text-sm font-semibold">See more</span>
      </div>
      
      <div className="border-t border-gray-300 my-4"></div>
      
      <h3 className="px-2 text-gray-500 font-semibold mb-2">Your Shortcuts</h3>
      <SidebarItem icon="https://picsum.photos/seed/group1/40/40" label="React Developers" />
      <SidebarItem icon="https://picsum.photos/seed/group2/40/40" label="Gemini AI Community" />
      <SidebarItem icon="https://picsum.photos/seed/group3/40/40" label="Tailwind CSS Mastery" />
    </aside>
  );
};

import { Tv } from 'lucide-react';
export default SidebarLeft;
