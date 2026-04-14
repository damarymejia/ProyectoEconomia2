import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { trackProductView, trackAddToCart } from '../utils/analytics';

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) trackProductView(product);
  }, [product]);

  if (!product) return <p className="p-10 text-gray-500">Producto no encontrado.</p>;

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addToCart(product, quantity);
    trackAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex gap-2 mb-4">
            {product.tags.map(tag => (
              <span key={tag} className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
          <p className="text-2xl font-semibold mb-4">L. {product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-sm text-green-600 mb-4">
            {product.stock > 0 ? `Disponible (${product.stock} en stock)` : 'Sin stock'}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Cantidad:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 text-sm">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold transition ${added ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          >
            {added ? 'Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="bg-gray-100 rounded-xl aspect-square mb-2 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-sm text-gray-600">L. {p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}