import React, { useState } from 'react';
import { CareSchedule, VitalsRecord, Patient, NurseStaff } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { CaregiverAvailabilityWidget } from './CaregiverAvailabilityWidget.tsx';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Activity,
  HeartHandshake,
  Star,
  Award,
  Stethoscope,
  MapPin,
  User,
  ExternalLink,
  Send,
  Download,
  CalendarCheck,
  History,
  FileCheck2,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface PatientDashboardProps {
  schedules: CareSchedule[];
  records: VitalsRecord[];
  patients: Patient[];
  nurses: NurseStaff[];
  onOpenBooking: () => void;
  onRefresh: () => void;
  onNavigateTab?: (tab: 'schedules' | 'records' | 'staff' | 'messages') => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  schedules,
  records,
  patients,
  nurses,
  onOpenBooking,
  onRefresh,
  onNavigateTab
}) => {
  const { user, token } = useAuth();

  // Active section view within Patient Dashboard
  const [subView, setSubView] = useState<'all' | 'availability' | 'appointments' | 'history' | 'caregiver'>('all');
  
  // Note dialog state
  const [noteModalSchedule, setNoteModalSchedule] = useState<CareSchedule | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [isSendingNote, setIsSendingNote] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState<string | null>(null);

  // Caregiver feedback state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // History search/filter
  const [historySearch, setHistorySearch] = useState('');

  // 1. Identify current patient
  const currentPatient: Patient = 
    patients.find(p => p.id === user?.patientId || p.userId === user?.id) ||
    patients[0] || {
      id: 'patient-1',
      fullName: 'Ramesh Khanna',
      age: 72,
      gender: 'Male',
      diagnosis: 'Acute Ischemic Stroke with Left Hemiparesis, Post-Tracheostomy & Ryle Tube Feeding',
      careType: 'Critical ICU Bedside Nursing (24h Live-in)',
      hubLocation: 'Janak Puri',
      address: 'B-4/112, Janak Puri District Centre, West Delhi - 110058',
      emergencyContact: 'Rajesh Khanna (Son): +91-9876543210',
      attendingPhysician: 'Dr. Vivek Mehra (Senior Neurologist, Max Healthcare)',
      status: 'active',
      assignedNurseId: 'nurse-1',
      assignedNurseName: 'Sister Priya Sharma',
      admissionDate: '2025-08-15'
    };

  // 2. Filter schedules for this patient
  const patientSchedules = schedules.filter(s => 
    s.patientId === currentPatient.id || 
    (user?.role === 'patient' && s.patientId === user.patientId)
  );

  // Upcoming appointments (scheduled or in-progress)
  const upcomingAppointments = patientSchedules
    .filter(s => s.status === 'scheduled' || s.status === 'in-progress')
    .sort((a, b) => new Date(a.shiftDate).getTime() - new Date(b.shiftDate).getTime());

  // Immediate next appointment
  const nextAppointment = upcomingAppointments[0];

  // Service history (completed shifts)
  const serviceHistory = patientSchedules
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.shiftDate).getTime() - new Date(a.shiftDate).getTime());

  const filteredHistory = serviceHistory.filter(s => {
    if (!historySearch.trim()) return true;
    const term = historySearch.toLowerCase();
    return (
      s.shiftDate.toLowerCase().includes(term) ||
      s.nurseName.toLowerCase().includes(term) ||
      s.shiftType.toLowerCase().includes(term) ||
      s.tasks.some(t => t.toLowerCase().includes(term)) ||
      (s.notes && s.notes.toLowerCase().includes(term))
    );
  });

  // 3. Filter patient records
  const patientRecords = records
    .filter(r => r.patientId === currentPatient.id)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  const latestRecord = patientRecords[0];

  // 4. Assigned Caregivers
  // Primary caregiver
  const primaryCaregiver = nurses.find(n => n.id === currentPatient.assignedNurseId) ||
    nurses.find(n => n.id === 'nurse-1') ||
    nurses[0];

  // Secondary/night caregiver
  const secondaryCaregiver = nurses.find(n => n.id === 'nurse-2') || nurses[1];

  // Handle patient note submission to scheduled shift
  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalSchedule || !noteInput.trim()) return;

    setIsSendingNote(true);
    setNoteFeedback(null);
    try {
      const res = await fetch(`/api/schedules/${noteModalSchedule.id}/patient-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: noteInput.trim() })
      });

      if (res.ok) {
        setNoteFeedback('Note sent directly to your assigned nurse!');
        setNoteInput('');
        setTimeout(() => {
          setNoteModalSchedule(null);
          setNoteFeedback(null);
          onRefresh();
        }, 1200);
      } else {
        const data = await res.json();
        setNoteFeedback(data.error || 'Failed to submit note');
      }
    } catch (err: any) {
      setNoteFeedback(err.message || 'Network error');
    } finally {
      setIsSendingNote(false);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSuccess(false);
      setFeedbackComment('');
    }, 1800);
  };

  return (
    <div className="space-y-6">

      {/* Top Welcome & Patient Care Profile Banner */}
      <div className="bg-gradient-to-r from-[#1b3b6f] via-[#234c8a] to-[#00a0e3] rounded-2xl text-white p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 transform skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Care Health Certified Home ICU Protocol</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
              Patient Portal: {currentPatient.fullName}
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              <span className="font-semibold text-white">Diagnosis:</span> {currentPatient.diagnosis}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-blue-100/90 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-200" />
                Age: {currentPatient.age} yrs • {currentPatient.gender}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-200" />
                Hub: {currentPatient.hubLocation} Hub
              </span>
              <span className="flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-200" />
                Doctor: {currentPatient.attendingPhysician.split('(')[0]}
              </span>
              <span className="flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-blue-200" />
                Admitted: {currentPatient.admissionDate}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenBooking}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              id="btn-patient-request-extra-care"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Request Additional Shift / Service</span>
            </button>

            <a
              href="tel:+919999790231"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              id="btn-patient-call-emergency"
            >
              <Phone className="w-4 h-4 text-rose-300" />
              <span>24/7 Clinical Emergency: 9999790231</span>
            </a>

            <button
              onClick={handlePrintSummary}
              className="bg-slate-900/30 hover:bg-slate-900/40 text-blue-100 hover:text-white text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
              title="Print official clinical care summary for doctor consultation"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Care Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics & Latest Vitals Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Next Shift */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Next Scheduled Shift</span>
            <Calendar className="w-4 h-4 text-[#1b3b6f]" />
          </div>
          <div className="text-base sm:text-lg font-bold text-[#1b3b6f] truncate">
            {nextAppointment ? nextAppointment.shiftDate : 'No pending shift'}
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1 mt-1 truncate">
            <Clock className="w-3 h-3 text-[#00a0e3]" />
            <span>{nextAppointment ? `${nextAppointment.startTime} (${nextAppointment.shiftType})` : 'All caught up'}</span>
          </div>
        </div>

        {/* Metric 2: Primary Caregiver */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Assigned Caregiver</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {primaryCaregiver ? primaryCaregiver.fullName : 'Sister Priya Sharma'}
          </div>
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active On Duty • Rating 4.9★</span>
          </div>
        </div>

        {/* Metric 3: Latest Blood Pressure */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Latest Vitals (BP & SpO2)</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {latestRecord ? `${latestRecord.vitals.bpSystolic}/${latestRecord.vitals.bpDiastolic} mmHg` : '122/78 mmHg'}
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
            <span className="text-emerald-600 font-semibold">
              SpO2: {latestRecord ? `${latestRecord.vitals.spO2}%` : '99%'}
            </span>
            <span>• Pulse: {latestRecord ? `${latestRecord.vitals.pulseRate} bpm` : '72 bpm'}</span>
          </div>
        </div>

        {/* Metric 4: Total Service Shifts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Service Care History</span>
            <History className="w-4 h-4 text-[#00a0e3]" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {serviceHistory.length} Completed Shifts
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
            <FileCheck2 className="w-3 h-3 text-emerald-600" />
            <span>{serviceHistory.length * 12}+ Hours of Care Logged</span>
          </div>
        </div>
      </div>

      {/* View Segment Tabs (Overview / Appointments / Service History / Caregiver Profile) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubView('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subView === 'all'
              ? 'bg-[#1b3b6f] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-subview-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setSubView('appointments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subView === 'appointments'
              ? 'bg-[#1b3b6f] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-subview-appointments"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming Appointments ({upcomingAppointments.length})</span>
        </button>

        <button
          onClick={() => setSubView('history')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subView === 'history'
              ? 'bg-[#1b3b6f] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-subview-history"
        >
          <History className="w-3.5 h-3.5" />
          <span>Service History ({serviceHistory.length})</span>
        </button>

        <button
          onClick={() => setSubView('caregiver')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subView === 'caregiver'
              ? 'bg-[#1b3b6f] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-subview-caregiver"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Assigned Caregiver Profile</span>
        </button>

        <button
          onClick={() => setSubView('availability')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subView === 'availability'
              ? 'bg-[#1b3b6f] text-white shadow-sm ring-2 ring-emerald-400/40'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-subview-availability"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Caregiver Live Availability</span>
        </button>
      </div>

      {/* ================= SECTION: CAREGIVER LIVE AVAILABILITY WIDGET ================= */}
      {(subView === 'all' || subView === 'availability') && (
        <CaregiverAvailabilityWidget
          nurses={nurses}
          schedules={schedules}
          onRefresh={onRefresh}
          onOpenBooking={onOpenBooking}
        />
      )}

      {/* ================= SECTION: ASSIGNED CAREGIVER PROFILE DETAILS ================= */}
      {(subView === 'all' || subView === 'caregiver') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#1b3b6f] rounded-lg">
                  <UserCheck className="w-5 h-5 text-[#1b3b6f]" />
                </span>
                <h2 className="text-lg font-bold text-[#1b3b6f]">Assigned Caregiver Profile Details</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Verified, background-checked nursing personnel dedicated to patient care under hospital ICU supervision.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="text-xs font-semibold text-[#1b3b6f] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Rate / Feedback</span>
              </button>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('staff')}
                  className="text-xs font-semibold text-[#00a0e3] hover:underline flex items-center gap-1"
                >
                  <span>View All Staff</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Primary Caregiver Card */}
            {primaryCaregiver && (
              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50/50 to-white hover:border-blue-200 transition shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={primaryCaregiver.avatar}
                        alt={primaryCaregiver.fullName}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full text-[10px]" title="Police Verified & Council Registered">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div>
                      <div className="inline-block bg-blue-100 text-[#1b3b6f] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                        Primary Day Nurse
                      </div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        {primaryCaregiver.fullName}
                      </h3>
                      <div className="text-xs text-slate-500 leading-tight">
                        {primaryCaregiver.qualification}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{primaryCaregiver.rating} Rating (48+ Verified Shifts)</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    On Duty
                  </span>
                </div>

                {/* Verified Credentials Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nursing Council Reg</span>
                    <span className="font-mono font-semibold text-slate-800">{primaryCaregiver.councilRegistrationNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Police Verification ID</span>
                    <span className="font-mono font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {primaryCaregiver.verificationId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Experience</span>
                    <span className="font-semibold text-slate-800">{primaryCaregiver.experienceYears} Years Intensive Care</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hub Office</span>
                    <span className="font-semibold text-slate-800">{primaryCaregiver.hubLocation}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Authorized Bedside Care Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryCaregiver.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-blue-50 text-[#1b3b6f] font-medium px-2 py-0.5 rounded-md border border-blue-100"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact and Direct Assistance */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${primaryCaregiver.phone}`}
                    className="flex-1 bg-[#1b3b6f] hover:bg-[#234c8a] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Nurse</span>
                  </a>

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('messages')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                      title="Open HIPAA-encrypted real-time communication channel"
                      id="btn-caregiver-live-chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Live Chat</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (nextAppointment) {
                        setNoteModalSchedule(nextAppointment);
                      } else if (upcomingAppointments[0]) {
                        setNoteModalSchedule(upcomingAppointments[0]);
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
                    title="Send a special instruction or family note"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#00a0e3]" />
                    <span>Send Note</span>
                  </button>
                </div>
              </div>
            )}

            {/* Secondary/Night Caregiver Card */}
            {secondaryCaregiver && (
              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50/50 to-white hover:border-blue-200 transition shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={secondaryCaregiver.avatar}
                        alt={secondaryCaregiver.fullName}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full text-[10px]" title="Police Verified">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div>
                      <div className="inline-block bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                        Night Shift Caregiver
                      </div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        {secondaryCaregiver.fullName}
                      </h3>
                      <div className="text-xs text-slate-500 leading-tight">
                        {secondaryCaregiver.qualification}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{secondaryCaregiver.rating} Rating (35+ Verified Shifts)</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-purple-600" />
                    Scheduled Night
                  </span>
                </div>

                {/* Verified Credentials Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nursing Council Reg</span>
                    <span className="font-mono font-semibold text-slate-800">{secondaryCaregiver.councilRegistrationNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Police Verification ID</span>
                    <span className="font-mono font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {secondaryCaregiver.verificationId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Experience</span>
                    <span className="font-semibold text-slate-800">{secondaryCaregiver.experienceYears} Years Hospital Bedside</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Shift Capability</span>
                    <span className="font-semibold text-slate-800">{secondaryCaregiver.shiftAvailability}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Authorized Bedside Care Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryCaregiver.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-purple-50 text-purple-800 font-medium px-2 py-0.5 rounded-md border border-purple-100"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact and Direct Assistance */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${secondaryCaregiver.phone}`}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Caregiver ({secondaryCaregiver.phone})</span>
                  </a>

                  <button
                    onClick={() => {
                      const nightSched = upcomingAppointments.find(s => s.shiftType.includes('Night'));
                      if (nightSched) setNoteModalSchedule(nightSched);
                      else if (nextAppointment) setNoteModalSchedule(nextAppointment);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    <span>Send Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SECTION: UPCOMING APPOINTMENTS & CARE SHIFTS ================= */}
      {(subView === 'all' || subView === 'appointments') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#1b3b6f] rounded-lg">
                  <Calendar className="w-5 h-5 text-[#1b3b6f]" />
                </span>
                <h2 className="text-lg font-bold text-[#1b3b6f]">Upcoming Appointments &amp; Scheduled Shifts</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Confirmed nursing schedules, planned clinical interventions, and scheduled duty handovers.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="text-xs font-bold text-white bg-[#00a0e3] hover:bg-[#008cc7] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Book Additional Caregiver Shift</span>
            </button>
          </div>

          {/* Immediate Next Appointment Spotlight Card */}
          {nextAppointment ? (
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1b3b6f] text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Next Immediate Visit
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    nextAppointment.status === 'in-progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    ● {nextAppointment.status === 'in-progress' ? 'Shift In-Progress Right Now' : 'Confirmed & Scheduled'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#1b3b6f]" />
                  <span>Date: <strong className="text-slate-900">{nextAppointment.shiftDate}</strong></span>
                  <span className="mx-1">•</span>
                  <Clock className="w-4 h-4 text-[#00a0e3]" />
                  <span>{nextAppointment.startTime} - {nextAppointment.endTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Attending Nurse */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200/70 flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Attending Nurse</span>
                    <span className="text-xs font-bold text-slate-900">{nextAppointment.nurseName}</span>
                    <span className="text-[11px] text-slate-500 block">{nextAppointment.shiftType}</span>
                  </div>
                </div>

                {/* Patient & Care Plan */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200/70 flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-[#1b3b6f] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Service Plan</span>
                    <span className="text-xs font-bold text-slate-900">{currentPatient.careType}</span>
                    <span className="text-[11px] text-slate-500 block">Hub: {currentPatient.hubLocation} Hub</span>
                  </div>
                </div>

                {/* Coordinator Note Action */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200/70 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Need Special Attention?</span>
                    <span className="text-xs text-slate-600">Send notes to nurse on arrival</span>
                  </div>
                  <button
                    onClick={() => setNoteModalSchedule(nextAppointment)}
                    className="bg-[#1b3b6f] hover:bg-[#234c8a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>

              {/* Scheduled Clinical Duties checklist */}
              <div className="bg-white p-4 rounded-lg border border-slate-200/70 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Scheduled Nursing Duties &amp; Care Procedures for this Shift:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {nextAppointment.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a0e3] mt-1.5 shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
                {nextAppointment.notes && (
                  <div className="text-xs bg-amber-50 text-amber-900 p-2.5 rounded border border-amber-200 mt-2">
                    <strong className="font-bold">Clinical Care Note: </strong>
                    <span className="whitespace-pre-line">{nextAppointment.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No upcoming appointments on schedule. Click "Book Additional Caregiver Shift" to reserve a qualified nurse.
            </div>
          )}

          {/* Subsequent Scheduled Appointments List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[#00a0e3]" />
              Subsequent Scheduled Appointments &amp; Shift Calendar ({upcomingAppointments.length} total)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Shift Date</th>
                    <th className="px-4 py-3">Time &amp; Type</th>
                    <th className="px-4 py-3">Assigned Caregiver</th>
                    <th className="px-4 py-3">Planned Interventions</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Family Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {upcomingAppointments.map((sched) => (
                    <tr key={sched.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {sched.shiftDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{sched.startTime} - {sched.endTime}</div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                          {sched.shiftType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{sched.nurseName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {sched.tasks.slice(0, 2).map((t, idx) => (
                            <li key={idx} className="truncate">{t}</li>
                          ))}
                          {sched.tasks.length > 2 && (
                            <li className="text-slate-400 italic">+{sched.tasks.length - 2} more duties</li>
                          )}
                        </ul>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sched.status === 'in-progress'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {sched.status === 'in-progress' ? 'In-Progress' : 'Confirmed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setNoteModalSchedule(sched)}
                          className="text-[11px] font-semibold text-[#1b3b6f] hover:text-[#00a0e3] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition"
                        >
                          + Add Note
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION: SERVICE HISTORY & CLINICAL CARE LOGS ================= */}
      {(subView === 'all' || subView === 'history') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-[#1b3b6f] rounded-lg">
                  <History className="w-5 h-5 text-[#1b3b6f]" />
                </span>
                <h2 className="text-lg font-bold text-[#1b3b6f]">Service History &amp; Completed Care Records</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full chronological ledger of home visits, completed nursing tasks, clinical vitals, and physician instruction audits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search history by date or task..."
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1b3b6f]"
              />
              <button
                onClick={handlePrintSummary}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* History Cards / Timeline */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((shift) => {
                // Find matching vitals record for this shift date
                const matchingRecord = patientRecords.find(r => r.recordedAt.startsWith(shift.shiftDate));

                return (
                  <div
                    key={shift.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition space-y-3 bg-slate-50/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>Date: {shift.shiftDate}</span>
                            <span className="text-[11px] font-normal text-slate-500">
                              ({shift.shiftType} • {shift.startTime} to {shift.endTime})
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Attending Nurse: <strong className="text-slate-800">{shift.nurseName}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Shift Completed &amp; Audited
                        </span>
                      </div>
                    </div>

                    {/* Tasks Performed */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 block">Procedures &amp; Duties Executed:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {shift.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attending Nurse Note */}
                    {shift.notes && (
                      <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-xs text-slate-700">
                        <div className="font-bold text-[#1b3b6f] text-[11px] uppercase mb-0.5">Nurse Handover &amp; Clinical Observation:</div>
                        <p className="whitespace-pre-line">{shift.notes}</p>
                      </div>
                    )}

                    {/* Linked Clinical Vitals Record Snapshot (if recorded on this date) */}
                    {matchingRecord && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-rose-500" />
                            Recorded Bedside Vitals at Handover
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 truncate max-w-xs">
                            Hash: {matchingRecord.hashSignature}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div className="bg-slate-50 p-2 rounded text-center">
                            <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                            <span className="font-bold text-slate-900">{matchingRecord.vitals.bpSystolic}/{matchingRecord.vitals.bpDiastolic}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center">
                            <span className="text-[10px] text-slate-400 block font-semibold">SpO2</span>
                            <span className="font-bold text-emerald-700">{matchingRecord.vitals.spO2}%</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center">
                            <span className="text-[10px] text-slate-400 block font-semibold">Pulse</span>
                            <span className="font-bold text-slate-900">{matchingRecord.vitals.pulseRate} bpm</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center">
                            <span className="text-[10px] text-slate-400 block font-semibold">Blood Sugar</span>
                            <span className="font-bold text-slate-900">
                              {matchingRecord.vitals.bloodGlucoseMgDl ? `${matchingRecord.vitals.bloodGlucoseMgDl} mg/dL` : '136 mg/dL'}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center">
                            <span className="text-[10px] text-slate-400 block font-semibold">Temp</span>
                            <span className="font-bold text-slate-900">{matchingRecord.vitals.temperatureF}°F</span>
                          </div>
                        </div>

                        {matchingRecord.medicationsAdministered && matchingRecord.medicationsAdministered.length > 0 && (
                          <div className="text-[11px] text-slate-600 pt-1">
                            <span className="font-bold text-slate-700">Medications Given: </span>
                            {matchingRecord.medicationsAdministered.map(m => `${m.name} (${m.dosage})`).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No matching service history records found.
            </div>
          )}
        </div>
      )}

      {/* Emergency Protocols & Contact Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Patient Care Continuity &amp; Doctor Escalation Protocol
            </h3>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              In case of sudden vitals alteration (BP systolic &gt; 160 mmHg, SpO2 &lt; 92%, or stoma blockage), our nurse initiates oxygen concentrator standby and contacts Dr. Vivek Mehra and Care Health 24/7 central clinical dispatcher immediately.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919999790231"
              className="bg-[#1b3b6f] hover:bg-[#234c8a] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Hub Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal: Send Note to Nurse / Attendant */}
      {noteModalSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-150">
            <div className="bg-[#1b3b6f] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Send Instruction to Assigned Caregiver</h3>
                <p className="text-xs text-blue-100">
                  Shift: {noteModalSchedule.shiftDate} ({noteModalSchedule.shiftType})
                </p>
              </div>
              <button
                onClick={() => setNoteModalSchedule(null)}
                className="text-white/80 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendNote} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Nurse:
                </label>
                <div className="text-xs bg-slate-100 p-2.5 rounded-lg font-semibold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{noteModalSchedule.nurseName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Family Instructions / Requests:
                </label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Please give warm water before afternoon feed, or Dr. Mehra will call on mobile at 4 PM..."
                  rows={4}
                  required
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1b3b6f] text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {noteFeedback && (
                <div className={`text-xs p-2.5 rounded-lg ${
                  noteFeedback.includes('sent directly')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {noteFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalSchedule(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingNote || !noteInput.trim()}
                  className="bg-[#1b3b6f] hover:bg-[#234c8a] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingNote ? 'Sending...' : 'Transmit Note to Nurse'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rate & Feedback for Caregiver */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#1b3b6f] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Rate Your Assigned Caregiver</h3>
                <p className="text-xs text-blue-100">
                  Sister Priya Sharma &amp; Care Team
                </p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-white/80 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Quality of Bedside Nursing Care:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 text-2xl transition hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= feedbackRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {feedbackRating === 5 ? '5.0 - Exceptional Care' : `${feedbackRating}.0 Stars`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Family Feedback / Appreciation:
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your appreciation or feedback for the nurse..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1b3b6f] text-slate-800"
                />
              </div>

              {feedbackSuccess && (
                <div className="text-xs p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Thank you! Your feedback has been recorded and submitted to Care Health clinical quality supervisor.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={feedbackSuccess}
                  className="bg-[#1b3b6f] hover:bg-[#234c8a] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
