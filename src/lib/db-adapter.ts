import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";
import path from "path";
import fs from "fs";

// Configuração do caminho absoluto para o banco de dados
const dbPath = path.resolve(process.cwd(), "streamly.db");

// Função para criar uma conexão com o banco de dados
export function createConnection() {
  try {
    // Verificar se o diretório para o banco de dados existe
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Inicializa o banco de dados
    const sqlite = new Database(dbPath);

    // Configurações importantes para melhor desempenho e segurança
    sqlite.pragma("journal_mode = WAL"); // Modo WAL para melhor concorrência
    sqlite.pragma("foreign_keys = ON"); // Ativar chaves estrangeiras

    // Criar a instância do Drizzle mantendo a referência ao driver SQLite
    const db = drizzle(sqlite, { schema });

    // Guardar uma referência direta ao driver SQLite para uso em migrations
    Object.defineProperty(db, "driver", {
      value: sqlite,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return db;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados SQLite:", error);
    throw error;
  }
}

// Singleton para ambiente de desenvolvimento
let db: ReturnType<typeof createConnection> | null = null;

export function getConnection() {
  // Cria uma nova conexão se não existir
  if (!db) {
    console.log("Inicializando nova conexão com o SQLite...");
    try {
      db = createConnection();
    } catch (error) {
      console.error("Falha ao inicializar SQLite:", error);
      throw error;
    }
  }

  return db;
}

// Função para fechar a conexão (usar em scripts CLI)
export function closeConnection() {
  if (db) {
    try {
      // Acessar a instância do SQLite para fechar
      const sqlite = (db as any).driver;
      if (sqlite && typeof sqlite.close === "function") {
        sqlite.close();
        db = null;
        console.log("Conexão com o banco de dados fechada");
      }
    } catch (error) {
      console.error("Erro ao fechar conexão:", error);
    }
  }
}
