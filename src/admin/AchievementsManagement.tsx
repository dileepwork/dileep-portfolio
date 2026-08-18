import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, Trophy, Sparkles 
} from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  organization: string;
  date: string;
  description: string;
  image_url: string;
  certificate_url: string;
  display_order: number;
  published: number;
}

const AchievementsManagement: React.FC = () => {
  const [achs, setAchs] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    image_url: '',
    certificate_url: '',
    display_order: 0,
    published: 1
  });

  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string }[]>([]);

  const fetchAchs = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAchs(data);
      }
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError('Failed to load achievements.');
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
        await fetchAchs();
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

  const handleEditClick = (ach: Achievement) => {
    setIsEditing(true);
    setEditId(ach.id);
    setForm({
      title: ach.title,
      organization: ach.organization,
      date: ach.date || '',
      description: ach.description || '',
      image_url: ach.image_url || '',
      certificate_url: ach.certificate_url || '',
      display_order: ach.display_order,
      published: ach.published
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: '',
      organization: '',
      date: '',
      description: '',
      image_url: '',
      certificate_url: '',
      display_order: 0,
      published: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.organization.trim()) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditing && editId ? `/api/achievements/${editId}` : '/api/achievements';
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
        fetchAchs();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error saving achievement:', err);
    }
  };

  const handleTogglePublish = async (ach: Achievement) => {
    const updatedPublished = ach.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/achievements/${ach.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...ach,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setAchs(achs.map(a => 
          a.id === ach.id ? { ...a, published: updatedPublished } : a
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setAchs(achs.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (ach: Achievement, direction: 'up' | 'down') => {
    const sorted = [...achs].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(a => a.id === ach.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = ach.display_order;
      
      ach.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveAchOrder(ach);
      await saveAchOrder(swapWith);
      fetchAchs();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = ach.display_order;
      
      ach.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveAchOrder(ach);
      await saveAchOrder(swapWith);
      fetchAchs();
    }
  };

  const saveAchOrder = async (ach: Achievement) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/achievements/${ach.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ach)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedAchs = [...achs].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Awards & Recognition CMS</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure Dileep's hackathon achievements and engineering competition honors.</p>
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
        
        {/* ACHIEVEMENT FORM PANEL */}
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
            {isEditing ? 'Modify Achievement' : 'Add New Achievement'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>ACHIEVEMENT TITLE / AWARD NAME</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. 1st Place Hackathon Winner"
              value={form.title}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>HOSTING ORGANIZATION / INSTITUTION</label>
            <input
              type="text"
              name="organization"
              required
              placeholder="e.g. Smart India Hackathon"
              value={form.organization}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DATE OF AWARD</label>
              <input
                type="text"
                name="date"
                placeholder="e.g. May 2025"
                value={form.date}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>SELECT DISPLAY IMAGE</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setForm(prev => ({ ...prev, image_url: e.target.value }));
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
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>IMAGE PATH URL</label>
              <input
                type="text"
                name="image_url"
                placeholder="/uploads/award.png"
                value={form.image_url}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>VERIFICATION CERTIFICATE URL</label>
            <input
              type="text"
              name="certificate_url"
              placeholder="e.g. Verification URL or PDF"
              value={form.certificate_url}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>DESCRIPTION</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Description of the competition, project, and recognition elements..."
              value={form.description}
              onChange={handleInputChange}
              style={textareaStyle}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.4rem' }}>
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={form.published === 1}
              onChange={handleCheckboxChange}
              style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <label htmlFor="published" style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Published (show on public site)
            </label>
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
              {isEditing ? 'Update Achievement' : 'Add Achievement'}
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
            <Trophy size={18} color="#10b981" />
            ACHIEVEMENTS ARCHIVE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8' }}>Loading achievements list...</div>
            ) : sortedAchs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8', fontSize: '0.85rem' }}>No achievements recorded.</div>
            ) : (
              sortedAchs.map((a, idx) => (
                <div 
                  key={a.id}
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
                        onClick={() => handleMoveOrder(a, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        onClick={() => handleMoveOrder(a, 'down')}
                        disabled={idx === sortedAchs.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === sortedAchs.length - 1 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === sortedAchs.length - 1 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.title}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#8B98A8', marginTop: '0.15rem' }}>
                        {a.organization}
                        {a.date ? ` • ${a.date}` : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <button
                      onClick={() => handleTogglePublish(a)}
                      title={a.published === 1 ? 'Published' : 'Draft'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      {a.published === 1 ? (
                        <ToggleRight size={18} color="#10b981" />
                      ) : (
                        <ToggleLeft size={18} color="#f59e0b" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditClick(a)}
                      title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B98A8', padding: '0.2rem' }}
                    >
                      <Edit size={13} />
                    </button>

                    <button
                      onClick={() => handleDelete(a.id)}
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

// Form styling tokens
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

export default AchievementsManagement;
