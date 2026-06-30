import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

const socialLinks = [
  { platform: 'GitHub', url: 'https://github.com' },
  { platform: 'LinkedIn', url: 'https://linkedin.com' },
  { platform: 'Instagram', url: 'https://instagram.com' },
];

const MAX_MESSAGE = 1000;

const SocialIcon = ({ platform }: { platform: string }) => {
  const name = platform.toLowerCase();
  if (name.includes('github')) return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.5 24 5.87 18.627.5 12 .5z"/>
    </svg>
  );
  if (name.includes('linkedin')) return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
};

// ── Animated Success Checkmark ─────────────────────────────────────────────
function SuccessIcon() {
  return (
    <motion.div
      className="success-icon-wrap flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 70%)',
        border: '2px solid rgba(16,185,129,0.4)',
      }}
    >
      <svg viewBox="0 0 52 52" className="w-10 h-10">
        <circle
          cx="26" cy="26" r="23"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 280,
            strokeDashoffset: 280,
            animation: 'circleDraw 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards',
          }}
        />
        <path
          d="M14 27 L22 35 L38 19"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: 'checkDraw 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards',
          }}
        />
      </svg>
    </motion.div>
  );
}

// ── Ambient Particle ────────────────────────────────────────────────────────
function AmbientParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + (i * 73) % 80,
    y: 15 + (i * 47) % 70,
    size: 2 + (i * 0.3) % 3,
    delay: i * 0.4,
    duration: 3 + (i * 0.5) % 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contact-ambient" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: '#B501A7',
            opacity: 0,
            animation: `ambientPulse ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [glowingFields, setGlowingFields] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const charCount = form.message.length;
  const nearLimit = charCount >= MAX_MESSAGE * 0.8;
  const atLimit = charCount >= MAX_MESSAGE;

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, []);

  const glowSequence = useCallback(async () => {
    const fields = ['name', 'email', 'subject', 'message'];
    for (const field of fields) {
      setGlowingFields((prev) => new Set([...prev, field]));
      await new Promise((r) => setTimeout(r, 150));
    }
    await new Promise((r) => setTimeout(r, 300));
    setGlowingFields(new Set());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    await glowSequence();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        triggerShake();
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      triggerShake();
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  // Entrance animation for form fields
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  return (
    <section id="contact" className="bg-[#08080A] px-5 sm:px-8 md:px-10 py-24 sm:py-32 relative z-10 overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(181,1,167,0.05) 0%, transparent 70%)',
        }}
      />
      <AmbientParticles />

      <div className="max-w-6xl mx-auto relative">
        <FadeIn y={40}>
          <div className="text-center mb-12">
            <motion.p
              className="text-sm uppercase tracking-[0.35em] mb-4"
              style={{ color: 'rgba(181,1,167,0.8)' }}
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Let's build something remarkable
            </motion.p>
            <h2 className="hero-heading font-black uppercase text-[clamp(2.8rem,8vw,5rem)] leading-[0.95] mx-auto max-w-4xl heading-shimmer">
              Have a project in mind? Let&apos;s make it shine.
            </h2>
            <motion.p
              className="mt-6 text-white/60 text-base sm:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Share your idea and I&apos;ll help turn it into a polished digital experience with better visuals, strong interaction, and thoughtful details.
            </motion.p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05} y={30}>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
            {/* ── Left: Social + Info ── */}
            <motion.div
              className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex flex-col gap-6">
                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-white/40 mb-4">Connect directly</p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, i) => (
                      <motion.a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="social-btn inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 cursor-pointer"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                        whileHover={{ y: -3, borderColor: 'rgba(181,1,167,0.4)', background: 'rgba(181,1,167,0.1)', boxShadow: '0 10px 30px rgba(181,1,167,0.15)' }}
                      >
                        <span
                          className="social-icon inline-flex items-center justify-center w-9 h-9 rounded-full"
                          style={{ background: 'rgba(181,1,167,0.15)', color: '#B501A7' }}
                        >
                          <SocialIcon platform={social.platform} />
                        </span>
                        {social.platform}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                {/* Info cards */}
                <div className="space-y-3">
                  {[
                    { label: 'Email', value: 'hello@yourdomain.com', delay: 0.25 },
                    { label: 'Availability', value: 'Open for projects & collaboration', delay: 0.35 },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      className="info-card rounded-3xl border border-white/10 bg-[#0B0B0F] p-5 cursor-default"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: card.delay, duration: 0.4 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(181,1,167,0.25)', boxShadow: '0 0 30px rgba(181,1,167,0.08), 0 15px 40px rgba(0,0,0,0.3)' }}
                    >
                      <p className="text-sm text-white/40 uppercase tracking-[0.35em] mb-2">{card.label}</p>
                      <p className="text-white font-medium">{card.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative orbit ring */}
                <motion.div
                  className="relative h-32 flex items-center justify-center mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  aria-hidden
                >
                  <div
                    className="absolute w-20 h-20 rounded-full border border-white/10"
                    style={{ animation: 'ambientPulse 3s ease-in-out infinite' }}
                  />
                  <div
                    className="absolute w-28 h-28 rounded-full border border-dashed border-white/5"
                    style={{ animation: 'ambientPulse 4s ease-in-out 0.5s infinite' }}
                  />
                  <div
                    className="absolute w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(181,1,167,0.1)', border: '1px solid rgba(181,1,167,0.2)' }}
                  >
                    <span className="text-2xl">✦</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              className="rounded-[40px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

                {/* Name + Email row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    className={`contact-field-wrap rounded-3xl border border-white/10 bg-[#0A0A0F] transition-all duration-200 ${glowingFields.has('name') ? 'field-glow' : ''}`}
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fieldVariants}
                  >
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      autoComplete="name"
                      className="w-full rounded-3xl bg-transparent px-4 pt-6 pb-3 text-white outline-none text-sm"
                    />
                    <label className="field-label">Name *</label>
                  </motion.div>

                  <motion.div
                    className={`contact-field-wrap rounded-3xl border border-white/10 bg-[#0A0A0F] transition-all duration-200 ${glowingFields.has('email') ? 'field-glow' : ''}`}
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fieldVariants}
                  >
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      autoComplete="email"
                      className="w-full rounded-3xl bg-transparent px-4 pt-6 pb-3 text-white outline-none text-sm"
                    />
                    <label className="field-label">Email *</label>
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div
                  className={`contact-field-wrap rounded-3xl border border-white/10 bg-[#0A0A0F] transition-all duration-200 ${glowingFields.has('subject') ? 'field-glow' : ''}`}
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fieldVariants}
                >
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder=" "
                    className="w-full rounded-3xl bg-transparent px-4 pt-6 pb-3 text-white outline-none text-sm"
                  />
                  <label className="field-label">Subject</label>
                </motion.div>

                {/* Message */}
                <motion.div
                  className={`contact-field-wrap rounded-[28px] border border-white/10 bg-[#0A0A0F] transition-all duration-200 ${glowingFields.has('message') ? 'field-glow' : ''}`}
                  custom={3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fieldVariants}
                >
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    placeholder=" "
                    className="w-full rounded-[28px] bg-transparent px-4 pt-8 pb-4 text-white outline-none resize-none text-sm"
                  />
                  <label className="field-label">Message *</label>
                </motion.div>

                {/* Character counter */}
                <motion.div
                  className={`char-counter ${nearLimit ? 'near-limit' : ''} ${atLimit ? 'at-limit' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: charCount > 0 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {charCount} / {MAX_MESSAGE}
                </motion.div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={status !== 'sending' ? { scale: 1.02, y: -2 } : {}}
                  whileTap={{ scale: 0.97 }}
                  className="relative mt-1 inline-flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-r from-[#B501A7] via-[#C61BE1] to-[#7B3DFF] px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[0_20px_60px_rgba(181,1,167,0.25)] transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    backgroundSize: '200% auto',
                    animation: status === 'sending' ? 'headingShimmer 1.5s linear infinite' : undefined,
                  }}
                >
                  <span className={`relative z-10 ${status === 'sending' ? 'btn-sending' : ''}`}>
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      'Send Message →'
                    )}
                  </span>
                  {status === 'sending' && <span className="submit-progress" />}
                </motion.button>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="flex flex-col items-center py-4 text-center"
                    >
                      <SuccessIcon />
                      <p className="text-sm font-semibold text-emerald-400 mt-1">
                        Message sent! I&apos;ll get back to you soon.
                      </p>
                      <p className="text-white/30 text-xs mt-1">Feel free to close this tab.</p>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-sm font-semibold text-red-400 flex items-center gap-2 ${shake ? 'shake' : ''}`}
                    >
                      <span>✕</span>
                      <span>Something went wrong. Please try again.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
