import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateShipping } from '../utils/shipping';
import { trackPurchase } from '../utils/analytics';
import { ShieldCheck, Truck, Tag } from 'lucide-react';

const COUPONS = [
  { code: 'DIGITAL10', type: 'percent', value: 10, min: 0, expires: '2026-12-31' },
  { code: 'WELCOME50', type: 'fixed', value: 50, min: 300, expires: '2026-12-31' },
  { code: 'MEGA20', type: 'percent', value: 20, min: 500, expires: '2025-06-01' }
];

const CITIES = ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Comayagua', 'Otro'];

const METHODS = [
  'Tarjeta de crédito',
  'Tarjeta de débito',
  'Transferencia bancaria',
  'Pago en efectivo'
];

function PaymentForm({ method, paymentData, setPaymentData, errors, showErrors }) {

  const field = (key, label, placeholder, type = 'text') => (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={paymentData[key] || ''}
        onChange={e => setPaymentData({ ...paymentData, [key]: e.target.value })}
        className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      {showErrors && errors[key] && (
        <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
      )}
    </div>
  );

  if (method === 'Tarjeta de crédito' || method === 'Tarjeta de débito') {
    return (
      <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">{method}</p>
        {field('cardName', 'Nombre en la tarjeta', 'Juan Perez')}
        {field('cardNumber', 'Numero de tarjeta', '1234567890123456')}
        <div className="grid grid-cols-2 gap-3">
          {field('expiry', 'Vencimiento', 'MM/AA')}
          {field('cvv', 'CVV', '123')}
        </div>
      </div>
    );
  }

  if (method === 'Transferencia bancaria') {
    return (
      <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">Transferencia bancaria</p>

        <div className="bg-white rounded-lg p-3 text-sm text-gray-600 space-y-1 border">
          <p><span className="font-medium">Banco:</span> Banco Atlantida</p>
          <p><span className="font-medium">Cuenta:</span> 1234-5678-9012</p>
          <p><span className="font-medium">Titular:</span> TiendaHN S.A.</p>
          <p><span className="font-medium">RTN:</span> 0801-1990-12345</p>
        </div>

        {field('transferRef', 'Numero de referencia', 'REF-123456')}
        {field('transferBank', 'Banco de origen', 'Banco Occidente')}
      </div>
    );
  }

  if (method === 'Pago en efectivo') {
    return (
      <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">Pago en efectivo</p>

        <div className="bg-white rounded-lg p-3 text-sm text-gray-600 space-y-1 border">
          <p>Podras pagar en efectivo al recibir tu pedido.</p>
        </div>

        {field('cashNote', 'Nota adicional (opcional)', 'Llamar antes...')}
      </div>
    );
  }

  return null;
}

export default function Checkout() {
  const { cart, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Tegucigalpa',
    phone: '',
    email: '',
    method: ''
  });

  const [errors, setErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const shipping = subtotal >= 2000
    ? { cost: 0 }
    : calculateShipping(subtotal, form.city, itemCount);

  const finalTotal = total + shipping.cost;

  const validate = () => {
    let newErrors = {};
    let payErrors = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.address.trim()) newErrors.address = 'La direccion es obligatoria';

    if (!/^\d{8}$/.test(form.phone))
      newErrors.phone = 'Telefono invalido (8 digitos)';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Correo invalido';

    if (!form.method) newErrors.method = 'Selecciona un metodo de pago';

    if (form.method.includes('Tarjeta')) {
      if (!paymentData.cardName) payErrors.cardName = 'Requerido';
      if (!/^\d{16}$/.test(paymentData.cardNumber || ''))
        payErrors.cardNumber = 'Debe tener 16 digitos';
      if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry || ''))
        payErrors.expiry = 'Formato MM/AA';
      if (!/^\d{3}$/.test(paymentData.cvv || ''))
        payErrors.cvv = '3 digitos';
    }

    if (form.method === 'Transferencia bancaria') {
      if (!paymentData.transferRef) payErrors.transferRef = 'Requerido';
      if (!paymentData.transferBank) payErrors.transferBank = 'Requerido';
    }

    setErrors(newErrors);
    setPaymentErrors(payErrors);

    return Object.keys(newErrors).length === 0 &&
           Object.keys(payErrors).length === 0;
  };

  const handleSubmit = async () => {
    setShowErrors(true);

    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const order = {
      items: cart,
      total: finalTotal,
      customer: form
    };

    trackPurchase(order);
    clearCart();
    navigate('/confirmation', { state: { order } });
  };

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">

        <div className="bg-white p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-lg mb-2">Datos de entrega</h2>

          <div>
            <label className="text-xs text-gray-500">Nombre completo</label>
            <input className="w-full border rounded-xl px-4 py-2 text-sm"
              onChange={e => setForm({ ...form, name: e.target.value })} />
            {showErrors && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs text-gray-500">Direccion</label>
            <input className="w-full border rounded-xl px-4 py-2 text-sm"
              onChange={e => setForm({ ...form, address: e.target.value })} />
            {showErrors && errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <div>
            <label className="text-xs text-gray-500">Telefono</label>
            <input className="w-full border rounded-xl px-4 py-2 text-sm"
              onChange={e => setForm({ ...form, phone: e.target.value })} />
            {showErrors && errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-xs text-gray-500">Correo electronico</label>
            <input className="w-full border rounded-xl px-4 py-2 text-sm"
              onChange={e => setForm({ ...form, email: e.target.value })} />
            {showErrors && errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Metodo de pago</h3>
            {METHODS.map(m => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.method === m}
                  onChange={() => { setForm({ ...form, method: m }); setPaymentData({}); }}
                />
                {m}
              </label>
            ))}
            {showErrors && errors.method && <p className="text-xs text-red-500">{errors.method}</p>}
          </div>

          {form.method && (
            <PaymentForm
              method={form.method}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              errors={paymentErrors}
              showErrors={showErrors}
            />
          )}

        </div>

        <div className="bg-white p-6 rounded-2xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold"
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>

      </div>
    </main>
  );
}
