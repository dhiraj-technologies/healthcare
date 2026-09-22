import React, { useState } from 'react';
import { MapPin, Navigation, Radio, CheckCircle, Clock, Shield, Activity, Users } from 'lucide-react';

interface CoverageMapProps {
  onSelectHub: (hubName: string) => void;
}

export const CoverageMap: React.FC<CoverageMapProps> = ({ onSelectHub }) => {
  const [activeHubIndex, setActiveHubIndex] = useState(0);

  const hubs = [
    {
      name: 'Janak Puri Hub',
      zone: 'West Delhi & Dwarka',
      address: 'Kirti Shikhar Bldg, District Centre',
      nursesOnDuty: 42,
      instantAvailable: 9,
      avgResponseMin: 35,
      x: '24%',
      y: '48%',
      coverage: ['Janakpuri', 'Dwarka', 'Vikaspuri', 'Uttam Nagar', 'Rajouri Garden', 'Paschim Vihar']
    },
    {
      name: 'Laxmi Nagar Head Office',
      zone: 'East & Central Delhi',
      address: 'Lalita Park, Vikas Marg',
      nursesOnDuty: 58,
      instantAvailable: 14,
      avgResponseMin: 28,
      x: '52%',
      y: '44%',
      coverage: ['Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Anand Vihar', 'Civil Lines', 'Connaught Place']
    },
    {
      name: 'Indirapuram Hub',
      zone: 'Ghaziabad & Trans-Hindon',
      address: 'Rajhans Plaza, Ahinsa Khand-1',
      nursesOnDuty: 36,
      instantAvailable: 7,
      avgResponseMin: 40,
      x: '76%',
      y: '38%',
      coverage: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Kaushambi', 'Raj Nagar Extension', 'Crossings']
    },
    {
      name: 'Noida Hub (Sector 62)',
      zone: 'Noida & Greater Noida',
      address: 'Galaxy Diamond Plaza & Sec 62',
      nursesOnDuty: 49,
      instantAvailable: 11,
      avgResponseMin: 32,
      x: '72%',
      y: '68%',
      coverage: ['Sector 62', 'Sector 50', 'Sector 76', 'Sector 137', 'Greater Noida West', 'Pari Chowk']
    }
  ];

  const selected = hubs[activeHubIndex];

  return (
    <section className="py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0fa] text-[#006591] text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#00a0e3] animate-pulse" />
            Live Deployment Radar
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            Real-Time Delhi NCR Coverage &amp; Dispatch Status
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Our interconnected regional hubs monitor live nurse locations and equipment fleet readiness to guarantee emergency 45-minute bedside arrival.
          </p>
        </div>

        {/* Interactive Map Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Visual Interactive Map Canvas */}
          <div className="lg:col-span-8 bg-[#111c2d] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[420px]">
            
            {/* Top Bar with Live Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                  LIVE DISPATCH NETWORK ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                FLEET STATUS: 185 ACTIVE NURSES IN TRANSIT
              </div>
            </div>

            {/* Simulated NCR Map Layout */}
            <div className="relative my-8 h-64 sm:h-72 w-full border border-slate-800 rounded-xl bg-slate-900/60 p-4 overflow-hidden">
              
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
              
              {/* Yamuna River Curve Simulation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M 380 0 Q 340 140 400 240 T 430 360" fill="none" stroke="#00a0e3" strokeWidth="8" strokeDasharray="6 4" />
              </svg>

              {/* Hub Interactive Markers */}
              {hubs.map((hub, idx) => {
                const isActive = idx === activeHubIndex;
                return (
                  <div
                    key={hub.name}
                    onClick={() => setActiveHubIndex(idx)}
                    style={{ left: hub.x, top: hub.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing ring */}
                    <div className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-[#00a0e3]/40 animate-ping' : 'group-hover:bg-slate-700/50'
                    }`} />

                    {/* Marker Icon */}
                    <div className={`relative px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform ${
                      isActive
                        ? 'bg-[#00a0e3] text-white scale-110 ring-2 ring-white/50'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{hub.name.split(' ')[0]}</span>
                    </div>

                    {/* Live Count Chip */}
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] font-black px-1.5 py-0.2 rounded-full text-slate-950 shadow">
                      {hub.instantAvailable}
                    </div>
                  </div>
                );
              })}

              {/* Live Ticker overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#00a0e3] font-medium">
                  <Activity className="w-3.5 h-3.5" />
                  Recent Dispatch: Sister Preeti assigned to Dwarka Sec 11 (ICU Care)
                </span>
                <span className="text-slate-500 hidden md:inline">2 mins ago</span>
              </div>
            </div>

            {/* Bottom Map Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800 z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Green Badge = Available for Urgent 45-Min Callout
                </span>
              </div>
              <span className="text-[#00a0e3] font-medium">
                Click any hub node to view deployment details
              </span>
            </div>

          </div>

          {/* Right Column: Selected Hub Breakdown */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00a0e3] bg-[#e6f0fa] px-2.5 py-1 rounded-full">
                  {selected.zone}
                </span>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selected.avgResponseMin} Min Avg Dispatch</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1b3b6f] font-heading">
                  {selected.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selected.address}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#f0f7fd] p-3 rounded-xl border border-slate-200/60">
                  <div className="text-xs text-slate-500 font-medium">Available Right Now</div>
                  <div className="text-2xl font-extrabold text-[#006591] mt-0.5">
                    {selected.instantAvailable} <span className="text-xs font-normal text-slate-600">Nurses</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-xs text-slate-500 font-medium">Total Staff on Duty</div>
                  <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
                    {selected.nursesOnDuty} <span className="text-xs font-normal text-slate-600">Staff</span>
                  </div>
                </div>
              </div>

              {/* Sub-areas Covered */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Primary Localities Covered:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.coverage.map((loc) => (
                    <span key={loc} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => onSelectHub(selected.name)}
                className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-sm py-3 px-4 rounded-xl shadow transition"
              >
                Request Dispatch from {selected.name}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
