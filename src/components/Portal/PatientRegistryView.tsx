import React, { useState } from 'react';
import { Patient, NurseStaff } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  UserPlus,
  Trash2,
  Search,
  MapPin,
  Stethoscope,
  Phone,
  Shield,
  Activity,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Calendar,
  Building,
  Heart,
  MessageSquare
} from 'lucide-react';

interface PatientRegistryViewProps {
  patients: Patient[];
  nurses: NurseStaff[];
  onRefresh: () => void;
  onNavigateToRecords?: (patientId: string) => void;
  onNavigateToChat?: (patientId: string) => void;
}

export const PatientRegistryView: React.FC<PatientRegistryViewProps> = ({
  patients,
  nurses,
  onRefresh,
  onNavigateToRecords,
  onNavigateToChat
}) => {
  const { user, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [hubFilter, setHubFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToAssignNurse, setPatientToAssignNurse] = useState<Patient | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Patient Form fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('65');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [diagnosis, setDiagnosis] = useState('');
  const [careType, setCareType] = useState('Critical Home ICU Care');
  const [hubLocation, setHubLocation] = useState<'Janak Puri' | 'Noida' | 'Indirapuram' | 'Laxmi Nagar'>('Janak Puri');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [attendingPhysician, setAttendingPhysician] = useState('');
  const [assignedNurseId, setAssignedNurseId] = useState('');

  const isAdmin = user?.role === 'admin';

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.attendingPhysician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHub = hubFilter === 'all' || p.hubLocation === hubFilter;
    return matchesSearch && matchesHub;
  });

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !diagnosis.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Patient name and diagnosis are required.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          age: Number(age) || 60,
          gender,
          diagnosis,
          careType,
          hubLocation,
          address,
          emergencyContact,
          attendingPhysician,
          assignedNurseId: assignedNurseId || undefined
        })
      });

      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Patient "${fullName}" added successfully.` });
        setIsAddModalOpen(false);
        // Reset form
        setFullName('');
        setDiagnosis('');
        setAddress('');
        setEmergencyContact('');
        setAttendingPhysician('');
        setAssignedNurseId('');
        onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to add patient' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error adding patient' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/patients/${patientToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Patient record for "${patientToDelete.fullName}" has been removed.` });
        setPatientToDelete(null);
        onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to remove patient' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error removing patient' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignNurse = async (patientId: string, nurseId: string) => {
    setIsAssigning(true);
    try {
      const nurse = nurses.find(n => n.id === nurseId);
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          assignedNurseId: nurseId,
          assignedNurseName: nurse ? nurse.fullName : 'Assigned Nurse'
        })
      });

      if (res.ok) {
        setFeedbackMsg({
          type: 'success',
          text: `Nurse "${nurse?.fullName}" successfully provided & assigned to patient.`
        });
        setPatientToAssignNurse(null);
        onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to assign nurse' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error assigning nurse' });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Controls & Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-800 text-base font-heading">
              Patient Registry &amp; Admission Records
            </h3>
            <span className="text-xs bg-[#e6f0fa] text-[#006591] px-2 py-0.5 rounded-full font-bold">
              {filteredPatients.length} Active Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive patient medical directory, primary diagnoses, attending doctors, and assigned nursing staff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#28568d] w-48 sm:w-56"
            />
          </div>

          {/* Hub Filter */}
          <select
            value={hubFilter}
            onChange={(e) => setHubFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Delhi NCR Hubs</option>
            <option value="Janak Puri">Janak Puri (West)</option>
            <option value="Noida">Noida (Sector 62)</option>
            <option value="Indirapuram">Indirapuram (Ghaziabad)</option>
            <option value="Laxmi Nagar">Laxmi Nagar (East)</option>
          </select>

          {/* Admin Add Patient Button */}
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#28568d] hover:bg-[#1b3b6f] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition"
              id="btn-add-patient"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit / Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
            id={`patient-card-${patient.id}`}
          >
            <div>
              {/* Header with Name & Actions */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-[#1b3b6f]">
                      {patient.fullName}
                    </h4>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {patient.age} Yrs • {patient.gender}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-200">
                      {patient.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#006591] font-semibold mt-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#00a0e3]" />
                    <span>{patient.careType}</span>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <button
                    onClick={() => setPatientToDelete(patient)}
                    title="Remove Patient Record"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    id={`btn-remove-patient-${patient.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Diagnosis Box */}
              <div className="mt-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-xs">
                <span className="text-[10px] font-bold text-[#163A6B] uppercase tracking-wider block mb-0.5">
                  Clinical Diagnosis &amp; Care Protocol:
                </span>
                <span className="font-semibold text-slate-800">{patient.diagnosis}</span>
              </div>

              {/* Details List */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong>Hub:</strong> {patient.hubLocation}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong>Physician:</strong> {patient.attendingPhysician}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    <strong>Assigned:</strong> {patient.assignedNurseName || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    <strong>Admitted:</strong> {patient.admissionDate}
                  </span>
                </div>
              </div>

              {patient.address && (
                <div className="mt-2 text-[11px] text-slate-500 truncate">
                  <strong>Address:</strong> {patient.address}
                </div>
              )}

              {patient.emergencyContact && (
                <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#00a0e3]" />
                  <span>
                    <strong>Emergency:</strong> {patient.emergencyContact}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[10px]">
                  ID: {patient.id}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => setPatientToAssignNurse(patient)}
                    className="text-[11px] font-bold text-[#006591] hover:text-[#004e70] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition flex items-center gap-1"
                    id={`btn-provide-nurse-${patient.id}`}
                  >
                    <UserCheck className="w-3 h-3 text-[#00a0e3]" />
                    <span>{patient.assignedNurseId ? 'Reassign / Provide Nurse' : 'Provide Nurse'}</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onNavigateToChat && (
                  <button
                    onClick={() => onNavigateToChat(patient.id)}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition"
                    id={`btn-chat-patient-${patient.id}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secure Chat</span>
                  </button>
                )}
                {onNavigateToRecords && (
                  <button
                    onClick={() => onNavigateToRecords(patient.id)}
                    className="text-xs text-[#006591] hover:text-[#004e70] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#00a0e3]" />
                    <span>View Clinical Logs</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No Patients Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or add a new patient to the registry.
            </p>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00a0e3]" />
                <h4 className="font-bold text-sm sm:text-base">Admit / Add New Patient</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Khanna"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs px-2 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Medical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Post-Stroke Hemiplegia, Tracheostomy &amp; BiPAP Support"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Care Type</label>
                  <select
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Critical Home ICU Care">Critical Home ICU Care</option>
                    <option value="Post-Operative Recovery">Post-Operative Recovery</option>
                    <option value="Elderly Bedside Attendant">Elderly Bedside Attendant</option>
                    <option value="Palliative &amp; Oncology Care">Palliative &amp; Oncology Care</option>
                    <option value="Tracheostomy &amp; Ryle Tube Management">Tracheostomy &amp; Ryle Tube Management</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Delhi NCR Regional Hub *</label>
                  <select
                    value={hubLocation}
                    onChange={(e) => setHubLocation(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Janak Puri">Janak Puri (West Delhi Hub)</option>
                    <option value="Noida">Noida (Sector 62 Hub)</option>
                    <option value="Indirapuram">Indirapuram (Ghaziabad Hub)</option>
                    <option value="Laxmi Nagar">Laxmi Nagar (East Delhi Hub)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Attending Physician / Hospital</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Vivek Mehra (Max Super Speciality)"
                    value={attendingPhysician}
                    onChange={(e) => setAttendingPhysician(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assign Primary Nurse / Attendant</label>
                  <select
                    value={assignedNurseId}
                    onChange={(e) => setAssignedNurseId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">Unassigned (Assign Later)</option>
                    {nurses.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.fullName} ({n.qualification})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Patient Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. C-48, Janak Puri, New Delhi 110058"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Emergency Family Contact Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98112 34567"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#28568d] hover:bg-[#1b3b6f] rounded-lg transition shadow disabled:opacity-50"
                  id="btn-confirm-add-patient"
                >
                  {isSubmitting ? 'Admitting...' : 'Confirm Patient Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Patient Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-base text-slate-800">
                Remove Patient Record?
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to remove the record for{' '}
                <strong className="text-slate-800">{patientToDelete.fullName}</strong>?
                This will discharge the patient from active duty and remove their profile.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePatient}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition disabled:opacity-50"
                id="btn-confirm-delete-patient"
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove Patient'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provide / Assign Nurse Modal */}
      {patientToAssignNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#00a0e3]" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Provide &amp; Assign Verified Nurse</h4>
                  <p className="text-xs text-slate-300">
                    Patient: {patientToAssignNurse.fullName} ({patientToAssignNurse.careType})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPatientToAssignNurse(null)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 text-xs text-slate-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#00a0e3] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1b3b6f]">Clinical Matching:</strong> Select a verified, council-registered nurse matching the patient's care protocol ({patientToAssignNurse.diagnosis}) in {patientToAssignNurse.hubLocation}.
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Verified Nurses ({nurses.length})
                </h5>

                <div className="grid grid-cols-1 gap-2.5">
                  {nurses.map((nurse) => {
                    const isCurrentlyAssigned = patientToAssignNurse.assignedNurseId === nurse.id;
                    return (
                      <div
                        key={nurse.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isCurrentlyAssigned
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={nurse.avatar}
                            alt={nurse.fullName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h6 className="font-bold text-sm text-[#1b3b6f]">
                                {nurse.fullName}
                              </h6>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                {nurse.experienceYears} Yrs Exp
                              </span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Police Verified
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {nurse.qualification} • {nurse.hubLocation}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {nurse.specialties.slice(0, 3).map((spec, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] bg-blue-50 text-[#006591] px-1.5 py-0.2 rounded border border-blue-100 font-semibold"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <button
                            type="button"
                            disabled={isAssigning || isCurrentlyAssigned}
                            onClick={() => handleAssignNurse(patientToAssignNurse.id, nurse.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 ${
                              isCurrentlyAssigned
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-[#00a0e3] hover:bg-[#008fcb] text-white disabled:opacity-50'
                            }`}
                            id={`btn-select-nurse-${nurse.id}`}
                          >
                            {isCurrentlyAssigned ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Current Nurse</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Assign Nurse</span>
                              </>
                            )}
                          </button>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Shift: {nurse.shiftAvailability}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPatientToAssignNurse(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
