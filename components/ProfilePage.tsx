
import React, { useState, useRef } from 'react';
import { User, Post } from '../types';
import { Camera, Edit2, Plus, MessageCircle, UserPlus, UserCheck, MoreHorizontal, List, MapPin, Briefcase, GraduationCap, Heart, Globe, Search } from 'lucide-react';
import PostCard from './PostCard';
import EditProfileModal from './EditProfileModal';

interface ProfilePageProps {
  user: User;
  isCurrentUser: boolean;
  posts: Post[];
  onBack: () => void;
  onEditImage: (post: Post) => void;
  currentUser: User;
  onUpdateUser?: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  isCurrentUser, 
  posts, 
  onBack, 
  onEditImage, 
  currentUser,
  onUpdateUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Posts');
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'requested' | 'friends'>(isCurrentUser ? 'friends' : 'none');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const userPosts = posts.filter(p => p.user.id === user.id);

  const handleFriendAction = () => {
    if (friendshipStatus === 'none') setFriendshipStatus('requested');
    else if (friendshipStatus === 'requested') setFriendshipStatus('none');
  };

  const handleCoverUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, coverPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const mockFriendsList = Array.from({ length: 9 }).map((_, i) => ({
    id: `f${i}`,
    name: ['Alice Wonder', 'Bob Builder', 'Charlie Chaplin', 'David Beckham', 'Eva Green', 'Frank Castle', 'Grace Hopper', 'Harry Potter', 'Iris West'][i % 9],
    avatar: `https://picsum.photos/seed/friend${i}/200/200`,
    mutualFriends: Math.floor(Math.random() * 50)
  }));

  const renderPostsTab = () => (
    <div className="space-y-3">
      {/* Intro Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-3">Intro</h3>
        
        {user.bio ? (
          <p className="text-center text-[15px] mb-4 text-gray-800 font-medium px-2">{user.bio}</p>
        ) : isCurrentUser ? (
          <p className="text-center text-[15px] mb-4 text-gray-400 italic">No bio yet. Tell the world about yourself!</p>
        ) : null}

        {isCurrentUser && (
          <button 
            onClick={() => setShowEditModal(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md font-bold text-sm mb-5 active:scale-95 transition-all text-gray-800"
          >
            Edit Bio
          </button>
        )}

        <div className="space-y-4">
          {user.workplace && (
            <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-[15px]">Works at <b className="font-bold text-gray-900">{user.workplace}</b></span>
            </div>
          )}
          {user.education && (
            <div className="flex items-center gap-3 text-gray-700">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <span className="text-[15px]">Studied at <b className="font-bold text-gray-900">{user.education}</b></span>
            </div>
          )}
          {user.currentCity && (
            <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-[15px]">Lives in <b className="font-bold text-gray-900">{user.currentCity}</b></span>
            </div>
          )}
          {user.hometown && (
            <div className="flex items-center gap-3 text-gray-700">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-[15px]">From <b className="font-bold text-gray-900">{user.hometown}</b></span>
            </div>
          )}
          {user.relationshipStatus && (
            <div className="flex items-center gap-3 text-gray-700">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="text-[15px] font-medium text-gray-800">{user.relationshipStatus}</span>
            </div>
          )}

          {!user.workplace && !user.education && !user.currentCity && !user.hometown && !user.relationshipStatus && !isCurrentUser && (
            <p className="text-gray-400 text-sm italic text-center">No info shared yet.</p>
          )}

          {isCurrentUser && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md font-bold text-sm mt-4 active:scale-95 transition-all text-gray-800"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Friends Preview */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-bold">Friends</h3>
              <button onClick={() => setActiveSubTab('Friends')} className="text-[#1877F2] text-sm font-semibold hover:underline">See all friends</button>
          </div>
          <p className="text-gray-500 text-sm mb-4">{user.friendsCount || 0} friends</p>
          <div className="grid grid-cols-3 gap-x-2 gap-y-4">
              {mockFriendsList.slice(0, 6).map(friend => (
                  <div key={friend.id} className="cursor-pointer group">
                    <img src={friend.avatar} className="aspect-square w-full object-cover rounded-lg group-hover:opacity-90 transition-opacity border border-gray-100 shadow-sm" alt="" />
                    <p className="text-[11px] font-bold mt-1 text-gray-900 truncate">{friend.name}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* Posts Area */}
      <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Posts</h3>
              <div className="flex gap-2">
                <button className="bg-gray-100 p-2 rounded-md flex items-center gap-2 text-sm font-bold hover:bg-gray-200 transition-colors">
                  <List className="w-4 h-4" /> Filters
                </button>
              </div>
          </div>
          
          {userPosts.length > 0 ? (
              userPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser} 
                    onEditImage={onEditImage} 
                  />
              ))
          ) : (
              <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-400 italic">No posts yet.</p>
                  {isCurrentUser && (
                    <button className="mt-4 text-[#1877F2] font-bold hover:underline">Create your first post</button>
                  )}
              </div>
          )}
      </div>
    </div>
  );

  const renderFriendsTab = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h3 className="text-2xl font-bold">Friends</h3>
          <p className="text-gray-500 text-sm">{user.friendsCount || 0} friends</p>
        </div>
        <button className="text-[#1877F2] font-bold text-sm hover:underline">Find Friends</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-6">
        {mockFriendsList.map((friend) => (
          <div key={friend.id} className="cursor-pointer group">
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-1.5 relative border border-gray-100 shadow-sm">
              <img src={friend.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={friend.name} />
            </div>
            <p className="font-bold text-[13px] leading-tight mb-0.5 truncate text-gray-900">{friend.name}</p>
            <p className="text-[11px] text-gray-500">{friend.mutualFriends} mutual</p>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-bold mt-8 hover:bg-gray-200 transition-colors active:scale-[0.98]">
        See all friends
      </button>
    </div>
  );

  return (
    <div className="bg-[#F0F2F5] min-h-screen animate-in fade-in duration-300">
      {/* Cover and Profile Info */}
      <div className="bg-white pb-0 shadow-sm border-b border-gray-200">
        <div className="relative h-52 md:h-72 bg-gray-200 overflow-hidden group">
          <img 
            src={user.coverPhoto || `https://picsum.photos/seed/${user.id}-cover/800/300`} 
            className="w-full h-full object-cover" 
            alt="Cover" 
          />
          {isCurrentUser && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => coverInputRef.current?.click()}
                className="px-3 py-2 bg-white/95 rounded-md shadow-lg flex items-center gap-2 text-sm font-bold text-gray-900 active:scale-95 transition-all hover:bg-white"
              >
                <Camera className="w-5 h-5" /> <span className="hidden sm:inline">Edit cover photo</span>
              </button>
              <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpdate} />
            </div>
          )}
        </div>

        <div className="px-4 -mt-14 relative z-10 flex flex-col items-start md:items-start md:pl-8 pb-4">
          <div className="relative inline-block group">
            <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img 
                src={user.avatar} 
                className="w-full h-full object-cover" 
                alt={user.name} 
              />
            </div>
            {isCurrentUser && (
              <button 
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-3 right-1.5 p-2.5 bg-gray-100 rounded-full border-2 border-white shadow-md active:scale-95 transition-all hover:bg-gray-200"
              >
                <Camera className="w-5 h-5 text-gray-900" />
              </button>
            )}
          </div>
          
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 font-bold text-sm mt-0.5 hover:underline cursor-pointer">{user.friendsCount || 0} friends</p>
          </div>
          
          <div className="flex gap-2 mt-5 w-full">
            {isCurrentUser ? (
              <>
                <button className="flex-1 bg-[#1877F2] text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md hover:bg-blue-600">
                  <Plus className="w-5 h-5" /> Add to story
                </button>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-gray-200 border border-gray-200"
                >
                  <Edit2 className="w-4 h-4" /> Edit profile
                </button>
                <button className="bg-gray-100 p-2 rounded-md active:scale-95 transition-all hover:bg-gray-200 border border-gray-200">
                  <MoreHorizontal className="w-6 h-6 text-gray-700" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleFriendAction}
                  className={`flex-1 py-2 rounded-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm ${friendshipStatus === 'none' ? 'bg-[#1877F2] text-white' : 'bg-gray-100 text-gray-900'}`}
                >
                  {friendshipStatus === 'none' && <><UserPlus className="w-5 h-5" /> Add friend</>}
                  {friendshipStatus === 'requested' && <><UserCheck className="w-5 h-5" /> Requested</>}
                  {friendshipStatus === 'friends' && <><UserCheck className="w-5 h-5" /> Friends</>}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-gray-200">
                  <MessageCircle className="w-5 h-5" /> Message
                </button>
                <button className="bg-gray-100 p-2 rounded-md active:scale-95 transition-all hover:bg-gray-200">
                  <MoreHorizontal className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex border-t border-gray-100 mt-4 px-2 no-scrollbar overflow-x-auto bg-white">
            {['Posts', 'About', 'Friends', 'Photos'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-5 py-3.5 font-bold text-sm transition-all border-b-[3px] whitespace-nowrap ${activeSubTab === tab ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="p-3 pb-24">
        {activeSubTab === 'Posts' && renderPostsTab()}
        {activeSubTab === 'Friends' && renderFriendsTab()}
        {activeSubTab === 'About' && (
          <div className="bg-white p-5 rounded-lg shadow-sm space-y-7 border border-gray-100 animate-in fade-in duration-300">
             <h3 className="text-2xl font-bold text-gray-900 mb-6">About</h3>
             <div className="space-y-7">
                <div 
                  className={`flex items-start gap-4 transition-all ${isCurrentUser ? 'cursor-pointer' : ''}`}
                  onClick={() => isCurrentUser && setShowEditModal(true)}
                >
                  <Briefcase className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900 font-medium">
                      {user.workplace ? <>Works at <b className="font-bold text-gray-900">{user.workplace}</b></> : <span className="text-gray-400">Add workplace</span>}
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-start gap-4 transition-all ${isCurrentUser ? 'cursor-pointer' : ''}`}
                  onClick={() => isCurrentUser && setShowEditModal(true)}
                >
                  <GraduationCap className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900 font-medium">
                      {user.education ? <>Studied at <b className="font-bold text-gray-900">{user.education}</b></> : <span className="text-gray-400">Add education</span>}
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-start gap-4 transition-all ${isCurrentUser ? 'cursor-pointer' : ''}`}
                  onClick={() => isCurrentUser && setShowEditModal(true)}
                >
                  <MapPin className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900 font-medium">
                      {user.currentCity ? <>Lives in <b className="font-bold text-gray-900">{user.currentCity}</b></> : <span className="text-gray-400">Add current city</span>}
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-start gap-4 transition-all ${isCurrentUser ? 'cursor-pointer' : ''}`}
                  onClick={() => isCurrentUser && setShowEditModal(true)}
                >
                  <Globe className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900 font-medium">
                      {user.hometown ? <>From <b className="font-bold text-gray-900">{user.hometown}</b></> : <span className="text-gray-400">Add hometown</span>}
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-start gap-4 transition-all ${isCurrentUser ? 'cursor-pointer' : ''}`}
                  onClick={() => isCurrentUser && setShowEditModal(true)}
                >
                  <Heart className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900 font-medium">
                      {user.relationshipStatus || <span className="text-gray-400">Add relationship status</span>}
                    </p>
                  </div>
                </div>
             </div>
             {isCurrentUser && (
               <button 
                onClick={() => setShowEditModal(true)}
                className="w-full mt-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
               >
                 Edit public details
               </button>
             )}
          </div>
        )}
        {activeSubTab === 'Photos' && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Photos</h3>
                <button className="text-[#1877F2] font-bold text-sm hover:underline">See all photos</button>
             </div>
             <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4,5,6].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${user.id}-${i+20}/400/400`} className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer border border-gray-100 shadow-sm" alt="" />
                ))}
             </div>
          </div>
        )}
      </div>

      {showEditModal && isCurrentUser && onUpdateUser && (
        <EditProfileModal 
          user={user} 
          onClose={() => setShowEditModal(false)} 
          onSave={(updated) => {
            onUpdateUser(updated);
            setShowEditModal(false);
          }} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
