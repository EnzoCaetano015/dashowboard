<div align="center">

# 🧭 DashowBoard

### Um cockpit desktop para monitorar projetos, serviços, deploys e incidentes em um só lugar.

<p>
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-7C3AED?style=for-the-badge" />
  <img src="https://img.shields.io/badge/app-desktop-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tauri-2.0-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/GitHub-integração-181717?style=flat-square&logo=github" />
  <img src="https://img.shields.io/badge/Vercel-integração-000000?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/Railway-integração-0B0D0E?style=flat-square&logo=railway" />
  <img src="https://img.shields.io/badge/Supabase-integração-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
</p>

</div>

---

## ✨ Sobre o projeto

**DashowBoard** é um aplicativo desktop pessoal criado para centralizar a visão operacional de projetos espalhados entre **GitHub, Vercel, Railway e Supabase**.

A ideia é transformar vários painéis separados em um único cockpit local, onde seja possível acompanhar o estado dos projetos, repositórios, serviços, deploys, disponibilidade e incidentes sem precisar abrir várias abas ou dashboards externos.

> O foco atual do app é **consultar, organizar e monitorar**. Ele não administra, exclui ou altera recursos remotos sem ação explícita.

---

## 🧠 O problema que ele resolve

```mermaid
flowchart LR
    A[Projetos em produção] --> B[GitHub]
    A --> C[Vercel]
    A --> D[Railway]
    A --> E[Supabase]

    B --> F[Muitos painéis]
    C --> F
    D --> F
    E --> F

    F --> G[Baixa visibilidade]
    G --> H[Status espalhado]
    H --> I[Deploys, serviços e incidentes difíceis de acompanhar]

    I --> J[DashowBoard]
    J --> K[Visão única, local e organizada]
```

---

## 🕹️ Funcionalidades

| Área | O que o DashowBoard faz |
|---|---|
| 📊 **Visão geral** | Exibe métricas agregadas dos projetos monitorados. |
| 🧩 **Projetos** | Agrupa repositórios, serviços, providers e configurações locais. |
| 🚦 **Status** | Classifica serviços como saudável, degradado, offline, atualizando ou desconhecido. |
| ⚠️ **Incidentes** | Registra mudanças relevantes de estado, sem duplicar o mesmo problema repetidamente. |
| 🔌 **Integrações** | Conecta GitHub, Vercel, Railway e Supabase via tokens locais. |
| 🗂️ **SQLite local** | Persiste projetos, vínculos, histórico e configurações no ambiente desktop. |
| 🔔 **Notificações** | Estrutura preparada para avisos locais via Tauri. |
| 🧪 **Filtros** | Permite filtrar projetos por nome, status, provider, tipo de serviço e tag. |

---

## 🧭 Fluxo de uso

```mermaid
flowchart TD
    A[Configurar integrações] --> B[Selecionar repositórios e serviços]
    B --> C[Criar projeto local]
    C --> D[Dashboard consulta providers]
    D --> E[Calcula status agregado]
    E --> F[Exibe métricas, cards e histórico]
    F --> G[Registra incidentes relevantes]
    G --> H[Usuário acompanha tudo em um só app]
```

---

## 🏗️ Arquitetura

```mermaid
flowchart TB
    UI[Interface React + Tailwind + shadcn/ui]
    Pages[Páginas e hooks]
    API[Camada backend/api]
    SQL[Repositórios SQL locais]
    Tauri[Tauri 2 Runtime]
    SQLite[(SQLite local)]
    Providers[GitHub · Vercel · Railway · Supabase]

    UI --> Pages
    Pages --> API
    API --> SQL
    SQL --> SQLite
    API --> Tauri
    Tauri --> Providers
```

---

## 🧱 Stack principal

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-111827?style=for-the-badge" />
</p>

### Desktop e Runtime

<p>
  <img src="https://img.shields.io/badge/Tauri-2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

### Dados, estado e UI

<p>
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-8884D8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Lucide-111827?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Sonner-toast-000000?style=for-the-badge" />
</p>

---

## 📌 Modelo de domínio

```mermaid
classDiagram
    class Projeto {
      +nome
      +descricao
      +status
      +urlAplicacao
      +intervaloVerificacao
      +timeout
    }

    class Repositorio {
      +fullName
      +branch
      +ultimoCommit
      +statusWorkflow
      +issuesAbertas
      +pullRequestsAbertas
    }

    class Servico {
      +provider
      +tipo
      +ambiente
      +status
      +tempoRespostaMs
      +ultimoDeployment
    }

    class Incidente {
      +statusAnterior
      +statusAtual
      +verificadoEm
    }

    Projeto "1" --> "0..*" Repositorio
    Projeto "1" --> "0..*" Servico
    Projeto "1" --> "0..*" Incidente
```

---

## 📂 Estrutura do projeto

```txt
src/
  backend/
    api/
      controllers/     # hooks e queries da camada de dados
      integrations/    # integrações com providers externos
      models/          # contratos e tipos da aplicação
      enums/           # domínios de status, providers, tipos e tags

  components/          # componentes reutilizáveis
  pages/               # telas, hooks, schemas, modais e componentes locais
  lib/                 # config, hooks, helpers e tipos globais
  routes/              # rotas da aplicação

src-tauri/
  src/                 # comandos, integrações nativas e runtime Tauri
  Cargo.toml           # dependências Rust/Tauri
```

---

## 🔐 Segurança

- Tokens são tratados como configuração local.
- Nenhum token deve ser exposto em variáveis `VITE_*`, logs ou bundle do frontend.
- O app consulta dados externos, mas não remove ou publica recursos remotamente por padrão.
- O SQLite armazena vínculos locais, histórico e configurações do dashboard.

---

## ▶️ Como rodar localmente

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Rode em modo web

```bash
pnpm dev
```

### 3. Rode como app desktop Tauri

```bash
pnpm tauri dev
```

### 4. Gere build de produção

```bash
pnpm build
pnpm tauri build
```

---

## 🧪 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o Vite em modo desenvolvimento. |
| `pnpm build` | Executa checagem TypeScript e gera build web. |
| `pnpm preview` | Serve o build localmente. |
| `pnpm tauri` | Executa comandos do Tauri CLI. |

---

## 🧭 Roadmap

```mermaid
flowchart LR
    A[Integrações locais] --> B[Monitoramento contínuo]
    B --> C[Histórico de incidentes]
    C --> D[Notificações desktop]
    D --> E[Relatórios e visão temporal]
    E --> F[Build distribuível]
```

---

## 🎯 Objetivo técnico

Este projeto foi criado para explorar uma arquitetura desktop moderna com **React + Tauri + SQLite**, aplicando conceitos de:

- monitoramento de aplicações;
- organização de projetos reais;
- integração com APIs externas;
- persistência local;
- modelagem de status e incidentes;
- UX para produtos de operação e observabilidade.

---

## 👨‍💻 Autor

Desenvolvido por **Enzo Caetano Rodrigues**.

<p>
  <a href="https://github.com/EnzoCaetano015">
    <img src="https://img.shields.io/badge/GitHub-EnzoCaetano015-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.caetanodev.com/">
    <img src="https://img.shields.io/badge/Portfólio-caetanodev.com-2563EB?style=for-the-badge" />
  </a>
  <a href="https://www.linkedin.com/in/enzo-caetano-814736290/">
    <img src="https://img.shields.io/badge/LinkedIn-Enzo%20Caetano-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
</p>

---

<div align="center">

### DashowBoard

**Menos abas abertas. Mais visão sobre seus projetos.**

</div>
