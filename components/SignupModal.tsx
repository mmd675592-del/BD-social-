
import React, { useState, useRef } from 'react';
import { X, Camera, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, AlertCircle, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (userData: any) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    age: '',
    selfie: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    agreed: false
  });

  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Validation for Step 1: Name (No icons/stickers)
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s\u0980-\u09FF]+$/; // Letters and Bengali characters only
    return nameRegex.test(name);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.firstName || !formData.surname) return setError("পুরো নাম লিখুন।");
      if (!validateName(formData.firstName) || !validateName(formData.surname)) {
        return setError("নামে কোনো স্টিকার বা স্পেশাল ক্যারেক্টার ব্যবহার করা যাবে না।");
      }
    } else if (step === 2) {
      const ageNum = parseInt(formData.age);
      if (!formData.age || isNaN(ageNum)) return setError("আপনার বয়স লিখুন।");
      if (ageNum < 15) return setError("একাউন্ট খুলতে আপনার বয়স কমপক্ষে ১৫ বছর হতে হবে।");
    } else if (step === 3) {
      if (!formData.selfie) return setError("দয়া করে একটি সেলফি তুলুন বা গ্যালারি থেকে ছবি দিন।");
    } else if (step === 4) {
      if (!formData.email) return setError("ফোন নম্বর বা ই-মেইল দিন।");
    } else if (step === 5) {
      if (formData.password.length < 6) return setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      if (formData.password !== formData.confirmPassword) return setError("পাসওয়ার্ড দুটি মেলেনি।");
    } else if (step === 6) {
      if (!formData.gender) return setError("আপনার লিঙ্গ নির্বাচন করুন।");
    }

    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (isCameraActive) stopCamera();
    if (step > 1) setStep(step - 1);
  };

  // Camera Logic
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError("ক্যামেরা চালু করা যাচ্ছে না। দয়া করে ব্রাউজারের পারমিশন চেক করুন।");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData({ ...formData, selfie: dataUrl });
        stopCamera();
      }
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, selfie: reader.result as string });
        if (isCameraActive) stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-gray-800">আপনার নাম কি?</h3>
            <p className="text-sm text-gray-500">নামে কোনো ইমোজি বা স্টিকার ব্যবহার করবেন না।</p>
            <div className="flex gap-2">
              <input 
                type="text" placeholder="নামের প্রথম অংশ" value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none"
              />
              <input 
                type="text" placeholder="পদবী" value={formData.surname}
                onChange={(e) => setFormData({...formData, surname: e.target.value})}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-gray-800">আপনার বয়স কত?</h3>
            <input 
              type="number" placeholder="আপনার বয়স (যেমন: ২০)" value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none text-lg"
            />
            <p className="text-xs text-gray-400">১৫ বছরের নিচে একাউন্ট খোলা সম্ভব নয়।</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
            <h3 className="text-xl font-bold text-gray-800">আপনার একটি ছবি দিন</h3>
            <p className="text-sm text-gray-500 mb-2">আপনি সরাসরি সেলফি তুলতে পারেন অথবা গ্যালারি থেকে দিতে পারেন।</p>
            
            <div className="relative aspect-square w-full max-w-[250px] mx-auto bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center shadow-inner group">
              {formData.selfie ? (
                <img src={formData.selfie} className="w-full h-full object-cover" alt="Selected" />
              ) : isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover mirror-mode" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-12 h-12 text-gray-300" />
                  <span className="text-xs text-gray-400">কোনো ছবি নেই</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {!formData.selfie ? (
                !isCameraActive ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={startCamera} 
                      className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-600 transition-all"
                    >
                      <Camera className="w-4 h-4" /> সেলফি তুলুন
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      <ImageIcon className="w-4 h-4" /> গ্যালারি
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={takeSelfie} 
                      className="bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 animate-pulse"
                    >
                      ছবি ক্যাপচার করুন
                    </button>
                    <button 
                      onClick={stopCamera} 
                      className="bg-red-50 text-red-500 py-3 rounded-xl font-bold"
                    >
                      বাতিল
                    </button>
                  </div>
                )
              ) : (
                <button 
                  onClick={() => { setFormData({...formData, selfie: ''}); }} 
                  className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:underline"
                >
                  <RotateCcw className="w-4 h-4" /> অন্য ছবি ব্যবহার করুন
                </button>
              )}
            </div>
            
            <input 
              type="file" ref={fileInputRef} onChange={handleGalleryUpload} 
              className="hidden" accept="image/*" 
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-gray-800">আপনার কন্টাক্ট ইনফো দিন</h3>
            <input 
              type="text" placeholder="মোবাইল নম্বর বা ই-মেইল এড্রেস" value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-gray-800">পাসওয়ার্ড সেট করুন</h3>
            <input 
              type="password" placeholder="নতুন পাসওয়ার্ড" value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none"
            />
            <input 
              type="password" placeholder="পাসওয়ার্ড নিশ্চিত করুন" value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1877F2] outline-none mt-2"
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-gray-800">লিঙ্গ নির্বাচন করুন</h3>
            <div className="grid grid-cols-1 gap-3">
              {['নারী (Female)', 'পুরুষ (Male)', 'তৃতীয় লিঙ্গ (Custom)'].map((g) => (
                <label key={g} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${formData.gender === g ? 'border-[#1877F2] bg-blue-50 ring-2 ring-blue-100 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="font-bold text-gray-700">{g}</span>
                  <input type="radio" name="gender" className="w-5 h-5 accent-[#1877F2]" checked={formData.gender === g} onChange={() => setFormData({...formData, gender: g})} />
                </label>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <ShieldCheck className="w-16 h-16 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800">সবশেষে: নীতিমালা</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                একাউন্ট তৈরি করতে আমাদের নীতিমালা এবং ডাটা পলিসি মেনে নিতে হবে। আপনার তথ্য আমাদের সার্ভারে নিরাপদ থাকবে।
              </p>
            </div>
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer mt-6 border border-gray-200">
              <input 
                type="checkbox" 
                checked={formData.agreed} 
                onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                className="mt-1 w-5 h-5 accent-[#1877F2]" 
              />
              <span className="text-sm text-gray-700 font-medium">আমি ফেসবুক ক্লোন এর সকল শর্তাবলী এবং নীতিমালা মেনে নিচ্ছি।</span>
            </label>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[450px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col min-h-[550px] overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 flex">
          <div 
            className="h-full bg-[#1877F2] transition-all duration-500 shadow-[0_0_10px_rgba(24,119,242,0.5)]" 
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <span className="text-xs font-bold text-[#1877F2] uppercase tracking-widest">ধাপ {step} / ৭</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-4 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {renderStep()}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-50">
          {step < 7 ? (
            <button
              onClick={handleNext}
              className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
            >
              চালিয়ে যান <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled={!formData.agreed}
              onClick={() => {
                if (isCameraActive) stopCamera();
                onSignup(formData);
              }}
              className="w-full bg-[#00a400] disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#008a00] active:scale-95 transition-all shadow-xl"
            >
              একাউন্ট তৈরি করুন <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <style>{`
        .mirror-mode {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default SignupModal;
