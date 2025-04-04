# **CSI606-2024-02 - Remoto - Trabalho Final - Resultados**

## *Discente: Maria Eduarda Santos Timiraos*

<!-- Este documento tem como objetivo apresentar o projeto desenvolvido, considerando o que foi definido na proposta e o produto final. -->

### Resumo

O meu trabalho final de Sistemas Web consiste no desenvolvimento do Streamly, um sistema web para gerenciamento de assinaturas de serviços de streaming, filmes e séries. O objetivo principal é centralizar em um único local o controle sobre conteúdos assistidos e as assinaturas ativas, permitindo que os usuários organizem suas preferências e acompanhem vencimentos de pagamentos.

### 1. Funcionalidades implementadas
- Gestão de Séries e Filmes: Cadastro de títulos com status (“assistido”, “assistindo” ou “planejo assistir”), além da opção de adicionar avaliações e feedbacks.
- Controle de Assinaturas: Cadastro de serviços de streaming com informações sobre custo mensal e data de vencimento, além de alertas automáticos para vencimentos próximos.
- Dashboard Personalizado: Exibição de estatísticas e gráficos sobre conteúdos e assinaturas, permitindo uma visualização clara dos dados.

### 2. Funcionalidades previstas e não implementadas
- Integração com APIs de Streaming: Planejava integrar com APIs de serviços como TMDb para facilitar o cadastro de conteúdos automaticamente.
- Modo Compartilhado: Uma funcionalidade que permitiria a criação de perfis para que vários usuários pudessem compartilhar um mesmo gerenciamento de assinaturas e listas de conteúdos.

### 3. Outras funcionalidades implementadas
- Sistema de Notificações: Alertas automáticos informando vencimentos de assinaturas.
- Filtro Avançado: Opção de busca por nome, categoria e status de exibição para facilitar a navegação pelo catálogo.
- Confirmação de Pagamento: Usuários podem marcar uma assinatura como paga, atualizando automaticamente a data de vencimento para o próximo ciclo.

### 4. Principais desafios e dificuldades
- Gerenciamento de Estados: Implementar um sistema eficiente para atualizar dados em tempo real, especialmente na parte do dashboard.
- Manipulação de Datas: Configurar corretamente as notificações e a atualização automática das assinaturas com base nas datas de vencimento.
- Organização do Banco de Dados: Estruturar as tabelas para armazenar assinaturas e conteúdos de forma otimizada e escalável.

### 5. Instruções para instalação e execução
Requsitos:
- Node.js 18+
- NPM ou Yarn

Passos para a instalação:
1) Clone o resposiorio:
```bash
git clone https://github.com/dudatimiraos/streamly.git
cd streamly
```

2) Instale as dependências:
```bash
npm install
```

3) Execute o projeto com banco de dados
```bash
npm run start-with-db
```


### 6. Referências
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- SQLite: https://sqlite.org/docs.html