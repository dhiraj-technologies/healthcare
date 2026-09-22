import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Stethoscope, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, quickDemoLogin, authError, clearError, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'patient' | 'nurse' | 'admin'>('patient');
  const [regPhone, setRegPhone] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(loginEmail, loginPassword);
    if (ok) {
      onSuccess();
      onClose();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(regName, regEmail, regPassword, regRole, regPhone);
    if (ok) {
      onSuccess();
      onClose();
    }
  };

  const handleDemoClick = async (role: 'admin' | 'nurse' | 'patient') => {
    await quickDemoLogin(role);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b3b6f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a0e3] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">Clinical Management Portal</h3>
              <p className="text-[11px] text-slate-300">Secure JWT Authentication &amp; RBAC</p>
            </div>
          </div>
          <button
            onClick={() => { clearError(); onClose(); }}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Switcher Section */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Instant Demo Accounts (RBAC)</span>
            <span className="text-[10px] text-[#006591] bg-[#e6f0fa] px-1.5 py-0.2 rounded font-semibold">1-Click Test</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleDemoClick('admin')}
              className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border-2 border-purple-300 text-left transition flex flex-col justify-between shadow-xs"
              id="btn-demo-admin"
            >
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  Admin
                </span>
                <span className="text-[9px] bg-purple-200 text-purple-900 font-extrabold px-1 rounded">CRUD</span>
              </div>
              <span className="text-[10px] text-purple-700 font-semibold leading-tight mt-1">Manage Patients &amp; Staff</span>
            </button>

            <button
              onClick={() => handleDemoClick('nurse')}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-left transition flex flex-col justify-between"
              id="btn-demo-nurse"
            >
              <div className="font-bold flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>Nurse</span>
              </div>
              <span className="text-[10px] text-blue-600 truncate mt-1">Sister Priya</span>
            </button>

            <button
              onClick={() => handleDemoClick('patient')}
              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left transition flex flex-col justify-between"
              id="btn-demo-patient"
            >
              <div className="font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patient</span>
              </div>
              <span className="text-[10px] text-emerald-600 truncate mt-1">Rajesh Khanna</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { clearError(); setTab('login'); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition ${
              tab === 'login'
                ? 'text-[#006591] border-b-2 border-[#00a0e3] bg-white'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            Sign In with Password
          </button>
          <button
            onClick={() => { clearError(); setTab('register'); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition ${
              tab === 'register'
                ? 'text-[#006591] border-b-2 border-[#00a0e3] bg-white'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Work or Family Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@carehealth.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                    id="input-login-email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                    id="input-login-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1b3b6f] hover:bg-[#152e57] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-70"
                id="btn-login-submit"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sister Meera Nair"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="meera@carehealth.com"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Portal Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden bg-white"
                >
                  <option value="patient">Patient / Family Representative</option>
                  <option value="nurse">Clinical Nurse Staff</option>
                  <option value="admin">Administrator / Care Coordinator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 999..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                id="btn-register-submit"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register Portal Account'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
