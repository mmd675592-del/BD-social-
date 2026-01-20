
import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, User, ChatMessage } from '../types';
import { X, Phone, Video, Info, Smile, Image as ImageIcon, PlusCircle, ThumbsUp, Send, Loader2, Mic, Trash2, Wand2 } from 'lucide-react';
import { getBitChatResponse } from '../services/geminiService';
import { BitVoiceOverlay } from './BitVoiceOverlay';
import { BitVideoOverlay } from './BitVideoOverlay';

interface ChatWindowProps {
  chat: ChatConversation;
  currentUser: User;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage({
          data: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          sendVoiceMessage(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      audioChunksRef.current = [];
    }
  };

  const sendVoiceMessage = async (audioData: string) => {
    const voiceMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      audio: audioData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, voiceMsg]);

    if (chat.isBot) {
      setIsTyping(true);
      const botResponse = await getBitChatResponse("ভয়েস মেসেজটি পেয়েছি।");
      setIsTyping(false);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: chat.user.id,
        text: botResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachedImage) return;
    
    const userMsgText = inputText;
    const userAttachedImg = attachedImage;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: userMsgText || (userAttachedImg ? "ছবি শেয়ার করেছেন" : ""),
      image: userAttachedImg?.data,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedImage(null);

    if (chat.isBot) {
      setIsTyping(true);
      const botResponse = await getBitChatResponse(userMsgText, userAttachedImg || undefined);
      setIsTyping(false);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: chat.user.id,
        text: botResponse.text,
        image: botResponse.image,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="fixed inset-0 sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 bg-white z-[100] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shadow-sm bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <Send className="w-5 h-5 rotate-180 text-[#1877F2]" />
            </button>
            <div className="relative">
              <img src={chat.user.avatar} className="w-9 h-9 rounded-full border border-gray-100 object-cover" alt="" />
              {chat.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">{chat.user.name}</span>
              <span className="text-[10px] text-gray-500">{chat.isOnline ? 'Active now' : 'Active long ago'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#1877F2]">
            <button 
              onClick={() => chat.isBot && setShowVoice(true)} 
              className="p-2 hover:bg-gray-100 rounded-full active:bg-gray-200"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => chat.isBot && setShowVideo(true)}
              className="p-2 hover:bg-gray-100 rounded-full active:bg-gray-200"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><Info className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#F3F3F5]">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] shadow-sm ${
                  isMe 
                    ? 'bg-[#1877F2] text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                  {msg.image && (
                    <img src={msg.image} className="mb-2 rounded-lg w-full h-auto object-cover max-h-[300px] border border-gray-100" alt="Content" />
                  )}
                  {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  {msg.audio && (
                    <div className="min-w-[150px] py-1">
                      <audio controls src={msg.audio} className={`w-full max-w-[200px] h-8 ${isMe ? 'filter invert' : ''}`} />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1 tracking-tight">{msg.timestamp}</span>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm animate-pulse">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#1877F2] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#1877F2] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#1877F2] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-gray-400 font-medium italic">Bit chat i ভাবছে...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-3 py-2 border-t border-gray-100 bg-white shadow-lg">
          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="relative inline-block mb-3 group animate-in slide-in-from-bottom-2 duration-200">
              <img src={attachedImage.data} className="w-24 h-24 object-cover rounded-xl border-2 border-[#1877F2] shadow-md" alt="Attachment" />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none flex items-center justify-center">
                 <Wand2 className="w-8 h-8 text-[#1877F2] opacity-50" />
              </div>
            </div>
          )}

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between bg-red-50 rounded-full px-4 py-2.5 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-red-600 font-bold text-[15px]">{formatTime(recordingTime)}</span>
                <span className="text-red-400 text-xs font-semibold">রেকর্ডিং...</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={cancelRecording} className="p-1.5 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={stopRecording} className="bg-red-500 text-white p-2.5 rounded-full shadow-lg active:scale-95 transition-transform">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <div className="flex gap-2">
                <button className="text-[#1877F2] p-1.5 hover:bg-blue-50 rounded-full transition-colors">
                  <PlusCircle className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#1877F2] p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button onClick={startRecording} className="text-[#1877F2] p-1.5 hover:bg-blue-50 rounded-full transition-colors">
                  <Mic className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 border border-gray-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Aa"
                  className="bg-transparent border-none outline-none text-[15px] w-full focus:ring-0 text-gray-800"
                />
                <Smile className="w-5 h-5 text-[#1877F2] ml-2 cursor-pointer hover:scale-110 transition-transform" />
              </div>

              {(inputText.trim() || attachedImage) ? (
                <button 
                  onClick={handleSendMessage} 
                  className="p-2.5 bg-[#1877F2] rounded-full text-white shadow-md active:scale-90 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button className="p-2 text-[#1877F2] active:scale-90 transition-transform hover:bg-blue-50 rounded-full">
                  <ThumbsUp className="w-6 h-6 fill-[#1877F2]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showVoice && <BitVoiceOverlay onClose={() => setShowVoice(false)} />}
      {showVideo && <BitVideoOverlay onClose={() => setShowVideo(false)} />}
    </>
  );
};

export default ChatWindow;
