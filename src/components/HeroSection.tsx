import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Magnet from './Magnet';
import type { HeroData } from '../App';

const themeOptions = [
  { name: 'Pink', color: 'rgba(181, 1, 167, 0.08)', value: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)' },
  { name: 'Emerald', color: 'rgba(16, 185, 129, 0.08)', value: 'linear-gradient(180deg, #10B981 0%, #A7F3D0 100%)' },
  { name: 'Orange', color: 'rgba(249, 115, 22, 0.08)', value: 'linear-gradient(180deg, #F97316 0%, #FED7AA 100%)' },
  { name: 'Blue', color: 'rgba(59, 130, 246, 0.08)', value: 'linear-gradient(180deg, #3B82F6 0%, #DBEAFE 100%)' },
];

interface HeroSectionProps {
  heroData?: HeroData;
  setAccentColor: (color: string) => void;
}

// Typewriter hook
function useTypewriter(text: string, speed = 45) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the animation when the source text changes
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;
    if (!text) return;

    const timer = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

export default function HeroSection({ heroData, setAccentColor }: HeroSectionProps) {
  const name = heroData?.name || 'Abdelrhaman';
  const roleText = heroData?.role_description || 'a 3d creator driven by crafting striking and unforgettable projects';
  const portraitUrl =
    heroData?.portrait ||
    'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png';

  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0]);
  const { displayed, done } = useTypewriter(roleText, 38);

  // 3-D parallax tilt
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-200, 200], [10, -10]);
  const rotateY = useTransform(cardX, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { cardX.set(0); cardY.set(0); };

  const selectTheme = (t: typeof themeOptions[0]) => {
    setSelectedTheme(t);
    setAccentColor(t.color);
  };

  return (
    <section className="min-h-[100svh] flex flex-col justify-center items-center overflow-x-hidden relative noise-overlay px-4 pt-24 pb-8">
      {/* ── Heading ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full overflow-hidden z-10"
      >
        <h1
          className="hero-heading font-black uppercase tracking-tight leading-[0.9] w-full text-[clamp(2.75rem,10vw,10rem)] text-center"
          style={{ background: selectedTheme.value, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
        >
          Hi, i&apos;m {name}
        </h1>
      </motion.div>

      {/* ── Typewriter role description ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-20 text-center px-4 mt-3"
      >
        <p className="text-white/50 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto">
          {displayed}
          {!done && <span className="typewriter-cursor" />}
        </p>
      </motion.div>

      {/* ── Theme colour swatches ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="relative z-20 flex items-center justify-center gap-3 mt-4"
      >
        {themeOptions.map((t) => (
          <button
            key={t.name}
            onClick={() => selectTheme(t)}
            title={t.name}
            className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
              selectedTheme.name === t.name
                ? 'scale-125 border-white/80'
                : 'border-transparent hover:scale-110 opacity-60 hover:opacity-100'
            }`}
            style={{ background: t.value }}
          />
        ))}
      </motion.div>

      {/* ── 3-D Parallax Portrait ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] mt-5 flex-shrink-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Magnet padding={150} strength={3}>
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src={portraitUrl}
              alt={`${name} Portrait`}
              className="w-full max-h-[32svh] object-contain cursor-pointer drop-shadow-[0_15px_30px_rgba(255,255,255,0.05)] transition-shadow duration-300 hover:drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
            />
          </motion.div>
        </Magnet>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="scroll-arrow relative z-20 flex flex-col items-center gap-1 mt-4"
      >
        <span className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30">
          <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
