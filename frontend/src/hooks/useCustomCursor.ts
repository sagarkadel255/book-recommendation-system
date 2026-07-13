import { useEffect, useRef } from 'react';

interface CursorConfig {
  labels?: Record<string, string>;
}

export default function useCustomCursor(config: CursorConfig = {}) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const currentX = useRef(-100);
  const currentY = useRef(-100);
  const rafId = useRef<number>(0);

  const { labels = {} } = config;

  useEffect(() => {
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(cursor);

    cursorRef.current = cursor;
    labelRef.current = cursor.querySelector('.cursor-label') as HTMLSpanElement;

    const label = cursor.querySelector('.cursor-label') as HTMLSpanElement;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const animate = () => {
      currentX.current += (mouseX.current - currentX.current) * 0.15;
      currentY.current += (mouseY.current - currentY.current) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${currentX.current}px`;
        cursorRef.current.style.top = `${currentY.current}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor]');
      if (interactive) {
        cursor.classList.add('hovering');
        const cursorLabel = interactive.getAttribute('data-cursor');
        if (cursorLabel && label) {
          label.textContent = cursorLabel;
        } else {
          
          const tag = interactive.tagName.toLowerCase();
          if (tag === 'a') {
            label.textContent = 'EXPLORE';
          } else if (tag === 'button') {
            label.textContent = 'CLICK';
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor]');
      if (interactive) {
        cursor.classList.remove('hovering');
        if (label) label.textContent = '';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    document.body.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cursor.remove();
    };
  }, [labels]);

  return null;
}
