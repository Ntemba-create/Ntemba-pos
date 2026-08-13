import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'pos'
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTier, setSelectedTier] = useState('Basic');
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

  // Tier configuration rules
  const getReportMonths = (tier) => {
    if (tier === 'Basic') return 3;
    if (tier === 'Standard') return 6;
    if (tier === 'Enterprise') return 12;
    return 3;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setView('pos');
      setAuthMessage('');
    } else {
      setAuthMessage('Please enter username and password.');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      alert(`Account created successfully on the ${selectedTier} Tier!`);
      setView('pos');
      setAuthMessage('');
    } else {
      setAuthMessage('Please complete all fields to sign up.');
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (username.trim()) {
      alert(`Password reset link sent for: ${username}`);
      setView('login');
      setAuthMessage('');
    } else {
      setAuthMessage('Please enter your username.');
    }
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

  // 1. LOGIN SCREEN
  if (view === 'login') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6 select-none">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight mb-1">Ntemba POS</h1>
            <p className="text-slate-300 text-xs font-medium">Sign in to your cashier terminal</p>
          </div>

          {authMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl text-xs text-center font-semibold">
              {authMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
              <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
            <button onClick={() => { setView('forgot'); setAuthMessage(''); }} className="hover:text-white transition-colors cursor-pointer">
              Forgot password?
            </button>
            <button onClick={() => { setView('signup'); setAuthMessage(''); }} className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SIGN UP SCREEN WITH TIER HIDING LOGIC
  if (view === 'signup') {
    const tiers = [
      { name: 'Basic', months: '3 Months Sales History', desc: 'Solo vendor, essential point-of-sale' },
      { name: 'Standard', months: '6 Months Sales History', desc: 'Inventory stock tracking & multi-device' },
      { name: 'Enterprise', months: '12 Months Sales History', desc: 'Advanced analytics & full bank scoring PDF' }
    ];

    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6 select-none overflow-y-auto">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-5 text-white my-auto">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight mb-1">Create Account</h1>
            <p className="text-slate-300 text-xs font-medium">Select your tier to unlock tailored reports & features</p>
          </div>

          {authMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl text-xs text-center font-semibold">
              {authMessage}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
              <input 
                type="text" 
                placeholder="Choose username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
              <input 
                type="password" 
                placeholder="Choose password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tier Selection - Hides unselected tiers once chosen */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subscription Tier</label>
              <div className="flex flex-col gap-2">
                {tiers
                  .filter(tier => selectedTier === '' || selectedTier === tier.name)
                  .map(tier => (
                    <div 
                      key={tier.name}
                      onClick={() => setSelectedTier(selectedTier === tier.name ? '' : tier.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                        selectedTier === tier.name 
                          ? 'bg-indigo-600/40 border-indigo-400 shadow-md' 
                          : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{tier.name} Tier</div>
                        <div className="text-[10px] text-indigo-300 font-bold">{tier.months}</div>
                        <div className="text-[10px] text-slate-300">{tier.desc}</div>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-300">
                        {selectedTier === tier.name ? '✓ Selected (Tap to change)' : 'Select'}
                      </span>
                    </div>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              Complete Sign Up
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 mt-1">
            Already have an account?{' '}
            <button onClick={() => { setView('login'); setAuthMessage(''); }} className="text-indigo-400 font-bold hover:underline cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. FORGOT PASSWORD SCREEN
  if (view === 'forgot') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6 select-none">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight mb-1">Reset Password</h1>
            <p className="text-slate-300 text-xs font-medium">Enter your username to recover access</p>
          </div>

          {authMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl text-xs text-center font-semibold">
              {authMessage}
            </div>
          )}

          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
              <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              Send Reset Instructions
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 mt-1">
            Remembered password?{' '}
            <button onClick={() => { setView('login'); setAuthMessage(''); }} className="text-indigo-400 font-bold hover:underline cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN POS DASHBOARD WITH TIER-BASED REPORTS & BANK SCORING PDF FEATURE
  const filtered = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  const reportMonthsAllowed = getReportMonths(selectedTier);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 select-none">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Ntemba POS</h1>
          <span className="text-[11px] text-indigo-200 font-medium">User: {username || 'Cashier'} • <strong className="text-white">{selectedTier} Tier</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setView('login'); setPassword(''); }}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header for Tier Features */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex gap-2">
        <button 
          onClick={() => setActivePosTab('sales')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePosTab === 'sales' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🛒 POS Terminal
        </button>
        <button 
          onClick={() => setActivePosTab('reports')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activePosTab === 'reports' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📊 Sales Reports ({reportMonthsMonthsDisplay(reportMonthsAllowed)})
        </button>
        <button 
          onClick={() => setActivePosTab('scoring')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            activePosTab === 'scoring' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          🏦 Bank Financial Scoring PDF
        </button>
      </div>

      {/* TAB 1: POS TERMINAL */}
      {activePosTab === 'sales' && (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'Accessories', 'Telecom', 'Audio'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                    activeTab === cat 
                      ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => addItem(prod)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between h-28 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all active:scale-95"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-sm line-clamp-1">{prod.name}</span>
                    {selectedTier !== 'Basic' && (
                      <span className="text-[10px] text-slate-400 font-semibold block">Stock: {prod.stock} left</span>
                    )}
                  </div>
                  <span className="font-extrabold text-indigo-600 text-base">ZMW {prod.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 md:p-6 flex flex-col max-h-[42vh] md:max-h-none shadow-xl">
            <h2 className="text-sm font-extrabold text-slate-900 mb-3">Current Order</h2>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-xs text-center mt-8">Tap items to add them to the sale</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs">
                    <span className="font-semibold text-slate-700">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                    <span className="font-bold text-slate-900">ZMW {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 mb-4 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>ZMW {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span>ZMW {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (cart.length === 0) {
                  alert('Cart is empty!');
                } else {
                  alert(`Payment Confirmed! Collected ZMW ${total.toFixed(2)}`);
                  setCart([]);
                }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-98 cursor-pointer"
            >
              Charge ZMW {total.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TIER SALES REPORTS */}
      {activePosTab === 'reports' && (
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Performance & Sales Reports</h2>
              <p className="text-xs text-slate-500">Showing aggregated transaction data up to your plan limit: <strong className="text-indigo-600">{reportMonthsAllowed} Months</strong> ({selectedTier} Tier)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-bold text-indigo-600 uppercase">Total Revenue ({reportMonthsAllowed}M)</span>
                <span className="text-2xl font-black text-slate-900">ZMW 48,250.00</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ +14.2% vs previous period</span>
              </div>
              <div className="bg-violet-50 border border-violet-100 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-bold text-violet-600 uppercase">Completed Transactions</span>
                <span className="text-2xl font-black text-slate-900">1,420 orders</span>
                <span className="text-[10px] text-violet-700 font-semibold">Consistent daily average</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase">Average Basket Size</span>
                <span className="text-2xl font-black text-slate-900">ZMW 33.98</span>
                <span className="text-[10px] text-emerald-700 font-semibold">High velocity accessories</span>
              </div>
            </div>

            {selectedTier === 'Basic' && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex justify-between items-center">
                <span>Want up to 6 or 12 months of historical audit reports? Upgrade to Standard or Enterprise anytime.</span>
                <span className="font-bold underline cursor-pointer" onClick={() => setSelectedTier('Standard')}>Upgrade Plan</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BANK FINANCIAL SCORING PDF */}
      {activePosTab === 'scoring' && (
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Bank-Grade Audit</span>
                <h2 className="text-xl font-black text-slate-900 mt-2">Trader Financial Health Scorecard</h2>
                <p className="text-xs text-slate-500">Generated for Commercial Bank Credit Evaluation • Merchant: {username || 'Ntemba Trader'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-600">88 / 100</div>
                <span className="text-[10px] font-bold text-slate-400">Creditworthiness Grade: A+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Consistency Index</div>
                <div className="text-base font-extrabold text-slate-800 mt-0.5">94%</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Monthly Cashflow</div>
                <div className="text-base font-extrabold text-slate-800 mt-0.5">ZMW 16.1k</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Default Risk</div>
                <div className="text-base font-extrabold text-emerald-600 mt-0.5">Very Low</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Audit Horizon</div>
                <div className="text-base font-extrabold text-indigo-600 mt-0.5">{reportMonthsAllowed} Months</div>
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl text-xs text-slate-700 flex flex-col gap-2">
              <strong className="text-indigo-900 font-bold">Why banks love this scorecard:</strong>
              <p className="text-slate-600 leading-relaxed">
                Commercial lenders and microfinance institutions use this verified digital POS turnover record to instantly pre-qualify traders for working capital loans without requiring manual paper ledgers or collateral statements.
              </p>
            </div>

            <button 
              onClick={() => {
                alert(`SUCCESS: Official Bank Financial Scoring PDF downloaded for ${username || 'Trader'} based on ${reportMonthsAllowed} months audit data!`);
              }}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              📥 Download Certified Bank Financial Scoring PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function reportMonthsMonthsDisplay(months) {
  return `${months} Months`;
}
