"use client"
import React, { useState, useEffect } from 'react';
import { Check, X, Shield, Zap, Clock, Flame, ShieldAlert } from 'lucide-react';

const PasswordGame = () => {
  const [password, setPassword] = useState('');
  const [reachedStep, setReachedStep] = useState(0);

  // --- CRACK TIME LOGIC (Educational + Visual) ---
  const calculateEntropy = (pw: string) => {
    if (!pw) return 0;
    let charset = 0;
    if (/[a-z]/.test(pw)) charset += 26;
    if (/[A-Z]/.test(pw)) charset += 26;
    if (/[0-9]/.test(pw)) charset += 10;
    if (/[^A-Za-z0-9]/.test(pw)) charset += 32;
    return pw.length * Math.log2(charset || 1);
  };

  const getCrackTime = (pw: string) => {
    const entropy = calculateEntropy(pw);
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / 10_000_000_000; // 10bn guesses/sec

    if (seconds < 1) return { label: "Instantly", color: "text-red-500", bg: "border-red-500" };
    if (seconds < 3600) return { label: "Minutes", color: "text-orange-500", bg: "border-orange-500" };
    if (seconds < 86400) return { label: "Hours", color: "text-yellow-500", bg: "border-yellow-500" };
    if (seconds < 31536000) return { label: "Months", color: "text-blue-400", bg: "border-blue-400" };
    return { label: "Centuries", color: "text-green-400", bg: "border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]" };
  };

  const isPrime = (num: number) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false;
    return num > 1;
  };

  const rules = [
    {
      id: 1,
      desc: "Your password must be at least 8 characters.",
      check: (pw: string) => pw.length >= 8,
    },
    {
      id: 2,
      desc: "Include a BIG letter (Duo likes it when you shout).",
      check: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      id: 3,
      desc: "Include a number (to track your 0-day streak).",
      check: (pw: string) => /\d/.test(pw),
    },
    {
      id: 4,
      desc: "Add a special character. Use $ for money or ! for panic.",
      check: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
    {
      id: 5,
      desc: "Your password length must be a prime number (7, 11, 13, 17...).",
      check: (pw: string) => isPrime(pw.length),
    },
    {
      id: 6,
      desc: "Include the name of the current month (lowercase is fine).",
      check: (pw: string) => /february/i.test(pw),
    },
    {
      id: 7,
      desc: "The digits in your password must add up to 20.",
      check: (pw: string) => {
        const digits = pw.match(/\d/g);
        return digits ? digits.reduce((a, b) => a + parseInt(b), 0) === 20 : false;
      },
    },
  ];

  const crackInfo = getCrackTime(password);
  const activeRules = rules.slice(0, reachedStep + 1);
  const allPassed = rules.every(rule => rule.check(password));

  useEffect(() => {
    const currentMax = rules.findIndex(rule => !rule.check(password));
    if (currentMax === -1) {
      setReachedStep(rules.length - 1);
    } else if (currentMax > reachedStep) {
      setReachedStep(currentMax);
    }
  }, [password, reachedStep]);

  return (
    <div className="min-h-screen bg-[#131f24] text-[#e5e5e5] p-4 flex flex-col items-center">
      
      {/* Top Header Section */}
      <div className="w-full max-w-xl flex items-center gap-4 mb-6">
        <X className="text-[#4b4b4b] cursor-pointer" />
        <div className="flex-1 h-4 bg-[#37464f] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58cc02] transition-all duration-700 shadow-[0_0_10px_rgba(88,204,2,0.4)]" 
            style={{ width: `${((reachedStep + 1) / rules.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-[#ff9600] font-black">
          <Flame size={22} fill="#ff9600" />
          <span>{reachedStep}</span>
        </div>
      </div>

      {/* The Crack Timer (Neal.fun style UI) */}
      <div className={`w-full max-w-xl p-4 mb-6 border-2 rounded-2xl transition-all duration-300 ${crackInfo.bg} bg-[#1b2d35]`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className={crackInfo.color} />
            <span className="font-bold uppercase tracking-tight text-xs opacity-70">Brute-Force Estimate</span>
          </div>
          <span className={`text-xl font-black ${crackInfo.color}`}>{crackInfo.label}</span>
        </div>
      </div>

      {/* Duo Mascot */}
      <div className="w-full max-w-xl flex gap-4 mb-8 items-start">
        <div className="w-20 h-20 bg-[#58cc02] rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl shadow-[0_6px_0_#46a302]">
          🦉
        </div>
        <div className="relative bg-[#1b2d35] border-2 border-[#37464f] rounded-2xl p-4 flex-1">
          <div className="absolute left-0 top-1/2 -translate-x-2.5 -translate-y-1/2 w-4 h-4 bg-[#1b2d35] border-l-2 border-b-2 border-[#37464f] rotate-45" />
          <p className="font-bold text-lg leading-tight">
            &quot;Your password is weak. My <span className="text-[#3b7cf3]">threat model</span> is you.&quot;
          </p>
        </div>
      </div>

      {/* Password Input */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#afafaf]">Security Key Input</label>
          <span className="text-[10px] font-mono text-[#3b7cf3] uppercase">Entropy: {Math.round(calculateEntropy(password))} bits</span>
        </div>
        <textarea
          className="w-full bg-[#131f24] border-2 border-[#37464f] rounded-2xl p-5 text-2xl font-mono text-white focus:border-[#3b7cf3] focus:outline-none transition-all shadow-inner resize-none min-h-[100px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type or perish..."
        />
      </div>

      {/* Rules List - Newest on Top */}
      <div className="w-full max-w-xl space-y-4 mb-32">
        {[...activeRules].reverse().map((rule) => {
          const isPassed = rule.check(password);
          return (
            <div 
              key={rule.id}
              className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
                isPassed 
                ? 'bg-[#131f24] border-[#58cc02] opacity-50 scale-95' 
                : 'bg-[#131f24] border-[#ff4b4b] animate-bounce-subtle shadow-[0_0_20px_rgba(255,75,75,0.1)]'
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isPassed ? 'bg-[#58cc02]' : 'bg-[#ff4b4b]'}`}>
                  {isPassed ? <Check size={18} className="text-[#131f24]" strokeWidth={4} /> : <ShieldAlert size={18} className="text-[#131f24]" strokeWidth={4} />}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isPassed ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                    Security Layer {rule.id}
                  </p>
                  <p className="font-bold text-[#e5e5e5] text-lg">{rule.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#131f24] border-t-2 border-[#37464f] p-6 flex justify-center backdrop-blur-md bg-opacity-90">
        <button 
          disabled={!allPassed}
          className={`w-full max-w-xl py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all ${
            allPassed 
            ? 'bg-[#58cc02] text-[#131f24] shadow-[0_5px_0_#46a302] hover:bg-[#61e002] active:translate-y-1 active:shadow-none' 
            : 'bg-[#37464f] text-[#52656d] cursor-not-allowed shadow-[0_5px_0_#1b272d]'
          }`}
        >
          {allPassed ? "Save Password" : "Fix Vulnerabilities"}
        </button>
      </div>
    </div>
  );
};

export default PasswordGame;