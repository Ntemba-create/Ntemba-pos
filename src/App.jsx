import React, { useState } from 'react';

export default function App() {
  // --- STATE MANAGEMENT ---
  // Auth & Identity
  const [view, setView] = useState('signup'); // 'signup', 'app'
  const [userRole, setUserRole] = useState('storeowner'); // 'storeowner', 'customer', 'both'
  const [tpin, setTpin] = useState('');
  
  // Store / Trader Profile
  const [isMobileTrader, setIsMobileTrader] = useState(false);
  const [currentLocation, setIsMobileTraderLocation] = useState({ lat: -15.3875, lng: 28.3228 }); // Default Lusaka coords
  const [searchQuery, setSearchQuery] = useState('');
  
  // POS & Navigation
  const [activeBottomTab, setActiveBottomTab] = useState('sales'); // 'sales', 'inventory', 'reports'
  const [cart, setCart] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([
    { id: 'ORD-901', customer: 'Kabwe M.', items: '2x Mealie Meal (25kg)', total: 'ZMW 650', status: 'Pending Pickup', payment: 'Mobile Money' }
  ]);

  // Inventory Catalog State
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Roller Mealie Meal 25kg', price: 325, stock: 14, unit: 'bag' },
    { id: 2, name: 'Cooking Oil 2L', price: 95, stock: 30, unit: 'btl' },
    { id: 3, name: 'Kapenta (Siavonga) 500g', price: 120, stock: 8, unit: 'pkt' }
  ]);

  // Styling Theme (Obsidian & Gold 3D UI)
  const theme = {
    bg: 'bg-stone-950 text-stone-100',
    cardBg: 'bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md',
    accentGold: 'text-amber-400',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all',
    tabBarBg: 'bg-stone-950/95 border-stone-800 backdrop-blur-xl',
    activeNav: 'text-amber-400 font-bold bg-amber-500/10 p-2 rounded-2xl border border-amber-500/20'
  };

  // --- HANDLERS ---
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!tpin || tpin.trim().length < 9) {
      alert("Please enter a valid ZRA TPIN number to proceed.");
      return;
    }
    setView('app');
  };

  const toggleTraderModeState = () => {
    if (!isMobileTrader) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsMobileTraderLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setIsMobileTrader(true);
          },
          () => {
            alert("Could not fetch GPS location. Defaulting to current pin.");
            setIsMobileTrader(true);
          }
        );
      } else {
        setIsMobileTrader(true);
      }
    } else {
      setIsMobileTrader(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleCheckoutProcess = (fulfillmentType, paymentMethod) => {
    if (fulfillmentType === 'delivery' && isMobileTrader && paymentMethod === 'cash') {
      alert("🔒 Security Rule: Mobile delivery orders for mobile traders require pre-paid Mobile Money to prevent transaction leakage and cash collection risks.");
      return;
    }
    alert(`Successfully processed order via ${paymentMethod} (${fulfillmentType.toUpperCase()})! Inventory and ledgers updated.`);
    setCart([]);
  };

  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col justify-between relative overflow-x-hidden`}>
      
      {/* HEADER BAR */}
      <header className="px-6 py-4 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">NTEMBA <span className={theme.accentGold}>POS</span></h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">ZRA TPIN Verified Terminal</p>
          </div>
        </div>

        {view === 'app' && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-300 font-mono">
              TPIN: {tpin}
            </span>
            <button 
              onClick={() => setView('signup')}
              className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
            >
              Switch Profile
            </button>
          </div>
        )}
      </header>

      {/* VIEW 1: SIGNUP & TPIN IDENTITY REGISTRATION */}
      {view === 'signup' && (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-md p-8 rounded-3xl ${theme.cardBg}`}>
            <h2 className="text-2xl font-black text-white mb-2">Universal Identity Login</h2>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              Register or login using your ZRA TPIN. Choose your role as a Merchant, a Customer, or both to trade across the Ntemba local network.
            </p>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">ZRA TPIN Number</label>
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
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Select App Persona</label>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="storeowner">Storeowner (Sell & Manage Catalog)</option>
                  <option value="customer">Customer (Search & Buy via Yango)</option>
                  <option value="both">Both (Merchant & Customer)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className={`w-full py-3.5 rounded-xl uppercase tracking-wider text-xs ${theme.primaryBtn} mt-2`}
              >
                Launch Ntemba Terminal
              </button>
            </form>
          </div>
        </main>
      )}

      {/* VIEW 2: MAIN DASHBOARD & OPERATIONAL TABS */}
      {view === 'app' && (
        <main className="flex-1 pb-24 px-4 pt-4 max-w-2xl mx-auto w-full">
          
          {/* ROLE SWITCHER BANNER & TRADER STATUS */}
          {userRole !== 'customer' && (
            <div className={`mb-4 p-4 rounded-2xl ${theme.cardBg} flex justify-between items-center`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold text-white">
                    {isMobileTrader ? 'Mobile Sole Trader (Live GPS)' : 'Fixed Physical Storefront'}
                  </h3>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {isMobileTrader ? `Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}` : 'Static Address Anchor Active'}
                </p>
              </div>
              <button 
                onClick={toggleTraderModeState}
                className="text-xs px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-medium border border-stone-700 transition-all cursor-pointer"
              >
                {isMobileTrader ? 'Switch to Fixed' : 'Switch to Mobile GPS'}
              </button>
            </div>
          )}

          {/* TAB 1: POS HOME & WEB ORDERS */}
          {activeBottomTab === 'sales' && (
            <div className="space-y-4">
              
              {/* ONLINE WEB ORDERS (Yango Integration Header) */}
              <div className={`p-4 rounded-2xl ${theme.cardBg}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-2">
                    <span>📦</span> Incoming Web Orders ({onlineOrders.length})
                  </h3>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md">Yango Dispatch Ready</span>
                </div>
                {onlineOrders.map(ord => (
                  <div key={ord.id} className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{ord.customer} — <span className="text-amber-300">{ord.total}</span></p>
                      <p className="text-[11px] text-stone-400">{ord.items} | Paid via {ord.payment}</p>
                    </div>
                    <button 
                      onClick={() => alert(`Dispatching Yango courier for order ${ord.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 cursor-pointer"
                    >
                      Dispatch Yango
                    </button>
                  </div>
                ))}
              </div>

              {/* IN-PERSON & DIGITAL CART TERMINAL */}
              <div className={`p-5 rounded-2xl ${theme.cardBg}`}>
                <h3 className="text-sm font-black text-white mb-3">Quick POS & Catalog Sale</h3>
                
                {/* Catalog Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {inventory.map(prod => (
                    <button 
                      key={prod.id} 
                      onClick={() => addToCart(prod)}
                      className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl text-left hover:border-amber-500/50 transition-all cursor-pointer"
                    >
                      <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                      <p className="text-xs text-amber-400 font-mono mt-1">ZMW {prod.price}</p>
                    </button>
                  ))}
                </div>

                {/* Active Cart Section */}
                <div className="border-t border-stone-800 pt-3">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Active Cart</h4>
                  {cart.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-2">Cart is empty. Tap catalog items above.</p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs text-stone-300">
                          <span>{item.name} x {item.qty}</span>
                          <span className="font-mono font-bold">ZMW {item.price * item.qty}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-stone-800">
                        <span>Total Due:</span>
                        <span className="text-amber-400 font-mono">ZMW {calculateCartTotal()}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => handleCheckout('pos', 'cash')}
                      disabled={cart.length === 0}
                      className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 disabled:opacity-50 cursor-pointer"
                    >
                      💵 Cash Tendered
                    </button>
                    <button 
                      onClick={() => handleCheckout(isMobileTrader ? 'delivery' : 'pos', 'mobile-money')}
                      disabled={cart.length === 0}
                      className={`py-3 rounded-xl text-xs ${theme.primaryBtn} disabled:opacity-50 cursor-pointer`}
                    >
                      📱 Mobile Money
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: STOCK & CATALOG */}
          {activeBottomTab === 'inventory' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white">Stock & Digital Catalog</h3>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">Auto-Synced Storefront</span>
              </div>
              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Stock: {item.stock} {item.unit}s available</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">ZMW {item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS & P&L */}
          {activeBottomTab === 'reports' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <h3 className="text-sm font-black text-white">Financial Health & Ledger</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Daily Revenue</p>
                  <p className="text-lg font-black text-amber-400 mt-1 font-mono">ZMW 4,850</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Yango Deliveries</p>
                  <p className="text-lg font-black text-white mt-1 font-mono">12 Completed</p>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      {view === 'app' && (
        <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-2.5 flex justify-around items-center shadow-2xl z-40 ${theme.tabBarBg}`}>
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
        </nav>
      )}

    </div>
  );
}
