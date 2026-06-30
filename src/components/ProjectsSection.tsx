import { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ProjectData } from '../App';
import LiveProjectButton from './LiveProjectButton';

const defaultProjects: ProjectData[] = [
  {
    number: '01', category: 'Client', name: 'Nextlevel Studio',
    description: 'Full 3D brand identity and motion package for a creative studio.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
  },
  {
    number: '02', category: 'Personal', name: 'Aura Brand Identity',
    description: 'Visual identity system with logo, color palette, and typography.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ],
  },
  {
    number: '03', category: 'Client', name: 'Solaris Digital',
    description: 'Product visualisation and web design for a solar-tech startup.',
    live_link: 'https://github.com', video_url: null, video_file: null,
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ],
  },
];

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) {
  const [current, setCurrent] = useState(initial);
  const go = (dir: 1 | -1) => setCurrent((c) => (c + dir + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl font-light"
        onClick={onClose}
      >✕</button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 sm:left-8 text-white/60 hover:text-white text-4xl font-thin z-10"
          onClick={(e) => { e.stopPropagation(); go(-1); }}
        >‹</button>
      )}

      {/* Image */}
      <motion.img
        key={current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        src={images[current]}
        alt={`Lightbox ${current + 1}`}
        className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 sm:right-8 text-white/60 hover:text-white text-4xl font-thin z-10"
          onClick={(e) => { e.stopPropagation(); go(1); }}
        >›</button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${i === current ? 'bg-white scale-125' : 'bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index, totalCards }: { project: ProjectData; index: number; totalCards: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const videoSrc = project.video_file || project.video_url;
  const [lightbox, setLightbox] = useState<{ images: string[]; initial: number } | null>(null);

  let col1a = '', col1b = '';
  let col2: React.ReactNode;

  if (videoSrc) {
    col2 = (
      <video src={videoSrc} autoPlay loop muted playsInline
        className="w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] object-cover" />
    );
    col1a = project.images[0] || '';
    col1b = project.images[1] || '';
  } else {
    const main = project.images[0] || '';
    col2 = (
      <img src={main} alt={`${project.name} main`}
        className="w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] object-cover cursor-zoom-in"
        onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: 0 })} />
    );
    col1a = project.images[1] || '';
    col1b = project.images[2] || '';
  }

  const fallback = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

  return (
    <>
      <div ref={containerRef} className="h-[85vh] relative" style={{ top: `${index * 28}px` }}>
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="sticky top-20 md:top-24 h-[calc(100vh-10rem)] md:h-[calc(100vh-14rem)] bg-[#0C0C0C]/90 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border border-white/10 hover:border-[#B501A7]/40 hover:shadow-[0_20px_45px_rgba(181,1,167,0.1)] transition-all duration-300 p-4 sm:p-6 md:p-8 flex flex-col backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-black text-white text-[clamp(2rem,7vw,100px)] leading-none">{project.number}</span>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-widest">{project.category}</span>
                {project.live_link ? (
                  <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-[#B501A7] text-base sm:text-xl md:text-2xl font-medium uppercase tracking-wider border-b border-transparent hover:border-[#B501A7] transition-all duration-200">
                    {project.name}
                  </a>
                ) : (
                  <h3 className="text-white text-base sm:text-xl md:text-2xl font-medium uppercase tracking-wider">{project.name}</h3>
                )}
                {project.description && (
                  <p className="text-white/40 text-xs sm:text-sm mt-1 max-w-xs">{project.description}</p>
                )}
              </div>
            </div>
            <LiveProjectButton href={project.live_link} />
          </div>

          {/* Image Grid */}
          <div className="flex-1 flex gap-3 min-h-0 mt-2">
            <div className="w-2/5 flex flex-col gap-3">
              <img src={col1a || fallback} alt={`${project.name} 1`}
                className="w-full h-[clamp(100px,14vw,200px)] rounded-[30px] sm:rounded-[40px] object-cover cursor-zoom-in"
                onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 0 : 1 })} />
              <img src={col1b || fallback} alt={`${project.name} 2`}
                className="w-full flex-1 rounded-[30px] sm:rounded-[40px] object-cover cursor-zoom-in"
                onClick={() => project.images.length > 0 && setLightbox({ images: project.images, initial: videoSrc ? 1 : 2 })} />
            </div>
            <div className="w-3/5">{col2}</div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox images={lightbox.images} initial={lightbox.initial} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

interface ProjectsSectionProps {
  projectsData?: ProjectData[];
}

export default function ProjectsSection({ projectsData }: ProjectsSectionProps) {
  const display = projectsData && projectsData.length > 0 ? projectsData : defaultProjects;

  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] -mt-10 sm:-mt-12 relative z-20 px-5 sm:px-8 md:px-10 py-20">
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16">
        Projects
      </h2>
      <div className="max-w-7xl mx-auto">
        {display.map((project, i) => (
          <ProjectCard key={project.number} project={project} index={i} totalCards={display.length} />
        ))}
      </div>
    </section>
  );
}