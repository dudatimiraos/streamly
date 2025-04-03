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
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AssinaturaCard from "@/components/AssinaturaCard";
import FilmeSerieCard from "@/components/FilmeSerieCard";
import Modal from "@/components/Modal";
import { getDashboardEstatisticas, DashboardEstatisticas } from "@/services/dashboard";
import { initDatabase } from "@/utils/db-init";

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

  // Dados para o gráfico de distribuição de tipo (pizza)
  const dadosGraficoTipo = [
    { name: "Filmes", value: estatisticas?.totalFilmes || 0, color: "#9966FF" },
    { name: "Séries", value: estatisticas?.totalSeries || 0, color: "#36A2EB" },
  ];

  // Dados para o gráfico de distribuição de status (pizza)
  const dadosGraficoStatus = [
    { name: "Assistido", value: estatisticas?.totalAssistidos || 0, color: "#4BC0C0" },
    { name: "Assistindo", value: estatisticas?.totalAssistindo || 0, color: "#36A2EB" },
    { name: "Planejo Assistir", value: estatisticas?.totalPlanejaAssistir || 0, color: "#FFCE56" },
  ];

  // Dados para o gráfico de custo de assinaturas por categoria (barras)
  const dadosGraficoCusto = [
    { name: "Streaming", valor: estatisticas?.custoAssinaturas.streaming || 0, color: "#FF6384" },
    { name: "Música", valor: estatisticas?.custoAssinaturas.musica || 0, color: "#4BC0C0" },
    { name: "Jogos", valor: estatisticas?.custoAssinaturas.jogos || 0, color: "#36A2EB" },
    { name: "Outros", valor: estatisticas?.custoAssinaturas.outros || 0, color: "#FF9F40" },
  ];

  // Dados para o gráfico de conteúdo por plataforma (barras)
  const dadosGraficoPlataforma = estatisticas
    ? Object.entries(estatisticas.conteudoPorPlataforma).map(([plataforma, quantidade]) => ({
        name: plataforma,
        quantidade: quantidade,
        color: "#36A2EB",
      }))
    : [];

  // Dados para o gráfico de tendência de gastos (linha)
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
  const dadosGraficoTendencia = estatisticas
    ? estatisticas.tendenciaGastos.map((valor, index) => ({
        name: meses[index],
        valor: valor,
      }))
    : [];

  // Cores para os gráficos de pizza
  const CORES_TIPO = ["#9966FF", "#36A2EB"];
  const CORES_STATUS = ["#4BC0C0", "#36A2EB", "#FFCE56"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-100">Visualize estatísticas sobre suas assinaturas e conteúdos</p>
        </div>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosGraficoTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosGraficoTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_TIPO[index % CORES_TIPO.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Quantidade"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Status de Visualização</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosGraficoStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosGraficoStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_STATUS[index % CORES_STATUS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Quantidade"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Custo por Categoria</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoCusto} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value: number) => [`R$${value.toFixed(2)}`, "Valor"]} />
                    <Legend />
                    <Bar dataKey="valor" name="Custo Mensal (R$)">
                      {dadosGraficoCusto.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Conteúdo por Plataforma</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoPlataforma} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#36A2EB" name="Quantidade de Conteúdo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
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
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
