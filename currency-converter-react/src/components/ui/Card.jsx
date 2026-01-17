import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className }) {
    return (
        <div
            className={twMerge(
                clsx(
                    "relative overflow-hidden",
                    "bg-white/10 backdrop-blur-xl", // Glass effect
                    "border border-white/20",
                    "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
                    "rounded-2xl p-6",
                    className
                )
            )}
        >
            <div className="relative z-10">{children}</div>
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
