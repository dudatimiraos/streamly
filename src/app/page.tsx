import Link from "next/link";
import { FaFilm, FaBookmark, FaCreditCard, FaChartBar } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="bg-primary rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Streamly</h1>
        <p className="text-xl mb-6">Seu sistema para gerenciar assinaturas de streaming e conteúdos assistidos</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/filmes-series"
            className="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Ver meus conteúdos
          </Link>
          <Link
            href="/assinaturas"
            className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
          >
            Gerenciar assinaturas
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
            href="/filmes-series?status=planejo_assistir"
            className="inline-block text-primary font-medium hover:underline"
          >
            Acessar agora →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <span className="p-2 bg-primary text-white rounded-full mr-2 w-8 h-8 flex items-center justify-center">
                1
              </span>
              <h3 className="font-medium">Cadastre suas assinaturas</h3>
            </div>
            <p className="text-gray-600 pl-10">
              Adicione todos os serviços de streaming que você utiliza, com valores e datas de vencimento.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="p-2 bg-primary text-white rounded-full mr-2 w-8 h-8 flex items-center justify-center">
                2
              </span>
              <h3 className="font-medium">Registre conteúdos</h3>
            </div>
            <p className="text-gray-600 pl-10">
              Adicione séries e filmes, marcando-os como assistidos, assistindo ou para assistir.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="p-2 bg-primary text-white rounded-full mr-2 w-8 h-8 flex items-center justify-center">
                3
              </span>
              <h3 className="font-medium">Acompanhe tudo</h3>
            </div>
            <p className="text-gray-600 pl-10">
              Visualize relatórios e receba alertas sobre vencimentos e novidades em seus serviços.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
