import React, { useEffect, useRef, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'mount' | 'inView';
  scrambleChars?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  trigger = 'hover',
  scrambleChars = DEFAULT_CHARS,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number>();
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

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
        setIsScrambling(false);
      } else {
        frame++;
        frameRef.current = requestAnimationFrame(update);
      }
    };

    update();
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    }
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
