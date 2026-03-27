"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, History, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Home() {
  // 1. Chart Data State
  const [data, setData] = useState([{ month: 'Mar', expense: 4000, savings: 2000 }]);
  
  // 2. Transactions History State
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Appa 👴', reason: 'Electricity Bill ⚡', amount: 1200, type: 'expense', date: '2026-03-27' },
    { id: 2, name: 'Amma 👩', reason: 'Savings Goal 💰', amount: 2000, type: 'savings', date: '2026-03-27' },
  ]);

  // Form States
  const [name, setName] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔');
  const [customReason, setCustomReason] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // Add New Entry Function
  const handleAdd = () => {
    if (!amount) return;
    const finalReason = reason === 'Other ➕' ? customReason : reason;
    if (!finalReason) return;

    const val = parseInt(amount);
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { id: Date.now(), name, reason: finalReason, amount: val, type, date: today };
    
    setTransactions([newEntry, ...transactions]);

    // Update Chart Logic
    const newData = [...data];
    if (type === 'expense') newData[0].expense += val;
    else newData[0].savings += val;
    setData(newData);

    setAmount('');
    setCustomReason('');
  };

  // Delete Entry Function
  const handleDelete = (id: number, amt: number, entryType: string) => {
    if(!window.confirm("நிச்சயமாக இதை நீக்க வேண்டுமா?")) return;
    
    setTransactions(transactions.filter(t => t.id !== id));
    const newData = [...data];
    if (entryType === 'expense') newData[0].expense -= amt;
    else newData[0].savings -= amt;
    setData(newData);
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between bg-white p-6 rounded-[30px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg">
              <Wallet size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Family Wallet</h1>
              <p className="text-gray-500 text-sm">Real-time Budget & History</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Balance Status</p>
             <p className="text-2xl font-black text-green-600">₹{(data[0].savings - data[0].expense).toLocaleString()}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <PlusCircle size={20} className="text-purple-600" /> New Entry
              </h2>
              
              <div className="space-y-4">
                <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 transition-all font-medium">
                  <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
                </select>

                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 transition-all font-medium">
                  <option>Food 🍔</option><option>Rent 🏠</option><option>Shopping 🛍️</option>
                  <option>Electricity Bill ⚡</option><option>Petrol/Travel 🚗</option>
                  <option>Medical 💊</option><option>Savings Goal 💰</option><option>Other ➕</option>
                </select>

                {reason === 'Other ➕' && (
                  <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Type Reason..." className="w-full p-4 bg-purple-50 rounded-2xl border border-purple-100 outline-none animate-in fade-in zoom-in duration-200" />
                )}
                
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 transition-all font-bold text-lg" />
                
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                   <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                   <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold transition-all ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
                </div>

                <button onClick={handleAdd} className="w-full p-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-95 mt-4">
                  ADD TO BUDGET
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: CHART DISPLAY */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">Financial Overview</h2>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                    <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={60} radius={} />
                    <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={60} radius={} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: TRANSACTION HISTORY (புதிய பகுதி) */}
        <div className="mt-10 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <History size={24} className="text-purple-600" /> Transaction History
            </h2>
            <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-500 uppercase">{transactions.length} Total Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 font-bold">Date & Person</th>
                  <th className="pb-4 font-bold">Reason</th>
                  <th className="pb-4 font-bold text-right">Amount</th>
                  <th className="pb-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5">
                      <p className="font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{t.date}</p>
                    </td>
                    <td className="py-5 font-medium text-gray-600">{t.reason}</td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end gap-1 font-black">
                        {t.type === 'expense' ? <ArrowDownCircle size={14} className="text-rose-500" /> : <ArrowUpCircle size={14} className="text-emerald-500" />}
                        <span className={t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}>
                          ₹{t.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <button 
                        onClick={() => handleDelete(t.id, t.amount, t.type)}
                        className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-16">
                 <p className="text-gray-400 font-medium italic">No history found. Start adding entries!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
