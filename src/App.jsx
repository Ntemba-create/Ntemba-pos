import React, { useState } from 'react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('signup'); // 'signup', 'app'
  const [userRole, setUserRole] = useState('storeowner'); // 'storeowner', 'customer', 'both'
  const [tpin, setTpin] = useState('');
  const [councilId, setCouncilId] = useState(''); // Local Council Levy ID
  const [traderCategory, setTraderCategory] = useState('informal-exempt'); // 'informal-exempt', 'vat-registered'
  
  // Store / Trader Profile & Live Location Tracking
  const [isMobileTrader, setIsMobileTrader] = useState(false);
  const [currentLocation, setIsMobileTraderLocation] = useState({ lat: -15.3875, lng: 28.3228 });
  const [storeName, setStoreName] = useState('Ntemba Enterprise Terminal');
  
  // Navigation Tabs
  const [activeBottomTab, setActiveBottomTab] = useState('sales'); 
  
  // Cart & Orders
  const [cart, setCart] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([
    { id: 'ORD-901', customer: 'Kabwe M.', items: '2x Roller Mealie Meal (25kg)', total: 'ZMW 650', status: 'Pending Pickup', payment: 'Mobile Money', timestamp: '10:14 AM' }
  ]);

  // Inventory Catalog
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Roller Mealie Meal 25kg', price: 325, stock: 14, unit: 'bag', type: 'store', category: 'Groceries', zeroRated: true },
    { id: 2, name: 'Cooking Oil 2L', price: 95, stock: 30, unit: 'btl', type: 'store', category: 'Groceries', zeroRated: false },
    { id: 3, name: 'Kapenta (Siavonga) 500g', price: 120, stock: 8, unit: 'pkt', type: 'store', category: 'Groceries', zeroRated: true },
    { id: 4, name: 'Moving House: 3-Seater Leather Sofa', price: 1500, stock: 1, unit: 'pcs', type: 'garage-sale', category: 'Furniture', zeroRated: false }
  ]);

  // Smart Invoice & Fiscal Receipt Modal State
  const [activeSmartInvoice, setActiveSmartInvoice] = useState(null);

  // Financial Ledger & ZRA Compliance History
  const [ledgerHistory, setLedgerHistory] = useState([
    { id: 'TXN-101', type: 'In-Store POS', method: 'Cash', total: 420, items: 3, time: 'Yesterday', fiscalCode: 'ZRA-FISCAL-993821', vsdmStatus: 'Signed & Verified' }
  ]);

  const theme = {
    bg: 'bg-stone-950 text-stone-100',
    cardBg: 'bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md',
    accentGold: 'text-amber-400',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer',
    tabBarBg: 'bg-stone-950/95 border-stone-800 backdrop-blur-xl',
    activeNav: 'text-amber-400 font-bold bg-amber-500/10 p-2 rounded-2xl border border-amber-500/20'
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!tpin || tpin.trim().length < 9) {
      alert("Please enter a valid 10-digit ZRA TPIN number for fiscal authorization.");
      return;
    }
    setView('app');
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    // Apply ZRA VAT calculation (16% standard) unless trader is informal zero-rated/council-exempt
    const vatRate = traderCategory === 'vat-registered' ? 0.16 : 0;
    const vatAmount = subtotal * vatRate;
    
    // Local Council Levy (Small scale/informal traders are exempt or pay flat micro-levy)
    const councilLevy = traderCategory === 'informal-exempt' ? 0 : subtotal * 0.01; 

    return {
      subtotal,
      vatAmount,
      councilLevy,
      grandTotal: subtotal + vatAmount + councilLevy
    };
  };

  const handleSmartCheckout = (fulfillmentType, paymentMethod) => {
    const totals = calculateTotals();
    const fiscalSig = `ZRA-VSDM-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newTxn = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      type: fulfillmentType === 'delivery' ? 'Web Delivery' : 'In-Store Fiscal Register',
      method: paymentMethod,
      total: totals.grandTotal,
      subtotal: totals.subtotal,
      vat: totals.vatAmount,
      levy: totals.councilLevy,
      items: cart.reduce((sum, i) => sum + i.qty, 0),
      time: 'Just now',
      fiscalCode: fiscalSig,
      vsdmStatus: 'ZRA E-Invoiced & Signed'
    };

    setLedgerHistory([newTxn, ...ledgerHistory]);
    setActiveSmartInvoice(newTxn);
    setCart([]);
  };

  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col justify-between relative overflow-x-hidden`}>
      
      {/* HEADER BAR */}
      <header className="px-6 py-4 border-b border-stone-800 bg-stone-950/85 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">NTEMBA <span className={theme.accentGold}>POS ZRA</span></h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Smart Invoicing & Council Levy Engine</p>
          </div>
        </div>

        {view === 'app' && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{storeName}</p>
              <p className="text-[10px] text-amber-400 font-mono">TPIN: {tpin} | {traderCategory === 'informal-exempt' ? 'Informal Zero-Tax' : 'VAT Reg.'}</p>
            </div>
            <button 
              onClick={() => setView('signup')}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              Config
            </button>
          </div>
        )}
      </header>

      {/* VIEW 1: SIGNUP & ZRA / COUNCIL REGISTRATION */}
      {view === 'signup' && (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-md p-8 rounded-3xl ${theme.cardBg} space-y-5`}>
            <div>
              <h2 className="text-2xl font-black text-white mb-2">ZRA & Council Compliance Setup</h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Configure your ZRA TPIN and tax classification to enable automated VSDM smart invoicing and council levy calculations.
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">ZRA TPIN Number *</label>
                <input 
                  type="text" 
                  value={tpin}
                  onChange={(e) => setTpin(e.target.value)}
                  placeholder="e.g., 1002938481" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Local Council Levy / Market Permit ID (Optional)</label>
                <input 
                  type="text" 
                  value={councilId}
                  onChange={(e) => setCouncilId(e.target.value)}
                  placeholder="e.g., LCC-MKT-2026-449" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Trader Tax Classification</label>
                <select 
                  value={traderCategory} 
                  onChange={(e) => setTraderCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm cursor-pointer"
                >
                  <option value="informal-exempt">Informal / Micro Trader (Zero Council Levy & Tax Exempt)</option>
                  <option value="vat-registered">VAT Registered Enterprise (16% Standard + Local Levy)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className={`w-full py-3.5 rounded-xl uppercase tracking-wider text-xs ${theme.primaryBtn} mt-4`}
              >
                Initialize Compliant Terminal
              </button>
            </form>
          </div>
        </main>
      )}

      {/* VIEW 2: MAIN DASHBOARD */}
      {view === 'app' && (
        <main className="flex-1 pb-28 px-4 pt-4 max-w-2xl mx-auto w-full space-y-4">
          
          {/* COMPLIANCE STATUS BADGE BAR */}
          <div className={`p-4 rounded-2xl ${theme.cardBg} flex justify-between items-center`}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-white">ZRA Smart Invoice & VSDM Active</h3>
              </div>
              <p className="text-[11px] text-stone-400">
                {traderCategory === 'informal-exempt' ? 'Micro-Trader Exempt Status: 0% Tax / Zero Council Levy Applied' : 'Standard Commercial Tax Profile Active'}
              </p>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl">
              TPIN Verified
            </span>
          </div>

          {/* TAB 1: POS & SMART INVOICING REGISTER */}
          {activeBottomTab === 'sales' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white">POS Register & Smart Invoice Cart</h3>
                <span className="text-[10px] text-stone-400">Generates ZRA-compliant fiscal codes</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {inventory.map(prod => (
                  <button 
                    key={prod.id} 
                    onClick={() => addToCart(prod)}
                    className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl text-left hover:border-amber-500/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-amber-400 font-mono">ZMW {prod.price}</p>
                      {prod.zeroRated && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Zero-Rated</span>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-stone-800 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Current Bill Breakdown</h4>
                {cart.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">Cart is empty. Select products from above.</p>
                ) : (
                  <div className="space-y-1.5 text-xs text-stone-300">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name} (x{item.qty})</span>
                        <span className="font-mono">ZMW {item.price * item.qty}</span>
                      </div>
                    ))}
                    
                    <div className="border-t border-stone-800 pt-2 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between text-stone-400">
                        <span>Subtotal:</span>
                        <span>ZMW {calculateTotals().subtotal}</span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>ZRA VAT (16%):</span>
                        <span>ZMW {calculateTotals().vatAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>Council Levy:</span>
                        <span>ZMW {calculateTotals().councilLevy.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-stone-800">
                        <span>Total Due:</span>
                        <span className="text-amber-400">ZMW {calculateTotals().grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => handleSmartCheckout('pos', 'Cash')}
                    disabled={cart.length === 0}
                    py-3="true"
                    className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 disabled:opacity-50 cursor-pointer"
                  >
                    💵 Cash (Fiscalized)
                  </button>
                  <button 
                    onClick={() => handleSmartCheckout('pos', 'Mobile Money')}
                    disabled={cart.length === 0}
                    className={`py-3 rounded-xl text-xs ${theme.primaryBtn} disabled:opacity-50`}
                  >
                    📱 Mobile Money (E-Invoice)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & TAX CATEGORIES */}
          {activeBottomTab === 'inventory' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-white">Catalog & ZRA Tax Classification</h3>
                  <p className="text-[11px] text-stone-400">Manage item inventory and zero-rated exemption statuses.</p>
                </div>
              </div>

              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[11px] text-stone-400 font-mono">ZMW {item.price} | Stock: {item.stock}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${item.zeroRated ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-300'}`}>
                      {item.zeroRated ? 'Zero-Rated / Exempt' : 'Standard VAT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS & LEDGER HISTORY */}
          {activeBottomTab === 'reports' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <h3 className="text-sm font-black text-white">Fiscal Ledger & Tax Audit Trail</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Total Fiscal Revenue</p>
                  <p className="text-lg font-black text-amber-400 mt-1 font-mono">
                    ZMW {ledgerHistory.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Signed Invoices</p>
                  <p className="text-lg font-black text-white mt-1 font-mono">{ledgerHistory.length} Logged</p>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3 space-y-2">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Audit Log</h4>
                {ledgerHistory.map(txn => (
                  <div key={txn.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{txn.type} — <span className="text-amber-400 font-mono">ZMW {txn.total.toFixed(2)}</span></p>
                      <p className="text-[10px] text-stone-400 font-mono">{txn.fiscalCode} | {txn.vsdmStatus}</p>
                    </div>
                    <button 
                      onClick={() => setActiveSmartInvoice(txn)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg text-[10px] cursor-pointer"
                    >
                      View Invoice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      )}

      {/* SMART INVOICE RECEIPT MODAL */}
      {activeSmartInvoice && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm p-6 rounded-3xl ${theme.cardBg} space-y-4 font-mono text-xs`}>
            <div className="text-center space-y-1 border-b border-stone-800 pb-3">
              <h3 className="font-black text-sm text-white font-sans">{storeName}</h3>
              <p className="text-[10px] text-stone-400">ZRA TPIN: {tpin}</p>
              <p className="text-[10px] text-amber-400">OFFICIAL VSDM SMART E-INVOICE</p>
            </div>

            <div className="space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span>Receipt Ref:</span>
                <span className="text-white">{activeSmartInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{activeSmartInvoice.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{activeSmartInvoice.time}</span>
              </div>
            </div>

            <div className="border-t border-b border-stone-800 py-2 space-y-1 text-stone-300">
              <div className="flex justify-between text-stone-400 text-[10px] uppercase">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items ({activeSmartInvoice.items})</span>
                <span>ZMW {activeSmartInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>ZRA VAT (16%):</span>
                <span>ZMW {activeSmartInvoice.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Council Levy:</span>
                <span>ZMW {activeSmartInvoice.levy.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm font-bold text-white">
              <span>Grand Total:</span>
              <span className="text-amber-400">ZMW {activeSmartInvoice.total.toFixed(2)}</span>
            </div>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1 text-[10px] text-stone-400 text-center">
              <p className="text-amber-400 font-bold">{activeSmartInvoice.fiscalCode}</p>
              <p>Status: {activeSmartInvoice.vsdmStatus}</p>
              <div className="w-20 h-20 bg-stone-800 mx-auto mt-2 rounded flex items-center justify-center text-[9px] text-stone-300">
                [ ZRA QR CODE ]
              </div>
            </div>

            <button 
              onClick={() => setActiveSmartInvoice(null)}
              className={`w-full py-3 rounded-xl text-xs font-sans ${theme.primaryBtn}`}
            >
              Close & Print Receipt
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      {view === 'app' && (
        <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-2.5 flex justify-around items-center shadow-2xl z-40 ${theme.tabBarBg}`}>
          <button 
            onClick={() => setActiveBottomTab('sales')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'sales' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">🛒</span>
            <span className="text-[10px]">POS Register</span>
          </button>

          <button 
            onClick={() => setActiveBottomTab('inventory')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'inventory' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📦</span>
            <span className="text-[10px]">Tax Catalog</span>
          </button>

          <button 
            onClick={() => setActiveBottomTab('reports')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'reports' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📊</span>
            <span className="text-[10px]">Fiscal Ledger</span>
          </button>
        </nav>
      )}

    </div>
  );
}
