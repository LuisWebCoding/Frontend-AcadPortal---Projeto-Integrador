import { mockCertificados, mockTodosCertificados } from './mock';

export async function enviarCertificado(idAluno, dados, arquivo) {
  return { id: Date.now(), ...dados, statusValidacao: null, dataEnvio: new Date().toISOString().split('T')[0] };
}

export async function listarCertificadosDoAluno(idAluno) {
  return mockCertificados;
}

export async function listarTodosCertificados() {
  return mockTodosCertificados;
}
