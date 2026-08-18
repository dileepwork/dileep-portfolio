import React, { useState, useEffect } from 'react';
import { 
  Mail, MailOpen, Archive, Trash2, Search, 
  Filter, Check, RefreshCw, X 
} from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal State
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/contact-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessages(messages.map(m => 
          m.id === id ? { ...m, status: newStatus } : m
        ));
        
        // Sync active modal message state if open
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage({ ...activeMessage, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message permanently?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMessage = (msg: ContactMessage) => {
    setActiveMessage(msg);
    // Mark as read automatically when opened if it was unread
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase()) ||
                          (m.subject && m.subject.toLowerCase().includes(search.toLowerCase())) ||
                          m.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Communication Terminal (Inbox)</h2>
          <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Read and manage inquiries sent from Dileep's portfolio site.</p>
        </div>
        <button 
          onClick={() => (setLoading(true), fetchMessages())}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#F5F7FA',
            padding: '0.5rem 0.8rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem'
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter */}
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
            placeholder="Search sender, email, subject, or contents..."
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

        {/* Filter Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} color="#8B98A8" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#05080D',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#F5F7FA',
              padding: '0.7rem 1.8rem 0.7rem 0.7rem',
              borderRadius: '0.5rem',
              outline: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">ALL MESSAGES</option>
            <option value="unread">UNREAD</option>
            <option value="read">READ</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Messages List Table */}
      <div style={{
        background: '#0B1118',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '0.85rem',
        overflowX: 'auto',
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8' }}>Loading inbox messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8B98A8', fontSize: '0.9rem' }}>
            No messages found in this folder.
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
                <th style={{ padding: '1rem 1.5rem', width: '30px' }}></th>
                <th style={{ padding: '1rem 1.5rem' }}>Sender</th>
                <th style={{ padding: '1rem 1.5rem' }}>Subject & Snippet</th>
                <th style={{ padding: '1rem 1.5rem' }}>Date Received</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => {
                const isUnread = msg.status === 'unread';
                return (
                  <tr 
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isUnread ? 'rgba(6, 182, 212, 0.03)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = isUnread ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = isUnread ? 'rgba(6, 182, 212, 0.03)' : 'transparent'}
                  >
                    {/* Read/Unread Icon */}
                    <td style={{ padding: '1rem 0.5rem 1rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleUpdateStatus(msg.id, isUnread ? 'read' : 'unread')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: isUnread ? '#06b6d4' : '#8B98A8' }}
                      >
                        {isUnread ? <Mail size={16} /> : <MailOpen size={16} />}
                      </button>
                    </td>

                    {/* Sender details */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: isUnread ? 800 : 500, color: isUnread ? '#fff' : '#F5F7FA' }}>{msg.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#8B98A8', marginTop: '0.1rem' }}>{msg.email}</div>
                    </td>

                    {/* Subject Snippet */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: isUnread ? 800 : 500, color: isUnread ? '#06b6d4' : '#F5F7FA' }}>
                        {msg.subject || 'No Subject'}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#8B98A8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px', marginTop: '0.15rem' }}>
                        {msg.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1rem 1.5rem', color: '#8B98A8' }}>
                      {new Date(msg.created_at || Date.now()).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
                        {msg.status !== 'archived' ? (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'archived')}
                            title="Archive Message"
                            style={{ background: 'none', border: 'none', color: '#8B98A8', cursor: 'pointer', padding: '0.3rem' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#8B98A8'}
                          >
                            <Archive size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'read')}
                            title="Restore Message"
                            style={{ background: 'none', border: 'none', color: '#8B98A8', cursor: 'pointer', padding: '0.3rem' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#10b981'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#8B98A8'}
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          title="Delete Message"
                          style={{ background: 'none', border: 'none', color: '#8B98A8', cursor: 'pointer', padding: '0.3rem' }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#8B98A8'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MESSAGE READER DETAIL MODAL */}
      {activeMessage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#0B1118',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  background: activeMessage.status === 'unread' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.04)',
                  color: activeMessage.status === 'unread' ? '#06b6d4' : '#8B98A8',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  letterSpacing: '0.05em'
                }}>
                  {activeMessage.status.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setActiveMessage(null)}
                style={{ background: 'none', border: 'none', color: '#8B98A8', cursor: 'pointer', display: 'flex' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#8B98A8'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowY: 'auto', maxHeight: '400px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 600 }}>SENDER</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.15rem' }}>{activeMessage.name}</div>
                <a href={`mailto:${activeMessage.email}`} style={{ fontSize: '0.8rem', color: '#10b981', display: 'inline-block', marginTop: '0.1rem' }}>
                  {activeMessage.email}
                </a>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 600 }}>SUBJECT</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.15rem', color: '#fff' }}>
                  {activeMessage.subject || 'No Subject'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 600 }}>DATE</div>
                <div style={{ fontSize: '0.8rem', color: '#F5F7FA', marginTop: '0.15rem' }}>
                  {new Date(activeMessage.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#8B98A8', fontWeight: 600, marginBottom: '0.5rem' }}>MESSAGE BODY</div>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#F5F7FA',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  background: '#05080D',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  {activeMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: '#080E14',
              borderRadius: '0 0 1rem 1rem'
            }}>
              <button
                onClick={() => handleDelete(activeMessage.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {activeMessage.status !== 'archived' ? (
                  <button
                    onClick={() => (handleUpdateStatus(activeMessage.id, 'archived'), setActiveMessage(null))}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Archive size={14} />
                    <span>Archive</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(activeMessage.id, 'unread')}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#8B98A8',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Mark Unread
                  </button>
                )}
                <button
                  onClick={() => setActiveMessage(null)}
                  style={{
                    background: '#10b981',
                    color: '#000',
                    border: 'none',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
