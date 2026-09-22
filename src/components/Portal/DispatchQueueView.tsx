import React, { useState } from 'react';
import { ServiceRequest, NurseStaff } from '../../types.ts';
import { Phone, Clock, MapPin, CheckCircle, Send, AlertTriangle, ShieldCheck, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface DispatchQueueViewProps {
  requests: ServiceRequest[];
  nurses?: NurseStaff[];
  onRefresh: () => void;
}

export const DispatchQueueView: React.FC<DispatchQueueViewProps> = ({ requests, nurses = [], onRefresh }) => {
  const { token } = useAuth();
  const [selectedRequestForNurse, setSelectedRequestForNurse] = useState<ServiceRequest | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const handleAssignNurseToRequest = async (reqId: string, nurse: NurseStaff) => {
    try {
      const targetReq = requests.find(r => r.id === reqId);
      const noteUpdate = targetReq?.conditionNotes
        ? `${targetReq.conditionNotes} | Provided Nurse: ${nurse.fullName} (${nurse.qualification})`
        : `Provided Nurse: ${nurse.fullName} (${nurse.qualification})`;

      const res = await fetch(`/api/requests/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'assigned',
          conditionNotes: noteUpdate
        })
      });
      if (res.ok) {
        setFeedbackMsg(`Assigned & provided ${nurse.fullName} for enquiry #${reqId}`);
        setSelectedRequestForNurse(null);
        onRefresh();
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    } catch (err) {
      console.error('Failed to assign nurse to request:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base font-heading">
            Live Clinical Dispatch &amp; Intake Queue
          </h3>
          <p className="text-xs text-slate-500">
            Incoming patient requests from Delhi NCR families requiring nurse deployment.
          </p>
        </div>
        <div className="text-xs bg-[#e6f0fa] text-[#006591] px-2.5 py-1 rounded-full font-bold">
          {requests.length} Total Enquiries
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {req.id}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  req.status === 'new'
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : req.status === 'contacted'
                    ? 'bg-amber-100 text-amber-800'
                    : req.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                ● {req.status}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#1b3b6f]">
                {req.fullName}
              </h4>
              <a
                href={`tel:${req.phone.replace(/[^0-9+]/g, '')}`}
                className="text-xs text-[#00a0e3] font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{req.phone}</span>
              </a>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service:</span>
                <strong className="text-slate-800">{req.serviceNeeded}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hub:</span>
                <span className="text-slate-800">{req.preferredLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shift:</span>
                <span className="text-slate-800 font-semibold">{req.shiftRequirement}</span>
              </div>
            </div>

            {req.conditionNotes && (
              <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/60">
                <strong className="text-slate-700 block text-[11px] mb-0.5">Clinical Condition Notes:</strong>
                {req.conditionNotes}
              </div>
            )}

            {/* Quick Status Changers */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              {req.status === 'new' && (
                <button
                  onClick={() => handleUpdateStatus(req.id, 'contacted')}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-1.5 px-2 rounded-lg transition"
                >
                  Mark Contacted
                </button>
              )}
              {(req.status === 'new' || req.status === 'contacted') && (
                <button
                  onClick={() => setSelectedRequestForNurse(req)}
                  className="flex-1 bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-xs py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Provide Nurse</span>
                </button>
              )}
              {req.status === 'assigned' && (
                <button
                  onClick={() => handleUpdateStatus(req.id, 'completed')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-2 rounded-lg transition"
                >
                  Mark Active Case
                </button>
              )}
              {req.status === 'completed' && (
                <span className="text-xs text-emerald-600 font-semibold mx-auto flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Care Deployed
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
          No dispatch requests pending in queue.
        </div>
      )}

      {/* Select Nurse Modal for Dispatch Request */}
      {selectedRequestForNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#00a0e3]" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Provide Nurse for Intake</h4>
                  <p className="text-xs text-slate-300">
                    Patient/Rep: {selectedRequestForNurse.fullName} ({selectedRequestForNurse.serviceNeeded})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequestForNurse(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                Select a verified nurse to deploy for this enquiry ({selectedRequestForNurse.preferredLocation}):
              </p>
              {nurses.map((nurse) => (
                <div
                  key={nurse.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={nurse.avatar}
                      alt={nurse.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h5 className="font-bold text-sm text-[#1b3b6f]">{nurse.fullName}</h5>
                      <span className="text-[11px] text-slate-500">
                        {nurse.qualification} • {nurse.hubLocation}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignNurseToRequest(selectedRequestForNurse.id, nurse)}
                    className="bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedRequestForNurse(null)}
                className="text-xs font-bold text-slate-600 px-3 py-1.5 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
