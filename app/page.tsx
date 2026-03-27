"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, History, LogOut, Lock, User, UserPlus } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState([{ month: 'Mar', expense: 0, savings: 0 }]);
  const [transactions, setTransactions] = useState([]);
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
      if (savedPass === password) setIsLoggedIn(true);
      else setAuthError('தவறான பாஸ்வேர்ட்!');
    }
  };

  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), name: username, reason: 'Entry', amount: val, type, date: 'Today' };
    setTransactions([newEntry, ...transactions]);
    const newData = [...data];
    if (type === 'expense') newData.expense += val;
    else newData.savings += val;
    setData(newData);
    setAmount('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h1>
          <input type="text" placeholder="Username" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          <button className="w-full p-3 bg-purple-600 text-white font-bold rounded-xl">{isSignUp ? 'Create' : 'Login'}</button>
          <p onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-center text-sm text-purple-600 cursor-pointer">{isSignUp ? 'Login here' : 'New account?'}</p>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-8">
          <h1 className="text-2xl font-bold">Family Wallet</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold">Logout</button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
            <input type="number" placeholder="Amount" className="w-full p-3 bg-gray-50 rounded-xl mb-4" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <select className="w-full p-3 bg-gray-50 rounded-xl mb-4" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option><option value="savings">Savings</option>
            </select>
            <button onClick={handleAdd} className="w-full p-3 bg-purple-600 text-white font-bold rounded-xl">Add</button>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Bar dataKey="expense" stackId="a" fill="#7C3AED" /><Bar dataKey="savings" stackId="a" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
