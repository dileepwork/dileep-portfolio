import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, History, MapPin, Briefcase 
} from 'lucide-react';

interface Experience {
  id: number;
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

const ExperienceManagement: React.FC = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/experiences', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleTogglePublish = async (exp: Experience) => {
    const updatedPublished = exp.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/experiences/${exp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...exp,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setExperiences(experiences.map(e => 
          e.id === exp.id ? { ...e, published: updatedPublished } : e
        ));
      }
    } catch (err) {
      console.error('Error updating experience status:', err);
    }
  };

  const handleDuplicate = async (exp: Experience) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...exp,
          company: `${exp.company} (Copy)`,
          published: 0,
          display_order: exp.display_order + 1
        })
      });

      if (response.ok) {
        fetchExperiences(); // Reload
      }
    } catch (err) {
      console.error('Error duplicating experience:', err);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/experiences/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setExperiences(experiences.filter(e => e.id !== deleteId));
      }
    } catch (err) {
      console.error('Error deleting experience:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleMoveOrder = async (exp: Experience, direction: 'up' | 'down') => {
    const sorted = [...experiences].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(e => e.id === exp.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = exp.display_order;
      
      exp.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveExperienceOrder(exp);
      await saveExperienceOrder(swapWith);
      fetchExperiences();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = exp.display_order;
      
      exp.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveExperienceOrder(exp);
      await saveExperienceOrder(swapWith);
      fetchExperiences();
    }
  };

  const saveExperienceOrder = async (exp: Experience) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/experiences/${exp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(exp)
      });
    } catch (err) {
      console.error('Error saving experience order:', err);
    }
  };

  const sortedExperiences = [...experiences].sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Work Experience Logs</h2>
          <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Configure Dileep's professional timelines and internship milestones.</p>
        </div>
        <button
          onClick={() => navigate('/admin/experiences/new')}
          style={{
            background: '#10b981',
            color: '#05080D',
            border: 'none',
            padding: '0.8rem 1.4rem',
            borderRadius: '0.6rem',
            fontWeight: 850,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
          }}
        >
          <Plus size={16} />
          <span>New Experience</span>
        </button>
      </div>

      {/* Experience Table */}
      <div style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0.85rem',
        overflowX: 'auto',
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8' }}>Loading experience list...</div>
        ) : sortedExperiences.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8', fontSize: '0.9rem' }}>
            No experiences found. Click 'New Experience' to seed data.
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: '#8B98A8',
                fontWeight: 700
              }}>
                <th style={{ padding: '1rem 1.5rem', width: '50px' }}>Order</th>
                <th style={{ padding: '1rem 1.5rem' }}>Company & Role</th>
                <th style={{ padding: '1rem 1.5rem' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem' }}>Period</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExperiences.map((exp, idx) => (
                <tr 
                  key={exp.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                  }}
                >
                  {/* Sorting Buttons */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleMoveOrder(exp, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.15)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{exp.display_order}</span>
                      <button 
                        onClick={() => handleMoveOrder(exp, 'down')}
                        disabled={idx === sortedExperiences.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === sortedExperiences.length - 1 ? 'rgba(255,255,255,0.15)' : '#8B98A8', cursor: idx === sortedExperiences.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Company & Role */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {exp.logo_url ? (
                        <img 
                          src={exp.logo_url} 
                          alt={exp.company}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '0.25rem',
                            objectFit: 'cover',
                            border: '1px solid rgba(255,255,255,0.06)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '0.25rem',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8B98A8'
                        }}>
                          <History size={16} />
                        </div>
                      )}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F5F7FA' }}>{exp.role}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#8B98A8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Briefcase size={12} /> {exp.company}
                          {exp.location ? (
                            <>
                              <span style={{ opacity: 0.5 }}>•</span>
                              <MapPin size={10} /> {exp.location}
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      color: '#8B98A8',
                      fontWeight: 600
                    }}>
                      {exp.type || 'N/A'}
                    </span>
                  </td>

                  {/* Period */}
                  <td style={{ padding: '1rem 1.5rem', color: '#8B98A8' }}>
                    {exp.start_date} – {exp.currently_working === 1 ? 'Present' : exp.end_date}
                  </td>

                  {/* Status Toggle */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleTogglePublish(exp)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: exp.published === 1 ? '#10b981' : '#f59e0b',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {exp.published === 1 ? (
                        <>
                          <ToggleRight size={22} color="#10b981" />
                          <span>PUBLISHED</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={22} color="#f59e0b" />
                          <span>DRAFT</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/admin/experiences/edit/${exp.id}`)}
                        title="Edit Experience"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8B98A8',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '0.25rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#8B98A8'; e.currentTarget.style.background = 'none'; }}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDuplicate(exp)}
                        title="Duplicate Experience"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8B98A8',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '0.25rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#8B98A8'; e.currentTarget.style.background = 'none'; }}
                      >
                        <Trash2 size={16} style={{ transform: 'rotate(180deg)', display: 'none' }} />
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteId(exp.id)}
                        title="Delete Experience"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8B98A8',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '0.25rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#8B98A8'; e.currentTarget.style.background = 'none'; }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#0B1118',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '400px',
            padding: '2rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 0 30px rgba(239,68,68,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444', marginBottom: '0.8rem' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8B98A8', lineHeight: 1.5, marginBottom: '1.8rem' }}>
              Are you sure you want to delete this experience log? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F5F7FA',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: '#ef4444',
                  color: '#000',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;
