import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase, getCurrentUser, signOut } from './services/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import './index.css';

// Icons como componentes SVG
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2-2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Attendance: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Timer: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_user) => {
      setUser(_user);
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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => setUser(user)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full bg-surface-container border-r border-outline-variant shadow-md z-50">
          {/* Logo */}
          <div className="p-md border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v5l4.25 2.54.75-1.23-3.5-2.08V7z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Precision Attendance</h1>
                <p className="font-label-bold text-label-bold text-on-surface-variant text-xs">Portal de RH</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-md flex flex-col gap-xs">
            <SidebarLink to="/" icon={<Icons.Dashboard />}>Painel</SidebarLink>
            <SidebarLink to="/locations" icon={<Icons.Location />}>Locais</SidebarLink>
            <SidebarLink to="/users" icon={<Icons.Users />}>Usuários</SidebarLink>
            <SidebarLink to="/attendance" icon={<Icons.Attendance />}>Histórico</SidebarLink>
          </nav>

          {/* Timer Button */}
          <div className="p-md border-t border-outline-variant">
            <button className="w-full bg-secondary text-on-secondary font-label-bold text-label-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm shadow-sm hover:opacity-90 transition-all active:scale-95">
              <Icons.Timer />
              <span>Bater Ponto</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`md:hidden fixed left-0 top-0 h-full w-64 bg-surface-container border-r border-outline-variant shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-md border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v5l4.25 2.54.75-1.23-3.5-2.08V7z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Precision Attendance</h1>
                <p className="font-label-bold text-label-bold text-on-surface-variant text-xs">Portal de RH</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-sm hover:bg-surface-container-high rounded-lg">
              <Icons.Close />
            </button>
          </div>

          <nav className="flex-1 p-md flex flex-col gap-xs">
            <SidebarLink to="/" icon={<Icons.Dashboard />} onClick={() => setSidebarOpen(false)}>Painel</SidebarLink>
            <SidebarLink to="/locations" icon={<Icons.Location />} onClick={() => setSidebarOpen(false)}>Locais</SidebarLink>
            <SidebarLink to="/users" icon={<Icons.Users />} onClick={() => setSidebarOpen(false)}>Usuários</SidebarLink>
            <SidebarLink to="/attendance" icon={<Icons.Attendance />} onClick={() => setSidebarOpen(false)}>Histórico</SidebarLink>
          </nav>

          <div className="p-md border-t border-outline-variant">
            <button className="w-full bg-secondary text-on-secondary font-label-bold text-label-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm shadow-sm">
              <Icons.Timer />
              <span>Bater Ponto</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:ml-64 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 bg-surface border-b border-outline-variant shadow-sm z-30">
            <div className="flex justify-between items-center px-gutter py-sm max-w-container-max mx-auto">
              <div className="flex items-center gap-md">
                <button 
                  className="md:hidden p-sm hover:bg-surface-container-high rounded-lg"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icons.Menu />
                </button>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary hidden sm:block">
                  Portal Administrativo
                </h2>
              </div>

              <div className="flex items-center gap-md">
                <button className="p-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
                <button className="p-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.449 2.57-3.03 2.917a.998.998 0 00-.813.814c-.09.633.19 1.29.813 1.468C14.497 17.41 16 18.87 16 21a1 1 0 01-2 0c0-1.074-.69-2.002-1.687-2.342A3.001 3.001 0 0012 18c-1.657 0-3 1.343-3 3a1 1 0 01-2 0c0-2.13 1.503-3.59 3.5-3.933.623-.178.903-.835.813-1.468A.998.998 0 0010.5 15.5C8.919 15.157 7.47 13.987 7.47 12.57c0-1.657 1.343-3 3-3 1.742 0 3.222.835 3.772 2" />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-sm bg-surface-container hover:bg-surface-container-high px-md py-sm rounded-lg transition-all text-on-surface font-semibold"
                >
                  <Icons.Logout />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-lg max-w-container-max mx-auto">
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

function SidebarLink({ to, children, icon, onClick }: { to: string; children: React.ReactNode; icon: React.ReactNode; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-md px-md py-sm rounded-lg transition-all font-label-bold text-label-bold ${
        isActive 
          ? 'bg-primary text-on-primary shadow-sm' 
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
