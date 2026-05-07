export async function validarCertificado(idCertificado, { status, observacao, horasValidadas }) {
  return { id: idCertificado, status, observacao, horasValidadas };
}

export const aprovarCertificado = (id, horasValidadas, observacao = '') =>
  validarCertificado(id, { status: 'APROVADO', horasValidadas, observacao });

export const reprovarCertificado = (id, observacao) =>
  validarCertificado(id, { status: 'RECUSADO', observacao, horasValidadas: 0 });
