import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, Award, Sparkles, ExternalLink 
} from 'lucide-react';

interface Certificate {
  id: number;
  name: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  verification_url: string;
  file_url: string;
  description: string;
  display_order: number;
  published: number;
}

const CertificatesManagement: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    organization: '',
    issue_date: '',
    credential_id: '',
    verification_url: '',
    file_url: '',
    description: '',
    display_order: 0,
    published: 1
  });

  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string }[]>([]);

  const fetchCerts = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/certificates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCerts(data);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to load certificates.');
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
        await fetchCerts();
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

  const handleEditClick = (cert: Certificate) => {
    setIsEditing(true);
    setEditId(cert.id);
    setForm({
      name: cert.name,
      organization: cert.organization,
      issue_date: cert.issue_date || '',
      credential_id: cert.credential_id || '',
      verification_url: cert.verification_url || '',
      file_url: cert.file_url || '',
      description: cert.description || '',
      display_order: cert.display_order,
      published: cert.published
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: '',
      organization: '',
      issue_date: '',
      credential_id: '',
      verification_url: '',
      file_url: '',
      description: '',
      display_order: 0,
      published: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.organization.trim()) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditing && editId ? `/api/certificates/${editId}` : '/api/certificates';
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
        fetchCerts();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error saving certificate:', err);
    }
  };

  const handleTogglePublish = async (cert: Certificate) => {
    const updatedPublished = cert.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/certificates/${cert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...cert,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setCerts(certs.map(c => 
          c.id === cert.id ? { ...c, published: updatedPublished } : c
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setCerts(certs.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (cert: Certificate, direction: 'up' | 'down') => {
    const sorted = [...certs].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(c => c.id === cert.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = cert.display_order;
      
      cert.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveCertOrder(cert);
      await saveCertOrder(swapWith);
      fetchCerts();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = cert.display_order;
      
      cert.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveCertOrder(cert);
      await saveCertOrder(swapWith);
      fetchCerts();
    }
  };

  const saveCertOrder = async (cert: Certificate) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/certificates/${cert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cert)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedCerts = [...certs].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Certification credentials</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure Dileep's professional hardware and software certificates.</p>
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
        
        {/* CERTIFICATE FORM PANEL */}
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
            {isEditing ? 'Modify Certificate' : 'Add New Certificate'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CERTIFICATE NAME</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. IoT Architecture Specialist"
              value={form.name}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>ISSUING ORGANIZATION</label>
            <input
              type="text"
              name="organization"
              required
              placeholder="e.g. Hailstone Technology"
              value={form.organization}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>ISSUE DATE</label>
              <input
                type="text"
                name="issue_date"
                placeholder="e.g. June 2026"
                value={form.issue_date}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CREDENTIAL ID</label>
              <input
                type="text"
                name="credential_id"
                placeholder="e.g. CERT-982-192"
                value={form.credential_id}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>VERIFICATION URL</label>
            <input
              type="url"
              name="verification_url"
              placeholder="https://..."
              value={form.verification_url}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>SELECT PDF/IMAGE</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setForm(prev => ({ ...prev, file_url: e.target.value }));
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
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>FILE PATH URL</label>
              <input
                type="text"
                name="file_url"
                placeholder="/uploads/file.pdf"
                value={form.file_url}
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
              placeholder="Summary of certification components..."
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
              {isEditing ? 'Update Certificate' : 'Add Certificate'}
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
            <Award size={18} color="#10b981" />
            CREDENTIAL ARCHIVE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8' }}>Loading certificates list...</div>
            ) : sortedCerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8', fontSize: '0.85rem' }}>No certificates added.</div>
            ) : (
              sortedCerts.map((c, idx) => (
                <div 
                  key={c.id}
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
                        onClick={() => handleMoveOrder(c, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        onClick={() => handleMoveOrder(c, 'down')}
                        disabled={idx === sortedCerts.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === sortedCerts.length - 1 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: idx === sortedCerts.length - 1 ? 'not-allowed' : 'pointer', padding: '0.05rem' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#8B98A8', marginTop: '0.15rem' }}>
                        {c.organization}
                        {c.issue_date ? ` • ${c.issue_date}` : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    {c.verification_url ? (
                      <a 
                        href={c.verification_url} 
                        target="_blank" 
                        rel="noreferrer"
                        title="Verify Credential"
                        style={{ color: '#10b981', display: 'flex', padding: '0.2rem' }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    ) : null}
                    
                    <button
                      onClick={() => handleTogglePublish(c)}
                      title={c.published === 1 ? 'Published' : 'Draft'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      {c.published === 1 ? (
                        <ToggleRight size={18} color="#10b981" />
                      ) : (
                        <ToggleLeft size={18} color="#f59e0b" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEditClick(c)}
                      title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B98A8', padding: '0.2rem' }}
                    >
                      <Edit size={13} />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
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

export default CertificatesManagement;
