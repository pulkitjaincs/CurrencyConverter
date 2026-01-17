import React, { useState, useRef, useEffect } from 'react';
import { countryList, currencyList } from '../constants/currencies';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CurrencySelect({ value, onChange, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    // Helper to determine icon URL
    const getIconUrl = (currencyCode) => {
        const countryCode = countryList[currencyCode];
        if (countryCode) {
            return `https://flagsapi.com/${countryCode}/flat/64.png`;
        }
        // Fallback for crypto (using atomiclabs icons via jsdelivr)
        // Common crypto codes: BTC, ETH, LTC, XRP, etc.
        return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c27136/128/color/${currencyCode.toLowerCase()}.png`;
    };

    const [imgSrc, setImgSrc] = useState(getIconUrl(value));

    useEffect(() => {
        setImgSrc(getIconUrl(value));
    }, [value]);

    // Fallback to a generic symbol if image fails
    const handleError = () => {
        // If it was a flag that failed, maybe try crypto? (Already structured priority above).
        // If both fail, set to a generic placeholder (transparent or local asset)
        // Here we can just hide it or set a dummy.
        // For now, let's set it to null and render a Lucide icon instead.
        setImgSrc(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCurrencies = Object.keys(currencyList).filter((code) =>
        code.toLowerCase().includes(search.toLowerCase()) ||
        currencyList[code].toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt={value}
                            className="w-6 h-6 object-cover rounded-full"
                            onError={handleError}
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                            {value.substring(0, 2)}
                        </div>
                    )}
                    <span className="font-semibold text-lg">{value}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-80 flex flex-col"
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-white/10 sticky top-0 bg-[#0f172a]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search currency..."
                                    className="w-full bg-white/5 border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {filteredCurrencies.map((code) => {
                                const listImgSrc = getIconUrl(code);
                                return (
                                    <button
                                        key={code}
                                        onClick={() => {
                                            onChange(code);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left ${value === code ? 'bg-blue-500/20' : ''}`}
                                    >
                                        <img
                                            src={listImgSrc}
                                            className="w-5 h-5 object-cover rounded-full shadow-sm bg-white/10"
                                            alt={code}
                                            onError={(e) => {
                                                e.target.style.opacity = 0.5;
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 8v8'/%3E%3Cpath d='M8 12h8'/%3E%3C/svg%3E";
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{code}</span>
                                            <span className="text-xs text-gray-400 truncate w-48">{currencyList[code]}</span>
                                        </div>
                                    </button>
                                )
                            })}
                            {filteredCurrencies.length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">No currency found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
