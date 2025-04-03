"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaMoneyBillWave } from "react-icons/fa";
import AssinaturaCard from "@/components/AssinaturaCard";
import Modal from "@/components/Modal";
import AssinaturaForm, { AssinaturaFormData } from "@/components/AssinaturaForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import NotificacaoVencimento from "@/components/NotificacaoVencimento";
import Link from "next/link";
import { initDatabase } from "@/utils/db-init";
import {
  getAllAssinaturas,
  createAssinatura,
  updateAssinatura,
  deleteAssinatura,
  getTotalCustoAssinaturas,
  confirmarPagamentoAssinatura,
  getAssinaturasProximasVencimento,
  verificarAssinaturasVencidas,
} from "@/services/assinaturas";

interface Assinatura {
  id: number;
  nome: string;
  custoMensal: number;
  dataVencimento: string;
  categoria: string;
  ativo: boolean;
  urlLogo?: string;
  observacoes?: string;
  dataContratacao: string;
  pagamento: boolean;
}

export default function AssinaturasPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [assinaturasAVencer, setAssinaturasAVencer] = useState<Assinatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [custoTotal, setCustoTotal] = useState<number>(0);

  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAssinatura, setSelectedAssinatura] = useState<Assinatura | null>(null);

  // Carregar dados do banco
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      // Inicializar banco de dados
      await initDatabase();

      try {
        // Verificar assinaturas vencidas e atualizar status de pagamento
        await verificarAssinaturasVencidas();

        // Buscar assinaturas
        const assinaturasData = await getAllAssinaturas();
        setAssinaturas(assinaturasData);

        // Calcular custo total
        const total = await getTotalCustoAssinaturas();
        setCustoTotal(total);

        // Verificar assinaturas próximas do vencimento (3 dias)
        const proximasVencimento = await getAssinaturasProximasVencimento(3);
        setAssinaturasAVencer(proximasVencimento);
      } catch (error) {
        console.error("Erro ao carregar assinaturas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Função para filtrar assinaturas por categoria
  const assinaturasFiltradas =
    filtroCategoria === "todas" ? assinaturas : assinaturas.filter((a) => a.categoria === filtroCategoria);

  // Funções para manipulação de assinaturas
  const handleCreateAssinatura = async (data: AssinaturaFormData) => {
    try {
      // Converter custoMensal para número
      const assinaturaData = {
        ...data,
        custoMensal: typeof data.custoMensal === "string" ? parseFloat(data.custoMensal) : data.custoMensal,
        dataContratacao: data.dataContratacao || new Date().toISOString().split("T")[0],
        pagamento: false, // Inicialmente, o pagamento não está confirmado
      };

      const result = await createAssinatura(assinaturaData);

      if (result) {
        // Recarregar lista de assinaturas
        const assinaturasData = await getAllAssinaturas();
        setAssinaturas(assinaturasData);

        // Atualizar custo total
        const total = await getTotalCustoAssinaturas();
        setCustoTotal(total);

        // Verificar assinaturas próximas do vencimento
        const proximasVencimento = await getAssinaturasProximasVencimento(3);
        setAssinaturasAVencer(proximasVencimento);
      }
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
    }

    setIsCreateModalOpen(false);
  };

  const handleEditAssinatura = async (data: AssinaturaFormData) => {
    if (!selectedAssinatura) return;

    try {
      const assinaturaData = {
        ...data,
        custoMensal: typeof data.custoMensal === "string" ? parseFloat(data.custoMensal) : data.custoMensal,
      };

      const result = await updateAssinatura(selectedAssinatura.id, assinaturaData);

      if (result) {
        // Recarregar lista de assinaturas
        const assinaturasData = await getAllAssinaturas();
        setAssinaturas(assinaturasData);

        // Atualizar custo total
        const total = await getTotalCustoAssinaturas();
        setCustoTotal(total);

        // Verificar assinaturas próximas do vencimento
        const proximasVencimento = await getAssinaturasProximasVencimento(3);
        setAssinaturasAVencer(proximasVencimento);
      }
    } catch (error) {
      console.error("Erro ao atualizar assinatura:", error);
    }

    setIsEditModalOpen(false);
    setSelectedAssinatura(null);
  };

  const handleDeleteAssinatura = async () => {
    if (!selectedAssinatura) return;

    try {
      const result = await deleteAssinatura(selectedAssinatura.id);

      if (result) {
        // Recarregar lista de assinaturas
        const assinaturasData = await getAllAssinaturas();
        setAssinaturas(assinaturasData);

        // Atualizar custo total
        const total = await getTotalCustoAssinaturas();
        setCustoTotal(total);

        // Verificar assinaturas próximas do vencimento
        const proximasVencimento = await getAssinaturasProximasVencimento(3);
        setAssinaturasAVencer(proximasVencimento);
      }
    } catch (error) {
      console.error("Erro ao excluir assinatura:", error);
    }

    setIsDeleteModalOpen(false);
    setSelectedAssinatura(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedAssinatura) return;

    try {
      const result = await confirmarPagamentoAssinatura(selectedAssinatura.id);

      if (result) {
        // Recarregar lista de assinaturas
        const assinaturasData = await getAllAssinaturas();
        setAssinaturas(assinaturasData);

        // Verificar assinaturas próximas do vencimento
        const proximasVencimento = await getAssinaturasProximasVencimento(3);
        setAssinaturasAVencer(proximasVencimento);
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
    }

    setIsPaymentModalOpen(false);
    setSelectedAssinatura(null);
  };

  // Handlers para assinaturas
  const handleOpenEditModal = (id: number) => {
    const assinatura = assinaturas.find((a) => a.id === id);
    if (assinatura) {
      setSelectedAssinatura(assinatura);
      setIsEditModalOpen(true);
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    const assinatura = assinaturas.find((a) => a.id === id);
    if (assinatura) {
      setSelectedAssinatura(assinatura);
      setIsDeleteModalOpen(true);
    }
  };

  const handleOpenPaymentModal = (id: number) => {
    const assinatura = assinaturas.find((a) => a.id === id);
    if (assinatura) {
      setSelectedAssinatura(assinatura);
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Notificação de assinaturas a vencer */}
      {assinaturasAVencer.length > 0 && (
        <NotificacaoVencimento assinaturas={assinaturasAVencer} onConfirmPayment={handleOpenPaymentModal} />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <h1 className="text-2xl font-bold">Minhas Assinaturas</h1>
          <p className="text-gray-100">Gerencie suas assinaturas de serviços de streaming e outros</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md bg-[#442b9e] hover:bg-[#442b9e]/80 transition-colors cursor-pointer"
          >
            <FaPlus />
            <span>Nova Assinatura</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between">
        <div>
          <div className="flex items-center mb-2">
            <FaFilter className="text-gray-500 mr-2" />
            <span className="font-medium">Filtrar por categoria:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroCategoria("todas")}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === "todas" ? "bg-primary " : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroCategoria("streaming")}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === "streaming" ? "bg-red-600 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              Streaming
            </button>
            <button
              onClick={() => setFiltroCategoria("musica")}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === "musica"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Música
            </button>
            <button
              onClick={() => setFiltroCategoria("jogos")}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === "jogos" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Jogos
            </button>
            <button
              onClick={() => setFiltroCategoria("outros")}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === "outros" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Outros
            </button>
          </div>
        </div>
        <div className="flex items-center bg-white p-2 text-gray-700 text-xl">
          <FaMoneyBillWave className="text-green-600 mr-2" />
          <span className="font-medium">Total mensal: </span>
          <span className="ml-1">{custoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : assinaturasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assinaturasFiltradas.map((assinatura) => (
            <AssinaturaCard
              key={assinatura.id}
              id={assinatura.id}
              nome={assinatura.nome}
              custoMensal={assinatura.custoMensal}
              dataVencimento={assinatura.dataVencimento}
              categoria={assinatura.categoria}
              ativo={assinatura.ativo}
              urlLogo={assinatura.urlLogo}
              pagamento={assinatura.pagamento}
              onEdit={(id) => {
                const assinaturaToEdit = assinaturas.find((a) => a.id === id);
                if (assinaturaToEdit) {
                  setSelectedAssinatura(assinaturaToEdit);
                  setIsEditModalOpen(true);
                }
              }}
              onDelete={(id) => {
                const assinaturaToDelete = assinaturas.find((a) => a.id === id);
                if (assinaturaToDelete) {
                  setSelectedAssinatura(assinaturaToDelete);
                  setIsDeleteModalOpen(true);
                }
              }}
              onConfirmPayment={(id) => {
                const assinaturaToPayment = assinaturas.find((a) => a.id === id);
                if (assinaturaToPayment) {
                  setSelectedAssinatura(assinaturaToPayment);
                  setIsPaymentModalOpen(true);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Nenhuma assinatura encontrada com os filtros selecionados.</p>
          {filtroCategoria !== "todas" && (
            <button onClick={() => setFiltroCategoria("todas")} className="text-primary hover:underline">
              Mostrar todas as assinaturas
            </button>
          )}
        </div>
      )}

      {/* Modal de Criação de Assinatura */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Assinatura">
        <AssinaturaForm onSubmit={handleCreateAssinatura} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Modal de Edição de Assinatura */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAssinatura(null);
        }}
        title="Editar Assinatura"
      >
        {selectedAssinatura && (
          <AssinaturaForm
            initialData={selectedAssinatura}
            onSubmit={handleEditAssinatura}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAssinatura(null);
            }}
            isEditing
          />
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAssinatura(null);
        }}
        onConfirm={handleDeleteAssinatura}
        title="Excluir Assinatura"
        message={`Tem certeza que deseja excluir a assinatura "${selectedAssinatura?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="delete"
      />

      {/* Modal de Confirmação de Pagamento */}
      <ConfirmationModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedAssinatura(null);
        }}
        onConfirm={handleConfirmPayment}
        title="Confirmar Pagamento"
        message={`Confirmar pagamento de ${selectedAssinatura?.custoMensal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} da assinatura "${selectedAssinatura?.nome}"? A data de vencimento será atualizada para o próximo mês.`}
        confirmText="Confirmar Pagamento"
        cancelText="Cancelar"
        type="payment"
      />
    </div>
  );
}
