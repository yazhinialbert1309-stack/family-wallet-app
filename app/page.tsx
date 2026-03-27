"use client"

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// 1. சார்ட்டுக்கான சாம்பிள் டேட்டா (இதில்தான் எண்கள் உள்ளன)
const data = [
  { month: 'Jan', expense: 5000, savings: 2000 },
  { month: 'Feb', expense: 8000, savings: 3500 },
  { month: 'Mar', expense: 4500, savings: 5500 },
  { month: 'Apr', expense: 10000, savings: 4000 },
  { month: 'May', expense: 7000, savings: 6500 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header பகுதி */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#7C3AED] tracking-tight">Family Wallet 💰</h1>
          <p className="text-gray-500 font-medium mt-1">உங்கள் குடும்பத்தின் நிதி நிலைமை ஒரே பார்வையில்</p>
        </header>

        {/* 2. STACKED BAR CHART கார்டு */}
        <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 mb-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Monthly Savings vs Expense</h2>
            
            {/* Legend (கைமுறையாகக் கொடுத்தது) */}
            <div className="flex items-center gap-6 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#7C3AED] rounded-full"></div>
                <span className="text-gray-600">Expense</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#10B981] rounded-full"></div>
                <span className="text-gray-600">Savings</span>
              </div>
            </div>
          </div>
          
          {/* சார்ட் கண்டெய்னர் - உயரம் 400px */}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                {/* பின்னால் இருக்கும் கோடுகள் */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                
                {/* X-Axis (மாதங்கள்) */}
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} 
                  dy={15} 
                />
                
                {/* Y-Axis (ரூபாய் மதிப்புகள்) */}
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  width={50}
                  tickFormatter={(value) => `₹${value}`} 
                />
                
                {/* மவுஸ் வைத்தால் விவரம் காட்ட */}
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }} 
                />

                {/* BARS: stackId="family" இருப்பதால் ஒன்றன் மேல் ஒன்றாக வரும் */}
                <Bar 
                  dataKey="expense" 
                  name="செலவு" 
                  stackId="family" 
                  fill="#7C3AED" 
                  barSize={45} 
                />
                <Bar 
                  dataKey="savings" 
                  name="சேமிப்பு" 
                  stackId="family" 
                  fill="#10B981" 
                  barSize={45} 
                  radius={[10, 10, 0, 0]} // மேல் பக்கம் மட்டும் வளைவாக இருக்க
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. சம்மரி கார்டுகள் */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-purple-100 rounded-xl">📊</span> Summary
              </h3>
              <p className="text-gray-500 leading-relaxed font-medium">இந்த மாதம் உங்கள் குடும்பச் சேமிப்பு இலக்கை அடைந்துவிட்டீர்கள்! பிளான் செய்ததை விட கூடுதலாகச் சேமித்துள்ளீர்கள். 🚀</p>
           </div>
           
           <div className="bg-[#7C3AED] p-8 rounded-[35px] text-white shadow-xl shadow-purple-100 flex flex-col justify-center">
              <p className="opacity-80 font-medium tracking-wide">NEXT MONTH GOAL</p>
              <h3 className="text-4xl font-black mt-2">₹25,000 Savings</h3>
           </div>
        </div>

      </div>
    </main>
  );
}
