import { NextResponse } from "next/server";
import {
  getAllFilmesSeries,
  getFilmeSerieById,
  createFilmeSerie,
  updateFilmeSerie,
  deleteFilmeSerie,
  getFilmesSeriesByStatus,
  searchFilmesSeries,
  getEstatisticasFilmesSeries,
} from "@/db/queries/filmes-series";

// GET /api/filmes-series
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const estatisticas = searchParams.get("estatisticas");

    if (id) {
      const filmeSerie = await getFilmeSerieById(Number(id));
      return NextResponse.json(filmeSerie, { status: filmeSerie ? 200 : 404 });
    }

    if (status) {
      const filmesSeries = await getFilmesSeriesByStatus(status as any);
      return NextResponse.json(filmesSeries);
    }

    if (search) {
      const filmesSeries = await searchFilmesSeries(search);
      return NextResponse.json(filmesSeries);
    }

    if (estatisticas) {
      const stats = await getEstatisticasFilmesSeries();
      return NextResponse.json(stats);
    }

    const filmesSeries = await getAllFilmesSeries();
    return NextResponse.json(filmesSeries);
  } catch (error) {
    console.error("Erro ao buscar filmes e séries:", error);
    return NextResponse.json({ error: "Falha ao buscar filmes e séries" }, { status: 500 });
  }
}

// POST /api/filmes-series
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar dados
    if (!body.titulo || !body.tipo || !body.status) {
      return NextResponse.json(
        { error: "Dados incompletos. Título, tipo e status são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await createFilmeSerie({
      titulo: body.titulo,
      tipo: body.tipo,
      status: body.status,
      avaliacao: body.avaliacao || null,
      comentario: body.comentario || null,
      plataformaId: body.plataformaId || null,
      temporadas: body.temporadas || null,
      dataAdicionado: body.dataAdicionado || new Date().toISOString().split("T")[0],
      urlImagem: body.urlImagem || null,
      genero: body.genero || null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar filme/série:", error);
    return NextResponse.json({ error: "Falha ao criar filme/série" }, { status: 500 });
  }
}

// PUT /api/filmes-series
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateFilmeSerie(Number(id), body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar filme/série:", error);
    return NextResponse.json({ error: "Falha ao atualizar filme/série" }, { status: 500 });
  }
}

// DELETE /api/filmes-series
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const result = await deleteFilmeSerie(Number(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao excluir filme/série:", error);
    return NextResponse.json({ error: "Falha ao excluir filme/série" }, { status: 500 });
  }
}
