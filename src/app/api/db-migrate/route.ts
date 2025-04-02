import { NextResponse } from "next/server";
import { db } from "@/db";
import { assinaturas, filmesEseries, historicoAssistidos, tags, filmeSeriesTags } from "@/db/schema";
import { sql } from "drizzle-orm";
import path from "path";
import fs from "fs";

// GET /api/db-migrate
export async function GET() {
  try {
    console.log("Iniciando migração do banco de dados...");

    // Verificar se o diretório existe
    const dbPath = path.resolve(process.cwd(), "streamly.db");
    console.log("Caminho do banco de dados:", dbPath);

    // Verificar permissões do diretório
    const dbDir = path.dirname(dbPath);
    try {
      fs.accessSync(dbDir, fs.constants.W_OK);
      console.log(`Diretório ${dbDir} tem permissões de escrita.`);
    } catch (err) {
      console.error(`Diretório ${dbDir} não tem permissões de escrita:`, err);
    }

    // Debug: Verificar a conexão do banco de dados
    console.log("Verificando conexão com o banco de dados...");
    console.log("Tipo de db:", typeof db);
    console.log("Driver disponível:", !!(db as any).driver);

    // Acessar o driver SQLite para executar SQL bruto
    // Em better-sqlite3 com Drizzle, o driver é acessível diretamente
    const sqlite = (db as any).driver;
    console.log("Tipo de sqlite.exec:", typeof sqlite.exec);

    // Criar tabelas usando exec do SQLite diretamente
    console.log("Criando tabela: assinaturas");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS assinaturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        custo_mensal REAL NOT NULL,
        data_vencimento TEXT NOT NULL,
        categoria TEXT NOT NULL,
        ativo INTEGER NOT NULL DEFAULT 1,
        observacoes TEXT,
        url_logo TEXT,
        data_contratacao TEXT NOT NULL
      )
    `);

    console.log("Criando tabela: filmes_series");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS filmes_series (
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
      )
    `);

    console.log("Criando tabela: historico_assistidos");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS historico_assistidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filme_serie_id INTEGER NOT NULL,
        data_assistido TEXT NOT NULL,
        concluido INTEGER NOT NULL DEFAULT 0,
        tempo_assistido INTEGER,
        FOREIGN KEY (filme_serie_id) REFERENCES filmes_series(id)
      )
    `);

    console.log("Criando tabela: tags");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
      )
    `);

    console.log("Criando tabela: filmes_series_tags");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS filmes_series_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filme_serie_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (filme_serie_id) REFERENCES filmes_series(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )
    `);

    // Verificar se as tabelas foram criadas
    try {
      console.log("Verificando se as tabelas foram criadas...");
      const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      console.log("Tabelas criadas:", tables.map((t) => t.name).join(", "));
    } catch (err) {
      console.error("Erro ao listar tabelas:", err);
    }

    // Adicionar alguns dados de exemplo, se as tabelas estiverem vazias
    console.log("Verificando dados existentes...");
    const assinaturasExistentes = await db.select().from(assinaturas);

    if (assinaturasExistentes.length === 0) {
      console.log("Inserindo dados de exemplo para assinaturas...");
      await db.insert(assinaturas).values([
        {
          nome: "Netflix",
          custoMensal: 39.9,
          dataVencimento: "2025-05-15",
          categoria: "streaming",
          ativo: true,
          urlLogo: "https://logodownload.org/wp-content/uploads/2014/10/netflix-logo-5.png",
          dataContratacao: "2023-01-15",
        },
        {
          nome: "Amazon Prime Video",
          custoMensal: 14.9,
          dataVencimento: "2025-05-22",
          categoria: "streaming",
          ativo: true,
          urlLogo: "https://m.media-amazon.com/images/G/01/digital/video/acquisition/web_footer_logo._CB462908456_.png",
          dataContratacao: "2023-02-10",
        },
        {
          nome: "Spotify",
          custoMensal: 19.9,
          dataVencimento: "2025-05-10",
          categoria: "musica",
          ativo: true,
          urlLogo: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png",
          dataContratacao: "2022-11-05",
        },
      ]);
    } else {
      console.log(`Encontradas ${assinaturasExistentes.length} assinaturas existentes.`);
    }

    const filmesSeriesExistentes = await db.select().from(filmesEseries);

    if (filmesSeriesExistentes.length === 0) {
      console.log("Inserindo dados de exemplo para filmes e séries...");
      await db.insert(filmesEseries).values([
        {
          titulo: "Stranger Things",
          tipo: "serie",
          status: "assistido",
          avaliacao: 5,
          urlImagem: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
          genero: "Ficção Científica, Drama",
          plataformaId: 1,
          temporadas: 4,
          dataAdicionado: "2023-01-15",
          comentario: "Série incrível, muito bem produzida!",
        },
        {
          titulo: "Oppenheimer",
          tipo: "filme",
          status: "assistido",
          avaliacao: 4,
          urlImagem: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
          genero: "Drama, História",
          plataformaId: 2,
          dataAdicionado: "2024-02-10",
          comentario: "Filme fantástico, dirigido por Christopher Nolan",
        },
      ]);
    } else {
      console.log(`Encontrados ${filmesSeriesExistentes.length} filmes/séries existentes.`);
    }

    console.log("Migração concluída com sucesso!");
    return NextResponse.json({
      success: true,
      message: "Migração concluída com sucesso!",
      dbPath,
      tabelas: {
        assinaturas: assinaturasExistentes.length,
        filmesSeries: filmesSeriesExistentes.length,
      },
    });
  } catch (error) {
    console.error("Erro na migração:", error);

    // Tentar obter mais detalhes sobre o erro
    let detalhes = "Erro desconhecido";
    let codigo = 500;

    if (error instanceof Error) {
      detalhes = error.message;
      if ((error as any).code === "SQLITE_CANTOPEN") {
        detalhes = "Não foi possível abrir ou criar o arquivo do banco de dados. Verifique as permissões de escrita.";
        codigo = 403;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Falha na migração do banco de dados",
        details: detalhes,
        stack: error instanceof Error ? error.stack : undefined,
        path: path.resolve(process.cwd(), "streamly.db"),
      },
      { status: codigo }
    );
  }
}
