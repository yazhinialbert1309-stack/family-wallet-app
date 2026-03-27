"use client"

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Trash2, PlusCircle, Wallet, History, LogOut, Lock, User, UserPlus } from 'lucide-react';

export default function Home() {
  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Sign Up பக்கமா அல்லது Login பக்கமா
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  // --- DASHBOARD STATES ---
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);

  // Form States
  const [member, setMember] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- AUTH HANDLERS ---
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setAuthError('கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும்!');
      return;
    }
    // Browser-ன் Local Storage-ல் சேமிக்கிறோம் (Simple Database)
    localStorage.setItem(`user_${username}`, password);
    alert('கணக்கு உருவாக்கப்பட்டது! இப்போது லாகின் செய்யவும்.');
    setIsSignUp(false);
    setAuthError('');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem(`user_${username}`);
    
    if (savedPassword && savedPassword === password) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      setAuthError('');
    } else {
      setAuthError('பயனர் பெயர் அல்லது கடவுச்சொல் தவறு!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // --- DASHBOARD HANDLERS ---
  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { id: Date.now(), name: member, reason, amount: val, type, date: today };
    
    setTransactions([newEntry, ...transactions]);
    const newData = [...data];
    if (type === 'expense') newData[0].expense += val;
    else newData[0].savings += val;
    setData(newData);
    setAmount('');
  };

  const handleDelete = (id: number, amt: number, entryType: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    const newData = [...data];
    if (entryType === 'expense') newData[0].expense -= amt;
    else newData[0].savings -= amt;
    setData(newData);
  };

  // --- 1. LOGIN / SIGNUP UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100 transition-all duration-500">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-5 bg-purple-600 rounded-[25px] text-white mb-4 shadow-xl shadow-purple-200">
              <Wallet size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Family Wallet</h1>
            <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">
              {isSignUp ? 'Create New Account' : 'Secure Member Login'}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="பயனர் பெயர் (Username)" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 transition-all font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="கடவுச்சொல் (Set Password)" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {authError && <p className="text-rose-500 text-sm font-bold text-center animate-pulse">{authError}</p>}

            <button 
              type="submit" 
              className="w-full p-5 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isSignUp ? <UserPlus size={20} /> : <Lock size={20} />}
              {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN TO WALLET'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
              className="text-purple-600 font-bold text-sm hover:underline"
            >
              {isSignUp ? 'ஏற்கனவே கணக்கு உள்ளதா? Login செய்யவும்' : 'புதிய கணக்கு உருவாக்க வேண்டுமா? Sign Up செய்யவும்'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. DASHBOARD UI ---
  return (
    <main className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between p-6 bg-white rounded-[35px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg"><Wallet size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Family Wallet</h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter italic">Logged in as: {currentUser}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 p-3 px-5 bg-rose-50 text-rose-500 font-bold rounded-2xl hover:bg-rose-100 transition-all text-sm">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[35px] shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800"><PlusCircle size={20} className="text-purple-600" /> New Entry</h2>
            <div className="space-y-4">
              <select value={member} onChange={(e) => setMember(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium"><option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option></select>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium"><option>Food 🍔</option><option>Rent 🏠</option><option>Shopping 🛍️</option></select>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-lg" />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                 <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                 <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-2xl shadow-xl mt-4 hover:bg-purple-700 transition-all">ADD TO BUDGET</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm min-h-[400px]">
             <h2 className="text-xl font-bold mb-8 text-gray-800 uppercase tracking-tight">Wallet Status</h2>
             <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
                    <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={60} radius={} />
                    <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={60} radius={} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="mt-10 bg-white p-8 rounded-[40px] shadow-sm mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> Member History</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50 uppercase tracking-widest"><th className="pb-4">Member</th><th className="pb-4">Reason</th><th className="pb-4 text-right">Amount</th><th className="pb-4 text-center">Action</th></tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-5 font-bold text-gray-900">{t.name}</td>
                  <td className="py-5 font-medium text-gray-600">{t.reason}</td>
                  <td className={`py-5 text-right font-black ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>₹{t.amount.toLocaleString()}</td>
                  <td className="py-5 text-center"><button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500 transition-all"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
