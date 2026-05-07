import api from './api';

export async function enviarCertificado(dados, arquivo) {
  const formData = new FormData();
  formData.append('tituloAtividade',       dados.tituloAtividade);
  formData.append('cargaHorariaInformada', String(dados.cargaHorariaInformada));
  formData.append('dataAtividade',         new Date(dados.dataAtividade).toISOString()); // ← fix
  formData.append('areaId',               String(dados.areaId));
  formData.append('arquivo',              arquivo);

  const { data } = await api.post('/api/certificados/enviar', formData); // ← sem headers
  return data;
}

export async function listarMeusCertificados() {
  const { data } = await api.get('/api/certificados/meus');
  return data; // retorna { certificados: [...], resumo: {...} }
}

export async function listarAreas() {
  const { data } = await api.get('/api/certificados/areas');
  return data;
}

export async function listarPendentes() {
  const { data } = await api.get('/api/certificados/pendentes');
  return data;
}

export async function validarCertificado(id, status, horasValidadas) {
  const { data } = await api.patch(`/api/certificados/${id}/validar`, {
    status,
    horasValidadas: status === 'APROVADO' ? Number(horasValidadas) : 0,
  });
  return data;
}

export const aprovarCertificado = (id, horas) => validarCertificado(id, 'APROVADO', horas);
export const recusarCertificado = (id)        => validarCertificado(id, 'RECUSADO', 0);