'use client';
import React, { useRef, useEffect } from 'react';

export function InteractiveGlow() {
    const parentRef = useRef<HTMLElement | null>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (glowRef.current) {
            parentRef.current = glowRef.current.parentElement;
        }
        const parent = parentRef.current;
        if (!parent) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            parent.style.setProperty('--mouse-x', `${x}px`);
            parent.style.setProperty('--mouse-y', `${y}px`);
            parent.style.setProperty('--glow-opacity', '1');
        };
        
        const handleMouseLeave = () => {
            parent.style.setProperty('--glow-opacity', '0');
        };

        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <div ref={glowRef} className="interactive-glow-element" />;
}
