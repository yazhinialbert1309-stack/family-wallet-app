"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Wallet, PlusCircle, History, Utensils, Home as HomeIcon, Car, ShoppingBag, User, Trash2, LogIn, Mail, Lock, LogOut } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [member, setMember] = useState('Appa')
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
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
  }

  const fetchTransactions = async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    if (data) {
      setTransactions(data)
      setTotal(data.reduce((acc, curr) => acc + Number(curr.amount), 0))
    }
  }

  const addTransaction = async (e) => {
    e.preventDefault()
    if (!amount) return
    const { error } = await supabase.from('transactions').insert([{ amount: Number(amount), category, member }])
    if (!error) { setAmount(''); fetchTransactions() }
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 max-w-md mx-auto w-full">
          <div className="text-center">
            <Wallet className="w-14 h-14 text-blue-600 mx-auto" />
            <h1 className="text-3xl font-bold mt-2 text-gray-800">Family Wallet</h1>
            <p className="text-gray-500 text-sm">Sign in to manage expenses</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 focus:border-blue-500" required />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 focus:border-blue-500" required />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              {loading ? 'Processing...' : 'Login / Sign Up'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg flex justify-between items-start max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="w-8 h-8" /> Family Wallet</h1>
          <div className="mt-4">
            <p className="text-blue-100 text-sm">Total Expenses</p>
            <p className="text-4xl font-bold">₹{total.toLocaleString()}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 p-2 bg-blue-500 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition-colors shadow-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="p-4 -mt-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <form onSubmit={addTransaction} className="space-y-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ 0.00" className="w-full text-3xl font-bold p-2 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold border-none">
                  <option>Food</option><option>Rent</option><option>Travel</option><option>Shopping</option><option>Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Member</label>
                <select value={member} onChange={(e) => setMember(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold border-none">
                  <option>Appa</option><option>Amma</option><option>Me</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 hover:bg-blue-700 transition-all">
              <PlusCircle className="w-5 h-5" /> Add Expense
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><History className="w-6 h-6 text-blue-600" /> Recent Expenses</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">No transactions yet. Add one above!</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-blue-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    {t.category === 'Food' && <Utensils className="w-6 h-6" />}
                    {t.category === 'Rent' && <HomeIcon className="w-6 h-6" />}
                    {t.category === 'Travel' && <Car className="w-6 h-6" />}
                    {t.category === 'Shopping' && <ShoppingBag className="w-6 h-6" />}
                    {t.category === 'Others' && <Wallet className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{t.member}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-xl font-extrabold text-red-500">-₹{Number(t.amount).toLocaleString()}</p>
                  <button onClick={() => deleteTransaction(t.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
