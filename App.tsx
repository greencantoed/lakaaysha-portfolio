import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { ArtPile } from './components/ArtPile';
import { SelectiveProof } from './components/SelectiveProof';
import { Contact } from './components/Contact';
import { ProjectPage } from './components/ProjectPage';
import { NotFound } from './components/NotFound';
import { FireCursor } from './components/FireCursor';
import { FilmCursor } from './components/FilmCursor';
import { PageTransition } from './components/PageTransition';
import { Marquee } from './components/Marquee';
import { ErrorBoundary } from './components/ErrorBoundary';

const ENABLE_CUSTOM_CURSOR = true;

// Mouse glow effect component
const MouseGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable on non-touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 100);
    };

    const updatePosition = () => {
      if (glowRef.current) {
        glowRef.current.style.left = `${mousePos.current.x}px`;
        glowRef.current.style.top = `${mousePos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      className="mouse-glow"
      style={{ opacity: isVisible ? 1 : 0 }}
    />
  );
};

const NAV_ITEMS = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Works', sectionId: 'portfolio' },
  { label: 'Archive', sectionId: 'archive' },
  { label: 'Proof', sectionId: 'proof' },
  { label: 'Contact', sectionId: 'contact' },
] as const;

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const OverviewPage: React.FC = () => {
  useEffect(() => {
    document.title = 'LAKAAYSHA | Film Director & Visual Artist';
  }, []);

  return (
    <>
      <section id="home" className="scroll-mt-0">
        <Hero />
      </section>

      <section id="portfolio" className="scroll-mt-24">
        <Portfolio />
      </section>

      <section id="archive" className="scroll-mt-24">
        <ArtPile />
      </section>

      <section id="proof" className="scroll-mt-24">
        <SelectiveProof />
      </section>

      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </>
  );
};

const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6 md:px-8 border-t border-jelly-line/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-xl font-serif tracking-tight uppercase text-jelly-text/60 hover:text-jelly-text transition-colors">
            LAKAAYSHA<span className="text-jelly-accent">.</span>
          </Link>
          
          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-jelly-muted">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.sectionId}
                to={{ pathname: '/', hash: `#${item.sectionId}` }}
                className="hover:text-jelly-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-jelly-line/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-jelly-muted/60">
            <span>&copy; {currentYear} Lakaaysha</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-jelly-muted/40">
            Film Director / Visual Artist
          </div>
        </div>
      </div>
    </footer>
  );
};

const SiteNavigation: React.FC = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleCloseKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 'x') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleCloseKeys);
    return () => document.removeEventListener('keydown', handleCloseKeys);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isHomeRoute) {
      setActiveSection('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.sectionId);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [isHomeRoute]);

  const sectionTarget = (sectionId: string) => ({ pathname: '/', hash: `#${sectionId}` });

  return (
    <>
      <a
        href="/#portfolio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-jelly-accent focus:text-black focus:px-4 focus:py-2 focus:text-xs uppercase tracking-[0.14em]"
      >
        Skip to content
      </a>

      <nav className="fixed top-0 left-0 w-full z-[100] px-5 md:px-8 py-4 md:py-5 flex justify-between items-center bg-gradient-to-b from-jelly-ink/90 to-transparent">
        <Link to="/" className="text-xl md:text-2xl font-serif tracking-tight uppercase text-jelly-text mix-blend-difference">
          LAKAAYSHA<span className="text-jelly-accent">.</span>
        </Link>

        <div className="flex items-center space-x-5 md:space-x-7">
          <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-[0.28em] font-medium text-jelly-muted/80">
            {NAV_ITEMS.map((item) => {
              const isActive = isHomeRoute && activeSection === item.sectionId;

              return (
                <Link
                  key={item.sectionId}
                  to={sectionTarget(item.sectionId)}
                  className={`transition-all duration-300 relative hover:text-jelly-text ${isActive ? 'text-jelly-text' : ''}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-jelly-accent" />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 transition-colors text-jelly-text hover:text-jelly-accent"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-jelly-ink">
          <button
            className="absolute top-5 right-6 inline-flex items-center gap-2 border border-jelly-line/70 bg-jelly-surface px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-jelly-text hover:text-jelly-accent hover:border-jelly-accent"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            aria-keyshortcuts="Escape X"
          >
            <X size={16} />
            <span>Close</span>
          </button>

          <nav className="flex flex-col items-center space-y-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.sectionId}
                to={sectionTarget(item.sectionId)}
                className={`text-2xl uppercase tracking-[0.22em] font-serif transition-colors hover:text-jelly-accent ${
                  isHomeRoute && activeSection === item.sectionId ? 'text-jelly-accent' : 'text-jelly-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    if (!location.hash) {
      return;
    }

    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <main className="min-h-screen selection:bg-jelly-accent selection:text-black relative pb-8">
      <MouseGlow />
      {ENABLE_CUSTOM_CURSOR ? <FilmCursor /> : null}
      <PageTransition />
      
      {/* Top marquee */}
      <div className="fixed top-0 left-0 right-0 z-[90] py-1 bg-jelly-ink/80 backdrop-blur-sm border-b border-jelly-line/20 hidden md:block">
        <Marquee speed={40} className="text-[9px] uppercase tracking-[0.3em] text-jelly-muted/50">
          <span className="mx-8">Film Director</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Visual Artist</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Based in Amsterdam</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Available for Commissions</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
        </Marquee>
      </div>
      
      <SiteNavigation />
      <ScrollToTop />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>

      <SiteFooter />
      
      {/* Bottom marquee */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] py-1.5 bg-jelly-ink/80 backdrop-blur-sm border-t border-jelly-line/20">
        <Marquee speed={50} direction="right" className="text-[9px] uppercase tracking-[0.3em] text-jelly-muted/40">
          <span className="mx-6">LAKAAYSHA</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Film Director</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Visual Artist</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Storytelling</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Cinema</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
        </Marquee>
      </div>
    </main>
  );
}

export default App;
