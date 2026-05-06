// ─── USUÁRIOS ───────────────────────────────────────────────
export const MOCK_USUARIOS = [
  { email: 'ana.rodrigues@aluno.edu.br',     senha: '123456', perfil: 'ALUNO',       nome: 'Ana Clara Rodrigues',   id: 6  },
  { email: 'bruno.costa@aluno.edu.br',       senha: '123456', perfil: 'ALUNO',       nome: 'Bruno Henrique Costa',  id: 7  },
  { email: 'fernanda.lima@faculdade.edu.br', senha: '123456', perfil: 'COORDENADOR', nome: 'Fernanda Lima Souza',   id: 2  },
  { email: 'roberto.alves@faculdade.edu.br', senha: '123456', perfil: 'COORDENADOR', nome: 'Roberto Alves Pereira', id: 3  },
];

// ─── ÁREAS DE ATIVIDADE ──────────────────────────────────────
export const mockAreas = [
  { id: 1,  nome: 'Ensino',                             limiteHoras: 80 },
  { id: 2,  nome: 'Pesquisa e Inovacao',                limiteHoras: 80 },
  { id: 3,  nome: 'Extensao e Cultura',                 limiteHoras: 60 },
  { id: 4,  nome: 'Gestao e Representacao Estudantil',  limiteHoras: 40 },
  { id: 5,  nome: 'Empreendedorismo',                   limiteHoras: 60 },
  { id: 6,  nome: 'Publicacoes e Producoes',            limiteHoras: 40 },
  { id: 7,  nome: 'Cursos e Capacitacoes',              limiteHoras: 80 },
  { id: 8,  nome: 'Eventos Tecnicos e Cientificos',     limiteHoras: 60 },
  { id: 9,  nome: 'Voluntariado',                       limiteHoras: 40 },
  { id: 10, nome: 'Estagio Nao Obrigatorio',            limiteHoras: 80 },
];

// ─── CURSOS ──────────────────────────────────────────────────
export const mockCursos = [
  { id: 1,  nome: 'Analise e Desenvolvimento de Sistemas', cargaTotalExigida: 200 },
  { id: 2,  nome: 'Engenharia de Software',                cargaTotalExigida: 240 },
  { id: 3,  nome: 'Sistemas de Informacao',                cargaTotalExigida: 200 },
  { id: 4,  nome: 'Ciencia da Computacao',                 cargaTotalExigida: 240 },
  { id: 5,  nome: 'Redes de Computadores',                 cargaTotalExigida: 160 },
  { id: 6,  nome: 'Banco de Dados',                        cargaTotalExigida: 160 },
  { id: 7,  nome: 'Desenvolvimento Web',                   cargaTotalExigida: 180 },
  { id: 8,  nome: 'Inteligencia Artificial',               cargaTotalExigida: 200 },
  { id: 9,  nome: 'Seguranca da Informacao',               cargaTotalExigida: 180 },
  { id: 10, nome: 'Gestao de TI',                          cargaTotalExigida: 160 },
];

// ─── REGRAS ──────────────────────────────────────────────────
export const mockRegras = [
  { id: 1,  descricao: 'Monitoria em disciplinas do curso', limiteHoras: 40, tipoAtividade: 'Monitoria',             idArea: 1,  nomeArea: 'Ensino'                            },
  { id: 2,  descricao: 'Iniciacao cientifica com orientador', limiteHoras: 60, tipoAtividade: 'Iniciacao Cientifica', idArea: 2,  nomeArea: 'Pesquisa e Inovacao'               },
  { id: 3,  descricao: 'Projetos de extensao aprovados',    limiteHoras: 40, tipoAtividade: 'Extensao',              idArea: 3,  nomeArea: 'Extensao e Cultura'               },
  { id: 4,  descricao: 'Representacao em orgaos colegiados', limiteHoras: 20, tipoAtividade: 'Representacao',        idArea: 4,  nomeArea: 'Gestao e Representacao Estudantil' },
  { id: 5,  descricao: 'Empresa junior vinculada',          limiteHoras: 40, tipoAtividade: 'Empresa Junior',        idArea: 5,  nomeArea: 'Empreendedorismo'                  },
  { id: 6,  descricao: 'Artigos em periódicos ou anais',    limiteHoras: 30, tipoAtividade: 'Publicacao',            idArea: 6,  nomeArea: 'Publicacoes e Producoes'           },
  { id: 7,  descricao: 'Cursos de extensao e certificacoes', limiteHoras: 60, tipoAtividade: 'Curso Externo',        idArea: 7,  nomeArea: 'Cursos e Capacitacoes'             },
  { id: 8,  descricao: 'Congressos e seminarios da area',   limiteHoras: 40, tipoAtividade: 'Evento Cientifico',     idArea: 8,  nomeArea: 'Eventos Tecnicos e Cientificos'   },
  { id: 9,  descricao: 'Trabalho voluntario em projetos',   limiteHoras: 20, tipoAtividade: 'Voluntariado',          idArea: 9,  nomeArea: 'Voluntariado'                      },
  { id: 10, descricao: 'Estagio nao obrigatorio na area',   limiteHoras: 60, tipoAtividade: 'Estagio',               idArea: 10, nomeArea: 'Estagio Nao Obrigatorio'           },
];

// ─── CERTIFICADOS DO ALUNO (Ana Clara - id 6) ────────────────
export const mockCertificados = [
  { id: 41, tituloAtividade: 'Monitoria de Calculo I',              cargaHorariaInformada: 40, dataEnvio: '2024-03-15', nomeAluno: 'Ana Clara Rodrigues', statusValidacao: 'APROVADO',  nomeArea: 'Ensino',                observacao: 'Documento valido. Horas computadas conforme regra.' },
  { id: 42, tituloAtividade: 'Iniciacao Cientifica em Redes Neurais', cargaHorariaInformada: 60, dataEnvio: '2024-04-02', nomeAluno: 'Ana Clara Rodrigues', statusValidacao: 'APROVADO',  nomeArea: 'Pesquisa e Inovacao',   observacao: 'IC devidamente comprovada pelo orientador.'         },
  { id: 71, tituloAtividade: 'Workshop de Inteligencia Artificial',  cargaHorariaInformada: 40, dataEnvio: '2024-10-01', nomeAluno: 'Ana Clara Rodrigues', statusValidacao: null,         nomeArea: 'Pesquisa e Inovacao',   observacao: null                                                  },
  { id: 72, tituloAtividade: 'Hackathon Educacao + Tecnologia 2024', cargaHorariaInformada: 30, dataEnvio: '2024-10-10', nomeAluno: 'Ana Clara Rodrigues', statusValidacao: null,         nomeArea: 'Empreendedorismo',      observacao: null                                                  },
];

// ─── TODOS OS CERTIFICADOS (Coordenador) ─────────────────────
export const mockTodosCertificados = [
  { id: 71, tituloAtividade: 'Workshop de Inteligencia Artificial',  cargaHorariaInformada: 40, dataEnvio: '2024-10-01', nomeAluno: 'Ana Clara Rodrigues',   statusValidacao: null,        nomeArea: 'Pesquisa e Inovacao',          observacao: null },
  { id: 72, tituloAtividade: 'Hackathon Educacao + Tecnologia 2024', cargaHorariaInformada: 30, dataEnvio: '2024-10-10', nomeAluno: 'Eduarda Gomes Teixeira', statusValidacao: null,        nomeArea: 'Empreendedorismo',              observacao: null },
  { id: 73, tituloAtividade: 'Extensao: Inclusao Digital para Idosos', cargaHorariaInformada: 30, dataEnvio: '2024-09-20', nomeAluno: 'Bruno Henrique Costa', statusValidacao: null,        nomeArea: 'Extensao e Cultura',            observacao: null },
  { id: 74, tituloAtividade: 'Kubernetes Administrator - CKA',       cargaHorariaInformada: 20, dataEnvio: '2024-10-05', nomeAluno: 'Diego Martins Barbosa', statusValidacao: null,        nomeArea: 'Cursos e Capacitacoes',         observacao: null },
  { id: 41, tituloAtividade: 'Monitoria de Calculo I',               cargaHorariaInformada: 40, dataEnvio: '2024-03-15', nomeAluno: 'Ana Clara Rodrigues',   statusValidacao: 'APROVADO',  nomeArea: 'Ensino',                        observacao: 'Documento valido.' },
  { id: 42, tituloAtividade: 'Iniciacao Cientifica em Redes Neurais', cargaHorariaInformada: 60, dataEnvio: '2024-04-02', nomeAluno: 'Bruno Henrique Costa',  statusValidacao: 'APROVADO',  nomeArea: 'Pesquisa e Inovacao',           observacao: 'IC comprovada.' },
  { id: 70, tituloAtividade: 'Congresso UX Brasil 2024',             cargaHorariaInformada: 8,  dataEnvio: '2024-09-10', nomeAluno: 'Elisa Braga Magalhaes', statusValidacao: 'REPROVADO', nomeArea: 'Eventos Tecnicos e Cientificos', observacao: 'Documento ilegivel. Solicite reenvio.' },
];

// ─── USUARIOS (Admin) ────────────────────────────────────────
export const mockUsuarios = [
  { id: 6,  nome: 'Ana Clara Rodrigues',      email: 'ana.rodrigues@aluno.edu.br',     perfil: 'ALUNO',       matricula: '2022001001', periodo: 5, departamento: null },
  { id: 7,  nome: 'Bruno Henrique Costa',     email: 'bruno.costa@aluno.edu.br',       perfil: 'ALUNO',       matricula: '2022001002', periodo: 4, departamento: null },
  { id: 8,  nome: 'Camila Ferreira Nunes',    email: 'camila.nunes@aluno.edu.br',      perfil: 'ALUNO',       matricula: '2022001003', periodo: 6, departamento: null },
  { id: 2,  nome: 'Fernanda Lima Souza',      email: 'fernanda.lima@faculdade.edu.br', perfil: 'COORDENADOR', matricula: null,          periodo: null, departamento: 'Departamento de TI'   },
  { id: 3,  nome: 'Roberto Alves Pereira',    email: 'roberto.alves@faculdade.edu.br', perfil: 'COORDENADOR', matricula: null,          periodo: null, departamento: 'Departamento de Eng.' },
];

// ─── DASHBOARD (Coordenador) ─────────────────────────────────
export const mockDashboard = {
  totalAlunos: 45,
  pendentes: 4,
  aprovados: 28,
  reprovados: 3,
  horasTotaisValidadas: 1240,
  distribuicaoPorArea: [
    { area: 'Ensino',                    horas: 320 },
    { area: 'Pesquisa e Inovacao',       horas: 280 },
    { area: 'Cursos e Capacitacoes',     horas: 240 },
    { area: 'Estagio Nao Obrigatorio',   horas: 200 },
    { area: 'Extensao e Cultura',        horas: 120 },
    { area: 'Empreendedorismo',          horas: 80  },
  ],
};
