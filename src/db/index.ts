import { getConnection, closeConnection } from "@/lib/db-adapter";

// Exporta a conexão com o banco de dados usando o adaptador
export const db = getConnection();

// Re-exporta a função para fechar a conexão
export { closeConnection };
