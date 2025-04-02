// Utilitário para inicialização do banco de dados

/**
 * Inicializa o banco de dados chamando a API de migração
 * Esta função deve ser chamada nos componentes que necessitam do banco
 * no carregamento da página, preferencialmente em um useEffect.
 */
export async function initDatabase(): Promise<boolean> {
  try {
    console.log("Inicializando banco de dados...");

    // Verificar se já inicializou anteriormente (usando sessionStorage)
    if (typeof window !== "undefined") {
      const dbInitialized = sessionStorage.getItem("db_initialized");
      if (dbInitialized === "true") {
        console.log("Banco de dados já foi inicializado nesta sessão.");
        return true;
      }
    }

    // Fazer a chamada para a API de migração com timeout de 10 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    try {
      // Fazer a chamada para a API de migração
      const response = await fetch("/api/db-migrate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ao inicializar banco de dados (${response.status}):`, errorText);
        return false;
      }

      const result = await response.json();
      console.log("Banco de dados inicializado:", result);

      // Marcar como inicializado para não repetir em cada navegação
      if (typeof window !== "undefined") {
        sessionStorage.setItem("db_initialized", "true");
      }

      return result.success;
    } catch (fetchError) {
      clearTimeout(timeout);

      if (fetchError.name === "AbortError") {
        console.error("Timeout ao inicializar banco de dados. A operação demorou muito.");
      } else {
        console.error("Erro na requisição:", fetchError);
      }

      return false;
    }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    return false;
  }
}
