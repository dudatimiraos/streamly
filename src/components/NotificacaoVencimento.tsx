"use client";

import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Assinatura {
  id: number;
  nome: string;
  dataVencimento: string;
  custoMensal: number;
}

interface NotificacaoVencimentoProps {
  assinaturas: Assinatura[];
  onConfirmPayment?: (id: number) => void;
}

export default function NotificacaoVencimento({ assinaturas, onConfirmPayment }: NotificacaoVencimentoProps) {
  const [visivel, setVisivel] = useState(true);
  const [animacaoSaida, setAnimacaoSaida] = useState(false);

  useEffect(() => {
    // Se não houver assinaturas, não mostrar notificação
    if (assinaturas.length === 0) {
      setVisivel(false);
      return;
    }

    // Resetar estado quando mudam as assinaturas
    setVisivel(true);
    setAnimacaoSaida(false);
  }, [assinaturas]);

  const fecharNotificacao = () => {
    setAnimacaoSaida(true);

    // Aguardar a animação terminar antes de esconder
    setTimeout(() => {
      setVisivel(false);
    }, 300); // 300ms para a animação de saída
  };

  if (!visivel || assinaturas.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 p-4 z-50 
                  transition-all duration-300 transform 
                  ${animacaoSaida ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-yellow-600">
          <FaBell className="mr-2" />
          <h3 className="font-semibold">Assinaturas a vencer</h3>
        </div>
        <button
          onClick={fecharNotificacao}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Fechar notificação"
        >
          <FaTimes />
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {assinaturas.map((assinatura) => {
          // Corrigir problema de fuso horário
          const partes = assinatura.dataVencimento.split("-"); // Separa ano, mês e dia
          const dataObj = new Date(
            parseInt(partes[0]), // ano
            parseInt(partes[1]) - 1, // mês (0-11)
            parseInt(partes[2]) // dia
          );

          const dataFormatada = format(dataObj, "dd 'de' MMMM", {
            locale: ptBR,
          });

          return (
            <div key={assinatura.id} className="border-b border-gray-100 py-2 last:border-0">
              <p className="font-medium text-gray-800">{assinatura.nome}</p>
              <div className="flex justify-between items-center mt-1 text-sm">
                <span className="text-gray-600">Vence em: {dataFormatada}</span>
                <span className="font-medium text-green-600">
                  {assinatura.custoMensal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              {onConfirmPayment && (
                <button
                  onClick={() => onConfirmPayment(assinatura.id)}
                  className="mt-2 w-full py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                >
                  Confirmar Pagamento
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
