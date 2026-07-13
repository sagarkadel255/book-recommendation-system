import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useDataReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealElements = el.querySelectorAll('[data-reveal]');
    
    if (revealElements.length === 0) return;

    gsap.set(revealElements, { 
      y: 24, 
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(revealElements, {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.52,
      ease: 'power4.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return ref;
}

export function useScrollRevealFade<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { y: 24, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.52,
      ease: 'power4.out',
    });

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return ref;
}add frontend: data reveal animations hook
