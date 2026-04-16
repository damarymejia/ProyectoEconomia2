import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { PRODUCTS } from '../data/products';

const CATEGORIES = [
  { name: 'Electronicos' },
  { name: 'Ropa' },
  { name: 'Hogar' },
  { name: 'Deportes' }
];

/* NOTIFICACION FLOTANTE DE DESCUENTO */
function DiscountToast() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black font-bold text-sm"
            >
              X
            </button>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Oferta especial
            </p>
            <h2 className="text-xl font-bold mb-2 text-black">
              10% de descuento
            </h2>
            <p className="text-gray-600 mb-4 text-xs leading-relaxed">
              Usa este codigo en tu primera compra y ahorra en tus productos favoritos.
            </p>
            
            <div className="bg-gray-50 border-2 border-dashed border-black py-2 px-4 mb-4 text-center font-mono font-bold text-lg">
              DIGITAL10
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Copiar codigo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* HERO */
function Hero() {
  return (
    <section className="bg-black text-white py-20 text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Encuentra lo que necesitas
      </h1>
      <p className="text-gray-400 max-w-xl mx-auto">
        Compra productos de forma rapida, segura y con la mejor experiencia
      </p>
    </section>
  );
}

/* FEATURES */
function Features() {
  const data = [
    {
      title: 'Seguridad garantizada',
      desc: 'Tus pagos y datos estan protegidos en todo momento'
    },
    {
      title: 'Envios rapidos',
      desc: 'Recibe tus pedidos en tiempo record'
    },
    {
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
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-500 text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </section>
  );
}

/* CATEGORIES */
function Categories() {
  const navigate = useNavigate();

  const handleCategory = (categoryName) => {
    navigate(`/catalog?category=${categoryName}`);
  };

  return (
    <section className="bg-gray-100 text-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Categorias</h2>
          <p className="text-gray-400 mt-2">
            Explora facilmente lo que estas buscando
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((c) => (
            <motion.div
              key={c.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCategory(c.name)}
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

/* PRODUCT CARD */
function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition h-full flex flex-col">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition"
          />
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            <p className="text-lg font-bold">L. {product.price}</p>
          </div>
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition text-center">
            <span className="inline-block w-full bg-black text-white py-2 rounded-lg text-xs">
              Ver detalles
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* CONTACT */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Contactanos</h2>
          <p className="text-gray-500 mt-2">Estamos aqui para ayudarte</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2">
          <div className="p-8 border-r border-gray-100">
            <h3 className="text-xl font-semibold mb-6">Informacion de contacto</h3>
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-gray-400">Direccion</p>
                    <p className="font-medium">Tegucigalpa, Honduras</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Telefono</p>
                    <p className="font-medium">+504 9999-9999</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Correo</p>
                    <p className="font-medium">contacto@tienda.com</p>
                </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6">Envianos un mensaje</h3>
            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center">
                Mensaje enviado. Te responderemos pronto.
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aqui..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                >
                  Enviar mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* HOME */
export default function Home() {
  const featured = useMemo(() => PRODUCTS.slice(0, 8), []);

  return (
    <main className="bg-gray-50 relative min-h-screen">
      {/* Tarjeta de descuento flotante al lado derecho */}
      <DiscountToast />

      <Hero />
      <Features />
      <Categories />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}
