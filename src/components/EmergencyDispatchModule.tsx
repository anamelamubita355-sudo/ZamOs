import React, { useState } from 'react';
import { 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  Ambulance, 
  Radio, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Activity 
} from 'lucide-react';
import { ZAMBIA_PROVINCES } from '../data/zambiaData';

export const EmergencyDispatchModule: React.FC = () => {
  const [incidentType, setIncidentType] = useState('Medical Trauma / Ambulance');
  const [province, setProvince] = useState('Lusaka Province');
  const [locationDetails, setLocationDetails] = useState('Great East Road near Arcades Shopping Mall');
  const [callerName, setCallerName] = useState('Citizen Report');
  const [callerPhone, setCallerPhone] = useState('0977xxxxxx');
  const [isDispatching, setIsDispatching] = useState(false);
  const [activeIncidents, setActiveIncidents] = useState<Array<{
    id: string;
    type: string;
    province: string;
    location: string;
    status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE';
    respondingUnit: string;
    timestamp: string;
  }>>([
    {
      id: 'INC-ZM-9102',
      type: 'Road Traffic Collision',
      province: 'Lusaka Province',
      location: 'Kafue Road near Shimabala Toll Plaza',
      status: 'EN_ROUTE',
      respondingUnit: 'RTSA Patrol 03 & UTH Trauma Ambulance',
      timestamp: '10 mins ago',
    },
    {
      id: 'INC-ZM-9101',
      type: 'Industrial Power Flash / Fault',
      province: 'Copperbelt Province',
      location: 'Kitwe Heavy Industrial Area',
      status: 'ON_SCENE',
      respondingUnit: 'Kitwe Fire Brigade Engine 2 & ZESCO Rapid Response',
      timestamp: '32 mins ago',
    },
  ]);

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    setTimeout(() => {
      const newInc = {
        id: `INC-ZM-${Math.floor(1000 + Math.random() * 9000)}`,
        type: incidentType,
        province,
        location: locationDetails,
        status: 'DISPATCHED' as const,
        respondingUnit: incidentType.includes('Ambulance') 
          ? 'Provincial Teaching Hospital Rapid Response' 
          : incidentType.includes('Fire') 
          ? 'Municipal Fire Engine 1' 
          : 'Zambia Police Service Flying Squad',
        timestamp: 'Just now',
      };
      setActiveIncidents([newInc, ...activeIncidents]);
      setIsDispatching(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Office of the Vice President & Home Affairs</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">Unified National 991/992/993 Console</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Emergency Operations & Disaster Response (DMMU)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Unified sovereign emergency routing for Zambia Police (991), Fire & Rescue (992), National Ambulance (993), and Disaster Management & Mitigation Unit (DMMU).
            </p>
          </div>
        </div>

        {/* Toll-Free Emergency Direct Lines */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="bg-red-950/40 p-3 rounded-lg border border-red-800/40">
            <div className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Zambia Police
            </div>
            <div className="text-xl font-bold text-slate-100 mt-1">991</div>
            <div className="text-[10px] text-slate-400">National Police Service</div>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/40">
            <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Fire & Rescue
            </div>
            <div className="text-xl font-bold text-slate-100 mt-1">992</div>
            <div className="text-[10px] text-slate-400">Municipal Fire Brigades</div>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/40">
            <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <Ambulance className="w-3.5 h-3.5" /> Ambulance / MoH
            </div>
            <div className="text-xl font-bold text-slate-100 mt-1">993</div>
            <div className="text-[10px] text-slate-400">National Medical Trauma</div>
          </div>

          <div className="bg-blue-950/40 p-3 rounded-lg border border-blue-800/40">
            <div className="text-[10px] text-blue-400 uppercase font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> DMMU Hotline
            </div>
            <div className="text-xl font-bold text-slate-100 mt-1">112</div>
            <div className="text-[10px] text-slate-400">Disaster Management Unit</div>
          </div>
        </div>
      </div>

      {/* Main Grid: SOS Dispatch Form (Left) & Active Response Incidents (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rapid SOS Dispatcher */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Direct Emergency Incident Dispatcher
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transmit urgent distress signal directly to the closest provincial command post
            </p>
          </div>

          <form onSubmit={handleCreateDispatch} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Category</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option>Medical Trauma / Ambulance (993)</option>
                <option>Zambia Police Service Flying Squad (991)</option>
                <option>Municipal Fire & Rescue Brigade (992)</option>
                <option>Road Traffic Collision / RTSA Highway Unit</option>
                <option>Flash Flooding & Extreme Weather (DMMU)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Province of Occurrence</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                {ZAMBIA_PROVINCES.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Exact Location / Landmark</label>
              <input
                type="text"
                required
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. Great East Road near Arcades Mall, Lusaka"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Caller Name</label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isDispatching}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isDispatching ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Alerting Provincial Dispatch Operations...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Transmit Priority SOS Dispatch</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Emergency Dispatches */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Live Provincial Emergency Dispatch Feed
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Real-time GPS Tracking</span>
            </div>

            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{inc.type}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        inc.status === 'DISPATCHED'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : inc.status === 'EN_ROUTE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inc.location} ({inc.province})</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 font-mono text-slate-400">
                    <span className="text-emerald-400">Unit: {inc.respondingUnit}</span>
                    <span>{inc.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
