import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SocialData } from '../App';

const MAX_MESSAGE = 1000;
const ease = [0.22, 1, 0.36, 1] as const;

interface ContactSectionProps {
  socialsData?: SocialData[];
}

/* ── Platform Icons ─────────────────────────────────────────────────── */
function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes('github'))
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.5 24 5.87 18.627.5 12 .5z"/></svg>;
  if (p.includes('linkedin'))
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  if (p.includes('behance'))
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zM15.97 13h4.908c-.041-1.595-.925-2.47-2.291-2.47-1.385 0-2.426.89-2.617 2.47zM5.797 9.168v2.098H8.49c.64 0 1.177-.422 1.177-1.049 0-.628-.54-1.049-1.177-1.049H5.797zm0 4.052v2.289h2.797c.776 0 1.386-.43 1.386-1.144 0-.714-.61-1.145-1.386-1.145H5.797zM2 2h9v2H2z"/></svg>;
  if (p.includes('instagram'))
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (p.includes('twitter') || p.includes('x'))
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>;
}

/* ── Success Tick ───────────────────────────────────────────────────── */
function SuccessTick() {
  return (
    <motion.div
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.18), rgba(16,185,129,0.04))',
        border: '2px solid rgba(16,185,129,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg viewBox="0 0 52 52" width="44" height="44">
        <circle cx="26" cy="26" r="23" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 145, strokeDashoffset: 145, animation: 'circleDraw 0.5s ease forwards 0.1s' }} />
        <path d="M14 27L22 35L38 19" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 42, strokeDashoffset: 42, animation: 'checkDraw 0.4s ease forwards 0.55s' }} />
      </svg>
    </motion.div>
  );
}

/* ── Input Field ────────────────────────────────────────────────────── */
function Field({ label, name, type = 'text', value, onChange, onFocus, onBlur, focused, required, autoComplete }: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void; onBlur: () => void;
  focused: boolean; required?: boolean; autoComplete?: string;
}) {
  const active = focused || value.length > 0;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        borderRadius: 14,
        border: `1.5px solid ${focused ? 'rgba(181,1,167,0.7)' : 'rgba(255,255,255,0.13)'}`,
        background: focused ? 'rgba(181,1,167,0.05)' : 'rgba(255,255,255,0.04)',
        boxShadow: focused ? '0 0 0 4px rgba(181,1,167,0.10)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <label style={{
          position: 'absolute', left: 16,
          top: active ? 8 : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? 10 : 14,
          fontWeight: active ? 700 : 400,
          color: focused ? '#C040B8' : 'rgba(255,255,255,0.35)',
          letterSpacing: active ? '0.14em' : '0.02em',
          textTransform: active ? 'uppercase' : 'none',
          transition: 'all 0.22s ease',
          pointerEvents: 'none', zIndex: 2,
          fontFamily: 'Kanit, sans-serif',
        }}>
          {label}{required ? ' *' : ''}
        </label>
        <input type={type} name={name} value={value}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          autoComplete={autoComplete}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: 14, padding: '26px 16px 10px',
            fontFamily: 'Kanit, sans-serif',
          }} />
      </div>
    </div>
  );
}

/* ── Textarea ───────────────────────────────────────────────────────── */
function TextareaField({ label, name, value, onChange, onFocus, onBlur, focused, required, rows, charCount, maxChars }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void; onBlur: () => void;
  focused: boolean; required?: boolean; rows?: number;
  charCount: number; maxChars: number;
}) {
  const active = focused || value.length > 0;
  const nearLimit = charCount >= maxChars * 0.8;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        borderRadius: 14,
        border: `1.5px solid ${focused ? 'rgba(181,1,167,0.7)' : 'rgba(255,255,255,0.13)'}`,
        background: focused ? 'rgba(181,1,167,0.05)' : 'rgba(255,255,255,0.04)',
        boxShadow: focused ? '0 0 0 4px rgba(181,1,167,0.10)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <label style={{
          position: 'absolute', left: 16,
          top: active ? 10 : 20,
          fontSize: active ? 10 : 14,
          fontWeight: active ? 700 : 400,
          color: focused ? '#C040B8' : 'rgba(255,255,255,0.35)',
          letterSpacing: active ? '0.14em' : '0.02em',
          textTransform: active ? 'uppercase' : 'none',
          transition: 'all 0.22s ease',
          pointerEvents: 'none', zIndex: 2,
          fontFamily: 'Kanit, sans-serif',
        }}>
          {label}{required ? ' *' : ''}
        </label>
        <textarea name={name} value={value} rows={rows || 5}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: 14, padding: '34px 16px 40px',
            fontFamily: 'Kanit, sans-serif', resize: 'none', lineHeight: 1.65,
          }} />
        {charCount > 0 && (
          <div style={{
            position: 'absolute', bottom: 10, right: 14, fontSize: 11,
            fontFamily: 'monospace', color: nearLimit ? '#f97316' : 'rgba(255,255,255,0.25)',
            transition: 'color 0.3s',
          }}>{charCount}/{maxChars}</div>
        )}
      </div>
    </div>
  );
}

/* ── Info Card ──────────────────────────────────────────────────────── */
function InfoCard({ icon, title, desc, iconBg, accent, delay }: {
  icon: string; title: string; desc: string; iconBg: string; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease }}
      whileHover={{ y: -4, borderColor: `${accent}50` }}
      style={{
        display: 'flex', gap: 16, alignItems: 'flex-start',
        padding: '18px 20px', borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s, transform 0.3s',
        cursor: 'default',
      }}
    >
      <motion.div
        animate={{ rotate: [0, 6, 0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: iconBg, border: `1px solid ${accent}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}
      >{icon}</motion.div>
      <div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{title}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
export default function ContactSection({ socialsData }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE) return;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }); setTimeout(() => setStatus('idle'), 7000); }
      else throw new Error();
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 4500); }
  }, [form, status]);

  return (
    <section
      id="contact"
      style={{
        /* SOLID background — zero transparency, fully blocks previous section */
        backgroundColor: '#09090D',
        position: 'relative',
        zIndex: 10,
        isolation: 'isolate',
        overflow: 'hidden',
        padding: '180px 24px 140px',
      }}
    >
      {/* ── Animated background blobs ── */}
      <motion.div
        animate={{ x: [0, 50, 0, -50, 0], y: [0, -40, 0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-12%', pointerEvents: 'none',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181,1,167,0.09) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -40, 0, 40, 0], y: [0, 50, 0, -50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', bottom: '-15%', right: '-12%', pointerEvents: 'none',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,60,255,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Subtle grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(181,1,167,1) 1px,transparent 1px),linear-gradient(90deg,rgba(181,1,167,1) 1px,transparent 1px)',
        backgroundSize: '55px 55px',
      }} />

      {/* ── Floating dots ── */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.45, 0.1] }}
          transition={{ duration: 4 + (i % 5), delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', pointerEvents: 'none',
            left: `${7 + (i * 6.5) % 87}%`, top: `${10 + (i * 7.1) % 80}%`,
            width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: '50%',
            background: 'rgba(181,1,167,0.7)',
          }}
        />
      ))}

      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* ════════════════ HEADER ════════════════ */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 22px', borderRadius: 999,
              border: '1px solid rgba(181,1,167,0.35)',
              background: 'rgba(181,1,167,0.08)',
              marginBottom: 28, backdropFilter: 'blur(10px)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'block' }}
            />
            <span style={{ color: '#B501A7', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Available for work
            </span>
          </motion.div>

          {/* Heading line 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            <span className="hero-heading" style={{
              display: 'block', fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
              fontWeight: 900, lineHeight: 0.93, textTransform: 'uppercase', letterSpacing: '-0.02em',
            }}>Let's Build</span>
          </motion.div>

          {/* Heading line 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            style={{ marginBottom: 24 }}
          >
            <div style={{
              display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
              gap: '0 14px', lineHeight: 0.93,
            }}>
              <span className="hero-heading" style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Something
              </span>
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg,#B501A7,#7B3DFF,#00D4FF,#B501A7)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >Amazing</motion.span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            style={{ color: 'rgba(255,255,255,0.44)', fontSize: 15, maxWidth: 460, margin: '0 auto', lineHeight: 1.78 }}
          >
            Have a project in mind? Drop me a message — all messages land directly in my admin panel.
          </motion.p>
        </div>

        {/* ════════════════ TWO COLUMNS ════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28, alignItems: 'start',
        }}>

          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <InfoCard icon="✦" title="Open for Projects" desc="Available for freelance, full-time and creative collaboration." iconBg="rgba(16,185,129,0.12)" accent="#10b981" delay={0.1} />
            <InfoCard icon="⚡" title="Fast Response" desc="Usually reply within 24 hours. All messages saved in my admin panel." iconBg="rgba(181,1,167,0.12)" accent="#B501A7" delay={0.2} />
            <InfoCard icon="🎯" title="Precision Work" desc="Clean code, pixel-perfect design, attention to every detail." iconBg="rgba(59,130,246,0.12)" accent="#3b82f6" delay={0.3} />

            {/* Social links */}
            {socialsData && socialsData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: 0.4, ease }}
                style={{
                  padding: '18px 20px', borderRadius: 18,
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 12 }}>
                  Find me on
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {socialsData.map((s, i) => (
                    <motion.a key={s.platform} href={s.url} target="_blank" rel="noreferrer"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.45 + i * 0.08 }}
                      whileHover={{ y: -3, scale: 1.07 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '8px 14px', borderRadius: 999,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <span style={{ color: '#B501A7' }}><PlatformIcon platform={s.platform} /></span>
                      {s.platform}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pulsing rings */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 110, position: 'relative' }}
            >
              {[96, 128, 162].map((size, i) => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 2.5 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
                  style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: `1px solid rgba(181,1,167,${0.2 - i * 0.05})` }}
                />
              ))}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 162, height: 162, borderRadius: '50%', border: '1px dashed rgba(181,1,167,0.12)' }}
              />
              <div style={{
                width: 50, height: 50, borderRadius: '50%', zIndex: 2,
                background: 'rgba(181,1,167,0.12)', border: '1.5px solid rgba(181,1,167,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 0 24px rgba(181,1,167,0.25)',
              }}>✉</div>
            </motion.div>
          </div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            style={{
              padding: '36px 30px', borderRadius: 26,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 50px 130px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  style={{ textAlign: 'center', padding: '52px 20px' }}
                >
                  <SuccessTick />
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Message Sent! 🎉</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, lineHeight: 1.75, maxWidth: 280, margin: '0 auto' }}>
                    Thank you for reaching out!<br />I'll get back to you within 24 hours.
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ duration: 7, ease: 'linear', delay: 0.3 }}
                    style={{ height: 3, borderRadius: 3, marginTop: 28, background: 'linear-gradient(90deg,#B501A7,#7B3DFF)', transformOrigin: 'left' }}
                  />
                </motion.div>
              ) : (
                <motion.form key="form" ref={formRef} onSubmit={handleSubmit}
                  initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 15 }} noValidate
                >
                  <div style={{ marginBottom: 6 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Send a Message</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>* Required fields</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Name" name="name" value={form.name} onChange={handleChange}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                      focused={focused === 'name'} required autoComplete="name" />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                      focused={focused === 'email'} required autoComplete="email" />
                  </div>

                  <Field label="Subject" name="subject" value={form.subject} onChange={handleChange}
                    onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                    focused={focused === 'subject'} />

                  <TextareaField label="Message" name="message" value={form.message}
                    onChange={e => { if (e.target.value.length <= MAX_MESSAGE) setForm(p => ({ ...p, message: e.target.value })); }}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                    focused={focused === 'message'} required rows={6}
                    charCount={form.message.length} maxChars={MAX_MESSAGE} />

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>✕</span> Something went wrong. Please try again.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button type="submit" disabled={status === 'sending'}
                    whileHover={status !== 'sending' ? { scale: 1.025, y: -3, boxShadow: '0 24px 60px rgba(181,1,167,0.5)' } : {}}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      marginTop: 6, padding: '17px 28px', borderRadius: 14, border: 'none',
                      background: 'linear-gradient(135deg,#B501A7 0%,#7B3DFF 60%,#B501A7 100%)',
                      backgroundSize: '200% auto', color: '#fff', fontSize: 13, fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      opacity: status === 'sending' ? 0.65 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      boxShadow: '0 18px 50px rgba(181,1,167,0.35)',
                      fontFamily: 'Kanit, sans-serif', transition: 'opacity 0.3s',
                    }}>
                    {status === 'sending' ? (
                      <>
                        <span style={{ width: 17, height: 17, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 17 }}>→</motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}