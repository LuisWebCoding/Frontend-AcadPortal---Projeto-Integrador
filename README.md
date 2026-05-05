# AcadPortal - Sistema de Horas Complementares (PWA) 🎓

Este é o frontend da plataforma de gerenciamento de certificados do Senac, desenvolvido em React + Vite. O projeto utiliza as tecnologias mais recentes de 2026 para uma experiência moderna e performática.

## 🚀 Tecnologias Utilizadas

*   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (Engine CSS-first)
*   **Componentes:** [Shadcn/UI](https://ui.shadcn.com/) (Baseado em Radix UI)
*   **Animações:** [Framer Motion](https://www.framer.com/motion/)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Roteamento:** [React Router Dom v6](https://reactrouter.com/)
*   **Mobile:** Suporte a **PWA** (Progressive Web App)

## 🛠️ Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone (https://github.com/LuisWebCoding/Frontend-AcadPortal---Projeto-Integrador))

2. Instale as depedências
   npm install

3. Inicie o servidor de desenvolvimento.

 O projeto estará disponível em `http://localhost:5173`

## 📂 Estrutura de Pastas

*   `src/assets`: Imagens e logos oficiais.
*   `src/components/ui`: Componentes reutilizáveis do Shadcn/UI (botões, cards, inputs).
*   `src/hooks`: Lógica de autenticação e chamadas de API.
*   `src/pages/auth`: Tela de Login e fluxos de acesso.
*   `src/pages/aluno`: Dashboard e listagem de certificados do aluno.
*   `src/pages/coordenador`: Telas de validação e métricas do coordenador.
*   `src/routes`: Configuração do roteador e proteção de rotas por perfil.

## 🔑 Perfis de Acesso (Dados Mockados)

Para testar as funcionalidades da **Entrega 1**, utilize as credenciais contidas no arquivo `src/services/mock.js`. O sistema redireciona automaticamente com base no campo `perfil` (`ALUNO` ou `COORDENADOR`).

## 🎨 Adicionando novos componentes

Para adicionar novos componentes da biblioteca Shadcn, use o comando:
npx shadcn@latest add [nome-do-componente]

4. Dicas para os Integrantes da Equipe
   
**Extensões do VS Code:** Todos devem instalar a extensão **Tailwind CSS IntelliSense** e **ESLint**.
**Path Aliases:** O projeto usa `@/` para referenciar a pasta `src`. Isso está configurado no `vite.config.js` e no `jsconfig.json`. **Nunca use caminhos como `../../../../`**.
**Tailwind v4:** Não existe arquivo `tailwind.config.js`. Todas as variáveis de tema (cores, fontes) são editadas diretamente no arquivo `src/styles/global.css` dentro do bloco `@theme`.
