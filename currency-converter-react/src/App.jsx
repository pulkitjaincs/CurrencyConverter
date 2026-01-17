import React, { useState, useEffect } from 'react';
import { Card } from './components/ui/Card';
import { AmountInput } from './components/AmountInput';
import { CurrencySelect } from './components/CurrencySelect';
import { HistoryChart } from './components/HistoryChart';
import { ComparisonSection } from './components/ComparisonSection';
import useCurrencyInfo from './hooks/useCurrencyInfo';
import { useHistoricalRates } from './hooks/useHistoricalRates';
import { ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const { data: currencyInfo, loading, error } = useCurrencyInfo(from.toLowerCase());
  const options = Object.keys(currencyInfo || {});

  // Real-time conversion
  const conversionRate = currencyInfo?.[to.toLowerCase()];

  useEffect(() => {
    if (conversionRate && amount) {
      setConvertedAmount(Number(amount) * conversionRate);
    }
  }, [amount, conversionRate, to]);

  const historicalData = useHistoricalRates(from, to, conversionRate);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setAmount(Number(convertedAmount).toFixed(2));
    // The useEffect will trigger and recalculate the new converted amount back to roughly original
  };

  return (
    <div className="w-full max-w-6xl px-4 m-auto">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Currency Converter
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Main Converter */}
        <div className="w-full max-w-md mx-auto lg:mx-0 shrink-0">
          <Card className="p-5">
            <div className="space-y-4">
              {/* Amount Input */}
              <AmountInput
                label="Enter Amount"
                value={amount}
                onChange={(val) => setAmount(val)}
              />

              {/* Currency Controls */}
              <div className="relative grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <CurrencySelect
                  label="From"
                  value={from}
                  onChange={(code) => setFrom(code)}
                />

                <div className="flex justify-center mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swap}
                    className="p-2.5 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 text-white z-10"
                  >
                    <ArrowLeftRight size={18} />
                  </motion.button>
                </div>

                <CurrencySelect
                  label="To"
                  value={to}
                  onChange={(code) => setTo(code)}
                />
              </div>

              {/* Result Display */}
              <div className="text-center mt-5 p-3 bg-white/5 rounded-xl border border-white/5">
                {loading ? (
                  <div className="animate-pulse h-8 w-32 bg-white/10 mx-auto rounded"></div>
                ) : error ? (
                  <div className="text-red-400">Error: {error}</div>
                ) : (
                  <>
                    <div className="text-sm text-gray-400 mb-0.5">
                      {amount} {from} =
                    </div>
                    <div className="text-2xl font-bold tracking-wider">
                      {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
                    </div>
                    <div className="text-[10px] text-blue-400 mt-1">
                      1 {from} = {conversionRate?.toFixed(4)} {to}
                    </div>
                  </>
                )}
              </div>

              {/* Chart */}
              {!loading && !error && (
                historicalData.length > 0 ? (
                  <HistoryChart data={historicalData} />
                ) : (
                  <div className="text-center text-gray-500 text-xs mt-4 p-2 border border-dashed border-white/10 rounded-lg">
                    Historical chart data not available for {from}/{to}
                  </div>
                )
              )}

            </div>
          </Card>

          <div className="text-center mt-4 text-gray-500 text-xs">
            <p>Market rates collected from fawazahmed0/currency-api</p>
          </div>
        </div>

        {/* Comparison Section (Right Side) */}
        <div className="w-full lg:max-w-md xl:max-w-lg">
          <ComparisonSection
            baseCurrency={from}
            amount={amount}
            rates={currencyInfo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
