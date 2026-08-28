import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PortfolioData } from '@/types/portfolio';

export function usePortfolio() {
  return useQuery<PortfolioData>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get('/portfolio');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
