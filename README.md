# 🚀 Kanban Board

<div align="center">

**Sistema de Gerenciamento de Projetos e Tarefas**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/hono-e36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/docs/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## 📋 Visão Geral

Este é um desafio técnico full stack que consiste no desenvolvimento de um sistema de cadastro de projetos e tarefas. A aplicação deve permitir que os usuários criem projetos e adicionem tarefas relacionadas a cada projeto.

### ✨ Principais Funcionalidades

- 🎯 **Gerenciamento Completo de Projetos** - CRUD completo com interface intuitiva
- 📝 **Sistema de Tarefas Avançado** - Kanban board com drag & drop
- 🏷️ **Prioridades e Status** - Organização visual com badges coloridos
- 📱 **Interface Responsiva** - Experiência otimizada para todos os dispositivos
- ⚡ **Performance Otimizada** - Carregamento rápido e atualizações em tempo real
- 🔄 **Sincronização Automática** - Contadores e dados sempre atualizados

---

## 🛠️ Stack Tecnológica

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[ShadcnUI](https://ui.shadcn.com/)** - Componentes modernos e acessíveis
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)** - Drag and drop para Kanban

### Backend
- **[Hono](https://hono.dev/)** - Framework web ultrarrápido para API Routes
- **[Prisma ORM](https://www.prisma.io/)** - ORM type-safe para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto

### DevOps & Ferramentas
- **[Docker](https://www.docker.com/)** & **Docker Compose** - Containerização
- **[Vitest](https://vitest.dev/)** - Framework de testes moderno
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

---

## 🗄️ Arquitetura do Banco de Dados
A estrutura do banco de dados é baseada em duas entidades: **Project** e **Task**.

```mermaid

erDiagram
    PROJECT {
        int id PK "Auto increment"
        string name "Nome do projeto"
        timestamp createdAt "Data de criação"
        timestamp updatedAt "Data de atualização"
    }

    TASK {
        int id PK "Auto increment"
        string name "Nome da tarefa"
        string description "Descrição detalhada"
        int projectId FK "Referência ao projeto"
        enum priority "Prioridade (low, medium, high)"
        enum status "Status (todo, in_progress, done)"
        timestamp createdAt "Data de criação"
        timestamp updatedAt "Data de atualização"
    }

    PROJECT ||--o{ TASK : "possui"

```

```prisma

model Project {
  id    Int    @id @default(autoincrement())
  name  String
  tasks Task[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("projects")
}

model Task {
  id          Int         @id @default(autoincrement())
  name        String
  description String
  priority    Priority?
  status      TaskStatus?

  projectId   Int
  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("tasks")
}

enum Priority {
  low
  medium
  high

  @@map("priority")
}

enum TaskStatus {
  todo
  in_progress
  done

  @@map("task_status")
}

```

---

## 🎯 Especificação do Desafio

Desenvolver um sistema full stack de gerenciamento de projetos e tarefas utilizando Next.js, Hono e PostgreSQL. O sistema deve permitir operações CRUD completas em projetos e suas respectivas tarefas, com interface responsiva e arquitetura escalável. Os projetos possuem relacionamento one-to-many com tarefas, garantindo integridade referencial através de cascata na exclusão.

---

## ✅ Checklist de Funcionalidades

### 🔧 Backend APIs

- [x] API para criação de projetos

- [x] API para listagem de projetos

- [x] API para exclusão de projetos

- [x] API para criação de tarefas vinculadas a projetos

- [x] API para listagem de tarefas por projeto

- [x] API para exclusão de tarefas

### 🎨 Frontend Interfaces

- [x] Interface para cadastro de projetos

- [x] Interface para visualização/listagem de projetos

- [x] Interface para cadastro de tarefas por projeto

- [x] Interface para visualização/listagem de tarefas associadas a projetos

- [x] Funcionalidade de exclusão de projetos e tarefas

### 🎁 Funcionalidades Extras Implementadas

- [x] **Sistema de Prioridades** - Low, Medium, High com cores distintivas
- [x] **Drag & Drop Avançado** - Mudança de status via arrastar e soltar
- [x] **Contadores Dinâmicos** - Atualização automática sem refresh
- [x] **Estados de Loading** - Feedback visual durante operações
- [x] **Tratamento de Erros** - Mensagens informativas via toast
- [x] **Interface Responsiva** - Otimizada para mobile e desktop

---

## 🚀 Guia de Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **pnpm** (recomendado) ou npm
- **Docker** & **Docker Compose**
- **Git**

### 📦 Instalação Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/andrejfg/desafio-tecnico-one-fullstack-lorenzo.git
   cd desafio-tecnico-one-fullstack
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie os arquivos `.env` e `.env.test` baseados no `.env.example`:

   ```env
   # .env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dev_db"
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=dev_db
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

   ```env
   # .env.test
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_db"
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=test_db
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Inicie o banco de dados**
   ```bash
   docker compose up -d
   ```

5. **Execute as migrações**
   ```bash
   pnpm run migrate
   ```

6. **Popule com dados iniciais** (opcional)
   ```bash
   pnpm run db:seed
   ```

7. **Execute os testes** (opcional)
   ```bash
   pnpm run test
   ```

8. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   ```

9. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

---

## 📁 Estrutura do Projeto

```
📦 desafio-tecnico-one-fullstack/
├── 📂 .next/                   # Build cache do Next.js
├── 📂 node_modules/            # Dependências do projeto
├── 📂 prisma/                  # Schema e migrações do banco
│   ├── schema.prisma
│   └── migrations/
├── 📂 src/
│   ├── 📂 app/                 # App Router do Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── 📂 components/          # Componentes React reutilizáveis
│   │   ├── 📂 ui/              # Componentes base do ShadcnUI
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── 📂 DeleteConfirmDialog/
│   │   ├── 📂 KanbanBoard/
│   │   ├── 📂 Project/
│   │   │   ├── ProjectAddDialog/
│   │   │   └── ProjectEditDialog/
│   │   ├── 📂 Providers/
│   │   ├── 📂 Sidebar/
│   │   ├── 📂 Spinner/
│   │   └── 📂 Task/
│   │       ├── TaskAddDialog/
│   │       └── TaskEditDialog/
│   ├── 📂 constants/           # Constantes da aplicação
│   │   ├── api.routes.ts
│   │   └── index.ts
│   ├── 📂 hooks/               # React hooks customizados
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── use-toast.ts
│   ├── 📂 lib/                 # Configurações de bibliotecas
│   │   ├── axios.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── 📂 screens/             # Componentes de telas
│   ├── 📂 server/              # API Routes com Hono
│   │   ├── 📂 health/
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   ├── 📂 project/
│   │   │   ├── project.routes.ts
│   │   │   ├── project.test.ts
│   │   │   └── index.ts
│   │   └── 📂 task/
│   │       ├── task.routes.ts
│   │       ├── task.test.ts
│   │       └── index.ts
│   └── 📂 utils/               # Funções utilitárias
│       ├── cleanDatabase.ts
│       ├── use-mobile.tsx
│       └── use-toast.tsx
├── 📂 tests/                   # Configuração de testes
├── 📄 .env                     # Variáveis de ambiente
├── 📄 .env.test                # Variáveis de ambiente de teste
├── 📄 .gitignore               # Arquivos ignorados pelo Git
├── 📄 components.json          # Configuração ShadcnUI
├── 📄 compose.yaml             # Configuração do Docker
├── 📄 eslint.config.js         # Configuração ESLint
├── 📄 next.config.ts           # Configuração do Next.js
├── 📄 package.json             # Dependências e scripts
├── 📄 package-lock.json        # Lock das dependências
├── 📄 pnpm-lock.yaml           # Lock do PNPM
├── 📄 postcss.config.mjs       # Configuração PostCSS
├── 📄 README.md                # Documentação do projeto
├── 📄 tailwind.config.ts       # Configuração do Tailwind
├── 📄 tsconfig.json            # Configuração TypeScript
└── 📄 vitest.config.ts         # Configuração do Vitest
```

---

## 🛡️ API Endpoints

### 📋 Projetos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/projects` | Lista todos os projetos com suas tarefas |
| `POST` | `/api/projects` | Cria um novo projeto |
| `PATCH` | `/api/projects/:id` | Atualiza um projeto específico |
| `DELETE` | `/api/projects/:id` | Exclui um projeto e suas tarefas |

### ✅ Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/tasks/:projectId` | Lista tarefas de um projeto |
| `POST` | `/api/tasks` | Cria uma nova tarefa |
| `PATCH` | `/api/tasks/task/:id` | Atualiza uma tarefa específica |
| `DELETE` | `/api/tasks/task/:id` | Exclui uma tarefa |

### 📚 Documentação Completa

**[🔗 Collection do Postman](https://mais-renda.postman.co/workspace/Lorenzo-Workspace-Postman~a8be8083-10fe-4aea-82a7-51bf7a10ace8/collection/22421568-03e290c2-514a-475e-b2ac-95cea3f23202?action=share&creator=22421568)**

---

## 🧪 Testes

### Executar Testes

```bash
pnpm run test
```

### Cobertura de Testes

- ✅ **Testes de API** - Endpoints de projetos e tarefas
- ✅ **Testes de Integração** - Fluxos completos de CRUD

---


## 🚀 Principais Melhorias Implementadas

### Performance

- **Otimização de API**: Redução de 8 para 1 chamada na inicialização
- **Estado Local**: Contadores atualizados instantaneamente
- **Lazy Loading**: Carregamento sob demanda de componentes

### UX/UI

- **Drag & Drop**: Interface fluida para reorganização de tarefas
- **Feedback Visual**: Loading states e animações
- **Responsividade**: Layout adaptativo para todos os dispositivos
- **Acessibilidade**: Navegação por teclado e screen readers

### Arquitetura

- **Separação de Responsabilidades**: APIs, tipos e componentes organizados
- **Reutilização**: Componentes e hooks modulares
- **Tipagem Forte**: TypeScript em todo o projeto
- **Tratamento de Erros**: Sistema robusto de error boundaries

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev              # Inicia servidor de desenvolvimento
pnpm run build            # Build de produção
pnpm run start            # Inicia servidor de produção

# Banco de Dados
pnpm run migrate      # Executa migrações
pnpm run db:seed      # Popula banco com dados iniciais

# Testes
pnpm test             # Executa testes

# Docker
docker compose up -d  # Inicia banco PostgreSQL
docker compose down   # Para containers
```
