"use client";

import React from "react";
import Modal from "./Modal";
import { FaExclamationTriangle, FaTrash, FaCheck, FaCreditCard } from "react-icons/fa";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "payment" | "confirm";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "confirm",
}: ConfirmationModalProps) {
  // Definir ícone com base no tipo
  const getIcon = () => {
    switch (type) {
      case "delete":
        return <FaTrash className="text-red-500" />;
      case "payment":
        return <FaCreditCard className="text-green-500" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  // Definir cor do botão de confirmação
  const getButtonColor = () => {
    switch (type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "payment":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      default:
        return "bg-primary hover:bg-blue-600 focus:ring-blue-500";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">{getIcon()}</div>
        <p className="text-center text-gray-700">{message}</p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${getButtonColor()}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
