import React from 'react';

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1800 512"
            className={className}
        >
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="15" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <g transform="translate(60, 0)">
                <g filter="url(#logoGlow)">
                    <path d="M 140 160 L 372 160 L 140 352 L 372 352" fill="none" stroke="url(#logoGrad)" strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="372" cy="160" r="28" fill="#38BDF8" />
                </g>
                <text
                    x="440"
                    y="260"
                    fontFamily="Inter, sans-serif"
                    fontWeight="800"
                    fontSize="260px"
                    fill="currentColor"
                    letterSpacing="-8px"
                    dominantBaseline="central"
                >
                    Zertainity<tspan fill="#06B6D4">.</tspan>
                </text>
            </g>
        </svg>
    );
}
