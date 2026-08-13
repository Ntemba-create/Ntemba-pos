import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('pos'); // 'login', 'signup', 'forgot', 'pos'
  
  // Auth State
  const [username, setUsername] = useState('DemoTrader');
  const [password, setPassword] = useState('••••••••');
  const [selectedTier, setSelectedTier] = useState('Standard'); 

  // Navigation & POS State
  const [activeBottomTab, setActiveBottomTab] = useState('sales'); // 'sales', 'inventory', 'reports'
  const [cart, setCart] = useState([]);
  
  // Custom Sale Input for Tier 1 / Quick Entry
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemUnit, setCustomItemUnit] = useState('units'); // 'units', 'kg', 'liters'
  const [customItemQty, setCustomItemQty] = useState('1');
  
  // Mock Inventory Database with Weight & Volume Metrics
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Airtime Voucher', price: 20, unit: 'units', category: 'Telecom', stock: 45 },
    { id: 2, name: 'Cooking Oil', price: 35, unit: 'liters', category: 'Liquids', stock: 50 },
    { id: 3, name: 'Fresh Tomatoes', price: 25, unit: 'kg', category: 'Produce', stock: 15.5 },
    { id: 4, name: 'Maize Meal', price: 180, unit: 'kg', category: 'Groceries', stock: 30 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('units');

  // Predictive history for repeat custom items
  const [recentCustomSales, setRecentCustomSales] = useState([
    { name: 'Fresh Tomatoes', price: 25, unit: 'kg' },
    { name: 'Cooking Oil', price: 35, unit: 'liters' },
  ]);

  // Dynamic Theme Config per Tier (3D Banking Feel)
  const getThemeConfig = (tier) => {
    switch (tier) {
      case 'Basic':
        return {
          name: 'Basic',
          bgMain: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
          headerBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)]',
          cardBg: 'bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          accentColor: 'text-emerald-400',
          buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_8px_20px_rgba(16,185,129,0.4)] border-t border-white/20 active:translate-y-0.5',
          activeNav: 'text-emerald-400 font-extrabold scale-105 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]',
          inputBg: 'bg-emerald-950/40 border-emerald-500/30 text-white placeholder-emerald-300/40 focus:border-emerald-400',
          tabBarBg: 'bg-emerald-950/90 border-emerald-500/20 backdrop-blur-md',
          isDark: true
        };
      case 'Standard':
        return {
          name: 'Standard',
          bgMain: 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950',
          headerBg: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)]',
          cardBg: 'bg-blue-950/20 backdrop-blur-xl border border-blue-500/20 shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5)]',
          badgeBg: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          accentColor: 'text-blue-400',
          buttonBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_8px_20px_rgba(37,99,235,0.4)] border-t border-white/20 active:translate-y-0.5',
          activeNav: 'text-blue-400 font-extrabold scale-105 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]',
          inputBg: 'bg-blue-950/40 border-blue-500/30 text-white placeholder-blue-300/40 focus:border-blue-400',
          tabBarBg: 'bg-blue-950/90 border-blue-500/20 backdrop-blur-md',
          isDark: true
        };
      case 'Enterprise':
      default:
        return {
          name: 'Enterprise',
          bgMain: 'bg-gradient-to-br from-neutral-950 via-stone-900 to-zinc-950',
          headerBg: 'bg-gradient-to-r from-neutral-900 via-stone-900 to-amber-950 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.3)] border-b border-amber-500/30',
          cardBg: 'bg-neutral-900/60 backdrop-blur-xl border border-amber-500/30 shadow-[0_15px_25px_-8px_rgba(0,0,0,0.8)]',
          badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          accentColor: 'text-amber-400',
          buttonBg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-[0_8px_20px_rgba(217,119,6,0.5)] border-t border-white/30 active:translate-y-0.5 text-black font-black',
          activeNav: 'text-amber-400 font-extrabold scale-105 drop-shadow-[0_0_12px_rgba(217,119,6,0.8)]',
          inputBg: 'bg-neutral-950 border-amber-500/30 text-amber-100 placeholder-amber-400/30 focus:border-amber-400',
          tabBarBg: 'bg-neutral-950/95 border-amber-500/30 backdrop-blur-md',
          isDark: true
        };
    }
  };

  const theme = getThemeConfig(selectedTier);

  const getReportMonths = (tier) => {
    if (tier === 'Basic') return 3;
    if (tier === 'Standard') return 6;
    if (tier === 'Enterprise') return 12;
    return 3;
  };

  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit);
      if (existing) {
        return prev.map(i => (i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit) ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { ...item, qty: quantity }];
    });
  };

  const handleCustomSaleSubmit = (e) => {
    e.preventDefault();
    if (!customItemName || !customItemPrice) return;
    const priceVal = parseFloat(customItemPrice);
    const qtyVal = parseFloat(customItemQty || 1);
    
    addToCart({ name: customItemName, price: priceVal, unit: customItemUnit }, qtyVal);

    if (!recentCustomSales.some(s => s.name.toLowerCase() === customItemName.toLowerCase())) {
      setRecentCustomSales(prev => [...prev, { name: customItemName, price: priceVal, unit: customItemUnit }]);
    }

    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty('1');
  };

  const handleAddInventoryItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const item = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      unit: newItemUnit,
      stock: selectedTier === 'Basic' ? null : parseFloat(newItemStock || 0)
    };
    setInventory(prev => [...prev, item]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
    setNewItemUnit('units');
  };

  const handleDeleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Void active sale/cart
  const handleVoidSale = () => {
    if (cart.length === 0) {
      alert("Cart is already empty.");
      return;
    }
    if (window.confirm("Are you sure you want to void this current sale transaction?")) {
      setCart([]);
      alert("Transaction successfully voided and cleared.");
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const backgroundFee = total * 0.01; 
  const reportMonthsAllowed = getReportMonths(selectedTier);
  const filteredSuggestions = recentCustomSales.filter(s => 
    customItemName && s.name.toLowerCase().includes(customItemName.toLowerCase())
  );

  // Thermal WhatsApp Receipt Generator
  const sendWhatsAppReceipt = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Add items before sending a receipt.");
      return;
    }

    const dateTime = new Date().toLocaleString();
    let receiptText = ````text
================================
          NTEMBA POS            
================================
📞 Tel: +260 97 0000000          
📧 Email: support@ntemba.com     
📍 Loc: Lusaka Central, Zambia  
--------------------------------
Date: ${dateTime}
Cashier: ${username}
Tier: ${selectedTier} (${theme.name} Theme)
--------------------------------
QTY/UNIT   ITEM          TOTAL  
--------------------------------\n`;

    cart.forEach(item => {
      const lineTotal = (item.price * item.qty).toFixed(2);
      const qtyStr = `${item.qty}${item.unit === 'units' ? 'pcs' : item.unit}`;
      receiptText += `${qtyStr.padEnd(10)} ${item.name.substring(0, 12).padEnd(12)} ZMW${lineTotal}\n`;
    });

    receiptText += `--------------------------------
TOTAL DUE:              ZMW ${total.toFixed(2)}
--------------------------------
     THANK YOU FOR SHOPPING!     
    Powered by Ntemba POS       
================================````;

    const encodedUri = encodeURIComponent(receiptText);
    window.open(`https://api.whatsapp.com/send?text=${encodedUri}`, '_blank');
  };

  return (
    <div className={`flex flex-col h-full w-full ${theme.bgMain} select-none overflow-hidden font-sans text-white transition-colors duration-500`}>
      
      {/* 🛠️ DEV DEBUGGER BAR */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto shrink-0 z-50">
        <div className="flex items-center gap-1.5 font-bold text-amber-400 whitespace-nowrap mr-2">
          <span>⚡ 3D Theme Inspector:</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button onClick={() => setView('login')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'login' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>1. Login</button>
          <button onClick={() => setView('signup')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'signup' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>2. Sign Up</button>
          <button onClick={() => setView('forgot')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'forgot' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>3. Forgot Pwd</button>
          <button onClick={() => setView('pos')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'pos' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>4. App Home</button>
          <span className="text-slate-700 mx-1">|</span>
          <span className="text-slate-400">Tier Palette:</span>
          <select 
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-900 text-amber-300 border border-amber-500/40 rounded px-1.5 py-0.5 text-[10px] font-bold outline-none cursor-pointer shadow-sm"
          >
            <option value="Basic">Basic (Emerald 3D)</option>
            <option value="Standard">Standard (Stanbic Blue)</option>
            <option value="Enterprise">Enterprise (Obsidian & Gold)</option>
          </select>
        </div>
      </div>

      {/* 1. LOGIN INTERFACE */}
      {view === 'login' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full p-6">
          <div className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col gap-6 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="text-center relative z-10">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase mb-2 ${theme.badgeBg}`}>Stanbic Security Protocol</span>
              <h1 className="text-3xl font-black tracking-tight mb-1">Ntemba POS</h1>
              <p className="text-slate-300 text-xs font-medium">Secure Terminal • {selectedTier} Theme</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm outline-none border shadow-inner ${theme.inputBg}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm outline-none border shadow-inner ${theme.inputBg}`} />
              </div>
              <button type="submit" className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-xl cursor-pointer transition-all ${theme.buttonBg}`}>Sign In</button>
            </form>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mt-2 relative z-10">
              <button onClick={() => setView('forgot')} className="hover:text-white cursor-pointer">Forgot password?</button>
              <button onClick={() => setView('signup')} className={`${theme.accentColor} font-bold hover:underline cursor-pointer`}>Create Account</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGN UP INTERFACE */}
      {view === 'signup' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full p-6 overflow-y-auto">
          <div className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col gap-5 text-white my-auto">
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase mb-2 ${theme.badgeBg}`}>Choose 3D Theme Tier</span>
              <h1 className="text-2xl font-black tracking-tight mb-1">Create Account</h1>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm outline-none border shadow-inner ${theme.inputBg}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm outline-none border shadow-inner ${theme.inputBg}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Select Subscription Tier & 3D Palette</label>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Basic', desc: 'Emerald & Mint 3D Palette (3M Audit)' },
                    { name: 'Standard', desc: 'Stanbic Blue Corporate 3D (6M Audit)' },
                    { name: 'Enterprise', desc: 'Obsidian & Gold Metallic 3D (12M Audit)' }
                  ].map(tier => (
                    <div 
                      key={tier.name}
                      onClick={() => setSelectedTier(tier.name)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex justify-between items-center shadow-lg ${
                        selectedTier === tier.name ? 'bg-white/20 border-white scale-[1.02]' : 'bg-black/30 border-white/10 hover:bg-black/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{tier.name} Tier</div>
                        <div className="text-[10px] text-slate-300 font-semibold">{tier.desc}</div>
                      </div>
                      <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${selectedTier === tier.name ? 'bg-white text-black' : 'text-slate-400'}`}>
                        {selectedTier === tier.name ? 'Active' : 'Select'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-xl cursor-pointer transition-all ${theme.buttonBg}`}>Complete Sign Up</button>
            </form>
            <div className="text-center text-xs text-slate-300 mt-1">
              Already have an account? <button onClick={() => setView('login')} className={`${theme.accentColor} font-bold hover:underline cursor-pointer`}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FORGOT PASSWORD INTERFACE */}
      {view === 'forgot' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full p-6">
          <div className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col gap-6 text-white">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight mb-1">Reset Password</h1>
              <p className="text-slate-300 text-xs font-medium">Recover terminal access</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('login'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={`w-full rounded-xl px-4 py-3 text-sm outline-none border shadow-inner ${theme.inputBg}`} />
              </div>
              <button type="submit" className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-xl cursor-pointer transition-all ${theme.buttonBg}`}>Send Reset Instructions</button>
            </form>
            <div className="text-center text-xs text-slate-300 mt-1">
              Remembered password? <button onClick={() => setView('login')} className={`${theme.accentColor} font-bold hover:underline cursor-pointer`}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN APP HOME (3D THEMED & 3D ICON BUTTONS) */}
      {view === 'pos' && (
        <div className="flex flex-col flex-1 w-full overflow-hidden relative">
          
          {/* Header */}
          <header className={`px-5 py-3.5 text-white flex justify-between items-center shrink-0 z-20 ${theme.headerBg}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">💳</span>
                <h1 className="text-base font-black tracking-tight">Ntemba POS</h1>
              </div>
              <span className="text-[10px] text-white/80 font-semibold">{username} • <span className="text-white font-extrabold underline">{selectedTier} Tier ({theme.name})</span></span>
            </div>
            <button onClick={() => setView('login')} className="bg-black/20 hover:bg-black/40 border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md">Logout</button>
          </header>

          {/* MAIN CONTENT AREA PER ACTIVE BOTTOM TAB */}
          <div className="flex-1 overflow-y-auto flex flex-col pb-24 p-4">
            
            {/* TAB 1: HOME / MAKING A SALE */}
            {activeBottomTab === 'sales' && (
              <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                
                <div className={`p-5 rounded-3xl shadow-2xl flex flex-col gap-3 transition-all ${theme.cardBg}`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-white/10 shadow-inner text-base">⚡</span> Quick Sale Entry (Units, Kg, Liters)
                    </h2>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md ${theme.badgeBg}`}>
                      {selectedTier === 'Basic' ? 'Emerald Free-Text' : selectedTier === 'Standard' ? 'Stanbic Smart Entry' : 'Enterprise Obsidian Mode'}
                    </span>
                  </div>

                  <form onSubmit={handleCustomSaleSubmit} className="flex flex-col gap-2 relative">
                    <div className="flex gap-2 flex-wrap md:flex-nowrap">
                      <div className="relative flex-1 min-w-[140px]">
                        <input 
                          type="text" 
                          placeholder="Item Name (e.g. Tomatoes)..."
                          value={customItemName}
                          onChange={e => setCustomItemName(e.target.value)}
                          className={`w-full rounded-2xl px-4 py-3 text-xs font-medium outline-none border shadow-inner ${theme.inputBg}`}
                        />
                        {filteredSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-neutral-900 border border-white/25 rounded-2xl shadow-2xl mt-1.5 z-30 overflow-hidden backdrop-blur-xl">
                            {filteredSuggestions.map((s, idx) => (
                              <div 
                                key={idx}
                                onClick={() => { setCustomItemName(s.name); setCustomItemPrice(s.price.toString()); setCustomItemUnit(s.unit || 'units'); }}
                                className="px-4 py-2.5 text-xs hover:bg-white/10 cursor-pointer flex justify-between font-medium text-white border-b border-white/10 last:border-b-0"
                              >
                                <span>⚡ {s.name} ({s.unit})</span>
                                <span className={`font-bold ${theme.accentColor}`}>ZMW {s.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Qty"
                        value={customItemQty}
                        onChange={e => setCustomItemQty(e.target.value)}
                        className={`w-20 rounded-2xl px-3 py-3 text-xs font-medium outline-none border shadow-inner text-center ${theme.inputBg}`}
                      />

                      <select 
                        value={customItemUnit}
                        onChange={e => setCustomItemUnit(e.target.value)}
                        className={`w-28 rounded-2xl px-3 py-3 text-xs font-bold outline-none cursor-pointer border shadow-inner ${theme.inputBg}`}
                      >
                        <option value="units" className="bg-neutral-900">Units (pcs)</option>
                        <option value="kg" className="bg-neutral-900">Kg (Weight)</option>
                        <option value="liters" className="bg-neutral-900">Liters (Vol)</option>
                      </select>
                      
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Price (ZMW)"
                        value={customItemPrice}
                        onChange={e => setCustomItemPrice(e.target.value)}
                        className={`w-32 rounded-2xl px-4 py-3 text-xs font-medium outline-none border shadow-inner ${theme.inputBg}`}
                      />
                      
                      <button type="submit" className={`px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-lg ${theme.buttonBg}`}>Add</button>
                    </div>
                  </form>
                </div>

                <div className={`p-5 rounded-3xl shadow-2xl flex flex-col gap-3 ${theme.cardBg}`}>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-white/10 shadow-inner text-base">📦</span> Quick Tap Catalog
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inventory.map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => addToCart(prod, 1)} 
                        className="bg-black/30 hover:bg-black/50 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between h-24 cursor-pointer hover:border-white/40 transition-all shadow-[0_8px_16px_-4px_rgba(0,0,0,0.6)] active:scale-95 group"
                      >
                        <span className="font-bold text-white text-xs group-hover:translate-x-0.5 transition-transform">{prod.name}</span>
                        <div className="flex justify-between items-end border-t border-white/10 pt-2">
                          <span className={`font-black text-xs ${theme.accentColor}`}>ZMW {prod.price.toFixed(2)}</span>
                          {prod.stock !== null && <span className="text-[10px] text-white/50">{prod.stock} {prod.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-3xl shadow-2xl flex flex-col gap-3 ${theme.cardBg}`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-white/10 shadow-inner text-base">🛒</span> Active Transaction Cart
                    </h2>
                    {cart.length > 0 && (
                      <button 
                        onClick={handleVoidSale}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all shadow-md flex items-center gap-1"
                      >
                        <span>❌ Void Sale</span>
                      </button>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-white/40 text-xs text-center py-6">No items added to current sale yet</p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl text-xs shadow-inner">
                          <span>{item.name} ({item.qty} {item.unit})</span>
                          <strong className={theme.accentColor}>ZMW {(item.price * item.qty).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-black text-white">
                    <span>Total Due</span>
                    <span className={`text-base ${theme.accentColor}`}>ZMW {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => { alert(`Charged ZMW ${total.toFixed(2)} successfully! (1% Platform Fee of ZMW ${backgroundFee.toFixed(2)} recorded in backend ledger)`); setCart([]); }} className={`flex-1 py-3.5 rounded-2xl font-extrabold text-xs cursor-pointer shadow-xl transition-all ${theme.buttonBg}`}>
                      Charge ZMW {total.toFixed(2)}
                    </button>
                    <button onClick={sendWhatsAppReceipt} className="px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl font-extrabold text-xs cursor-pointer shadow-xl flex items-center gap-1.5 hover:brightness-110 active:translate-y-0.5 border-t border-white/20">
                      <span>💬 Send WhatsApp Receipt</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: INVENTORY & STOCK MAINTENANCE */}
            {activeBottomTab === 'inventory' && (
              <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                <div className={`p-6 rounded-3xl shadow-2xl flex flex-col gap-4 ${theme.cardBg}`}>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-white/10 text-base">📦</span> Inventory & Stock Maintenance
                      </h2>
                      <p className="text-xs text-white/50 mt-0.5">Manage stock items in {theme.name} Theme mode</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddInventoryItem} className="flex flex-col gap-3 bg-black/30 p-4 rounded-2xl border border-white/10 shadow-inner">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wide">Add New Stock Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input 
                        type="text" 
                        placeholder="Item Name" 
                        value={newItemName} 
                        onChange={e => setNewItemName(e.target.value)} 
                        className={`rounded-xl px-3 py-2.5 text-xs outline-none border ${theme.inputBg}`}
                      />
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Price per unit (ZMW)" 
                        value={newItemPrice} 
                        onChange={e => setNewItemPrice(e.target.value)} 
                        className={`rounded-xl px-3 py-2.5 text-xs outline-none border ${theme.inputBg}`}
                      />
                      <select 
                        value={newItemUnit} 
                        onChange={e => setNewItemUnit(e.target.value)} 
                        className={`rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer border ${theme.inputBg}`}
                      >
                        <option value="units" className="bg-neutral-900">Units (pcs)</option>
                        <option value="kg" className="bg-neutral-900">Kilograms (kg)</option>
                        <option value="liters" className="bg-neutral-900">Liters (L)</option>
                      </select>
                      {selectedTier !== 'Basic' && (
                        <input 
                          type="number" 
                          step="any"
                          placeholder="Initial Stock Count" 
                          value={newItemStock} 
                          onChange={e => setNewItemStock(e.target.value)} 
                          className={`rounded-xl px-3 py-2.5 text-xs outline-none border ${theme.inputBg}`}
                        />
                      )}
                    </div>
                    <button type="submit" className={`self-end px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-lg ${theme.buttonBg}`}>Save to Inventory</button>
                  </form>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wide">Current Catalog</h3>
                    {inventory.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-black/40 border border-white/10 px-4 py-3 rounded-2xl text-xs shadow-inner">
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-white/40 text-[10px]">Category: {item.category || 'General'} • Sold by: <strong className={theme.accentColor}>{item.unit}</strong></span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className={`font-black block ${theme.accentColor}`}>ZMW {item.price.toFixed(2)} / {item.unit}</span>
                            {item.stock !== null && <span className="text-[10px] text-white/50">Stock: {item.stock} {item.unit}</span>}
                          </div>
                          <button 
                            onClick={() => handleDeleteInventoryItem(item.id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 p-2 rounded-xl font-bold text-xs cursor-pointer transition-all shadow-md"
                            title="Delete Item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REPORTS, PROFIT & LOSS, & BANK SCORING */}
            {activeBottomTab === 'reports' && (
              <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                
                {/* 1. SIMPLE PROFIT & LOSS STATEMENT (ALL TIERS) */}
                <div className={`p-6 rounded-3xl shadow-2xl flex flex-col gap-4 ${theme.cardBg}`}>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${theme.badgeBg}`}>Financial Statement ({theme.name} Theme)</span>
                      <h2 className="text-base font-black text-white mt-1">Profit & Loss (P&L) Summary</h2>
                    </div>
                    <span className="text-xs font-bold text-white/50">{reportMonthsAllowed}M Horizon</span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs font-medium">
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-white/70">Total Gross Revenue</span>
                      <strong className="text-white">ZMW 48,250.00</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-white/70">Cost of Goods Sold (COGS)</span>
                      <strong className="text-red-400">- ZMW 29,400.00</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10 font-bold bg-white/5 px-3 rounded-xl">
                      <span className="text-white">Gross Profit</span>
                      <span className="text-emerald-400">ZMW 18,850.00</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-white/70">Operating Expenses (Rent, Utilities)</span>
                      <strong className="text-red-400">- ZMW 4,200.00</strong>
                    </div>
                    <div className="flex justify-between py-2.5 bg-black/40 border border-white/10 px-4 rounded-2xl text-sm font-black text-white mt-1 shadow-inner">
                      <span>Net Profit</span>
                      <span className="text-emerald-400 font-extrabold">ZMW 14,650.00</span>
                    </div>
                  </div>
                </div>

                {/* 2. SALES PERFORMANCE & BANK SCORING */}
                <div className={`p-6 rounded-3xl shadow-2xl flex flex-col gap-4 ${theme.cardBg}`}>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-white/10 text-base">📊</span> Sales Volume Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-black/30 border border-white/10 p-3.5 rounded-2xl shadow-inner">
                      <span className="text-[10px] font-bold text-white/50 uppercase">Total Revenue</span>
                      <span className={`text-xl font-black block mt-0.5 ${theme.accentColor}`}>ZMW 48,250.00</span>
                    </div>
                    <div className="bg-black/30 border border-white/10 p-3.5 rounded-2xl shadow-inner">
                      <span className="text-[10px] font-bold text-white/50 uppercase">Transactions</span>
                      <span className={`text-xl font-black block mt-0.5 ${theme.accentColor}`}>1,420 orders</span>
                    </div>
                    <div className="bg-black/30 border border-white/10 p-3.5 rounded-2xl shadow-inner">
                      <span className="text-[10px] font-bold text-white/50 uppercase">Avg Basket</span>
                      <span className={`text-xl font-black block mt-0.5 ${theme.accentColor}`}>ZMW 33.98</span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl shadow-2xl flex flex-col gap-4 ${theme.cardBg}`}>
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${theme.badgeBg}`}>Bank-Grade Audit</span>
                      <h2 className="text-base font-black text-white mt-1">Trader Financial Health Scorecard</h2>
                      <p className="text-xs text-white/50">Certified Commercial Credit Evaluation • {reportMonthsAllowed}M Horizon</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">88 / 100</div>
                      <span className="text-[10px] font-bold text-white/40">Grade: A+</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`SUCCESS: Official Bank Financial Scoring PDF downloaded for ${username} in ${theme.name} Theme mode (${reportMonthsAllowed} months audit)!`)} 
                    className={`w-full py-3.5 rounded-2xl font-extrabold text-xs cursor-pointer shadow-xl ${theme.buttonBg}`}
                  >
                    📥 Download Certified Bank Financial Scoring PDF ({reportMonthsAllowed}M Horizon)
                  </button>
                </div>

                {/* 3. ENTERPRISE DESKTOP ADVISORY NOTICE */}
                {selectedTier === 'Enterprise' && (
                  <div className="bg-gradient-to-r from-neutral-900 via-stone-900 to-amber-950 p-5 rounded-3xl border border-amber-500/40 text-white flex flex-col gap-2 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🖥️</span>
                      <h3 className="text-sm font-black text-amber-300">Enterprise Desktop Version Advisory</h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      While your mobile terminal handles everyday sales with the Obsidian & Gold 3D theme, advanced Tier 3 tools—such as 
                      <strong className="text-white"> Multi-Branch Warehouse Synchronization</strong>, <strong className="text-white">Automated Tax Authority (ZRA) Integration</strong>, and <strong className="text-white">Deep ERP Bulk CSV/Excel Reporting</strong>—are built for high performance and available directly on the <strong className="text-amber-300">Ntemba POS Desktop Terminal</strong>.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* BOTTOM NAVIGATION BAR WITH 3D GLASSMORPHIC ICONS */}
          <div className={`absolute bottom-0 left-0 right-0 border-t px-6 py-2.5 flex justify-around items-center shadow-2xl z-40 ${theme.tabBarBg}`}>
            <button 
              onClick={() => setActiveBottomTab('sales')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'sales' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
            >
              <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">🛒</span>
              <span className="text-[10px]">POS Home</span>
            </button>

            <button 
              onClick={() => setActiveBottomTab('inventory')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'inventory' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
            >
              <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📦</span>
              <span className="text-[10px]">Stock & Catalog</span>
            </button>

            <button 
              onClick={() => setActiveBottomTab('reports')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'reports' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
            >
              <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📊</span>
              <span className="text-[10px]">Reports & P&L</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
