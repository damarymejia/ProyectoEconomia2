import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, tax, total } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

        <div className="text-center bg-white p-10 rounded-2xl shadow-md max-w-md w-full">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={40} />

          <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-6">
            Explora nuestro catálogo y encuentra productos increíbles
          </p>

          <Link
            to="/catalog"
            className="block bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            Ver productos
          </Link>
        </div>

      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* PRODUCTOS */}
        <div className="md:col-span-2 space-y-4">

          {cart.map(item => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-gray-500 text-sm">
                  L. {item.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>

                  <span className="text-sm w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>

                </div>
              </div>

              <div className="text-right flex flex-col justify-between">
                <p className="font-bold text-gray-900">
                  L. {(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* RESUMEN */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">

          <h2 className="text-lg font-bold mb-4">Resumen de compra</h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>L. {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Impuesto (15%)</span>
              <span>L. {tax.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>L. {total.toFixed(2)}</span>
            </div>

          </div>

          <Link
            to="/checkout"
            className="block mt-6 bg-black text-white text-center py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            Proceder al pago
          </Link>

          {/* BLOQUE DE CONFIANZA */}
          <div className="mt-6 space-y-3 text-xs text-gray-500">

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Pagos seguros protegidos
            </div>

            <div className="flex items-center gap-2">
              <Truck size={16} />
              Envíos rápidos y rastreables
            </div>

            <div className="flex items-center gap-2">
              <CreditCard size={16} />
              Métodos de pago flexibles
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}