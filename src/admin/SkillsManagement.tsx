import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, 
  ArrowUp, ArrowDown, Cpu, Sparkles 
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  proficiency: string;
  display_order: number;
  published: number;
}

const SkillsManagement: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State for Adding / Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Programming',
    icon: 'cpu',
    proficiency: 'Advanced',
    display_order: 0,
    published: 1
  });

  const categories = ['Programming', 'Embedded Systems', 'IoT', 'AI / Software'];

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/skills', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleEditClick = (skill: Skill) => {
    setIsEditing(true);
    setEditId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || 'cpu',
      proficiency: skill.proficiency || 'Advanced',
      display_order: skill.display_order,
      published: skill.published
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
      category: 'Programming',
      icon: 'cpu',
      proficiency: 'Advanced',
      display_order: 0,
      published: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditing && editId ? `/api/skills/${editId}` : '/api/skills';
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
        fetchSkills();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleTogglePublish = async (skill: Skill) => {
    const updatedPublished = skill.published === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...skill,
          published: updatedPublished
        })
      });

      if (response.ok) {
        setSkills(skills.map(s => 
          s.id === skill.id ? { ...s, published: updatedPublished } : s
        ));
      }
    } catch (err) {
      console.error('Error toggling skill publish status:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSkills(skills.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleMoveOrder = async (skill: Skill, direction: 'up' | 'down') => {
    // Filter and sort skills within the same category to reorder
    const categorySkills = skills
      .filter(s => s.category === skill.category)
      .sort((a, b) => a.display_order - b.display_order);

    const index = categorySkills.findIndex(s => s.id === skill.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = categorySkills[index - 1];
      const tempOrder = skill.display_order;
      
      skill.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveSkillOrder(skill);
      await saveSkillOrder(swapWith);
      fetchSkills();
    } else if (direction === 'down' && index < categorySkills.length - 1) {
      const swapWith = categorySkills[index + 1];
      const tempOrder = skill.display_order;
      
      skill.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveSkillOrder(skill);
      await saveSkillOrder(swapWith);
      fetchSkills();
    }
  };

  const saveSkillOrder = async (skill: Skill) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skill)
      });
    } catch (err) {
      console.error('Error swapping skill order:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Technical Arsenal CMS</h2>
        <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Manage and order Dileep's engineering skill tags and categories.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Editor Form and Skills Display Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* SKILL FORM PANEL */}
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
            {isEditing ? 'Edit Skill Record' : 'Add New Skill'}
          </h3>

          {/* Skill Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>SKILL NAME</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Embedded C"
              value={form.name}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>CATEGORY</label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              style={selectStyle}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Proficiency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>PROFICIENCY LEVEL</label>
            <select
              name="proficiency"
              value={form.proficiency}
              onChange={handleInputChange}
              style={selectStyle}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Display Order */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#8B98A8', fontWeight: 600 }}>ORDER</label>
              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Published Checkbox */}
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
              {isEditing ? (
                <span>Update Skill</span>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Skill</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* LIST DISPLAY PANEL GROUPED BY CATEGORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8B98A8' }}>Loading technical arsenal list...</div>
          ) : (
            categories.map((cat, idx) => {
              const catSkills = skills
                .filter(s => s.category === cat)
                .sort((a, b) => a.display_order - b.display_order);

              return (
                <div 
                  key={idx}
                  style={{
                    background: '#0B1118',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1rem',
                    padding: '1.25rem'
                  }}
                >
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F5F7FA', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Cpu size={14} color="#10b981" />
                    {cat.toUpperCase()}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {catSkills.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: '#8B98A8', fontStyle: 'italic', padding: '0.5rem 0' }}>No skills in this category.</span>
                    ) : (
                      catSkills.map((sk, skIdx) => (
                        <div 
                          key={sk.id}
                          style={{
                            background: '#101923',
                            borderRadius: '0.5rem',
                            padding: '0.6rem 0.85rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.02)'
                          }}
                        >
                          {/* Left: Reordering & Details */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <button 
                                onClick={() => handleMoveOrder(sk, 'up')}
                                disabled={skIdx === 0}
                                style={{ background: 'none', border: 'none', color: skIdx === 0 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: skIdx === 0 ? 'not-allowed' : 'pointer', padding: '0.1rem' }}
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => handleMoveOrder(sk, 'down')}
                                disabled={skIdx === catSkills.length - 1}
                                style={{ background: 'none', border: 'none', color: skIdx === catSkills.length - 1 ? 'rgba(255,255,255,0.1)' : '#8B98A8', cursor: skIdx === catSkills.length - 1 ? 'not-allowed' : 'pointer', padding: '0.1rem' }}
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>

                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>{sk.name}</span>
                                <span style={{
                                  fontSize: '0.55rem',
                                  fontWeight: 800,
                                  background: sk.proficiency === 'Advanced' ? 'rgba(16, 185, 129, 0.15)' : sk.proficiency === 'Intermediate' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: sk.proficiency === 'Advanced' ? '#10b981' : sk.proficiency === 'Intermediate' ? '#3b82f6' : '#f59e0b',
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '0.2rem'
                                }}>
                                  {sk.proficiency}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleTogglePublish(sk)}
                              title={sk.published === 1 ? 'Published' : 'Draft'}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                            >
                              {sk.published === 1 ? (
                                <ToggleRight size={18} color="#10b981" />
                              ) : (
                                <ToggleLeft size={18} color="#f59e0b" />
                              )}
                            </button>

                            <button
                              onClick={() => handleEditClick(sk)}
                              title="Edit Skill"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B98A8', padding: '0.2rem' }}
                            >
                              <Edit size={13} />
                            </button>

                            <button
                              onClick={() => handleDelete(sk.id)}
                              title="Delete Skill"
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Form Styling Tokens
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

export default SkillsManagement;
