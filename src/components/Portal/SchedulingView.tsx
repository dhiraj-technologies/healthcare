import React, { useState } from 'react';
import { CareSchedule, Patient, NurseStaff } from '../../types.ts';
import { Calendar, Clock, Plus, CheckCircle2, AlertCircle, User, Stethoscope, ChevronRight, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface SchedulingViewProps {
  schedules: CareSchedule[];
  patients: Patient[];
  nurses: NurseStaff[];
  onRefresh: () => void;
}

export const SchedulingView: React.FC<SchedulingViewProps> = ({
  schedules,
  patients,
  nurses,
  onRefresh
}) => {
  const { user, token } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New shift form state
  const [patientId, setPatientId] = useState(patients[0]?.id || 'patient-1');
  const [nurseId, setNurseId] = useState(nurses[0]?.id || 'nurse-1');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState<'12h Day' | '12h Night' | '24h Live-in'>('12h Day');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('08:00 PM');
  const [tasksInput, setTasksInput] = useState('Vital monitoring every 4 hours, Tracheostomy suctioning, Enteral feed administration');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'nurse';

  const filtered = schedules.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const handleDeleteSchedule = async (id: string) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setScheduleToDelete(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: CareSchedule['status']) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update schedule status:', err);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tasks = tasksInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId,
          nurseId,
          shiftDate,
          shiftType,
          startTime,
          endTime,
          tasks,
          notes
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error('Error creating schedule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00a0e3]" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base font-heading">
            Patient Shift &amp; Care Rostering
          </h3>
          <span className="text-xs bg-[#e6f0fa] text-[#006591] px-2 py-0.5 rounded-full font-bold">
            {filtered.length} Shifts
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'in-progress', 'scheduled', 'completed'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition ${
                  filterStatus === st
                    ? 'bg-[#1b3b6f] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
              id="btn-add-schedule"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Shift</span>
            </button>
          )}
        </div>
      </div>

      {/* Schedule Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
          >
            <div className="space-y-3">
              
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00a0e3]" />
                  {item.shiftDate}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'in-progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : item.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.status}
                  </span>

                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setScheduleToDelete(item.id)}
                      title="Remove Shift Schedule"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      id={`btn-delete-schedule-${item.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Patient & Nurse */}
              <div>
                <div className="text-sm font-bold text-[#1b3b6f] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Patient: {item.patientName}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-[#00a0e3]" />
                  <span>Nurse: <strong>{item.nurseName}</strong></span>
                </div>
              </div>

              {/* Shift Format */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                <span>{item.shiftType}</span>
                <span className="font-mono text-[11px] font-semibold text-[#1b3b6f]">
                  {item.startTime} - {item.endTime}
                </span>
              </div>

              {/* Clinical Tasks Checklist */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Care Directives:
                </div>
                <ul className="space-y-1">
                  {item.tasks.map((task, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.notes && (
                <div className="text-[11px] italic text-slate-500 bg-amber-50/60 p-2 rounded border border-amber-100">
                  "{item.notes}"
                </div>
              )}

            </div>

            {/* Actions (Update status for Nurse/Admin) */}
            {canEdit && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {item.status === 'scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'in-progress')}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-1.5 px-2 rounded-lg transition"
                  >
                    Start Shift
                  </button>
                )}

                {item.status === 'in-progress' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-2 rounded-lg transition"
                  >
                    Mark Completed
                  </button>
                )}

                {item.status === 'completed' && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mx-auto">
                    <CheckCircle2 className="w-4 h-4" /> Shift Fulfilled
                  </div>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
          No care schedules found under "{filterStatus}".
        </div>
      )}

      {/* Add Shift Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <h4 className="font-bold text-sm">Schedule Clinical Care Shift</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-5 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.diagnosis.slice(0, 30)}...)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assign Certified Staff</label>
                <select
                  value={nurseId}
                  onChange={(e) => setNurseId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {nurses.map(n => (
                    <option key={n.id} value={n.id}>{n.fullName} ({n.qualification})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Shift Date</label>
                  <input
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Shift Type</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="12h Day">12h Day</option>
                    <option value="12h Night">12h Night</option>
                    <option value="24h Live-in">24h Live-in</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Care Tasks (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={tasksInput}
                  onChange={(e) => setTasksInput(e.target.value)}
                  placeholder="Vitals monitoring, IV injection, Sponge bath..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Coordinator Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ensure oxygen backup is primed"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 text-xs py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold py-2 rounded-lg"
                >
                  {isSubmitting ? 'Saving...' : 'Save Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Schedule Confirmation Modal */}
      {scheduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-800">Cancel / Remove Shift?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this shift schedule? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScheduleToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                Keep Shift
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSchedule(scheduleToDelete)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition"
                id="btn-confirm-delete-schedule"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
