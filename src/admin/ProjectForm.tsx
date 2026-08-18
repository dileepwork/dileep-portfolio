import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Eye, 
  Sparkles, Lightbulb, Target, Zap 
} from 'lucide-react';

interface Project {
  title: string;
  short_description: string;
  full_description: string;
  category: string;
  technologies: string[];
  image: string;
  gallery_images: string[];
  github_url: string;
  live_demo_url: string;
  video_url: string;
  featured: number;
  status: string;
  start_date: string;
  end_date: string;
  display_order: number;
  published: number;
  problem: string;
  solution: string;
  role: string;
  outcome: string;
}

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [project, setProject] = useState<Project>({
    title: '',
    short_description: '',
    full_description: '',
    category: 'Embedded',
    technologies: [],
    image: '',
    gallery_images: [],
    github_url: '',
    live_demo_url: '',
    video_url: '',
    featured: 0,
    status: 'Published',
    start_date: '',
    end_date: '',
    display_order: 0,
    published: 1,
    problem: '',
    solution: '',
    role: '',
    outcome: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Tag input state
  const [newTag, setNewTag] = useState('');
  
  // Live Preview Toggle
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFlippedPreview, setIsFlippedPreview] = useState(false);

  // Available media list for selection
  const [availableMedia, setAvailableMedia] = useState<{ id: number; url: string; filename: string; file_type: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('cyber_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const loadData = async () => {
      try {
        // Load media files
        const resMedia = await fetch('/api/media', { headers });
        if (resMedia.ok) {
          const media = await resMedia.json();
          setAvailableMedia(media);
        }

        if (isEditMode) {
          const resProj = await fetch(`/api/projects/${id}`, { headers });
          if (!resProj.ok) throw new Error('Failed to load project details');
          const data = await resProj.json();
          setProject(data);
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
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProject(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !project.technologies.includes(newTag.trim())) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tagToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent, forceStatus?: string) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    let projectPayload = { ...project };
    if (forceStatus) {
      projectPayload.status = forceStatus;
      projectPayload.published = forceStatus === 'Published' ? 1 : 0;
    }

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const url = isEditMode ? `/api/projects/${id}` : '/api/projects';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save project');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#8B98A8', textAlign: 'center', padding: '4rem' }}>Loading project editor...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/admin/projects')}
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
          <span>Back to Projects list</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            style={{
              background: '#0B1118',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Eye size={16} />
            <span>{isPreviewOpen ? 'Hide Preview' : 'Show Card Preview'}</span>
          </button>

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

      {/* Inline Alerts */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} />
          <span>Project details updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Main Splits Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isPreviewOpen ? '1fr 340px' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* FORM PANEL */}
        <form onSubmit={(e) => handleSave(e)} style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            {isEditMode ? 'Modify Project Attributes' : 'Create New Project Record'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>PROJECT TITLE</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. CodeForge Studio"
                value={project.title}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>CATEGORY</label>
              <select
                name="category"
                value={project.category}
                onChange={handleInputChange}
                style={selectStyle}
              >
                <option value="Embedded">Embedded</option>
                <option value="IoT">IoT</option>
                <option value="Software">Software</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Display Order */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>DISPLAY ORDER</label>
              <input
                type="number"
                name="display_order"
                value={project.display_order}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>STATUS</label>
              <select
                name="status"
                value={project.status}
                onChange={handleInputChange}
                style={selectStyle}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>
            
            {/* Featured Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', height: '100%', paddingTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={project.featured === 1}
                onChange={handleCheckboxChange}
                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Mark as Featured Project
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>SHORT DESCRIPTION (CARD DISPLAY)</label>
            <input
              type="text"
              name="short_description"
              required
              placeholder="Keep it brief (1 sentence summarizing project)"
              value={project.short_description}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Full Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>FULL DESCRIPTION</label>
            <textarea
              name="full_description"
              rows={4}
              placeholder="Detailed description of project structure and usage..."
              value={project.full_description}
              onChange={handleInputChange}
              style={textareaStyle}
            />
          </div>

          {/* Image & Select Media */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>PROJECT IMAGE PATH / URL</label>
              <input
                type="text"
                name="image"
                placeholder="/projects/example.png"
                value={project.image}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>SELECT FROM MEDIA LIBRARY</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setProject(prev => ({ ...prev, image: e.target.value }));
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

          {/* Core Flip-Card Details (Challenge, Solution, Role, Impact) */}
          <div style={{
            background: '#101923',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} />
              Nexus Details (Interactive Card Fields)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 650 }}>CHALLENGE / PROBLEM STATEMENT</label>
                <textarea
                  name="problem"
                  rows={2}
                  placeholder="The issue or hurdle being solved"
                  value={project.problem}
                  onChange={handleInputChange}
                  style={textareaStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 650 }}>SOLUTION</label>
                <textarea
                  name="solution"
                  rows={2}
                  placeholder="How you engineered the fix"
                  value={project.solution}
                  onChange={handleInputChange}
                  style={textareaStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 650 }}>YOUR ROLE / RESPONSIBILITIES</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Firmware development, PCB layout design"
                  value={project.role}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 650 }}>IMPACT / OUTCOME</label>
                <input
                  type="text"
                  name="outcome"
                  placeholder="e.g. 25% battery life boost, robust prototype"
                  value={project.outcome}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>GITHUB CODE LINK</label>
              <input
                type="url"
                name="github_url"
                placeholder="https://github.com/..."
                value={project.github_url}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>LIVE DEMO LINK</label>
              <input
                type="url"
                name="live_demo_url"
                placeholder="https://..."
                value={project.live_demo_url}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>VIDEO DEMO URL</label>
              <input
                type="url"
                name="video_url"
                placeholder="https://youtube.com/..."
                value={project.video_url}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Technologies Tags Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>TECHNOLOGY TAGS</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Type tag and press enter/click Add (e.g. ESP32)"
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
              {project.technologies.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#8B98A8', fontStyle: 'italic' }}>No tags added yet.</span>
              ) : (
                project.technologies.map((tag, i) => (
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>START DATE</label>
              <input
                type="text"
                name="start_date"
                placeholder="e.g. June 2026 or 22/06/2026"
                value={project.start_date}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            {/* End Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#8B98A8', fontWeight: 600 }}>END DATE (OR PRESENT)</label>
              <input
                type="text"
                name="end_date"
                placeholder="e.g. July 2026 or Present"
                value={project.end_date}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>
        </form>

        {/* LIVE PREVIEW SIDE-PANEL */}
        {isPreviewOpen && (
          <aside style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: '#0B1118',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '340px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', color: '#10b981' }}>
                LIVE DECK PREVIEW
              </h4>
              <button 
                type="button" 
                onClick={() => setIsFlippedPreview(!isFlippedPreview)}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#000',
                  background: '#10b981',
                  border: 'none',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                FLIP CARD
              </button>
            </div>

            {/* Simulated Flip Card Unit */}
            <div style={{
              width: '100%',
              height: '380px',
              position: 'relative',
              perspective: '1000px',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s',
                transform: isFlippedPreview ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Front Side */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  background: 'rgba(5, 20, 12, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem'
                }}>
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt="" 
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, zIndex: -1 }} 
                    />
                  ) : null}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', zIndex: -1 }} />
                  
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.4rem', color: '#fff' }}>
                      {project.title || 'Untitled Project'}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                      {project.short_description || 'Write a short description to view it here...'}
                    </p>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {project.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '1rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.5 }}>
                    <Zap size={16} color="#10b981" />
                  </div>
                </div>

                {/* Back Side */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  background: 'rgba(4, 12, 8, 0.95)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  overflowY: 'auto'
                }}>
                  <div style={{ borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '0.35rem' }}>
                    <h3 style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 900 }}>{project.title || 'Untitled Project'}</h3>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.7rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase' }}>
                        <Lightbulb size={10} /> Challenge
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{project.problem || 'N/A'}</p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                        <Target size={10} /> Solution
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{project.solution || 'N/A'}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                      <div>
                        <div style={{ color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>Role</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{project.role || 'N/A'}</p>
                      </div>
                      <div>
                        <div style={{ color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>Impact</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{project.outcome || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.4rem' }}>
                    <button 
                      type="button"
                      style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#fff', padding: '0.35rem', borderRadius: '0.35rem', fontSize: '0.65rem', cursor: 'not-allowed', opacity: 0.5 }}
                    >
                      Code
                    </button>
                    <button 
                      type="button"
                      style={{ flex: 1, background: '#10b981', border: 'none', color: '#000', padding: '0.35rem', borderRadius: '0.35rem', fontSize: '0.65rem', fontWeight: 750, cursor: 'not-allowed', opacity: 0.5 }}
                    >
                      Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.72rem', color: '#8B98A8', textAlign: 'center', fontStyle: 'italic', marginTop: '0.5rem' }}>
              Mouse-over or click "FLIP CARD" to toggle sides.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
};

// Styling Object Tokens
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

export default ProjectForm;
