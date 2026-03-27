"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  // 1. இதுதான் உங்க Real Data ஸ்டேட் (ஆரம்பத்துல காலியா இருக்கும்)
  const [data, setData] = useState([
    { month: 'Jan', expense: 4000, savings: 2000 },
    { month: 'Feb', expense: 3000, savings: 5000 },
  ]);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  // 2. புதிய டேட்டாவைச் சேர்க்கும் ஃபங்ஷன்
  const handleAddData = () => {
    if (!amount) return;
    
    const newValue = parseInt(amount);
    const newData = [...data];
    
    // உதாரணத்துக்கு கடைசி மாசத்துல டேட்டாவை ஆட் பண்றோம்
    if (type === 'expense') {
      newData[newData.length - 1].expense += newValue;
    } else {
      newData[newData.length - 1].savings += newValue;
    }
    
    setData(newData);
    setAmount(''); // இன்புட் பாக்ஸை காலி செய்ய
  };

  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#7C3AED]">Family Wallet 💰</h1>
          <p className="text-gray-500 font-medium">Real-time Budget Tracking</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: இன்புட் ஃபார்ம் */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">New Entry</h2>
              
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount (₹)" 
                className="w-full p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100 outline-none"
              >
                <option value="expense">Expense (செலவு)</option>
                <option value="savings">Savings (சேமிப்பு)</option>
              </select>

              <button 
                onClick={handleAddData}
                className="w-full p-4 bg-[#7C3AED] text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
              >
                Add to Chart
              </button>
            </div>
          </div>

          {/* RIGHT: லைவ் சார்ட் */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Live Monthly Splitup</h2>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Bar dataKey="expense" stackId="a" fill="#7C3AED" barSize={45} />
                    <Bar dataKey="savings" stackId="a" fill="#10B981" barSize={45} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
