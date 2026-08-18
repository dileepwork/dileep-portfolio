import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  LayoutDashboard, User, Briefcase, History, Cpu, 
  Award, Trophy, GraduationCap, Mail, Image, 
  Share2, Settings as SettingsIcon, LogOut, Menu, X, Shield 
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout, username } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { type: 'header', label: 'PORTFOLIO' },
    { label: 'Profile', path: '/admin/profile', icon: <User size={18} /> },
    { label: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} /> },
    { label: 'Experiences', path: '/admin/experiences', icon: <History size={18} /> },
    { label: 'Skills', path: '/admin/skills', icon: <Cpu size={18} /> },
    { label: 'Certificates', path: '/admin/certificates', icon: <Award size={18} /> },
    { label: 'Achievements', path: '/admin/achievements', icon: <Trophy size={18} /> },
    { label: 'Education', path: '/admin/education', icon: <GraduationCap size={18} /> },
    { type: 'header', label: 'COMMUNICATION' },
    { label: 'Messages', path: '/admin/contact', icon: <Mail size={18} /> },
    { type: 'header', label: 'MEDIA' },
    { label: 'Media Library', path: '/admin/media', icon: <Image size={18} /> },
    { type: 'header', label: 'SETTINGS' },
    { label: 'Social Links', path: '/admin/social-links', icon: <Share2 size={18} /> },
    { label: 'Account Settings', path: '/admin/settings', icon: <SettingsIcon size={18} /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#05080D',
      color: '#F5F7FA',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Persistent Sidebar Unit */}
      <aside style={{
        width: '260px',
        background: '#0B1118',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(0)', // In mobile, override via CSS
      }}
      className="admin-sidebar"
      >
        {/* Brand Header */}
        <div style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontWeight: 900, letterSpacing: '0.05em', fontSize: '1.1rem' }}>
              DILEEP CMS
            </span>
          </div>
          <button 
            onClick={toggleSidebar}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#F5F7FA', 
              cursor: 'pointer' 
            }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem'
        }}>
          {navItems.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div 
                  key={index}
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#8B98A8',
                    letterSpacing: '0.15em',
                    padding: '1.2rem 0.5rem 0.4rem',
                  }}
                >
                  {item.label}
                </div>
              );
            }

            const active = isActive(item.path!);
            return (
              <Link
                key={index}
                to={item.path!}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.8rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#10b981' : '#F5F7FA',
                  background: active ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  border: active ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.color = '#10b981';
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#F5F7FA';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: active ? '#10b981' : '#8B98A8' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#080E14'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{username || 'Administrator'}</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Active Session
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#8B98A8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#8B98A8';
              e.currentTarget.style.background = 'none';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div 
        style={{
          flex: 1,
          marginLeft: '260px', // Matches sidebar width
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="admin-main-wrapper"
      >
        {/* Header Bar */}
        <header style={{
          height: '70px',
          background: '#0B1118',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: '#F5F7FA',
                cursor: 'pointer',
                display: 'none',
                padding: '0.4rem',
                borderRadius: '0.35rem'
              }}
              className="sidebar-toggle-btn"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              System Command Console
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a 
              href="/" 
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
              }}
            >
              View Public Site
            </a>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Sidebar Responsive Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-close-btn { display: none; }
        @media (max-width: 991px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .sidebar-close-btn {
            display: flex !important;
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .sidebar-toggle-btn {
            display: block !important;
          }
          /* Drawer Slide Out when open */
          ${isSidebarOpen ? `
            .admin-sidebar {
              transform: translateX(0) !important;
            }
          ` : ''}
        }
      `}} />
    </div>
  );
};

export default AdminLayout;
