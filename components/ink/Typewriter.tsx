import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView';

interface TypewriterProps {
  text: string;
  className?: string;
  /** ms per character (jittered ±40% so it sounds human) */
  speed?: number;
  startDelay?: number;
  showCaret?: boolean;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Types itself out when scrolled into view. Special Elite voice. */
export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  className = '',
  speed = 46,
  startDelay = 0,
  showCaret = true,
}) => {
  const { ref, isInView } = useInView({ threshold: 0.4 });
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    if (prefersReducedMotion()) {
      setCount(text.length);
      return;
    }

    let cancelled = false;
    let timeout: number;

    const typeNext = (i: number) => {
      if (cancelled) return;
      setCount(i);
      if (i >= text.length) return;
      const jitter = speed * (0.6 + Math.random() * 0.8);
      // breathe at sentence marks, like a hand pausing
      const ch = text[i - 1];
      const pause = ch === '.' || ch === '—' ? 260 : ch === ',' ? 130 : 0;
      timeout = window.setTimeout(() => typeNext(i + 1), jitter + pause);
    };

    timeout = window.setTimeout(() => typeNext(1), startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [isInView, text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={`tw-voice ${showCaret && !done ? 'tw-caret' : ''} ${className}`}>
      {text.slice(0, count)}
      {/* reserve the full width so nothing reflows while typing */}
      <span aria-hidden="true" className="invisible">{text.slice(count)}</span>
    </span>
  );
};
