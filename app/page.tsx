"use client" // Next.js Client Component-க்கு இது மிக முக்கியம்

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// 1. மாதிரி டேட்டா (Sample Data) - இதைப் பிறகு உங்கள் Supabase டேட்டாவுடன் இணைக்கலாம்
const data = [
  { month: 'Jan', expense: 8000, savings: 4000 },
  { month: 'Feb', expense: 12000, savings: 2000 },
  { month: 'Mar', expense: 9000, savings: 5000 },
  { month: 'Apr', expense: 11000, savings: 3500 },
  { month: 'May', expense: 7000, savings: 6000 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header பகுதி */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Family Wallet 💰</h1>
          <p className="text-gray-500">உங்களின் சேமிப்பு மற்றும் செலவு விவரங்கள்</p>
        </header>

        {/* 2. சார்ட் கார்டு (Chart Card) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Savings vs Expense Split</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> சேமிப்பு
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-rose-500 rounded-full"></span> செலவு
              </div>
            </div>
          </div>

          {/* சார்ட் கண்டெய்னர் - உயரம் (Height) கட்டாயம் தேவை */}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barGap={8}
              >
                {/* பின்னால் இருக்கும் கோடுகள் */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                
                {/* அச்சுக்கள் (Axes) */}
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}}
                />

                {/* மவுஸ் வைக்கும்போது விபரம் காட்ட */}
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />

                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />

                {/* 3. முக்கியமான பகுதி: Stacked Bars */}
                {/* 'stackId' ஒன்றாக இருந்தால் மட்டுமே ஒன்றன் மேல் ஒன்றாக அடுக்கி வைக்கப்படும் */}
                <Bar 
                  dataKey="expense" 
                  name="செலவு" 
                  stackId="wallet" 
                  fill="#f43f5e" // Rose-500 color
                  radius={[0, 0, 0, 0]} 
                  barSize={40}
                />
                <Bar 
                  dataKey="savings" 
                  name="சேமிப்பு" 
                  stackId="wallet" 
                  fill="#10b981" // Emerald-500 color
                  radius={[6, 6, 0, 0]} // மேல் பக்கம் மட்டும் வளைவாக இருக்க
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* உங்கள் பழைய பட்ஜெட் லிஸ்ட் அல்லது ஃபார்ம் இங்கே தொடரலாம் */}
        <div className="grid gap-6">
           {/* Your existing components go here... */}
        </div>

      </div>
    </main>
  );
}
"use client"

import React from 'react';
// சார்ட் வரைய தேவையானவற்றை இம்போர்ட் செய்கிறோம்
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// 1. சாம்பிள் டேட்டா - இது உங்கள் ஆப்பில் உள்ள செலவு விபரங்களைக் குறிக்கும்
const data = [
  { month: 'Jan', expense: 8000, savings: 4000 },
  { month: 'Feb', expense: 12000, savings: 2000 },
  { month: 'Mar', expense: 9000, savings: 5000 },
  { month: 'Apr', expense: 11000, savings: 3500 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ஏற்கனவே உள்ள உங்கள் Header & Stats கார்டுகள் இங்கே இருக்கும் */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* Your Spending Cards... */}
        </div>

        {/* 2. இதுதான் நாம் புதிதாகச் சேர்க்கும் STACKED BAR CHART */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Savings vs Expense Split</h2>
          
          {/* Chart Container - உயரம் 350px ஆக வைத்துள்ளேன் */}
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={40} />

                {/* 'stackId' ஒன்றாக இருந்தால் மட்டுமே ஒன்றன் மேல் ஒன்றாக அடுக்கி வைக்கப்படும் */}
                <Bar 
                  dataKey="expense" 
                  name="செலவு" 
                  stackId="wallet" 
                  fill="#7C3AED" // உங்கள் ஆப் தீம் கலர் (Purple)
                  barSize={35}
                />
                <Bar 
                  dataKey="savings" 
                  name="சேமிப்பு" 
                  stackId="wallet" 
                  fill="#10B981" // பச்சை நிறம் (Savings)
                  radius={[10, 10, 0, 0]} // மேல் பக்கம் மட்டும் வளைவாக
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ஏற்கனவே உள்ள உங்கள் Transaction List கீழே தொடரும் */}
      </div>
    </main>
  );
}

