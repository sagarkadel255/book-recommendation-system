import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function KineticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outline = outlineRef.current;

    if (!outline) return;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const tick = () => {
      gsap.to(outline, {
        x: mouseX,
        y: mouseY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.2,
        ease: 'power2.out',
      });
      requestAnimationFrame(tick);
    };
    tick();

    const interactiveElements = document.querySelectorAll('button, a, input');

    const onEnter = () => {
      gsap.to(outline, {
        scale: 1.8,
        duration: 0.3,
        ease: 'power2.out',
      });
      outline.style.backgroundColor = 'rgba(212, 168, 83, 0.12)';
      outline.style.borderColor = '#D4A853';
    };

    const onLeave = () => {
      gsap.to(outline, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      outline.style.backgroundColor = 'transparent';
      outline.style.borderColor = '#1A2A3A';
    };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999]"
        style={{ backgroundColor: '#1A2A3A', transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={outlineRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          transform: 'translate(-50%, -50%)',
          border: '1.5px solid #1A2A3A',
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      />
    </>
  );
}

