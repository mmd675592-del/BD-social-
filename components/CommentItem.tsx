
import React, { useState, useRef, useEffect } from 'react';
import { Comment, User } from '../types';
import { Send, Check, X } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  currentUser: User;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUser, isReply = false }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [commentText, setCommentText] = useState(comment.text);
  
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddReply = () => {
    if (!replyText.trim()) return;
    const newReply: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      text: replyText,
      timestamp: 'Just now',
      likes: 0,
    };
    setReplies([...replies, newReply]);
    setReplyText('');
    setShowReplyInput(false);
  };

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    setCommentText(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(commentText);
    setIsEditing(false);
  };

  const isOwnComment = comment.user.id === currentUser.id;

  return (
    <div className={`flex gap-2 ${isReply ? 'mt-2 ml-10' : 'mt-4 animate-in fade-in slide-in-from-left-2 duration-300'}`}>
      <img src={comment.user.avatar} className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm" alt="" />
      <div className="flex-1 min-w-0">
        <div className="inline-block bg-[#F0F2F5] px-3 py-2 rounded-2xl max-w-full relative group">
          <p className="text-xs font-bold hover:underline cursor-pointer mb-0.5">{comment.user.name}</p>
          
          {isEditing ? (
            <div className="flex items-center gap-1 min-w-[200px]">
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm w-full outline-none focus:ring-1 focus:ring-[#1877F2]"
              />
              <button 
                onClick={handleSaveEdit}
                className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={handleCancelEdit}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-800 leading-tight break-words">{commentText}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1 ml-2 text-xs font-bold text-gray-500">
          <button className="hover:underline active:scale-95 transition-transform">Like</button>
          <button className="hover:underline active:scale-95 transition-transform" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>
          
          {isOwnComment && !isEditing && (
            <button 
              className="hover:underline active:scale-95 transition-transform text-[#1877F2]" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
          
          <span className="font-normal">{comment.timestamp}</span>
          
          {comment.likes > 0 && (
            <span className="flex items-center gap-1 text-gray-400 font-normal">
              <span className="bg-blue-500 text-white rounded-full p-0.5 text-[8px] animate-in zoom-in">👍</span>
              {comment.likes}
            </span>
          )}
        </div>

        {showReplyInput && (
          <div className="mt-2 flex gap-2 animate-in slide-in-from-top-2 duration-200">
            <img src={currentUser.avatar} className="w-6 h-6 rounded-full" alt="" />
            <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-3 py-1 relative pr-8 border border-gray-200">
              <input
                autoFocus
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
                placeholder={`Reply to ${comment.user.name.split(' ')[0]}...`}
                className="bg-transparent border-none outline-none text-sm w-full py-1 focus:ring-0"
              />
              {replyText.trim() && (
                <button 
                  onClick={handleAddReply}
                  className="absolute right-2 p-1 text-[#1877F2] hover:bg-gray-200 rounded-full transition-all animate-in zoom-in"
                >
                  <Send className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} currentUser={currentUser} isReply />
        ))}
      </div>
    </div>
  );
};

export default CommentItem;
