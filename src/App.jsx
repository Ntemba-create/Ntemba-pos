import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'council', 'ledger'
  const [tier, setTier] = useState('tier1'); // 'tier1', 'tier2', 'tier3'
  const [storeName, setStoreName] = useState('Ntemba General Store');
  const [whatsAppNumber, setWhatsAppNumber] = useState('+260970000000');
  const [cart, setCart] = useState([]);
  const [ledger, setLedger] = useState([
    { id: 1, type: 'POS Sale', amount: 'ZMW 120.00', fee: 'ZMW 1.20', status: 'Settled' },
    { id: 2, type: 'Council Levy', amount: 'ZMW 15.00', fee: 'ZMW 0.00', status: 'Verified' }
  ]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  const catalog = [
    { id: 1, name: 'Roller Mealie Meal (25kg)', price: 210, stock: 14, category: 'Groceries' },
    { id: 2, name: 'Cooking Oil (2L)', price: 65, stock: 28, category: 'Groceries' },
    { id: 3, name: 'Kapenta (Medium Pack)', price: 45, stock: 40, category: 'Groceries' },
    { id: 4, name: 'Sugar (2kg)', price: 42, stock: 19, category: 'Groceries' }
  ];

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const vat = tier !== 'tier1' ? subtotal * 0.16 : 0;
  const councilFee = 5;
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

  const handlePayCouncil = (feeName, amount) => {
    setLedger([{ id: Date.now(), type: `Municipal: ${feeName}`, amount: `ZMW ${amount}.00`, fee: 'ZMW 0.00', status: 'Verified' }, ...ledger]);
    alert(`Successfully paid ${feeName} (ZMW ${amount}). WhatsApp receipt generated for ${whatsAppNumber}!`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      
      {/* CLEAN MERCHANT HEADER */}
      <header className="px-6 py-4 border border-stone-800 bg-stone-900/90 backdrop-blur-md flex justify-between items-center rounded-2xl mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-white">{storeName}</h1>
            <p className="text-[9px] text-amber-400 uppercase tracking-widest font-mono">Ntemba POS Engine • ZRA Ready</p>
          </div>
        </div>
      </header>

      <div className="space-y-6 flex-1 w-full">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('pos')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'pos' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-stone-900 text-stone-400 border border-stone-800'}`}>
            🛒 POS
          </button>
          <button onClick={() => setActiveTab('council')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'council' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-stone-900 text-stone-400 border border-stone-800'}`}>
            🏛️ Levies
          </button>
          <button onClick={() => setActiveTab('ledger')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'ledger' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-stone-900 text-stone-400 border border-stone-800'}`}>
            📊 Ledger
          </button>
        </div>

        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-3xl backdrop-blur-md space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Inventory Catalog</h3>
              <div className="grid grid-cols-2 gap-3">
                {catalog.map(item => (
                  <div key={item.id} onClick={() => addToCart(item)} className="p-3 bg-stone-950/80 border border-stone-800 rounded-2xl hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-stone-400">Stock: {item.stock}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-amber-400 font-mono font-bold text-xs">ZMW {item.price}</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg">+ Add</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Tax & Compliance Tier</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setTier('tier1')} className={`p-2.5 rounded-2xl text-left border text-[11px] ${tier === 'tier1' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-stone-950 border-stone-800 text-stone-400'}`}>
                  <p className="font-bold">Tier 1</p>
                  <p className="text-[9px] opacity-80">Free</p>
                </button>
                <button onClick={() => setTier('tier2')} className={`p-2.5 rounded-2xl text-left border text-[11px] ${tier === 'tier2' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-stone-950 border-stone-800 text-stone-400'}`}>
                  <p className="font-bold">Tier 2</p>
                  <p className="text-[9px] opacity-80">K175/mo</p>
                </button>
                <button onClick={() => setTier('tier3')} className={`p-2.5 rounded-2xl text-left border text-[11px] ${tier === 'tier3' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-stone-950 border-stone-800 text-stone-400'}`}>
                  <p className="font-bold">Tier 3</p>
                  <p className="text-[9px] opacity-80">K850/mo</p>
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Active Cart Register</h3>
              {cart.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">Cart is empty. Tap catalog items to add.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-[10px] text-stone-400">Qty: {item.qty} × ZMW {item.price}</p>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">ZMW {item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 border-t border-stone-800 pt-3 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>ZMW {subtotal.toFixed(2)}</span>
                </div>
                {tier !== 'tier1' && (
                  <div className="flex justify-between text-stone-400">
                    <span>ZRA VAT (16%)</span>
                    <span>ZMW {vat.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Ntemba Fee (1%)</span>
                  <span>ZMW {ntembaFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-black text-sm border-t border-stone-800 pt-2">
                  <span>Grand Total</span>
                  <span className="text-amber-400">ZMW {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button onClick={() => handleCheckout('Cash')} className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 cursor-pointer">
                  💵 Cash Tendered
                </button>
                <button onClick={() => handleCheckout('Mobile Money (Lenco)')} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer">
                  📱 Mobile Money / Lenco Charge
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'council' && (
          <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Municipal & Market Council Levies</h3>
              <p className="text-[11px] text-stone-400">Instant digital settlement for local government dues.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-stone-400">WhatsApp Notification Phone</label>
              <input 
                type="text" 
                value={whatsAppNumber} 
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-white">Daily Market Stall Fee</p>
                <p className="text-amber-400 font-mono font-bold text-base">ZMW 15.00</p>
                <button onClick={() => handlePayCouncil('Daily Market Stall', 15)} className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer">
                  Pay via Mobile Money
                </button>
              </div>
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-white">Monthly Store Operating Permit</p>
                <p className="text-amber-400 font-mono font-bold text-base">ZMW 250.00</p>
                <button onClick={() => handlePayCouncil('Monthly Store Permit', 250)} className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer">
                  Pay via Mobile Money
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Financial Ledger</h3>
            <div className="space-y-2">
              {ledger.map(entry => (
                <div key={entry.id} className="flex justify-between items-center bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                  <div>
                    <p className="font-bold text-white">{entry.type}</p>
                    <p className="text-[10px] text-stone-400">Fee: {entry.fee}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-amber-400 font-bold">{entry.amount}</p>
                    <span className="text-[9px] text-emerald-400 font-mono">{entry.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReceiptModal && lastReceipt && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-white">{lastReceipt.store}</h3>
              <p className="text-[10px] text-amber-400 font-mono">Fiscal Receipt • ZRA Verified</p>
              <p className="text-[9px] text-stone-400">{lastReceipt.date}</p>
            </div>
            <div className="space-y-2 border-t border-b border-stone-800 py-3 text-xs">
              {lastReceipt.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-stone-300">{it.name} (x{it.qty})</span>
                  <span className="font-mono text-white">ZMW {it.price * it.qty}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-mono text-xs font-black text-amber-400">
              <span>Total Paid ({lastReceipt.method}):</span>
              <span>ZMW {lastReceipt.total}</span>
            </div>
            <button onClick={() => setShowReceiptModal(false)} className="w-full py-3 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer">
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
