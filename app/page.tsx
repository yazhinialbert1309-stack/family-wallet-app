"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, ListChecks } from 'lucide-react';

export default function Home() {
  // 1. Chart & Transaction States
  const [data, setData] = useState([{ month: 'Mar', expense: 4000, savings: 2000 }]);
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Appa 👴', reason: 'Electricity Bill ⚡', amount: 1200, type: 'expense' },
  ]);

  // Form States
  const [name, setName] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔'); // Default Reason
  const [customReason, setCustomReason] = useState(''); // For 'Other' option
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // 2. Add New Entry
  const handleAdd = () => {
    if (!amount) return;
    
    // 'Other' தேர்ந்தெடுத்தால் customReason-ஐப் பயன்படுத்தும்
    const finalReason = reason === 'Other ➕' ? customReason : reason;
    if (!finalReason) return;

    const val = parseInt(amount);
    const newEntry = { id: Date.now(), name, reason: finalReason, amount: val, type };
    
    setTransactions([newEntry, ...transactions]);

    // Update Chart
    const newData = [...data];
    if (type === 'expense') newData[0].expense += val;
    else newData[0].savings += val;
    setData(newData);

    setAmount('');
    setCustomReason('');
  };

  // 3. Delete Entry
  const handleDelete = (id: number, amt: number, entryType: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    const newData = [...data];
    if (entryType === 'expense') newData[0].expense -= amt;
    else newData[0].savings -= amt;
    setData(newData);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
            <Wallet size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Family Wallet</h1>
            <p className="text-gray-500 font-medium tracking-wide">Track every rupee together</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INPUT FORM */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-purple-600" /> New Entry
              </h2>
              
              <div className="space-y-4">
                {/* Member Select */}
                <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-100">
                  <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
                </select>

                {/* REASON SELECT (புதிய அம்சம்) */}
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-100">
                  <option>Food 🍔</option>
                  <option>Rent 🏠</option>
                  <option>Shopping 🛍️</option>
                  <option>Electricity Bill ⚡</option>
                  <option>Petrol/Travel 🚗</option>
                  <option>Medical 💊</option>
                  <option>Savings Goal 💰</option>
                  <option>Other ➕</option>
                </select>

                {/* If 'Other' selected, show text input */}
                {reason === 'Other ➕' && (
                  <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Type your reason..." className="w-full p-4 bg-purple-50 rounded-2xl border border-purple-100 outline-none" />
                )}
                
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-100" />
                
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none">
                  <option value="expense">Expense (செலவு)</option>
                  <option value="savings">Savings (சேமிப்பு)</option>
                </select>

                <button onClick={handleAdd} className="w-full p-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-95">
                  Add to Budget
                </button>
              </div>
            </div>
          </div>

          {/* LIVE CHART */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full min-h-[400px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <ListChecks size={24} className="text-purple-600" /> Monthly Splitup
              </h2>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={55} />
                    <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={55} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="mt-10 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Recent Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[25px] border border-transparent hover:border-purple-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl font-bold ${t.type === 'expense' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {t.type === 'expense' ? '-' : '+'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.reason} <span className="text-gray-400 font-normal text-xs ml-1">by {t.name}</span></p>
                    <p className={`text-sm font-bold mt-0.5 ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      ₹{t.amount.toLocaleString()} • {t.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
