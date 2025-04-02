import { db, closeDatabase } from "../index";
import * as schema from "../schema";

// Script para criar todas as tabelas no banco de dados
function main() {
  console.log("Iniciando migração do banco de dados...");

  try {
    // Criar tabelas de assinaturas
    db.run(`CREATE TABLE IF NOT EXISTS assinaturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      custo_mensal REAL NOT NULL,
      data_vencimento TEXT NOT NULL,
      categoria TEXT NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1,
      observacoes TEXT,
      url_logo TEXT,
      data_contratacao TEXT NOT NULL
    )`);

    // Criar tabela de filmes e séries
    db.run(`CREATE TABLE IF NOT EXISTS filmes_series (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      tipo TEXT NOT NULL,
      status TEXT NOT NULL,
      avaliacao INTEGER,
      comentario TEXT,
      plataforma_id INTEGER,
      temporadas INTEGER,
      data_adicionado TEXT NOT NULL,
      url_imagem TEXT,
      genero TEXT,
      FOREIGN KEY (plataforma_id) REFERENCES assinaturas(id)
    )`);

    // Criar tabela de histórico de assistidos
    db.run(`CREATE TABLE IF NOT EXISTS historico_assistidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filme_serie_id INTEGER NOT NULL,
      data_assistido TEXT NOT NULL,
      concluido INTEGER NOT NULL DEFAULT 0,
      tempo_assistido INTEGER,
      FOREIGN KEY (filme_serie_id) REFERENCES filmes_series(id)
    )`);

    // Criar tabela de tags
    db.run(`CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    )`);

    // Criar tabela de relações entre filmes/séries e tags
    db.run(`CREATE TABLE IF NOT EXISTS filmes_series_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filme_serie_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      FOREIGN KEY (filme_serie_id) REFERENCES filmes_series(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    )`);

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  } finally {
    closeDatabase();
  }
}

// Executar script de migração
main();
