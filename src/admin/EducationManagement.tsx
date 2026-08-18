import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, GraduationCap, Sparkles 
} from 'lucide-react';

interface Education {
  id: number;
  institution: string;
  degree: string;
  department: string;
  start_year: string;
  end_year: string;
  gpa: string;
  description: string;
  logo_url: string;
  display_order: number;
  published: number;
}

const EducationManagement: React.FC = () => {
  const [eduList, setEduList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    institution: '',
    degree: '',
    department: '',
    start_year: '',
    end_year: '',
    gpa: '',
    description: '',
    logo_url: '',
    display_order: 0,
    published: 1
  });

  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string }[]>([]);

  const fetchEdu = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/education', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEduList(data);
      }
    } catch (err) {
      console.error('Error fetching education:', err);
      setError('Failed to load education entries.');
    } finally {
      setLoading(false);
    }
  };

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
        await fetchEdu();
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleEditClick = (edu: Education) => {
    setIsEditing(true);
    setEditId(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      department: edu.department || '',
      start_year: edu.start_year || '',
      end_year: edu.end_year || '',
      gpa: edu.gpa || '',
      description: edu.description || '',
      logo_url: edu.logo_url || '',
      display_order: edu.display_order,
      published: edu.published
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      institution: '',
      degree: '',
      department: '',
      start_year: '',
      end_year: '',
      gpa: '',
      description: '',
      logo_url: '',
      display_order: 0,
      published: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim()) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditing && editId ? `/api/education/${editId}` : '/api/education';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        fetchEdu();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error saving education record:', err);
    }
  };

  const handleTogglePublish = async (edu: Education) => {
    const updatedPublished = edu.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/education/${edu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...edu,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setEduList(eduList.map(e => 
          e.id === edu.id ? { ...e, published: updatedPublished } : e
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setEduList(eduList.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (edu: Education, direction: 'up' | 'down') => {
    const sorted = [...eduList].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(e => e.id === edu.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = edu.display_order;
      
      edu.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveEduOrder(edu);
      await saveEduOrder(swapWith);
      fetchEdu();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = edu.display_order;
      
      edu.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveEduOrder(edu);
      await saveEduOrder(swapWith);
      fetchEdu();
    }
  };

  const saveEduOrder = async (edu: Education) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/education/${edu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(edu)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedEdu = [...eduList].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Education timeline CMS</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure Dileep's academic profiles, degrees, and performance indicators.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* EDUCATION FORM PANEL */}
        <form onSubmit={handleSubmit} style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} />
            {isEditing ? 'Modify Education Log' : 'Add Academic Record'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>INSTITUTION NAME</label>
            <input
              type="text"
              name="institution"
              required
              placeholder="e.g. Kongu Engineering College"
              value={form.institution}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DEGREE / COURSE TITLE</label>
            <input
              type="text"
              name="degree"
              required
              placeholder="e.g. Bachelor of Engineering"
              value={form.degree}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DEPARTMENT / SPECIALIZATION</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Electronics and Communication Engineering"
              value={form.department}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>START YEAR</label>
              <input
                type="text"
                name="start_year"
                placeholder="e.g. 2022"
                value={form.start_year}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>END YEAR</label>
              <input
                type="text"
                name="end_year"
                placeholder="e.g. 2026"
                value={form.end_year}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CGPA / GRADE</label>
              <input
                type="text"
                name="gpa"
                placeholder="e.g. 8.45 or 85%"
                value={form.gpa}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>SELECT LOGO</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setForm(prev => ({ ...prev, logo_url: e.target.value }));
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
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>LOGO URL</label>
              <input
                type="text"
                name="logo_url"
                placeholder="/uploads/logo.png"
                value={form.logo_url}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DESCRIPTION</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Key achievements, courses, or highlights..."
              value={form.description}
              onChange={handleInputChange}
              style={textareaStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DISPLAY ORDER</label>
              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.2rem' }}>
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={form.published === 1}
                onChange={handleCheckboxChange}
                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <label htmlFor="published" style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                Published
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F5F7FA',
                  padding: '0.7rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={{
                flex: 2,
                background: '#10b981',
                color: '#05080D',
                border: 'none',
                padding: '0.7rem',
                borderRadius: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              {isEditing ? 'Update Entry' : 'Add Entry'}
            </button>
          </div>
        </form>

        {/* LIST DISPLAY PANEL */}
        <div style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5F7FA', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <GraduationCap size={18} color="#10b981" />
            ACADEMIC LOGS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8' }}>Loading education records...</div>
            ) : sortedEdu.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8', fontSize: '0.85rem' }}>No academic records entered.</div>
            ) : (
              sortedEdu.map((e, idx) => (
                <div 
                  key={e.id}
                  style={{
                    background: '#101923',
                    borderRadius: '0.6rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                      <button 
                        onClick={() => handleMoveOrder(e, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        onClick={() => handleMoveOrder(e, 'down')}
                        disabled={idx === sortedEdu.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === sortedEdu.length - 1 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === sortedEdu.length - 1 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.degree}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#8B98A8', marginTop: '0.15rem' }}>
                        {e.institution}
                        {e.start_year ? ` (${e.start_year} – ${e.end_year || 'Present'})` : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <button
                      onClick={() => handleTogglePublish(e)}
                      title={e.published === 1 ? 'Published' : 'Draft'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      {e.published === 1 ? (
                        <ToggleRight size={18} color="#10b981" />
                      ) : (
                        <ToggleLeft size={18} color="#f59e0b" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditClick(e)}
                      title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B98A8', padding: '0.2rem' }}
                    >
                      <Edit size={13} />
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styling Object Tokens
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

export default EducationManagement;
