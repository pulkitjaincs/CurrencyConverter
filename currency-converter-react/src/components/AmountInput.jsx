import React from 'react';

export function AmountInput({ value, onChange, label }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                    placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">
                    Amount
                </span>
            </div>
        </div>
    );
}
