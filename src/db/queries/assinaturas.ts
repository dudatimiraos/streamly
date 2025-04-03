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

// Função para confirmar o pagamento de uma assinatura
export async function confirmarPagamentoAssinatura(id: number) {
  try {
    // Buscar a assinatura atual para obter a data de vencimento
    const assinatura = await getAssinaturaById(id);
    if (!assinatura) {
      throw new Error(`Assinatura com ID ${id} não encontrada`);
    }

    // Calcular a nova data de vencimento (mês seguinte)
    const partes = assinatura.dataVencimento.split("-");
    const dataVencimentoAtual = new Date(
      parseInt(partes[0]), // ano
      parseInt(partes[1]) - 1, // mês (0-11)
      parseInt(partes[2]) // dia
    );

    const novaDataVencimento = new Date(dataVencimentoAtual);
    novaDataVencimento.setMonth(novaDataVencimento.getMonth() + 1);

    // Formatar a nova data no formato YYYY-MM-DD
    const dataFormatada = `${novaDataVencimento.getFullYear()}-${String(novaDataVencimento.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(novaDataVencimento.getDate()).padStart(2, "0")}`;

    // Atualizar a assinatura com o pagamento confirmado e a nova data de vencimento
    const result = await db
      .update(assinaturas)
      .set({
        pagamento: true,
        dataVencimento: dataFormatada,
      })
      .where(eq(assinaturas.id, id));

    return result;
  } catch (error) {
    console.error(`Erro ao confirmar pagamento da assinatura ${id}:`, error);
    throw error;
  }
}

// Função para verificar assinaturas próximas do vencimento
export async function getAssinaturasProximasVencimento(diasLimite: number = 3) {
  try {
    const todasAssinaturas = await getAllAssinaturas();

    // Criar data de hoje e data limite
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Remover horas, minutos, segundos para comparação precisa

    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() + diasLimite);
    dataLimite.setHours(23, 59, 59, 999); // Fim do dia limite

    const assinaturasProximasVencimento = todasAssinaturas.filter((assinatura) => {
      // Converter string para objeto Date usando partes para evitar problemas de timezone
      const partes = assinatura.dataVencimento.split("-");
      const dataVencimento = new Date(
        parseInt(partes[0]), // ano
        parseInt(partes[1]) - 1, // mês (0-11)
        parseInt(partes[2]) // dia
      );
      dataVencimento.setHours(0, 0, 0, 0); // Início do dia para comparação precisa

      // Verificar se a data de vencimento está entre hoje e o limite
      return (
        !assinatura.pagamento && // Assinatura não paga
        dataVencimento >= hoje && // Não vencida
        dataVencimento <= dataLimite
      ); // Dentro do limite de dias
    });

    return assinaturasProximasVencimento;
  } catch (error) {
    console.error(`Erro ao verificar assinaturas próximas do vencimento:`, error);
    throw error;
  }
}

// Função para verificar assinaturas vencidas e atualizar status de pagamento
export async function verificarAssinaturasVencidas() {
  try {
    // Obter data de hoje no formato YYYY-MM-DD sem timezone
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
      hoje.getDate()
    ).padStart(2, "0")}`;

    const todasAssinaturas = await getAllAssinaturas();

    // Filtrar assinaturas que venceram hoje e estão com pagamento = true
    const assinaturasParaAtualizar = todasAssinaturas.filter((assinatura) => {
      // Normalizar a data de vencimento para comparação
      const dataVencimento = assinatura.dataVencimento.split("T")[0];
      return dataVencimento === hojeFormatado && assinatura.pagamento === true;
    });

    // Atualizar o status de pagamento para false
    for (const assinatura of assinaturasParaAtualizar) {
      await db.update(assinaturas).set({ pagamento: false }).where(eq(assinaturas.id, assinatura.id));
    }

    return {
      atualizadas: assinaturasParaAtualizar.length,
      assinaturas: assinaturasParaAtualizar,
    };
  } catch (error) {
    console.error("Erro ao verificar assinaturas vencidas:", error);
    throw error;
  }
}
