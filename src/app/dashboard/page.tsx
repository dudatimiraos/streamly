"use client";

import { useState, useEffect } from "react";
import {
  FaFilm,
  FaTv,
  FaEye,
  FaCheck,
  FaClock,
  FaMoneyBillWave,
  FaChartPie,
  FaChartBar,
  FaCalendarAlt,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import AssinaturaCard from "@/components/AssinaturaCard";
import FilmeSerieCard from "@/components/FilmeSerieCard";
import Modal from "@/components/Modal";
import { getDashboardEstatisticas, DashboardEstatisticas } from "@/services/dashboard";
import { initDatabase } from "@/utils/db-init";

// Registrando os componentes necessários para os gráficos
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function DashboardPage() {
  const [estatisticas, setEstatisticas] = useState<DashboardEstatisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Buscar dados reais do banco de dados
  useEffect(() => {
    async function carregarDados() {
      setIsLoading(true);
      try {
        // Inicializar banco de dados e obter estatísticas
        await initDatabase();
        const dados = await getDashboardEstatisticas();
        setEstatisticas(dados);
      } catch (error) {
        console.error("Erro ao carregar dados para o dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Dados para o gráfico de distribuição de tipo
  const dadosGraficoTipo = {
    labels: ["Filmes", "Séries"],
    datasets: [
      {
        label: "Quantidade",
        data: estatisticas ? [estatisticas.totalFilmes, estatisticas.totalSeries] : [],
        backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(153, 102, 255, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de distribuição de status
  const dadosGraficoStatus = {
    labels: ["Assistido", "Assistindo", "Planejo Assistir"],
    datasets: [
      {
        label: "Quantidade",
        data: estatisticas
          ? [estatisticas.totalAssistidos, estatisticas.totalAssistindo, estatisticas.totalPlanejaAssistir]
          : [],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de custo de assinaturas por categoria
  const dadosGraficoCusto = {
    labels: ["Streaming", "Música", "Jogos", "Outros"],
    datasets: [
      {
        label: "Custo Mensal (R$)",
        data: estatisticas
          ? [
              estatisticas.custoAssinaturas.streaming,
              estatisticas.custoAssinaturas.musica,
              estatisticas.custoAssinaturas.jogos,
              estatisticas.custoAssinaturas.outros,
            ]
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  // Dados para o gráfico de conteúdo por plataforma
  const dadosGraficoPlataforma = {
    labels: estatisticas ? Object.keys(estatisticas.conteudoPorPlataforma) : [],
    datasets: [
      {
        label: "Quantidade de Conteúdo",
        data: estatisticas ? Object.values(estatisticas.conteudoPorPlataforma) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de tendência de gastos
  const dadosGraficoTendencia = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
    datasets: [
      {
        label: "Gastos mensais (R$)",
        data: estatisticas ? estatisticas.tendenciaGastos : [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Opções para o gráfico de barras
  const opcoesGraficoBarras = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Distribuição de Conteúdo",
      },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Visualize estatísticas sobre suas assinaturas e conteúdos</p>
        </div>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FaQuestionCircle />
          <span>Ajuda</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <FaFilm />
                </div>
                <h3 className="font-medium">Total de Filmes</h3>
              </div>
              <p className="text-2xl font-bold">{estatisticas?.totalFilmes}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaTv />
                </div>
                <h3 className="font-medium">Total de Séries</h3>
              </div>
              <p className="text-2xl font-bold">{estatisticas?.totalSeries}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <FaMoneyBillWave />
                </div>
                <h3 className="font-medium">Custo Mensal</h3>
              </div>
              <p className="text-2xl font-bold">
                {estatisticas?.custoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FaChartPie />
                </div>
                <h3 className="font-medium">Assinaturas</h3>
              </div>
              <p className="text-2xl font-bold">{estatisticas?.totalAssinaturas}</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Filmes vs. Séries</h3>
              <div className="h-64">
                <Pie data={dadosGraficoTipo} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Status de Visualização</h3>
              <div className="h-64">
                <Pie data={dadosGraficoStatus} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Custo por Categoria</h3>
              <div className="h-64">
                <Bar data={dadosGraficoCusto} options={opcoesGraficoBarras} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Conteúdo por Plataforma</h3>
              <div className="h-64">
                <Bar data={dadosGraficoPlataforma} options={opcoesGraficoBarras} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-medium mb-4">Tendência de Gastos (Últimos 6 meses)</h3>
            <div className="h-64">
              <Line data={dadosGraficoTendencia} />
            </div>
          </div>

          {/* Assinaturas principais */}
          {estatisticas?.principaisAssinaturas && estatisticas.principaisAssinaturas.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-medium mb-4">Principais Assinaturas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {estatisticas.principaisAssinaturas.map((assinatura) => (
                  <AssinaturaCard
                    key={assinatura.id}
                    id={assinatura.id}
                    nome={assinatura.nome}
                    custoMensal={assinatura.custoMensal}
                    dataVencimento={assinatura.dataVencimento}
                    categoria={assinatura.categoria}
                    ativo={assinatura.ativo}
                    urlLogo={assinatura.urlLogo}
                    onEdit={(id) => console.log(`Editar assinatura ${id}`)}
                    onDelete={(id) => console.log(`Excluir assinatura ${id}`)}
                    onConfirmPayment={(id) => console.log(`Confirmar pagamento da assinatura ${id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filmes e séries recentes */}
          {estatisticas?.ultimosFilmesSeries && estatisticas.ultimosFilmesSeries.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Conteúdos Recentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {estatisticas.ultimosFilmesSeries.map((item) => (
                  <FilmeSerieCard
                    key={item.id}
                    id={item.id}
                    titulo={item.titulo}
                    tipo={item.tipo}
                    status={item.status}
                    avaliacao={item.avaliacao}
                    urlImagem={item.urlImagem}
                    genero={item.genero}
                    plataformaNome={item.plataformaNome}
                    onEdit={(id) => console.log(`Editar conteúdo ${id}`)}
                    onDelete={(id) => console.log(`Excluir conteúdo ${id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Ajuda */}
      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title="Ajuda do Dashboard" size="md">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-lg">Visão Geral</h4>
            <p className="text-gray-700">
              O dashboard exibe estatísticas e informações importantes sobre suas assinaturas e conteúdos cadastrados.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-lg">Cards de Estatísticas</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>Total de Filmes/Séries:</strong> Mostra a quantidade de cada tipo de conteúdo no seu catálogo.
              </li>
              <li>
                <strong>Custo Mensal:</strong> Exibe o valor total gasto mensalmente com todas as assinaturas ativas.
              </li>
              <li>
                <strong>Assinaturas:</strong> Apresenta o número total de assinaturas ativas.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg">Gráficos</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>Filmes vs. Séries:</strong> Proporção entre filmes e séries no seu catálogo.
              </li>
              <li>
                <strong>Status de Visualização:</strong> Distribuição dos conteúdos por status (assistido, assistindo,
                planejo assistir).
              </li>
              <li>
                <strong>Custo por Categoria:</strong> Quanto você gasta em cada categoria de assinatura.
              </li>
              <li>
                <strong>Conteúdo por Plataforma:</strong> Distribuição de conteúdos por serviço de streaming.
              </li>
              <li>
                <strong>Tendência de Gastos:</strong> Evolução dos gastos com assinaturas nos últimos meses.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg">Conteúdos em Destaque</h4>
            <p className="text-gray-700">
              São mostradas suas assinaturas principais (pelo custo) e os conteúdos adicionados mais recentemente.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
