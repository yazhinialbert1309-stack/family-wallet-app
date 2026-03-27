"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Wallet, PlusCircle, History, Utensils, Home as HomeIcon, Car, ShoppingBag, User, Trash2 } from 'lucide-react'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [member, setMember] = useState('Appa')
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const [memberTotals, setMemberTotals] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    if (data) {
      setTransactions(data)
      const newTotal = data.reduce((acc, curr) => acc + Number(curr.amount), 0)
      setTotal(newTotal)

      const totals = data.reduce((acc, curr) => {
        acc[curr.member] = (acc[curr.member] || 0) + Number(curr.amount)
        return acc
      }, {})
      setMemberTotals(totals)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const addTransaction = async (e) => {
    e.preventDefault()
    if (!amount) return
    setLoading(true)

    const { error } = await supabase.from('transactions').insert([
      { amount: Number(amount), category, member, created_at: new Date().toISOString() }
    ])

    if (!error) {
      setAmount('')
      fetchTransactions()
    }
    setLoading(false)
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-8 h-8" />
          Family Wallet
        </h1>
        <div className="mt-4">
          <p className="text-blue-100 text-sm">Total Expenses</p>
          <p className="text-4xl font-bold">₹{total.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-4 -mt-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <form onSubmit={addTransaction} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">AMOUNT</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-2xl font-bold p-2 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">CATEGORY</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium"
                >
                  <option>Food</option>
                  <option>Rent</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">MEMBER</label>
                <select 
                  value={member} 
                  onChange={(e) => setMember(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium"
                >
                  <option>Appa</option>
                  <option>Amma</option>
                  <option>Me</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" /> Recent Expenses
        </h2>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  {t.category === 'Food' && <Utensils className="w-5 h-5" />}
                  {t.category === 'Rent' && <HomeIcon className="w-5 h-5" />}
                  {t.category === 'Travel' && <Car className="w-5 h-5" />}
                  {t.category === 'Shopping' && <ShoppingBag className="w-5 h-5" />}
                  {t.category === 'Others' && <Wallet className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.member}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase">{t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-red-500">-₹{t.amount}</p>
                <button onClick={() => deleteTransaction(t.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
