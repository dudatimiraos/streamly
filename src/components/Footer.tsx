import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark py-6">
      <div className="container mx-auto px-4 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Streamly</h3>
            <p className="text-sm">Gerencie suas assinaturas e conteúdos preferidos em um só lugar</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm">&copy; {currentYear} Streamly. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
