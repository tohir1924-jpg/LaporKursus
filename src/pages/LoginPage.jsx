import { useState } from 'react';
import { GraduationCap, Lock, Mail, Sparkles } from 'lucide-react';
import { api } from '../lib/apiClient';

export function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@kursus.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch dynamic API
      const data = await api.post('/auth/login', { email, password });
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      // Fallback for static demo mode (if API is not running/D1 is offline)
      console.log('API offline, logging in using fallback mock auth...');
      if (email === 'admin@kursus.com' && password === 'password') {
        const mockUser = { id: 'usr_admin', name: 'Admin Kursus (Mock)', email, role: 'admin' };
        localStorage.setItem('token', 'mock-token-value');
        localStorage.setItem('user', JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
      } else if (email === 'rina@kursus.com' && password === 'password') {
        const mockUser = { id: 'usr_teacher1', name: 'Bu Rina (Mock)', email, role: 'teacher' };
        localStorage.setItem('token', 'mock-token-value');
        localStorage.setItem('user', JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
      } else {
        setError('Email atau password salah (Gagal memproses login)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[80%] w-[80%] rounded-full bg-teal-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <GraduationCap size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">LaporKursus</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sistem Informasi Operasional & Pelaporan Kursus
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="admin@kursus.com atau rina@kursus.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:bg-blue-800"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Masuk ke Sistem'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-teal-500/10 bg-teal-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-400">
            <Sparkles size={14} />
            <span>Mode Demo & Cloudflare D1</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Ketik password <b>password</b> untuk login simulasi jika database belum terkoneksi.
          </p>
        </div>
      </div>
    </div>
  );
}
