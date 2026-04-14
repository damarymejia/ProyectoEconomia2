import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

const CATEGORIES = ['Todos', 'Electronicos', 'Ropa', 'Hogar', 'Deportes'];

const SORTS = [
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
  { label: 'Nombre A-Z', value: 'name' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔍 estados sincronizados con URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'Todos');
  const [sort, setSort] = useState(searchParams.get('sort') || 'price_asc');

  // 🔄 sincronizar cuando cambia URL (por navbar)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'Todos');
  }, [searchParams]);

  // 🔄 actualizar URL cuando cambian filtros
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'Todos') params.category = category;
    if (sort) params.sort = sort;

    setSearchParams(params);
  }, [search, category, sort, setSearchParams]);

  // 🧠 FILTRADO
  const products = useMemo(() => {
    let list = [...PRODUCTS];

    if (search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'Todos') {
      list = list.filter(p => p.category === category);
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, category, sort]);

  // 🤖 RECOMENDACIONES
  const recommendations = useMemo(() => {
    if (category === 'Todos') return [];
    return PRODUCTS
      .filter(p => p.category === category)
      .slice(0, 4);
  }, [category]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* 🔥 BANNER */}
      <div className="bg-black text-white rounded-2xl p-8 mb-10 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Explora nuestro catálogo
        </h1>
        <p className="text-sm text-gray-400">
          Encuentra productos filtrados según tus preferencias
        </p>
      </div>

      {/* 🎯 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Catálogo de productos
        </h2>

        <p className="text-sm text-gray-500">
          {products.length} resultados
        </p>
      </div>

      {/* 🔍 FILTROS */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">

        {/* búsqueda */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* categorías */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                category === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* orden */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border rounded-full px-3 py-2 text-sm"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

      </div>

      {/* 🛍️ PRODUCTOS */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No se encontraron productos
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition">

                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />

                  {/* tags */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.tags?.map(tag => (
                      <span
                        key={tag}
                        className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                    Popular
                  </span>
                </div>

                <div className="p-4">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-black font-semibold text-sm mt-1">
                    L. {product.price.toFixed(2)}
                  </p>

                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                    <button className="w-full bg-black text-white py-2 rounded-lg text-sm">
                      Ver detalles
                    </button>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 🤖 RECOMENDACIONES */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h3 className="text-xl font-bold mb-4">
            También puede interesarte
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map(product => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="bg-gray-100 rounded-xl aspect-square mb-2 overflow-hidden">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium">{product.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}