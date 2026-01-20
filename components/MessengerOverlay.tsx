
import React from 'react';
import { ChatConversation } from '../types';
import { ArrowLeft, Search, Camera, SquarePen, MoreHorizontal } from 'lucide-react';

interface MessengerOverlayProps {
  conversations: ChatConversation[];
  onClose: () => void;
  onChatClick: (chat: ChatConversation) => void;
}

const MessengerOverlay: React.FC<MessengerOverlayProps> = ({ conversations, onClose, onChatClick }) => {
  return (
    <div className="fixed inset-0 bg-white z-[120] flex flex-col animate-in slide-in-from-right duration-300 sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-2xl font-bold">Chats</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-full"><Camera className="w-5 h-5 text-gray-700" /></div>
          <div className="p-2 bg-gray-100 rounded-full"><SquarePen className="w-5 h-5 text-gray-700" /></div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-[15px] w-full focus:ring-0" 
          />
        </div>
      </div>

      {/* Active Stories Circle */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex flex-col items-center gap-1 min-w-[65px]">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="bg-gray-200 p-2 rounded-full text-gray-500 font-bold">+</div>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">Your Note</span>
        </div>
        {conversations.filter(c => c.isOnline).map(c => (
          <div key={c.id} className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer" onClick={() => onChatClick(c)}>
            <div className="relative">
              <img src={c.user.avatar} className="w-14 h-14 rounded-full border-2 border-[#1877F2] p-0.5" alt="" />
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-[10px] text-gray-600 font-medium truncate w-full text-center">{c.user.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => onChatClick(chat)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-100" alt="" />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-[15px] font-semibold text-gray-900 truncate">{chat.user.name}</p>
                <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {chat.unreadCount > 0 ? `${chat.unreadCount} new messages · ` : ''}{chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <div className="w-2.5 h-2.5 bg-[#1877F2] rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessengerOverlay;
