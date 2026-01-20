
import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Home, 
  Users, 
  Tv, 
  ShoppingBag, 
  Bell, 
  Menu 
} from 'lucide-react';
import { AppNotification, ChatConversation } from '../types';
import NotificationDropdown from './NotificationDropdown';
import MessengerDropdown from './MessengerDropdown';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications: number;
  unreadMessages: number;
  onOpenMessenger: () => void;
  onOpenSearch: () => void;
  notifications: AppNotification[];
  onNotificationClick: (notif: AppNotification) => void;
  conversations: ChatConversation[];
  onChatClick: (chat: ChatConversation) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  unreadNotifications, 
  unreadMessages,
  onOpenMessenger,
  onOpenSearch,
  notifications,
  onNotificationClick,
  conversations,
  onChatClick
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const toggleNotifs = () => {
    setShowNotifDropdown(!showNotifDropdown);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 sm:max-w-[450px] sm:mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 relative">
        <h1 className="text-[#1877F2] text-2xl font-bold tracking-tight">facebook</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSearch}
            className="p-2 bg-gray-100 rounded-full active:bg-gray-200 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          
          <button 
            onClick={onOpenMessenger}
            className="p-2 rounded-full bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors relative"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">
                {unreadMessages}
              </span>
            )}
          </button>

          <button 
            onClick={toggleNotifs}
            className={`p-2 rounded-full active:bg-gray-200 transition-colors relative ${showNotifDropdown ? 'bg-blue-100 text-[#1877F2]' : 'bg-gray-100 text-gray-700'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Dropdowns */}
        {showNotifDropdown && (
          <NotificationDropdown 
            notifications={notifications} 
            onClose={() => setShowNotifDropdown(false)} 
            onNotificationClick={onNotificationClick}
          />
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-around border-t border-gray-100">
        {[
          { id: 'home', icon: Home },
          { id: 'friends', icon: Users },
          { id: 'watch', icon: Tv },
          { id: 'marketplace', icon: ShoppingBag },
          { id: 'notifications', icon: Bell, count: unreadNotifications },
          { id: 'menu', icon: Menu }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              setShowNotifDropdown(false);
            }}
            className={`flex-1 flex flex-col items-center py-3 relative ${activeTab === tab.id ? 'text-[#1877F2] border-b-2 border-[#1877F2]' : 'text-gray-500'}`}
          >
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'fill-current' : ''}`} />
            {tab.count !== undefined && tab.count > 0 && (
              <span className="absolute top-2 right-1/4 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;
