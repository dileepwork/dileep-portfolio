import React, { useState, useEffect } from 'react';
import { Save, User, FileText, Sparkles } from 'lucide-react';

interface Profile {
  name: string;
  title: string;
  intro: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  profile_image: string;
  resume_url: string;
}

const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    intro: '',
    about: '',
    location: '',
    email: '',
    phone: '',
    profile_image: '',
    resume_url: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string; file_type: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('cyber_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const loadProfileData = async () => {
      try {
        const resMedia = await fetch('/api/media', { headers });
        if (resMedia.ok) {
          const media = await resMedia.json();
          setAvailableMedia(media);
        }

        const resProfile = await fetch('/api/profile', { headers });
        if (resProfile.ok) {
          const data = await resProfile.json();
          if (data && data.name) {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error loading profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Error saving profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#8B98A8', textAlign: 'center', padding: '4rem' }}>Loading profile credentials...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Identity Profile CMS</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure your name, engineering specialization titles, and CV attachments.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} />
          <span>Profile configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8rem'
      }}>
        
        {/* SECTION 1: PROFESSIONAL IDENTITY */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} />
            PROFESSIONAL IDENTITY
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>FULL NAME</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Dileep V"
                value={profile.name}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Professional Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>PROFESSIONAL TITLE</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. IoT & Embedded Systems Engineer"
                value={profile.title}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: BIOGRAPHY & COGNITIONS */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} />
            BIOGRAPHY & INTRODUCTIONS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Short Intro */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>SHORT HERO TAGLINE</label>
              <input
                type="text"
                name="intro"
                placeholder="Pioneering high-precision IoT engineering..."
                value={profile.intro}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* About Me */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>ABOUT ME SUMMARY (DETAILED)</label>
              <textarea
                name="about"
                rows={4}
                placeholder="Write a bio showing your experience and engineering drive..."
                value={profile.about}
                onChange={handleInputChange}
                style={textareaStyle}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTACT & COORDINATES */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '1.2rem' }}>
            CONTACT & COORDINATES
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CONTACT EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="dileeppvt03@gmail.com"
                value={profile.email}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CONTACT PHONE</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 9159059497"
                value={profile.phone}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>LOCATION</label>
              <input
                type="text"
                name="location"
                placeholder="Erode, Tamil Nadu, India"
                value={profile.location}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: MEDIA LINKS (Avatar, CV Resume) */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '1.2rem' }}>
            PORTFOLIO ASSETS SELECTOR
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Avatar Selection */}
            <div style={{
              background: '#101923',
              borderRadius: '0.75rem',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Profile Avatar / Image</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.72rem', color: '#8B98A8' }}>SELECT FILE</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setProfile(prev => ({ ...prev, profile_image: e.target.value }));
                    }
                  }}
                  style={selectStyle}
                >
                  <option value="">-- Choose file --</option>
                  {availableMedia.filter(m => m.file_type.startsWith('image/')).map(m => (
                    <option key={m.id} value={m.url}>{m.filename}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.72rem', color: '#8B98A8' }}>IMAGE URL PATH</label>
                <input
                  type="text"
                  name="profile_image"
                  placeholder="/robot.png"
                  value={profile.profile_image}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Resume Selection */}
            <div style={{
              background: '#101923',
              borderRadius: '0.75rem',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Resume / CV Document</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.72rem', color: '#8B98A8' }}>SELECT FILE</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setProfile(prev => ({ ...prev, resume_url: e.target.value }));
                    }
                  }}
                  style={selectStyle}
                >
                  <option value="">-- Choose file --</option>
                  {availableMedia.map(m => (
                    <option key={m.id} value={m.url}>{m.filename}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.72rem', color: '#8B98A8' }}>DOCUMENT URL PATH</label>
                <input
                  type="text"
                  name="resume_url"
                  placeholder="/uploads/resume.pdf"
                  value={profile.resume_url}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          style={{
            alignSelf: 'flex-start',
            background: '#10b981',
            color: '#05080D',
            border: 'none',
            padding: '0.8rem 1.8rem',
            borderRadius: '0.5rem',
            fontWeight: 850,
            fontSize: '0.9rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
          }}
        >
          <Save size={16} />
          <span>Save Identity Profile</span>
        </button>
      </form>
    </div>
  );
};

// Form components inputs styling tokens
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

export default ProfileManagement;
