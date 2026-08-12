import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [tier, setTier] = useState('tier1'); // 'tier1', 'tier2', 'tier3'
  const [isMobileFrame, setIsMobileFrame] = useState(true); // Toggle for mobile view preview

  // Inventory Catalog State
  const [catalog, setCatalog] = useState([
    { id: 1, name: 'Honda Fit Full Service', price: 2560, stock: 12, category: 'Automotive' },
    { id: 2, name: 'Brake Bonding & Lining', price: 680, stock: 25, category: 'Automotive' },
    { id: 3, name: 'Engine Diagnostic Scan', price: 450, stock: 50, category: 'Services' },
    { id: 4, name: 'Synthetic Motor Oil 5L', price: 920, stock: 8, category: 'Retail' },
  ]);

  // New Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Retail');

  // Tier 1 Custom Sale Direct Input State
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  const [cart, setCart] = useState([]);
  const [customerPhone, setCustomerPhone] = useState('260775696177');
  const [paymentMethod, setPaymentMethod] = useState('momo');

  // Add Item to Cart from Catalog
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Add Custom Tier 1 Sale Directly to Cart
  const handleAddCustomSale = (e) => {
    e.preventDefault();
    if (!customItemName || !customItemPrice) return;
    const customObj = {
      id: Date.now(),
      name: customItemName,
      price: parseFloat(customItemPrice),
      stock: 99,
      category: 'Tier 1 Custom',
    };
    setCart([...cart, { ...customObj, qty: 1 }]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  // Add New Item to Inventory Catalog
  const handleAddInventoryItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemStock) return;
    const itemObj = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      stock: parseInt(newItemStock, 10),
      category: newItemCategory,
    };
    setCatalog([...catalog, itemObj]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
  };

  const updateQty = (id, delta) => {
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ntembaFee = subtotal * 0.01;
  const totalPaid = subtotal + ntembaFee;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const refId = `NTEMBA-${Date.now()}`;
    let itemsText = cart.map((i) => `• ${i.name} (x${i.qty}): K${i.price * i.qty}.00`).join('%0A');
    
    const message = `*MONSI ENTERPRISE STORE*%0A` +
      `📌 TPIN: 1002345678%0A` +
      `--------------------------------%0A` +
      `🔖 Ref: ${refId}%0A%0A` +
      `*Items / Services:*%0A` +
      `${itemsText}%0A%0A` +
      `--------------------------------%0A` +
      `Subtotal: K${subtotal}.00%0A` +
      `Ntemba Fee (1%): K${ntembaFee.toFixed(2)}%0A` +
      `*TOTAL PAID: K${totalPaid.toFixed(2)}*%0A` +
      `--------------------------------%0A` +
      `Powered by *Ntemba POS* 🇿🇲`;

    const waUrl = `https://api.whatsapp.com/send/?phone=${customerPhone}&text=${message}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#04060b] text-slate-100 font-sans antialiased pb-20">
      
      {/* Top View Control Bar */}
      <div className="bg-[#0b101d] border-b border-slate-800 py-3 px-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 text-white font-black p-2 rounded-xl flex items-center justify-center w-8 h-8 text-sm">
            N
          </div>
          <span className="text-xs font-bold text-white tracking-wide">Ntemba POS Viewport Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsMobileFrame(true); setTier('tier1'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isMobileFrame ? 'bg-red-600 text-white shadow-md' : 'bg-[#131E35] text-slate-400 hover:text-white'
            }`}
          >
            📱 Mobile Preview Frame
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isMobileFrame ? 'bg-red-600 text-white shadow-md' : 'bg-[#131E35] text-slate-400 hover:text-white'
            }`}
          >
            💻 Full Desktop View
          </button>
        </div>
      </div>

      {/* Outer Wrapper: Centers Phone Frame if enabled */}
      <div className={`${isMobileFrame ? 'max-w-sm mx-auto my-8 p-4 bg-[#0d1322] border-[8px] border-[#1d2942] rounded-[45px] shadow-2xl relative overflow-hidden' : 'max-w-5xl mx-auto px-4 mt-6'}`}>
        
        {/* Speaker notch simulation for Mobile View */}
        {isMobileFrame && (
          <div className="w-32 h-4 bg-[#1d2942] mx-auto rounded-b-xl mb-4 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
          </div>
        )}

        {/* Header Bar */}
        <header className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 p-4 rounded-3xl shadow-lg mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white text-red-600 font-black p-2 rounded-xl shadow-md w-8 h-8 flex items-center justify-center text-sm">
                  N
                </div>
                <div>
                  <h1 className="text-xs font-black tracking-tight text-white">Ntemba POS</h1>
                  <p className="text-[10px] text-red-100 opacity-90"><a href="https://app.lenco.co/login" target="_blank" rel="noreferrer" className="underline hover:text-white">Lenco</a> Connected</p>
                </div>
              </div>
            </div>

            {/* Tier Switcher */}
            <div className="bg-black/30 p-1 rounded-xl flex border border-white/20">
              <button
                onClick={() => setTier('tier1')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  tier === 'tier1' ? 'bg-white text-red-600 shadow' : 'text-white hover:bg-white/10'
                }`}
              >
                Tier 1
              </button>
              <button
                onClick={() => setTier('tier2')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  tier === 'tier2' ? 'bg-white text-red-600 shadow' : 'text-white hover:bg-white/10'
                }`}
              >
                Tier 2
              </button>
              <button
                onClick={() => setTier('tier3')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  tier === 'tier3' ? 'bg-white text-red-600 shadow' : 'text-white hover:bg-white/10'
                }`}
              >
                Tier 3
              </button>
            </div>
          </div>
        </header>

        {/* Main App Workspace */}
        <main className="space-y-4">

          {/* ================= TIER 1: MOBILE QUICK POS ================= */}
          {tier === 'tier1' && (
            <div className="space-y-4">
              <div className="bg-[#0E1626] border-2 border-red-500 rounded-2xl p-4 shadow-xl">
                <div className="text-center mb-4">
                  <span className="bg-red-500/20 text-red-400 font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-red-500/40">
                    ⚡ Tier 1: Quick Mobile Input
                  </span>
                  <h2 className="text-sm font-black text-white mt-1.5">On-The-Fly Sale</h2>
                </div>

                <form onSubmit={handleAddCustomSale} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Item / Service Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Labor & Spares"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="w-full bg-[#131E35] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Amount (ZMW)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="w-full bg-[#131E35] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    + Add to Cart
                  </button>
                </form>
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Active Sale</h3>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-[#131E35] p-2.5 rounded-xl">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-xs font-mono font-bold text-amber-400">K{item.price}.00</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-black">
                    <span>Total Due (inc. 1%):</span>
                    <span className="text-emerald-400 font-mono text-sm">K{totalPaid.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    📲 Send WhatsApp Receipt
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TIER 2: PRO STORE ================= */}
          {tier === 'tier2' && (
            <div className="space-y-4">
              <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-300 mb-3">Pro Catalog Grid</h2>
                <div className="grid grid-cols-1 gap-2.5">
                  {catalog.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="text-left bg-[#131E35] border border-slate-800 hover:border-red-500/50 rounded-xl p-3 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">K{item.price}.00 • Stock: {item.stock}</div>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">+</span>
                    </button>
                  ))}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>Cart Total:</span>
                    <span className="font-mono text-emerald-400">K{totalPaid.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-red-600 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    📲 WhatsApp Checkout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TIER 3: ENTERPRISE ================= */}
          {tier === 'tier3' && (
            <div className="bg-[#0E1626] border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-4">
              <div>
                <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                  🏢 Enterprise Back-Office
                </span>
                <h2 className="text-sm font-black text-white mt-1.5">Credit Passport</h2>
              </div>

              <div className="bg-[#131E35] border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400">Credit Score</div>
                <div className="text-xl font-black font-mono text-white">742 <span className="text-xs text-slate-400">/ 850</span></div>
              </div>

              <div className="bg-[#131E35] border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400">Eligible Working Capital</div>
                <div className="text-base font-black font-mono text-amber-400">K45,000.00</div>
              </div>

              <button
                onClick={() => alert("Generating audit report...")}
                className="w-full bg-amber-600 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                📥 Export Ledger PDF
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}