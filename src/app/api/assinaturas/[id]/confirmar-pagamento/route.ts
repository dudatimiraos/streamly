import { NextResponse } from "next/server";
import { confirmarPagamentoAssinatura, getAssinaturaById } from "@/db/queries/assinaturas";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de assinatura inválido" }, { status: 400 });
    }

    // Verificar se a assinatura existe
    const assinaturaExistente = await getAssinaturaById(id);
    if (!assinaturaExistente) {
      return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 404 });
    }

    // Confirmar o pagamento
    await confirmarPagamentoAssinatura(id);

    // Buscar a assinatura atualizada
    const assinaturaAtualizada = await getAssinaturaById(id);

    return NextResponse.json(assinaturaAtualizada);
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return NextResponse.json({ error: "Erro ao confirmar pagamento" }, { status: 500 });
  }
}
