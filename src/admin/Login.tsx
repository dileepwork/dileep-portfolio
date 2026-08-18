import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Shield, Key, User, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05080D',
      color: '#F5F7FA',
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Cyber Background Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none'
      }} />

      {/* Cyber Glow Unit */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0B1118',
        borderRadius: '1.25rem',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(16,185,129,0.05)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Terminal Header Decoration */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '1.2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.85rem', color: '#10b981' }}>
              DILEEP CMS v1.0
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', opacity: 0.7 }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', opacity: 0.7 }} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#F5F7FA', marginBottom: '0.4rem' }}>
            Secure Core Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>
            Authorization is required to gain administration clearance.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            padding: '0.8rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username/Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8B98A8', letterSpacing: '0.05em' }}>
              IDENTIFIER (USERNAME)
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#8B98A8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  background: '#05080D',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#F5F7FA',
                  padding: '0.9rem 1rem 0.9rem 2.8rem',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8B98A8', letterSpacing: '0.05em' }}>
              SECURITY KEY (PASSWORD)
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="#8B98A8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#05080D',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#F5F7FA',
                  padding: '0.9rem 1rem 0.9rem 2.8rem',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#10b981',
              color: '#05080D',
              border: 'none',
              padding: '1.1rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '1rem',
              transition: 'opacity 0.2s ease, transform 0.1s ease',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
            onMouseDown={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Establishing Clearances...</span>
              </>
            ) : (
              <>
                <span>Access Terminal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Global spinner styling */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-animation {
            animation: spin 1s linear infinite;
          }
        `}} />
      </div>
    </div>
  );
};

export default Login;
