"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react'; // டெலீட் ஐகானுக்காக

export default function Home() {
  const [data, setData] = useState([
    { month: 'Jan', expense: 4000, savings: 2000 },
    { month: 'Feb', expense: 3000, savings: 5000 },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Appa', reason: 'Electricity Bill', amount: 1500, type: 'expense' },
    { id: 2, name: 'Amma', reason: 'Grocery', amount: 2000, type: 'expense' },
  ]);

  const [name, setName] = useState('Appa');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // 1. புதிய டேட்டாவைச் சேர்க்கும் ஃபங்ஷன்
  const handleAdd = () => {
    if (!amount || !reason) return;
    const val = parseInt(amount);
    
    // லிஸ்ட்டில் சேர்க்க
    const newEntry = { id: Date.now(), name, reason, amount: val, type };
    setTransactions([newEntry, ...transactions]);

    // சார்ட்டில் அப்டேட் செய்ய
    const newData = [...data];
    if (type === 'expense') newData[newData.length - 1].expense += val;
    else newData[newData.length - 1].savings += val;
    setData(newData);

    setAmount(''); setReason('');
  };

  // 2. டெலீட் செய்யும் ஃபங்ஷன்
  const handleDelete = (id: number, amt: number, entryType: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    const newData = [...data];
    if (entryType === 'expense') newData[newData.length - 1].expense -= amt;
    else newData[newData.length - 1].savings -= amt;
    setData(newData);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8"><h1 className="text-4xl font-black text-[#7C3AED]">Family Wallet 💰</h1></header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: புதிய இன்புட் ஃபார்ம் */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">New Entry</h2>
              <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100 outline-none">
                <option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option>
              </select>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (e.g. Food)" className="w-full p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100 outline-none" />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="w-full p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100 outline-none" />
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100 outline-none">
                <option value="expense">Expense (செலவு)</option><option value="savings">Savings (சேமிப்பு)</option>
              </select>
              <button onClick={handleAdd} className="w-full p-4 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-purple-700 transition-all">Add to Budget</button>
            </div>
          </div>

          {/* MIDDLE: லைவ் சார்ட் */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold mb-6">Live Monthly Splitup</h2>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} width={40} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                    <Bar dataKey="expense" stackId="a" fill="#7C3AED" barSize={40} /><Bar dataKey="savings" stackId="a" fill="#10B981" barSize={40} radius={} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: டிரான்ஸாக்ஷன் லிஸ்ட் வித் டெலீட் ஆப்ஷன் */}
        <div className="mt-10 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-800">{t.reason} <span className="font-normal text-gray-400 text-sm">by {t.name}</span></p>
                  <p className={t.type === 'expense' ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>₹{t.amount} ({t.type})</p>
                </div>
                <button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
