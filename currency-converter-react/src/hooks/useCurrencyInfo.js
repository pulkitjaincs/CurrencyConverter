import { useEffect, useState } from "react";

const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currency) return;

        setLoading(true);
        setError(null);
        fetch(`${BASE_URL}/${currency}.json`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch rates");
                return res.json();
            })
            .then((res) => setData(res[currency]))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [currency]);

    return { data, loading, error };
}

export default useCurrencyInfo;
