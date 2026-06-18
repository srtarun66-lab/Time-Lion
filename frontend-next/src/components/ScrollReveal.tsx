'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0, style }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    }, { 
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={domRef}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

