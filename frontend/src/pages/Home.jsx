import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Star
} from 'lucide-react';

import { PRODUCTS } from '../data/products';

const CATEGORIES = [
  { name: 'Electrónicos' },
  { name: 'Ropa' },
  { name: 'Hogar' },
  { name: 'Deportes' }
];

/* HERO */
function Hero() {
  return (
    <section className="bg-black text-white py-20 text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Encuentra lo que necesitas
      </h1>
      <p className="text-gray-400 max-w-xl mx-auto">
        Compra productos de forma rápida, segura y con la mejor experiencia
      </p>
    </section>
  );
}

/* FEATURES */
function Features() {
  const data = [
    {
      icon: <ShieldCheck size={30} />,
      title: 'Seguridad garantizada',
      desc: 'Tus pagos y datos están protegidos en todo momento'
    },
    {
      icon: <Truck size={30} />,
      title: 'Envíos rápidos',
      desc: 'Recibe tus pedidos en tiempo récord'
    },
    {
      icon: <Sparkles size={30} />,
      title: 'Entregas gratis',
      desc: 'Por tus compras mayores a L.2,000'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6">
      {data.map((f, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-md border text-center"
        >
          <div className="mb-4 flex justify-center">{f.icon}</div>
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-500 text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </section>
  );
}


function Categories() {
  return (
    <section className="bg-gray-100 text-black py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Categorías</h2>
          <p className="text-gray-400 mt-2">
            Explora fácilmente lo que estás buscando
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {CATEGORIES.map((c) => (
            <motion.div
              key={c.name}
              whileHover={{ scale: 1.05 }}
              className="bg-white text-black rounded-2xl p-8 text-center shadow-lg cursor-pointer"
            >
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-2">Ver productos</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition">

        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-110 transition"
          />
        </div>

        <div className="p-4">
          <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>

          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-lg font-bold">L. {product.price}</p>

          <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* HOME */
export default function Home() {
  const featured = useMemo(() => PRODUCTS.slice(0, 8), []);

  return (
    <main className="bg-gray-50">

      <Hero />

      <Features />

      <Categories />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </main>
  );
}