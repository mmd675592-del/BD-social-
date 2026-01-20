
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { PhoneOff, VideoOff } from 'lucide-react';

interface BitVideoOverlayProps {
  onClose: () => void;
}

export const BitVideoOverlay: React.FC<BitVideoOverlayProps> = ({ onClose }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopAllResources = () => {
    // 1. Clear intervals first to stop new frame requests
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    // 2. Close AI Session
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) { console.error("Video Session close error", e); }
      sessionRef.current = null;
    }

    // 3. Stop Stream (Camera and Mic)
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
      } catch (e) { console.error("Stream track stop error", e); }
      streamRef.current = null;
    }

    // 4. Close Audio Contexts
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) { console.error("Video Output context close error", e); }
      }
      audioContextRef.current = null;
    }
    if (inputAudioContextRef.current) {
      if (inputAudioContextRef.current.state !== 'closed') {
        try { inputAudioContextRef.current.close(); } catch (e) { console.error("Video Input context close error", e); }
      }
      inputAudioContextRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleEndCall = () => {
    try {
      stopAllResources();
    } catch (err) {
      console.error("End video call resource cleanup failed", err);
    } finally {
      // Ensure the component unmounts
      onClose();
    }
  };

  const startVideoCall = async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true }, 
        video: { width: 320, height: 240 } 
      });
      streamRef.current = stream;

      if (videoRef.current) videoRef.current.srcObject = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!sessionRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcm[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
              sessionPromise.then(s => {
                try { s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }); } catch (err) {}
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            frameIntervalRef.current = window.setInterval(() => {
              if (!videoRef.current || !canvasRef.current || !sessionRef.current) return;
              const canvas = canvasRef.current;
              const video = videoRef.current;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = 320;
                canvas.height = 240;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
                sessionPromise.then(s => {
                  try { s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }); } catch (err) {}
                });
              }
            }, 1000 / 5);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const binaryString = atob(audioData);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onerror: (e: any) => { setErrorMessage("ভিডিও কল সংযোগে সমস্যা হয়েছে।"); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are Bit chat i. Speak warm Bengali.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setErrorMessage("ভিডিও কল চালু করা যাচ্ছে না।");
    }
  };

  useEffect(() => {
    startVideoCall();
    return () => stopAllResources();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-between animate-in fade-in duration-500 overflow-hidden sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 shadow-2xl">
      <div className="absolute top-24 right-6 w-32 h-44 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-20">
        <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} />
        {isVideoOff && <div className="w-full h-full flex items-center justify-center bg-gray-900"><VideoOff className="w-8 h-8 text-gray-400" /></div>}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute top-6 left-6 right-6 flex flex-col z-30">
        <h2 className="text-2xl font-bold text-white">Bit chat i</h2>
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{errorMessage || (isConnecting ? 'লোড হচ্ছে...' : 'ভিডিও কল লাইভ')}</span>
      </div>

      <div className="w-full flex flex-col items-center gap-4 mb-16 z-10 px-6">
        <button type="button" onClick={handleEndCall} className="group flex flex-col items-center gap-3 focus:outline-none">
          <div className="p-7 bg-red-600 rounded-full shadow-2xl hover:bg-red-700 transition-all transform active:scale-90 flex items-center justify-center border-4 border-white/20">
            <PhoneOff className="w-9 h-9 text-white" />
          </div>
          <span className="text-sm font-bold text-white uppercase tracking-widest">কল শেষ করুন</span>
        </button>
      </div>
      
      {errorMessage && (
        <div className="absolute bottom-40 left-10 right-10 bg-red-600/90 backdrop-blur-md p-5 rounded-2xl text-white text-center text-sm font-bold animate-in zoom-in-95">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
