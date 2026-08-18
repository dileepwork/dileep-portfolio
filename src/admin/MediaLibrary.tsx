import React, { useState, useEffect } from 'react';
import { 
  Upload, Copy, Trash2, CheckCircle, FileText, 
  ImageIcon, Loader2 
} from 'lucide-react';

interface MediaItem {
  id: number;
  filename: string;
  url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/media', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to fetch media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      fetchMedia(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Error occurred during file upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this file permanently?')) return;

    try {
      const token = localStorage.getItem('cyber_admin_token');
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMediaList(mediaList.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (item: MediaItem) => {
    // Generate full URL path or relative path
    const path = item.url;
    navigator.clipboard.writeText(path).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Media & Assets Library</h2>
          <p style={{ fontSize: '0.85rem', color: '#8B98A8' }}>Upload and retrieve profile avatars, project images, certificates, and resume files.</p>
        </div>

        {/* Upload Button wrapper */}
        <label style={{
          background: '#10b981',
          color: '#05080D',
          border: 'none',
          padding: '0.8rem 1.4rem',
          borderRadius: '0.6rem',
          fontWeight: 850,
          fontSize: '0.88rem',
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
          opacity: uploading ? 0.7 : 1
        }}>
          {uploading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Uploading asset...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload New Asset</span>
            </>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
            accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.pdf"
          />
        </label>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#8B98A8' }}>Loading library assets...</div>
      ) : mediaList.length === 0 ? (
        <div style={{
          background: '#0B1118',
          border: '1px dotted rgba(255,255,255,0.08)',
          borderRadius: '1rem',
          padding: '4rem',
          textAlign: 'center',
          color: '#8B98A8'
        }}>
          <ImageIcon size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F5F7FA', marginBottom: '0.25rem' }}>Library is Empty</h3>
          <p style={{ fontSize: '0.85rem' }}>Upload files to display them in your library and use them across portfolio forms.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '1.25rem'
        }}>
          {mediaList.map((item) => {
            const isImage = item.file_type.startsWith('image/');
            return (
              <div 
                key={item.id}
                style={{
                  background: '#0B1118',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '0.85rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '240px',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                {/* Preview Container */}
                <div style={{
                  flex: 1,
                  background: '#05080D',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {isImage ? (
                    <img 
                      src={item.url} 
                      alt={item.filename}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#8B98A8' }}>
                      <FileText size={40} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.04)', padding: '0.1rem 0.35rem', borderRadius: '0.2rem' }}>
                        PDF DOCUMENT
                      </span>
                    </div>
                  )}
                </div>

                {/* File Details Footer */}
                <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <h4 
                    title={item.filename}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#F5F7FA'
                    }}
                  >
                    {item.filename}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#8B98A8' }}>
                    <span>{formatBytes(item.file_size)}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(item)}
                      style={{
                        flex: 1,
                        background: copiedId === item.id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: copiedId === item.id ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.06)',
                        color: copiedId === item.id ? '#10b981' : '#8B98A8',
                        padding: '0.35rem 0',
                        borderRadius: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle size={12} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Delete file */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '0.35rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete File"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Global CSS spinner for upload button */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default MediaLibrary;
