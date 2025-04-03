"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaRegClock, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

type FilmeSerieCardProps = {
  id: number;
  titulo: string;
  tipo: "filme" | "serie";
  status: "assistido" | "assistindo" | "planejo_assistir";
  avaliacao?: number;
  urlImagem?: string;
  genero?: string;
  plataformaNome?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function FilmeSerieCard({
  id,
  titulo,
  tipo,
  status,
  avaliacao,
  urlImagem,
  genero,
  plataformaNome,
  onEdit,
  onDelete,
}: FilmeSerieCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "assistido":
        return <FaEye className="text-green-500" />;
      case "assistindo":
        return <FaEye className="text-blue-500" />;
      case "planejo_assistir":
        return <FaRegClock className="text-yellow-500" />;
      default:
        return <FaEyeSlash className="text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "assistido":
        return "Assistido";
      case "assistindo":
        return "Assistindo";
      case "planejo_assistir":
        return "Planejo Assistir";
      default:
        return "Desconhecido";
    }
  };

  const renderStars = () => {
    if (!avaliacao) return null;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= avaliacao) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-200">
        {urlImagem ? (
          <Image
            src={urlImagem}
            alt={titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-300">
            <span className="text-gray-500">{tipo === "filme" ? "Filme" : "Série"}</span>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              tipo === "filme" ? "bg-purple-600 text-white" : "bg-teal-600 text-white"
            }`}
          >
            {tipo === "filme" ? "Filme" : "Série"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate" title={titulo}>
          {titulo}
        </h3>

        {genero && (
          <p className="text-xs text-gray-600 mb-2 truncate" title={genero}>
            {genero}
          </p>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm">
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </div>

          {avaliacao && <div className="flex">{renderStars()}</div>}
        </div>

        {plataformaNome && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs py-1 px-2 bg-gray-100 rounded-full">{plataformaNome}</span>

            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(id)}
                className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Editar"
              >
                <FaEdit size={14} />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                title="Excluir"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
