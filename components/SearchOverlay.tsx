
import React, { useState, useMemo } from 'react';
import { X, Search, User as UserIcon, MessageSquare, Newspaper, ArrowLeft, Clock } from 'lucide-react';
import { Post, ChatConversation, User } from '../types';

interface SearchOverlayProps {
  onClose: () => void;
  posts: Post[];
  conversations: ChatConversation[];
  onOpenChat: (chat: ChatConversation) => void;
  onOpenPost: (postId: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  onClose, 
  posts, 
  conversations, 
  onOpenChat,
  onOpenPost 
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(['Bit chat i', 'React updates', 'Gemini AI']);

  const results = useMemo(() => {
    if (!query.trim()) return null;

    const lowerQuery = query.toLowerCase();

    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(lowerQuery) || 
      post.user.name.toLowerCase().includes(lowerQuery)
    );

    const filteredFriends = conversations.filter(conv => 
      conv.user.name.toLowerCase().includes(lowerQuery)
    );

    const filteredMessages = conversations.flatMap(conv => 
      conv.messages.filter(msg => msg.text?.toLowerCase().includes(lowerQuery))
        .map(msg => ({ conv, msg }))
    );

    return {
      posts: filteredPosts,
      friends: filteredFriends,
      messages: filteredMessages
    };
  }, [query, posts, conversations]);

  const hasResults = results && (results.posts.length > 0 || results.friends.length > 0 || results.messages.length > 0);

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col animate-in fade-in slide-in-from-top-4 duration-300 sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Facebook"
            className="bg-transparent border-none outline-none text-[15px] w-full focus:ring-0 text-gray-800"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!query && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent searches</h3>
              <button className="text-[#1877F2] text-sm font-semibold">Edit</button>
            </div>
            <div className="space-y-4">
              {recentSearches.map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => setQuery(s)}>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-[15px] text-gray-700">{s}</span>
                  </div>
                  <X className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}

        {query && results && (
          <div className="divide-y divide-gray-100">
            {/* Friends Section */}
            {results.friends.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Friends</h3>
                <div className="space-y-4">
                  {results.friends.map(friend => (
                    <div 
                      key={friend.id} 
                      onClick={() => { onOpenChat(friend); onClose(); }}
                      className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                    >
                      <img src={friend.user.avatar} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                      <div>
                        <p className="font-bold text-gray-900">{friend.user.name}</p>
                        <p className="text-xs text-gray-500">Friend · {friend.isOnline ? 'Active now' : 'Offline'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {results.posts.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Posts</h3>
                <div className="space-y-4">
                  {results.posts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => { onOpenPost(post.id); onClose(); }}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Newspaper className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{post.user.name}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{post.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Section */}
            {results.messages.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Messages</h3>
                <div className="space-y-4">
                  {results.messages.map(({ conv, msg }, i) => (
                    <div 
                      key={i} 
                      onClick={() => { onOpenChat(conv); onClose(); }}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <div className="bg-gray-100 p-2 rounded-full">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{conv.user.name}</p>
                        <p className="text-sm text-gray-700 truncate italic">"...{msg.text}..."</p>
                        <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900">No results found</h3>
                <p className="text-sm text-gray-500 mt-2">We couldn't find any results for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
