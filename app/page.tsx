"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Wallet, LogOut, History } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);
  
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔');
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
      if (savedPass === password) {
        setIsLoggedIn(true);
        setAuthError('');
      } else {
        setAuthError('தவறான பாஸ்வேர்ட்!');
      }
    }
  };

  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason, amount: val, type, date: 'Today' };
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-black">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-purple-600 rounded-2xl text-white mb-2"><Wallet size={32} /></div>
            <h1 className="text-2xl font-bold">{isSignUp ? 'Sign Up' : 'Login'}</h1>
          </div>
          <input type="text" placeholder="பெயர்" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="கடவுச்சொல்" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {authError && <p className="text-red-500 text-sm mb-4 text-center">{authError}</p>}
          <button className="w-full p-3 bg-purple-600 text-white font-bold rounded-xl">{isSignUp ? 'Create Account' : 'Login'}</button>
          <p onClick={() => {setIsSignUp(!isSignUp); setAuthError('');}} className="mt-4 text-center text-sm text-purple-600 cursor-pointer font-medium">
            {isSignUp ? 'ஏற்கனவே கணக்கு உள்ளதா? Login' : 'புதிய கணக்கு வேண்டுமா? Sign Up'}
          </p>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-[25px] shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-600 rounded-lg text-white"><Wallet size={24} /></div>
            <h1 className="text-xl font-bold">Family Wallet</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold flex items-center gap-1 hover:bg-red-50 p-2 px-4 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 h-fit">
            <select className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none" value={person} onChange={(e) => setPerson(e.target.value)}>
              <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
            </select>
            <select className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Food 🍔</option><option>Rent 🏠</option><option>Shopping 🛍️</option>
            </select>
            <input type="number" placeholder="தொகை (₹)" className="w-full p-3 bg-gray-50 rounded-xl mb-4 outline-none font-bold" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="flex gap-2 mb-4">
              <button onClick={() => setType('expense')} className={`flex-1 p-2 rounded-xl font-bold ${type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>Expense</button>
              <button onClick={() => setType('savings')} className={`flex-1 p-2 rounded-xl font-bold ${type === 'savings' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>Savings</button>
            </div>
            <button onClick={handleAdd} className="w-full p-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 transition-all">Add to Budget</button>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={40} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                <Bar dataKey="expense" stackId="a" fill="#7C3AED" barSize={50} />
                <Bar dataKey="savings" stackId="a" fill="#10B981" barSize={50} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 overflow-x-auto mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><History size={20} className="text-purple-600" /> History</h2>
          <table className="w-full text-left text-black">
            <thead>
              <tr className="text-gray-400 border-b border-gray-50 uppercase text-xs font-bold tracking-widest">
                <th className="pb-4">Member</th><th className="pb-4">Reason</th><th className="pb-4 text-right">Amount</th><th className="pb-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 font-bold">{t.person}</td>
                  <td className="py-4 text-gray-600">{t.reason}</td>
                  <td className={`py-4 text-right font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>₹{t.amount.toLocaleString()}</td>
                  <td className="py-4 text-center">
                    <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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
