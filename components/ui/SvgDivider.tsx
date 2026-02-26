import React from 'react';

// The pre-defined SVGs exactly as the user provided, just mapped to components
const dividers = {
    wavyRed: (
        <svg viewBox="0 0 800 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="
        M0 0 H800 V80
        Q700 160 600 80
        Q500 0 400 80
        Q300 160 200 80
        Q100 0 0 80
        Z"
                fill="var(--accent)" /> {/* Replaced #ff6b6b with our accent pink */}
        </svg>
    ),
    drippyPink: (
        <svg viewBox="0 0 800 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="
        M0 0 H800 V70
        C720 130 650 20 580 90
        C510 170 440 30 370 100
        C300 180 230 40 160 110
        C100 150 50 80 0 100
        Z"
                fill="var(--highlight)" /> {/* Replaced #ff6f91 with vivid yellow to add variety */}
        </svg>
    ),
    smoothBlue: (
        <svg viewBox="0 0 1000 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="
        M0 80
        C125 20 125 140 250 80
        C375 20 375 140 500 80
        C625 20 625 140 750 80
        C875 20 875 140 1000 80
        V160
        H0
        Z"
                fill="var(--primary)" /> {/* Replaced #5c7cfa with our dark green backdrop */}
        </svg>
    ),
    outlineWavy: (
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="
        M0 60
        C125 20 125 100 250 60
        C375 20 375 100 500 60
        C625 20 625 100 750 60
        C875 20 875 100 1000 60"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round" />
        </svg>
    ),
};

interface SvgDividerProps {
    type: keyof typeof dividers;
    className?: string; // Optional classes for height, rotation, flip, or spacing
}

export function SvgDivider({ type, className = "" }: SvgDividerProps) {
    return (
        <div className={`w-full overflow-hidden leading-none z-0 ${className}`}>
            {dividers[type]}
        </div>
    );
}
