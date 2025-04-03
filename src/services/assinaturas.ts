// Serviço para comunicação com a API de assinaturas

interface Assinatura {
  id: number;
  nome: string;
  custoMensal: number;
  dataVencimento: string;
  categoria: string;
  ativo: boolean;
  urlLogo?: string;
  observacoes?: string;
  dataContratacao: string;
  pagamento: boolean;
}

export async function getAllAssinaturas(): Promise<Assinatura[]> {
  try {
    const response = await fetch("/api/assinaturas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar assinaturas: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error);
    return [];
  }
}

export async function getAssinaturaById(id: number): Promise<Assinatura | null> {
  try {
    const response = await fetch(`/api/assinaturas?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar assinatura: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar assinatura ${id}:`, error);
    return null;
  }
}

export async function createAssinatura(data: Omit<Assinatura, "id">): Promise<Assinatura | null> {
  try {
    const response = await fetch("/api/assinaturas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar assinatura: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return null;
  }
}

export async function updateAssinatura(id: number, data: Partial<Assinatura>): Promise<Assinatura | null> {
  try {
    const response = await fetch(`/api/assinaturas?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar assinatura: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar assinatura ${id}:`, error);
    return null;
  }
}

export async function deleteAssinatura(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/assinaturas?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir assinatura: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Erro ao excluir assinatura ${id}:`, error);
    return false;
  }
}

export async function getTotalCustoAssinaturas(): Promise<number> {
  try {
    const assinaturas = await getAllAssinaturas();
    return assinaturas
      .filter((assinatura) => assinatura.ativo)
      .reduce((total, assinatura) => total + assinatura.custoMensal, 0);
  } catch (error) {
    console.error("Erro ao calcular custo total:", error);
    return 0;
  }
}

export async function confirmarPagamentoAssinatura(id: number): Promise<Assinatura | null> {
  try {
    const response = await fetch(`/api/assinaturas/${id}/confirmar-pagamento`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao confirmar pagamento: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao confirmar pagamento da assinatura ${id}:`, error);
    return null;
  }
}

export async function getAssinaturasProximasVencimento(diasLimite: number = 3): Promise<Assinatura[]> {
  try {
    const assinaturas = await getAllAssinaturas();

    // Criar data de hoje e data limite
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Remover horas, minutos, segundos para comparação precisa

    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() + diasLimite);
    dataLimite.setHours(23, 59, 59, 999); // Fim do dia limite

    const assinaturasProximasVencimento = assinaturas.filter((assinatura) => {
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
    return [];
  }
}

export async function verificarAssinaturasVencidas(): Promise<{
  atualizadas: number;
  assinaturas: Assinatura[];
} | null> {
  try {
    const response = await fetch("/api/assinaturas/verificar-vencimentos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar assinaturas vencidas: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Erro ao verificar assinaturas vencidas:", error);
    return null;
  }
}
