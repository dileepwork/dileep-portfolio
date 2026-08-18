import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, CheckCircle, Mail, Phone, MapPin, 
  MessageCircle, Link as LinkIcon 
} from 'lucide-react';

const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const Github = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

interface Profile {
  email: string;
  phone: string;
  location: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

interface ContactProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

const Contact: React.FC<ContactProps> = ({ profile, socialLinks }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: `New Message from ${formData.get('name')}`,
      message: formData.get('message') as string
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus('success');
        form.reset();
      } else {
        console.error("Submission failed:", data.error);
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Network Error:", error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return { icon: <Linkedin size={24} />, color: "rgba(14, 118, 168, 0.1)", iconColor: "#0A66C2" };
      case 'github':
        return { icon: <Github size={24} />, color: "rgba(255, 255, 255, 0.05)", iconColor: "#fff" };
      case 'instagram':
        return { icon: <Instagram size={24} />, color: "rgba(236, 72, 153, 0.1)", iconColor: "#E1306C" };
      case 'whatsapp':
        return { icon: <MessageCircle size={24} />, color: "rgba(37, 211, 102, 0.1)", iconColor: "#25D366" };
      default:
        return { icon: <LinkIcon size={24} />, color: "rgba(16, 185, 129, 0.1)", iconColor: "var(--primary)" };
    }
  };

  return (
    <section id="contact" style={{ padding: '6rem 1rem', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          #contact { padding: 8rem 2rem !important; }
        }
        @media (max-width: 768px) {
          .contact-grid { 
            grid-template-columns: 1fr !important; 
            gap: 3rem !important;
          }
          .contact-form-container {
            padding: 2rem !important;
          }
        }
      `}} />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '10rem' }} 
        >
          <span style={{
            color: 'var(--primary)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            display: 'block',
            marginBottom: '1rem'
          }}>
            Get In Touch
          </span>
          <h2 className="text-shadow" style={{
            fontSize: 'clamp(1.8rem, 8vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            lineHeight: 1,
            wordBreak: 'break-word'
          }}>
            Let's Build Something <span style={{ 
              background: 'linear-gradient(135deg, var(--primary), #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.2))'
            }}>Great</span>
          </h2>
          <p style={{ color: '#fff', opacity: 0.9, maxWidth: '580px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Have a project in mind? I'm always open to new opportunities.
          </p>
        </motion.div>

        <div className="contact-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 0.4fr) minmax(0, 0.6fr)', 
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* 1. Dynamic Contact Fields */}
            {profile.email && (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '54px', height: '54px', borderRadius: '0.75rem', 
                  background: 'rgba(16, 185, 129, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Email</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{profile.email}</p>
                </div>
              </div>
            )}

            {profile.phone && (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '54px', height: '54px', borderRadius: '0.75rem', 
                  background: 'rgba(59, 130, 246, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0
                }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Phone</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{profile.phone}</p>
                </div>
              </div>
            )}

            {profile.location && (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '54px', height: '54px', borderRadius: '0.75rem', 
                  background: 'rgba(139, 92, 246, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', flexShrink: 0
                }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Location</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{profile.location}</p>
                </div>
              </div>
            )}

            {/* 2. Dynamic Social Handles */}
            {socialLinks.map((link) => {
              const meta = getPlatformIcon(link.platform);
              return (
                <div 
                  key={link.id} 
                  onClick={() => window.open(link.url, '_blank')}
                  style={{ 
                    display: 'flex', 
                    gap: '1.25rem', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ 
                    width: '54px', 
                    height: '54px', 
                    borderRadius: '0.75rem', 
                    background: meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: meta.iconColor,
                    flexShrink: 0
                  }}>
                    {meta.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{link.platform}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Connect on {link.platform}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass contact-form-container"
            style={{ padding: '2rem', borderRadius: '1.5rem', position: 'relative' }}
          >
            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ textAlign: 'center', padding: '1.5rem 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  >
                    <CheckCircle size={70} color="var(--primary)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--primary))' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Sent!</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Thanks for reaching out. I'll get back to you soon.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Name</label>
                    <input 
                      name="name"
                      type="text" 
                      required
                      placeholder="Your Name"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--glass-border)',
                        padding: '0.9rem 1rem',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Email</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="your@email.com"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--glass-border)',
                        padding: '0.9rem 1rem',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>Message</label>
                    <textarea 
                      name="message"
                      required
                      rows={3}
                      placeholder="How can I help?"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--glass-border)',
                        padding: '0.9rem 1rem',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>Something went wrong. Please try again.</p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--bg-dark)',
                      padding: '1.1rem',
                      borderRadius: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      marginTop: '0.5rem',
                      fontSize: '1rem',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Sending...' : <>Send Message <Send size={18} /></>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
