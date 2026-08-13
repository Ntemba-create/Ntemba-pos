import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('pos'); // 'login', 'signup', 'forgot', 'pos'
  
  // Auth State
  const [username, setUsername] = useState('DemoTrader');
  const [password, setPassword] = useState('••••••••');
  const [selectedTier, setSelectedTier] = useState('Standard'); 
  const [authMessage, setAuthMessage] = useState('');

  // POS State
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [activePosTab, setActivePosTab] = useState('sales'); // 'sales', 'reports', 'scoring'

  const products = [
    { id: 1, name: 'Airtime Voucher', price: 20, category: 'Telecom', stock: 45 },
    { id: 2, name: 'Phone Charger', price: 150, category: 'Accessories', stock: 12 },
    { id: 3, name: 'Fast USB Cable', price: 80, category: 'Accessories', stock: 24 },
    { id: 4, name: 'Glass Protector', price: 100, category: 'Accessories', stock: 8 },
    { id: 5, name: 'Mobile Data Bundle', price: 50, category: 'Telecom', stock: 100 },
    { id: 6, name: 'Wireless Earbuds', price: 250, category: 'Audio', stock: 5 },
  ];

  const getReportMonths = (tier) => {
    if (tier === 'Basic') return 3;
    if (tier === 'Standard') return 6;
    if (tier === 'Enterprise') return 12;
    return 3;
  };

  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const reportMonthsAllowed = getReportMonths(selectedTier);

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 select-none overflow-hidden">
      
      {/* 🛠️ DEV PREVIEW SWITCHER: Instantly view any interface without signing up */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto shrink-0 shadow-md">
        <div className="flex items-center gap-1.5 font-bold text-indigo-400 whitespace-nowrap mr-2">
          <span>⚡ Interface Inspector:</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button onClick={() => setView('login')} className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-all ${view === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>1. Login</button>
          <button onClick={() => setView('signup')} className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-all ${view === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>2. Sign Up</button>
          <button onClick={() => setView('forgot')} className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-all ${view === 'forgot' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>3. Forgot Pwd</button>
          <button onClick={() => setView('pos')} className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-all ${view === 'pos' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>4. POS Terminal & Bank Score</button>
          <span className="text-slate-700 mx-1">|</span>
          <span className="text-slate-400">Active Tier:</span>
          <select 
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-[11px] font-bold outline-none cursor-pointer"
          >
            <option value="Basic">Basic Tier (3M Audit)</option>
            <option value="Standard">Standard Tier (6M Audit)</option>
            <option value="Enterprise">Enterprise Tier (12M Audit)</option>
          </select>
        </div>
      </div>

      {/* 1. LOGIN SCREEN INTERFACE */}
      {view === 'login' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight mb-1">Ntemba POS</h1>
              <p className="text-slate-300 text-xs font-medium">Sign in to your cashier terminal</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-extrabold text-sm shadow-lg cursor-pointer">Sign In</button>
            </form>

            <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
              <button onClick={() => setView('forgot')} className="hover:text-white cursor-pointer">Forgot password?</button>
              <button onClick={() => setView('signup')} className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Create Account</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGN UP SCREEN INTERFACE WITH TIER HIDING LOGIC */}
      {view === 'signup' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6 overflow-y-auto">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-5 text-white my-auto">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight mb-1">Create Account</h1>
              <p className="text-slate-300 text-xs font-medium">Select your plan to unlock tailored audits</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
              </div>

              {/* Tiers Selection: Hides unselected tiers when one is picked */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subscription Tier</label>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Basic', months: '3 Months Sales History' },
                    { name: 'Standard', months: '6 Months Sales History' },
                    { name: 'Enterprise', months: '12 Months Sales History' }
                  ]
                    .filter(tier => selectedTier === '' || selectedTier === tier.name)
                    .map(tier => (
                      <div 
                        key={tier.name}
                        onClick={() => setSelectedTier(selectedTier === tier.name ? '' : tier.name)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                          selectedTier === tier.name ? 'bg-indigo-600/40 border-indigo-400' : 'bg-slate-900/40 border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{tier.name} Tier</div>
                          <div className="text-[10px] text-indigo-300 font-bold">{tier.months} + Bank Scoring PDF</div>
                        </div>
                        <span className="text-xs font-extrabold text-indigo-300">
                          {selectedTier === tier.name ? '✓ Selected' : 'Select'}
                        </span>
                      </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-extrabold text-sm shadow-lg cursor-pointer">Complete Sign Up</button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-1">
              Already have an account? <button onClick={() => setView('login')} className="text-indigo-400 font-bold hover:underline cursor-pointer">Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FORGOT PASSWORD SCREEN INTERFACE */}
      {view === 'forgot' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight mb-1">Reset Password</h1>
              <p className="text-slate-300 text-xs font-medium">Enter your username to recover access</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); setView('login'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-extrabold text-sm shadow-lg cursor-pointer">Send Reset Instructions</button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-1">
              Remembered password? <button onClick={() => setView('login')} className="text-indigo-400 font-bold hover:underline cursor-pointer">Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN POS DASHBOARD & BANK SCORING PDF INTERFACE */}
      {view === 'pos' && (
        <div className="flex flex-col flex-1 w-full bg-slate-50 overflow-hidden">
          <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white flex justify-between items-center shadow-lg">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Ntemba POS</h1>
              <span className="text-[11px] text-indigo-200 font-medium">User: {username} • <strong className="text-white">{selectedTier} Tier</strong></span>
            </div>
            <button onClick={() => setView('login')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer">Logout</button>
          </header>

          <div className="bg-white border-b border-slate-200 px-4 py-2 flex gap-2">
            <button onClick={() => setActivePosTab('sales')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePosTab === 'sales' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>🛒 POS Terminal</button>
            <button onClick={() => setActivePosTab('reports')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePosTab === 'reports' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>📊 Sales Reports ({reportMonthsAllowed}M)</button>
            <button onClick={() => setActivePosTab('scoring')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${activePosTab === 'scoring' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>🏦 Bank Scoring PDF ({reportMonthsAllowed}M)</button>
          </div>

          {activePosTab === 'sales' && (
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['All', 'Accessories', 'Telecom', 'Audio'].map(cat => (
                    <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer ${activeTab === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{cat}</button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(activeTab === 'All' ? products : products.filter(p => p.category === activeTab)).map(prod => (
                    <div key={prod.id} onClick={() => addItem(prod)} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between h-28 cursor-pointer hover:border-indigo-500">
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block">Stock: {prod.stock}</span>
                      </div>
                      <span className="font-extrabold text-indigo-600 text-base">ZMW {prod.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 md:p-6 flex flex-col max-h-[42vh] md:max-h-none shadow-xl">
                <h2 className="text-sm font-extrabold text-slate-900 mb-3">Current Order</h2>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
                  {cart.length === 0 ? <p className="text-slate-400 text-xs text-center mt-8">Tap items to add them</p> : cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 border px-3 py-2 rounded-xl text-xs">
                      <span>{item.name} x{item.qty}</span>
                      <strong>ZMW {(item.price * item.qty).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 mb-4 flex flex-col gap-1.5">
                  <div className="flex justify-between text-base font-extrabold text-slate-900">
                    <span>Total Due</span>
                    <span>ZMW {total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => { alert(`Charged ZMW ${total.toFixed(2)}`); setCart([]); }} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-extrabold text-sm cursor-pointer">Charge ZMW {total.toFixed(2)}</button>
              </div>
            </div>
          )}

          {activePosTab === 'reports' && (
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h2 className="text-lg font-black text-slate-900">Performance & Sales Reports</h2>
                <p className="text-xs text-slate-500">Showing aggregated transaction data matching your active <strong className="text-indigo-600">{selectedTier} Tier</strong> audit window ({reportMonthsAllowed} Months history).</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 border p-4 rounded-xl">
                    <span className="text-xs font-bold text-indigo-600 uppercase">Total Revenue ({reportMonthsAllowed}M)</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">ZMW 48,250.00</span>
                  </div>
                  <div className="bg-violet-50 border p-4 rounded-xl">
                    <span className="text-xs font-bold text-violet-600 uppercase">Transactions</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">1,420 orders</span>
                  </div>
                  <div className="bg-emerald-50 border p-4 rounded-xl">
                    <span className="text-xs font-bold text-emerald-600 uppercase">Avg Basket</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">ZMW 33.98</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePosTab === 'scoring' && (
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col items-center">
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Bank-Grade Audit ({selectedTier} Tier)</span>
                    <h2 className="text-xl font-black text-slate-900 mt-2">Trader Financial Health Scorecard</h2>
                    <p className="text-xs text-slate-500">Generated for Commercial Credit Evaluation • {reportMonthsAllowed} Months Verified Sales Horizon</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600">88 / 100</div>
                    <span className="text-[10px] font-bold text-slate-400">Grade: A+</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border text-xs text-slate-600">
                  This certified report aggregates {reportMonthsAllowed} months of transaction logs for <strong>{username}</strong>, providing institutional lenders with verified cash-flow metrics for working capital pre-qualification.
                </div>

                <button onClick={() => alert(`SUCCESS: Official Bank Financial Scoring PDF downloaded for ${username} based on the ${selectedTier} tier (${reportMonthsAllowed} months audit)!`)} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-sm cursor-pointer shadow-lg shadow-indigo-500/20">
                  📥 Download Certified Bank Financial Scoring PDF ({reportMonthsAllowed}M Horizon)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
