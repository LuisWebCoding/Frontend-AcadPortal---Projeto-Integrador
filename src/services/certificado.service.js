import api from './api';

export async function enviarCertificado(dados, arquivo) {
  const formData = new FormData();
  formData.append('tituloAtividade',       dados.tituloAtividade);
  formData.append('cargaHorariaInformada', String(dados.cargaHorariaInformada));
  formData.append('dataAtividade',         dados.dataAtividade);
  formData.append('areaId',                String(dados.areaId)); 
  formData.append('subcategoriaId',        String(dados.subcategoriaId));
  formData.append('cursoId',               String(dados.cursoId));
  formData.append('arquivo',               arquivo);

  const { data } = await api.post('/api/certificados/enviar', formData);
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

export async function listarFilaValidacao() {
  const { data } = await api.get('/api/validacao/validar');
  return data; // retorna { cards: { pendentes, aprovados, recusados }, lista: [...] }
}

export async function validarCertificado(idValidacao, status, horasValidadas, observacao) {
  const { data } = await api.patch(`/api/validacao/validar/${idValidacao}`, {
    status,
    horasValidadas: status === 'APROVADO' ? Number(horasValidadas || 0) : 0,
    observacao: observacao || null,
  });
  return data;
}

export const aprovarCertificado = (id, horas) => validarCertificado(id, 'APROVADO', horas);
export const recusarCertificado = (id)        => validarCertificado(id, 'RECUSADO', 0);