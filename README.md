# Streamly - Gerenciador de Assinaturas e Conteúdos

Streamly é uma aplicação web para gerenciar suas assinaturas de streaming e catálogo de filmes/séries.

## Requisitos

- Node.js 18 ou superior
- NPM ou Yarn

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/streamly.git
cd streamly
npm install
```

## Rodando o Projeto

A forma mais simples de iniciar o projeto com o banco de dados é usar o comando:

```bash
npm run start-with-db
```

Este comando inicia o servidor Next.js e executa a migração do banco de dados automaticamente.

Alternativamente, você pode executar os comandos separadamente:

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Em outro terminal, execute o script de migração:
```bash
npm run migrate-db
```

## Banco de Dados

A aplicação utiliza SQLite como banco de dados, que é armazenado localmente em um arquivo `streamly.db`. 

### Estrutura do Banco de Dados

- **Assinaturas**: Armazena informações sobre serviços de streaming, jogos e música.
- **Filmes/Séries**: Catálogo de conteúdos assistidos, em progresso ou planejados.
- **Tags**: Sistema de categorização de conteúdos.

### Reinicializar o Banco de Dados

Para reinicializar o banco de dados, exclua o arquivo `streamly.db` na raiz do projeto e execute novamente:

```bash
npm run migrate-db
```

## Funcionalidades

- 📺 Gerenciamento de assinaturas (Netflix, Amazon Prime, Disney+, etc.)
- 🎬 Catálogo de filmes e séries
- 📊 Dashboard com estatísticas e visualizações
- 💰 Acompanhamento de gastos mensais
- 📅 Alertas de vencimento de assinaturas
- 🔍 Busca e filtragem de conteúdos

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- SQLite
- Drizzle ORM

## Estrutura do Projeto

```
src/
├── app/              # Páginas da aplicação (Next.js App Router)
│   ├── api/          # Rotas de API
│   └── ...           # Páginas da aplicação
├── components/       # Componentes reutilizáveis
├── db/               # Configuração do banco de dados
│   ├── schema/       # Esquema do banco de dados
│   └── queries/      # Consultas SQL
├── lib/              # Bibliotecas e utilitários
├── scripts/          # Scripts de inicialização e migração
├── services/         # Serviços para comunicação com a API
└── utils/            # Funções utilitárias
```

## Licença

Este projeto está licenciado sob a licença MIT.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
