import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "a7c63c21-42f2-498f-b9bc-5e9e212d681c");
    formData.append("subject", `New Portfolio Message from ${formData.get('name')}`);
    formData.append("from_name", "Dileep Portfolio");
    
    // Workaround for Dashboard Timezone: Send Local Time as a field
    const localTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    formData.append("Submitted_At_Local", localTime);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Web3Forms Response:", data);

      if (data.success) {
        setFormStatus('success');
        form.reset(); // Use the stored reference safely
      } else {
        console.error("Submission failed:", data.message);
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Network Error:", error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
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
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            lineHeight: 1
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
            {[
              { icon: <Mail size={24} />, label: "Email", value: "dileeppvt03@gmail.com", color: "rgba(16, 185, 129, 0.1)", iconColor: "var(--primary)" },
              { icon: <Phone size={24} />, label: "Phone", value: "+91 9159059497", color: "rgba(59, 130, 246, 0.1)", iconColor: "#3b82f6" },
              { icon: <MapPin size={24} />, label: "Location", value: "Erode, Tamil Nadu", color: "rgba(139, 92, 246, 0.1)", iconColor: "#8b5cf6" }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '54px', 
                  height: '54px', 
                  borderRadius: '0.75rem', 
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.iconColor,
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.label}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{item.value}</p>
                </div>
              </div>
            ))}
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
        <footer style={{ 
          marginTop: '6rem', 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem'
        }}>
          <p>© 2026 DILEEP PORTFOLIO — ENGINEERED WITH PRECISION</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
