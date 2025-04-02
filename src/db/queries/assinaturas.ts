import { db } from "../index";
import { assinaturas } from "../schema";
import { eq } from "drizzle-orm";

// Função para obter todas as assinaturas
export async function getAllAssinaturas() {
  try {
    const result = await db.select().from(assinaturas);
    return result;
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error);
    throw error;
  }
}

// Função para obter uma assinatura por ID
export async function getAssinaturaById(id: number) {
  try {
    const result = await db.select().from(assinaturas).where(eq(assinaturas.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Erro ao buscar assinatura por ID:", error);
    throw error;
  }
}

// Função para criar uma nova assinatura
export async function createAssinatura(data: {
  nome: string;
  custoMensal: number;
  dataVencimento: string;
  categoria: string;
  ativo?: boolean;
  observacoes?: string;
  urlLogo?: string;
  dataContratacao: string;
}) {
  try {
    const result = await db.insert(assinaturas).values(data);
    return result;
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
}

// Função para atualizar uma assinatura
export async function updateAssinatura(
  id: number,
  data: Partial<{
    nome: string;
    custoMensal: number;
    dataVencimento: string;
    categoria: string;
    ativo: boolean;
    observacoes: string;
    urlLogo: string;
    dataContratacao: string;
  }>
) {
  try {
    const result = await db.update(assinaturas).set(data).where(eq(assinaturas.id, id));
    return result;
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    throw error;
  }
}

// Função para excluir uma assinatura
export async function deleteAssinatura(id: number) {
  try {
    const result = await db.delete(assinaturas).where(eq(assinaturas.id, id));
    return result;
  } catch (error) {
    console.error("Erro ao excluir assinatura:", error);
    throw error;
  }
}

// Função para calcular o custo total das assinaturas ativas
export async function getTotalCustoAssinaturas() {
  try {
    const todasAssinaturas = await db.select().from(assinaturas).where(eq(assinaturas.ativo, true));
    const custoTotal = todasAssinaturas.reduce((total, assinatura) => total + assinatura.custoMensal, 0);
    return custoTotal;
  } catch (error) {
    console.error("Erro ao calcular custo total:", error);
    throw error;
  }
}

// Função para agrupar assinaturas por categoria
export async function getAssinaturasPorCategoria() {
  try {
    const todasAssinaturas = await db.select().from(assinaturas);
    const porCategoria = todasAssinaturas.reduce((acc, assinatura) => {
      const { categoria } = assinatura;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(assinatura);
      return acc;
    }, {} as Record<string, typeof todasAssinaturas>);

    return porCategoria;
  } catch (error) {
    console.error("Erro ao agrupar assinaturas por categoria:", error);
    throw error;
  }
}
