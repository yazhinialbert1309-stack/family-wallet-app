"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Wallet, LogOut, History, PlusCircle, AlertCircle, Calendar } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  // --- MONTHLY DATA STATE ---
  const [activeMonth, setActiveMonth] = useState('Mar');
  const [monthlyData, setMonthlyData] = useState({
    'Jan': { expense: 5000, savings: 3000, transactions: [] },
    'Feb': { expense: 7000, savings: 4000, transactions: [] },
    'Mar': { expense: 0, savings: 0, transactions: [] },
  });

  const BUDGET_LIMIT = 10000;

  // Form States
  const [person, setPerson] = useState('Appa 👴');
  const [reason, setReason] = useState('Food & Grocery 🍎');
  const [customReason, setCustomReason] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // --- HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'family123') setIsLoggedIn(true);
    else alert('தவறான பாஸ்வேர்ட்!');
  };

  const handleAdd = () => {
    if (!amount) return;
    const finalReason = reason === 'Other ➕' ? customReason : reason;
    const val = parseInt(amount);
    const newEntry = { id: Date.now(), person, reason: finalReason, amount: val, type, date: new Date().toLocaleDateString() };
    
    setMonthlyData(prev => {
      const current = prev[activeMonth as keyof typeof prev];
      return {
        ...prev,
        [activeMonth]: {
          ...current,
          transactions: [newEntry, ...current.transactions],
          expense: type === 'expense' ? current.expense + val : current.expense,
          savings: type === 'savings' ? current.savings + val : current.savings,
        }
      };
    });
    setAmount(''); setCustomReason('');
  };

  const handleDelete = (id: number, amt: number, entryType: string) => {
    setMonthlyData(prev => {
      const current = prev[activeMonth as keyof typeof prev];
      return {
        ...prev,
        [activeMonth]: {
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-black font-sans">
        <form onSubmit={handleAuth} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-purple-600 rounded-3xl text-white mb-3 shadow-lg shadow-purple-100"><Wallet size={36} /></div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Family Wallet</h1>
          </div>
          <input type="password" placeholder="Password (family123)" className="w-full p-4 bg-gray-50 rounded-2xl mb-4 border outline-none focus:ring-2 focus:ring-purple-200 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full p-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 transition-all">Login</button>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-6 rounded-[30px] shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-100"><Wallet size={24} /></div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Family Dashboard</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-bold bg-red-50 p-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-red-100 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* Monthly Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['Jan', 'Feb', 'Mar'].map((m) => (
            <button key={m} onClick={() => setActiveMonth(m)} className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shrink-0 transition-all ${activeMonth === m ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <Calendar size={18} /> {m} Month
            </button>
          ))}
        </div>

        {isOverBudget && (
          <div className="bg-rose-50 border-l-8 border-rose-500 p-6 rounded-3xl mb-8 flex items-center gap-4 shadow-sm animate-pulse">
            <div className="p-3 bg-rose-500 rounded-2xl text-white"><AlertCircle size={28} /></div>
            <div>
              <h3 className="text-xl font-bold text-rose-800">Budget Warning! 🚨</h3>
              <p className="text-rose-600 font-medium">பட்ஜெட் வரம்பைத் (₹{BUDGET_LIMIT}) தாண்டிவிட்டீர்கள்!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Enhanced Entry Form */}
          <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={22} className="text-purple-600" /> New Entry ({activeMonth})</h2>
            <div className="space-y-4 font-medium">
              <label className="text-xs text-gray-400 font-bold uppercase ml-1 tracking-widest">யார்?</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
                <option>Brother 👨‍🦱</option><option>Sister 👧</option><option>Thatha 👴</option><option>Paati 👵</option>
              </select>

              <label className="text-xs text-gray-400 font-bold uppercase ml-1 tracking-widest">காரணம்?</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100" value={reason} onChange={(e) => setReason(e.target.value)}>
                <optgroup label="அடிப்படை தேவைகள்">
                  <option>Food & Grocery 🍎</option><option>Milk 🥛</option><option>Rent 🏠</option><option>Electricity Bill ⚡</option><option>Gas Cylinder 🔋</option>
                </optgroup>
                <optgroup label="போக்குவரத்து & கல்வி">
                  <option>Petrol/Diesel 🚗</option><option>Bus/Train Fare 🚌</option><option>School/College Fees 🎓</option><option>Mobile Recharge 📱</option>
                </optgroup>
                <optgroup label="மருத்துவம் & சேமிப்பு">
                  <option>Medicine/Medical 💊</option><option>Gold Savings 🥇</option><option>Monthly Savings 💰</option><option>Shopping 🛍️</option><option>Other ➕</option>
                </optgroup>
              </select>

              {reason === 'Other ➕' && (
                <input type="text" placeholder="Type other reason..." className="w-full p-4 bg-purple-50 rounded-2xl outline-none border border-purple-100 animate-in fade-in" value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
              )}

              <input type="number" placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-5 bg-purple-600 text-white font-black rounded-[25px] shadow-xl hover:bg-purple-700 transition-all mt-4">ADD TO BUDGET</button>
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
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="expense" name="Expense" stackId="a" fill={isOverBudget ? "#f43f5e" : "#7C3AED"} barSize={80} />
                  <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={80} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> {activeMonth} History</h2>
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
