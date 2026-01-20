
import React, { useState } from 'react';
import { Post, ReactionType, User } from '../types';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, X, Send, Users } from 'lucide-react';
import ReactionPicker from './ReactionPicker';
import CommentItem from './CommentItem';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onEditImage: (post: Post) => void;
  onUserClick?: (user: User) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onEditImage, onUserClick }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [showComments, setShowComments] = useState(false);
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
    const iconClass = "inline-block animate-in zoom-in duration-300";
    switch (type) {
      case 'love': return <span className={iconClass}>❤️ Love</span>;
      case 'care': return <span className={iconClass}>🥰 Care</span>;
      case 'haha': return <span className={iconClass}>😆 Haha</span>;
      case 'wow': return <span className={iconClass}>😮 Wow</span>;
      case 'sad': return <span className={iconClass}>😢 Sad</span>;
      case 'angry': return <span className={iconClass}>😡 Angry</span>;
      case 'like': return <span className={`${iconClass} text-[#1877F2]`}>👍 Like</span>;
      default: return <><ThumbsUp className="w-5 h-5" /><span>Like</span></>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <img 
            src={post.user.avatar} 
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity" 
            alt={post.user.name} 
            onClick={() => onUserClick?.(post.user)}
          />
          <div>
            <h4 
              className="text-sm font-bold hover:underline cursor-pointer"
              onClick={() => onUserClick?.(post.user)}
            >
              {post.user.name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{post.timestamp}</span>
              <span>·</span>
              <Users className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="flex space-x-2 text-gray-500">
          <MoreHorizontal className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1" />
          <X className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1" />
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.image && (
        <div className="relative group">
          <img src={post.image} className="w-full object-cover max-h-[500px]" alt="Post" />
        </div>
      )}

      {/* Interaction Counts */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex -space-x-1">
            <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </div>
            <div className="bg-red-500 rounded-full p-1 border-2 border-white">
              <span className="text-[8px] text-white leading-none">❤️</span>
            </div>
          </div>
          <span className="animate-in fade-in duration-300">{post.likes + (userReaction ? 1 : 0)}</span>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowComments(!showComments)} className="hover:underline">
            {comments.length} comments
          </button>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center p-1 relative">
        <div 
          className="flex-1 relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {showReactions && <ReactionPicker onSelect={(type) => { setUserReaction(type); setShowReactions(false); }} />}
          <button 
            onClick={() => setUserReaction(userReaction ? null : 'like')}
            className={`w-full flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md font-semibold transition-all active:scale-90 ${userReaction ? 'text-[#1877F2]' : 'text-gray-600'}`}
          >
            {getReactionIcon(userReaction)}
          </button>
        </div>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-semibold transition-colors active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-semibold transition-colors active:scale-95">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3 pb-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-2 mt-3">
            <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt="" />
            <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-3 py-1 relative pr-10">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="bg-transparent border-none outline-none text-sm w-full py-1.5 focus:ring-0"
              />
              {newComment.trim() && (
                <button 
                  onClick={handleAddComment}
                  className="absolute right-3 p-1 text-[#1877F2] hover:bg-gray-200 rounded-full transition-all animate-in zoom-in"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
