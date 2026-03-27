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
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- AUTH HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isSignUp) {
      // Sign Up: பிரவுசரில் சேமிக்கிறோம்
      localStorage.setItem(`user_${username}`, password);
      alert('கணக்கு உருவாக்கப்பட்டது! இப்போது லாகின் செய்யவும்.');
      setIsSignUp(false);
      setPassword('');
    } else {
      // Login: சேமிக்கப்பட்ட பாஸ்வேர்டை சரிபார்க்கிறோம்
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
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason, amount: val, type, date: new Date().toLocaleDateString() };
    
    setMonthlyData(prev => {
      const monthKey = activeMonth as keyof typeof prev;
      const current = prev[monthKey];
      return {
        ...prev,
        [monthKey]: {
          ...current,
          transactions: [newEntry, ...current.transactions],
          expense: type === 'expense' ? current.expense + val : current.expense,
          savings: type === 'savings' ? current.savings + val : current.savings,
        }
      };
    });
    setAmount('');
  };

  const handleDelete = (id: number, amt: number, entryType: string) => {
    setMonthlyData(prev => {
      const monthKey = activeMonth as keyof typeof prev;
      const current = prev[monthKey];
      return {
        ...prev,
        [monthKey]: {
          ...current,
          transactions: current.transactions.filter(t => t.id !== id),
          expense: entryType === 'expense' ? current.expense - amt : current.expense,
          savings: entryType === 'savings' ? current.savings - amt : current.savings,
        }
      };
    });
  };

  const currentMonthStats = monthlyData[activeMonth as keyof typeof monthlyData];
  const isOverBudget = currentMonthStats.expense > BUDGET_LIMIT;

  // --- LOGIN / SIGNUP UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 text-black">
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-md border">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-purple-600 rounded-3xl text-white mb-3 shadow-lg shadow-purple-100">
              <Wallet size={36} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Family Wallet</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
              {isSignUp ? 'Create New Account' : 'Secure Member Login'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-purple-300 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-purple-300 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {authError && <p className="text-rose-500 text-sm font-bold text-center">{authError}</p>}

            <button type="submit" className="w-full p-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus size={20} /> : <Lock size={20} />}
              {isSignUp ? 'REGISTER' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
              className="text-purple-600 font-bold text-sm hover:underline"
            >
              {isSignUp ? 'ஏற்கனவே அக்கவுண்ட் உள்ளதா? Login' : 'புதிய அக்கவுண்ட் வேண்டுமா? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-[30px] shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl text-white"><Wallet size={24} /></div>
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">Dashboard</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">User: {currentUser}</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold bg-red-50 p-2 px-5 rounded-2xl flex items-center gap-2 hover:bg-red-100 transition-all text-sm">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['Jan', 'Feb', 'Mar'].map((m) => (
            <button key={m} onClick={() => setActiveMonth(m)} className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shrink-0 ${activeMonth === m ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-400 border'}`}>
              <Calendar size={18} /> {m}
            </button>
          ))}
        </div>

        {isOverBudget && (
          <div className="bg-rose-50 border-l-8 border-rose-500 p-6 rounded-3xl mb-8 flex items-center gap-4 shadow-sm animate-pulse">
            <div className="p-3 bg-rose-500 rounded-2xl text-white"><AlertCircle size={28} /></div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 leading-none">Budget Warning! 🚨</h3>
              <p className="text-rose-600 font-medium text-sm mt-1">பட்ஜெட் வரம்பைத் தாண்டிவிட்டீர்கள்!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800"><PlusCircle size={22} className="text-purple-600" /> New Entry ({activeMonth})</h2>
            <div className="space-y-4 font-medium">
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
              </select>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Food & Grocery 🍎</option><option>Rent 🏠</option><option>Electricity ⚡</option><option>Shopping 🛍️</option><option>Medical 💊</option>
              </select>
              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-[25px] shadow-xl hover:bg-purple-700 transition-all mt-4">ADD ENTRY</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[450px]">
            <h2 className="text-2xl font-black text-gray-800 mb-10">{activeMonth} Analysis</h2>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ month: activeMonth, expense: currentMonthStats.expense, savings: currentMonthStats.savings }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" hide />
                  <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
                  <Bar dataKey="expense" name="Expense" stackId="a" fill={isOverBudget ? "#f43f5e" : "#7C3AED"} barSize={80} />
                  <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={80} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> {activeMonth} Activities</h2>
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-50 uppercase font-black tracking-widest">
                <th className="pb-6">Member</th><th className="pb-6">Reason</th><th className="pb-6 text-right">Amount</th><th className="pb-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthStats.transactions.map((t: any) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-6 font-black text-gray-900">{t.person}</td>
                  <td className="py-6 text-gray-500 font-bold">{t.reason}</td>
                  <td className={`py-6 text-right font-black text-lg ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {t.type === 'expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="py-6 text-center">
                    <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-400 hover:text-rose-500 transition-all"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
