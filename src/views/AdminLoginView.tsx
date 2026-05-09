import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export const AdminLoginView: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If identifier is not an email, assume it's a username and append a default domain
    let loginEmail = email;
    if (email && !email.includes('@')) {
      loginEmail = `${email}@forensic.io`;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password provider is disabled. Please enable it in the Firebase Console under Authentication > Sign-in method.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials. Make sure you have created the admin user in the Firebase Console and enabled Email/Password login.');
      } else {
        setError(err.message || 'Authentication failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-manrope font-black text-white uppercase tracking-tight mb-2">
            Secure <span className="text-blue-500">Access</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            Management Console // v4.2.0
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest pl-1">USERNAME OR EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#0a0e16] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-mono text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest pl-1">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0e16] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-mono text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase text-center">
                Auth_Error: {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-mono font-black uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest leading-relaxed">
            Unauthorized access to this terminal is strictly prohibited.<br/>
            All forensic activities are logged and monitored by central node.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-[0.3em]">SSL Verified // AES-256 Enabled</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
