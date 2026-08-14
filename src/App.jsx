import React, { useState } from 'react';

export default function App() {
  // Application State
  const [activeTier, setActiveTier] = useState('tier1'); // 'tier1' (Emerald), 'tier2' (Blue/Indigo), 'tier3' (Amber/Gold)
  const [userRole, setUserRole] = useState('storeowner'); // 'storeowner' or 'customer'
  const [isMobileTrader, setIsMobileTrader] = useState(false);
  
  // TPIN & Registration State
  const [tpin, setTpin] = useState('');
  const [businessName, setBusinessName] = useState('iTuka Retail Store');
  const [isRegistered, setIsRegistered] = useState(false);

  // POS Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('Meda'); // Meda, Kg, Liters
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MTN MoMo');

  // Sample Products Catalog with Custom Units
  const catalog = [
    { id: 1, name: 'Mealie Meal (25kg)', price: 320.00, unit: 'Meda/Bag' },
    { id: 2, name: 'Cooking Oil (2L)', price: 95.00, unit: 'Liters' },
    { id: 3, name: 'Kapenta (Per Kg)', price: 180.00, unit: 'Kg' },
    { id: 4, name: 'Tomatoes (Basket)', price: 50.00, unit: 'Meda' }
  ];

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const subtotal = calculateSubtotal();
  const microFee = subtotal * 0.01; // 1% Micro-fee tracking
  const turnoverTax = activeTier === 'tier2' || activeTier === 'tier3' ? subtotal * 0.05 : 0; // 5% ZRA Turnover Tax for Tier 2/3
  const municipalLevy = activeTier === 'tier3' ? 15.00 : 0; // Fixed municipal levy for Tier 3
  const total = subtotal + microFee + turnoverTax + municipalLevy;

  return (
    <div className={`min-h-screen font-sans p-4 md:p-6 transition-colors duration-300 ${
      activeTier === 'tier1' ? 'bg-emerald-50 text-slate-800' :
      activeTier === 'tier2' ? 'bg-indigo-50 text-slate-900' : 'bg-amber-50 text-slate-950'
    }`}>
      {/* Top Header / Branding Bar */}
      <header className={`p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white ${
        activeTier === 'tier1' ? 'bg-emerald-700' :
        activeTier === 'tier2' ? 'bg-indigo-700' : 'bg-amber-700'
      }`}>
        <div>
          <h1 className="text-2xl font-bold tracking-wide">iTuka POS (Zambia Pro)</h1>
          <p className="text-sm opacity-90">
            {activeTier === 'tier1' ? 'Tier 1: Emerald & Slate (Mobile / Basic)' :
             activeTier === 'tier2' ? 'Tier 2: Blue & Indigo (Pro & Turnover Tax)' :
             'Tier 3: Amber & Gold (Enterprise & Statutory P&L)'}
          </p>
        </div>

        {/* Tier Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveTier('tier1')} 
            className={`px-3 py-1.5 rounded text-xs font-semibold ${activeTier === 'tier1' ? 'bg-white text-emerald-800 shadow' : 'bg-emerald-800 opacity-80'}`}
          >
            Tier 1 (Emerald)
          </button>
          <button 
            onClick={() => setActiveTier('tier2')} 
            className={`px-3 py-1.5 rounded text-xs font-semibold ${activeTier === 'tier2' ? 'bg-white text-indigo-800 shadow' : 'bg-indigo-800 opacity-80'}`}
          >
            Tier 2 (Blue)
          </button>
          <button 
            onClick={() => setActiveTier('tier3')} 
            className={`px-3 py-1.5 rounded text-xs font-semibold ${activeTier === 'tier3' ? 'bg-white text-amber-900 shadow' : 'bg-amber-800 opacity-80'}`}
          >
            Tier 3 (Gold)
          </button>
        </div>
      </header>

      {/* TPIN & Setup Banner (If not registered) */}
      {!isRegistered ? (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto mb-6 border border-slate-200">
          <h2 className="text-lg font-bold mb-3">ZRA TPIN & Business Setup</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Business Name</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">ZRA TPIN</label>
              <input 
                type="text" 
                placeholder="Enter 10-digit TPIN" 
                value={tpin} 
                onChange={(e) => setTpin(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="mobileTrader" 
                checked={isMobileTrader} 
                onChange={(e) => setIsMobileTrader(e.target.checked)}
              />
              <label htmlFor="mobileTrader" className="text-sm font-medium">Mobile Trader Mode (vs. Fixed Store)</label>
            </div>
            <button 
              onClick={() => setIsRegistered(true)}
              className="w-full mt-4 bg-slate-900 text-white py-2 rounded font-semibold hover:bg-slate-800 transition"
            >
              Initialize iTuka POS
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catalog & Register Window */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{businessName} {isMobileTrader && '(Mobile)'}</h2>
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded font-mono">TPIN: {tpin || 'Pending'}</span>
            </div>

            {/* Measurement Units Selector */}
            <div className="flex gap-2 mb-4">
              {['Meda', 'Kg', 'Liters'].map(unit => (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${selectedUnit === unit ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Unit: {unit}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {catalog.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => addToCart(prod)}
                  className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-sm">{prod.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prod.unit}</p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-emerald-700">K{prod.price.toFixed(2)}</span>
                    <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded font-mono">+ Add</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Financial Summary Panel */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base mb-3 border-b pb-2">Active Cart</h3>
              {cart.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-6 text-center">Cart is empty. Tap items to add.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-slate-500">K{item.price} × {item.qty}</p>
                      </div>
                      <span className="font-semibold">K{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subtotals & Taxes breakdown */}
            <div className="border-t pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>K{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>1% Micro-Fee Tracking</span>
                <span>K{microFee.toFixed(2)}</span>
              </div>
              {activeTier !== 'tier1' && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>ZRA Turnover Tax (5%)</span>
                  <span>K{turnoverTax.toFixed(2)}</span>
                </div>
              )}
              {activeTier === 'tier3' && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Municipal Council Levy</span>
                  <span>K{municipalLevy.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t text-slate-900">
                <span>Total Due</span>
                <span>K{total.toFixed(2)}</span>
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={() => setCheckoutModal(true)}
                className={`w-full mt-4 py-2.5 rounded font-bold text-white transition ${
                  cart.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow'
                }`}
              >
                Proceed to Checkout (Kwacha)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Simulation Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-3">Select Mobile Money Gateway</h3>
            <p className="text-xs text-slate-500 mb-4">Complete your secure transaction via local Zambian payment rails in Kwacha.</p>

            <div className="space-y-2 mb-4">
              {['MTN MoMo', 'Airtel Money', 'Zamtel Kwacha', 'Flutterwave / DPO'].map(gateway => (
                <label key={gateway} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${paymentMethod === gateway ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <span className="text-sm font-medium">{gateway}</span>
                  <input 
                    type="radio" 
                    name="gateway" 
                    checked={paymentMethod === gateway} 
                    onChange={() => setPaymentMethod(gateway)}
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setCheckoutModal(false)}
                className="flex-1 bg-slate-100 py-2 rounded text-sm font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`Payment of K${total.toFixed(2)} successfully processed via ${paymentMethod}! Receipt generated.`);
                  setCart([]);
                  setCheckoutModal(false);
                }}
                className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm font-semibold hover:bg-emerald-700"
              >
                Authorize Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
