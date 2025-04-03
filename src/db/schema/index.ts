import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Tabela de assinaturas
export const assinaturas = sqliteTable("assinaturas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  custoMensal: real("custo_mensal").notNull(),
  dataVencimento: text("data_vencimento").notNull(),
  categoria: text("categoria", { enum: ["streaming", "musica", "jogos", "outros"] }).notNull(),
  ativo: integer("ativo", { mode: "boolean" }).notNull().default(true),
  observacoes: text("observacoes"),
  urlLogo: text("url_logo"),
  dataContratacao: text("data_contratacao").notNull(),
  pagamento: integer("pagamento", { mode: "boolean" }).default(false),
});

// Tabela de filmes e séries
export const filmesEseries = sqliteTable("filmes_series", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  tipo: text("tipo", { enum: ["filme", "serie"] }).notNull(),
  status: text("status", { enum: ["assistido", "assistindo", "planejo_assistir"] }).notNull(),
  avaliacao: integer("avaliacao"),
  comentario: text("comentario"),
  plataformaId: integer("plataforma_id").references(() => assinaturas.id),
  temporadas: integer("temporadas"),
  dataAdicionado: text("data_adicionado").notNull(),
  urlImagem: text("url_imagem"),
  genero: text("genero"),
});

// Tabela para histórico de assistidos
export const historicoAssistidos = sqliteTable("historico_assistidos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filmeSerieId: integer("filme_serie_id")
    .references(() => filmesEseries.id)
    .notNull(),
  dataAssistido: text("data_assistido").notNull(),
  concluido: integer("concluido", { mode: "boolean" }).notNull().default(false),
  tempoAssistido: integer("tempo_assistido"), // em minutos
});

// Tabela para tags/categorias
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
});

// Tabela de relação entre filmes/séries e tags (muitos para muitos)
export const filmeSeriesTags = sqliteTable("filmes_series_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filmeSerieId: integer("filme_serie_id")
    .references(() => filmesEseries.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
});
