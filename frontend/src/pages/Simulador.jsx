import { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { trackProductView, trackAddToCart, trackPurchase } from '../utils/analytics';

export default function Simulator() {
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const simulateUser = async () => {
    setRunning(true);
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    const viewCount = Math.floor(Math.random() * 4) + 2;
    const viewed = [];

    for (let i = 0; i < viewCount; i++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      trackProductView(product);
      viewed.push(product);
      addLog(`Usuario vio: ${product.name}`);
      await delay(600);
    }

    const cartItems = viewed.slice(0, Math.floor(Math.random() * 2) + 1);
    for (const item of cartItems) {
      trackAddToCart(item);
      addLog(`Usuario agrego al carrito: ${item.name}`);
      await delay(400);
    }

    if (Math.random() > 0.3) {
      const total = cartItems.reduce((sum, p) => sum + p.price, 0) * 1.15;
      const orderId = 'SIM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      trackPurchase({ id: orderId, total, items: cartItems });
      addLog(`Usuario compro. Orden: ${orderId} - Total: L. ${total.toFixed(2)}`);
    } else {
      addLog('Usuario abandono sin comprar.');
    }

    setRunning(false);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Simulador de usuario</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Genera comportamientos ficticios de navegacion y compra para alimentar el modulo de analitica.
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={simulateUser}
          disabled={running}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50"
        >
          {running ? 'Simulando...' : 'Simular un usuario'}
        </button>
        <button
          onClick={() => { for (let i = 0; i < 5; i++) setTimeout(simulateUser, i * 1000); }}
          disabled={running}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Simular 5 usuarios
        </button>
        <button
          onClick={() => setLog([])}
          className="border border-gray-300 px-4 py-3 rounded-xl text-sm hover:bg-gray-100"
        >
          Limpiar log
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs min-h-48 max-h-96 overflow-y-auto">
        {log.length === 0
          ? <span className="text-gray-600">Presiona "Simular un usuario" para comenzar...</span>
          : log.map((entry, i) => <div key={i}>{entry}</div>)
        }
      </div>
    </main>
  );
}