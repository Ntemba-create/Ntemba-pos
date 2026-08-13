import React, { useState } from 'react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('signup'); // 'signup', 'app'
  const [userRole, setUserRole] = useState('storeowner'); // 'storeowner', 'customer', 'both'
  const [tpin, setTpin] = useState('');
  
  // Store / Trader Profile & Location
  const [isMobileTrader, setIsMobileTrader] = useState(false);
  const [currentLocation, setIsMobileTraderLocation] = useState({ lat: -15.3875, lng: 28.3228 }); // Default Lusaka
  
  // Navigation & Tabs (4 Tabs Total)
  const [activeBottomTab, setActiveBottomTab] = useState('sales'); // 'sales', 'ecommerce', 'inventory', 'reports'
  
  // Cart & Orders
  const [cart, setCart] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([
    { id: 'ORD-901', customer: 'Kabwe M.', items: '2x Mealie Meal (25kg)', total: 'ZMW 650', status: 'Pending Pickup', payment: 'Mobile Money' }
  ]);

  // Inventory & Garage Sale Listings Catalog
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Roller Mealie Meal 25kg', price: 325, stock: 14, unit: 'bag', type: 'store' },
    { id: 2, name: 'Cooking Oil 2L', price: 95, stock: 30, unit: 'btl', type: 'store' },
    { id: 3, name: 'Moving House: 3-Seater Sofa', price: 1500, stock: 1, unit: 'pcs', type: 'garage-sale' }
  ]);

  // Ad Promotion Modal State
  const [promotingItem, setPromotingItem] = useState(null);
  const [adRadius, setAdRadius] = useState('suburb'); // 'suburb', 'city', 'countrywide'

  // Styling Theme (Obsidian & Gold 3D UI)
  const theme = {
    bg: 'bg-stone-950 text-stone-100',
    cardBg: 'bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md',
    accentGold: 'text-amber-400',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer',
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

  const handlePayForAd = (itemId) => {
    const fees = { suburb: 20, city: 75, countrywide: 200 };
    const cost = fees[adRadius];
    alert(`Paid ZMW ${cost} via Mobile Money for a ${adRadius.toUpperCase()} targeted Garage Sale ad broadcast! Item is now live for buyers.`);
    setPromotingItem(null);
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
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">ZRA TPIN Verified Network</p>
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

      {/* VIEW 1: SIGNUP & TPIN IDENTITY */}
      {view === 'signup' && (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-md p-8 rounded-3xl ${theme.cardBg}`}>
            <h2 className="text-2xl font-black text-white mb-2">Universal Identity Login</h2>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              Register or login using your ZRA TPIN. Manage your storefront, shop locally, or post garage sales and rentals.
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
                  <option value="storeowner">Storeowner / Garage Seller</option>
                  <option value="customer">Customer (Search & Buy via Yango)</option>
                  <option value="both">Both (Merchant & Buyer)</option>
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

      {/* VIEW 2: MAIN APP DASHBOARD */}
      {view === 'app' && (
        <main className="flex-1 pb-24 px-4 pt-4 max-w-2xl mx-auto w-full">
          
          {/* TRADER STATUS HEADER */}
          {userRole !== 'customer' && (
            <div className={`mb-4 p-4 rounded-2xl ${theme.cardBg} flex justify-between items-center`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold text-white">
                    {isMobileTrader ? 'Mobile Sole Trader / Garage Sale Active' : 'Fixed Storefront / Home Base'}
                  </h3>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {isMobileTrader ? `GPS Pin: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Static Address Anchor Active'}
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

          {/* TAB 1: POS HOME */}
          {activeBottomTab === 'sales' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${theme.cardBg}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-2">
                    <span>📦</span> Web Orders Waiting ({onlineOrders.length})
                  </h3>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md">Yango Ready</span>
                </div>
                {onlineOrders.map(ord => (
                  <div key={ord.id} className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{ord.customer} — <span className="text-amber-300">{ord.total}</span></p>
                      <p className="text-[11px] text-stone-400">{ord.items} | {ord.payment}</p>
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

              {/* POS Cart Terminal */}
              <div className={`p-5 rounded-2xl ${theme.cardBg}`}>
                <h3 className="text-sm font-black text-white mb-3">In-Store Register & Quick POS</h3>
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

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => handleCheckoutProcess('pos', 'cash')}
                      disabled={cart.length === 0}
                      className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 disabled:opacity-50 cursor-pointer"
                    >
                      💵 Cash Tendered
                    </button>
                    <button 
                      onClick={() => handleCheckoutProcess(isMobileTrader ? 'delivery' : 'pos', 'mobile-money')}
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

          {/* TAB 2: E-COMMERCE & GARAGE SALE HUB */}
          {activeBottomTab === 'ecommerce' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-white">🌐 E-Commerce & Garage Sale Feed</h3>
                  <p className="text-[11px] text-stone-400">Discover local garage sales, rentals, and peer goods near you.</p>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">Yango Delivery Ready</span>
              </div>

              <div className="space-y-3">
                {inventory.map(item => (
                  <div key={item.id} className="p-4 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        {item.type === 'garage-sale' && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold">Garage Sale</span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">Price: <span className="font-mono text-amber-400 font-bold">ZMW {item.price}</span> | Stock: {item.stock}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STOCK & CATALOG (WITH GARAGE SALE PROMOTION) */}
          {activeBottomTab === 'inventory' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-white">Stock, Catalog & Garage Sale Manager</h3>
                  <p className="text-[11px] text-stone-400">Add items, set prices, and pay to broadcast ads locally.</p>
                </div>
                <button 
                  onClick={() => {
                    const name = prompt("Enter item name (e.g., Moving House Fridge):");
                    const price = prompt("Enter price in ZMW:");
                    if (name && price) {
                      setInventory([...inventory, { id: Date.now(), name, price: Number(price), stock: 1, unit: 'pcs', type: 'garage-sale' }]);
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-xl hover:bg-amber-400 cursor-pointer"
                >
                  + Add Item / Garage Sale
                </button>
              </div>

              <div className="space-y-2">
                {inventory.map(item => (
                  <div key={item.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{item.name} <span className="text-stone-400 font-normal">({item.type})</span></p>
                      <p className="text-[11px] text-stone-400 font-mono">ZMW {item.price} | Qty: {item.stock}</p>
                    </div>
                    <button 
                      onClick={() => setPromotingItem(item)}
                      className="text-xs px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 rounded-lg font-medium cursor-pointer"
                    >
                      📢 Promote / Ad
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS & P&L */}
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

      {/* AD PROMOTION MODAL */}
      {promotingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm p-6 rounded-3xl ${theme.cardBg} space-y-4`}>
            <h3 className="text-base font-black text-white">Broadcast Ad: {promotingItem.name}</h3>
            <p className="text-xs text-stone-400">Select your geographic ad broadcast range to advertise your garage sale or items to nearby app users:</p>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="radio" name="radius" checked={adRadius === 'suburb'} onChange={() => setAdRadius('suburb')} />
                  <span className="text-xs text-white font-bold">Neighborhood / Suburb</span>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">ZMW 20</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="radio" name="radius" checked={adRadius === 'city'} onChange={() => setAdRadius('city')} />
                  <span className="text-xs text-white font-bold">City-Wide (e.g., Lusaka)</span>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">ZMW 75</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="radio" name="radius" checked={adRadius === 'countrywide'} onChange={() => setAdRadius('countrywide')} />
                  <span className="text-xs text-white font-bold">Countrywide</span>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">ZMW 200</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setPromotingItem(null)}
                className="flex-1 py-3 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold hover:bg-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handlePayForAd(promotingItem.id)}
                className={`flex-1 py-3 rounded-xl text-xs ${theme.primaryBtn}`}
              >
                Pay via Mobile Money
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (4 TABS) */}
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
            onClick={() => setActiveBottomTab('ecommerce')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'ecommerce' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">🌐</span>
            <span className="text-[10px]">E-Commerce</span>
          </button>

          <button 
            onClick={() => setActiveBottomTab('inventory')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'inventory' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📦</span>
            <span className="text-[10px]">Catalog & Ads</span>
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
