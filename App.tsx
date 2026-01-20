
import React, { useState, useEffect } from 'react';
import { User, Post, AppNotification, ChatConversation } from './types';
import Header from './components/Header';
import PostCard from './components/PostCard';
import AIEditorModal from './components/AIEditorModal';
import StorySection from './components/StorySection';
import PostModal from './components/PostModal';
import ChatWindow from './components/ChatWindow';
import SearchOverlay from './components/SearchOverlay';
import ProfilePage from './components/ProfilePage';
import FriendsTab from './components/FriendsTab';
import LoginPage from './components/LoginPage';
import SignupModal from './components/SignupModal';
import MessengerOverlay from './components/MessengerOverlay';
import { LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

const INITIAL_USER_ID = 'session_user';
const STORAGE_KEY = 'clone_registered_users';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: { id: 'ai-news', name: 'Future Tech', avatar: 'https://picsum.photos/seed/tech/100/100' },
    content: "Android ফেইসবুক অ্যাপ ইন্টারফেস ট্রাই করছি! এটা কেমন হয়েছে?",
    image: 'https://picsum.photos/seed/mobile/800/600',
    timestamp: '2h',
    likes: 420,
    reactions: [{ type: 'like', count: 420 }],
    commentsCount: 15,
    commentsList: [],
    shares: 12
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  // Messenger & Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      user: { id: 'u1', name: 'Rakib Hasan', avatar: 'https://picsum.photos/seed/rakib/100/100' },
      type: 'like',
      content: 'liked your post.',
      timestamp: '2 mins ago',
      isRead: false
    },
    {
      id: 'n2',
      user: { id: 'u2', name: 'Sumaiya Akhter', avatar: 'https://picsum.photos/seed/sumaiya/100/100' },
      type: 'comment',
      content: 'commented on your photo: "অসাধারণ হয়েছে!"',
      timestamp: '1 hour ago',
      isRead: false
    },
    {
      id: 'n3',
      user: { id: 'u3', name: 'Sajid Islam', avatar: 'https://picsum.photos/seed/sajid/100/100' },
      type: 'friend_request',
      content: 'sent you a friend request.',
      timestamp: '3 hours ago',
      isRead: true
    }
  ]);

  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'bit-chat-i',
      user: { id: 'bot-1', name: 'Bit chat i', avatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png' },
      lastMessage: 'হ্যালো! আমি আপনার AI অ্যাসিস্ট্যান্ট। আমি কি আপনাকে সাহায্য করতে পারি?',
      lastMessageTime: 'Now',
      unreadCount: 1,
      isOnline: true,
      isBot: true,
      messages: []
    },
    {
      id: 'c1',
      user: { id: 'u4', name: 'Asif Zaman', avatar: 'https://picsum.photos/seed/asif/100/100' },
      lastMessage: 'কাল কি দেখা হবে?',
      lastMessageTime: '10:30 AM',
      unreadCount: 0,
      isOnline: true,
      messages: []
    },
    {
      id: 'c2',
      user: { id: 'u5', name: 'Nila Chowdhury', avatar: 'https://picsum.photos/seed/nila/100/100' },
      lastMessage: 'ছবিগুলো পাঠিয়েছি।',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      messages: []
    }
  ]);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [focusedPostId, setFocusedPostId] = useState<string | null>(null);
  const [showMessenger, setShowMessenger] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(INITIAL_USER_ID);
    if (session) {
      setCurrentUser(JSON.parse(session));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string, pass: string) => {
    setLoginError(null);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === pass);

    if (user) {
      const loginUser: User = {
        id: email,
        name: `${user.firstName} ${user.surname}`,
        avatar: user.selfie || `https://picsum.photos/seed/${email}/100/100`,
        bio: "Just joined FaceClone!",
        friendsCount: 0
      };
      setCurrentUser(loginUser);
      localStorage.setItem(INITIAL_USER_ID, JSON.stringify(loginUser));
      triggerWelcome();
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleSignup = (userData: any) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (users.find((u: any) => u.email === userData.email)) {
      alert("Email/Phone already registered!");
      return;
    }
    
    users.push(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    const newUser: User = {
      id: userData.email,
      name: `${userData.firstName} ${userData.surname}`,
      avatar: userData.selfie || `https://picsum.photos/seed/${userData.email}/100/100`,
      bio: "Excited to be here!",
      friendsCount: 0
    };
    
    setCurrentUser(newUser);
    localStorage.setItem(INITIAL_USER_ID, JSON.stringify(newUser));
    setShowSignup(false);
    triggerWelcome();
  };

  const triggerWelcome = () => {
    setIsWelcomeVisible(true);
    setTimeout(() => {
      setIsWelcomeVisible(false);
      setIsAuthenticated(true);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem(INITIAL_USER_ID);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    if (notif.targetId) {
       setFocusedPostId(notif.targetId);
    }
  };

  const handleChatClick = (chat: ChatConversation) => {
    setActiveChat(chat);
    setShowMessenger(false);
    // Clear unread count when clicking chat
    setConversations(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
  };

  const handleUserClick = (user: User) => {
    setViewedUser(user);
    setActiveTab('profile');
  };

  if (isWelcomeVisible) {
    return (
      <div className="fixed inset-0 bg-[#1877F2] z-[300] flex flex-col items-center justify-center animate-in fade-in duration-500 sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Sparkles className="w-full h-full text-white" />
        </div>
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-90 slide-in-from-bottom-10 duration-1000">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
              <img src={currentUser?.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-4 border-[#1877F2]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-white text-3xl font-black tracking-tight">Welcome to your profile</h2>
            <p className="text-white/90 text-2xl font-semibold opacity-0 animate-in fade-in delay-500 fill-mode-forwards">
              {currentUser?.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F0F2F5] min-h-screen">
        <LoginPage onLogin={handleLogin} onOpenSignup={() => setShowSignup(true)} error={loginError} />
        {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={handleSignup} />}
      </div>
    );
  }

  if (!currentUser) return null;

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const unreadMsgCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 relative overflow-hidden">
      <Header 
        activeTab={activeTab === 'profile' && viewedUser?.id === currentUser.id ? 'profile' : activeTab} 
        onTabChange={setActiveTab}
        unreadNotifications={unreadNotifCount}
        unreadMessages={unreadMsgCount}
        onOpenMessenger={() => setShowMessenger(true)}
        onOpenSearch={() => setShowSearch(true)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        conversations={conversations}
        onChatClick={handleChatClick}
      />
      
      <main className="flex-1 overflow-y-auto pt-[100px] no-scrollbar pb-20">
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-4 mb-2 shadow-sm border-b border-gray-200">
              <div className="flex items-start gap-3">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => handleUserClick(currentUser)} alt="" />
                <div className="flex-1">
                  <div className="w-full bg-gray-100 p-2.5 rounded-full text-gray-500 text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                    What's on your mind, {currentUser.name.split(' ')[0]}?
                  </div>
                </div>
              </div>
            </div>
            <StorySection currentUser={currentUser} stories={[]} onViewStory={() => {}} />
            <div className="space-y-2 mt-2">
              {posts.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} onEditImage={setEditingPost} onUserClick={handleUserClick} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'friends' && <FriendsTab onUserClick={handleUserClick} />}
        
        {activeTab === 'notifications' && (
           <div className="bg-white min-h-full animate-in fade-in duration-300">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-2xl font-bold">Notifications</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-start gap-3 p-4 cursor-pointer active:bg-gray-100 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <img src={n.user.avatar} className="w-14 h-14 rounded-full" alt="" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-tight">
                        <span className="font-bold">{n.user.name}</span> {n.content}
                      </p>
                      <p className={`text-xs mt-1 ${!n.isRead ? 'text-[#1877F2] font-bold' : 'text-gray-500'}`}>{n.timestamp}</p>
                    </div>
                    {!n.isRead && <div className="w-3 h-3 bg-[#1877F2] rounded-full mt-5"></div>}
                  </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === 'profile' && viewedUser && (
          <ProfilePage user={viewedUser} isCurrentUser={viewedUser.id === currentUser.id} posts={posts} currentUser={currentUser} onBack={() => setActiveTab('home')} onEditImage={setEditingPost} />
        )}

        {activeTab === 'menu' && (
          <div className="bg-[#F0F2F5] h-full p-4 space-y-4 overflow-y-auto no-scrollbar">
             <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer flex justify-between items-center" onClick={() => handleUserClick(currentUser)}>
               <div className="flex items-center gap-3">
                 <img src={currentUser.avatar} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                 <div>
                   <h3 className="font-bold text-lg">{currentUser.name}</h3>
                   <p className="text-gray-500 text-xs">আপনার প্রোফাইল দেখুন</p>
                 </div>
               </div>
               <Sparkles className="w-5 h-5 text-yellow-500" />
             </div>
             
             <button 
               onClick={handleLogout}
               className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-3 text-red-600 font-bold hover:bg-red-50 transition-colors"
             >
               <LogOut className="w-6 h-6" /> Log Out
             </button>
          </div>
        )}
      </main>

      {showMessenger && (
        <MessengerOverlay 
          conversations={conversations} 
          onClose={() => setShowMessenger(false)} 
          onChatClick={handleChatClick} 
        />
      )}

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} posts={posts} conversations={conversations} onOpenChat={handleChatClick} onOpenPost={setFocusedPostId} />}
      {activeChat && <ChatWindow chat={activeChat} currentUser={currentUser} onClose={() => setActiveChat(null)} />}
      {focusedPostId && <PostModal post={posts.find(p => p.id === focusedPostId)!} currentUser={currentUser} onClose={() => setFocusedPostId(null)} onEditImage={setEditingPost} />}
    </div>
  );
};

export default App;
