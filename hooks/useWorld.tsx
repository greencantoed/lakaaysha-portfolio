import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type World = 'screen' | 'page';

interface WorldContextValue {
  world: World;
  other: World;
  /** Navigate to the other world's home (or a specific world). */
  crossOver: (target?: World) => void;
}

const WorldContext = createContext<WorldContextValue>({
  world: 'screen',
  other: 'page',
  crossOver: () => {},
});

const WORLD_TITLES: Record<World, string> = {
  screen: 'LAKAAYSHA | Film Director & Visual Artist',
  page: 'LAKAAYSHA | Author — Queerantine & more',
};

export const worldHome = (target: World) => (target === 'page' ? '/ink' : '/');

/** The URL is the source of truth: /ink* lives on paper, the rest on film. */
export const WorldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const world: World = location.pathname.startsWith('/ink') ? 'page' : 'screen';
  const other: World = world === 'page' ? 'screen' : 'page';

  useEffect(() => {
    document.documentElement.dataset.world = world;
  }, [world]);

  // Project pages keep their own titles; only home routes announce the world.
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/ink') {
      document.title = WORLD_TITLES[world];
    }
  }, [world, location.pathname]);

  const value = useMemo<WorldContextValue>(
    () => ({
      world,
      other,
      crossOver: (target) => navigate(worldHome(target ?? other)),
    }),
    [world, other, navigate]
  );

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
};

export const useWorld = () => useContext(WorldContext);
