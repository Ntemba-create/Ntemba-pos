import React, { useState } from 'react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('signup'); // 'signup', 'app'
  const [userRole, setUserRole] = useState('storeowner'); // 'storeowner', 'customer', 'both'
  const [tpin, setTpin] = useState('');
  const [councilId, setCouncilId] = useState(''); // Local Council Levy ID
  const [vendorTier, setVendorTier] = useState('tier1'); // 'tier1' (Free), 'tier2' (K175/mo), 'tier3' (K850/mo)
  
  // Shared Mobile & WhatsApp Contact State
  const [whatsappPhone, setWhatsappPhone] = useState('260971234567');
  
  // Payout Destination States
  const [payoutDestinationType, setPayoutDestinationType] = useState('personal'); // 'personal' or 'business'
  const [personalMobileNumber, setPersonalMobileNumber] = useState('260971234567');
  const [businessMerchantTill, setBusinessMerchantTill] = useState('');

  // Store / Trader Profile
  const [storeName, setStoreName] = useState('Ntemba Enterprise Terminal');
  
  // Navigation Tabs
  const [activeBottomTab, setActiveBottomTab] = useState('sales'); 
  
  // Cart & Inventory
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Roller Mealie Meal 25kg', price: 325, stock: 14, unit: 'bag', type: 'store', category: 'Groceries', zeroRated: true },
    { id: 2, name: 'Cooking Oil 2L', price: 95, stock: 30, unit: 'btl', type: 'store', category: 'Groceries', zeroRated: false },
    { id: 3, name: 'Kapenta (Siavonga) 500g', price: 120, stock: 8, unit: 'pkt', type: 'store', category: 'Groceries', zeroRated: true },
    { id: 4, name: 'Moving House: 3-Seater Leather Sofa', price: 1500, stock: 1, unit: 'pcs', type: 'garage-sale', category: 'Furniture', zeroRated: false }
  ]);

  // Smart Invoice Modal State
  const [activeSmartInvoice, setActiveSmartInvoice] = useState(null);

  // Financial Ledger & History
  const [ledgerHistory, setLedgerHistory] = useState([
    { id: 'TXN-101', type: 'In-Store POS', method: 'Cash', total: 420, ntembaFee: 4.20, items: 3, time: 'Yesterday', fiscalCode: 'ZRA-FISCAL-993821', vsdmStatus: 'Signed & Verified' }
  ]);
  const [levyHistory, setLevyHistory] = useState([]);

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
    if (vendorTier !== 'tier1' && (!tpin || tpin.trim().length < 9)) {
      alert("Please enter a valid Company TPIN number for Tier 2 or Tier 3 registration.");
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
    const vatRate = vendorTier === 'tier1' ? 0 : 0.16;
    const vatAmount = subtotal * vatRate;
    const councilLevy = vendorTier === 'tier1' ? 0 : subtotal * 0.01; 

    const grandTotal = subtotal + vatAmount + councilLevy;
    const ntembaFee = grandTotal * 0.01; // Mandatory 1% Ntemba Platform Fee

    return { subtotal, vatAmount, councilLevy, grandTotal, ntembaFee };
  };

  // --- LENCO PAYMENT & PAYOUT GATEWAY INTEGRATION ---
  const processLencoPayment = async (customerPhone, amount, payoutDestination) => {
    try {
      const lencoPayload = {
        amount: amount,
        currency: "ZMW",
        customerPhone: customerPhone,
        payoutTarget: payoutDestination, // Routes directly to your Lenco-linked personal number or corporate account
        merchantName: storeName,
        gateway: "Lenco Zambia"
      };

      console.log("Initiating Lenco payment request...", lencoPayload);
      
      // Simulated successful dispatch via Lenco infrastructure
      alert(`[Lenco Gateway] Charge request of ZMW ${amount} sent to customer (${customerPhone}). Funds will auto-settle to: ${payoutDestination}`);
      return true;

    } catch (error) {
      console.error("Lenco payment processing failed:", error);
      alert("Payment gateway connection failed. Please verify your network.");
      return false;
    }
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
      ntembaFee: totals.ntembaFee,
      items: cart.reduce((sum, i) => sum + i.qty, 0),
      time: 'Just now',
      fiscalCode: fiscalSig,
      vsdmStatus: vendorTier === 'tier1' ? 'Logged & Fee Deducted' : 'ZRA E-Invoiced & Signed'
    };

    setLedgerHistory([newTxn, ...ledgerHistory]);
    setActiveSmartInvoice(newTxn);
    setCart([]);
  };

  const handlePayCouncilLevy = (councilName, amount) => {
    if (!whatsappPhone || whatsappPhone.length < 9) {
      alert("Please ensure a valid WhatsApp phone number is configured.");
      return;
    }

    const levyReceipt = {
      id: `LEV-${Math.floor(1000 + Math.random() * 9000)}`,
      council: councilName,
      amount: amount,
      phone: whatsappPhone,
      status: 'Sent to WhatsApp Successfully',
      time: 'Just now'
    };

    setLevyHistory([levyReceipt, ...levyHistory]);
    
    const whatsappMessage = encodeURIComponent(
      `✅ *OFFICIAL MUNICIPAL LEVY RECEIPT*\n` +
      `Ref: ${levyReceipt.id}\n` +
      `Council: ${levyReceipt.council}\n` +
      `Amount Paid: ZMW ${levyReceipt.amount}\n` +
      `Status: Verified & Active`
    );
    
    window.open(`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`, '_blank');
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
            <h1 className="font-extrabold text-lg tracking-wide text-white">[Ntemba POS](https://ntemba-pos.netlify.app/) <span className={theme.accentGold}>Lenco</span></h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Powered by [Lenco](https://lenco.co) Payout Gateway</p>
          </div>
        </div>

        {view === 'app' && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{storeName}</p>
              <p className="text-[10px] text-amber-400 font-mono uppercase">
                {vendorTier} | Payout: {payoutDestinationType === 'personal' ? personalMobileNumber : businessMerchantTill || 'Corporate'}
              </p>
            </div>
            <button 
              onClick={() => setView('signup')}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              Plans & Config
            </button>
          </div>
        )}
      </header>

      {/* VIEW 1: SIGNUP & CONFIGURATION */}
      {view === 'signup' && (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-lg p-8 rounded-3xl ${theme.cardBg} space-y-5 max-h-[90vh] overflow-y-auto`}>
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Terminal Setup & Lenco Routing</h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Connect your business profile and set whether Lenco pays out to your personal mobile money or your corporate account:
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVendorTier('tier1')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${vendorTier === 'tier1' ? 'border-amber-400 bg-amber-500/10' : 'border-stone-800 bg-stone-950'}`}
                >
                  <p className="text-xs font-bold text-white">Tier 1</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">Free / 0 ZMW</p>
                  <p className="text-[9px] text-stone-400 mt-1">Informal / Micro</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVendorTier('tier2')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${vendorTier === 'tier2' ? 'border-amber-400 bg-amber-500/10' : 'border-stone-800 bg-stone-950'}`}
                >
                  <p className="text-xs font-bold text-white">Tier 2</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">K175 / mo</p>
                  <p className="text-[9px] text-stone-400 mt-1">Company TPIN</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVendorTier('tier3')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${vendorTier === 'tier3' ? 'border-amber-400 bg-amber-500/10' : 'border-stone-800 bg-stone-950'}`}
                >
                  <p className="text-xs font-bold text-white">Tier 3</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">K850 / mo</p>
                  <p className="text-[9px] text-stone-400 mt-1">Enterprise VSDM</p>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Store / Business Name</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g., Lusaka Central Hub" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">WhatsApp Phone Number</label>
                <input 
                  type="text" 
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="e.g., 260971234567" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                  required
                />
              </div>

              {/* PAYOUT ROUTING CONFIGURATION BLOCK */}
              <div className="pt-2 border-t border-stone-800 space-y-3">
                <label className="block text-xs font-semibold uppercase text-stone-400">Lenco Payout Destination</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutDestinationType('personal')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${payoutDestinationType === 'personal' ? 'border-amber-400 bg-amber-500/10' : 'border-stone-800 bg-stone-950'}`}
                  >
                    <p className="text-xs font-bold text-white">Personal Mobile</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Airtel/MTN/Zamtel</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutDestinationType('business')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${payoutDestinationType === 'business' ? 'border-amber-400 bg-amber-500/10' : 'border-stone-800 bg-stone-950'}`}
                  >
                    <p className="text-xs font-bold text-white">Business Account</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Lenco Corporate Till</p>
                  </button>
                </div>

                {payoutDestinationType === 'personal' ? (
                  <div>
                    <input 
                      type="text" 
                      value={personalMobileNumber}
                      onChange={(e) => setPersonalMobileNumber(e.target.value)}
                      placeholder="Personal Mobile Money (e.g., 260971234567)" 
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <input 
                      type="text" 
                      value={businessMerchantTill}
                      onChange={(e) => setBusinessMerchantTill(e.target.value)}
                      placeholder="Corporate Account ID / Lenco Till (e.g., LEN-9921)" 
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                    />
                  </div>
                )}
              </div>

              {vendorTier !== 'tier1' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Company TPIN Number (Required for {vendorTier.toUpperCase()})</label>
                  <input 
                    type="text" 
                    value={tpin}
                    onChange={(e) => setTpin(e.target.value)}
                    placeholder="e.g., 1002938481" 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                    required
                  />
                </div>
              )}

              <button 
                type="submit" 
                className={`w-full py-3.5 rounded-xl uppercase tracking-wider text-xs ${theme.primaryBtn} mt-4`}
              >
                Launch {vendorTier.toUpperCase()} Terminal
              </button>
            </form>
          </div>
        </main>
      )}

      {/* VIEW 2: MAIN DASHBOARD */}
      {view === 'app' && (
        <main className="flex-1 pb-28 px-4 pt-4 max-w-2xl mx-auto w-full space-y-4">
          
          {/* SUBSCRIPTION & PAYOUT STATUS BAR */}
          <div className={`p-4 rounded-2xl ${theme.cardBg} flex justify-between items-center`}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-white uppercase">[Lenco](https://lenco.co) Active</h3>
              </div>
              <p className="text-[11px] text-stone-400">
                Payout Route: <span className="font-mono text-amber-400">{payoutDestinationType === 'personal' ? personalMobileNumber : (businessMerchantTill || 'Pending Setup')}</span>
              </p>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl">
              1% Fee Active
            </span>
          </div>

          {/* TAB 1: POS & REGISTER */}
          {activeBottomTab === 'sales' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white">POS Register & Cart</h3>
                <span className="text-[10px] text-stone-400">Settles via [Lenco](https://lenco.co)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
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

              <div className="border-t border-stone-800 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Transaction Summary</h4>
                {cart.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">Cart is empty. Select items above.</p>
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
                      {vendorTier !== 'tier1' && (
                        <>
                          <div className="flex justify-between text-stone-400">
                            <span>ZRA VAT (16%):</span>
                            <span>ZMW {calculateTotals().vatAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-stone-400">
                            <span>Council Levy:</span>
                            <span>ZMW {calculateTotals().councilLevy.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-amber-400/80">
                        <span>Ntemba Fee (1%):</span>
                        <span>ZMW {calculateTotals().ntembaFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-stone-800">
                        <span>Grand Total:</span>
                        <span className="text-amber-400">ZMW {calculateTotals().grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => handleSmartCheckout('pos', 'Cash')}
                    disabled={cart.length === 0}
                    className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 disabled:opacity-50 cursor-pointer"
                  >
                    💵 Cash Tendered
                  </button>
                  <button 
                    onClick={() => {
                      const customerPhone = prompt("Enter customer's mobile money phone number (e.g., 260971234567):");
                      if (customerPhone) {
                        const totals = calculateTotals();
                        const targetDestination = payoutDestinationType === 'personal' ? personalMobileNumber : businessMerchantTill;
                        
                        processLencoPayment(customerPhone, totals.grandTotal, targetDestination);
                        handleSmartCheckout('pos', 'Mobile Money');
                      }
                    }}
                    disabled={cart.length === 0}
                    className={`py-3 rounded-xl text-xs ${theme.primaryBtn} disabled:opacity-50`}
                  >
                    📱 Charge via Lenco
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COUNCIL LEVIES & WHATSAPP RECEIPT MODULE */}
          {activeBottomTab === 'inventory' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <div>
                <h3 className="text-sm font-black text-white">Local Council & Market Levy Express</h3>
                <p className="text-[11px] text-stone-400">Pay municipal fees instantly and get verified digital permits sent to WhatsApp.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">Target WhatsApp Phone Number</label>
                  <input 
                    type="text" 
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="e.g., 260971234567" 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => handlePayCouncilLevy('Lusaka City Council - Daily Market Stall', 15)}
                    className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-left hover:border-amber-500 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white">Daily Market Levy</p>
                    <p className="text-xs text-amber-400 font-mono mt-1">ZMW 15.00</p>
                  </button>

                  <button 
                    onClick={() => handlePayCouncilLevy('Lusaka City Council - Monthly Store Permit', 250)}
                    className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-left hover:border-amber-500 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white">Monthly Store Permit</p>
                    <p className="text-xs text-amber-400 font-mono mt-1">ZMW 250.00</p>
                  </button>
                </div>

                {levyHistory.length > 0 && (
                  <div className="border-t border-stone-800 pt-3 space-y-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Recent Levy Receipts</h4>
                    {levyHistory.map(levy => (
                      <div key={levy.id} className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{levy.council}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{levy.id} | {levy.status}</p>
                        </div>
                        <span className="text-amber-400 font-mono font-bold">ZMW {levy.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS & LEDGER */}
          {activeBottomTab === 'reports' && (
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-4`}>
              <h3 className="text-sm font-black text-white">Financial Ledger & 1% Collection Track</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Recorded Revenue</p>
                  <p className="text-lg font-black text-amber-400 mt-1 font-mono">
                    ZMW {ledgerHistory.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                  <p className="text-[10px] uppercase text-stone-400">Ntemba 1% Fees Collected</p>
                  <p className="text-lg font-black text-white mt-1 font-mono">
                    ZMW {ledgerHistory.reduce((sum, t) => sum + t.ntembaFee, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* INVOICE MODAL */}
      {activeSmartInvoice && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-sm p-6 rounded-3xl ${theme.cardBg} space-y-4 font-mono text-xs`}>
            <div className="text-center space-y-1 border-b border-stone-800 pb-3">
              <h3 className="font-black text-sm text-white font-sans">{storeName}</h3>
              <p className="text-[10px] text-stone-400">TPIN: {tpin || 'Informal Trader'}</p>
              <p className="text-[10px] text-amber-400 uppercase">{vendorTier} RECEIPT</p>
            </div>

            <div className="space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span>Ref ID:</span>
                <span className="text-white">{activeSmartInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{activeSmartInvoice.method}</span>
              </div>
            </div>

            <div className="border-t border-b border-stone-800 py-2 space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>ZMW {activeSmartInvoice.subtotal}</span>
              </div>
              {vendorTier !== 'tier1' && (
                <div className="flex justify-between text-stone-400">
                  <span>VAT & Levy:</span>
                  <span>ZMW {(activeSmartInvoice.vat + activeSmartInvoice.levy).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-amber-400">
                <span>Ntemba Fee (1%):</span>
                <span>ZMW {activeSmartInvoice.ntembaFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total Paid:</span>
              <span className="text-amber-400">ZMW {activeSmartInvoice.total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => setActiveSmartInvoice(null)}
              className={`w-full py-3 rounded-xl text-xs font-sans ${theme.primaryBtn}`}
            >
              Close Receipt
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
            <span className="text-[10px]">POS</span>
          </button>

          <button 
            onClick={() => setActiveBottomTab('inventory')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'inventory' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">🏛️</span>
            <span className="text-[10px]">Council Levies</span>
          </button>

          <button 
            onClick={() => setActiveBottomTab('reports')} 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeBottomTab === 'reports' ? theme.activeNav : 'text-white/40 font-medium hover:text-white/70'}`}
          >
            <span className="text-xl p-1.5 rounded-xl bg-black/20 shadow-inner">📊</span>
            <span className="text-[10px]">Ledger</span>
          </button>
        </nav>
      )}

    </div>
  );
}
