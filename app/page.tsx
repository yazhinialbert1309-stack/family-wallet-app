"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, History, LogOut, User, Lock, UserPlus } from 'lucide-react';

export default function Home() {
  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- DASHBOARD STATES ---
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);
  
  // Input Form States
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- AUTH HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      localStorage.setItem(`user_${username}`, password);
      setIsSignUp(false); setAuthError(''); setPassword('');
      alert('கணக்கு உருவாக்கப்பட்டது! இப்போது Login செய்யவும்.');
    } else {
      const savedPass = localStorage.getItem(`user_${username}`);
      if (savedPass && savedPass === password) {
        setIsLoggedIn(true);
        setAuthError('');
      } else {
        setAuthError('தவறான பயனர் பெயர் அல்லது கடவுச்சொல்!');
      }
    }
  };

  // --- DATA HANDLERS ---
  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const newEntry = {
      id: Date.now(),
      person,
      reason,
      amount: val,
      type,
      date: new Date().toLocaleDateString()
    };

    setTransactions([newEntry, ...transactions]);

    // Update Chart
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

  // --- UI: LOGIN / SIGNUP ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-[30px] shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-purple-600 rounded-2xl text-white mb-3 shadow-lg"><Wallet size={32} /></div>
            <h1 className="text-2xl font-black text-gray-800">Family Wallet</h1>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="text" placeholder="Username" className="w-full p-3 pl-10 bg-gray-50 rounded-xl outline-none border focus:border-purple-300" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="password" placeholder="Password" className="w-full p-3 pl-10 bg-gray-50 rounded-xl outline-none border focus:border-purple-300" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
            <button className="w-full p-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus size={20} /> : <Lock size={20} />} {isSignUp ? 'Create Account' : 'Login'}
            </button>
          </div>
          <p onClick={() => {setIsSignUp(!isSignUp); setAuthError('');}} className="mt-6 text-center text-sm text-purple-600 font-bold cursor-pointer hover:underline">
            {isSignUp ? 'ஏற்கனவே கணக்கு உள்ளதா? Login' : 'புதிய கணக்கு உருவாக்க வேண்டுமா? Sign Up'}
          </p>
        </form>
      </div>
    );
  }

  // --- UI: DASHBOARD ---
  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-[25px] shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-600 rounded-lg text-white"><Wallet size={24} /></div>
             <h1 className="text-xl font-black text-gray-800">Dashboard</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 p-2 px-4 rounded-xl transition-all"><LogOut size={18} /> Logout</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* New Entry Form */}
          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-purple-600" /> New Entry</h2>
            <div className="space-y-4">
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
              </select>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Food 🍔</option><option>Rent 🏠</option><option>Shopping 🛍️</option><option>Electricity ⚡</option><option>Travel 🚗</option>
              </select>
              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-lg" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                 <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                 <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl hover:bg-purple-700 transition-all mt-4">ADD TO BUDGET</button>
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 h-[450px]">
            <h2 className="text-xl font-bold mb-8">Monthly Status</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={40} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={50} />
                <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={50} radius={} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Table with Delete */}
        <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> Transaction History</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50 uppercase tracking-widest">
                <th className="pb-4">Member</th><th className="pb-4">Reason</th><th className="pb-4 text-right">Amount</th><th className="pb-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                  <td className="py-5 font-bold text-gray-900">{t.person}</td>
                  <td className="py-5 font-medium text-gray-600">{t.reason}</td>
                  <td className={`py-5 text-right font-black ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                    {t.type === 'expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="py-5 text-center">
                    <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p className="text-center py-10 text-gray-400 italic">No transactions yet!</p>}
        </div>
      </div>
    </main>
  );
}
