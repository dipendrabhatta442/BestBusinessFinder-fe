import { useState, useEffect } from 'react';
import API from '../utils/api';

const useFetch = (url: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(url);
                setData(response.data.data);

            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);
    const refetch = async (newUrl?: string) => {
        try {
            const response = await API.get(newUrl ?? url);
            setData(response.data.data);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    }
    return { data, loading, error, refetch };
};

export default useFetch;
