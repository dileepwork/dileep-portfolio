import React, { useState, useEffect } from 'react';
import { Save, Key, Sliders, Sparkles } from 'lucide-react';

const Settings: React.FC = () => {
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passSaving, setPassSaving] = useState(false);

  // Portfolio settings state
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState('false');
  const [publicStatus, setPublicStatus] = useState('public');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cyber_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', { headers });
        if (response.ok) {
          const settings = await response.json();
          setPortfolioTitle(settings.portfolio_title || '');
          setSeoDescription(settings.seo_description || '');
          setMaintenanceMode(settings.maintenance_mode || 'false');
          setPublicStatus(settings.public_status || 'public');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    loadSettings();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long');
      return;
    }

    setPassSaving(true);

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/settings/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Error occurred changing password');
    } finally {
      setPassSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess(false);

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          portfolio_title: portfolioTitle,
          seo_description: seoDescription,
          maintenance_mode: maintenanceMode,
          public_status: publicStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>System Settings & Account</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure security keys, global titles, meta tags, and site status.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* PORTFOLIO SETTINGS PANEL */}
        <form onSubmit={handleSaveSettings} style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <Sliders size={16} />
            GLOBAL PORTFOLIO CONFIG
          </h3>

          {settingsSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.7rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* Portfolio Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DEFAULT PORTFOLIO TITLE</label>
            <input
              type="text"
              required
              placeholder="e.g. Dileep V | IoT & Embedded Systems Engineer"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* SEO Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DEFAULT SEO META DESCRIPTION</label>
            <textarea
              rows={3}
              placeholder="Brief search indexing details..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Maintenance Mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>MAINTENANCE MODE</label>
              <select
                value={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.value)}
                style={selectStyle}
              >
                <option value="false">FALSE (ONLINE)</option>
                <option value="true">TRUE (OFFLINE)</option>
              </select>
            </div>

            {/* Public/Private Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>PUBLIC STATUS</label>
              <select
                value={publicStatus}
                onChange={(e) => setPublicStatus(e.target.value)}
                style={selectStyle}
              >
                <option value="public">PUBLIC ACCESSIBLE</option>
                <option value="private">PRIVATE LOCKED</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={settingsSaving}
            style={{
              background: '#10b981',
              color: '#05080D',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: settingsSaving ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </form>

        {/* CHANGE PASSWORD PANEL */}
        <form onSubmit={handlePasswordChange} style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <Key size={16} />
            CHANGE ADMIN PASSWORD
          </h3>

          {passError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.7rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
              {passError}
            </div>
          )}
          {passSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.7rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
              Password updated successfully!
            </div>
          )}

          {/* Current Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CURRENT PASSWORD</label>
            <input
              type="password"
              required
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>NEW PASSWORD</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={passSaving}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: passSaving ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Key size={16} />
            <span>Update Credentials</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Styling Tokens
const inputStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.65rem 0.8rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
};

const textareaStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.65rem 0.8rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  resize: 'vertical',
};

const selectStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.65rem 1.8rem 0.65rem 0.8rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

export default Settings;
