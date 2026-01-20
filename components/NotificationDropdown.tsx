
import React from 'react';
import { AppNotification } from '../types';
import { MoreHorizontal } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onClose: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose, onNotificationClick }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex px-4 py-2 gap-2 border-b border-gray-100">
        <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">All</button>
        <button className="hover:bg-gray-100 px-3 py-1.5 rounded-full text-sm font-semibold">Unread</button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => {
                onNotificationClick(notif);
                onClose();
              }}
              className={`flex items-start gap-3 p-2 mx-2 my-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <img src={notif.user.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white 
                  ${notif.type === 'like' ? 'bg-blue-500' : 
                    notif.type === 'comment' ? 'bg-green-500' : 
                    notif.type === 'friend_request' ? 'bg-blue-600' : 'bg-red-500'}`}
                >
                  {notif.type === 'like' && <span className="text-[10px] text-white">👍</span>}
                  {notif.type === 'comment' && <span className="text-[10px] text-white">💬</span>}
                  {notif.type === 'friend_request' && <span className="text-[10px] text-white">👤</span>}
                  {notif.type === 'post' && <span className="text-[10px] text-white">📰</span>}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug">
                  <span className="font-bold">{notif.user.name}</span> {notif.content}
                </p>
                <p className={`text-xs mt-1 ${!notif.isRead ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {notif.timestamp}
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-6"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            No notifications yet.
          </div>
        )}
      </div>

      <div className="p-3 text-center border-t border-gray-100">
        <button className="text-blue-600 font-semibold hover:underline text-sm">See all</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
