<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
<img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />

# AcadPortal — Frontend

**Interface PWA para o Sistema de Gestão de Horas Complementares do SENAC.**  
Projeto Integrador · 3° Período · Análise e Desenvolvimento de Sistemas

</div>

---

## Sobre o Projeto

O **AcadPortal** é o frontend do sistema SGH (Sistema de Gestão de Horas Complementares). A interface é uma **Progressive Web App (PWA)** que funciona como um aplicativo nativo em qualquer dispositivo — desktop ou mobile — com suporte a instalação e funcionamento offline parcial via Service Worker.

A aplicação possui dois perfis de acesso com fluxos completamente distintos:

- **Aluno** — envia certificados, acompanha o status de validação e visualiza seu progresso em horas
- **Coordenador** — recebe a fila de pendentes, visualiza os documentos e aprova ou reprova cada submissão

> 💡 O backend deste projeto está em: [backend-sistema-horas-complementares](https://github.com/ruthcamile/backend-sistema-horas-complementares)

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19 | Biblioteca principal de UI |
| Vite | 8 | Bundler e dev server |
| Tailwind CSS | 4 | Estilização utilitária |
| React Router | 7 | Roteamento client-side com layouts aninhados |
| Framer Motion | 12 | Animações de entrada, saída e transição |
| Axios | 1.15 | Cliente HTTP com interceptors JWT |
| React Hot Toast | 2.6 | Notificações de sucesso e erro |
| Lucide React | 1.14 | Ícones consistentes e leves |
| vite-plugin-pwa | 1.3 | Geração de Service Worker e Web Manifest |
| jwt-decode | 4 | Decodificação do token JWT no cliente |

---

## Funcionalidades

### Perfil Aluno
- Login com redirecionamento automático por perfil
- Dashboard com progresso circular animado, horas concluídas/faltantes e distribuição por área
- Envio de certificados com upload de PDF ou imagem (até 10MB)
- Acompanhamento do status de cada certificado (Pendente, Aprovado, Recusado)
- Visualização da observação do coordenador ao clicar em uma atividade recente

### Perfil Coordenador
- Dashboard com métricas gerais do curso — total de alunos, aprovados, recusados, horas validadas e taxa de aprovação
- Fila de certificados pendentes com botões de Aprovar, Reprovar e baixar o arquivo
- Modal de validação com campo de horas e observação
- Busca de aluno por matrícula com histórico completo de certificados

---

## Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

### 1. Clone o repositório
```bash
git clone https://github.com/LuisWebCoding/Frontend-AcadPortal---Projeto-Integrador
cd Frontend-AcadPortal---Projeto-Integrador
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_BASE_URL=https://backend-sistema-horas-complementares.onrender.com
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 5. Build de produção
```bash
npm run build
npm run preview
```

---

## Estrutura de Pastas

```
src/
├── assets/              # Imagens e logos
├── components/
│   ├── layout/          # Header, Sidebar, PageLayout
│   └── ui/              # Componentes reutilizáveis (Button, Card, etc.)
├── contexts/            # AuthContext — estado global de autenticação
├── hooks/               # useAuth, useCertificados, useValidacoes
├── pages/
│   ├── auth/            # LoginPage
│   ├── aluno/           # AlunoDashboardPage, HorasComplementaresPage, AlunoLayout
│   └── coordenador/     # DashboardMetricasPage, ValidarCertificadosPage, CoordernadorLayout
├── routes/              # index.jsx, PrivateRoute, RoleRoute
├── services/            # api.js, auth.service.js, certificado.service.js
└── styles/              # global.css, tokens.css, reset.css
```

---

## Rotas da Aplicação

| Rota | Componente | Acesso |
|---|---|---|
| `/login` | LoginPage | Pública |
| `/aluno/dashboard` | AlunoDashboardPage | Privada — ALUNO |
| `/aluno/horas` | HorasComplementaresPage | Privada — ALUNO |
| `/coordenador/dashboard` | DashboardMetricasPage | Privada — COORDENADOR |
| `/coordenador/validar` | ValidarCertificadosPage | Privada — COORDENADOR |

---

## PWA

A aplicação está configurada como Progressive Web App com:

- **Web App Manifest** — nome, ícones, tema e modo `standalone`
- **Service Worker** — gerado via Workbox com pré-cache de todos os assets estáticos
- **Instalável** — pode ser adicionada à tela inicial em dispositivos mobile e desktop
- **Menu hambúrguer** — sidebar oculta por padrão no mobile com overlay animado

---

## Credenciais de Teste

| Perfil | E-mail | Senha |
|---|---|---|
| Aluno | joaopedro02@senac.com | senac123 |
| Coordenador | mirandamonteiro2@senac.coordenacao.com | cord@123 |

---

## Deploy

| Serviço | Plataforma | Descrição |
|---|---|---|
| Frontend | [Netlify](https://netlify.com) | Deploy automático via GitHub |
| Backend | [Render](https://render.com) | API REST Node.js + TypeScript |
| Banco de Dados | [Aiven Cloud](https://aiven.io) | MySQL gerenciado na nuvem |
| Storage | [Supabase](https://supabase.com) | Bucket S3-compatible para certificados |

---

## Dicas para a Equipe

- **Path Aliases** — use sempre `@/` para referenciar a pasta `src`. Nunca use caminhos relativos como `../../../../`
- **Tailwind v4** — não existe `tailwind.config.js`. As variáveis de tema são editadas em `src/styles/global.css` dentro do bloco `@theme`
- **Extensões recomendadas** — Tailwind CSS IntelliSense e ESLint no VS Code
- **Adicionar componentes Shadcn** — `npx shadcn@latest add [nome-do-componente]`

---

## Equipe

Projeto desenvolvido por estudantes do **3° Período de Análise e Desenvolvimento de Sistemas** como parte da disciplina de Projeto Integrador.

| Nome | LinkedIn | GitHub |
|---|---|---|
| Ruth Camile | [LinkedIn](https://www.linkedin.com/in/ruth-camile-7b6210295/) | [GitHub](https://github.com/ruthcamile) |
| Morgana Barbosa | [LinkedIn](https://www.linkedin.com/in/morganabarbosa1212/) | [GitHub](https://github.com/Morganabarbs) |
| Luis Augusto | [LinkedIn](https://www.linkedin.com/in/luis-augusto-61980235a/) | [GitHub](https://github.com/LuisWebCoding) |
| Igor Alves | [LinkedIn](https://www.linkedin.com/in/igor-alves15) | [GitHub](https://github.com/igor-araujo-15) |

---

<div align="center">
Feito com ❤️ por estudantes de ADS · Projeto Integrador 3° Período
</div>
