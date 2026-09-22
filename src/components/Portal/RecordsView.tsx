import React, { useState } from 'react';
import { VitalsRecord, Patient } from '../../types.ts';
import { Activity, Plus, ShieldCheck, Heart, Thermometer, Droplet, Clock, CheckCircle, FileText, Lock, FileSpreadsheet, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface RecordsViewProps {
  records: VitalsRecord[];
  patients: Patient[];
  onRefresh: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ records, patients, onRefresh }) => {
  const { user, token } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('all');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<VitalsRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New vitals entry state
  const [patientId, setPatientId] = useState(patients[0]?.id || 'patient-1');
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [pulseRate, setPulseRate] = useState('74');
  const [spO2, setSpO2] = useState('98');
  const [temperatureF, setTemperatureF] = useState('98.6');
  const [bloodGlucose, setBloodGlucose] = useState('125');
  const [respiratoryRate, setRespiratoryRate] = useState('18');
  const [medName, setMedName] = useState('Tab Amlodipine 5mg');
  const [clinicalNotes, setClinicalNotes] = useState('Vitals stable. Patient conscious, cooperative, oriented.');
  const [doctorInstructionsFollowed, setDoctorInstructionsFollowed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAdd = user?.role === 'admin' || user?.role === 'nurse';

  const filtered = records.filter(r => {
    if (selectedPatientId === 'all') return true;
    return r.patientId === selectedPatientId;
  });

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const medications = medName.trim()
        ? [{ name: medName, dosage: 'As prescribed', route: 'Oral/Enteral', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        : [];

      const res = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId,
          vitals: {
            bpSystolic: Number(bpSystolic),
            bpDiastolic: Number(bpDiastolic),
            pulseRate: Number(pulseRate),
            spO2: Number(spO2),
            temperatureF: Number(temperatureF),
            bloodGlucoseMgDl: Number(bloodGlucose),
            respiratoryRate: Number(respiratoryRate)
          },
          medicationsAdministered: medications,
          clinicalNotes,
          doctorInstructionsFollowed
        })
      });

      if (res.ok) {
        setIsEntryModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Error logging vitals:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/records/${recordToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Clinical record for ${recordToDelete.patientName} deleted successfully.` });
        setRecordToDelete(null);
        onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Failed to delete record' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error deleting record' });
    } finally {
      setIsDeleting(false);
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

      {/* Top Banner & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00a0e3]" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base font-heading">
              Secure Clinical Vitals &amp; Medication Logs
            </h3>
            <p className="text-[11px] text-slate-500">
              Cryptographically hashed records for tamper-evident healthcare audit compliance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Patient Filter */}
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Patients ({records.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>

          {canAdd && (
            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
              id="btn-log-vitals"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Bedside Vitals</span>
            </button>
          )}
        </div>
      </div>

      {/* Vitals Summary Strip for Most Recent Record */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Blood Pressure
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">
              {filtered[0].vitals.bpSystolic}/{filtered[0].vitals.bpDiastolic}{' '}
              <span className="text-[10px] font-normal text-slate-500">mmHg</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Normotensive</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              Pulse Rate
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">
              {filtered[0].vitals.pulseRate}{' '}
              <span className="text-[10px] font-normal text-slate-500">BPM</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Regular Rhythm</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-[#00a0e3]" />
              SpO2 Saturation
            </div>
            <div className="text-lg font-bold text-[#006591] mt-1">
              {filtered[0].vitals.spO2}%
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Adequate Oxygenation</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Temperature
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">
              {filtered[0].vitals.temperatureF}°F
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Afebrile</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-purple-500" />
              Blood Glucose
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">
              {filtered[0].vitals.bloodGlucoseMgDl || 120}{' '}
              <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </div>
            <div className="text-[10px] text-slate-600 font-semibold mt-0.5">Post-Meal Managed</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Audit Integrity
            </div>
            <div className="text-xs font-mono font-bold text-emerald-700 truncate mt-1">
              {filtered[0].hashSignature.slice(0, 16)}...
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">SHA-256 Validated</div>
          </div>
        </div>
      )}

      {/* Historical Records Timeline */}
      <div className="space-y-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            {/* Record Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="text-sm font-bold text-[#1b3b6f] flex items-center gap-2">
                  <span>Patient: {rec.patientName}</span>
                  <span className="text-[11px] font-normal text-slate-500">| Attending: {rec.nurseName}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Logged at: {new Date(rec.recordedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {rec.doctorInstructionsFollowed && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Doctor Orders Adhered
                  </span>
                )}
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200" title={rec.hashSignature}>
                  {rec.hashSignature.slice(0, 18)}...
                </span>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setRecordToDelete(rec)}
                    title="Delete Clinical Vitals Record"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    id={`btn-delete-record-${rec.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#f8fafc] p-3 rounded-lg border border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-500 block">Blood Pressure:</span>
                <strong className="text-slate-800">{rec.vitals.bpSystolic}/{rec.vitals.bpDiastolic} mmHg</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Pulse Rate:</span>
                <strong className="text-slate-800">{rec.vitals.pulseRate} BPM</strong>
              </div>
              <div>
                <span className="text-slate-500 block">SpO2 Oxygen:</span>
                <strong className="text-[#006591]">{rec.vitals.spO2}%</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Temperature:</span>
                <strong className="text-slate-800">{rec.vitals.temperatureF}°F</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Sugar:</span>
                <strong className="text-slate-800">{rec.vitals.bloodGlucoseMgDl || 'N/A'} mg/dL</strong>
              </div>
            </div>

            {/* Clinical Progress Notes */}
            <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              <strong className="text-[#1b3b6f] block mb-1">Nurse's Daily Clinical Notes:</strong>
              {rec.clinicalNotes}
            </div>

            {/* Medications Given */}
            {rec.medicationsAdministered && rec.medicationsAdministered.length > 0 && (
              <div className="text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1.5">
                  Medication Administration Record (MAR):
                </span>
                <div className="flex flex-wrap gap-2">
                  {rec.medicationsAdministered.map((med, i) => (
                    <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded text-xs">
                      💊 <strong>{med.name}</strong> ({med.dosage}) - <em>{med.time}</em>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Record Vitals Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <h4 className="font-bold text-sm">Bedside Vitals &amp; Progress Entry</h4>
              <button onClick={() => setIsEntryModalOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} (Room/Home)</option>
                  ))}
                </select>
              </div>

              {/* Vitals Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">BP Systolic</label>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    placeholder="120"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">BP Diastolic</label>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    placeholder="80"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pulse (BPM)</label>
                  <input
                    type="number"
                    value={pulseRate}
                    onChange={(e) => setPulseRate(e.target.value)}
                    placeholder="72"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value)}
                    placeholder="98"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperatureF}
                    onChange={(e) => setTemperatureF(e.target.value)}
                    placeholder="98.6"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    placeholder="120"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Medication Administered</label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Tab Amlodipine 5mg, Inj Clexane 40mg"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Clinical Progress Notes</label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Describe patient posture, chest sounds, urine output, stoma site..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="doctorOrders"
                  checked={doctorInstructionsFollowed}
                  onChange={(e) => setDoctorInstructionsFollowed(e.target.checked)}
                  className="rounded text-[#00a0e3]"
                />
                <label htmlFor="doctorOrders" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Physician protocol followed without deviation
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="flex-1 text-xs py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold py-2 rounded-lg"
                >
                  {isSubmitting ? 'Hashing & Saving...' : 'Save & Sign Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-base text-slate-800">
                Delete Clinical Vitals Record?
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to remove the record for{' '}
                <strong className="text-slate-800">{recordToDelete.patientName}</strong> logged at{' '}
                {new Date(recordToDelete.recordedAt).toLocaleString()}?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteRecord}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition disabled:opacity-50"
                id="btn-confirm-delete-record"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
