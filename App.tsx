import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { ArtPile } from './components/ArtPile';
import { SelectiveProof } from './components/SelectiveProof';
import { Contact } from './components/Contact';
import { NotFound } from './components/NotFound';
import { FilmCursor } from './components/FilmCursor';
import { PageTransition } from './components/PageTransition';
import { Marquee } from './components/Marquee';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PaperTearPlug } from './components/PaperTearPlug';
import { WorldGate } from './components/WorldGate';
import { WorldProvider, useWorld, type World } from './hooks/useWorld';
import { socials } from './content/socials';

const ProjectPage = lazy(() =>
  import('./components/ProjectPage').then((m) => ({ default: m.ProjectPage }))
);

const PageHome = lazy(() =>
  import('./components/ink/PageHome').then((m) => ({ default: m.PageHome }))
);

interface WorldNavItem {
  label: string;
  ordinal: string;
  sectionId: string;
}

/** Same skeleton, two skins: chapters on film, contents on paper. */
const NAV_ITEMS: Record<World, WorldNavItem[]> = {
  screen: [
    { label: 'Home', ordinal: '00', sectionId: 'home' },
    { label: 'Works', ordinal: '01', sectionId: 'portfolio' },
    { label: 'Archive', ordinal: '02', sectionId: 'archive' },
    { label: 'Proof', ordinal: '03', sectionId: 'proof' },
    { label: 'Contact', ordinal: '04', sectionId: 'contact' },
  ],
  page: [
    { label: 'The Books', ordinal: '01', sectionId: 'books' },
    { label: 'Write Back', ordinal: '02', sectionId: 'letters' },
  ],
};

const homePath = (world: World) => (world === 'page' ? '/ink' : '/');

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
  return (
    <>
      <section id="home" className="scroll-mt-0">
        <Hero />
      </section>

      <section id="portfolio" className="scroll-mt-24">
        <Portfolio />
      </section>

      <PaperTearPlug />

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
  const { world } = useWorld();
  const items = NAV_ITEMS[world];

  if (world === 'page') {
    return (
      <footer className="py-16 px-6 md:px-8 border-t-[3px] border-zine-ink relative z-[2] bg-zine-paper">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <span className="marker text-zine-pink text-2xl block rotate-[-2deg]" aria-hidden="true">
            xoxo
          </span>
          <p className="tw-voice text-jelly-muted text-xs md:text-sm leading-relaxed">
            written &amp; directed by Lakaaysha van Ewijk.
          </p>
          <div className="flex justify-center gap-x-7 gap-y-2 flex-wrap tw-voice text-[10px] uppercase tracking-[0.22em] text-jelly-muted">
            {items.map((item) => (
              <Link
                key={item.sectionId}
                to={{ pathname: '/ink', hash: `#${item.sectionId}` }}
                className="hover:text-thread transition-colors"
              >
                {item.ordinal}. {item.label}
              </Link>
            ))}
            <Link to="/" className="text-thread-deep hover:text-thread transition-colors">
              ⟵ the screen
            </Link>
          </div>
          <div className="flex justify-center gap-x-7 gap-y-2 flex-wrap tw-voice text-[10px] uppercase tracking-[0.22em] text-jelly-muted">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-thread transition-colors"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <p className="tw-voice text-[10px] uppercase tracking-[0.2em] text-jelly-muted/70">
            &copy; {currentYear} lakaaysha — press X to change worlds · site made in one long take with Claude
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-12 px-6 md:px-8 border-t border-jelly-line/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <Link
            to="/"
            className="text-xl font-serif tracking-tight uppercase text-jelly-text/60 hover:text-jelly-text transition-colors"
          >
            LAKAAYSHA<span className="text-jelly-accent">.</span>
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-jelly-muted">
            {items.map((item) => (
              <Link
                key={item.sectionId}
                to={{ pathname: '/', hash: `#${item.sectionId}` }}
                className="hover:text-jelly-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/ink" className="text-thread hover:text-jelly-accent transition-colors">
              II — The Page
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-jelly-line/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-jelly-muted/60">
            <span>&copy; {currentYear} Lakaaysha</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-jelly-muted/60">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-jelly-accent transition-colors"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <div className="tc-badge text-jelly-muted/40">
            Film Director / Visual Artist / Author — press X to change worlds
          </div>
        </div>
      </div>
    </footer>
  );
};

const SiteNavigation: React.FC = () => {
  const location = useLocation();
  const { world } = useWorld();
  const items = NAV_ITEMS[world];
  const home = homePath(world);
  const isHomeRoute = location.pathname === home;

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
      if (event.key === 'Escape') {
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

    items.forEach((item) => {
      const el = document.getElementById(item.sectionId);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [isHomeRoute, items]);

  const sectionTarget = (sectionId: string) => ({ pathname: home, hash: `#${sectionId}` });
  const crossTarget = world === 'screen' ? '/ink' : '/';
  const crossLabel = world === 'screen' ? 'II — The Page' : 'I — The Screen';

  return (
    <>
      <a
        href={world === 'page' ? '/ink#books' : '/#portfolio'}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-jelly-accent focus:text-black focus:px-4 focus:py-2 focus:text-xs uppercase tracking-[0.14em]"
      >
        Skip to content
      </a>

      <nav className="fixed top-0 left-0 w-full z-[100] px-5 md:px-8 py-4 md:py-5 flex justify-between items-center bg-gradient-to-b from-jelly-ink/90 to-transparent">
        <Link
          to={home}
          className={`flex items-baseline gap-3 tracking-tight ${
            world === 'page'
              ? 'marker text-2xl md:text-[1.6rem] text-jelly-text rotate-[-1.5deg]'
              : 'text-xl md:text-2xl font-serif uppercase text-jelly-text mix-blend-difference'
          }`}
        >
          {world === 'page' ? (
            <>
              lakaaysha<span className="text-thread">!</span>
              <span className="tw-voice text-[9px] tracking-[0.3em] uppercase text-jelly-muted hidden sm:inline rotate-[1.5deg]">
                the page
              </span>
            </>
          ) : (
            <>
              LAKAAYSHA<span className="text-jelly-accent">.</span>
              <span className="rec-dot hidden sm:inline-block" aria-hidden="true" />
            </>
          )}
        </Link>

        <div className="flex items-center space-x-5 md:space-x-7">
          <div
            className={`hidden md:flex space-x-8 text-[10px] uppercase font-medium text-jelly-muted/80 ${
              world === 'page' ? 'tracking-[0.2em]' : 'tracking-[0.28em]'
            }`}
          >
            {items.map((item) => {
              const isActive = isHomeRoute && activeSection === item.sectionId;

              return (
                <Link
                  key={item.sectionId}
                  to={sectionTarget(item.sectionId)}
                  className={`transition-all duration-300 relative hover:text-jelly-text ${
                    isActive ? 'text-jelly-text' : ''
                  } ${world === 'page' ? 'tw-voice text-[11px] tracking-[0.14em]' : 'tc-badge'}`}
                >
                  {world === 'page' ? (
                    <>
                      <span className="text-thread mr-1.5 font-bold">{item.ordinal}</span>
                      {item.label}
                    </>
                  ) : (
                    <>
                      <span className="text-jelly-accent/70 mr-1.5">{item.ordinal}</span>
                      {item.label}
                    </>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-jelly-accent" />
                  )}
                </Link>
              );
            })}

            <Link
              to={crossTarget}
              className={`transition-colors text-thread hover:text-jelly-text ${
                world === 'page' ? 'marker normal-case text-sm rotate-[-1deg]' : 'tc-badge'
              }`}
            >
              {crossLabel}
            </Link>
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
            aria-keyshortcuts="Escape"
          >
            <X size={16} />
            <span>Close</span>
          </button>

          <nav className="flex flex-col items-center space-y-8">
            {items.map((item) => (
              <Link
                key={item.sectionId}
                to={sectionTarget(item.sectionId)}
                className={`text-2xl transition-colors hover:text-jelly-accent ${
                  world === 'page' ? 'marker' : 'uppercase tracking-[0.22em] font-serif'
                } ${
                  isHomeRoute && activeSection === item.sectionId
                    ? 'text-jelly-accent'
                    : 'text-jelly-text'
                }`}
              >
                {world === 'page' ? `${item.ordinal} ${item.label}` : item.label}
              </Link>
            ))}

            <Link
              to={crossTarget}
              className={`text-2xl text-thread transition-colors hover:text-jelly-accent ${
                world === 'page' ? 'marker rotate-[-1.5deg]' : 'uppercase tracking-[0.22em] font-serif'
              }`}
            >
              {crossLabel}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

const WorldMarquees: React.FC = () => {
  const { world } = useWorld();

  if (world === 'page') {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-[90] py-1 bg-zine-pink hidden md:block">
          <Marquee speed={42} className="tw-voice text-[9px] uppercase tracking-[0.3em] text-zine-paper">
            <span className="mx-8">Queerantine — 7.5K reads</span>
            <span className="mx-8">★</span>
            <span className="mx-8">New chapters mon / wed / fri</span>
            <span className="mx-8">★</span>
            <span className="mx-8">A second novel in edit</span>
            <span className="mx-8">★</span>
            <span className="mx-8">Amsterdam</span>
            <span className="mx-8">★</span>
          </Marquee>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-[90] py-1.5 bg-zine-ink">
          <Marquee speed={56} direction="right" className="marker text-[11px] tracking-[0.1em] text-zine-paper/90">
            <span className="mx-6">ink &amp; light</span>
            <span className="mx-6 text-zine-pink">·</span>
            <span className="mx-6">the page</span>
            <span className="mx-6 text-zine-pink">·</span>
            <span className="mx-6">the screen</span>
            <span className="mx-6 text-zine-pink">·</span>
            <span className="mx-6">one thread</span>
            <span className="mx-6 text-zine-pink">·</span>
          </Marquee>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[90] py-1 bg-jelly-ink/80 backdrop-blur-sm border-b border-jelly-line/20 hidden md:block">
        <Marquee speed={40} className="text-[9px] uppercase tracking-[0.3em] text-jelly-muted/50">
          <span className="mx-8">Film Director</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Visual Artist</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">She Also Writes</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Based in Amsterdam</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
          <span className="mx-8">Available for Commissions</span>
          <span className="mx-8 text-jelly-accent/50">•</span>
        </Marquee>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[90] py-1.5 bg-jelly-ink/80 backdrop-blur-sm border-t border-jelly-line/20">
        <Marquee speed={50} direction="right" className="text-[9px] uppercase tracking-[0.3em] text-jelly-muted/40">
          <span className="mx-6">LAKAAYSHA</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Film Director</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Visual Artist</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Author</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Storytelling</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
          <span className="mx-6">Cinema</span>
          <span className="mx-6 text-jelly-accent/40">•</span>
        </Marquee>
      </div>
    </>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const home = location.pathname === '/' || location.pathname === '/ink';
    if (!home || !location.hash) {
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
      <FilmCursor />
      <PageTransition />
      <WorldGate />

      <WorldMarquees />

      <SiteNavigation />
      <ScrollToTop />

      <ErrorBoundary>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/ink" element={<PageHome />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <SiteFooter />
    </main>
  );
};

function App() {
  return (
    <WorldProvider>
      <AppShell />
    </WorldProvider>
  );
}

export default App;
