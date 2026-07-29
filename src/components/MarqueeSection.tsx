import { useRef, useEffect, useState } from 'react';

const defaultGifImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
];

interface MarqueeSectionProps {
  marqueeData?: string[];
}

export default function MarqueeSection({ marqueeData }: MarqueeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayImages = marqueeData && marqueeData.length > 0 ? marqueeData : defaultGifImages;

  // Split images into two rows
  const midPoint = Math.ceil(displayImages.length / 2);
  const row1Images = displayImages.slice(0, midPoint);
  const row2Images = displayImages.slice(midPoint);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-10 overflow-hidden"
    >
      {/* Row 1 - moves right */}
      {row1Images.length > 0 && (
        <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3" style={{ willChange: 'transform' }}>
          <div
            className="flex gap-2 sm:gap-3"
            style={{
              transform: `translateX(${offset - 200}px)`,
              willChange: 'transform',
            }}
          >
            {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Gallery row 1 - ${i}`}
                className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-[180px] sm:h-[210px] md:h-[250px] lg:h-[270px] rounded-xl sm:rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* Row 2 - moves left */}
      {row2Images.length > 0 && (
        <div className="flex gap-2 sm:gap-3" style={{ willChange: 'transform' }}>
          <div
            className="flex gap-2 sm:gap-3"
            style={{
              transform: `translateX(${-(offset - 200)}px)`,
              willChange: 'transform',
            }}
          >
            {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Gallery row 2 - ${i}`}
                className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-[180px] sm:h-[210px] md:h-[250px] lg:h-[270px] rounded-xl sm:rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
