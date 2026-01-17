import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { currencyList, countryList } from '../constants/currencies';
import { Plus, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ComparisonSection({ baseCurrency, amount, rates }) {
    // Default comparison list
    const [compareList, setCompareList] = useState(['EUR', 'GBP', 'JPY', 'CAD']);
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState("");

    // Filter available currencies to add (excluding already displayed ones and the base currency)
    const availableCurrencies = Object.keys(currencyList).filter(
        code => !compareList.includes(code) && code !== baseCurrency
    );

    const filteredAvailable = availableCurrencies.filter(code =>
        code.toLowerCase().includes(search.toLowerCase()) ||
        currencyList[code].toLowerCase().includes(search.toLowerCase())
    );

    // Helper to determine icon URL (duplicated from CurrencySelect, ideally should be a utility)
    const getIconUrl = (currencyCode) => {
        const countryCode = countryList[currencyCode];
        if (countryCode) {
            return `https://flagsapi.com/${countryCode}/flat/64.png`;
        }
        return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c27136/128/color/${currencyCode.toLowerCase()}.png`;
    };

    const addToCompare = (code) => {
        setCompareList([...compareList, code]);
        setIsAdding(false);
        setSearch("");
    };

    const removeFromCompare = (code) => {
        setCompareList(compareList.filter(c => c !== code));
    };

    return (
        <div className="w-full h-full flex flex-col justify-start">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-400" size={20} />
                    Compare Rates
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-sm bg-white/10 hover:bg-white/20 text-blue-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Plus size={14} /> Add Currency
                </button>
            </div>

            {/* Add Currency Dropdown */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <Card className="p-3 bg-[#0f172a] border-blue-500/30">
                            <input
                                type="text"
                                placeholder="Search currency to add..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mb-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <div className="max-h-40 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2">
                                {filteredAvailable.slice(0, 20).map(code => (
                                    <button
                                        key={code}
                                        onClick={() => addToCompare(code)}
                                        className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-left transition-colors"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                            <img src={getIconUrl(code)} alt={code} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                        <span className="text-sm text-gray-200">{code}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <AnimatePresence>
                    {compareList.map(targetCurrency => {
                        const rate = rates && rates[targetCurrency.toLowerCase()];
                        const convertedValue = rate ? (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '---';

                        return (
                            <motion.div
                                key={targetCurrency}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 relative group hover:border-blue-500/30 transition-all"
                            >
                                <button
                                    onClick={() => removeFromCompare(targetCurrency)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                                >
                                    <X size={14} />
                                </button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shadow-md">
                                        <img
                                            src={getIconUrl(targetCurrency)}
                                            alt={targetCurrency}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{targetCurrency}</div>
                                        <div className="text-[10px] text-gray-400">{currencyList[targetCurrency]}</div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="text-xl font-mono text-blue-300 font-semibold">
                                        {convertedValue}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        1 {baseCurrency} = {rate?.toFixed(4) || 'N/A'} {targetCurrency}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
