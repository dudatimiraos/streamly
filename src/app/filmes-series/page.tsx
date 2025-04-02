"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaSearch } from "react-icons/fa";
import FilmeSerieCard from "@/components/FilmeSerieCard";
import Modal from "@/components/Modal";
import FilmeSerieForm, { FilmeSerieFormData } from "@/components/FilmeSerieForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import Link from "next/link";
import { initDatabase } from "@/utils/db-init";
import {
  getAllFilmesSeries,
  createFilmeSerie,
  updateFilmeSerie,
  deleteFilmeSerie,
  searchFilmesSeries,
} from "@/services/filmes-series";
import { getAllAssinaturas } from "@/services/assinaturas";

interface FilmeSerie {
  id: number;
  titulo: string;
  tipo: "filme" | "serie";
  status: "assistido" | "assistindo" | "planejo_assistir";
  avaliacao?: number;
  urlImagem?: string;
  genero?: string;
  plataformaNome?: string;
  plataformaId?: number;
  comentario?: string;
  temporadas?: number;
  dataAdicionado: string;
}

interface Plataforma {
  id: number;
  nome: string;
}

export default function FilmesSeriesPage() {
  const [filmesSeries, setFilmesSeries] = useState<FilmeSerie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFilmeSerie, setSelectedFilmeSerie] = useState<FilmeSerie | null>(null);

  // Lista de plataformas disponíveis (carregado do banco)
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  // Carregar dados do banco
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      // Inicializar banco de dados
      await initDatabase();

      try {
        // Buscar filmes e séries
        const filmesSeriesData = await getAllFilmesSeries();
        setFilmesSeries(filmesSeriesData);

        // Buscar plataformas (assinaturas)
        const assinaturasData = await getAllAssinaturas();
        const plataformasData = assinaturasData.map((a) => ({
          id: a.id,
          nome: a.nome,
        }));
        setPlataformas(plataformasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Efeito para buscar quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.length > 2) {
      async function buscarConteudo() {
        try {
          const resultado = await searchFilmesSeries(searchTerm);
          setFilmesSeries(resultado);
        } catch (error) {
          console.error("Erro ao buscar conteúdo:", error);
        }
      }

      const timer = setTimeout(() => {
        buscarConteudo();
      }, 500);

      return () => clearTimeout(timer);
    } else if (searchTerm === "" && !isLoading) {
      // Se o termo de busca for limpo, recarregar todos os itens
      getAllFilmesSeries().then(setFilmesSeries);
    }
  }, [searchTerm, isLoading]);

  // Função para filtrar os filmes e séries
  const filmesSerieFiltrados = filmesSeries.filter((item) => {
    // Filtro por status
    if (filtroStatus !== "todos" && item.status !== filtroStatus) {
      return false;
    }

    // Filtro por tipo
    if (filtroTipo !== "todos" && item.tipo !== filtroTipo) {
      return false;
    }

    return true;
  });

  // Funções para manipulação de filmes/séries
  const handleCreateFilmeSerie = async (data: FilmeSerieFormData) => {
    try {
      const result = await createFilmeSerie({
        ...data,
        dataAdicionado: data.dataAdicionado || new Date().toISOString().split("T")[0],
      });

      if (result) {
        // Recarregar lista de filmes e séries
        const filmesSeriesData = await getAllFilmesSeries();
        setFilmesSeries(filmesSeriesData);
      }
    } catch (error) {
      console.error("Erro ao criar filme/série:", error);
    }

    setIsCreateModalOpen(false);
  };

  const handleEditFilmeSerie = async (data: FilmeSerieFormData) => {
    if (!selectedFilmeSerie) return;

    try {
      const result = await updateFilmeSerie(selectedFilmeSerie.id, data);

      if (result) {
        // Recarregar lista de filmes e séries
        const filmesSeriesData = await getAllFilmesSeries();
        setFilmesSeries(filmesSeriesData);
      }
    } catch (error) {
      console.error("Erro ao atualizar filme/série:", error);
    }

    setIsEditModalOpen(false);
    setSelectedFilmeSerie(null);
  };

  const handleDeleteFilmeSerie = async () => {
    if (!selectedFilmeSerie) return;

    try {
      const result = await deleteFilmeSerie(selectedFilmeSerie.id);

      if (result) {
        // Recarregar lista de filmes e séries
        const filmesSeriesData = await getAllFilmesSeries();
        setFilmesSeries(filmesSeriesData);
      }
    } catch (error) {
      console.error("Erro ao excluir filme/série:", error);
    }

    setIsDeleteModalOpen(false);
    setSelectedFilmeSerie(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Filmes e Séries</h1>
          <p className="text-gray-600">Gerencie seus filmes e séries favoritos</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <FaPlus />
          <span>Novo Conteúdo</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Campo de busca */}
          <div className="relative flex-grow flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por status */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroStatus("todos")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroStatus === "todos" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroStatus("assistido")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroStatus === "assistido"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                Assistidos
              </button>
              <button
                onClick={() => setFiltroStatus("assistindo")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroStatus === "assistindo"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Assistindo
              </button>
              <button
                onClick={() => setFiltroStatus("planejo_assistir")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroStatus === "planejo_assistir"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                Planejo Assistir
              </button>
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Tipo:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroTipo("todos")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroTipo === "todos" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroTipo("filme")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroTipo === "filme"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                Filmes
              </button>
              <button
                onClick={() => setFiltroTipo("serie")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filtroTipo === "serie" ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-800 hover:bg-teal-200"
                }`}
              >
                Séries
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filmesSerieFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filmesSerieFiltrados.map((item) => (
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
              onEdit={(id) => {
                const filmeSerie = filmesSeries.find((f) => f.id === id);
                if (filmeSerie) {
                  setSelectedFilmeSerie(filmeSerie);
                  setIsEditModalOpen(true);
                }
              }}
              onDelete={(id) => {
                const filmeSerie = filmesSeries.find((f) => f.id === id);
                if (filmeSerie) {
                  setSelectedFilmeSerie(filmeSerie);
                  setIsDeleteModalOpen(true);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Nenhum conteúdo encontrado com os filtros selecionados.</p>
          <button
            onClick={() => {
              setFiltroStatus("todos");
              setFiltroTipo("todos");
              setSearchTerm("");
            }}
            className="text-primary hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Modal de Criação de Filme/Série */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Novo Conteúdo" size="lg">
        <FilmeSerieForm
          onSubmit={handleCreateFilmeSerie}
          onCancel={() => setIsCreateModalOpen(false)}
          plataformas={plataformas}
        />
      </Modal>

      {/* Modal de Edição de Filme/Série */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFilmeSerie(null);
        }}
        title="Editar Conteúdo"
        size="lg"
      >
        {selectedFilmeSerie && (
          <FilmeSerieForm
            initialData={selectedFilmeSerie}
            onSubmit={handleEditFilmeSerie}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedFilmeSerie(null);
            }}
            isEditing
            plataformas={plataformas}
          />
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFilmeSerie(null);
        }}
        onConfirm={handleDeleteFilmeSerie}
        title="Excluir Conteúdo"
        message={`Tem certeza que deseja excluir "${selectedFilmeSerie?.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="delete"
      />
    </div>
  );
}
