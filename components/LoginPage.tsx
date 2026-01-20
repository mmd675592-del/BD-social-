
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => void;
  onOpenSignup: () => void;
  error?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onOpenSignup, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center pt-10 px-4 sm:max-w-[450px] sm:mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-[#1877F2] text-5xl font-bold mb-2">facebook</h1>
        <p className="text-gray-600 text-lg sm:text-xl px-4">
          Connect with friends and the world around you on Facebook.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Mobile number or email address"
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1877F2] text-[17px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1877F2] text-[17px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#1877F2] text-white py-3 rounded-lg font-bold text-xl hover:bg-blue-600 transition-colors active:scale-[0.98]"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-[#1877F2] text-sm hover:underline">Forgotten password?</a>
        </div>

        <div className="my-6 border-t border-gray-200"></div>

        <div className="flex justify-center">
          <button
            onClick={onOpenSignup}
            className="bg-[#42b72a] text-white px-5 py-3 rounded-lg font-bold text-[17px] hover:bg-[#36a420] transition-colors active:scale-[0.98]"
          >
            Create new account
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p><b>Create a Page</b> for a celebrity, brand or business.</p>
      </div>
    </div>
  );
};

export default LoginPage;
