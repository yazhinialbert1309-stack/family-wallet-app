"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, History, LogOut, User, Lock, UserPlus } from 'lucide-react';

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
      if (savedPass === password) setIsLoggedIn(true);
      else setAuthError('தவறான பாஸ்வேர்ட்!');
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
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border">
          <h1 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h1>
          <input type="text" placeholder="Username" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 bg-gray-50 rounded-xl outline-none border" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          <button className="w-full p-3 bg-purple-600 text-white font-bold rounded-xl">{isSignUp ? 'Create' : 'Login'}</button>
          <p onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-center text-sm text-purple-600 cursor-pointer hover:underline">{isSignUp ? 'Login here' : 'New account?'}</p>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm mb-8 border">
          <div className="flex items-center gap-2"><Wallet className="text-purple-600""")/>><h1 className="text-xl font-bold">Family Wallet</h1></div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold flex items-center gap-1"><LogOut size={18}/>Logout</button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <select className="w-full p-3 bg-gray-50 rounded-xl mb-3" value={person} onChange={(e) => setPerson(e.target.value)}><option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option></select>
            <select className="w-full p-3 bg-gray-50 rounded-xl mb-3" value={reason} onChange={(e) => setReason(e.target.value)}><option>Food 🍔</option><option>Rent 🏠</option><option>Travel 🚗</option></select>
            <input type="number" placeholder="Amount" className="w-full p-3 bg-gray-50 rounded-xl mb-4" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="flex gap-2 mb-4"><button onClick={() => setType('expense')} className={`flex-1 p-2 rounded-lg font-bold ${type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>Expense</button><button onClick={() => setType('savings')} className={`flex-1 p-2 rounded-lg font-bold ${type === 'savings' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>Savings</button></div>
            <button onClick={handleAdd} className="w-full p-3 bg-purple-600 text-white font-bold rounded-xl">Add to Budget</button>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis width={40}/><Tooltip />
                <Bar dataKey="expense" stackId="a" fill="#7C3AED" barSize={50}/><Bar dataKey="savings" stackId="a" fill="#10B981" barSize={50} radius={[5, 5, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><History size={20}/>History</h2>
          <table className="w-full text-left">
            <thead><tr className="text-gray-400 border-b"><th>Member</th><th>Reason</th><th className="text-right">Amount</th><th className="text-center">Action</th></tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b"><td className="py-4 font-bold">{t.person}</td><td className="py-4">{t.reason}</td><td className={`py-4 text-right font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>₹{t.amount}</td><td className="py-4 text-center"><button onClick={() => handleDelete(t.id, t.amount, t.type)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
