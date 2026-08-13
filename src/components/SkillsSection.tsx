import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SkillData } from '../App';

interface SkillsSectionProps {
  skillsData?: SkillData[];
}

// Seeded random so positions are consistent across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function SkillsSection({ skillsData }: SkillsSectionProps) {
  const skills = skillsData && skillsData.length > 0 ? skillsData : [];

  // Only show skills that have an icon_image uploaded
  const iconSkills = skills.filter((s) => s.icon_image);

  // Generate flight paths for each icon
  const flightData = useMemo(() => {
    return iconSkills.map((skill, i) => {
      const r1 = seededRandom(i + 1);
      const r2 = seededRandom(i + 50);
      const r3 = seededRandom(i + 100);
      const r4 = seededRandom(i + 200);

      // Spread icons across the full area
      const startX = 5 + r1 * 85;   // 5% - 90%
      const startY = 5 + r2 * 85;   // 5% - 90%

      // Flight path waypoints (percentage)
      const midX1 = (startX + 20 + r3 * 30) % 90 + 5;
      const midY1 = (startY - 15 + r4 * 25 + 100) % 90 + 5;
      const midX2 = (startX - 15 + r2 * 35 + 100) % 90 + 5;
      const midY2 = (startY + 20 + r1 * 30) % 90 + 5;

      const duration = 18 + r3 * 14; // 18s - 32s
      const delay = r4 * 4;          // 0 - 4s stagger
      const size = 55 + r1 * 30;     // 55px - 85px

      return {
        skill,
        startX, startY,
        midX1, midY1,
        midX2, midY2,
        duration, delay, size,
      };
    });
  }, [iconSkills]);

  if (iconSkills.length === 0) {
    return (
      <section id="skills" className="bg-[#0A0B0E] px-5 py-32 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-[400px]">
          <p className="text-white/20 text-sm uppercase tracking-widest font-semibold">
            Upload skill icons in Admin Panel to see flight animation
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="bg-[#0A0B0E] relative z-10 overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px]">

        {/* Subtle radial glow in center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(181,1,167,0.06)_0%,_transparent_70%)] pointer-events-none" />

        {/* Floating icons */}
        {flightData.map(({ skill, startX, startY, midX1, midY1, midX2, midY2, duration, delay, size }, i) => (
          <motion.div
            key={skill.name}
            className="absolute cursor-pointer"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: `${startY}%`,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: [0, 1, 1, 1, 0.8, 1],
              scale: [0.3, 1, 1.05, 0.95, 1, 1],
              x: [
                '0%',
                `${midX1 - startX}%`,
                `${midX2 - startX}%`,
                `${(midX1 + midX2) / 2 - startX}%`,
                '0%',
              ],
              y: [
                '0%',
                `${midY1 - startY}%`,
                `${midY2 - startY}%`,
                `${(midY1 + midY2) / 2 - startY}%`,
                '0%',
              ],
              rotateY: [0, 15, -10, 8, 0],
              rotateX: [0, -8, 12, -5, 0],
              rotateZ: [0, 5, -5, 3, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{
              scale: 1.4,
              zIndex: 100,
              rotateY: 0,
              rotateX: 0,
              filter: 'drop-shadow(0 0 25px rgba(181,1,167,0.6))',
              transition: { duration: 0.3 },
            }}
          >
            <img
              src={skill.icon_image!}
              alt={skill.name}
              title={skill.name}
              draggable={false}
              className="w-full h-full object-contain select-none"
              style={{
                filter: `drop-shadow(0 8px 20px ${skill.color}40)`,
              }}
            />
          </motion.div>
        ))}

      </div>
    </section>
  );
}
