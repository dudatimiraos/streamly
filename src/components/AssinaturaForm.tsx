"use client";

import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

interface AssinaturaFormProps {
  onSubmit: (data: AssinaturaFormData) => void;
  onCancel: () => void;
  initialData?: AssinaturaFormData;
  isEditing?: boolean;
}

export interface AssinaturaFormData {
  id?: number;
  nome: string;
  custoMensal: number | string;
  dataVencimento: string;
  categoria: string;
  ativo: boolean;
  observacoes?: string;
  urlLogo?: string;
  dataContratacao?: string;
  pagamento?: boolean;
}

export default function AssinaturaForm({ onSubmit, onCancel, initialData, isEditing = false }: AssinaturaFormProps) {
  const [formData, setFormData] = useState<AssinaturaFormData>({
    nome: "",
    custoMensal: "",
    dataVencimento: "",
    categoria: "streaming",
    ativo: true,
    observacoes: "",
    urlLogo: "",
    dataContratacao: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      // Formatação de data para o formato de input date
      const formattedDataVencimento =
        typeof initialData.dataVencimento === "string"
          ? initialData.dataVencimento.split("T")[0]
          : initialData.dataVencimento;

      const formattedDataContratacao = initialData.dataContratacao
        ? typeof initialData.dataContratacao === "string"
          ? initialData.dataContratacao.split("T")[0]
          : initialData.dataContratacao
        : new Date().toISOString().split("T")[0];

      setFormData({
        ...initialData,
        dataVencimento: formattedDataVencimento,
        dataContratacao: formattedDataContratacao,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === "custoMensal") {
      // Remover caracteres não numéricos e substituir vírgula por ponto
      const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
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

    // Converter custoMensal para número
    const formattedData = {
      ...formData,
      custoMensal:
        typeof formData.custoMensal === "string" ? parseFloat(formData.custoMensal) || 0 : formData.custoMensal,
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Serviço *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="custoMensal" className="block text-sm font-medium text-gray-700 mb-1">
            Custo Mensal (R$) *
          </label>
          <input
            type="text"
            id="custoMensal"
            name="custoMensal"
            value={formData.custoMensal}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="0,00"
            required
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="streaming">Streaming</option>
            <option value="musica">Música</option>
            <option value="jogos">Jogos</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento *
          </label>
          <input
            type="date"
            id="dataVencimento"
            name="dataVencimento"
            value={formData.dataVencimento}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="urlLogo" className="block text-sm font-medium text-gray-700 mb-1">
            URL do Logo (opcional)
          </label>
          <input
            type="url"
            id="urlLogo"
            name="urlLogo"
            value={formData.urlLogo || ""}
            onChange={handleChange}
            placeholder="https://exemplo.com/logo.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="dataContratacao" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Contratação
          </label>
          <input
            type="date"
            id="dataContratacao"
            name="dataContratacao"
            value={formData.dataContratacao || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações (opcional)
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="ativo"
          name="ativo"
          checked={formData.ativo}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
          Assinatura ativa
        </label>
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
