import { getAllAssinaturas } from "./assinaturas";

export interface Plataforma {
  id: number;
  nome: string;
  urlLogo?: string;
}

/**
 * Obtém a lista de plataformas disponíveis (usando assinaturas como plataformas)
 * @returns Promise<Plataforma[]>
 */
export async function getPlataformas(): Promise<Plataforma[]> {
  try {
    // Busca todas as assinaturas para usar como plataformas
    const assinaturas = await getAllAssinaturas();

    // Transforma as assinaturas em plataformas
    const plataformas = assinaturas.map((assinatura) => ({
      id: assinatura.id,
      nome: assinatura.nome,
      urlLogo: assinatura.urlLogo,
    }));

    return plataformas;
  } catch (error) {
    console.error("Erro ao buscar plataformas:", error);
    return [];
  }
}
