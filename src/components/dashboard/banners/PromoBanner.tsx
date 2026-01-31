import { FC } from "react";

const PromoBanner: FC = () => {
  return (
    <section className="p-6 bg-blue-600 text-white rounded-lg m-6 flex justify-between items-center">
      <p>Assine nossa newsletter e ganhe descontos especiais</p>
      <button className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600">
        Ver Todas Promoções
      </button>
    </section>
  );
};

export default PromoBanner; 
