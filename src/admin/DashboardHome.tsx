import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, History, Cpu, Award, Trophy, 
  Mail, Plus, Clock 
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  status: string;
  published: number;
  created_at: string;
}


interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
}

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
    certificates: 0,
    achievements: 0,
    messages: 0,
    unreadMessages: 0,
    draftProjects: 0
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resProj, resExp, resSkill, resCert, resAch, resMsg] = await Promise.all([
        fetch('/api/projects', { headers }),
        fetch('/api/experiences', { headers }),
        fetch('/api/skills', { headers }),
        fetch('/api/certificates', { headers }),
        fetch('/api/achievements', { headers }),
        fetch('/api/contact-messages', { headers })
      ]);

      const projectsData = resProj.ok ? await resProj.json() : [];
      const experiencesData = resExp.ok ? await resExp.json() : [];
      const skillsData = resSkill.ok ? await resSkill.json() : [];
      const certsData = resCert.ok ? await resCert.json() : [];
      const achsData = resAch.ok ? await resAch.json() : [];
      const messagesData = resMsg.ok ? await resMsg.json() : [];

      setStats({
        projects: projectsData.length,
        experiences: experiencesData.length,
        skills: skillsData.length,
        certificates: certsData.length,
        achievements: achsData.length,
        messages: messagesData.length,
        unreadMessages: messagesData.filter((m: Message) => m.status === 'unread').length,
        draftProjects: projectsData.filter((p: Project) => p.status === 'Draft' || p.published === 0).length
      });

      setRecentProjects(projectsData.slice(0, 3));
      setRecentMessages(messagesData.slice(0, 3));

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: <Briefcase size={22} color="#10b981" />, link: '/admin/projects' },
    { label: 'Experiences', value: stats.experiences, icon: <History size={22} color="#3b82f6" />, link: '/admin/experiences' },
    { label: 'Skills', value: stats.skills, icon: <Cpu size={22} color="#f59e0b" />, link: '/admin/skills' },
    { label: 'Certificates', value: stats.certificates, icon: <Award size={22} color="#ec4899" />, link: '/admin/certificates' },
    { label: 'Achievements', value: stats.achievements, icon: <Trophy size={22} color="#8b5cf6" />, link: '/admin/achievements' },
    { label: 'Inbox Messages', value: stats.messages, icon: <Mail size={22} color="#06b6d4" />, link: '/admin/contact', alertValue: stats.unreadMessages }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass" style={{ height: '110px', borderRadius: '0.75rem', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div className="glass" style={{ height: '300px', borderRadius: '1rem', animation: 'pulse 1.5s infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 0.6; }
            100% { opacity: 0.3; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. Stat Summary Cards Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1.25rem'
      }}>
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            style={{
              background: '#101923',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.85rem',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '120px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top Row: Icon & Alert Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </div>
              
              {card.alertValue && card.alertValue > 0 ? (
                <span style={{
                  background: '#ef4444',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '1rem',
                  letterSpacing: '0.05em'
                }}>
                  {card.alertValue} UNREAD
                </span>
              ) : null}
            </div>

            {/* Bottom Row: Title & Count */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8B98A8', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.2rem' }}>
                {card.value}
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 2. Quick Actions Console */}
      <section style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1rem',
        padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.02em', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '4px', height: '12px', background: '#10b981', display: 'inline-block' }} />
          QUICK ACTIONS
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {[
            { label: 'Add Project', link: '/admin/projects/new', icon: <Briefcase size={16} /> },
            { label: 'Add Experience', link: '/admin/experiences/new', icon: <History size={16} /> },
            { label: 'Add Certificate', link: '/admin/certificates', icon: <Award size={16} /> },
            { label: 'Add Achievement', link: '/admin/achievements', icon: <Trophy size={16} /> }
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => navigate(act.link)}
              style={{
                background: '#101923',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.5rem',
                padding: '0.8rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#F5F7FA',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = '#101923';
              }}
            >
              <Plus size={16} color="#10b981" />
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Splits: Recent Activity Lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Projects & Draft Info */}
        <div style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#10b981" />
              RECENT PROJECTS
            </h3>
            {stats.draftProjects > 0 ? (
              <span style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Clock size={10} />
                {stats.draftProjects} Drafts Pending
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentProjects.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: '#8B98A8', fontSize: '0.85rem' }}>
                No projects found. Create your first project now.
              </div>
            ) : (
              recentProjects.map((p, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#101923',
                    borderRadius: '0.5rem',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.title}</h4>
                    <span style={{ fontSize: '0.65rem', color: '#8B98A8', marginTop: '0.2rem', display: 'inline-block' }}>
                      Added {new Date(p.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '0.25rem',
                    background: p.status === 'Published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: p.status === 'Published' ? '#10b981' : '#f59e0b',
                    border: p.status === 'Published' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                  }}>
                    {p.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div style={{
          background: '#0B1118',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#06b6d4" />
              RECENT MESSAGES
            </h3>
            <Link to="/admin/contact" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4' }}>
              View Inbox
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentMessages.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: '#8B98A8', fontSize: '0.85rem' }}>
                Your message inbox is currently empty.
              </div>
            ) : (
              recentMessages.map((m, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#101923',
                    borderRadius: '0.5rem',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: m.status === 'unread' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255,255,255,0.02)',
                    boxShadow: m.status === 'unread' ? '0 0 10px rgba(6, 182, 212, 0.05)' : 'none'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.name}
                      </span>
                      {m.status === 'unread' && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#8B98A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                      {m.subject || 'No Subject'}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#8B98A8', flexShrink: 0 }}>
                    {new Date(m.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
