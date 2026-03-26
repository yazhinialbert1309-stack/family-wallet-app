"use client"
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Wallet, PlusCircle, History, Utensils, Home as HomeIcon, Car, ShoppingBag, User, Trash2 } from 'lucide-react'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [member, setMember] = useState('Appa')
  const [transactions, setTransactions] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [memberTotals, setMemberTotals] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    if (data) {
      setTransactions(data)
      setTotal(data.reduce((acc: number, item: any) => acc + Number(item.amount), 0))
      const summary = data.reduce((acc: any, item: any) => {
        const name = item.member_name || 'Appa'
        acc[name] = (acc[name] || 0) + Number(item.amount)
        return acc
      }, {})
      setMemberTotals(summary)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleAdd = async () => {
    if (!amount) return alert("Amount enter pannunga!")
    setLoading(true)
    const { error } = await supabase.from('transactions').insert([{ amount: Number(amount), category, member_name: member, type: 'expense' }])
    setLoading(false)
    if (!error) { setAmount(''); fetchTransactions(); }
  }

  // logic: oru particular transaction-ah azhikka
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-1 bg-indigo-600 text-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
            <Wallet size={35} className="text-white" />
            <div>
              <p className="text-[10px] uppercase opacity-70 font-bold text-white">Family Spends</p>
              <h2 className="text-3xl font-black text-white">₹{total.toLocaleString()}</h2>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 overflow-x-auto">
            {['Appa', 'Amma', 'Brother', 'Me'].map((m) => (
              <div key={m} className="flex flex-col items-center min-w-[80px]">
                <div className="bg-indigo-50 p-2 rounded-full mb-1 text-indigo-600"><User size={16}/></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{m}</p>
                <p className="font-black text-indigo-700 text-sm">₹{memberTotals[m] || 0}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700"><PlusCircle size={20}/> New Expense</h2>
            <div className="space-y-4">
              <input type="number" placeholder="₹ Amount" className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold text-lg text-black focus:border-indigo-500 outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <select className="border-2 p-4 rounded-xl font-medium bg-slate-50 text-black outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Food">Food 🍔</option><option value="Rent">Rent 🏠</option><option value="Travel">Travel 🚗</option><option value="Medical">Medical 💊</option><option value="Others">Others 🛍️</option>
                </select>
                <select className="border-2 p-4 rounded-xl font-medium bg-slate-50 text-black outline-none" value={member} onChange={(e) => setMember(e.target.value)}>
                  <option value="Appa">Appa 👨</option><option value="Amma">Amma 👩</option><option value="Brother">Brother 👦</option><option value="Me">Me 🧑</option>
                </select>
              </div>
              <button onClick={handleAdd} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all">
                {loading ? "Recording..." : "Add to Budget"}
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700"><History size={20}/> Family Activity</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {transactions.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-2 rounded-lg text-[10px] font-bold text-indigo-600 uppercase">{item.member_name || 'Appa'}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm flex items-center gap-2">{item.category}</p>
                      <p className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-black text-rose-500">- ₹{Number(item.amount).toLocaleString()}</p>
                    {/* Delete button code */}
                    <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
