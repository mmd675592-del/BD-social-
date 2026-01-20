
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { PhoneOff } from 'lucide-react';

interface BitVoiceOverlayProps {
  onClose: () => void;
}

const VOICES = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'] as const;
type VoiceName = typeof VOICES[number];

export const BitVoiceOverlay: React.FC<BitVoiceOverlayProps> = ({ onClose }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const stopAllResources = () => {
    // Stop the AI Session
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { console.error("Session close error", e); }
      sessionRef.current = null;
    }
    
    // Stop Microphone Tracks
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) { console.error("Stream stop error", e); }
      streamRef.current = null;
    }
    
    // Close Output Audio Context
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) { console.error("Output context close error", e); }
      }
      audioContextRef.current = null;
    }
    
    // Close Input Audio Context
    if (inputAudioContextRef.current) {
      if (inputAudioContextRef.current.state !== 'closed') {
        try { inputAudioContextRef.current.close(); } catch (e) { console.error("Input context close error", e); }
      }
      inputAudioContextRef.current = null;
    }
    
    analyserRef.current = null;
  };

  const handleEndCall = () => {
    try {
      stopAllResources();
    } catch (err) {
      console.error("End call resource cleanup failed", err);
    } finally {
      // Force the overlay to close regardless of cleanup success
      onClose();
    }
  };

  const startVoice = async (voiceName: VoiceName) => {
    setIsConnecting(true);
    setErrorMessage(null);
    nextStartTimeRef.current = 0;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000 } 
      });
      streamRef.current = stream;

      const sourceNode = inputCtx.createMediaStreamSource(stream);
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      sourceNode.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 128);
        requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e: any) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcm[i] = inputData[i] * 32768;
              const bytes = new Uint8Array(pcm.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
              const base64 = btoa(binary);
              sessionPromise.then(s => {
                try { s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }); } catch (err) {}
              });
            };
            sourceNode.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
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
          onerror: (e: any) => { setErrorMessage("সংযোগ বিচ্ছিন্ন হয়েছে।"); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are Bit chat i. Speak warm Bengali.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setErrorMessage("নেটওয়ার্ক ত্রুটি।");
    }
  };

  useEffect(() => {
    startVoice('Kore');
    return () => stopAllResources();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1877F2] z-[200] flex flex-col items-center justify-center p-10 text-white animate-in fade-in duration-500 sm:max-w-[450px] sm:left-1/2 sm:-translate-x-1/2 shadow-2xl">
      <div className="flex flex-col items-center w-full mb-auto mt-20">
        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center relative ring-4 ring-white/10">
          <img src="https://img.icons8.com/fluency/96/artificial-intelligence.png" className="w-20 h-20 relative z-10" alt="" />
          <div className="absolute inset-0 bg-white/30 rounded-full transition-transform duration-75 ease-out" style={{ transform: `scale(${1 + audioLevel * 0.5})` }}></div>
        </div>
        <h2 className="text-3xl font-bold mt-6">Bit chat i</h2>
        <p className="mt-4 text-sm font-semibold opacity-90">{errorMessage || (isConnecting ? 'সংযোগ করা হচ্ছে...' : 'শুনছি... আপনার সাথে বাংলায় কথা বলছি।')}</p>
      </div>

      <button type="button" onClick={handleEndCall} className="group flex flex-col items-center gap-3 mb-20 focus:outline-none">
        <div className="p-7 bg-red-600 rounded-full shadow-2xl hover:bg-red-700 transition-all transform active:scale-90 flex items-center justify-center border-4 border-white/20">
          <PhoneOff className="w-9 h-9 text-white" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-widest">কল শেষ করুন</span>
      </button>
    </div>
  );
};
