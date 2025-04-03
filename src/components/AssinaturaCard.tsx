"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaCreditCard,
  FaEllipsisV,
} from "react-icons/fa";
import { format, isPast, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

type AssinaturaCardProps = {
  id: number;
  nome: string;
  custoMensal: number;
  dataVencimento: string;
  categoria: string;
  ativo: boolean;
  urlLogo?: string;
  pagamento?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onConfirmPayment?: (id: number) => void;
};

export default function AssinaturaCard({
  id,
  nome,
  custoMensal,
  dataVencimento,
  categoria,
  ativo,
  urlLogo,
  pagamento = false,
  onEdit,
  onDelete,
  onConfirmPayment,
}: AssinaturaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Formatar data de vencimento - Corrigindo problema de fuso horário
  // Abordagem 1: Garantir que a data seja tratada no horário local, não em UTC
  const partes = dataVencimento.split("-"); // Separa ano, mês e dia
  const dataFormatada = new Date(
    parseInt(partes[0]), // ano
    parseInt(partes[1]) - 1, // mês (0-11)
    parseInt(partes[2]) // dia
  );

  const dataVencimentoFormatada = format(dataFormatada, "dd 'de' MMMM", { locale: ptBR });

  // Data atual
  const hoje = new Date();

  // Verificar se está próximo do vencimento (7 dias)
  const dataLimite = addDays(hoje, 7);
  const isProximoVencimento = !isPast(dataFormatada) && isBefore(dataFormatada, dataLimite);

  // Verificar se está vencido
  const isVencido = isPast(dataFormatada);

  // Função para ajudar na formatação de valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Cores por categoria
  const getCategoriaColor = () => {
    switch (categoria) {
      case "streaming":
        return "bg-red-100 text-red-800";
      case "musica":
        return "bg-green-100 text-green-800";
      case "jogos":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para fechar menu ao clicar fora
  const handleClickOutside = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        !ativo ? "opacity-70" : ""
      }`}
      onClick={handleClickOutside}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center overflow-hidden mr-3">
              {urlLogo ? (
                <Image src={urlLogo} alt={nome} width={48} height={48} className="object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-500">{nome.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{nome}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoriaColor()}`}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </span>
            </div>
          </div>

          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Menu de ações"
            >
              <FaEllipsisV className="text-[#442b9e]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaEdit className="mr-2 text-[#442b9e]" /> Editar
                  </button>
                )}

                {onConfirmPayment && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirmPayment(id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaCreditCard className="mr-2 text-green-500" /> Confirmar Pagamento
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaTrash className="mr-2 text-red-500" /> Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-gray-700">
              <FaMoneyBillWave className="mr-2 text-green-600" />
              <span>{formatarMoeda(custoMensal)}/mês</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              <span>Vence em: {dataVencimentoFormatada}</span>
            </div>
          </div>

          {(isProximoVencimento || isVencido) && (
            <div
              className={`mt-3 flex items-center p-2 rounded-md ${
                isVencido ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <FaExclamationTriangle className="mr-2" />
              <span className="text-sm">{isVencido ? "Assinatura vencida!" : "Vencimento próximo!"}</span>
            </div>
          )}

          {/* Status de pagamento */}
          <div
            className={`mt-3 flex items-center p-2 rounded-md ${
              pagamento ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaCreditCard className="mr-2" />
            <span className="text-sm">{pagamento ? "Pagamento confirmado" : "Aguardando pagamento"}</span>
          </div>
        </div>

        {/* Botões rápidos - alternativa ao menu */}
        <div className="mt-3 flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="flex-1 bg-[#f5f5f5] py-1 rounded-md hover:bg-[#e0e0e0] transition-colors flex items-center justify-center cursor-pointer"
            >
              <FaEdit className="mr-1" /> Editar
            </button>
          )}

          {onConfirmPayment && !pagamento && (
            <button
              onClick={() => onConfirmPayment(id)}
              className="flex-1 bg-green-100 text-green-700 py-1 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center cursor-pointer"
              title="Confirmar pagamento"
            >
              <FaCreditCard className="mr-1" /> Confirmar Pagamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
