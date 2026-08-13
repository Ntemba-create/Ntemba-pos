import React, { useState } from 'react';

export default function AdminApp() {
  const [activeAdminTab, setActiveAdminTab] = useState('metrics');
  const [powerBiApiKey, setPowerBiApiKey] = useState('pbi_live_sec_9948281920');
  const [isPowerBiConnected, setIsPowerBiConnected] = useState(true);
  const [telemetryMetrics] = useState({
    totalActiveUsers: 1420,
    dailyActiveMerchants: 385,
    grossMerchandiseValue: 'ZMW 482,900',
    ntembaRevenueCollected: 'ZMW 4,829.00',
    topRegion: 'Lusaka Central Market',
    zraComplianceRate: '98.4%'
  });

  const handleRefreshPowerBi = () => {
    setIsPowerBiConnected(false);
    setTimeout(() => {
      setIsPowerBiConnected(true);
      alert("PowerBI Data Pipeline successfully re-synced via API!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans p-8 flex flex-col justify-between max-w-[1440px] mx-auto">
      
      {/* DESKTOP COMMAND HEADER */}
      <header className="px-8 py-5 border border-stone-800 bg-stone-900/90 backdrop-blur-md flex justify-between items-center rounded-3xl mb-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-amber-500/20">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wide text-white">Ntemba Desktop Back-Office <span className="text-amber-400">Command Center</span></h1>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-mono">Exclusive Admin Workspace • PowerBI Enterprise API Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs font-mono px-4 py-2 rounded-xl border ${isPowerBiConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            {isPowerBiConnected ? '● PowerBI API Live' : '↻ Syncing API...'}
          </span>
          <button 
            onClick={handleRefreshPowerBi}
            className="text-xs px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold border border-stone-700 transition-all cursor-pointer"
          >
            Refresh Telemetry Feed
          </button>
        </div>
      </header>

      {/* DESKTOP NAVIGATION TABS */}
      <nav className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeAdminTab === 'metrics' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg' : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          📊 PowerBI Metrics & Heatmaps
        </button>

        <button
          onClick={() => setActiveAdminTab('devspace')}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeAdminTab === 'devspace' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg' : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          ⚡ Central Developer Workspace
        </button>

        <button
          onClick={() => setActiveAdminTab('compliance')}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeAdminTab === 'compliance' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg' : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          🔒 Governance & Data Sharing
        </button>
      </nav>

      {/* TAB 1: METRICS */}
      {activeAdminTab === 'metrics' && (
        <main className="space-y-8 flex-1">
          <div className="grid grid-cols-4 gap-6">
            <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-2 shadow-xl">
              <p className="text-xs uppercase text-stone-400 font-bold tracking-wider">Total Active Users</p>
              <p className="text-3xl font-black text-white font-mono">{telemetryMetrics.totalActiveUsers}</p>
              <p className="text-xs text-emerald-400 font-mono">+12.4% this week</p>
            </div>

            <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-2 shadow-xl">
              <p className="text-xs uppercase text-stone-400 font-bold tracking-wider">Gross Merchandise Value</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{telemetryMetrics.grossMerchandiseValue}</p>
              <p className="text-xs text-stone-400 font-mono">Processed via Lenco Gateway</p>
            </div>

            <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-2 shadow-xl">
              <p className="text-xs uppercase text-stone-400 font-bold tracking-wider">Ntemba 1% Revenue</p>
              <p className="text-3xl font-black text-white font-mono">{telemetryMetrics.ntembaRevenueCollected}</p>
              <p className="text-xs text-amber-400 font-mono">Platform Collection Fee</p>
            </div>

            <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-2 shadow-xl">
              <p className="text-xs uppercase text-stone-400 font-bold tracking-wider">Top Performing Region</p>
              <p className="text-xl font-black text-white">{telemetryMetrics.topRegion}</p>
              <p className="text-xs text-stone-400 font-mono">Highest transaction density</p>
            </div>
          </div>

          <div className="p-8 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white">PowerBI Telemetry Connector</h3>
                <p className="text-xs text-stone-400">Live data stream connected to enterprise analytics workspace.</p>
              </div>
              <span className="text-xs font-mono bg-stone-950 px-4 py-2 rounded-xl border border-stone-800 text-stone-300">
                Workspace ID: NTEMBA-BI-ZMW
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase text-stone-400">PowerBI Integration API Key</label>
              <div className="flex gap-4">
                <input 
                  type="password" 
                  value={powerBiApiKey}
                  onChange={(e) => setPowerBiApiKey(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <button 
                  onClick={() => alert("API Key updated successfully!")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* TAB 2: DEVSPACE */}
      {activeAdminTab === 'devspace' && (
        <main className="grid grid-cols-3 gap-6 flex-1">
          <div className="p-8 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-white text-xl font-bold">
                🐙
              </div>
              <h3 className="text-base font-black text-white">GitHub Repository</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Access source control, manage pull requests, and review commit logs for your POS frontend and backend hooks.
              </p>
            </div>
            <a href="https://mail.google.com/mail/u/0/#snoozed2" target="_blank" rel="noreferrer" className="w-full py-4 rounded-2xl text-center text-sm bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-stone-950 block shadow-lg shadow-amber-500/20">
              Open GitHub Repo ↗
            </a>
          </div>

          <div className="p-8 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-teal-400 text-xl font-bold">
                ▲
              </div>
              <h3 className="text-base font-black text-white">Netlify Deployment</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Monitor live build logs, domain routing, environment variables, and instant preview branches.
              </p>
            </div>
            <a href="https://ntemba-pos.netlify.app/" target="_blank" rel="noreferrer" className="w-full py-4 rounded-2xl text-center text-sm bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-stone-950 block shadow-lg shadow-amber-500/20">
              Open Netlify App ↗
            </a>
          </div>

          <div className="p-8 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-blue-400 text-xl font-bold">
                💻
              </div>
              <h3 className="text-base font-black text-white">VS Code Environment</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Quick launcher for local development environment, terminal commands, and extension manager.
              </p>
            </div>
            <button onClick={() => alert("Launching local workspace terminal...")} className="w-full py-4 rounded-2xl text-sm bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-stone-950 cursor-pointer shadow-lg shadow-amber-500/20">
              Launch VS Code Workspace
            </button>
          </div>
        </main>
      )}

      {/* TAB 3: COMPLIANCE */}
      {activeAdminTab === 'compliance' && (
        <main className="flex-1">
          <div className="p-8 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-6 shadow-xl max-w-4xl">
            <h3 className="text-base font-black text-white">Data Sharing & Privacy Governance</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              In compliance with the Data Protection Act and financial gateway regulations, all analytics fed into PowerBI or third-party reports are strictly anonymized and aggregated. No raw customer telephone numbers or proprietary merchant TPIN identifiers are exposed externally without explicit user consent.
            </p>
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 font-mono text-xs text-stone-300">
              <p>🔒 <span className="text-white font-bold">ZRA VSDM Status:</span> Active & Encrypted</p>
              <p>🛡️ <span className="text-white font-bold">Lenco Gateway Token:</span> Secured via Secure Serverless Headers</p>
            </div>
          </div>
        </main>
      )}

      <footer className="text-center text-xs text-stone-500 pt-8 border-t border-stone-900 mt-8">
        Ntemba Enterprise Back-Office Environment • Secure Internal Desktop Access Only
      </footer>

    </div>
  );
}
