"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Wallet, PlusCircle, History, Utensils, Home as HomeIcon, Car, ShoppingBag, User, Trash2, LogIn, Mail, Lock, LogOut, Users, PiggyBank, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Expense') // Expense அல்லது Savings
  const [category, setCategory] = useState('Food')
  const [member, setMember] = useState('Me')
  const [transactions, setTransactions] = useState([])
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) alert(signUpError.message)
      else alert('Account created! Logging in...')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setTransactions([])
  }

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      setTransactions(data)
      const expense = data.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + Number(curr.amount), 0)
      const savings = data.filter(t => t.type === 'Savings').reduce((acc, curr) => acc + Number(curr.amount), 0)
      setTotalExpense(expense)
      setTotalSavings(savings)
    }
  }

  const addTransaction = async (e) => {
    e.preventDefault()
    if (!amount || !user) return
    const { error } = await supabase.from('transactions').insert([
      { amount: Number(amount), category, member, type, user_id: user.id }
    ])
    if (!error) { setAmount(''); fetchTransactions() }
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)
    if (!error) fetchTransactions()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 max-w-md mx-auto w-full border border-blue-100">
          <div className="text-center">
            <Users className="w-14 h-14 text-blue-600 mx-auto" />
            <h1 className="text-3xl font-bold mt-2 text-gray-800">Family Wallet</h1>
            <p className="text-gray-500 text-sm">Secure Family Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none" required />
            <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg">{loading ? 'Loading...' : 'Login / Sign Up'}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2"><Wallet className="w-6 h-6" /> Family Wallet</h1>
          <button onClick={handleLogout} className="p-2 bg-blue-500 rounded-lg text-xs font-bold uppercase"><LogOut className="w-4 h-4" /></button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <p className="text-blue-100 text-xs font-bold uppercase">Total Expense</p>
            <p className="text-2xl font-bold">₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <p className="text-blue-100 text-xs font-bold uppercase">Total Savings</p>
            <p className="text-2xl font-bold">₹{totalSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 -mt-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <form onSubmit={addTransaction} className="space-y-4">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
              <button type="button" onClick={() => setType('Expense')} className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all ${type === 'Expense' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400'}`}>Expense</button>
              <button type="button" onClick={() => setType('Savings')} className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all ${type === 'Savings' ? 'bg-green-500 text-white shadow-md' : 'text-gray-400'}`}>Savings</button>
            </div>

            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ 0.00" className="w-full text-3xl font-bold p-2 border-b-2 border-gray-100 focus:border-blue-500 outline-none" />
            
            <div className="grid grid-cols-2 gap-4">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold border-none">
                <option>Food</option><option>Travel</option><option>Shopping</option><option>Education</option><option>Emergency</option><option>Others</option>
              </select>
              <select value={member} onChange={(e) => setMember(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold border-none">
                <option>Appa</option><option>Amma</option><option>Me</option><option>Bro</option>
              </select>
            </div>
            
            <button className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${type === 'Expense' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
              <PlusCircle className="w-5 h-5" /> Add {type}
            </button>
          </form>
        </div>
      </div>
      
      <div className="px-4 mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><History className="w-6 h-6 text-blue-600" /> History</h2>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${t.type === 'Savings' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {t.type === 'Savings' ? <PiggyBank className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.member}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className={`text-xl font-extrabold ${t.type === 'Savings' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'Savings' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                </p>
                <button onClick={() => deleteTransaction(t.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
