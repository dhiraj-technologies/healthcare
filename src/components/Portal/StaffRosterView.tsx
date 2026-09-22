import React, { useState } from 'react';
import { NurseStaff, Patient } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ShieldCheck,
  Award,
  Star,
  Phone,
  MapPin,
  Stethoscope,
  UserCheck,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  Building,
  Heart
} from 'lucide-react';

interface StaffRosterViewProps {
  nurses: NurseStaff[];
  patients?: Patient[];
  onRefresh?: () => void;
}

export const StaffRosterView: React.FC<StaffRosterViewProps> = ({ nurses, patients = [], onRefresh }) => {
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [hubFilter, setHubFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<NurseStaff | null>(null);
  const [nurseToProvide, setNurseToProvide] = useState<NurseStaff | null>(null);
  const [isProviding, setIsProviding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [qualification, setQualification] = useState('B.Sc Nursing, ICU & Critical Care Diploma');
  const [experienceYears, setExperienceYears] = useState('5');
  const [phone, setPhone] = useState('+91 99997 90231');
  const [verificationId, setVerificationId] = useState('');
  const [councilRegistrationNo, setCouncilRegistrationNo] = useState('');
  const [hubLocation, setHubLocation] = useState('Janak Puri');
  const [specialtiesInput, setSpecialtiesInput] = useState('Tracheostomy Care, ICU Management, IV Catheter, BiPAP');
  const [shiftAvailability, setShiftAvailability] = useState('12h Day / 12h Night');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1594824813524-2c7003f56b3b?auto=format&fit=crop&w=400&q=80');

  const filteredNurses = nurses.filter((n) => {
    const matchesSearch =
      n.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesHub = hubFilter === 'all' || n.hubLocation.toLowerCase().includes(hubFilter.toLowerCase());
    return matchesSearch && matchesHub;
  });

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Full name and phone are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const specialties = specialtiesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/nurses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          qualification,
          experienceYears: Number(experienceYears) || 3,
          phone,
          verificationId: verificationId || `DL-POL-${Math.floor(100000 + Math.random() * 900000)}`,
          councilRegistrationNo: councilRegistrationNo || `DNC-${Math.floor(10000 + Math.random() * 90000)}`,
          hubLocation,
          specialties: specialties.length > 0 ? specialties : ['Bedside Care', 'Vitals Monitoring'],
          shiftAvailability,
          avatar
        })
      });

      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Staff member "${fullName}" added successfully.` });
        setIsAddModalOpen(false);
        // Reset form
        setFullName('');
        setVerificationId('');
        setCouncilRegistrationNo('');
        if (onRefresh) onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to add staff member' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error adding staff' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/nurses/${staffToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Staff member "${staffToDelete.fullName}" removed from roster.` });
        setStaffToDelete(null);
        if (onRefresh) onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to remove staff member' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error removing staff' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProvideNurseToPatient = async (nurseId: string, patientId: string) => {
    setIsProviding(true);
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
          assignedNurseName: nurse?.fullName || 'Assigned Nurse'
        })
      });

      if (res.ok) {
        setFeedbackMsg({
          type: 'success',
          text: `Nurse "${nurse?.fullName}" successfully provided & assigned to patient.`
        });
        setNurseToProvide(null);
        if (onRefresh) onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to assign nurse' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error assigning nurse' });
    } finally {
      setIsProviding(false);
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

      {/* Top Banner & Action Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base font-heading">
              Verified Clinical Staff Roster &amp; Credentials
            </h3>
            <span className="text-xs bg-[#e6f0fa] text-[#006591] px-2.5 py-0.5 rounded-full font-bold">
              {filteredNurses.length} Staff on Roster
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Delhi Nursing Council (DNC) registered nurses, ICU technicians, and police-verified attendants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search nurse, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#28568d] w-44 sm:w-52"
            />
          </div>

          {/* Hub Filter */}
          <select
            value={hubFilter}
            onChange={(e) => setHubFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Hub Locations</option>
            <option value="Janak Puri">Janak Puri (West)</option>
            <option value="Noida">Noida (Sector 62)</option>
            <option value="Indirapuram">Indirapuram (Ghaziabad)</option>
            <option value="Laxmi Nagar">Laxmi Nagar (East)</option>
          </select>

          {/* Admin Add Staff Button */}
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#28568d] hover:bg-[#1b3b6f] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition"
              id="btn-add-staff"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNurses.map((nurse) => (
          <div
            key={nurse.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            id={`staff-card-${nurse.id}`}
          >
            <div>
              {/* Header with Photo, Name & Remove Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={nurse.avatar}
                    alt={nurse.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-base text-[#1b3b6f]">
                        {nurse.fullName}
                      </h4>
                      <span title="Delhi Police Clearance Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    </div>
                    <p className="text-xs text-[#006591] font-semibold leading-tight">
                      {nurse.qualification}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{nurse.experienceYears} Years Exp.</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {nurse.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Remove Button */}
                {isAdmin && (
                  <button
                    onClick={() => setStaffToDelete(nurse)}
                    title="Remove Staff Member from Roster"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    id={`btn-remove-staff-${nurse.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Credentialing Details */}
              <div className="mt-3 bg-[#f8fafc] p-3 rounded-lg border border-slate-200/60 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Council Reg No:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {nurse.councilRegistrationNo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Police Verification:</span>
                  <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {nurse.verificationId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Base Hub:</span>
                  <span className="text-slate-800 font-medium">{nurse.hubLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shift Availability:</span>
                  <span className="text-[#006591] font-semibold">{nurse.shiftAvailability}</span>
                </div>
              </div>

              {/* Specialties Chips */}
              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Clinical Competencies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {nurse.specialties.map((s, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Status & Contact */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Active Cases: <strong className="text-slate-800">{nurse.activeCases}</strong>
              </span>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setNurseToProvide(nurse)}
                    className="bg-blue-50 hover:bg-blue-100 text-[#006591] font-bold text-[11px] px-2 py-1 rounded-md border border-blue-200 transition flex items-center gap-1"
                    id={`btn-provide-nurse-to-patient-${nurse.id}`}
                  >
                    <UserPlus className="w-3 h-3 text-[#00a0e3]" />
                    <span>Provide to Patient</span>
                  </button>
                )}

                <a
                  href={`tel:${nurse.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-[#00a0e3] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{nurse.phone}</span>
                </a>
              </div>
            </div>

          </div>
        ))}

        {filteredNurses.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No Staff Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              No staff members matched your current filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00a0e3]" />
                <h4 className="font-bold text-sm sm:text-base">Register New Clinical Staff</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sister Ananya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99997 90231"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Clinical Qualification</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="B.Sc Nursing, ICU & Critical Care Diploma">B.Sc Nursing, ICU &amp; Critical Care Diploma</option>
                  <option value="GNM (General Nursing & Midwifery), Critical Care">GNM (General Nursing &amp; Midwifery), Critical Care</option>
                  <option value="Post-Basic B.Sc Nursing, Cardiac Specialist">Post-Basic B.Sc Nursing, Cardiac Specialist</option>
                  <option value="Certified Male Patient Care Attendant">Certified Male Patient Care Attendant</option>
                  <option value="Certified Female Patient Care Attendant">Certified Female Patient Care Attendant</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assigned Base Hub</label>
                  <select
                    value={hubLocation}
                    onChange={(e) => setHubLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Janak Puri">Janak Puri (West Delhi)</option>
                    <option value="Noida">Noida (Sector 62)</option>
                    <option value="Indirapuram">Indirapuram (Ghaziabad)</option>
                    <option value="Laxmi Nagar">Laxmi Nagar (East Delhi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Delhi Police Verification ID</label>
                  <input
                    type="text"
                    placeholder="e.g. DL-POL-982415 (auto if blank)"
                    value={verificationId}
                    onChange={(e) => setVerificationId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nursing Council Reg No</label>
                  <input
                    type="text"
                    placeholder="e.g. DNC-41892 (auto if blank)"
                    value={councilRegistrationNo}
                    onChange={(e) => setCouncilRegistrationNo(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Shift Availability</label>
                <select
                  value={shiftAvailability}
                  onChange={(e) => setShiftAvailability(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="12h Day / 12h Night">12h Day / 12h Night (Rotational)</option>
                  <option value="12h Day Only">12h Day Shift Only (08:00 AM – 08:00 PM)</option>
                  <option value="12h Night Only">12h Night Shift Only (08:00 PM – 08:00 AM)</option>
                  <option value="24h Live-in Bedside">24h Live-in Bedside Care</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Specialties (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Tracheostomy, BiPAP, Infusion Pump, Bed-sore Prevention"
                  value={specialtiesInput}
                  onChange={(e) => setSpecialtiesInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Profile Photo URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-600"
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
                  id="btn-confirm-add-staff"
                >
                  {isSubmitting ? 'Registering...' : 'Register Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-base text-slate-800">
                Remove Staff Member from Roster?
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to remove{' '}
                <strong className="text-slate-800">{staffToDelete.fullName}</strong> ({staffToDelete.qualification})?
                This will unassign them from future shifts and remove their active credential record.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteStaff}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition disabled:opacity-50"
                id="btn-confirm-delete-staff"
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove Staff'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provide Nurse to Patient Modal */}
      {nurseToProvide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00a0e3]" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Provide &amp; Deploy Nurse to Patient</h4>
                  <p className="text-xs text-slate-300">
                    Deploying: {nurseToProvide.fullName} ({nurseToProvide.qualification})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNurseToProvide(null)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 text-xs text-slate-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1b3b6f]">Deployment Target:</strong> Select an active patient in need of home nursing care or clinical ICU bedside coverage.
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active Patients in Registry ({patients.length})
                </h5>

                <div className="grid grid-cols-1 gap-2.5">
                  {patients.map((pat) => {
                    const isAlreadyAssigned = pat.assignedNurseId === nurseToProvide.id;
                    return (
                      <div
                        key={pat.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isAlreadyAssigned
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h6 className="font-bold text-sm text-[#1b3b6f]">
                              {pat.fullName}
                            </h6>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                              {pat.age} Yrs • {pat.gender}
                            </span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                              {pat.hubLocation}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-[#00a0e3]" />
                            <span className="font-semibold">{pat.careType}</span>
                            <span>•</span>
                            <span className="text-slate-500 line-clamp-1">{pat.diagnosis}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Current Nurse: <strong className="text-slate-700">{pat.assignedNurseName || 'Unassigned'}</strong>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <button
                            type="button"
                            disabled={isProviding || isAlreadyAssigned}
                            onClick={() => handleProvideNurseToPatient(nurseToProvide.id, pat.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 ${
                              isAlreadyAssigned
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-[#00a0e3] hover:bg-[#008fcb] text-white disabled:opacity-50'
                            }`}
                            id={`btn-deploy-to-patient-${pat.id}`}
                          >
                            {isAlreadyAssigned ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Currently Assigned</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Assign Nurse</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {patients.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No patients currently registered in the system.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setNurseToProvide(null)}
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
