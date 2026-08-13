import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  const products = [
    { id: 1, name: 'Airtime Voucher', price: 20, category: 'Telecom' },
    { id: 2, name: 'Phone Charger', price: 150, category: 'Accessories' },
    { id: 3, name: 'Fast USB Cable', price: 80, category: 'Accessories' },
    { id: 4, name: 'Glass Protector', price: 100, category: 'Accessories' },
    { id: 5, name: 'Mobile Data Bundle', price: 50, category: 'Telecom' },
    { id: 6, name: 'Wireless Earbuds', price: 250, category: 'Audio' },
  ];

  const filtered = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 select-none">
      {/* Vibrant Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-extrabold tracking-tight">Ntemba POS</h1>
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          ⚡ Live POS
        </span>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Left Section: Catalog & Categories */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Accessories', 'Telecom', 'Audio'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeTab === cat 
                    ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => addItem(prod)}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between h-28 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all active:scale-95"
              >
                <span className="font-bold text-slate-800 text-sm line-clamp-2">{prod.name}</span>
                <span className="font-extrabold text-indigo-600 text-base">ZMW {prod.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Live Order & Checkout Panel */}
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 md:p-6 flex flex-col max-h-[42vh] md:max-h-none shadow-xl">
          <h2 className="text-sm font-extrabold text-slate-900 mb-3">Current Order</h2>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
            {cart.length === 0 ? (
              <p className="text-slate-400 text-xs text-center mt-8">Tap items to add them to the sale</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs">
                  <span className="font-semibold text-slate-700">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                  <span className="font-bold text-slate-900">ZMW {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 mb-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>ZMW {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Due</span>
              <span>ZMW {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (cart.length === 0) {
                alert('Cart is empty!');
              } else {
                alert(`Payment Confirmed! Collected ZMW ${total.toFixed(2)}`);
                setCart([]);
              }
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-98 cursor-pointer"
          >
            Charge ZMW {total.toFixed(2)}
          </button>
        </div>

      </div>
    </div>
  );
}
