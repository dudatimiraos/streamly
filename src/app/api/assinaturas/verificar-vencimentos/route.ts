import { NextResponse } from "next/server";
import { verificarAssinaturasVencidas } from "@/db/queries/assinaturas";

export async function GET() {
  try {
    const resultado = await verificarAssinaturasVencidas();

    return NextResponse.json({
      success: true,
      message: `${resultado.atualizadas} assinaturas atualizadas com status de pagamento para false.`,
      data: resultado,
    });
  } catch (error) {
    console.error("Erro ao verificar assinaturas vencidas:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar assinaturas vencidas",
      },
      { status: 500 }
    );
  }
}
