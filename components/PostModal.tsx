
import React, { useState } from 'react';
import { Post, User, ReactionType } from '../types';
import { X, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Send } from 'lucide-react';
import ReactionPicker from './ReactionPicker';
import CommentItem from './CommentItem';

interface PostModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onEditImage: (post: Post) => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, currentUser, onClose, onEditImage }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [comments, setComments] = useState(post.commentsList);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      user: currentUser,
      text: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const getReactionIcon = (type: ReactionType | null) => {
    switch (type) {
      case 'love': return <span className="text-red-500">❤️ Love</span>;
      case 'care': return <span className="text-yellow-500">🥰 Care</span>;
      case 'haha': return <span className="text-yellow-500">😆 Haha</span>;
      case 'wow': return <span className="text-yellow-500">😮 Wow</span>;
      case 'sad': return <span className="text-yellow-500">😢 Sad</span>;
      case 'angry': return <span className="text-orange-600">😡 Angry</span>;
      case 'like': return <span className="text-[#1877F2]">👍 Like</span>;
      default: return <><ThumbsUp className="w-5 h-5" /><span>Like</span></>;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[80] flex items-center justify-center p-0 md:p-10">
      <div className="bg-white w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full md:hidden">
          <X className="w-6 h-6" />
        </button>

        {/* Left: Image (if exists) or Main Content Area */}
        <div className={`flex-[1.5] bg-black flex items-center justify-center relative ${!post.image ? 'hidden md:flex' : ''}`}>
           {post.image ? (
             <img src={post.image} className="max-w-full max-h-full object-contain" alt="Post" />
           ) : (
             <div className="text-white p-10 text-xl font-semibold text-center">{post.content}</div>
           )}
        </div>

        {/* Right: Interaction Area */}
        <div className="flex-1 flex flex-col bg-white border-l border-gray-100 min-w-0 h-full overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img src={post.user.avatar} className="w-10 h-10 rounded-full" alt="" />
              <div>
                <h4 className="text-sm font-bold hover:underline cursor-pointer">{post.user.name}</h4>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
              <button onClick={onClose} className="hidden md:block p-1 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <p className="text-sm text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Counts */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100 text-xs text-gray-500 mb-2">
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  <div className="bg-blue-500 rounded-full p-1 border border-white">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                </div>
                <span>{post.likes + (userReaction ? 1 : 0)}</span>
              </div>
              <div className="flex space-x-3">
                <span>{comments.length} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center p-1 border-b border-gray-100 mb-4">
              <div 
                className="flex-1 relative"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {showReactions && <ReactionPicker onSelect={(type) => { setUserReaction(type); setShowReactions(false); }} />}
                <button 
                  onClick={() => setUserReaction(userReaction ? null : 'like')}
                  className={`w-full flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md font-semibold transition-colors ${userReaction ? 'text-[#1877F2]' : 'text-gray-600'}`}
                >
                  {getReactionIcon(userReaction)}
                </button>
              </div>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-semibold transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>Comment</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-semibold transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-1">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} currentUser={currentUser} />
              ))}
            </div>
          </div>

          {/* Footer: Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt="" />
              <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 relative pr-10">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Write a comment..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
                {newComment.trim() && (
                  <button 
                    onClick={handleAddComment}
                    className="absolute right-3 p-1 text-[#1877F2] hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
