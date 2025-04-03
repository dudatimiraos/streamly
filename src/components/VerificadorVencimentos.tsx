"use client";

import { useEffect } from "react";
import { verificarAssinaturasVencidas } from "@/services/assinaturas";

export default function VerificadorVencimentos() {
  useEffect(() => {
    // Verificar se já verificou hoje
    const verificarSeNecessario = async () => {
      const ultimaVerificacao = localStorage.getItem("ultimaVerificacaoVencimentos");
      const hoje = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

      // Se ainda não verificou hoje, executar a verificação
      if (!ultimaVerificacao || ultimaVerificacao !== hoje) {
        try {
          console.log("Verificando assinaturas vencidas...");
          const resultado = await verificarAssinaturasVencidas();

          if (resultado && resultado.atualizadas > 0) {
            console.log(`${resultado.atualizadas} assinaturas atualizadas para pagamento = false`);
          }

          // Registrar que verificou hoje
          localStorage.setItem("ultimaVerificacaoVencimentos", hoje);
        } catch (error) {
          console.error("Erro ao verificar vencimentos:", error);
        }
      }
    };

    // Verificar imediatamente ao montar o componente
    verificarSeNecessario();

    // Configurar um intervalo para verificar a cada hora
    // (isso garante que a verificação aconteça mesmo se o usuário deixar a página aberta por muito tempo)
    const intervalo = setInterval(verificarSeNecessario, 60 * 60 * 1000); // 1 hora em milissegundos

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalo);
  }, []);

  // Este componente não renderiza nada visualmente
  return null;
}
