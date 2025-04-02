// Serviço para comunicação com a API de filmes e séries

export interface FilmeSerie {
  id: number;
  titulo: string;
  tipo: "filme" | "serie";
  status: "assistido" | "assistindo" | "planejo_assistir";
  avaliacao?: number;
  urlImagem?: string;
  genero?: string;
  plataformaNome?: string;
  plataformaId?: number;
  comentario?: string;
  temporadas?: number;
  dataAdicionado: string;
}

export interface Estatisticas {
  total: number;
  totalFilmes: number;
  totalSeries: number;
  totalAssistidos: number;
  totalAssistindo: number;
  totalPlanejaAssistir: number;
}

export async function getAllFilmesSeries(): Promise<FilmeSerie[]> {
  try {
    const response = await fetch("/api/filmes-series", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes e séries: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar filmes e séries:", error);
    return [];
  }
}

export async function getFilmeSerieById(id: number): Promise<FilmeSerie | null> {
  try {
    const response = await fetch(`/api/filmes-series?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar filme/série: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar filme/série ${id}:`, error);
    return null;
  }
}

export async function createFilmeSerie(data: Omit<FilmeSerie, "id">): Promise<FilmeSerie | null> {
  try {
    const response = await fetch("/api/filmes-series", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar filme/série: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar filme/série:", error);
    return null;
  }
}

export async function updateFilmeSerie(id: number, data: Partial<FilmeSerie>): Promise<FilmeSerie | null> {
  try {
    const response = await fetch(`/api/filmes-series?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar filme/série: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar filme/série ${id}:`, error);
    return null;
  }
}

export async function deleteFilmeSerie(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/filmes-series?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir filme/série: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Erro ao excluir filme/série ${id}:`, error);
    return false;
  }
}

export async function getFilmeSeriesByStatus(
  status: "assistido" | "assistindo" | "planejo_assistir"
): Promise<FilmeSerie[]> {
  try {
    const response = await fetch(`/api/filmes-series?status=${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes e séries por status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar filmes e séries com status ${status}:`, error);
    return [];
  }
}

export async function searchFilmesSeries(termo: string): Promise<FilmeSerie[]> {
  try {
    const response = await fetch(`/api/filmes-series?search=${encodeURIComponent(termo)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes e séries: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar filmes e séries:", error);
    return [];
  }
}

export async function getEstatisticasFilmesSeries(): Promise<Estatisticas> {
  try {
    const response = await fetch("/api/filmes-series?estatisticas=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter estatísticas: ${response.status}`);
    }

    const data = await response.json();

    // Adaptar nomes de campos se necessário
    return {
      total: data.total,
      totalFilmes: data.filmes,
      totalSeries: data.series,
      totalAssistidos: data.assistidos,
      totalAssistindo: data.assistindo,
      totalPlanejaAssistir: data.planejaAssistir,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return {
      total: 0,
      totalFilmes: 0,
      totalSeries: 0,
      totalAssistidos: 0,
      totalAssistindo: 0,
      totalPlanejaAssistir: 0,
    };
  }
}
