import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Copy, ToggleLeft, ToggleRight, 
  Search, SlidersHorizontal, ArrowUp, ArrowDown, Star, Image as ImageIcon 
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  status: string;
  published: number;
  featured: number;
  display_order: number;
  image: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  gallery_images: string[];
  github_url: string;
  live_demo_url: string;
  video_url: string;
  problem: string;
  solution: string;
  role: string;
  outcome: string;
}

const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Deletion Modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (project: Project) => {
    const updatedPublished = project.published === 1 ? 0 : 1;
    const updatedStatus = updatedPublished === 1 ? 'Published' : 'Unpublished';
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...project,
          published: updatedPublished,
          status: updatedStatus
        })
      });

      if (response.ok) {
        setProjects(projects.map(p => 
          p.id === project.id 
            ? { ...p, published: updatedPublished, status: updatedStatus } 
            : p
        ));
      }
    } catch (err) {
      console.error('Error updating project status:', err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const updatedFeatured = project.featured === 1 ? 0 : 1;
    
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...project,
          featured: updatedFeatured
        })
      });

      if (response.ok) {
        setProjects(projects.map(p => 
          p.id === project.id ? { ...p, featured: updatedFeatured } : p
        ));
      }
    } catch (err) {
      console.error('Error updating project featured status:', err);
    }
  };

  const handleDuplicate = async (project: Project) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...project,
          title: `${project.title} (Copy)`,
          published: 0,
          status: 'Draft',
          display_order: project.display_order + 1
        })
      });

      if (response.ok) {
        fetchProjects(); // Reload projects
      }
    } catch (err) {
      console.error('Error duplicating project:', err);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/projects/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== deleteId));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleMoveOrder = async (project: Project, direction: 'up' | 'down') => {
    // Sort array by order
    const sorted = [...projects].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex(p => p.id === project.id);
    
    if (direction === 'up' && index > 0) {
      const swapWith = sorted[index - 1];
      const tempOrder = project.display_order;
      
      // Update locally first
      project.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveProjectOrder(project);
      await saveProjectOrder(swapWith);
      fetchProjects();
    } else if (direction === 'down' && index < sorted.length - 1) {
      const swapWith = sorted[index + 1];
      const tempOrder = project.display_order;
      
      // Update locally first
      project.display_order = swapWith.display_order;
      swapWith.display_order = tempOrder;
      
      await saveProjectOrder(project);
      await saveProjectOrder(swapWith);
      fetchProjects();
    }
  };

  const saveProjectOrder = async (project: Project) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });
    } catch (err) {
      console.error('Error swapping project order:', err);
    }
  };

  // Filter Categories list
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filtering Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.short_description.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'published' && p.published === 1) ||
                          (statusFilter === 'draft' && (p.status === 'Draft' || p.published === 0));
    return matchesSearch && matchesCat && matchesStatus;
  }).sort((a, b) => a.display_order - b.display_order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Projects Portfolio Library</h2>
          <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Manage and configure Dileep's project nexus stack.</p>
        </div>
        <button
          onClick={() => navigate('/admin/projects/new')}
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
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0.75rem',
        padding: '1.2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#8B98A8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by title, description or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#05080D',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#F5F7FA',
              padding: '0.7rem 1rem 0.7rem 2.8rem',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '0.85rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Category Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={14} color="#8B98A8" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              background: '#05080D',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#F5F7FA',
              padding: '0.7rem 1.5rem 0.7rem 0.7rem',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#05080D',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#F5F7FA',
              padding: '0.7rem 1.5rem 0.7rem 0.7rem',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">ALL STATUSES</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFTS</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0.85rem',
        overflowX: 'auto',
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8' }}>Loading projects list...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8', fontSize: '0.9rem' }}>
            No projects matched search criteria.
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
                <th style={{ padding: '1rem 1.5rem' }}>Project</th>
                <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Featured</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((proj, idx) => (
                <tr 
                  key={proj.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                >
                  {/* Sorting Buttons */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleMoveOrder(proj, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.15)' : '#8B98A8', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{proj.display_order}</span>
                      <button 
                        onClick={() => handleMoveOrder(proj, 'down')}
                        disabled={idx === filteredProjects.length - 1}
                        style={{ background: 'none', border: 'none', color: idx === filteredProjects.length - 1 ? 'rgba(255,255,255,0.15)' : '#8B98A8', cursor: idx === filteredProjects.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Project Info */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {proj.image ? (
                        <img 
                          src={proj.image} 
                          alt={proj.title}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '0.35rem',
                            objectFit: 'cover',
                            border: '1px solid rgba(255,255,255,0.06)'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '0.35rem',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          display: proj.image ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8B98A8'
                        }}
                      >
                        <ImageIcon size={18} />
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F5F7FA' }}>{proj.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#8B98A8', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proj.short_description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{proj.category}</td>

                  {/* Status Toggle */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleTogglePublish(proj)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: proj.published === 1 ? '#10b981' : '#f59e0b',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {proj.published === 1 ? (
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

                  {/* Featured */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleFeatured(proj)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Star 
                        size={18} 
                        fill={proj.featured === 1 ? '#10b981' : 'none'} 
                        color={proj.featured === 1 ? '#10b981' : '#8B98A8'} 
                      />
                    </button>
                  </td>

                  {/* Actions Buttons */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/admin/projects/edit/${proj.id}`)}
                        title="Edit Project"
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
                        onClick={() => handleDuplicate(proj)}
                        title="Duplicate Project"
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
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteId(proj.id)}
                        title="Delete Project"
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
              Are you sure you want to delete this project from the database? This action is permanent and cannot be undone.
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
