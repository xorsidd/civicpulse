import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, Shield, UserCheck, ShieldAlert, Building2 } from 'lucide-react';

export const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() || 'CITIZEN';

  const [activeTab, setActiveTab] = useState(
    ['CITIZEN', 'AUTHORITY', 'ADMIN'].includes(initialRole) ? initialRole : 'CITIZEN'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam && ['CITIZEN', 'AUTHORITY', 'ADMIN'].includes(roleParam)) {
      setActiveTab(roleParam);
    }
  }, [searchParams]);

  const handleTabChange = (role) => {
    setActiveTab(role);
    setSearchParams({ role });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const u = await login(email, password);

      // Verify user matches selected portal role
      if (activeTab === 'ADMIN' && u.role !== 'ADMIN') {
        setError('Access Denied: This login portal is restricted to Administrators only.');
        setSubmitting(false);
        return;
      }

      if (activeTab === 'AUTHORITY' && u.role !== 'AUTHORITY' && u.role !== 'ADMIN') {
        setError('Access Denied: This login portal is restricted to Authority Officers only.');
        setSubmitting(false);
        return;
      }

      if (u.role === 'ADMIN') navigate('/admin/dashboard');
      else if (u.role === 'AUTHORITY') navigate('/authority/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const portalConfig = {
    CITIZEN: {
      title: 'Citizen Portal Login',
      subtitle: 'Access your reported issues, submit new problems, and verify resolutions',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
      buttonGradient: 'from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 shadow-cyan-950',
    },
    AUTHORITY: {
      title: 'Authority Operations Login',
      subtitle: 'Dispatch priority queue, department assignments, and repair evidence management',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-700',
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      buttonGradient: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-950',
    },
    ADMIN: {
      title: 'Administrator System Control Login',
      subtitle: 'System analytics, user accounts, department mappings, risk zones & fraud oversight',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-700',
      icon: <Building2 className="w-6 h-6 text-rose-400" />,
      buttonGradient: 'from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 shadow-rose-950',
    },
  };

  const currentPortal = portalConfig[activeTab];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
            CivicPulse Authentication
          </h2>
          <p className="text-xs text-slate-400">
            Select your access role portal to sign in to the platform
          </p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange('CITIZEN')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'CITIZEN'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950 border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('AUTHORITY')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'AUTHORITY'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950 border border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Authority</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('ADMIN')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'ADMIN'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 border border-rose-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          
          {/* Portal Title Banner */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              {currentPortal.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100 font-['Outfit']">
                  {currentPortal.title}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentPortal.badgeColor}`}>
                  {activeTab}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {currentPortal.subtitle}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {activeTab} Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'CITIZEN'
                      ? 'citizen1@gmail.com'
                      : activeTab === 'AUTHORITY'
                      ? 'roads.auth@civicpulse.gov'
                      : 'admin@civicpulse.gov'
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${currentPortal.buttonGradient} text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
            >
              {submitting ? 'Authenticating Credentials...' : `Log In to ${activeTab} Portal`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Registration Link */}
          {activeTab === 'CITIZEN' && (
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Don't have a citizen account?{' '}
              <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                Register as Citizen
              </Link>
            </div>
          )}

          {activeTab !== 'CITIZEN' && (
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Note: Authority & Admin accounts are provisioned by municipal administrators.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
