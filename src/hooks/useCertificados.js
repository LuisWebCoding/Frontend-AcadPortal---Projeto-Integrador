import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listarMeusCertificados, 
  enviarCertificado, 
  listarAreas, 
  listarFilaValidacao, 
  validarCertificado 
} from '@/services/certificado.service';
import toast from 'react-hot-toast';

// --- ALUNO ---

export function useMeusCertificados() {
  return useQuery({
    queryKey: ['certificados', 'meus'],
    queryFn: listarMeusCertificados,
  });
}

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: listarAreas,
    staleTime: 1000 * 60 * 60, // 1 hora (áreas mudam pouco)
  });
}

export function useEnviarCertificado() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ dados, arquivo }) => enviarCertificado(dados, arquivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados', 'meus'] });
      toast.success('Certificado enviado com sucesso!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.erro ?? 'Erro ao enviar certificado.');
    }
  });
}

// --- COORDENADOR ---

export function useFilaValidacao() {
  return useQuery({
    queryKey: ['certificados', 'fila'],
    queryFn: listarFilaValidacao,
  });
}

export function useValidarCertificado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, horas, observacao }) => 
      validarCertificado(id, status, horas, observacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Validação processada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao processar validação.');
    }
  });
}
