/**
 * useTestCompletion - Fetch and cache test completion status
 */
import { useState, useEffect, useCallback } from 'react';
import { testService } from '../services/testService';

export function useTestCompletion(candidateId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompletion = useCallback(async () => {
    if (!candidateId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await testService.checkTestCompletion(candidateId);
      const result = response?.data ?? response;
      setData(result);
      return result;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to check completion');
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCompletion();
  }, [fetchCompletion]);

  const completionData = data?.data ?? data;
  return {
    completed: completionData?.completed ?? false,
    canTakeTest: completionData?.canTakeTest ?? true,
    cooldownStatus: completionData?.cooldownStatus,
    loading,
    error,
    data: completionData,
    refetch: fetchCompletion,
  };
}
