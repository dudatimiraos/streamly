import { getAllAssinaturas, getTotalCustoAssinaturas } from "./assinaturas";
import { getAllFilmesSeries, getEstatisticasFilmesSeries } from "./filmes-series";
import { getPlataformas } from "./plataformas";

export interface DashboardEstatisticas {
  totalFilmes: number;
  totalSeries: number;
  totalAssistidos: number;
  totalAssistindo: number;
  totalPlanejaAssistir: number;
  totalAssinaturas: number;
  assinaturasPorCategoria: {
    streaming: number;
    musica: number;
    jogos: number;
    outros: number;
  };
  custoAssinaturas: {
    streaming: number;
    musica: number;
    jogos: number;
    outros: number;
  };
  custoTotal: number;
  conteudoPorPlataforma: Record<string, number>;
  tendenciaGastos: number[];
  principaisAssinaturas: Array<{
    id: number;
    nome: string;
    custoMensal: number;
    dataVencimento: string;
    categoria: string;
    ativo: boolean;
    urlLogo?: string;
  }>;
  ultimosFilmesSeries: Array<{
    id: number;
    titulo: string;
    tipo: "filme" | "serie";
    status: "assistido" | "assistindo" | "planejo_assistir";
    avaliacao: number;
    urlImagem?: string;
    genero?: string;
    plataformaNome?: string;
  }>;
}

/**
 * Busca todas as estatísticas para o dashboard
 */
export async function getDashboardEstatisticas(): Promise<DashboardEstatisticas> {
  try {
    // Inicializa o objeto de resposta com valores padrão
    const estatisticas: DashboardEstatisticas = {
      totalFilmes: 0,
      totalSeries: 0,
      totalAssistidos: 0,
      totalAssistindo: 0,
      totalPlanejaAssistir: 0,
      totalAssinaturas: 0,
      assinaturasPorCategoria: {
        streaming: 0,
        musica: 0,
        jogos: 0,
        outros: 0,
      },
      custoAssinaturas: {
        streaming: 0,
        musica: 0,
        jogos: 0,
        outros: 0,
      },
      custoTotal: 0,
      conteudoPorPlataforma: {},
      tendenciaGastos: [0, 0, 0, 0, 0, 0],
      principaisAssinaturas: [],
      ultimosFilmesSeries: [],
    };

    // Busca assinaturas
    const assinaturas = await getAllAssinaturas();
    estatisticas.totalAssinaturas = assinaturas.length;

    // Calcula assinaturas por categoria
    assinaturas.forEach((assinatura) => {
      const categoria = assinatura.categoria.toLowerCase();
      if (categoria === "streaming") {
        estatisticas.assinaturasPorCategoria.streaming += 1;
        estatisticas.custoAssinaturas.streaming += assinatura.custoMensal;
      } else if (categoria === "música" || categoria === "musica") {
        estatisticas.assinaturasPorCategoria.musica += 1;
        estatisticas.custoAssinaturas.musica += assinatura.custoMensal;
      } else if (categoria === "jogos") {
        estatisticas.assinaturasPorCategoria.jogos += 1;
        estatisticas.custoAssinaturas.jogos += assinatura.custoMensal;
      } else {
        estatisticas.assinaturasPorCategoria.outros += 1;
        estatisticas.custoAssinaturas.outros += assinatura.custoMensal;
      }
    });

    // Calcula custo total
    estatisticas.custoTotal = await getTotalCustoAssinaturas();

    // Busca as principais assinaturas (top 3 por custo)
    estatisticas.principaisAssinaturas = assinaturas.sort((a, b) => b.custoMensal - a.custoMensal).slice(0, 3);

    // Busca filmes e séries
    const filmesSeries = await getAllFilmesSeries();
    const estatisticasFS = await getEstatisticasFilmesSeries();

    // Mapeia os campos das estatísticas conforme esperado pelo dashboard
    estatisticas.totalFilmes = estatisticasFS.totalFilmes || estatisticasFS.filmes;
    estatisticas.totalSeries = estatisticasFS.totalSeries || estatisticasFS.series;
    estatisticas.totalAssistidos = estatisticasFS.totalAssistidos || estatisticasFS.assistidos;
    estatisticas.totalAssistindo = estatisticasFS.totalAssistindo || estatisticasFS.assistindo;
    estatisticas.totalPlanejaAssistir = estatisticasFS.totalPlanejaAssistir || estatisticasFS.planejaAssistir;

    // Busca plataformas para correlacionar com os conteúdos
    const plataformas = await getPlataformas();
    const plataformasMap = new Map(plataformas.map((p) => [p.id, p.nome]));

    // Conteúdo por plataforma
    const conteudoPorPlataforma: Record<string, number> = {};

    // Conta o número de filmes/séries por plataforma
    filmesSeries.forEach((fs) => {
      if (fs.plataformaId) {
        const plataformaNome = plataformasMap.get(fs.plataformaId) || "Desconhecida";
        conteudoPorPlataforma[plataformaNome] = (conteudoPorPlataforma[plataformaNome] || 0) + 1;
      }
    });
    estatisticas.conteudoPorPlataforma = conteudoPorPlataforma;

    // Obtém os últimos 6 filmes/séries adicionados
    estatisticas.ultimosFilmesSeries = filmesSeries
      .sort((a, b) => {
        // Assumindo que id maior significa adicionado mais recentemente
        // Em um banco real, você usaria campos como dataCriacao
        return b.id - a.id;
      })
      .slice(0, 6)
      .map((fs) => ({
        id: fs.id,
        titulo: fs.titulo,
        tipo: fs.tipo as "filme" | "serie",
        status: fs.status as "assistido" | "assistindo" | "planejo_assistir",
        avaliacao: fs.avaliacao || 0,
        urlImagem: fs.urlImagem,
        genero: fs.genero,
        plataformaNome: fs.plataformaId ? plataformasMap.get(fs.plataformaId) : undefined,
      }));

    // Simula dados de tendência de gastos nos últimos 6 meses
    // Idealmente seria calculado de registros reais de pagamentos
    try {
      // Simula tendência de gastos dos últimos 6 meses
      const today = new Date();
      const dadosTendencia = [];

      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        // Simula pequenas variações nos gastos mensais para criar uma tendência
        // Em uma aplicação real, esses dados viriam de uma tabela de pagamentos
        const variacao = Math.random() * 0.1 - 0.05; // variação de -5% a +5%
        dadosTendencia.push(estatisticas.custoTotal * (1 + variacao));
      }

      estatisticas.tendenciaGastos = dadosTendencia;
    } catch (error) {
      console.error("Erro ao calcular tendência de gastos:", error);
      // Usa valores simulados em caso de erro
      estatisticas.tendenciaGastos = Array(6)
        .fill(estatisticas.custoTotal)
        .map((valor) => valor * (0.95 + Math.random() * 0.1));
    }

    return estatisticas;
  } catch (error) {
    console.error("Erro ao carregar estatísticas do dashboard:", error);
    // Retorna objeto com valores padrão em caso de erro
    return {
      totalFilmes: 0,
      totalSeries: 0,
      totalAssistidos: 0,
      totalAssistindo: 0,
      totalPlanejaAssistir: 0,
      totalAssinaturas: 0,
      assinaturasPorCategoria: {
        streaming: 0,
        musica: 0,
        jogos: 0,
        outros: 0,
      },
      custoAssinaturas: {
        streaming: 0,
        musica: 0,
        jogos: 0,
        outros: 0,
      },
      custoTotal: 0,
      conteudoPorPlataforma: {},
      tendenciaGastos: [0, 0, 0, 0, 0, 0],
      principaisAssinaturas: [],
      ultimosFilmesSeries: [],
    };
  }
}
