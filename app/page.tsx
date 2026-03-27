"use client"

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Trash2, Wallet, LogOut, History, PlusCircle } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);
  
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food & Grocery 🍎');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

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

  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason, amount: val, type, date: new Date().toLocaleDateString() };
    
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md text-black">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-purple-600 rounded-3xl text-white mb-3 shadow-lg"><Wallet size={36} /></div>
            <h1 className="text-3xl font-black text-gray-900">Family Wallet</h1>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
            <button className="w-full p-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 transition-all">
              {isSignUp ? 'Create Account' : 'Login'}
            </button>
          </div>
          <p onClick={() => {setIsSignUp(!isSignUp); setAuthError('');}} className="mt-6 text-center text-sm text-purple-600 cursor-pointer font-bold hover:underline">
            {isSignUp ? 'Login here' : 'New account? Sign Up'}
          </p>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-[25px] shadow-sm mb-10 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-xl text-white"><Wallet size={24} /></div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-2 px-4 rounded-xl hover:bg-red-100 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={22} className="text-purple-600" /> New Entry</h2>
            <div className="space-y-4 font-medium">
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option><option>Brother 👨‍🦱</option><option>Sister 👧</option>
              </select>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Food & Grocery 🍎</option><option>Rent 🏠</option><option>Electricity ⚡</option><option>Petrol/Diesel 🚗</option><option>Mobile Recharge 📱</option><option>School Fees 🎓</option><option>Medical 💊</option><option>Shopping 🛍️</option><option>Savings 💰</option>
              </select>
              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-[25px] shadow-xl hover:bg-purple-700 transition-all mt-4">ADD TO WALLET</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[450px]">
            <h2 className="text-2xl font-black text-gray-800 mb-10">Monthly Splitup</h2>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="expense" stackId="a" fill="#7C3AED" barSize={55} />
                  <Bar dataKey="savings" stackId="a" fill="#10B981" barSize={55} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> Recent Activities</h2>
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-50 uppercase font-black">
                <th className="pb-6">Member</th><th className="pb-6">Reason</th><th className="pb-6 text-right">Amount</th><th className="pb-6 text-center">Action</th>
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
                    <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500 transition-all"><Trash2 size={20} /></button>
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
