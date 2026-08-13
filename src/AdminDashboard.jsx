import React, { useState } from 'react';

export default function AdminDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeAdminTab, setActiveAdminTab] = useState('metrics'); // 'metrics', 'devspace', 'compliance'
  const [powerBiApiKey, setPowerBiApiKey] = useState('pbi_live_sec_9948281920');
  const [isPowerBiConnected, setIsPowerBiConnected] = useState(true);

  // Simulated Ecosystem Telemetry Data
  const [telemetryMetrics, setTelemetryMetrics] = useState({
    totalActiveUsers: 1420,
    dailyActiveMerchants: 385,
    grossMerchandiseValue: 'ZMW 482,900',
    ntembaRevenueCollected: 'ZMW 4,829.00',
    topRegion: 'Lusaka Central Market',
    zraComplianceRate: '98.4%'
  });

  const theme = {
    bg: 'bg-stone-950 text-stone-100',
    cardBg: 'bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md',
    accentGold: 'text-amber-400',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer',
    activeNav: 'text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20'
  };

  const handleRefreshPowerBi = () => {
    setIsPowerBiConnected(false);
    setTimeout(() => {
      setIsPowerBiConnected(true);
      alert("PowerBI Data Pipeline successfully re-synced via API!");
    }, 800);
  };

  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col justify-between relative overflow-x-hidden p-6`}>
      
      {/* HEADER BAR */}
      <header className="px-6 py-4 border-b border-stone-800 bg-stone-950/85 backdrop-blur-md flex justify-between items-center rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">Ntemba Back-Office <span className={theme.accentGold}>Command</span></h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Developer Workspace & PowerBI Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono px-3 py-1 rounded-xl border ${isPowerBiConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            {isPowerBiConnected ? '● PowerBI API Live' : '↻ Syncing API...'}
          </span>
          <button 
            onClick={handleRefreshPowerBi}
            className="text-xs px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
          >
            Refresh Telemetry
          </button>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <nav className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === 'metrics' ? theme.activeNav : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          📊 PowerBI Metrics & Heatmaps
        </button>

        <button
          onClick={() => setActiveAdminTab('devspace')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === 'devspace' ? theme.activeNav : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          ⚡ Central Developer Workspace
        </button>

        <button
          onClick={() => setActiveAdminTab('compliance')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeAdminTab === 'compliance' ? theme.activeNav : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'}`}
        >
          🔒 Governance & Data Sharing
        </button>
      </nav>

      {/* TAB 1: POWERBI METRICS & ANALYTICS */}
      {activeAdminTab === 'metrics' && (
        <main className="space-y-6 flex-1 max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-1`}>
              <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Total Active Users</p>
              <p className="text-2xl font-black text-white font-mono">{telemetryMetrics.totalActiveUsers}</p>
              <p className="text-[10px] text-emerald-400 font-mono">+12.4% this week</p>
            </div>

            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-1`}>
              <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Gross Merchandise Value</p>
              <p className="text-2xl font-black text-amber-400 font-mono">{telemetryMetrics.grossMerchandiseValue}</p>
              <p className="text-[10px] text-stone-400 font-mono">Processed via Lenco Gateway</p>
            </div>

            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-1`}>
              <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Ntemba 1% Revenue</p>
              <p className="text-2xl font-black text-white font-mono">{telemetryMetrics.ntembaRevenueCollected}</p>
              <p className="text-[10px] text-amber-400 font-mono">Platform Collection Fee</p>
            </div>

            <div className={`p-5 rounded-2xl ${theme.cardBg} space-y-1`}>
              <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Top Performing Region</p>
              <p className="text-lg font-black text-white">{telemetryMetrics.topRegion}</p>
              <p className="text-[10px] text-stone-400 font-mono">Highest transaction density</p>
            </div>
          </div>

          {/* POWERBI EMBED CARD & API CONFIG */}
          <div className={`p-6 rounded-3xl ${theme.cardBg} space-y-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-white">PowerBI Telemetry Connector</h3>
                <p className="text-[11px] text-stone-400">Live data stream connected to enterprise analytics workspace.</p>
              </div>
              <span className="text-[10px] font-mono bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300">
                Workspace ID: NTEMBA-BI-ZMW
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-stone-400">PowerBI Integration API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={powerBiApiKey}
                  onChange={(e) => setPowerBiApiKey(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <button 
                  onClick={() => alert("API Key updated successfully!")}
                  className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* TAB 2: CENTRAL DEVELOPER WORKSPACE */}
      {activeAdminTab === 'devspace' && (
        <main className="space-y-6 flex-1 max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* GITHUB CARD */}
            <div className={`p-6 rounded-3xl ${theme.cardBg} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-white text-lg font-bold">
                  🐙
                </div>
                <h3 className="text-sm font-black text-white">GitHub Repository</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Access source control, manage pull requests, and review commit logs for your POS frontend and backend hooks.
                </p>
              </div>
              <a 
                href="https://github.com/Ntemba-create/Ntemba-pos" 
                target="_blank" 
                rel="noreferrer"
                className={`w-full py-3 rounded-xl text-center text-xs block ${theme.primaryBtn}`}
              >
                Open GitHub Repo ↗
              </a>
            </div>

            {/* NETLIFY CARD */}
            <div className={`p-6 rounded-3xl ${theme.cardBg} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-teal-400 text-lg font-bold">
                  ▲
                </div>
                <h3 className="text-sm font-black text-white">Netlify Deployment</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Monitor live build logs, domain routing, environment variables, and instant preview branches.
                </p>
              </div>
              <a 
                href="https://ntemba-pos.netlify.app/" 
                target="_blank" 
                rel="noreferrer"
                className={`w-full py-3 rounded-xl text-center text-xs block ${theme.primaryBtn}`}
              >
                Open Netlify App ↗
              </a>
            </div>

            {/* VS CODE WEB / ENVIRONMENT CARD */}
            <div className={`p-6 rounded-3xl ${theme.cardBg} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-blue-400 text-lg font-bold">
                  💻
                </div>
                <h3 className="text-sm font-black text-white">VS Code Environment</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Quick launcher for local development environment, terminal commands, and extension manager.
                </p>
              </div>
              <button 
                onClick={() => alert("Launching local workspace terminal or VS Code protocol handler...")}
                className={`w-full py-3 rounded-xl text-xs ${theme.primaryBtn}`}
              >
                Launch VS Code Workspace
              </button>
            </div>

          </div>
        </main>
      )}

      {/* TAB 3: GOVERNANCE & DATA SHARING */}
      {activeAdminTab === 'compliance' && (
        <main className="space-y-6 flex-1 max-w-6xl w-full mx-auto">
          <div className={`p-6 rounded-3xl ${theme.cardBg} space-y-4`}>
            <h3 className="text-sm font-black text-white">Data Sharing & Privacy Governance</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              In compliance with the Data Protection Act and financial gateway regulations, all analytics fed into PowerBI or third-party reports are strictly anonymized and aggregated. No raw customer telephone numbers or proprietary merchant TPIN identifiers are exposed externally without explicit user consent.
            </p>
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 font-mono text-xs text-stone-300">
              <p>🔒 <span className="text-white font-bold">ZRA VSDM Status:</span> Active & Encrypted</p>
              <p>🛡️ <span className="text-white font-bold">Lenco Gateway Token:</span> Secured via Secure Serverless Headers</p>
            </div>
          </div>
        </main>
      )}

    </div>
  );
}
