"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Wallet, LogOut, History, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);
  
  // Input Form States
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food & Grocery 🍎');
  const [customReason, setCustomReason] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- AUTH HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      localStorage.setItem(`user_${username}`, password);
      setIsSignUp(false); setAuthError(''); setPassword('');
      alert('கணக்கு உருவாக்கப்பட்டது!');
    } else {
      const savedPass = localStorage.getItem(`user_${username}`);
      if (savedPass === password) { setIsLoggedIn(true); setAuthError(''); }
      else { setAuthError('தவறான பாஸ்வேர்ட்!'); }
    }
  };

  // --- DATA HANDLERS ---
  const handleAdd = () => {
    if (!amount) return;
    const finalReason = reason === 'Other ➕' ? customReason : reason;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason: finalReason, amount: val, type, date: new Date().toLocaleDateString() };
    
    setTransactions([newEntry, ...transactions]);
    const newData = [...data];
    if (type === 'expense') newData[0].expense += val;
    else newData[0].savings += val;
    setData(newData);
    setAmount(''); setCustomReason('');
  };

  const handleDelete = (id: number, amt: number, entryType: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    const newData = [...data];
    if (entryType === 'expense') newData[0].expense -= amt;
    else newData[0].savings -= amt;
    setData(newData);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100 text-black">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-purple-600 rounded-3xl text-white mb-3 shadow-lg shadow-purple-100"><Wallet size={36} /></div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Family Wallet</h1>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:ring-2 focus:ring-purple-200 transition-all" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:ring-2 focus:ring-purple-200 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
            <button className="w-full p-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 transition-all">
              {isSignUp ? 'Create Account' : 'Login Now'}
            </button>
          </div>
          <p onClick={() => {setIsSignUp(!isSignUp); setAuthError('');}} className="mt-6 text-center text-sm text-purple-600 cursor-pointer font-bold hover:underline">
            {isSignUp ? 'ஏற்கனவே கணக்கு உள்ளதா? Login' : 'புதிய கணக்கு வேண்டுமா? Sign Up'}
          </p>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-6 rounded-[35px] shadow-sm mb-10 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-100"><Wallet size={24} /></div>
            <h1 className="text-2xl font-black text-gray-800">Family Dashboard</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-3 px-6 rounded-2xl hover:bg-red-100 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* New Entry Form */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={22} className="text-purple-600" /> New Entry</h2>
            
            <div className="space-y-4 font-medium">
              <label className="text-xs text-gray-400 font-bold uppercase ml-1">யார்?</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option>
                <option>Amma 👩</option>
                <option>Me 👦</option>
                <option>Brother 👨‍🦱</option>
                <option>Sister 👧</option>
                <option>Thatha 👴</option>
                <option>Paati 👵</option>
              </select>

              <label className="text-xs text-gray-400 font-bold uppercase ml-1">காரணம்?</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                <optgroup label="Daily Essentials">
                  <option>Food & Grocery 🍎</option>
                  <option>Milk 🥛</option>
                  <option>Rent & Home 🏠</option>
                  <option>Electricity Bill ⚡</option>
                  <option>Water Bill 💧</option>
                  <option>Gas Cylinder 🔋</option>
                </optgroup>
                <optgroup label="Transport & Communication">
                  <option>Petrol/Diesel 🚗</option>
                  <option>Bus/Train Fare 🚌</option>
                  <option>Mobile Recharge 📱</option>
                  <option>Internet/WiFi 📡</option>
                </optgroup>
                <optgroup label="Education & Health">
                  <option>School/College Fees 🎓</option>
                  <option>Books & Stationeries 📚</option>
                  <option>Medical/Hospital 💊</option>
                  <option>Medicines 🏥</option>
                </optgroup>
                <optgroup label="Lifestyle & Savings">
                  <option>Shopping/Clothes 🛍️</option>
                  <option>Entertainment 🎬</option>
                  <option>Gold Savings 🥇</option>
                  <option>Monthly Savings 💰</option>
                  <option>Emergency Fund 🚨</option>
                  <option>Other ➕</option>
                </optgroup>
              </select>

              {reason === 'Other ➕' && (
                <input type="text" placeholder="Type other reason..." className="w-full p-4 bg-purple-50 rounded-2xl outline-none border border-purple-100" value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
              )}

              <label className="text-xs text-gray-400 font-bold uppercase ml-1">தொகை?</label>
              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />

              <div className="flex gap-3 p-1.5 bg-gray-100 rounded-2xl">
                <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>

              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-[25px] shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all mt-4">
                ADD TO WALLET
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-[500px]">
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Monthly Splitup</h2>
              <p className="text-gray-400 text-sm font-medium mb-10 tracking-wide">Expense vs Savings Analysis</p>
            </div>
            
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={60} radius={} />
                  <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={60} radius={} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><History size={24} className="text-purple-600" /> Recent Activities</h2>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-widest"><CheckCircle2 size={12}/> Secure</div>
            </div>
          </div>
          
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-50 uppercase font-black tracking-[0.2em]">
                <th className="pb-6">Family Member</th>
                <th className="pb-6">Reason</th>
                <th className="pb-6 text-right">Amount</th>
                <th className="pb-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-6 font-black text-gray-900">{t.person}</td>
                  <td className="py-6 text-gray-500 font-bold">{t.reason}</td>
                  <td className={`py-6 text-right font-black text-lg ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {t.type === 'expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="py-6 text-center">
                    <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500 bg-gray-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p className="text-center py-20 text-gray-300 font-bold italic uppercase tracking-widest">No Activities Found</p>}
        </div>
      </div>
    </main>
  );
}
