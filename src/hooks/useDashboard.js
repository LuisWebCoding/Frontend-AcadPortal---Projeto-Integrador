import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function useAlunoDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'aluno'],
    queryFn: async () => {
      const { data } = await api.get('/api/certificados/meus');
      console.log("DEBUG: Dashboard Data (Resumo):", data.resumo);
      return data.resumo || data;
    }
  });
}

export function useCoordenadorDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'coordenador'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard/coordenador');
      return data;
    }
  });
}
