import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase, getCurrentUser, signOut } from './services/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import './index.css';

// Material Icons as SVG components - Tamanhos controlados
const Icons = {
  Dashboard: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '20px', maxHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '20px', maxHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '20px', maxHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Attendance: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '20px', maxHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '20px', maxHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Timer: () => (
    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ maxWidth: '24px', maxHeight: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-surface-container">
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
        {/* Navigation - Top Bar */}
        <nav className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              {/* Logo */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.Timer />
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-base font-bold text-primary truncate">Precision Attendance</div>
                  <div className="text-xs text-on-surface-variant font-semibold hidden md:block">Portal Administrativo</div>
                </div>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/">
                  <Icons.Dashboard />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/locations">
                  <Icons.Location />
                  <span>Locais</span>
                </NavLink>
                <NavLink to="/users">
                  <Icons.Users />
                  <span>Usuários</span>
                </NavLink>
                <NavLink to="/attendance">
                  <Icons.Attendance />
                  <span>Registros</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg transition-all font-semibold text-on-surface"
                >
                  <Icons.Logout />
                  <span>Sair</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-outline-variant">
                <div className="flex flex-col gap-2">
                  <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                  <MobileNavLink to="/locations" onClick={() => setMobileMenuOpen(false)}>Locais</MobileNavLink>
                  <MobileNavLink to="/users" onClick={() => setMobileMenuOpen(false)}>Usuários</MobileNavLink>
                  <MobileNavLink to="/attendance" onClick={() => setMobileMenuOpen(false)}>Registros</MobileNavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2.5 rounded-lg hover:bg-surface-container transition-all font-semibold text-on-surface"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="container mx-auto px-4 py-6 md:py-8 animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/users" element={<Users />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-semibold ${
        isActive
          ? 'bg-primary text-on-primary shadow-md'
          : 'text-on-surface-variant hover:bg-surface-container'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-4 py-2.5 rounded-lg hover:bg-surface-container transition-all font-semibold text-on-surface"
    >
      {children}
    </Link>
  );
}

export default App;
