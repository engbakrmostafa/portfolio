import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { ProjectData } from '../App';
import LiveProjectButton from './LiveProjectButton';

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Category config ────────────────────────────────────────────────── */
const CATEGORY_META: Record<string, { icon: string; color: string; desc: string }> = {
  'All':                       { icon: '⬡', color: '#fff',      desc: 'All projects' },
  'Financial Data Analysis':   { icon: '📊', color: '#10b981',  desc: 'Data & Finance' },
  'Mobile Development':        { icon: '📱', color: '#3b82f6',  desc: 'Mobile Apps' },
  'Full Stack Development':    { icon: '🧩', color: '#B501A7',  desc: 'Web & Backend' },
  'Design':                    { icon: '🎨', color: '#f59e0b',  desc: 'UI/UX & Branding' },
  'Other':                     { icon: '✦',  color: '#a78bfa',  desc: 'Other work' },
};

function getCategoryMeta(cat: string) {
  return CATEGORY_META[cat] ?? { icon: '✦', color: '#B501A7', desc: cat };
}

const defaultProjects: ProjectData[] = [
  {
    number: '01', category: 'Full Stack Development', name: 'Nextlevel Studio',
    description: 'Full-stack web platform with real-time dashboard and REST API.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14431b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    number: '02', category: 'Financial Data Analysis', name: 'Market Pulse',
    description: 'Interactive financial analytics dashboard with live chart visualizations.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    number: '03', category: 'Mobile Development', name: 'Solaris App',
    description: 'Cross-platform mobile app with Flutter for solar energy monitoring.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

/* ── Lightbox ───────────────────────────────────────────────────────── */
function Lightbox({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) {
  const [current, setCurrent] = useState(initial);
  const go = (dir: 1 | -1) => setCurrent(c => (c + dir + images.length) % images.length);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', lineHeight: 1 }}>✕</button>
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); go(-1); }} style={{ position: 'absolute', left: 16, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', fontSize: 56, cursor: 'pointer', lineHeight: 1 }}>‹</button>
      )}
      <motion.img key={current} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
        src={images[current]} alt={`${current + 1}`}
        style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 20, objectFit: 'contain' }}
        onClick={e => e.stopPropagation()} />
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); go(1); }} style={{ position: 'absolute', right: 16, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', fontSize: 56, cursor: 'pointer', lineHeight: 1 }}>›</button>
      )}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 8 }}>
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
              style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === current ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.2s' }} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Project Card ───────────────────────────────────────────────────── */
function ProjectCard({ project, index, totalCards }: { project: ProjectData; index: number; totalCards: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const videoSrc = project.video_file || project.video_url;
  const [lightbox, setLightbox] = useState<{ images: string[]; initial: number } | null>(null);
  const meta = getCategoryMeta(project.category);
  const fallback = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

  let col1a = '', col1b = '';
  let col2: React.ReactNode;
  if (videoSrc) {
    col2 = <video src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', borderRadius: 40, objectFit: 'cover' }} />;
    col1a = project.images[0] || '';
    col1b = project.images[1] || '';
  } else {
    col2 = (
      <img src={project.images[0] || fallback} alt={`${project.name} main`}
        style={{ width: '100%', height: '100%', borderRadius: 40, objectFit: 'cover', cursor: 'zoom-in' }}
        onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: 0 })} />
    );
    col1a = project.images[1] || '';
    col1b = project.images[2] || '';
  }

  return (
    <>
      <div ref={containerRef} style={{ height: '85vh', position: 'relative', top: `${index * 28}px` }}>
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="sticky top-20 md:top-24"
          css={undefined}
        >
          <div style={{
            height: 'calc(100vh - 13rem)',
            background: 'rgba(12,12,12,0.92)',
            borderRadius: 48,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '28px 28px 24px',
            display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(12px)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${meta.color}40`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}20`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 30px 80px rgba(0,0,0,0.4)';
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 900, color: '#fff', fontSize: 'clamp(2rem,6vw,90px)', lineHeight: 1 }}>
                  {project.number}
                </span>
                <div>
                  {/* Category badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 999, background: `${meta.color}18`, border: `1px solid ${meta.color}35`, marginBottom: 4 }}>
                    <span style={{ fontSize: 12 }}>{meta.icon}</span>
                    <span style={{ color: meta.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {project.category}
                    </span>
                  </div>
                  {project.live_link ? (
                    <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', color: '#fff', fontSize: 'clamp(0.9rem,2.2vw,1.5rem)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = meta.color; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = meta.color; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent'; }}
                    >{project.name}</a>
                  ) : (
                    <h3 style={{ color: '#fff', fontSize: 'clamp(0.9rem,2.2vw,1.5rem)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{project.name}</h3>
                  )}
                  {project.description && (
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 4, maxWidth: 280, lineHeight: 1.6 }}>{project.description}</p>
                  )}
                </div>
              </div>
              <LiveProjectButton href={project.live_link} />
            </div>

            {/* Image grid */}
            <div style={{ flex: 1, display: 'flex', gap: 12, minHeight: 0, marginTop: 8 }}>
              <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <img src={col1a || fallback} alt={`${project.name} 1`}
                  style={{ width: '100%', height: 'clamp(90px,13vw,190px)', borderRadius: 32, objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 0 : 1 })} />
                <img src={col1b || fallback} alt={`${project.name} 2`}
                  style={{ width: '100%', flex: 1, borderRadius: 32, objectFit: 'cover', cursor: 'zoom-in', minHeight: 0 }}
                  onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 1 : 2 })} />
              </div>
              <div style={{ width: '60%' }}>{col2}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox images={lightbox.images} initial={lightbox.initial} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ── Category Filter Bar ────────────────────────────────────────────── */
function CategoryTabs({
  categories, active, onChange,
}: { categories: string[]; active: string; onChange: (c: string) => void }) {
  const tabs = ['All', ...categories];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 56 }}
    >
      {tabs.map((tab, i) => {
        const meta = getCategoryMeta(tab);
        const isActive = active === tab;
        return (
          <motion.button
            key={tab}
            onClick={() => onChange(tab)}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 999,
              border: isActive ? `1.5px solid ${meta.color}` : '1.5px solid rgba(255,255,255,0.1)',
              background: isActive ? `${meta.color}18` : 'rgba(255,255,255,0.03)',
              color: isActive ? meta.color : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.04em', cursor: 'pointer',
              fontFamily: 'Kanit, sans-serif',
              boxShadow: isActive ? `0 0 20px ${meta.color}25, 0 8px 30px rgba(0,0,0,0.2)` : 'none',
              transition: 'all 0.25s ease',
              position: 'relative',
            }}
          >
            {/* active indicator dot */}
            {isActive && (
              <motion.span
                layoutId="active-cat-dot"
                style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, display: 'inline-block', boxShadow: `0 0 8px ${meta.color}` }}
              />
            )}
            <span style={{ fontSize: 15 }}>{meta.icon}</span>
            {tab}
            {/* count badge */}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */
function EmptyState({ category }: { category: string }) {
  const meta = getCategoryMeta(category);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease }}
      style={{ textAlign: 'center', padding: '80px 20px' }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>{meta.icon}</div>
      <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        No projects yet in <span style={{ color: meta.color }}>{category}</span>
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
        Add projects with this category in the Django Admin panel.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════ */
interface ProjectsSectionProps {
  projectsData?: ProjectData[];
}

export default function ProjectsSection({ projectsData }: ProjectsSectionProps) {
  const allProjects = projectsData && projectsData.length > 0 ? projectsData : defaultProjects;
  const [activeCategory, setActiveCategory] = useState('All');

  // Derive unique categories from actual data
  const categories = useMemo(() => {
    const cats = [...new Set(allProjects.map(p => p.category))].filter(Boolean);
    return cats;
  }, [allProjects]);

  // Filtered list
  const filtered = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter(p => p.category === activeCategory);
  }, [allProjects, activeCategory]);

  return (
    <section id="projects" style={{
      background: '#0C0C0C',
      borderRadius: '40px 40px 0 0',
      marginTop: -40,
      position: 'relative',
      zIndex: 20,
      padding: '80px 20px 100px',
    }}>
      <div style={{ maxWidth: '84rem', margin: '0 auto' }}>

        {/* ── Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 className="hero-heading" style={{
            fontWeight: 900, textTransform: 'uppercase',
            fontSize: 'clamp(3rem,12vw,160px)',
            lineHeight: 0.9, marginBottom: 0,
          }}>
            Projects
          </h2>
        </motion.div>

        {/* ── Category tabs ── */}
        {categories.length > 1 && (
          <CategoryTabs
            categories={categories}
            active={activeCategory}
            onChange={cat => setActiveCategory(cat)}
          />
        )}

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 48, flexWrap: 'wrap' }}
        >
          {categories.map(cat => {
            const count = allProjects.filter(p => p.category === cat).length;
            const meta = getCategoryMeta(cat);
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? 'All' : cat)}
                whileHover={{ y: -2 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  opacity: activeCategory === 'All' || activeCategory === cat ? 1 : 0.35,
                  transition: 'opacity 0.3s',
                }}
              >
                <span style={{
                  fontSize: 28, fontWeight: 900, color: meta.color,
                  textShadow: `0 0 20px ${meta.color}50`,
                }}>{count}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {meta.icon} {cat}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Project cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease }}
          >
            {filtered.length === 0 ? (
              <EmptyState category={activeCategory} />
            ) : (
              filtered.map((project, i) => (
                <ProjectCard
                  key={`${activeCategory}-${project.number}`}
                  project={project}
                  index={i}
                  totalCards={filtered.length}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}