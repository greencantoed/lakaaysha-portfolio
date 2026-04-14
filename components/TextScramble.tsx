import React, { useEffect, useRef, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'mount' | 'inView';
  scrambleChars?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  trigger = 'hover',
  scrambleChars = DEFAULT_CHARS,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const frameRef = useRef<number>();
  const queueRef = useRef<
    { from: string; to: string; start: number; end: number; char?: string }[]
  >([]);

  // Keep displayText in sync if `text` prop ever changes while unmounting would
  // have left stale glyphs. Also handles re-mounts during page transitions.
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const scramble = () => {
    if (isScramblingRef.current) return;

    // Reduced-motion: skip scramble entirely, snap to final text.
    if (prefersReducedMotion()) {
      setDisplayText(text);
      return;
    }

    isScramblingRef.current = true;

    const length = text.length;
    queueRef.current = [];

    for (let i = 0; i < length; i++) {
      queueRef.current.push({
        from: displayText[i] || '',
        to: text[i],
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 20,
      });
    }

    let frame = 0;
    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start, end } = queueRef.current[i];
        let char = queueRef.current[i].char;

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            queueRef.current[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queueRef.current.length) {
        isScramblingRef.current = false;
      } else {
        frame++;
        frameRef.current = requestAnimationFrame(update);
      }
    };

    update();
  };

  // Unmount cleanup: cancel any in-flight scramble AND force final text so
  // that a subsequent remount never renders mid-scramble residue (e.g. on
  // page transitions navigating back to /).
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      isScramblingRef.current = false;
      queueRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      scramble();
    }
  };

  return (
    <span
      className={`scramble-text ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
};
