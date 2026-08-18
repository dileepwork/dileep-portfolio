import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, Share2, Sparkles, ExternalLink 
} from 'lucide-react';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  published: number;
}

const SocialLinksManagement: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    platform: 'LinkedIn',
    url: '',
    icon: 'linkedin',
    display_order: 0,
    published: 1
  });

  const platforms = ['LinkedIn', 'GitHub', 'Instagram', 'WhatsApp', 'Email', 'Portfolio', 'Other'];

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/social-links', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError('Failed to load social links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Sync icon name with platform in lower case by default
      if (name === 'platform') {
        updated.icon = value.toLowerCase();
      }
      return updated;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleEditClick = (link: SocialLink) => {
    setIsEditing(true);
    setEditId(link.id);
    setForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon || link.platform.toLowerCase(),
      display_order: link.display_order,
      published: link.published
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      platform: 'LinkedIn',
      url: '',
      icon: 'linkedin',
      display_order: 0,
      published: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditing && editId ? `/api/social-links/${editId}` : '/api/social-links';
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
        fetchLinks();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error saving social link:', err);
    }
  };

  const handleTogglePublish = async (link: SocialLink) => {
    const updatedPublished = link.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...link,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setLinks(links.map(l => 
          l.id === link.id ? { ...l, published: updatedPublished } : l
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setLinks(links.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (link: SocialLink, direction: 'up' | 'down') => {
    const sorted = [...links].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(l => l.id === link.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = link.display_order;
      
      link.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveLinkOrder(link);
      await saveLinkOrder(swapWith);
      fetchLinks();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = link.display_order;
      
      link.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveLinkOrder(link);
      await saveLinkOrder(swapWith);
      fetchLinks();
    }
  };

  const saveLinkOrder = async (link: SocialLink) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(link)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedLinks = [...links].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Social media handles</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure links for external contact points (LinkedIn, GitHub, etc.)</p>
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
        
        {/* SOCIAL LINK FORM PANEL */}
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
            {isEditing ? 'Modify Handle' : 'Create Social Handle'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>PLATFORM</label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleInputChange}
              style={selectStyle}
            >
              {platforms.map((plat, idx) => (
                <option key={idx} value={plat}>{plat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>URL ADDRESS</label>
            <input
              type="url"
              name="url"
              required
              placeholder="https://..."
              value={form.url}
              onChange={handleInputChange}
              style={inputStyle}
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
              {isEditing ? 'Update Handle' : 'Add Handle'}
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
            <Share2 size={18} color="#10b981" />
            REGISTERED HANDLES
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8' }}>Loading links...</div>
            ) : sortedLinks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8', fontSize: '0.85rem' }}>No handles saved.</div>
            ) : (
              sortedLinks.map((l, idx) => (
                <div 
                  key={l.id}
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
                        onClick={() => handleMoveOrder(l, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        onClick={() => handleMoveOrder(l, 'down')}
                        disabled={idx === sortedLinks.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === sortedLinks.length - 1 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === sortedLinks.length - 1 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{l.platform}</h4>
                      <p style={{ fontSize: '0.7rem', color: '#8B98A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                        {l.url}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <a 
                      href={l.url} 
                      target="_blank" 
                      rel="noreferrer"
                      title="Open URL"
                      style={{ color: '#10b981', display: 'flex', padding: '0.2rem' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                    
                    <button
                      onClick={() => handleTogglePublish(l)}
                      title={l.published === 1 ? 'Published' : 'Draft'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      {l.published === 1 ? (
                        <ToggleRight size={18} color="#10b981" />
                      ) : (
                        <ToggleLeft size={18} color="#f59e0b" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditClick(l)}
                      title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B98A8', padding: '0.2rem' }}
                    >
                      <Edit size={13} />
                    </button>

                    <button
                      onClick={() => handleDelete(l.id)}
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

// Form input styling tokens
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

export default SocialLinksManagement;
