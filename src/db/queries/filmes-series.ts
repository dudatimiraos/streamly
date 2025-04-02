import { db } from "../index";
import { filmesEseries, assinaturas } from "../schema";
import { eq, and, like, desc } from "drizzle-orm";

// Função para obter todos os filmes e séries
export async function getAllFilmesSeries() {
  try {
    const result = await db
      .select({
        id: filmesEseries.id,
        titulo: filmesEseries.titulo,
        tipo: filmesEseries.tipo,
        status: filmesEseries.status,
        avaliacao: filmesEseries.avaliacao,
        comentario: filmesEseries.comentario,
        plataformaId: filmesEseries.plataformaId,
        temporadas: filmesEseries.temporadas,
        dataAdicionado: filmesEseries.dataAdicionado,
        urlImagem: filmesEseries.urlImagem,
        genero: filmesEseries.genero,
        plataformaNome: assinaturas.nome,
      })
      .from(filmesEseries)
      .leftJoin(assinaturas, eq(filmesEseries.plataformaId, assinaturas.id))
      .orderBy(desc(filmesEseries.dataAdicionado));

    return result;
  } catch (error) {
    console.error("Erro ao buscar filmes e séries:", error);
    throw error;
  }
}

// Função para obter um filme ou série por ID
export async function getFilmeSerieById(id: number) {
  try {
    const result = await db
      .select({
        id: filmesEseries.id,
        titulo: filmesEseries.titulo,
        tipo: filmesEseries.tipo,
        status: filmesEseries.status,
        avaliacao: filmesEseries.avaliacao,
        comentario: filmesEseries.comentario,
        plataformaId: filmesEseries.plataformaId,
        temporadas: filmesEseries.temporadas,
        dataAdicionado: filmesEseries.dataAdicionado,
        urlImagem: filmesEseries.urlImagem,
        genero: filmesEseries.genero,
        plataformaNome: assinaturas.nome,
      })
      .from(filmesEseries)
      .leftJoin(assinaturas, eq(filmesEseries.plataformaId, assinaturas.id))
      .where(eq(filmesEseries.id, id));

    return result[0] || null;
  } catch (error) {
    console.error("Erro ao buscar filme/série por ID:", error);
    throw error;
  }
}

// Função para criar um novo filme ou série
export async function createFilmeSerie(data: {
  titulo: string;
  tipo: "filme" | "serie";
  status: "assistido" | "assistindo" | "planejo_assistir";
  avaliacao?: number;
  comentario?: string;
  plataformaId?: number;
  temporadas?: number;
  dataAdicionado: string;
  urlImagem?: string;
  genero?: string;
}) {
  try {
    const result = await db.insert(filmesEseries).values(data);
    return result;
  } catch (error) {
    console.error("Erro ao criar filme/série:", error);
    throw error;
  }
}

// Função para atualizar um filme ou série
export async function updateFilmeSerie(
  id: number,
  data: Partial<{
    titulo: string;
    tipo: "filme" | "serie";
    status: "assistido" | "assistindo" | "planejo_assistir";
    avaliacao: number;
    comentario: string;
    plataformaId: number;
    temporadas: number;
    dataAdicionado: string;
    urlImagem: string;
    genero: string;
  }>
) {
  try {
    const result = await db.update(filmesEseries).set(data).where(eq(filmesEseries.id, id));
    return result;
  } catch (error) {
    console.error("Erro ao atualizar filme/série:", error);
    throw error;
  }
}

// Função para excluir um filme ou série
export async function deleteFilmeSerie(id: number) {
  try {
    const result = await db.delete(filmesEseries).where(eq(filmesEseries.id, id));
    return result;
  } catch (error) {
    console.error("Erro ao excluir filme/série:", error);
    throw error;
  }
}

// Função para filtrar filmes e séries por status
export async function getFilmesSeriesByStatus(status: "assistido" | "assistindo" | "planejo_assistir") {
  try {
    const result = await db
      .select({
        id: filmesEseries.id,
        titulo: filmesEseries.titulo,
        tipo: filmesEseries.tipo,
        status: filmesEseries.status,
        avaliacao: filmesEseries.avaliacao,
        comentario: filmesEseries.comentario,
        plataformaId: filmesEseries.plataformaId,
        temporadas: filmesEseries.temporadas,
        dataAdicionado: filmesEseries.dataAdicionado,
        urlImagem: filmesEseries.urlImagem,
        genero: filmesEseries.genero,
        plataformaNome: assinaturas.nome,
      })
      .from(filmesEseries)
      .leftJoin(assinaturas, eq(filmesEseries.plataformaId, assinaturas.id))
      .where(eq(filmesEseries.status, status));

    return result;
  } catch (error) {
    console.error(`Erro ao buscar filmes e séries com status ${status}:`, error);
    throw error;
  }
}

// Função para buscar filmes e séries por título
export async function searchFilmesSeries(termo: string) {
  try {
    const result = await db
      .select({
        id: filmesEseries.id,
        titulo: filmesEseries.titulo,
        tipo: filmesEseries.tipo,
        status: filmesEseries.status,
        avaliacao: filmesEseries.avaliacao,
        comentario: filmesEseries.comentario,
        plataformaId: filmesEseries.plataformaId,
        temporadas: filmesEseries.temporadas,
        dataAdicionado: filmesEseries.dataAdicionado,
        urlImagem: filmesEseries.urlImagem,
        genero: filmesEseries.genero,
        plataformaNome: assinaturas.nome,
      })
      .from(filmesEseries)
      .leftJoin(assinaturas, eq(filmesEseries.plataformaId, assinaturas.id))
      .where(like(filmesEseries.titulo, `%${termo}%`));

    return result;
  } catch (error) {
    console.error("Erro ao buscar filmes e séries:", error);
    throw error;
  }
}

export interface FilmeSerieEstatsticas {
  total: number;
  filmes: number;
  series: number;
  assistidos: number;
  assistindo: number;
  planejaAssistir: number;
}

// Função para obter estatísticas de filmes e séries
export async function getEstatisticasFilmesSeries(): Promise<FilmeSerieEstatsticas> {
  try {
    const todos = await db.select().from(filmesEseries);

    const filmes = todos.filter((item) => item.tipo === "filme");
    const series = todos.filter((item) => item.tipo === "serie");

    const assistidos = todos.filter((item) => item.status === "assistido");
    const assistindo = todos.filter((item) => item.status === "assistindo");
    const planejaAssistir = todos.filter((item) => item.status === "planejo_assistir");

    const estatisticas = {
      total: todos.length,
      filmes: filmes.length,
      series: series.length,
      assistidos: assistidos.length,
      assistindo: assistindo.length,
      planejaAssistir: planejaAssistir.length,
    };

    return estatisticas;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
}
