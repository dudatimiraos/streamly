"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaFilm, FaBookmark, FaCreditCard, FaChartBar, FaChevronLeft, FaChevronRight, FaTv } from "react-icons/fa";

// Lista de filmes e séries populares com imagens do TMDB
const conteudosPopulares = [
  {
    id: 1,
    tipo: "filme",
    titulo: "Interestelar",
    imagem: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    id: 2,
    tipo: "filme",
    titulo: "A Origem",
    imagem: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 3,
    tipo: "serie",
    titulo: "Grey's Anatomy",
    imagem: "https://media.themoviedb.org/t/p/w220_and_h330_face/Als9Xo4MoZxJeMenHtNLOoBzqwT.jpg",
  },
  {
    id: 4,
    tipo: "filme",
    titulo: "O Poderoso Chefão",
    imagem: "https://image.tmdb.org/t/p/w500/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg",
  },
  {
    id: 5,
    tipo: "filme",
    titulo: "Vingadores: Ultimato",
    imagem: "https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg",
  },
  {
    id: 6,
    tipo: "filme",
    titulo: "Batman: O Cavaleiro das Trevas",
    imagem: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg",
  },
  {
    id: 7,
    tipo: "serie",
    titulo: "Breaking Bad",
    imagem: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  },
  {
    id: 8,
    tipo: "serie",
    titulo: "Game of Thrones",
    imagem: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
  },
  {
    id: 9,
    tipo: "serie",
    titulo: "Stranger Things",
    imagem: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
  },
  {
    id: 10,
    tipo: "filme",
    titulo: "Wicked",
    imagem: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/qcaKkLwIXCAxJtpetVYHniCvLZj.jpg",
  },
  {
    id: 11,
    tipo: "serie",
    titulo: "Friends",
    imagem: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
  },
  {
    id: 12,
    tipo: "serie",
    titulo: "The Mandalorian",
    imagem: "https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
  },
];

export default function HomePage() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const itemsPerPage = 6; // Número estimado de itens visíveis por vez
  const totalPages = Math.ceil(conteudosPopulares.length / itemsPerPage);
  const autoplayInterval = 3000; // Intervalo de rotação automática em ms (5 segundos)

  // Função para avançar para a próxima página
  const scrollToNext = () => {
    if (carrosselRef.current) {
      const containerWidth = carrosselRef.current.clientWidth;
      const maxScrollPosition = carrosselRef.current.scrollWidth - containerWidth;

      // Se estiver na última página, voltar para o início
      if (currentPage >= totalPages - 1) {
        carrosselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
        setCurrentPage(0);
      } else {
        // Senão, avança para a próxima página
        const newPosition = Math.min(scrollPosition + containerWidth, maxScrollPosition);
        carrosselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
        setScrollPosition(newPosition);
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const scrollToLeft = () => {
    if (carrosselRef.current) {
      const containerWidth = carrosselRef.current.clientWidth;
      const newPosition = Math.max(scrollPosition - containerWidth, 0);
      carrosselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);

      // Atualizar a página atual
      const newPage = Math.max(currentPage - 1, 0);
      setCurrentPage(newPage);

      // Pausar a reprodução automática temporariamente
      pauseAutoplay();
    }
  };

  const scrollToRight = () => {
    if (carrosselRef.current) {
      scrollToNext();

      // Pausar a reprodução automática temporariamente
      pauseAutoplay();
    }
  };

  // Pausar a reprodução automática temporariamente quando o usuário interagir
  const pauseAutoplay = () => {
    setAutoplay(false);

    // Retomar a reprodução automática após 10 segundos de inatividade
    setTimeout(() => setAutoplay(true), 10000);
  };

  // Avançar para uma página específica
  const scrollToPage = (pageIndex: number) => {
    if (carrosselRef.current) {
      const containerWidth = carrosselRef.current.clientWidth;
      const newPosition = containerWidth * pageIndex;
      carrosselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
      setCurrentPage(pageIndex);

      // Pausar a reprodução automática temporariamente
      pauseAutoplay();
    }
  };

  // Rotação automática do carrossel
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (autoplay) {
      timer = setInterval(() => {
        scrollToNext();
      }, autoplayInterval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay, currentPage, scrollPosition]);

  // Detectar mudanças no scroll
  useEffect(() => {
    const handleScroll = () => {
      if (carrosselRef.current) {
        const newPosition = carrosselRef.current.scrollLeft;
        setScrollPosition(newPosition);

        // Calcular a página atual com base na posição do scroll
        const containerWidth = carrosselRef.current.clientWidth;
        if (containerWidth > 0) {
          const newPage = Math.round(newPosition / containerWidth);
          setCurrentPage(newPage);
        }
      }
    };

    const currentRef = carrosselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Pausar a reprodução automática quando o cursor estiver sobre o carrossel
  const handleMouseEnter = () => {
    setAutoplay(false);
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="bg-gray-950 rounded-lg py-8 shadow-md text-center flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <h1 className="text-5xl font-bold mb-4 h-fit bg-gradient-to-r from-[#9422a8] via-[#962ffc] to-[#1a3075] text-transparent bg-clip-text">
            Bem-vindo ao Streamly!
          </h1>
          <p className="text-xl mb-6 text-white font-bold">
            Seu sistema para gerenciar assinaturas de streaming e conteúdos assistidos.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/filmes-series"
              className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-[#442b9e]/80 hover:text-white transition-colors"
            >
              Ver meus conteúdos
            </Link>
            <Link
              href="/assinaturas"
              className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-[#442b9e]/80 hover:text-white transition-colors"
            >
              Gerenciar assinaturas
            </Link>
          </div>
        </div>

        {/* Carrossel de filmes e séries populares */}
        <div className="relative w-full my-20 px-1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="flex items-center mb-6 text-center">
            <h2 className="text-2xl font-bold text-center text-white">Conteúdos Populares</h2>
          </div>

          {/* Conteúdo do carrossel */}
          <div
            ref={carrosselRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 py-4 px-2 pb-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {conteudosPopulares.map((item) => (
              <div key={item.id} className="flex-shrink-0 relative group" style={{ scrollSnapAlign: "start" }}>
                <div className="w-48 h-72 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative w-full h-full">
                    {/* Fallback para imagens que não carregam */}
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      {item.tipo === "filme" ? (
                        <FaFilm className="text-gray-400 text-4xl" />
                      ) : (
                        <FaTv className="text-gray-400 text-4xl" />
                      )}
                    </div>

                    {/* Imagem do filme/série */}
                    <div className="absolute inset-0 group-hover:ring-2 ring-violet-500 rounded-lg transition-all">
                      <img
                        src={item.imagem}
                        alt={item.titulo}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    {/* Overlay com título e tipo */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold text-sm line-clamp-2">{item.titulo}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor:
                              item.tipo === "filme" ? "rgba(109, 40, 217, 0.8)" : "rgba(59, 130, 246, 0.8)",
                          }}
                        >
                          {item.tipo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de navegação (corrigidos) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToPage(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentPage === index ? "bg-violet-600 w-6" : "bg-gray-300 hover:bg-gray-400 w-2.5"
                  }`}
                  aria-label={`Ir para página ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-14">
          <div className="bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                <FaFilm size={24} />
              </div>
              <h2 className="text-xl font-semibold">Filmes e Séries</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Cadastre e organize seus filmes e séries favoritos. Marque o que já assistiu ou planeja assistir.
            </p>
            <Link href="/filmes-series" className="inline-block text-primary font-medium hover:underline">
              Acessar agora →
            </Link>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                <FaCreditCard size={24} />
              </div>
              <h2 className="text-xl font-semibold">Assinaturas</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie suas assinaturas de streaming, monitore custos e datas de vencimento.
            </p>
            <Link href="/assinaturas" className="inline-block text-primary font-medium hover:underline">
              Acessar agora →
            </Link>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-4">
                <FaBookmark size={24} />
              </div>
              <h2 className="text-xl font-semibold">Minha Lista</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Veja sua lista personalizada de conteúdos que você planeja assistir em breve.
            </p>
            <Link
              href="/filmes-series?filtro=planejo_assistir"
              className="inline-block text-primary font-medium hover:underline"
            >
              Acessar agora →
            </Link>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mr-4">
                <FaChartBar size={24} />
              </div>
              <h2 className="text-xl font-semibold">Dashboard</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Visualize estatísticas e relatórios sobre suas assinaturas e conteúdos assistidos.
            </p>
            <Link href="/dashboard" className="inline-block text-primary font-medium hover:underline">
              Acessar agora →
            </Link>
          </div>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-md text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-left">
              <div className="flex items-center mb-2">
                <span className="p-2 bg-primary rounded-full mr-2 w-8 h-8 flex items-center justify-center">1</span>
                <h3 className="font-medium">Cadastre suas assinaturas</h3>
              </div>
              <p className="text-gray-600 pl-10">
                Adicione todos os serviços de streaming que você utiliza, com valores e datas de vencimento.
              </p>
            </div>

            <div className="text-left">
              <div className="flex items-center mb-2">
                <span className="p-2 bg-primary rounded-full mr-2 w-8 h-8 flex items-center justify-center">2</span>
                <h3 className="font-medium">Registre conteúdos</h3>
              </div>
              <p className="text-gray-600 pl-10">
                Adicione séries e filmes, marcando-os como assistidos, assistindo ou para assistir.
              </p>
            </div>

            <div className="text-left">
              <div className="flex items-center mb-2">
                <span className="p-2 bg-primary rounded-full mr-2 w-8 h-8 flex items-center justify-center">3</span>
                <h3 className="font-medium">Acompanhe tudo</h3>
              </div>
              <p className="text-gray-600 pl-10">
                Visualize relatórios e receba alertas sobre vencimentos e novidades em seus serviços.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
