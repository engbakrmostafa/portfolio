import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import type { ServiceData } from '../App';

const defaultServices = [
  {
    number: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    number: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    number: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    number: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

interface ServicesSectionProps {
  servicesData?: ServiceData[];
}

export default function ServicesSection({ servicesData }: ServicesSectionProps) {
  const displayServices = servicesData && servicesData.length > 0 ? servicesData : defaultServices;

  return (
    <section
      id="price"
      style={{
        background: '#0C0C0C',
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 48px)',
        position: 'relative',
        zIndex: 10,
        /* prevent any child from breaking out */
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <h2
        className="hero-heading"
        style={{
          fontWeight: 900,
          textTransform: 'uppercase',
          textAlign: 'center',
          fontSize: 'clamp(2.8rem, 12vw, 160px)',
          lineHeight: 0.9,
          marginBottom: 'clamp(40px, 8vw, 80px)',
          wordBreak: 'break-word',
        }}
      >
        Services
      </h2>

      {/* Cards */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {displayServices.map((service, index) => (
          <FadeIn key={service.number} delay={index * 0.07} y={30}>
            <motion.div
              whileHover={{ scale: 1.012, y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                display: 'flex',
                flexDirection: 'column',   /* always column — safe on all widths */
                gap: 10,
                padding: 'clamp(16px, 3vw, 28px)',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                overflow: 'hidden',         /* hard stop — nothing escapes */
                width: '100%',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
              }}
              onHoverStart={e => {
                (e.target as HTMLElement).closest('[data-svc]' as string)?.setAttribute('style', '');
              }}
            >
              {/* Top row: number + name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 20px)',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(2rem, 8vw, 72px)',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.18)',
                    flexShrink: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {service.number}
                </span>

                {/* Divider */}
                <div
                  style={{
                    width: 1,
                    height: 'clamp(28px, 5vw, 48px)',
                    background: 'rgba(255,255,255,0.1)',
                    flexShrink: 0,
                  }}
                />

                {/* Name */}
                <h3
                  style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.4rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    margin: 0,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {service.name}
                </h3>

                {/* Arrow icon */}
                <span
                  style={{
                    color: 'rgba(181,1,167,0.5)',
                    fontSize: 'clamp(14px, 2vw, 20px)',
                    flexShrink: 0,
                  }}
                >
                  ↗
                </span>
              </div>

              {/* Description — always below, always contained */}
              <p
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 'clamp(13px, 1.6vw, 16px)',
                  lineHeight: 1.7,
                  margin: 0,
                  paddingLeft: 'clamp(0px, 1vw, 8px)',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  width: '100%',
                }}
              >
                {service.description}
              </p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}