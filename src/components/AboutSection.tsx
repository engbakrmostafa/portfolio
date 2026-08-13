import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import Magnet from './Magnet';
import type { AboutData } from '../App';

interface AboutSectionProps {
  aboutData?: AboutData;
}

// Animated counter
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const display = inView ? value : 0;

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ textContent: '0' }}
        animate={inView ? { textContent: String(value) } : {}}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        onUpdate={(latest) => {
          if (ref.current) {
            const num = Math.round(Number(latest.textContent));
            ref.current.textContent = `${num}${suffix}`;
          }
        }}
        className="font-black text-white text-[clamp(1.8rem,4vw,3rem)] leading-none"
      >
        {display}{suffix}
      </motion.span>
    </motion.span>
  );
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
  const aboutText =
    aboutData?.main_text ||
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

  const moonIcon = aboutData?.moon_icon || 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png';
  const objectIcon1 = aboutData?.object_icon_1 || 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png';
  const legoIcon = aboutData?.lego_icon || 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png';
  const objectIcon2 = aboutData?.object_icon_2 || 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png';

  const yearsExp = aboutData?.years_experience ?? 5;
  const projectsDone = aboutData?.projects_completed ?? 40;
  const clients = aboutData?.happy_clients ?? 30;

  return (
    <section id="about" className="min-h-screen relative px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* ── Floating Icons ────────────────────────────────────── */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
        <Magnet strength={10} padding={300} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 hidden sm:block">
          <img src={moonIcon} alt="Moon"
            className="w-[100px] sm:w-[140px] md:w-[190px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] cursor-pointer" />
        </Magnet>
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
        <Magnet strength={10} padding={300} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 hidden sm:block">
          <img src={objectIcon1} alt="3D Object"
            className="w-[80px] sm:w-[120px] md:w-[160px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] cursor-pointer" />
        </Magnet>
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
        <Magnet strength={10} padding={300} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 hidden sm:block">
          <img src={legoIcon} alt="Lego"
            className="w-[100px] sm:w-[140px] md:w-[190px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] cursor-pointer" />
        </Magnet>
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
        <Magnet strength={10} padding={300} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 hidden sm:block">
          <img src={objectIcon2} alt="3D Group"
            className="w-[100px] sm:w-[140px] md:w-[190px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] cursor-pointer" />
        </Magnet>
      </FadeIn>

      {/* ── Center Content ────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-10 sm:gap-12 relative z-0 mt-16 sm:mt-20">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)]">
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={aboutText}
          className="text-[#F3F4F6] font-medium text-center leading-relaxed max-w-[540px] text-[clamp(1rem,2vw,1.35rem)]"
        />

        {/* ── Stats ─────────────────────────────────────────── */}
        <FadeIn delay={0.2} y={30}>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center mt-2">
            {[
              { value: yearsExp, suffix: '+', label: 'Years Experience' },
              { value: projectsDone, suffix: '+', label: 'Projects Done' },
              { value: clients, suffix: '+', label: 'Happy Clients' },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Counter value={value} suffix={suffix} />
                <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}