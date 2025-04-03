"use client";

import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

interface FilmeSerieFormProps {
  onSubmit: (data: FilmeSerieFormData) => void;
  onCancel: () => void;
  initialData?: FilmeSerieFormData;
  isEditing?: boolean;
  plataformas: { id: number; nome: string }[];
}

export interface FilmeSerieFormData {
  id?: number;
  titulo: string;
  tipo: "filme" | "serie";
  status: "assistido" | "assistindo" | "planejo_assistir";
  avaliacao?: number | null;
  comentario?: string;
  plataformaId?: number | null;
  temporadas?: number | null;
  dataAdicionado?: string;
  urlImagem?: string;
  genero?: string;
}

export default function FilmeSerieForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  plataformas = [],
}: FilmeSerieFormProps) {
  const [formData, setFormData] = useState<FilmeSerieFormData>({
    titulo: "",
    tipo: "filme",
    status: "planejo_assistir",
    avaliacao: null,
    comentario: "",
    plataformaId: null,
    temporadas: null,
    dataAdicionado: new Date().toISOString().split("T")[0],
    urlImagem: "",
    genero: "",
  });

  useEffect(() => {
    if (initialData) {
      // Formatar datas para o formato de input date
      const formattedDataAdicionado = initialData.dataAdicionado
        ? typeof initialData.dataAdicionado === "string"
          ? initialData.dataAdicionado.split("T")[0]
          : initialData.dataAdicionado
        : new Date().toISOString().split("T")[0];

      setFormData({
        ...initialData,
        dataAdicionado: formattedDataAdicionado,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === "avaliacao" || name === "temporadas" || name === "plataformaId") {
      const numericValue = value ? parseInt(value, 10) : null;
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="filme">Filme</option>
            <option value="serie">Série</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="assistido">Assistido</option>
            <option value="assistindo">Assistindo</option>
            <option value="planejo_assistir">Planejo Assistir</option>
          </select>
        </div>

        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
            Gênero
          </label>
          <input
            type="text"
            id="genero"
            name="genero"
            value={formData.genero || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Drama, Comédia, Ação, etc."
          />
        </div>

        <div>
          <label htmlFor="plataformaId" className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <select
            id="plataformaId"
            name="plataformaId"
            value={formData.plataformaId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione uma plataforma</option>
            {plataformas.map((plataforma) => (
              <option key={plataforma.id} value={plataforma.id}>
                {plataforma.nome}
              </option>
            ))}
          </select>
        </div>

        {formData.tipo === "serie" && (
          <div>
            <label htmlFor="temporadas" className="block text-sm font-medium text-gray-700 mb-1">
              Temporadas
            </label>
            <input
              type="number"
              id="temporadas"
              name="temporadas"
              value={formData.temporadas || ""}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        )}

        <div>
          <label htmlFor="avaliacao" className="block text-sm font-medium text-gray-700 mb-1">
            Avaliação (1-5)
          </label>
          <select
            id="avaliacao"
            name="avaliacao"
            value={formData.avaliacao || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione...</option>
            <option value="1">1 - Péssimo</option>
            <option value="2">2 - Ruim</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bom</option>
            <option value="5">5 - Excelente</option>
          </select>
        </div>

        <div>
          <label htmlFor="urlImagem" className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem (Poster)
          </label>
          <input
            type="url"
            id="urlImagem"
            name="urlImagem"
            value={formData.urlImagem || ""}
            onChange={handleChange}
            placeholder="https://exemplo.com/poster.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="dataAdicionado" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Adição
          </label>
          <input
            type="date"
            id="dataAdicionado"
            name="dataAdicionado"
            value={formData.dataAdicionado || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
          Comentários
        </label>
        <textarea
          id="comentario"
          name="comentario"
          value={formData.comentario || ""}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="O que você achou deste título?"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center cursor-pointer"
        >
          <FaTimes className="mr-2" /> Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md bg-[#442b9e] hover:bg-[#442b9e]/80 flex items-center cursor-pointer"
        >
          <FaSave className="mr-2" /> {isEditing ? "Atualizar" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
