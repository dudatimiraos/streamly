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
