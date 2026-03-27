"use client"

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Trash2, Wallet, LogOut, History, PlusCircle, AlertCircle, Calendar, User, Lock, UserPlus } from 'lucide-react';

export default function Home() {
  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  // --- DASHBOARD STATES ---
  const [activeMonth, setActiveMonth] = useState('Mar');
  const [monthlyData, setMonthlyData] = useState({
    'Jan': { expense: 0, savings: 0, transactions: [] },
    'Feb': { expense: 0, savings: 0, transactions: [] },
    'Mar': { expense: 0, savings: 0, transactions: [] },
  });

  const BUDGET_LIMIT = 10000;

  // Form States
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food & Grocery 🍎');
  const [customReason, setCustomReason] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- AUTH HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isSignUp) {
      localStorage.setItem(`user_${username}`, password);
      alert('கணக்கு உருவாக்கப்பட்டது! இப்போது லாகின் செய்யவும்.');
      setIsSignUp(false);
      setPassword('');
    } else {
      const savedPass = localStorage.getItem(`user_${username}`);
      if (savedPass && savedPass === password) {
        setIsLoggedIn(true);
        setCurrentUser(username);
      } else {
        setAuthError('தவறான பயனர் பெயர் அல்லது கடவுச்சொல்!');
      }
    }
  };

  // --- DASHBOARD HANDLERS ---
  const handleAdd = () => {
    if (!amount) return;
    const finalReason = reason === 'Other ➕' ? customReason : reason;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason: finalReason, amount: val, type, date: new Date().toLocaleDateString() };
    
    setMonthlyData(prev => {
      const monthKey = activeMonth as keyof typeof prev;
      const current = prev[monthKey];
      return {
        ...prev,
        [monthKey]: {
          ...current,
          transactions: [newEntry, ...current.transactions] as any,
          expense: type === 'expense' ? current.expense + val : current.expense,
          savings: type === 'savings' ? current.savings + val : current.savings,
        }
      };
    });
    setAmount(''); setCustomReason('');
  };

  const handleDelete = (id: number, amt: number, entryType: string) => {
    setMonthlyData(prev => {
      const monthKey = activeMonth as keyof typeof prev;
      const current = prev[monthKey];
      return {
        ...prev,
        [monthKey]: {
          ...current,
          transactions: current.transactions.filter((t: any) => t.id !== id),
          expense: entryType === 'expense' ? current.expense - amt : current.expense,
          savings: entryType === 'savings' ? current.savings - amt : current.savings,
        }
      };
    });
  };

  const currentMonthStats = monthlyData[activeMonth as keyof typeof monthlyData];
  const isOverBudget = currentMonthStats.expense > BUDGET_LIMIT;
  const balance = currentMonthStats.savings - currentMonthStats.expense;

  // --- 1. LOGIN / SIGNUP UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 text-black font-sans">
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-4 bg-purple-600 rounded-[22px] text-white mb-3 shadow-xl shadow-purple-100">
              <Wallet size={36} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Family Wallet</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
              {isSignUp ? 'Create New Account' : 'Secure Member Login'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="text" placeholder="Username" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-purple-300 transition-all" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="password" placeholder="Password" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-purple-300 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {authError && <p className="text-rose-500 text-sm font-bold text-center">{authError}</p>}
            <button type="submit" className="w-full p-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus size={20} /> : <Lock size={20} />} {isSignUp ? 'REGISTER' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} className="text-purple-600 font-bold text-sm hover:underline">
              {isSignUp ? 'Account ஏற்கனவே உள்ளதா? Login' : 'புதிய அக்கவுண்ட் வேண்டுமா? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. DASHBOARD UI ---
  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-[30px] shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-50"><Wallet size={24} /></div>
            <div>
              <h1 className="text-xl font-black text-gray-800 leading-none">Dashboard</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Hello, {currentUser}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Balance</p>
              <p className={`text-xl font-black ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>₹{balance.toLocaleString()}</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold bg-red-50 p-2 px-5 rounded-2xl flex items-center gap-2 hover:bg-red-100 transition-all text-sm shadow-sm border border-red-100">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['Jan', 'Feb', 'Mar'].map((m) => (
            <button key={m} onClick={() => setActiveMonth(m)} className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shrink-0 transition-all ${activeMonth === m ? 'bg-purple-600 text-white shadow-lg shadow-purple-50' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <Calendar size={18} /> {m}
            </button>
          ))}
        </div>

        {isOverBudget && (
          <div className="bg-rose-50 border-l-8 border-rose-500 p-6 rounded-3xl mb-8 flex items-center gap-4 shadow-sm animate-pulse">
            <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-100"><AlertCircle size={28} /></div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 leading-none">Budget Warning! 🚨</h3>
              <p className="text-rose-600 font-medium text-sm mt-1">இந்த மாத பட்ஜெட் வரம்பைத் தாண்டிவிட்டீர்கள்!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-gray-800 font-medium">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={22} className="text-purple-600" /> New Entry ({activeMonth})</h2>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Member</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option><option>Brother 👨‍🦱</option><option>Sister 👧</option><option>Thatha 👴</option><option>Paati 👵</option>
              </select>
              <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Reason</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Food & Grocery 🍎</option><option>Rent 🏠</option><option>Electricity ⚡</option><option>Petrol/Travel 🚗</option><option>Mobile Recharge 📱</option><option>Medical 💊</option><option>Savings 💰</option><option>Other ➕</option>
              </select>
              {reason === 'Other ➕' && <input type="text" placeholder="Type reason..." className="w-full p-4 bg-purple-50 rounded-2xl border border-purple-100 outline-none" value={customReason} onChange={(e) => setCustomReason(e.target.value)} />}
              <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Amount</label>
              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
                <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-[25px] shadow-xl hover:bg-purple-700 transition-all mt-4">ADD TO WALLET</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[450px]">
            <h2 className="text-2xl font-black text-gray-800 mb-10">{activeMonth} Splitup</h2>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ month: activeMonth, expense: currentMonthStats.expense, savings: currentMonthStats.savings }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" hide /><YAxis axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="expense" name="Expense" stackId="a" fill={isOverBudget ? "#f43f5e" : "#7C3AED"} barSize={80} />
                  <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={80} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> {activeMonth} Activities</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] border-b border-gray-50 uppercase font-black tracking-[0.2em]"><th className="pb-6">Member</th><th className="pb-6">Reason</th><th className="pb-6 text-right">Amount</th><th className="pb-6 text-center">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentMonthStats.transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-6 font-black text-gray-900">{t.person}</td>
                  <td className="py-6 text-gray-500 font-bold">{t.reason}</td>
                  <td className={`py-6 text-right font-black text-lg ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>₹{t.amount.toLocaleString()}</td>
                  <td className="py-6 text-center"><button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500 bg-gray-50 rounded-xl transition-all"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentMonthStats.transactions.length === 0 && <p className="text-center py-20 text-gray-300 font-black uppercase tracking-widest italic opacity-50">No Data Found</p>}
        </div>
      </div>
    </main>
  );
}
