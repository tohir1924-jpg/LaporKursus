import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/apiClient';

/**
 * Custom hook for GET API requests
 * @param {string} endpoint - API endpoint to fetch
 * @param {object} options - Fetch options or query parameters
 * @param {boolean} lazy - If true, do not fetch on mount
 */
export function useQuery(endpoint, options = {}, lazy = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!lazy);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint, options);
      setData(response);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(options)]);

  useEffect(() => {
    if (!lazy) {
      fetchData();
    }
  }, [fetchData, lazy]);

  return { data, loading, error, refetch: fetchData, setData };
}

/**
 * Custom hook for POST/PUT/DELETE API requests (mutations)
 * @param {function} mutationFn - API call function (e.g. (data) => api.post(url, data))
 */
export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (variables) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await mutationFn(variables);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'Gagal melakukan aksi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success, reset: () => { setError(null); setSuccess(false); } };
}
