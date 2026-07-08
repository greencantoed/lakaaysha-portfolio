import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWorld, worldHome, type World } from '../hooks/useWorld';
import { useNavigate } from 'react-router-dom';

/**
 * THE GATE — the seam between the two worlds.
 *
 * Desktop: a vermillion spine on the screen edge. Grab it and drag: the
 * other world wipes in live under your hand, like an editing wipe / a page
 * pulled across. Release past a third — it commits; otherwise it springs
 * back. Clicking the spine (or pressing X anywhere) is a hard CUT.
 *
 * Touch: a two-faced coin button, bottom right.
 *
 * Choreography on commit:
 *   cover (curtain sweeps to 0%) → swap route beneath → hold a beat →
 *   exit (curtain continues off the far side) → idle.
 */

const COMMIT_THRESHOLD = 0.3;
const DRAG_GAIN = 1.12; // full wipe doesn't require a full-viewport pull

const CurtainFace: React.FC<{ target: World }> = ({ target }) =>
  target === 'page' ? (
    <div className="relative flex h-full w-full flex-col items-center justify-center ruled-lines red-margin overflow-hidden">
      <div className="spiral-rail hidden md:block" aria-hidden="true" />
      <p className="marker text-[#ed2079] text-lg md:text-2xl rotate-[-2deg] mb-5">
        intermission — she also writes
      </p>
      <p
        className="zine-head zine-rough text-[#141312] leading-none select-none"
        style={{ fontSize: 'clamp(4rem, 15vw, 13rem)' }}
      >
        THE PAGE
      </p>
      <p className="mt-7 tw-voice text-[#e02318] text-base md:text-xl tracking-[0.3em]">№ II</p>
    </div>
  ) : (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="film-perfs absolute top-6 left-0 right-0 text-black" style={{ color: '#15151c' }} />
      <div className="film-perfs absolute bottom-6 left-0 right-0" style={{ color: '#15151c' }} />
      <p className="tc-badge text-[#a5adc8] mb-6 flex items-center gap-3">
        <span className="rec-dot inline-block" />
        Reel Two — she also directs
      </p>
      <p
        className="credits-head text-[#eef1ff] select-none"
        style={{ fontSize: 'clamp(3rem, 12vw, 10.5rem)' }}
      >
        The Screen
      </p>
      <p className="tc-badge text-[#a5adc8]/60 mt-8">TC 00:00:00:00</p>
    </div>
  );

export const WorldGate: React.FC = () => {
  const { world, other } = useWorld();
  const navigate = useNavigate();

  const curtainRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; startX: number; progress: number } | null>(null);

  const [finePointer, setFinePointer] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [hinting, setHinting] = useState(false);

  const side = world === 'screen' ? 'right' : 'left';
  const target = other;

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // One-time nudge so first-time visitors notice the seam.
  useEffect(() => {
    if (localStorage.getItem('lk-gate-hint')) return;
    const on = setTimeout(() => setHinting(true), 2400);
    const off = setTimeout(() => {
      setHinting(false);
      localStorage.setItem('lk-gate-hint', '1');
    }, 8000);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, []);

  const baselineX = target === 'page' ? 100 : -100;
  const exitX = target === 'page' ? -100 : 100;

  const setCurtain = useCallback((xPercent: number) => {
    if (curtainRef.current) {
      curtainRef.current.style.transform = `translateX(${xPercent}%)`;
    }
  }, []);

  const setFaceParallax = useCallback(
    (progress: number) => {
      if (faceRef.current) {
        const drift = (1 - progress) * (target === 'page' ? 6 : -6);
        faceRef.current.style.transform = `translateX(${drift}%)`;
      }
    },
    [target]
  );

  const cleanup = useCallback(() => {
    const el = curtainRef.current;
    if (el) {
      el.classList.remove('curtain-commit', 'curtain-cancel');
      el.dataset.active = 'false';
      el.style.transform = `translateX(${baselineX}%)`;
    }
    busyRef.current = false;
  }, [baselineX]);

  /** Sweep from wherever the curtain is to full cover, swap worlds, sweep out. */
  const commit = useCallback(() => {
    const el = curtainRef.current;
    if (!el) return;
    busyRef.current = true;
    el.dataset.active = 'true';
    el.classList.remove('curtain-cancel');
    // Next frame so a fresh curtain (click/X without drag) still animates.
    requestAnimationFrame(() => {
      el.classList.add('curtain-commit');
      setCurtain(0);
      setFaceParallax(1);
      window.setTimeout(() => {
        navigate(worldHome(target));
        window.setTimeout(() => {
          setCurtain(exitX);
          window.setTimeout(cleanup, 560);
        }, 140);
      }, 520);
    });
  }, [navigate, target, exitX, setCurtain, setFaceParallax, cleanup]);

  const cancel = useCallback(() => {
    const el = curtainRef.current;
    if (!el) return;
    el.classList.add('curtain-cancel');
    setCurtain(baselineX);
    setFaceParallax(0);
    window.setTimeout(() => {
      el.classList.remove('curtain-cancel');
      el.dataset.active = 'false';
      busyRef.current = false;
    }, 360);
  }, [baselineX, setCurtain, setFaceParallax]);

  /** Hard cut — two-frame flash, no curtain. */
  const cut = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setCutting(true);
    navigate(worldHome(target));
    window.setTimeout(() => {
      setCutting(false);
      busyRef.current = false;
    }, 260);
  }, [navigate, target]);

  // X anywhere = cut between worlds (unless typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'x' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      cut();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cut]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (busyRef.current || dragRef.current) return;
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, progress: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const el = curtainRef.current;
    if (el) {
      el.dataset.active = 'true';
      el.classList.remove('curtain-commit', 'curtain-cancel');
      setCurtain(baselineX);
      setFaceParallax(0);
    }
    setDragging(true);
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = side === 'right' ? drag.startX - e.clientX : e.clientX - drag.startX;
    const progress = Math.min(1, Math.max(0, (dx / window.innerWidth) * DRAG_GAIN));
    drag.progress = progress;
    setCurtain(baselineX * (1 - progress));
    setFaceParallax(progress);
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    document.body.style.userSelect = '';
    // A tap on the spine (no real pull) reads as "take me across".
    if (drag.progress > COMMIT_THRESHOLD || drag.progress < 0.02) {
      commit();
    } else {
      cancel();
    }
  };

  // Escape bails out of an active drag.
  useEffect(() => {
    if (!dragging) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dragRef.current = null;
        setDragging(false);
        document.body.style.userSelect = '';
        cancel();
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [dragging, cancel]);

  const label = target === 'page' ? 'the page — pull or press X' : 'the screen — pull or press X';

  return (
    <>
      {/* Curtain: the other world, waiting in the wings */}
      <div
        ref={curtainRef}
        className="world-curtain"
        data-target={target}
        data-active="false"
        style={{ transform: `translateX(${baselineX}%)` }}
        aria-hidden="true"
      >
        <div className="curtain-inner">
          <div ref={faceRef} className="h-full w-full will-change-transform">
            <CurtainFace target={target} />
          </div>
        </div>
      </div>

      {/* Hard-cut flash */}
      <div className="cut-flash" data-cutting={cutting ? 'true' : 'false'} aria-hidden="true" />

      {/* Desktop seam */}
      {finePointer && (
        <button
          type="button"
          className={`gate-handle ${hinting ? 'gate-hint' : ''}`}
          data-side={side}
          data-dragging={dragging ? 'true' : 'false'}
          aria-label={`Cross over to ${target === 'page' ? 'the writer side' : 'the film side'} — drag the seam, click it, or press X`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className="gate-spine" aria-hidden="true" />
          <span className="gate-label" aria-hidden="true">
            {label}
          </span>
        </button>
      )}

      {/* Touch flip coin */}
      {!finePointer && (
        <button
          type="button"
          className="flip-fab"
          aria-label={`Flip to ${target === 'page' ? 'the writer side' : 'the film side'}`}
          onClick={cut}
        >
          <span className="flip-glyphs" aria-hidden="true">
            <span className="g-screen">L</span>
            <span className="g-page">l</span>
          </span>
        </button>
      )}
    </>
  );
};
