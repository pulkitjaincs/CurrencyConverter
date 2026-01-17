import { useState, useEffect } from 'react';

export function useHistoricalRates(base, target, currentRate) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!base || !target) return;

        // Frankfurter API supports these currencies (plus EUR as base implicit if not specified)
        // We should check if the currency is supported, but the API will just return error or 404 if not.
        // However, since we want to be safe, we can try to fetch and fallback if it fails.

        // Note: Frankfurter only supports converting FROM these, and TO these.
        // If we are using crypto or exotic currencies not supported by Frankfurter, this will fail.

        const fetchHistoricalData = async () => {
            const endDate = new Date().toISOString().split('T')[0];
            const startDateObj = new Date();
            startDateObj.setDate(startDateObj.getDate() - 30);
            const startDate = startDateObj.toISOString().split('T')[0];

            try {
                const response = await fetch(
                    `https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${target}`
                );

                if (!response.ok) {
                    throw new Error("Not supported or failed");
                }

                const result = await response.json();

                if (result.rates) {
                    const formattedData = Object.entries(result.rates).map(([date, rates]) => ({
                        date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                        rate: rates[target]
                    }));
                    setData(formattedData);
                }
            } catch (error) {
                console.warn("Historical data not available for this pair, falling back to simulation or empty");
                // Fallback: If currentRate is available, return a flat line or single point?
                // Or if the user really wants A graph, we can mock it again if real data fails.
                // But the user complained about "correct" rates.
                // So better to return empty and show "Chart not available" than show fake data.
                setData([]);
            }
        };

        fetchHistoricalData();
    }, [base, target]);

    return data;
}
