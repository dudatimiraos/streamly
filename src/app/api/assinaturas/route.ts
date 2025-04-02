import { NextResponse } from "next/server";
import {
  getAllAssinaturas,
  getAssinaturaById,
  createAssinatura,
  updateAssinatura,
  deleteAssinatura,
  getTotalCustoAssinaturas,
} from "@/db/queries/assinaturas";

// GET /api/assinaturas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const assinatura = await getAssinaturaById(Number(id));
      return NextResponse.json(assinatura, { status: assinatura ? 200 : 404 });
    }

    const assinaturas = await getAllAssinaturas();
    return NextResponse.json(assinaturas);
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error);
    return NextResponse.json({ error: "Falha ao buscar assinaturas" }, { status: 500 });
  }
}

// POST /api/assinaturas
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar dados
    if (!body.nome || !body.custoMensal || !body.dataVencimento || !body.categoria) {
      return NextResponse.json(
        { error: "Dados incompletos. Nome, custo mensal, data de vencimento e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await createAssinatura({
      nome: body.nome,
      custoMensal: Number(body.custoMensal),
      dataVencimento: body.dataVencimento,
      categoria: body.categoria,
      ativo: body.ativo !== undefined ? body.ativo : true,
      observacoes: body.observacoes || null,
      urlLogo: body.urlLogo || null,
      dataContratacao: body.dataContratacao || new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return NextResponse.json({ error: "Falha ao criar assinatura" }, { status: 500 });
  }
}

// PUT /api/assinaturas
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateAssinatura(Number(id), body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    return NextResponse.json({ error: "Falha ao atualizar assinatura" }, { status: 500 });
  }
}

// DELETE /api/assinaturas
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const result = await deleteAssinatura(Number(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao excluir assinatura:", error);
    return NextResponse.json({ error: "Falha ao excluir assinatura" }, { status: 500 });
  }
}
