import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, HelpCircle 
} from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  type: string;
  location: string;
  start_date: string;
  end_date: string;
  currently_working: number;
  description: string;
  bullet_points: string[];
  technologies: string[];
  logo_url: string;
  display_order: number;
  published: number;
}

const ExperienceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [experience, setExperience] = useState<Experience>({
    company: '',
    role: '',
    type: 'Trainer',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: 0,
    description: '',
    bullet_points: [''],
    technologies: [],
    logo_url: '',
    display_order: 0,
    published: 1
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Technologies tag input state
  const [newTag, setNewTag] = useState('');

  // Available media files for logo selection
  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string; file_type: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('cyber_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const loadData = async () => {
      try {
        const resMedia = await fetch('/api/media', { headers });
        if (resMedia.ok) {
          const media = await resMedia.json();
          setAvailableMedia(media);
        }

        if (isEditMode) {
          const resExp = await fetch(`/api/experiences/${id}`, { headers });
          if (!resExp.ok) throw new Error('Failed to load experience details');
          const data = await resExp.json();
          setExperience(data);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setExperience(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  // --- Dynamic Bullet Points handlers ---
  const handleBulletChange = (idx: number, val: string) => {
    const updatedBullets = [...experience.bullet_points];
    updatedBullets[idx] = val;
    setExperience(prev => ({ ...prev, bullet_points: updatedBullets }));
  };

  const handleAddBullet = () => {
    setExperience(prev => ({
      ...prev,
      bullet_points: [...prev.bullet_points, '']
    }));
  };

  const handleRemoveBullet = (idx: number) => {
    const updatedBullets = experience.bullet_points.filter((_, i) => i !== idx);
    setExperience(prev => ({
      ...prev,
      bullet_points: updatedBullets.length === 0 ? [''] : updatedBullets
    }));
  };

  // --- Technologies handlers ---
  const handleAddTag = () => {
    if (newTag.trim() && !experience.technologies.includes(newTag.trim())) {
      setExperience(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setExperience(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tagToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent, forceStatus?: string) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    let experiencePayload = { ...experience };
    // Filter out empty bullet points
    experiencePayload.bullet_points = experiencePayload.bullet_points.filter(b => b.trim() !== '');

    if (forceStatus) {
      experiencePayload.published = forceStatus === 'Published' ? 1 : 0;
    }

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditMode ? `/api/experiences/${id}` : '/api/experiences';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(experiencePayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save experience');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/experiences');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving experience log');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#8B98A8', textAlign: 'center', padding: '4rem' }}>Loading experience editor...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/admin/experiences')}
          style={{
            background: 'none',
            border: 'none',
            color: '#8B98A8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            fontWeight: 700
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#10b981'}
          onMouseOut={(e) => e.currentTarget.style.color = '#8B98A8'}
        >
          <ArrowLeft size={16} />
          <span>Back to Experiences logs</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={(e) => handleSave(e, 'Draft')}
            style={{
              background: '#101923',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#F5F7FA',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            Save Draft
          </button>

          <button
            onClick={(e) => handleSave(e, 'Published')}
            disabled={saving}
            style={{
              background: '#10b981',
              color: '#05080D',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Save size={16} />
            <span>{isEditMode ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          Experience log updated successfully! Redirecting...
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={(e) => handleSave(e)} style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
          {isEditMode ? 'Modify Work Experience Log' : 'Create New Work Experience Record'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Company Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>COMPANY / ORGANIZATION NAME</label>
            <input
              type="text"
              name="company"
              required
              placeholder="e.g. 6ixmindslabs"
              value={experience.company}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Position/Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>ROLE / TITLE</label>
            <input
              type="text"
              name="role"
              required
              placeholder="e.g. Embedded & IoT Trainer"
              value={experience.role}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {/* Employment Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>EMPLOYMENT TYPE</label>
            <input
              type="text"
              name="type"
              placeholder="e.g. Trainer, Intern, Trainee, Full-Time"
              value={experience.type}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>LOCATION</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Erode, India"
              value={experience.location}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Display Order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>DISPLAY ORDER</label>
            <input
              type="number"
              name="display_order"
              value={experience.display_order}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {/* Start Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>START DATE</label>
            <input
              type="text"
              name="start_date"
              placeholder="e.g. Feb 2025 or 22/06/2026"
              value={experience.start_date}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* End Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>END DATE</label>
            <input
              type="text"
              name="end_date"
              placeholder="e.g. Nov 2025 or Present"
              disabled={experience.currently_working === 1}
              value={experience.currently_working === 1 ? '' : experience.end_date}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                opacity: experience.currently_working === 1 ? 0.3 : 1,
                cursor: experience.currently_working === 1 ? 'not-allowed' : 'auto'
              }}
            />
          </div>

          {/* Currently Working Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
            <input
              type="checkbox"
              id="currently_working"
              name="currently_working"
              checked={experience.currently_working === 1}
              onChange={handleCheckboxChange}
              style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <label htmlFor="currently_working" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              I currently work here
            </label>
          </div>
        </div>

        {/* Company Logo Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>COMPANY LOGO PATH / URL</label>
            <input
              type="text"
              name="logo_url"
              placeholder="e.g. /logos/company.png"
              value={experience.logo_url}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>SELECT LOGO FROM MEDIA LIBRARY</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setExperience(prev => ({ ...prev, logo_url: e.target.value }));
                }
              }}
              style={selectStyle}
            >
              <option value="">-- Choose uploaded image --</option>
              {availableMedia.filter(m => m.file_type.startsWith('image/')).map(mediaItem => (
                <option key={mediaItem.id} value={mediaItem.url}>{mediaItem.filename}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>SUMMARY / GENERAL DESCRIPTION</label>
          <textarea
            name="description"
            rows={2}
            placeholder="Brief summary of your training activities, internship tasks, etc."
            value={experience.description}
            onChange={handleInputChange}
            style={textareaStyle}
          />
        </div>

        {/* Dynamic Bullet Points / Responsibilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            KEY RESPONSIBILITIES / BULLET POINTS
            <span title="Add at least one bullet point. Empty bullet points will be ignored upon save." style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
              <HelpCircle size={14} color="#8B98A8" />
            </span>
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {experience.bullet_points.map((bullet, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. Conduct hands-on training sessions in Embedded Systems, IoT, etc."
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(idx)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '0.8rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleAddBullet}
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Plus size={14} />
            <span>Add Bullet Point</span>
          </button>
        </div>

        {/* Technologies Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>TECHNOLOGIES WORKED WITH</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. ESP32, AVR, Embedded C, GPIO (Press enter to add)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={handleAddTag}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                padding: '0 1rem',
                borderRadius: '0.5rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          
          {/* Display Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '30px' }}>
            {experience.technologies.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: '#8B98A8', fontStyle: 'italic' }}>No tech tags added.</span>
            ) : (
              experience.technologies.map((tag, i) => (
                <span 
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{tag}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '12px',
                      height: '12px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// Form Input Styling Tokens
const inputStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.8rem 0.9rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

const textareaStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.8rem 0.9rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  resize: 'vertical',
  transition: 'border-color 0.2s',
};

const selectStyle: React.CSSProperties = {
  background: '#05080D',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F5F7FA',
  padding: '0.8rem 1.8rem 0.8rem 0.9rem',
  borderRadius: '0.5rem',
  outline: 'none',
  fontSize: '0.85rem',
  cursor: 'pointer',
};

export default ExperienceForm;
