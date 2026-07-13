import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  trigger?: string | Element;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  markers?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  selector: string,
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(selector);

    if (targets.length === 0) return;

    const {
      from = { y: 50, opacity: 0 },
      to = { y: 0, opacity: 1 },
      stagger = 0.1,
      duration = 0.8,
      ease = 'power4.out',
      start = 'top 85%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
    } = options;

    gsap.set(targets, from);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        toggleActions,
        invalidateOnRefresh: true,
      },
    });

    tl.to(targets, {
      ...to,
      stagger,
      duration,
      ease,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.refresh());
    };
  }, [selector, options]);

  return ref;
}

export function useSplitLines<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lines: HTMLSpanElement[] = [];
    const words = el.textContent?.split(' ') || [];

    el.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      lines.push(span);
      el.appendChild(span);
    });

    gsap.set(lines, { y: '100%', opacity: 0, display: 'inline-block' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(lines, {
      y: 0,
      opacity: 1,
      stagger: 0.03,
      duration: 0.6,
      ease: 'power4.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return ref;
}

export function useSectionReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      from = { y: 60, opacity: 0 },
      to = { y: 0, opacity: 1 },
      duration = 0.8,
      ease = 'power4.out',
      start = 'top 85%',
      end = 'bottom 20%',
      toggleActions = 'play none none reverse',
    } = options;

    gsap.set(el, from);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        toggleActions,
      },
    });

    tl.to(el, { ...to, duration, ease });

    return () => {
      tl.kill();
    };
  }, [options]);

  return ref;
}

export function useParallax<T extends HTMLElement>(speed: number = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => (el.offsetHeight * speed),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [speed]);

  return ref;
}
