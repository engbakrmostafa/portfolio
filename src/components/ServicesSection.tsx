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
      "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
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
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-24 sm:py-32 relative z-10"
    >
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-24">
        Services
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {displayServices.map((service, index) => (
          <FadeIn key={service.number} delay={index * 0.08} y={35}>
            <motion.div
              whileHover={{ scale: 1.015, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 rounded-[30px] border border-white/5 bg-white/5 backdrop-blur-md hover:border-[#B501A7]/40 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_rgba(181,1,167,0.1)] transition-all duration-300 group cursor-pointer"
            >
              {/* Left Side: Number & Name */}
              <div className="flex items-center gap-6 sm:gap-10">
                <span className="service-number font-black text-[clamp(2rem,6vw,80px)] leading-none">
                  {service.number}
                </span>
                <h3 className="service-title font-semibold uppercase text-lg sm:text-xl md:text-2xl group-hover:translate-x-1">
                  {service.name}
                </h3>
              </div>

              {/* Right Side: Description */}
              <p className="service-desc font-light leading-relaxed max-w-2xl text-sm sm:text-base md:text-lg md:text-right">
                {service.description}
              </p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}