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
Tier: ${selectedTier}
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

    // Open WhatsApp Web with the thermal pre-formatted receipt string
    const encodedUri = encodeURIComponent(receiptText);
    window.open(`https://api.whatsapp.com/send?text=${encodedUri}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 select-none overflow-hidden font-sans">
      
      {/* 🛠️ DEV DEBUGGER BAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto shrink-0 z-50">
        <div className="flex items-center gap-1.5 font-bold text-indigo-400 whitespace-nowrap mr-2">
          <span>⚡ Interface Inspector:</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button onClick={() => setView('login')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>1. Login</button>
          <button onClick={() => setView('signup')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'signup' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>2. Sign Up</button>
          <button onClick={() => setView('forgot')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'forgot' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>3. Forgot Pwd</button>
          <button onClick={() => setView('pos')} className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${view === 'pos' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>4. App Home (Airtel Style)</button>
          <span className="text-slate-700 mx-1">|</span>
          <span className="text-slate-400">Tier:</span>
          <select 
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-bold outline-none cursor-pointer"
          >
            <option value="Basic">Basic (No Stock / Free Text)</option>
            <option value="Standard">Standard (6M Audit)</option>
            <option value="Enterprise">Enterprise (12M Audit)</option>
          </select>
        </div>
      </div>

      {/* 1. LOGIN INTERFACE */}
      {view === 'login' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight mb-1">Ntemba POS</h1>
              <p className="text-slate-300 text-xs font-medium">Sign in to your cashier terminal</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
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

      {/* 2. SIGN UP INTERFACE */}
      {view === 'signup' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 overflow-y-auto">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-5 text-white my-auto">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight mb-1">Create Account</h1>
              <p className="text-slate-300 text-xs font-medium">Select your plan tier</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('pos'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subscription Tier</label>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Basic', desc: 'Free-text sales & 3M audit' },
                    { name: 'Standard', desc: 'Inventory mgmt & 6M audit' },
                    { name: 'Enterprise', desc: 'Full stock & 12M audit' }
                  ].map(tier => (
                    <div 
                      key={tier.name}
                      onClick={() => setSelectedTier(tier.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                        selectedTier === tier.name ? 'bg-indigo-600/40 border-indigo-400' : 'bg-slate-900/40 border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{tier.name} Tier</div>
                        <div className="text-[10px] text-indigo-300 font-bold">{tier.desc}</div>
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

      {/* 3. FORGOT PASSWORD INTERFACE */}
      {view === 'forgot' && (
        <div className="flex flex-col items-center justify-center flex-1 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 text-white">
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight mb-1">Reset Password</h1>
              <p className="text-slate-300 text-xs font-medium">Enter your username to recover access</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setView('login'); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-extrabold text-sm shadow-lg cursor-pointer">Send Reset Instructions</button>
            </form>
            <div className="text-center text-xs text-slate-400 mt-1">
              Remembered password? <button onClick={() => setView('login')} className="text-indigo-400 font-bold hover:underline cursor-pointer">Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN APP HOME (AIRTEL-STYLE BOTTOM NAV) */}
      {view === 'pos' && (
        <div className="flex flex-col flex-1 w-full bg-slate-50 overflow-hidden relative">
          
          {/* Header */}
          <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white flex justify-between items-center shadow-md shrink-0">
            <div>
              <h1 className="text-base font-black tracking-tight">Ntemba POS</h1>
              <span className="text-[10px] text-indigo-200 font-semibold">{username} • <span className="text-white font-bold">{selectedTier} Tier</span></span>
            </div>
            <button onClick={() => setView('login')} className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer">Logout</button>
          </header>

          {/* MAIN CONTENT AREA PER ACTIVE BOTTOM TAB */}
          <div className="flex-1 overflow-y-auto flex flex-col pb-20">
            
            {/* TAB 1: HOME / MAKING A SALE */}
            {activeBottomTab === 'sales' && (
              <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto w-full">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-extrabold text-slate-900">⚡ Quick Sale Entry (Units, Kg, Liters)</h2>
                    <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                      {selectedTier === 'Basic' ? 'Free-Text & Predictive Mode' : 'Catalog Tap or Quick Add'}
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
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-indigo-600"
                        />
                        {filteredSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl mt-1 z-20 overflow-hidden">
                            {filteredSuggestions.map((s, idx) => (
                              <div 
                                key={idx}
                                onClick={() => { setCustomItemName(s.name); setCustomItemPrice(s.price.toString()); setCustomItemUnit(s.unit || 'units'); }}
                                className="px-3 py-2 text-xs hover:bg-indigo-50 cursor-pointer flex justify-between font-medium text-slate-700 border-b last:border-b-0"
                              >
                                <span>⚡ {s.name} ({s.unit})</span>
                                <span className="font-bold text-indigo-600">ZMW {s.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Qty / Weight"
                        value={customItemQty}
                        onChange={e => setCustomItemQty(e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-indigo-600"
                      />

                      <select 
                        value={customItemUnit}
                        onChange={e => setCustomItemUnit(e.target.value)}
                        className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="units">Units (pcs)</option>
                        <option value="kg">Kg (Weight)</option>
                        <option value="liters">Liters (Vol)</option>
                      </select>
                      
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Price (ZMW)"
                        value={customItemPrice}
                        onChange={e => setCustomItemPrice(e.target.value)}
                        className="w-28 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-indigo-600"
                      />
                      
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">Add</button>
                    </div>
                  </form>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h2 className="text-sm font-extrabold text-slate-900">📦 Quick Tap Catalog</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {inventory.map(prod => (
                      <div key={prod.id} onClick={() => addToCart(prod, 1)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between h-20 cursor-pointer hover:border-indigo-500 transition-all">
                        <span className="font-bold text-slate-800 text-xs">{prod.name}</span>
                        <div className="flex justify-between items-end">
                          <span className="font-extrabold text-indigo-600 text-xs">ZMW {prod.price.toFixed(2)} / {prod.unit}</span>
                          {prod.stock !== null && <span className="text-[10px] text-slate-400">Stock: {prod.stock} {prod.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h2 className="text-sm font-extrabold text-slate-900">🛒 Active Cart</h2>
                  {cart.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">No items added to current sale yet</p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 border px-3 py-2 rounded-xl text-xs">
                          <span>{item.name} ({item.qty} {item.unit})</span>
                          <strong>ZMW {(item.price * item.qty).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Total Due</span>
                    <span className="text-indigo-600 text-base">ZMW {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => { alert(`Charged ZMW ${total.toFixed(2)} successfully! (1% Platform Fee of ZMW ${backgroundFee.toFixed(2)} recorded in backend ledger)`); setCart([]); }} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-extrabold text-xs cursor-pointer shadow-md">
                      Charge ZMW {total.toFixed(2)}
                    </button>
                    <button onClick={sendWhatsAppReceipt} className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5">
                      <span>💬 Send Thermal WhatsApp Receipt</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: INVENTORY & STOCK MAINTENANCE (ADD & DELETE) */}
            {activeBottomTab === 'inventory' && (
              <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto w-full">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h2 className="text-base font-black text-slate-900">Inventory & Stock Maintenance</h2>
                      <p className="text-xs text-slate-500">Manage items by units, weight (kg), or volume (liters) for your tier ({selectedTier})</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddInventoryItem} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Add New Stock Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input 
                        type="text" 
                        placeholder="Item Name" 
                        value={newItemName} 
                        onChange={e => setNewItemName(e.target.value)} 
                        className="bg-white border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Price per unit/kg/L (ZMW)" 
                        value={newItemPrice} 
                        onChange={e => setNewItemPrice(e.target.value)} 
                        className="bg-white border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                      <select 
                        value={newItemUnit} 
                        onChange={e => setNewItemUnit(e.target.value)} 
                        className="bg-white border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="units">Units (pcs)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="liters">Liters (L)</option>
                      </select>
                      {selectedTier !== 'Basic' && (
                        <input 
                          type="number" 
                          step="any"
                          placeholder="Initial Stock Count" 
                          value={newItemStock} 
                          onChange={e => setNewItemStock(e.target.value)} 
                          className="bg-white border rounded-xl px-3 py-2 text-xs outline-none"
                        />
                      )}
                    </div>
                    <button type="submit" className="self-end bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Save to Inventory</button>
                  </form>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Current Catalog & Maintenance List</h3>
                    {inventory.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white border px-4 py-3 rounded-xl text-xs shadow-sm">
                        <div>
                          <span className="font-bold text-slate-800 block">{item.name}</span>
                          <span className="text-slate-400 text-[10px]">Category: {item.category || 'General'} • Sold by: <strong className="text-indigo-600">{item.unit}</strong></span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-extrabold text-indigo-600 block">ZMW {item.price.toFixed(2)} / {item.unit}</span>
                            {item.stock !== null && <span className="text-[10px] text-slate-500">Stock: {item.stock} {item.unit}</span>}
                          </div>
                          <button 
                            onClick={() => handleDeleteInventoryItem(item.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg font-bold text-xs cursor-pointer transition-all"
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

            {/* TAB 3: REPORTS & BANK SCORING PDF */}
            {activeBottomTab === 'reports' && (
              <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto w-full">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h2 className="text-base font-black text-slate-900">📊 Sales Performance Reports</h2>
                  <p className="text-xs text-slate-500">Aggregated transaction records across your plan audit horizon: <strong className="text-indigo-600">{reportMonthsAllowed} Months</strong> ({selectedTier} Tier)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-indigo-50 border p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Total Revenue</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">ZMW 48,250.00</span>
                    </div>
                    <div className="bg-violet-50 border p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-violet-600 uppercase">Transactions</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">1,420 orders</span>
                    </div>
                    <div className="bg-emerald-50 border p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Avg Basket</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">ZMW 33.98</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Bank-Grade Audit ({selectedTier} Tier)</span>
                      <h2 className="text-base font-black text-slate-900 mt-1">Trader Financial Health Scorecard</h2>
                      <p className="text-xs text-slate-500">Certified for Commercial Credit Evaluation • {reportMonthsAllowed} Months Verified Horizon</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-600">88 / 100</div>
                      <span className="text-[10px] font-bold text-slate-400">Grade: A+</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`SUCCESS: Official Bank Financial Scoring PDF downloaded for ${username} based on the ${selectedTier} tier (${reportMonthsAllowed} months audit)!`)} 
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-extrabold text-xs cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    📥 Download Certified Bank Financial Scoring PDF ({reportMonthsAllowed}M Horizon)
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* BOTTOM NAVIGATION BAR */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex justify-around items-center shadow-2xl z-40">
            <button 
              onClick={() => setActiveBottomTab('sales')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'sales' ? 'text-indigo-600 font-extrabold scale-105' : 'text-slate-400 font-medium hover:text-slate-600'}`}
            >
              <span className="text-lg">🛒</span>
              <span className="text-[10px]">POS Home</span>
            </button>

            <button 
              onClick={() => setActiveBottomTab('inventory')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'inventory' ? 'text-indigo-600 font-extrabold scale-105' : 'text-slate-400 font-medium hover:text-slate-600'}`}
            >
              <span className="text-lg">📦</span>
              <span className="text-[10px]">Stock & Catalog</span>
            </button>

            <button 
              onClick={() => setActiveBottomTab('reports')} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'reports' ? 'text-indigo-600 font-extrabold scale-105' : 'text-slate-400 font-medium hover:text-slate-600'}`}
            >
              <span className="text-lg">📊</span>
              <span className="text-[10px]">Reports & Scoring</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
