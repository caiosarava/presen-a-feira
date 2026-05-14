import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase, getCurrentUser, signOut } from './services/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import './index.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => checkUser()} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background font-body-md text-on-surface">

        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant shadow-md z-50 p-md gap-sm">
          <div className="flex items-center gap-sm mb-lg px-sm">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v5l4.25 2.54.75-1.23-3.5-2.08V7z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">Precision Attendance</h1>
              <p className="font-label-bold text-label-bold text-on-surface-variant">Portal de RH</p>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-xs">
            <SidebarLink to="/">
              <span className="material-symbols-outlined">dashboard</span>
              Painel
            </SidebarLink>
            <SidebarLink to="/locations">
              <span className="material-symbols-outlined">location_on</span>
              Locais
            </SidebarLink>
            <SidebarLink to="/users">
              <span className="material-symbols-outlined">group</span>
              Colaboradores
            </SidebarLink>
            <SidebarLink to="/attendance">
              <span className="material-symbols-outlined">history</span>
              Histórico
            </SidebarLink>
          </nav>

          <div className="mt-auto border-t border-outline-variant pt-md">
            <button className="w-full bg-secondary text-on-secondary font-label-bold text-label-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm shadow-sm hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined">alarm_on</span>
              Bater Ponto
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile Sidebar */}
        <aside className={`md:hidden fixed left-0 top-0 h-full w-64 bg-surface-container border-r border-outline-variant shadow-lg z-50 flex flex-col p-md gap-sm transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-lg px-sm">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v5l4.25 2.54.75-1.23-3.5-2.08V7z"/>
                </svg>
              </div>
              <h1 className="font-headline-sm text-headline-sm text-primary font-bold">Precision</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-xs hover:bg-surface-container-high rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-xs">
            <SidebarLink to="/" onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">dashboard</span>
              Painel
            </SidebarLink>
            <SidebarLink to="/locations" onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">location_on</span>
              Locais
            </SidebarLink>
            <SidebarLink to="/users" onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">group</span>
              Colaboradores
            </SidebarLink>
            <SidebarLink to="/attendance" onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">history</span>
              Histórico
            </SidebarLink>
          </nav>

          <div className="mt-auto border-t border-outline-variant pt-md">
            <button className="w-full bg-secondary text-on-secondary font-label-bold text-label-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined">alarm_on</span>
              Bater Ponto
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:ml-64 min-h-screen flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 bg-surface border-b border-outline-variant shadow-sm z-30">
            <div className="flex justify-between items-center px-gutter py-sm max-w-container-max mx-auto w-full">
              <div className="flex items-center gap-md">
                <button className="md:hidden p-xs hover:bg-surface-container rounded-lg transition-colors" onClick={() => setSidebarOpen(true)}>
                  <span className="material-symbols-outlined text-primary">menu</span>
                </button>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary hidden sm:block">Portal Administrativo</h2>
              </div>

              <div className="flex items-center gap-md">
                <button className="p-xs rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="p-xs rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">help</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm border border-outline-variant">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-sm bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high px-md py-xs rounded-lg transition-all font-label-bold text-label-bold text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sair
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-lg max-w-container-max mx-auto w-full flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

function SidebarLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-md px-md py-sm rounded-lg transition-all font-label-bold text-label-bold active:translate-x-1 duration-200 ${
        isActive
          ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high'
          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
      }`}
    >
      {children}
    </Link>
  );
}

export default App;
