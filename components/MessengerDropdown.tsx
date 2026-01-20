
import React from 'react';
import { ChatConversation } from '../types';
import { MoreHorizontal, Search, Maximize2, SquarePen } from 'lucide-react';

interface MessengerDropdownProps {
  conversations: ChatConversation[];
  onChatClick: (chat: ChatConversation) => void;
  onClose: () => void;
}

const MessengerDropdown: React.FC<MessengerDropdownProps> = ({ conversations, onChatClick, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-[360px] bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chats</h2>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Maximize2 className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><SquarePen className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="px-4 mb-2">
        <div className="flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Messenger" 
            className="bg-transparent border-none outline-none text-sm w-full focus:ring-0" 
          />
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => {
              onChatClick(chat);
              onClose();
            }}
            className="flex items-center gap-3 p-2 mx-2 my-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
          >
            <div className="relative flex-shrink-0">
              <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{chat.user.name}</p>
              <div className="flex items-center justify-between gap-1">
                <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                <span className="text-[10px] text-gray-400 flex-shrink-0">· {chat.lastMessageTime}</span>
              </div>
            </div>
            {chat.unreadCount > 0 && (
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 text-center border-t border-gray-100">
        <button className="text-blue-600 font-semibold hover:underline text-sm">See all in Messenger</button>
      </div>
    </div>
  );
};

export default MessengerDropdown;
