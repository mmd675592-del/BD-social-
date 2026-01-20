
import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Wand2, RefreshCcw } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

interface AIEditorModalProps {
  initialImage: string;
  onClose: () => void;
  onSave: (editedImage: string) => void;
}

const AIEditorModal: React.FC<AIEditorModalProps> = ({ initialImage, onClose, onSave }) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await editImageWithGemini(currentImage, prompt);
      setCurrentImage(result);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || "Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(initialImage);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        {/* Left: Image View */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative min-h-[300px]">
          <img 
            src={currentImage} 
            className="max-w-full max-h-full object-contain" 
            alt="Editing" 
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#1877F2]" />
              <p className="font-bold text-xl">Gemini is re-imagining your photo...</p>
              <p className="text-sm opacity-80 mt-2 italic">Thinking, drawing, and refining textures...</p>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-80 p-6 flex flex-col bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wand2 className="text-[#1877F2]" /> Gemini Edit
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-700">
              <p className="flex items-center gap-1 font-semibold mb-1">
                <Sparkles className="w-4 h-4" /> Pro Tip
              </p>
              Try "Make it look like a oil painting" or "Add a sunny beach in the background".
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should Gemini do?"
                className="w-full h-32 p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none text-sm resize-none shadow-sm"
                disabled={isProcessing}
              />
              <button
                onClick={handleApply}
                disabled={isProcessing || !prompt.trim()}
                className="absolute bottom-3 right-3 p-2 bg-[#1877F2] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1877F2] transition-colors"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                {error}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={isProcessing || currentImage === initialImage}
              className="w-full py-2 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm disabled:opacity-30"
            >
              <RefreshCcw className="w-4 h-4" /> Reset to Original
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(currentImage)}
              className="flex-1 py-2 bg-[#1877F2] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Update Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEditorModal;
