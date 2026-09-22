import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { CareSchedule, VitalsRecord, Patient, NurseStaff, ServiceRequest } from '../../types.ts';
import { PatientDashboard } from './PatientDashboard.tsx';
import { CaregiverAvailabilityWidget } from './CaregiverAvailabilityWidget.tsx';
import { SchedulingView } from './SchedulingView.tsx';
import { RecordsView } from './RecordsView.tsx';
import { DispatchQueueView } from './DispatchQueueView.tsx';
import { StaffRosterView } from './StaffRosterView.tsx';
import { PatientRegistryView } from './PatientRegistryView.tsx';
import { SecureChatView } from './SecureChatView.tsx';
import {
  ShieldCheck,
  Calendar,
  Activity,
  Inbox,
  Users,
  LogOut,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  Stethoscope,
  HeartHandshake,
  AlertCircle,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Lock
} from 'lucide-react';

interface ClinicalPortalProps {
  onBackToWebsite: () => void;
  onOpenBooking: () => void;
}

export const ClinicalPortal: React.FC<ClinicalPortalProps> = ({ onBackToWebsite, onOpenBooking }) => {
  const { user, token, logout, quickDemoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'availability' | 'messages' | 'schedules' | 'patients' | 'records' | 'queue' | 'staff'>(() => {
    return user?.role === 'patient' ? 'dashboard' : 'schedules';
  });
  const [selectedChatPatientId, setSelectedChatPatientId] = useState<string | undefined>(undefined);
  const [schedules, setSchedules] = useState<CareSchedule[]>([]);
  const [records, setRecords] = useState<VitalsRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [nurses, setNurses] = useState<NurseStaff[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Automatically switch to patient dashboard when logging in as patient
  useEffect(() => {
    if (user?.role === 'patient') {
      setActiveTab('dashboard');
    }
  }, [user?.role]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch schedules (RBAC filtered on backend)
      const schedRes = await fetch('/api/schedules', { headers });
      if (schedRes.ok) setSchedules(await schedRes.json());

      // Fetch records (RBAC filtered on backend)
      const recRes = await fetch('/api/records', { headers });
      if (recRes.ok) setRecords(await recRes.json());

      // Fetch patients
      const patRes = await fetch('/api/patients', { headers });
      if (patRes.ok) setPatients(await patRes.json());

      // Fetch nurses
      const nurseRes = await fetch('/api/nurses');
      if (nurseRes.ok) setNurses(await nurseRes.json());

      // Fetch requests (Admin only)
      if (user?.role === 'admin') {
        const reqRes = await fetch('/api/requests', { headers });
        if (reqRes.ok) setRequests(await reqRes.json());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user?.role]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans pb-16">
      
      {/* Top Portal Navigation Bar */}
      <div className="bg-[#1b3b6f] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Brand & Back button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00a0e3]" />
              <span className="font-bold text-sm sm:text-base font-heading tracking-tight">
                Care Health Clinical Portal
              </span>
            </div>
          </div>

          {/* Right User Card & Demo Switcher */}
          <div className="flex items-center gap-3 ml-auto">
            {/* 1-Click Role switcher for evaluation convenience */}
            <div className="hidden md:flex items-center gap-1 text-[11px] bg-white/10 px-2 py-1 rounded-lg border border-white/10">
              <span className="text-slate-300 mr-1">Switch Role:</span>
              <button
                onClick={() => quickDemoLogin('admin')}
                className={`px-1.5 py-0.5 rounded font-bold transition ${
                  user?.role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => quickDemoLogin('nurse')}
                className={`px-1.5 py-0.5 rounded font-bold transition ${
                  user?.role === 'nurse' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Nurse
              </button>
              <button
                onClick={() => quickDemoLogin('patient')}
                className={`px-1.5 py-0.5 rounded font-bold transition ${
                  user?.role === 'patient' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Patient
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 bg-slate-900/40 p-1.5 pl-3 rounded-lg border border-white/10">
              <div className="text-right text-xs">
                <div className="font-bold text-white leading-tight">{user?.name}</div>
                <div className="text-[10px] uppercase font-bold text-[#00a0e3] tracking-wider">
                  Role: {user?.role}
                </div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1 text-slate-300 hover:text-rose-400 rounded transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchData}
              title="Refresh Data"
              className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Role Context Notification Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1b3b6f]">RBAC Security Protocol Active:</span>
            {user?.role === 'admin' && (
              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200">
                Full Clinical Oversight: Dispatch queue, master scheduling, nurse credentialing &amp; records audit
              </span>
            )}
            {user?.role === 'nurse' && (
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                Staff Nurse Mode: Record bedside vitals with SHA-256 integrity hash, log medications &amp; complete assigned shifts
              </span>
            )}
            {user?.role === 'patient' && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Family Portal: Real-time patient vitals trend monitoring, nurse schedule &amp; medical notes
              </span>
            )}
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            JWT Session: 256-Bit Encrypted
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {/* Patient Dashboard Tab (Available to all, primary for Patient) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'dashboard'
                ? 'bg-[#1b3b6f] text-white shadow-sm ring-2 ring-[#00a0e3]/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-patient-dashboard"
          >
            <LayoutDashboard className="w-4 h-4 text-[#00a0e3]" />
            <span>
              {user?.role === 'patient' ? 'Patient Dashboard' : 'Patient Dashboard View'}
            </span>
            {user?.role === 'patient' && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                activeTab === 'dashboard' ? 'bg-[#00a0e3] text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Family Portal
              </span>
            )}
          </button>

          {/* Caregiver Availability Tab with Live-Dot Animation */}
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'availability'
                ? 'bg-[#1b3b6f] text-white shadow-sm ring-2 ring-emerald-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-caregiver-availability"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Caregiver Availability</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          </button>

          {/* Secure HIPAA-Compliant Real-Time Messaging Tab */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'messages'
                ? 'bg-[#1b3b6f] text-white shadow-sm ring-2 ring-emerald-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-messages"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-[#00a0e3]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <span>
              {user?.role === 'patient' ? 'Secure Nurse & Coordinator Chat' : 'HIPAA Secure Messaging'}
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>LIVE</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'schedules'
                ? 'bg-[#1b3b6f] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-schedules"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {user?.role === 'patient' ? 'My Care Schedule' : user?.role === 'nurse' ? 'My Assigned Shifts' : 'Master Scheduling'}
            </span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'schedules' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {schedules.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'records'
                ? 'bg-[#1b3b6f] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-records"
          >
            <Activity className="w-4 h-4" />
            <span>Clinical Records &amp; Vitals</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'records' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {records.length}
            </span>
          </button>

          {/* Patient Registry & Profiles Tab */}
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'patients'
                ? 'bg-[#1b3b6f] text-white shadow-sm ring-2 ring-rose-400/40'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-patients"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Patient Registry &amp; Profiles</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'patients' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {patients.length}
            </span>
          </button>

          {/* Admin Queue Tab */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                activeTab === 'queue'
                  ? 'bg-[#1b3b6f] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              id="tab-portal-queue"
            >
              <Inbox className="w-4 h-4" />
              <span>Incoming Dispatch Queue</span>
              {requests.filter(r => r.status === 'new').length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {requests.filter(r => r.status === 'new').length} New
                </span>
              )}
            </button>
          )}

          {/* Staff Roster Tab */}
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'staff'
                ? 'bg-[#1b3b6f] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            id="tab-portal-staff"
          >
            <Users className="w-4 h-4" />
            <span>Verified Staff Roster</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'staff' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {nurses.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <PatientDashboard
            schedules={schedules}
            records={records}
            patients={patients}
            nurses={nurses}
            onOpenBooking={onOpenBooking}
            onRefresh={fetchData}
            onNavigateTab={(tab) => {
              if (tab === 'messages') setSelectedChatPatientId(user?.patientId);
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'availability' && (
          <CaregiverAvailabilityWidget
            nurses={nurses}
            schedules={schedules}
            onRefresh={fetchData}
            onOpenBooking={onOpenBooking}
          />
        )}

        {activeTab === 'messages' && (
          <SecureChatView initialPatientId={selectedChatPatientId || (user?.role === 'patient' ? user.patientId : undefined)} />
        )}

        {activeTab === 'schedules' && (
          <SchedulingView
            schedules={schedules}
            patients={patients}
            nurses={nurses}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'records' && (
          <RecordsView
            records={records}
            patients={patients}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'patients' && (
          <PatientRegistryView
            patients={patients}
            nurses={nurses}
            onRefresh={fetchData}
            onNavigateToRecords={(_pid) => setActiveTab('records')}
            onNavigateToChat={(pid) => {
              setSelectedChatPatientId(pid);
              setActiveTab('messages');
            }}
          />
        )}

        {activeTab === 'queue' && user?.role === 'admin' && (
          <DispatchQueueView
            requests={requests}
            nurses={nurses}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'staff' && (
          <StaffRosterView nurses={nurses} patients={patients} onRefresh={fetchData} />
        )}

      </div>

    </div>
  );
};
