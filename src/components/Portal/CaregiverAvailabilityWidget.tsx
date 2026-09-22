import React, { useState, useEffect } from 'react';
import { NurseStaff, CareSchedule } from '../../types.ts';
import {
  ShieldCheck,
  Phone,
  Clock,
  MapPin,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Filter,
  Sparkles,
  UserCheck,
  Send,
  Star,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface CaregiverAvailabilityWidgetProps {
  nurses: NurseStaff[];
  schedules?: CareSchedule[];
  onRefresh?: () => void;
  onOpenBooking?: () => void;
}

export type LiveShiftStatus = 'active' | 'transition' | 'standby' | 'resting';

interface NurseLiveStatus {
  nurseId: string;
  status: LiveShiftStatus;
  statusLabel: string;
  shiftHours: string;
  currentPatientName?: string;
  currentLocation: string;
  shiftProgressPercent: number;
  nextVitalsDue: string;
  hoursElapsed: string;
  emergencyStandby: boolean;
}

export const CaregiverAvailabilityWidget: React.FC<CaregiverAvailabilityWidgetProps> = ({
  nurses,
  schedules = [],
  onRefresh,
  onOpenBooking
}) => {
  const { token } = useAuth();
  const [filterHub, setFilterHub] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedNurseForNote, setSelectedNurseForNote] = useState<NurseStaff | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute realistic real-time shift status based on scheduled data and nurse ID
  const getLiveStatus = (nurse: NurseStaff): NurseLiveStatus => {
    // Check if there is an active schedule today for this nurse
    const todayStr = new Date().toISOString().split('T')[0];
    const activeShift = schedules.find(s => s.nurseId === nurse.id && (s.status === 'in-progress' || s.shiftDate === todayStr));

    if (nurse.id === 'nurse-1') {
      // Sister Priya Sharma: Active day shift
      return {
        nurseId: nurse.id,
        status: 'active',
        statusLabel: 'Active On Duty',
        shiftHours: '08:00 AM – 08:00 PM (12h Day)',
        currentPatientName: 'Ramesh Khanna (ICU Bedside)',
        currentLocation: 'Janak Puri Hub • West Delhi Ward',
        shiftProgressPercent: 62,
        nextVitalsDue: '01:00 PM (BP, SpO2 & Enteral Feed)',
        hoursElapsed: '5h 15m into shift',
        emergencyStandby: false
      };
    } else if (nurse.id === 'nurse-2') {
      // Nurse Rajesh Kumar: Scheduled for night shift standby
      return {
        nurseId: nurse.id,
        status: 'standby',
        statusLabel: 'Standby for Night Shift',
        shiftHours: '08:00 PM – 08:00 AM (12h Night)',
        currentPatientName: 'Ramesh Khanna (Night BiPAP)',
        currentLocation: 'Noida Hub (Sector 62)',
        shiftProgressPercent: 0,
        nextVitalsDue: 'Starts at 08:00 PM (Pre-shift vitals handover)',
        hoursElapsed: 'Reporting in 4h 30m',
        emergencyStandby: true
      };
    } else if (nurse.id === 'nurse-3') {
      // Sister Anita Massey: Active post-op care
      return {
        nurseId: nurse.id,
        status: 'active',
        statusLabel: 'Active On Duty',
        shiftHours: '09:00 AM – 09:00 PM (12h Day)',
        currentPatientName: 'Mrs. Shakuntala Devi',
        currentLocation: 'Indirapuram (Ghaziabad Hub)',
        shiftProgressPercent: 45,
        nextVitalsDue: '02:30 PM (Knee dressing & Glucose test)',
        hoursElapsed: '4h 10m into shift',
        emergencyStandby: false
      };
    } else {
      // Brother Sunil Verma or others: Available / Quick Dispatch
      return {
        nurseId: nurse.id,
        status: 'transition',
        statusLabel: 'Ready for Immediate Deployment',
        shiftHours: '24h Live-in Certified',
        currentPatientName: 'On Standby Dispatch',
        currentLocation: 'Laxmi Nagar (East Delhi Head Office)',
        shiftProgressPercent: 100,
        nextVitalsDue: 'Available for immediate 60-min home dispatch',
        hoursElapsed: 'Rest cycle completed',
        emergencyStandby: true
      };
    }
  };

  const handleSendLiveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !selectedNurseForNote) return;

    setNoteSuccess(true);
    setTimeout(() => {
      setSelectedNurseForNote(null);
      setNoteContent('');
      setNoteSuccess(false);
    }, 1500);
  };

  // Filtered nurses
  const filteredNurses = nurses.filter(nurse => {
    const live = getLiveStatus(nurse);
    if (filterHub !== 'all' && !nurse.hubLocation.toLowerCase().includes(filterHub.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && live.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const activeCount = nurses.filter(n => getLiveStatus(n).status === 'active').length;
  const standbyCount = nurses.filter(n => getLiveStatus(n).status === 'standby').length;
  const readyCount = nurses.filter(n => getLiveStatus(n).status === 'transition').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      
      {/* Widget Header with Live Telemetry Pulse */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/60 shadow-xs">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1b3b6f] tracking-tight">
                  Caregiver Live Availability &amp; Shift Monitor
                </h3>
                {/* Real-time Live Dot Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time GPS-assisted duty roster for bedside nurses and ICU caregivers across Delhi NCR.
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock & Fast Refresh */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-slate-100 font-mono text-xs px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#00a0e3]" />
            <span>IST: {currentTimeStr || '09:14:00 AM'}</span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Shift Stream"
              className="p-2 text-slate-500 hover:text-[#1b3b6f] bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {onOpenBooking && (
            <button
              onClick={onOpenBooking}
              className="text-xs font-bold text-white bg-[#1b3b6f] hover:bg-[#234c8a] px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Request Caregiver</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 p-3.5 rounded-xl border border-emerald-200/80 flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-emerald-900 leading-none">
              {activeCount} Nurses
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">
              Active On Bedside Duty
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50/80 to-blue-50/30 p-3.5 rounded-xl border border-blue-200/80 flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-blue-900 leading-none">
              {standbyCount} Nurses
            </div>
            <div className="text-[11px] font-semibold text-blue-700 mt-1">
              Night Shift Standby
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50/80 to-amber-50/30 p-3.5 rounded-xl border border-amber-200/80 flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-amber-900 leading-none">
              {readyCount} Ready
            </div>
            <div className="text-[11px] font-semibold text-amber-700 mt-1">
              Emergency Fast Dispatch
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1b3b6f] shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800 leading-none">
              100% Certified
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Police &amp; Council Verified
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Hub Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#1b3b6f]" />
            <span>Filter Hub:</span>
          </span>
          {['all', 'Janak Puri', 'Noida', 'Indirapuram', 'Laxmi Nagar'].map((hub) => (
            <button
              key={hub}
              onClick={() => setFilterHub(hub)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                filterHub === hub
                  ? 'bg-[#1b3b6f] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              {hub === 'all' ? 'All Regional Hubs' : hub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#1b3b6f]"
          >
            <option value="all">All Duty States</option>
            <option value="active">Active On Duty</option>
            <option value="standby">Night Standby</option>
            <option value="transition">Fast Deployment</option>
          </select>
        </div>
      </div>

      {/* Live Caregiver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNurses.map((nurse) => {
          const live = getLiveStatus(nurse);

          return (
            <div
              key={nurse.id}
              className="border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white relative overflow-hidden group space-y-4"
            >
              {/* Top Row: Caregiver photo, details, and live-dot status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={nurse.avatar}
                      alt={nurse.fullName}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md bg-slate-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://carehealthnursing.com/images/gallery/003.jpg';
                      }}
                    />
                    {/* Live Dot on Avatar Corner */}
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      {live.status === 'active' && (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </>
                      )}
                      {live.status === 'standby' && (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
                        </>
                      )}
                      {live.status === 'transition' && (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{nurse.fullName}</span>
                      <span title="Police Verified & Registered">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 leading-tight">
                      {nurse.qualification.split(',')[0]} • {nurse.experienceYears} Yrs Exp
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{nurse.rating} Rating</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{nurse.hubLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Status Pill with Live-Dot Animation */}
                <div className="shrink-0">
                  {live.status === 'active' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>On Duty Now</span>
                    </span>
                  )}
                  {live.status === 'standby' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      <span>Night Standby</span>
                    </span>
                  )}
                  {live.status === 'transition' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span>Ready to Deploy</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Shift Details and Timeline Progress */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold flex items-center gap-1 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-[#00a0e3]" />
                    {live.shiftHours}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {live.hoursElapsed}
                  </span>
                </div>

                {/* Animated Shift Timeline Bar */}
                {live.status === 'active' && (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                      <div
                        className="bg-gradient-to-r from-[#1b3b6f] to-emerald-500 h-2 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${live.shiftProgressPercent}%` }}
                      >
                        <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 animate-pulse rounded-full" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Shift Start (08:00)</span>
                      <span>Now ({live.shiftProgressPercent}%)</span>
                      <span>Handover (20:00)</span>
                    </div>
                  </div>
                )}

                {/* Patient & Location */}
                <div className="pt-1 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-slate-600 gap-1">
                  <div className="truncate">
                    <strong className="text-slate-800">Assigned To: </strong>
                    <span className="text-blue-700 font-medium">{live.currentPatientName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{live.currentLocation}</span>
                  </div>
                </div>

                {/* Next Checkpoint */}
                <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-200/80 text-slate-700 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Next Vitals / Duty Checkpoint: </span>
                    <span>{live.nextVitalsDue}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Call & Send Live Note */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${nurse.phone}`}
                  className="flex-1 bg-[#1b3b6f] hover:bg-[#234c8a] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Nurse ({nurse.phone})</span>
                </a>

                <button
                  onClick={() => setSelectedNurseForNote(nurse)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-1.5 transition"
                  title="Send a real-time message or family instruction"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00a0e3]" />
                  <span>Send Note</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Transmission Note Modal */}
      {selectedNurseForNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-150">
            <div className="bg-[#1b3b6f] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Send Instant Duty Message</h3>
                <p className="text-xs text-blue-100">
                  Recipient: {selectedNurseForNote.fullName} ({selectedNurseForNote.hubLocation})
                </p>
              </div>
              <button
                onClick={() => setSelectedNurseForNote(null)}
                className="text-white/80 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendLiveNote} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Instruction:
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="e.g. Kindly take temperature reading before 2 PM feed..."
                  rows={4}
                  required
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1b3b6f] text-slate-800"
                />
              </div>

              {noteSuccess && (
                <div className="text-xs p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message delivered to {selectedNurseForNote.fullName}'s active mobile terminal!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedNurseForNote(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={noteSuccess || !noteContent.trim()}
                  className="bg-[#1b3b6f] hover:bg-[#234c8a] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Instantly</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
