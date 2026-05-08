// validacao.service.js
// Re-exporta as funções reais do certificado.service para manter compatibilidade
// com qualquer import antigo de "@/services/validacao.service".
export {
  validarCertificado,
  aprovarCertificado,
  recusarCertificado,
} from "@/services/certificado.service";
