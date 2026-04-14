import { useLocation, Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';
import { Truck, MapPin, PackageCheck } from 'lucide-react';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;
  const invoiceRef = useRef();

  if (!order) {
    return (
      <main className="text-center py-20">
        <p>No se encontró el pedido.</p>
      </main>
    );
  }

  // 🔥 SEGURIDAD TOTAL (EVITA ERRORES TOFIXED)
  const safeOrder = {
    ...order,
    subtotal: order?.subtotal ?? 0,
    tax: order?.tax ?? 0,
    shipping: order?.shipping ?? 0,
    discount: order?.discount ?? 0,
    total: order?.total ?? 0,
  };

  const downloadPDF = () => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: `factura-${safeOrder.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(invoiceRef.current)
      .save();
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER CONFIRMACIÓN */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageCheck className="text-green-600" size={32} />
          </div>

          <h1 className="text-3xl font-bold">Pedido confirmado</h1>

          <p className="text-gray-600">
            Gracias por tu compra, <strong>{safeOrder.customer?.name}</strong>
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Orden: <span className="font-mono font-bold">{safeOrder.id}</span>
          </p>
        </div>

        {/* FACTURA */}
        <div
          ref={invoiceRef}
          className="bg-white rounded-2xl shadow-md border p-8"
        >

          {/* HEADER FACTURA */}
          <div className="flex justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold">FACTURA ELECTRÓNICA</h2>
              <p className="text-gray-500 text-sm">TiendaHN</p>
            </div>

            <div className="text-right text-sm text-gray-600">
              <p><strong>Orden:</strong> {safeOrder.id}</p>
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
            </div>

          </div>

          {/* CLIENTE */}
          <div className="mb-5 text-sm">
            <p className="font-semibold">Cliente:</p>
            <p>{safeOrder.customer?.name}</p>
            <p>{safeOrder.customer?.email}</p>

            <p className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin size={14} /> {safeOrder.customer?.city}
            </p>
          </div>

          {/* ENVÍO */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-700">

            <div className="flex items-center gap-2 font-semibold mb-1">
              <Truck size={16} /> Información de envío
            </div>

            <p>
              Tipo: {safeOrder.shipping === 0 ? 'Envío gratuito' : safeOrder.shippingLabel}
            </p>

            <p>
              Estado: En preparación
            </p>

            <p className="font-mono mt-1">
              Tracking: TGU-{safeOrder.id}
            </p>

          </div>

          {/* ITEMS */}
          <div className="border-t pt-4 mb-4">

            <h3 className="font-semibold mb-3">Detalle de compra</h3>

            <div className="space-y-2 text-sm">
              {safeOrder.items?.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>
                    L. {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* TOTALES */}
          <div className="border-t pt-4 space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>L. {safeOrder.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Impuesto (15%)</span>
              <span>L. {safeOrder.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Envío</span>
              <span>
                {safeOrder.shipping === 0
                  ? 'Gratis'
                  : `L. ${safeOrder.shipping.toFixed(2)}`}
              </span>
            </div>

            {safeOrder.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento aplicado</span>
                <span>-L. {safeOrder.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total pagado</span>
              <span>L. {safeOrder.total.toFixed(2)}</span>
            </div>

          </div>

        </div>

        {/* BOTONES */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={downloadPDF}
            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
          >
            Descargar factura PDF
          </button>

          <Link
            to="/"
            className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl text-center font-semibold hover:bg-gray-300"
          >
            Volver al inicio
          </Link>

        </div>

      </div>
    </main>
  );
}