import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [tier, setTier] = useState('tier1'); // 'tier1', 'tier2', 'tier3'
  const [storeName, setStoreName] = useState('Ntemba General Store');
  const [whatsAppNumber, setWhatsAppNumber] = useState('+260970000000');
  const [cart, setCart] = useState([]);
  
  // Custom catalog entry state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemStock, setNewItemStock] = useState('');

  // Zambian HR & Payroll State (Tier 3 Exclusive)
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Chanda Mulenga', role: 'Store Cashier', gross: 4500, napsa: 225, paye: 320, nhima: 135, net: 3820 }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpGross, setNewEmpGross] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const [catalog, setCatalog] = useState([
    { id: 1, name: 'Roller Mealie Meal (25kg)', price: 210, stock: 14, unit: 'bags', category: 'Groceries' },
    { id: 2, name: 'Cooking Oil (2L)', price: 65, stock: 28, unit: 'liters', category: 'Groceries' },
    { id: 3, name: 'Kapenta (Medium Pack)', price: 45, stock: 40, unit: 'meda', category: 'Market' },
    { id: 4, name: 'Sugar (2kg)', price: 42, stock: 19, unit: 'kg', category: 'Groceries' }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 101, customer: 'John Banda', total: 'ZMW 275.00', status: 'Pending Link', date: '14 Aug, 10:30' }
  ]);

  const [ledger, setLedger] = useState([
    { id: 1, type: 'POS Sale', amount: 'ZMW 120.00', fee: 'ZMW 1.20', status: 'Settled' },
    { id: 2, type: 'Council Levy', amount: 'ZMW 15.00', fee: 'ZMW 0.00', status: 'Verified' }
  ]);

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // Dynamic Theme Configurations per Tier
  const themes = {
    tier1: {
      bg: 'bg-slate-950',
      panel: 'bg-slate-900/90 border-slate-800',
      textAccent: 'text-emerald-400',
      btnPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeTab: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    tier2: {
      bg: 'bg-zinc-950',
      panel: 'bg-zinc-900/90 border-zinc-800',
      textAccent: 'text-blue-400',
      btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      activeTab: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    tier3: {
      bg: 'bg-stone-950',
      panel: 'bg-stone-900/90 border-stone-800',
      textAccent: 'text-amber-400',
      btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-stone-950',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      activeTab: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }
  };

  const currentTheme = themes[tier];

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const handleAddCatalogItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const item = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      stock: parseInt(newItemStock) || 10,
      unit: newItemUnit,
      category: 'Custom'
    };
    setCatalog([...catalog, item]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
    alert(`Successfully added ${item.name} (${item.unit}) to inventory!`);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (tier !== 'tier3') {
      alert("HR Payroll and statutory payslips are exclusive to Tier 3 Enterprise.");
      return;
    }
    if (!newEmpName || !newEmpGross) return;

    const gross = parseFloat(newEmpGross);
    const napsa = gross * 0.05; 
    const nhima = gross * 0.01; 
    let paye = 0;
    if (gross > 5100) {
      paye = (gross - 5100) * 0.25 + 250;
    } else if (gross > 4100) {
      paye = (gross - 4100) * 0.20;
    } else {
      paye = 0;
    }

    const net = gross - (napsa + nhima + paye);

    const emp = {
      id: Date.now(),
      name: newEmpName,
      role: newEmpRole || 'Staff Member',
      gross: gross,
      napsa: parseFloat(napsa.toFixed(2)),
      paye: parseFloat(paye.toFixed(2)),
      nhima: parseFloat(nhima.toFixed(2)),
      net: parseFloat(net.toFixed(2))
    };

    setEmployees([...employees, emp]);
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpGross('');
    alert(`Employee ${emp.name} added. Statutory computations completed successfully.`);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const vat = tier !== 'tier1' ? subtotal * 0.16 : 0;
  const councilFee = tier !== 'tier1' ? 5 : 0;
  const ntembaFee = subtotal * 0.01;
  const grandTotal = subtotal + vat + councilFee + ntembaFee;

  const handleCheckout = (method) => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    const receipt = {
      id: Date.now(),
      store: storeName,
      items: [...cart],
      total: grandTotal.toFixed(2),
      method: method,
      date: new Date().toLocaleString()
    };
    setLastReceipt(receipt);
    setLedger([{ id: Date.now(), type: `POS Sale (${method})`, amount: `ZMW ${grandTotal.toFixed(2)}`, fee: `ZMW ${ntembaFee.toFixed(2)}`, status: 'Settled' }, ...ledger]);
    setShowReceiptModal(true);
    setCart([]);
  };

  const handleCreateInvoice = () => {
    if (tier === 'tier1') {
      alert("Smart Invoicing is available starting from Tier 2 Pro.");
      return;
    }
    if (cart.length === 0) {
      alert("Add items to cart first to generate an invoice!");
      return;
    }
    const newInv = {
      id: Date.now(),
      customer: `Client (${whatsAppNumber})`,
      total: `ZMW ${grandTotal.toFixed(2)}`,
      status: 'Link Generated & Shared',
      date: new Date().toLocaleTimeString()
    };
    setInvoices([newInv, ...invoices]);
    alert(`Smart Invoice generated! Remote payment link sent to WhatsApp: ${whatsAppNumber}`);
  };

  const handleYangoDispatch = () => {
    if (tier === 'tier1') {
      alert("Yango Logistics dispatch is available on Tier 2 & Tier 3.");
      return;
    }
    alert(`Yango Logistics requested! Driver dispatched for nearest pickup from ${storeName}. Estimated arrival: 8 mins.`);
  };

  const handlePayCouncil = (feeName, amount) => {
    if (tier === 'tier1') {
      alert("Municipal Levy settlements are available on Tier 2 & Tier 3.");
      return;
    }
    setLedger([{ id: Date.now(), type: `Municipal: ${feeName}`, amount: `ZMW ${amount}.00`, fee: 'ZMW 0.00', status: 'Verified' }, ...ledger]);
    alert(`Successfully paid ${feeName} (ZMW ${amount}). Digital receipt generated.`);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} text-slate-100 font-sans flex flex-col justify-between p-4 sm:p-6 transition-colors duration-500`}>
      
      <div className={`w-full mx-auto flex-1 flex flex-col transition-all duration-300 ${tier !== 'tier1' ? 'max-w-6xl' : 'max-w-md'}`}>
        
        {/* PROFESSIONAL HEADER */}
        <header className={`px-6 py-4 border ${currentTheme.panel} backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 rounded-2xl mb-4 shadow-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${currentTheme.btnPrimary} flex items-center justify-center font-black shadow-lg`}>
              N
            </div>
            <div>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                className="bg-transparent font-extrabold text-sm tracking-wide text-white focus:outline-none border-b border-transparent focus:border-slate-500 transition-all"
              />
              <p className={`text-[9px] ${currentTheme.textAccent} uppercase tracking-widest font-mono font-bold`}>
                {tier === 'tier1' && 'Community Edition • Free Tier'}
                {tier === 'tier2' && 'Pro Tier • ZRA VAT & Municipal Hub'}
                {tier === 'tier3' && 'Enterprise Tier • Multi-Store & HR Payroll'}
              </p>
            </div>
          </div>

          {/* TIER SELECTOR */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            <button onClick={() => setTier('tier1')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tier === 'tier1' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              Tier 1
            </button>
            <button onClick={() => setTier('tier2')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tier === 'tier2' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
              Tier 2
            </button>
            <button onClick={() => setTier('tier3')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tier === 'tier3' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              Tier 3
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className={`grid gap-2 mb-6 ${tier === 'tier3' ? 'grid-cols-3 sm:grid-cols-7' : 'grid-cols-3 sm:grid-cols-6'}`}>
          <button onClick={() => setActiveTab('pos')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'pos' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            🛒 POS Register
          </button>
          <button onClick={() => setActiveTab('delivery')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'delivery' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            🚚 Yango Delivery
          </button>
          <button onClick={() => setActiveTab('invoices')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'invoices' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            📄 Smart Invoices
          </button>
          <button onClick={() => setActiveTab('market')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'market' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            📢 Marketplace
          </button>
          <button onClick={() => setActiveTab('council')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'council' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            🏛️ Municipal Levies
          </button>
          <button onClick={() => setActiveTab('ledger')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'ledger' ? currentTheme.activeTab : 'bg-black/20 text-slate-400 border-white/5 hover:bg-white/5'}`}>
            📊 Audit Ledger
          </button>
          {tier === 'tier3' && (
            <button onClick={() => setActiveTab('hr')} className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer col-span-3 sm:col-span-1 border ${activeTab === 'hr' ? currentTheme.activeTab : 'bg-black/20 text-amber-400/80 border-amber-500/20 hover:bg-amber-500/10'}`}>
              👥 HR & Payslips
            </button>
          )}
        </div>

        <div className="space-y-6 flex-1 w-full">
          
          {/* POS TAB */}
          {activeTab === 'pos' && (
            <div className={`grid gap-6 ${tier !== 'tier1' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-6">
                <div className={`p-5 rounded-3xl border ${currentTheme.panel} space-y-3 shadow-lg`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Inventory Catalog & Meda Units</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${currentTheme.badge}`}>Live Stock</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {catalog.map(item => (
                      <div key={item.id} onClick={() => addToCart(item)} className="p-3 bg-black/30 border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group">
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Stock: {item.stock} ({item.unit})</p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className={`font-mono font-bold text-xs ${currentTheme.textAccent}`}>ZMW {item.price}</span>
                          <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-lg text-slate-300 group-hover:bg-white/10">+ Add</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddCatalogItem} className={`p-5 rounded-3xl border ${currentTheme.panel} space-y-3 shadow-lg`}>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Add Stock / Meda Item</h3>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Item Name (e.g. Kapenta, Tomatoes)" 
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-slate-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="Price (ZMW)" 
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none"
                      />
                      <select 
                        value={newItemUnit} 
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        className={`bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold ${currentTheme.textAccent} focus:outline-none`}
                      >
                        <option value="units" className="bg-slate-900">Units (pcs)</option>
                        <option value="kg" className="bg-slate-900">Weight (Kg)</option>
                        <option value="liters" className="bg-slate-900">Volume (Liters)</option>
                        <option value="meda" className="bg-slate-900">Meda (Bowl)</option>
                      </select>
                    </div>
                    <button type="submit" className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 transition-colors`}>
                      + Register Catalog Item
                    </button>
                  </div>
                </form>
              </div>

              <div className={`p-5 rounded-3xl border ${currentTheme.panel} space-y-4 flex flex-col justify-between shadow-lg`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Active Register Cart</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{cart.length} items</span>
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                      <p className="text-xs text-slate-500">Cart register is currently empty.</p>
                      <p className="text-[10px] text-slate-600 mt-1">Select items from catalog above to begin checkout.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.qty} {item.unit} × ZMW {item.price}</p>
                          </div>
                          <span className={`font-mono font-bold ${currentTheme.textAccent}`}>ZMW {item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>ZMW {subtotal.toFixed(2)}</span>
                    </div>
                    {tier !== 'tier1' && (
                      <div className="flex justify-between text-slate-400">
                        <span>ZRA VAT (16%)</span>
                        <span>ZMW {vat.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Ntemba Fee (1%)</span>
                      <span>ZMW {ntembaFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-black text-sm border-t border-white/10 pt-2">
                      <span>Grand Total</span>
                      <span className={currentTheme.textAccent}>ZMW {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => handleCheckout('Cash')} className="py-3 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/10 cursor-pointer">
                      💵 Cash Tendered
                    </button>
                    <button onClick={() => handleCheckout('Mobile Money')} className={`py-3 rounded-xl font-bold text-xs shadow-lg cursor-pointer ${currentTheme.btnPrimary}`}>
                      📱 Mobile Money
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HR & PAYSLIPS TAB (TIER 3 EXCLUSIVE) */}
          {activeTab === 'hr' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-6 max-w-4xl mx-auto w-full shadow-xl`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${currentTheme.textAccent}`}>Zambian Compliant HR & Payroll</h3>
                  <p className="text-[11px] text-slate-400">Automated NAPSA (5%), NHIMA (1%), and ZRA PAYE statutory calculations.</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-xl border ${currentTheme.badge}`}>
                  Tier 3 Enterprise Feature
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <form onSubmit={handleAddEmployee} className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-3 md:col-span-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add Employee</h4>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Role (e.g. Sales Cashier)" 
                      value={newEmpRole}
                      onChange={(e) => setNewEmpRole(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <input 
                      type="number" 
                      placeholder="Gross Salary (ZMW)" 
                      value={newEmpGross}
                      onChange={(e) => setNewEmpGross(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                    <button type="submit" className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                      Calculate & Save Payroll
                    </button>
                  </div>
                </form>

                <div className="space-y-3 md:col-span-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Staff Directory & Statutory Deductions</h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {employees.map(emp => (
                      <div key={emp.id} className="flex justify-between items-center bg-black/30 p-3 rounded-2xl border border-white/5 text-xs">
                        <div>
                          <p className="font-bold text-white">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">{emp.role} • Gross: ZMW {emp.gross}</p>
                          <p className={`text-[9px] ${currentTheme.textAccent} font-mono mt-1`}>NAPSA: ZMW {emp.napsa} | NHIMA: ZMW {emp.nhima} | PAYE: ZMW {emp.paye}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div>
                            <span className="text-[9px] text-slate-400 block">Net Pay</span>
                            <span className="font-mono text-emerald-400 font-bold">ZMW {emp.net}</span>
                          </div>
                          <button onClick={() => setSelectedPayslip(emp)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-[10px] border border-white/10 cursor-pointer">
                            📄 View Payslip
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* YANGO DELIVERY TAB */}
          {activeTab === 'delivery' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-4 max-w-xl mx-auto w-full shadow-xl`}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Yango Last-Mile Logistics</h3>
                <p className="text-[11px] text-slate-400">Dispatch neighborhood e-commerce orders directly to Yango couriers.</p>
              </div>
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Active Store Hub:</span>
                  <span className={`font-bold ${currentTheme.textAccent}`}>{storeName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Courier Partner:</span>
                  <span className="text-emerald-400 font-bold">Yango Delivery Lusaka</span>
                </div>
                <button onClick={handleYangoDispatch} className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer shadow-lg ${currentTheme.btnPrimary}`}>
                  🚀 Request Yango Rider Now
                </button>
              </div>
            </div>
          )}

          {/* SMART INVOICING TAB */}
          {activeTab === 'invoices' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-4 max-w-xl mx-auto w-full shadow-xl`}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Smart Invoicing & Remote Pay</h3>
                <p className="text-[11px] text-slate-400">Create automated WhatsApp payment links for remote buyers.</p>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-400">Customer WhatsApp Number</label>
                <input 
                  type="text" 
                  value={whatsAppNumber} 
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none"
                />
                <button onClick={handleCreateInvoice} className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                  🔗 Generate & Send Smart Invoice
                </button>
              </div>
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-bold uppercase text-slate-500">Recent Invoices</h4>
                {invoices.map(inv => (
                  <div key={inv.id} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <p className="font-bold text-white">{inv.customer}</p>
                      <p className="text-[10px] text-slate-400">{inv.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${currentTheme.textAccent}`}>{inv.total}</p>
                      <span className="text-[9px] text-emerald-400">{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKETPLACE ADVERTISING TAB */}
          {activeTab === 'market' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-4 max-w-xl mx-auto w-full shadow-xl`}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Marketplace Discovery & Ads</h3>
                <p className="text-[11px] text-slate-400">Broadcast your storefront stock to local buyers in your township.</p>
              </div>
              <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-3">
                <p className="text-xs text-white font-bold">Featured Neighborhood Banner</p>
                <p className="text-[11px] text-slate-400">Get listed on top of the buyer discovery feed for immediate digital orders.</p>
                <button onClick={() => alert("Store spotlight broadcasted to local marketplace directory!")} className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                  📢 Boost Store in Marketplace
                </button>
              </div>
            </div>
          )}

          {/* MUNICIPAL LEVIES TAB */}
          {activeTab === 'council' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-4 max-w-xl mx-auto w-full shadow-xl`}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Municipal & Market Council Levies</h3>
                <p className="text-[11px] text-slate-400">Instant digital settlement for local government dues.</p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-white">Daily Market Stall Fee</p>
                  <p className={`font-mono font-bold text-base ${currentTheme.textAccent}`}>ZMW 15.00</p>
                  <button onClick={() => handlePayCouncil('Daily Market Stall', 15)} className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                    Pay via Mobile Money
                  </button>
                </div>
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-white">Monthly Store Operating Permit</p>
                  <p className={`font-mono font-bold text-base ${currentTheme.textAccent}`}>ZMW 250.00</p>
                  <button onClick={() => handlePayCouncil('Monthly Store Permit', 250)} className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                    Pay via Mobile Money
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FINANCIAL LEDGER TAB */}
          {activeTab === 'ledger' && (
            <div className={`p-6 rounded-3xl border ${currentTheme.panel} space-y-3 max-w-xl mx-auto w-full shadow-xl`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Financial Audit Ledger</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {ledger.map(entry => (
                  <div key={entry.id} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <p className="font-bold text-white">{entry.type}</p>
                      <p className="text-[10px] text-slate-400">Fee: {entry.fee}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${currentTheme.textAccent}`}>{entry.amount}</p>
                      <span className="text-[9px] text-emerald-400 font-mono">{entry.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* PAYSLIP MODAL */}
        {selectedPayslip && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className={`bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-mono`}>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black text-white">{storeName}</h3>
                <p className="text-[10px] text-amber-400">Statutory Payslip • Zambia</p>
                <p className="text-[9px] text-slate-400">Employee: {selectedPayslip.name} ({selectedPayslip.role})</p>
              </div>
              <div className="space-y-2 border-t border-b border-stone-800 py-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Salary:</span>
                  <span>ZMW {selectedPayslip.gross}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NAPSA (5%):</span>
                  <span>- ZMW {selectedPayslip.napsa}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NHIMA (1%):</span>
                  <span>- ZMW {selectedPayslip.nhima}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ZRA PAYE:</span>
                  <span>- ZMW {selectedPayslip.paye}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-400">
                <span>Net Pay:</span>
                <span>ZMW {selectedPayslip.net}</span>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="w-full py-3 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer">
                Close Payslip
              </button>
            </div>
          </div>
        )}

        {/* RECEIPT MODAL */}
        {showReceiptModal && lastReceipt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl`}>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black text-white">{lastReceipt.store}</h3>
                <p className={`text-[10px] ${currentTheme.textAccent} font-mono`}>Fiscal Receipt • Verified</p>
                <p className="text-[9px] text-slate-400">{lastReceipt.date}</p>
              </div>
              <div className="space-y-2 border-t border-b border-white/10 py-3 text-xs">
                {lastReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-slate-300">{it.name} (x{it.qty} {it.unit})</span>
                    <span className="font-mono text-white">ZMW {it.price * it.qty}</span>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between font-mono text-xs font-black ${currentTheme.textAccent}`}>
                <span>Total Paid ({lastReceipt.method}):</span>
                <span>ZMW {lastReceipt.total}</span>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer ${currentTheme.btnPrimary}`}>
                Close Receipt
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
