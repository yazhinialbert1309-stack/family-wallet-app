"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Wallet, History } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState([{ month: 'Mar', expense: 4000, savings: 2000 }]);
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Appa 👴', reason: 'Electricity Bill ⚡', amount: 1200, type: 'expense', date: '2026-03-27' },
  ]);

  const [name, setName] = useState('Appa 👴');
  const [reason, setReason] = useState('Food 🍔');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleAdd = () => {
    if (!amount) return;
    const val = parseInt(amount);
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { id: Date.now(), name, reason, amount: val, type, date: today };
    
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

  return (
    <main className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center gap-4 p-6 bg-white rounded-[30px] shadow-sm">
          <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg"><Wallet size={28} /></div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Family Wallet</h1>
            <p className="text-gray-500 text-sm font-medium">Real-time Tracking</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[35px] shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-purple-600" /> New Entry</h2>
            <div className="space-y-4">
              <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none"><option>Appa 👴</option><option>Amma 👩</option><option>Me 👦</option></select>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none"><option>Food 🍔</option><option>Rent 🏠</option><option>Shopping 🛍️</option></select>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-lg" />
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                 <button onClick={() => setType('expense')} className={`flex-1 p-3 rounded-xl font-bold ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>Expense</button>
                 <button onClick={() => setType('savings')} className={`flex-1 p-3 rounded-xl font-bold ${type === 'savings' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}>Savings</button>
              </div>
              <button onClick={handleAdd} className="w-full p-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl mt-4">ADD TO BUDGET</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `₹${v}`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
                <Bar dataKey="expense" name="Expense" stackId="a" fill="#7C3AED" barSize={60} radius={[0, 0, 0, 0]} />
                <Bar dataKey="savings" name="Savings" stackId="a" fill="#10B981" barSize={60} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-10 bg-white p-8 rounded-[40px] shadow-sm mb-10 overflow-x-auto">
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2"><History size={24} className="text-purple-600" /> History</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50"><th className="pb-4">Person</th><th className="pb-4">Reason</th><th className="pb-4 text-right">Amount</th><th className="pb-4 text-center">Action</th></tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50">
                  <td className="py-5 font-bold text-gray-900">{t.name}</td>
                  <td className="py-5 font-medium text-gray-600">{t.reason}</td>
                  <td className={`py-5 text-right font-black ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>₹{t.amount.toLocaleString()}</td>
                  <td className="py-5 text-center"><button onClick={() => handleDelete(t.id, t.amount, t.type)} className="p-3 text-gray-300 hover:text-rose-500"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
