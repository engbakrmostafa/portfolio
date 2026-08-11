import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

export interface HeroData {
  name: string;
  tagline: string;
  role_description: string;
  portrait: string | null;
}

export interface AboutData {
  main_text: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  moon_icon: string | null;
  lego_icon: string | null;
  object_icon_1: string | null;
  object_icon_2: string | null;
}

export interface ServiceData {
  number: string;
  name: string;
  description: string;
}

export interface SkillData {
  name: string;
  icon: string;
  icon_image: string | null;
  category: string;
  color: string;
  level: number;
}

export interface ProjectCategoryData {
  id: number;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export interface ProjectData {
  number: string;
  category: string;
  category_icon: string;
  category_color: string;
  name: string;
  description: string;
  live_link: string | null;
  video_url: string | null;
  video_file: string | null;
  images: string[];
}

export interface SocialData {
  platform: string;
  url: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  services: ServiceData[];
  skills: SkillData[];
  marquee: string[];
  socials: SocialData[];
  project_categories: ProjectCategoryData[];
  projects: ProjectData[];
}

function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [accentColor, setAccentColor] = useState('rgba(181, 1, 167, 0.08)');

  // Fetch portfolio data from Django API
  useEffect(() => {
    const minLoadTime = new Promise((res) => setTimeout(res, 1400)); // show loading screen min 1.4s
    const fetchData = fetch('http://127.0.0.1:8000/api/portfolio/')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json() as Promise<PortfolioData>;
      })
      .catch((err) => {
        console.warn('Could not reach Django API, using fallback defaults:', err);
        return null;
      });

    Promise.all([minLoadTime, fetchData]).then(([, result]) => {
      if (result) setData(result);
      setIsLoading(false);
    });
  }, []);

  // Global cursor glow
  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && <LoadingScreen name={data?.hero?.name} />}
      </AnimatePresence>

      {/* Main app */}
      {!isLoading && (
        <div className="font-kanit relative bg-[#0C0C0C]">
          {/* Cursor glow */}
          <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
            style={{
              background: `radial-gradient(500px at ${mousePos.x}px ${mousePos.y}px, ${accentColor}, transparent 80%)`,
            }}
          />

          <Navbar userName={data?.hero?.name} />
          <HeroSection heroData={data?.hero} setAccentColor={setAccentColor} />
          <MarqueeSection marqueeData={data?.marquee} />
          <AboutSection aboutData={data?.about} />
          <SkillsSection skillsData={data?.skills} />
          <ServicesSection servicesData={data?.services} />
          <ProjectsSection projectsData={data?.projects} categoriesData={data?.project_categories} />
          <ContactSection socialsData={data?.socials} />
          <Footer socialsData={data?.socials} userName={data?.hero?.name} />
        </div>
      )}
    </>
  );
}

export default App;