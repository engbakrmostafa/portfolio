import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { ProjectData, ProjectCategoryData } from '../App';
import LiveProjectButton from './LiveProjectButton';

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Fallback meta when no categories from API ───────────────────── */
function getCategoryMeta(
  catName: string,
  categoriesData?: ProjectCategoryData[],
  project?: ProjectData,
): { icon: string; color: string } {
  // 1. Try to find it in the API categories list
  if (categoriesData) {
    const found = categoriesData.find(c => c.name === catName);
    if (found) return { icon: found.icon, color: found.color };
  }
  // 2. Use the per-project icon/color from the API
  if (project) {
    return { icon: project.category_icon || '✦', color: project.category_color || '#B501A7' };
  }
  return { icon: '✦', color: '#B501A7' };
}

const defaultProjects: ProjectData[] = [
  {
    number: '01', category: 'Full Stack Development',
    category_icon: '🧩', category_color: '#B501A7',
    name: 'Nextlevel Studio',
    description: 'Full-stack web platform with real-time dashboard and REST API.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14431b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    number: '02', category: 'Financial Data Analysis',
    category_icon: '📊', category_color: '#10b981',
    name: 'Market Pulse',
    description: 'Interactive financial analytics dashboard with live chart visualizations.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    number: '03', category: 'Mobile Development',
    category_icon: '📱', category_color: '#3b82f6',
    name: 'Solaris App',
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
function ProjectCard({ project, index, totalCards, categoriesData }: {
  project: ProjectData; index: number; totalCards: number;
  categoriesData?: ProjectCategoryData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const videoSrc = project.video_file || project.video_url;
  const [lightbox, setLightbox] = useState<{ images: string[]; initial: number } | null>(null);
  const meta = getCategoryMeta(project.category, categoriesData, project);
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
          className="sticky top-16 sm:top-20 md:top-24"
        >
          <div style={{
            height: 'clamp(460px, calc(100vh - 10rem), 900px)',
            background: 'rgba(12,12,12,0.92)',
            borderRadius: 'clamp(20px, 4vw, 48px)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(16px, 2.5vw, 28px)',
            display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(12px)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            overflow: 'hidden',
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
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', minWidth: 0, flex: 1 }}>
                <span style={{ fontWeight: 900, color: '#fff', fontSize: 'clamp(1.6rem, 5vw, 90px)', lineHeight: 1, flexShrink: 0 }}>
                  {project.number}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  {/* Category badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: `${meta.color}18`, border: `1px solid ${meta.color}35`, marginBottom: 4, maxWidth: '100%' }}>
                    <span style={{ fontSize: 11, flexShrink: 0 }}>{meta.icon}</span>
                    <span style={{ color: meta.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.category}
                    </span>
                  </div>
                  {project.live_link ? (
                    <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', color: '#fff', fontSize: 'clamp(0.8rem, 2vw, 1.4rem)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = meta.color; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = meta.color; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent'; }}
                    >{project.name}</a>
                  ) : (
                    <h3 style={{ color: '#fff', fontSize: 'clamp(0.8rem, 2vw, 1.4rem)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h3>
                  )}
                  {project.description && (
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 'clamp(11px, 1.2vw, 13px)', marginTop: 3, maxWidth: '100%', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
                  )}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}><LiveProjectButton href={project.live_link} /></div>
            </div>

            {/* Image grid — stacks on mobile */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 10, minHeight: 0, marginTop: 6 }}>
              <div style={{ width: '38%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <img src={col1a || fallback} alt={`${project.name} 1`}
                  style={{ width: '100%', height: 'clamp(70px, 11vw, 190px)', borderRadius: 'clamp(16px, 3vw, 32px)', objectFit: 'cover', cursor: 'zoom-in', flexShrink: 0 }}
                  onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 0 : 1 })} />
                <img src={col1b || fallback} alt={`${project.name} 2`}
                  style={{ width: '100%', flex: 1, borderRadius: 'clamp(16px, 3vw, 32px)', objectFit: 'cover', cursor: 'zoom-in', minHeight: 0 }}
                  onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 1 : 2 })} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>{col2}</div>
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
}: { categories: ProjectCategoryData[]; active: string; onChange: (c: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 48 }}
    >
      {/* All tab */}
      {(['All'] as const).map(tab => {
        const isActive = active === tab;
        return (
          <motion.button key={tab} onClick={() => onChange(tab)}
            whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 999,
              border: isActive ? '1.5px solid #fff' : '1.5px solid rgba(255,255,255,0.1)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', fontFamily: 'Kanit, sans-serif',
              boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            {isActive && <motion.span layoutId="active-cat-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />}
            <span>⬡</span> {tab}
          </motion.button>
        );
      })}

      {/* Dynamic category tabs from Admin */}
      {categories.map((cat, i) => {
        const isActive = active === cat.name;
        return (
          <motion.button key={cat.id} onClick={() => onChange(cat.name)}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 999,
              border: isActive ? `1.5px solid ${cat.color}` : '1.5px solid rgba(255,255,255,0.1)',
              background: isActive ? `${cat.color}18` : 'rgba(255,255,255,0.03)',
              color: isActive ? cat.color : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', fontFamily: 'Kanit, sans-serif',
              boxShadow: isActive ? `0 0 20px ${cat.color}25` : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            {isActive && <motion.span layoutId="active-cat-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, display: 'inline-block', boxShadow: `0 0 8px ${cat.color}` }} />}
            <span style={{ fontSize: 15 }}>{cat.icon}</span>
            {cat.name}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */
function EmptyState({ category, categoriesData }: { category: string; categoriesData?: ProjectCategoryData[] }) {
  const meta = getCategoryMeta(category, categoriesData);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }}
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
  categoriesData?: ProjectCategoryData[];
}

export default function ProjectsSection({ projectsData, categoriesData }: ProjectsSectionProps) {
  const allProjects = projectsData && projectsData.length > 0 ? projectsData : defaultProjects;
  const [activeCategory, setActiveCategory] = useState('All');

  // Use API categories if available, else derive from project data
  const categories: ProjectCategoryData[] = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) return categoriesData;
    // Fallback: build from project fields
    const seen = new Set<string>();
    const cats: ProjectCategoryData[] = [];
    allProjects.forEach((p, i) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        cats.push({ id: i, name: p.category, icon: p.category_icon || '✦', color: p.category_color || '#B501A7', order: i });
      }
    });
    return cats;
  }, [categoriesData, allProjects]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter(p => p.category === activeCategory);
  }, [allProjects, activeCategory]);

  return (
    <section id="projects" style={{
      background: '#0C0C0C',
      borderRadius: 'clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px) 0 0',
      marginTop: -30,
      position: 'relative',
      zIndex: 20,
      padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 40px) clamp(60px, 10vw, 100px)',
    }}>
      <div style={{ maxWidth: '84rem', margin: '0 auto' }}>

        {/* Title */}
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

        {/* Category filter tabs — fully dynamic from Django Admin */}
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            active={activeCategory}
            onChange={cat => setActiveCategory(cat)}
          />
        )}

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 48, flexWrap: 'wrap' }}
        >
          {categories.map(cat => {
            const count = allProjects.filter(p => p.category === cat.name).length;
            return (
              <motion.button key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.name ? 'All' : cat.name)}
                whileHover={{ y: -2 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  opacity: activeCategory === 'All' || activeCategory === cat.name ? 1 : 0.35,
                  transition: 'opacity 0.3s',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 900, color: cat.color, textShadow: `0 0 20px ${cat.color}50` }}>{count}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {cat.icon} {cat.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Project cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease }}
          >
            {filtered.length === 0 ? (
              <EmptyState category={activeCategory} categoriesData={categories} />
            ) : (
              filtered.map((project, i) => (
                <ProjectCard
                  key={`${activeCategory}-${project.number}`}
                  project={project} index={i} totalCards={filtered.length}
                  categoriesData={categoriesData}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}