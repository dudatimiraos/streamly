"use client";

import { useState, useEffect } from "react";
import { initDatabase } from "@/utils/db-init";

interface DatabaseInitializerProps {
  onInitialized: () => void;
}

export default function DatabaseInitializer({ onInitialized }: DatabaseInitializerProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      setStatus("loading");
      setMessage("Inicializando o banco de dados...");

      try {
        const success = await initDatabase();

        if (success) {
          setStatus("success");
          setMessage("Banco de dados inicializado com sucesso!");

          // Notificar que o banco foi inicializado
          setTimeout(() => {
            onInitialized();
          }, 500);
        } else {
          setStatus("error");
          setMessage("Erro ao inicializar o banco de dados. Tente recarregar a página.");
        }
      } catch (error) {
        console.error("Erro ao inicializar banco:", error);
        setStatus("error");
        setMessage("Erro ao inicializar o banco de dados. Tente recarregar a página.");
      }
    };

    initialize();
  }, [onInitialized]);

  // Se já inicializou com sucesso, não mostrar nada
  if (status === "success") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {status === "loading" ? "Preparando o aplicativo" : status === "error" ? "Erro" : "Inicializando"}
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">{message}</p>
        </div>

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
