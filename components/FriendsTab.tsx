
import React, { useState } from 'react';
import { User } from '../types';
import { Search, UserPlus, UserCheck, X, MoreHorizontal } from 'lucide-react';

interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  timestamp: string;
}

const MOCK_REQUESTS: FriendRequest[] = [
  {
    id: 'req1',
    user: { id: 'u5', name: 'Tanvir Ahmed', avatar: 'https://picsum.photos/seed/tanvir/100/100' },
    mutualFriends: 12,
    timestamp: '2d'
  },
  {
    id: 'req2',
    user: { id: 'u6', name: 'Nusrat Jahan', avatar: 'https://picsum.photos/seed/nusrat/100/100' },
    mutualFriends: 5,
    timestamp: '5d'
  },
  {
    id: 'req3',
    user: { id: 'u7', name: 'Sabbir Hossain', avatar: 'https://picsum.photos/seed/sabbir/100/100' },
    mutualFriends: 8,
    timestamp: '1w'
  }
];

const SUGGESTIONS: FriendRequest[] = [
  {
    id: 'sug1',
    user: { id: 'u8', name: 'Ariful Islam', avatar: 'https://picsum.photos/seed/arif/100/100' },
    mutualFriends: 24,
    timestamp: ''
  },
  {
    id: 'sug2',
    user: { id: 'u9', name: 'Mehedi Hasan', avatar: 'https://picsum.photos/seed/mehedi/100/100' },
    mutualFriends: 15,
    timestamp: ''
  }
];

const FriendsTab: React.FC<{ onUserClick: (user: User) => void }> = ({ onUserClick }) => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);

  const handleConfirm = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-white min-h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Friends</h2>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <Search className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-gray-100">
        <button className="bg-gray-200 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">Suggestions</button>
        <button className="bg-gray-200 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">Your Friends</button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">Friend Requests</h3>
            <span className="text-red-500 font-bold">{requests.length}</span>
          </div>
          <button className="text-[#1877F2] font-semibold text-sm">See all</button>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req.id} className="flex gap-3">
                <img 
                  src={req.user.avatar} 
                  className="w-20 h-20 rounded-full object-cover cursor-pointer shadow-sm" 
                  alt="" 
                  onClick={() => onUserClick(req.user)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 
                      className="font-bold text-[17px] text-gray-900 hover:underline cursor-pointer"
                      onClick={() => onUserClick(req.user)}
                    >
                      {req.user.name}
                    </h4>
                    <span className="text-xs text-gray-500">{req.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{req.mutualFriends} mutual friends</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleConfirm(req.id)}
                      className="flex-1 bg-[#1877F2] text-white py-2 rounded-lg font-bold text-[15px] active:scale-95 transition-transform"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleDelete(req.id)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold text-[15px] active:scale-95 transition-transform"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500 italic">No pending requests.</p>
          </div>
        )}

        <div className="border-t border-gray-100 my-6"></div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">People You May Know</h3>
          <button className="text-[#1877F2] font-semibold text-sm">See all</button>
        </div>

        <div className="space-y-6">
          {suggestions.map((sug) => (
            <div key={sug.id} className="flex gap-3">
              <img 
                src={sug.user.avatar} 
                className="w-20 h-20 rounded-full object-cover cursor-pointer shadow-sm" 
                alt="" 
                onClick={() => onUserClick(sug.user)}
              />
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-bold text-[17px] text-gray-900 hover:underline cursor-pointer"
                  onClick={() => onUserClick(sug.user)}
                >
                  {sug.user.name}
                </h4>
                <p className="text-sm text-gray-500 mb-2">{sug.mutualFriends} mutual friends</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#E7F3FF] text-[#1877F2] py-2 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <UserPlus className="w-4 h-4" /> Add Friend
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold text-[15px] active:scale-95 transition-transform">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
