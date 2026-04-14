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

function PaymentForm({ method, paymentData, setPaymentData, errors }) {
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
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  if (method === 'Tarjeta de crédito' || method === 'Tarjeta de débito') {
    return (
      <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">{method}</p>
        {field('cardName', 'Nombre en la tarjeta', 'Juan Perez')}
        {field('cardNumber', 'Numero de tarjeta', '1234 5678 9012 3456')}
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
          <p>Podras pagar en efectivo al momento de recibir tu pedido.</p>
          <p className="mt-2"><span className="font-medium">Horario de entrega:</span> Lunes a Sabado 8am - 6pm</p>
          <p><span className="font-medium">Contacto:</span> +504 9999-8888</p>
        </div>

        {field('cashNote', 'Nota adicional (opcional)', 'Llamar antes de llegar...')}
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
  const [paymentData, setPaymentData] = useState({});

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const shipping = subtotal >= 2000
    ? { cost: 0, label: 'Gratis' }
    : calculateShipping(subtotal, form.city, itemCount);

  const baseTotal = total + shipping.cost;
  const finalTotal = baseTotal - discount;

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.address.trim()) newErrors.address = 'La direccion es obligatoria';

    if (!form.phone.match(/^\d{8}$/))
      newErrors.phone = 'Telefono invalido (8 digitos)';

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = 'Correo invalido';

    if (!form.method) newErrors.method = 'Selecciona un metodo de pago';

    let payErrors = {};

    if (form.method.includes('Tarjeta')) {
      if (!paymentData.cardName) payErrors.cardName = 'Requerido';
      if (!/^\d{16}$/.test(paymentData.cardNumber || ''))
        payErrors.cardNumber = '16 digitos';
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
    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const orderId = 'ORD-' + Math.random().toString(36).slice(2, 10).toUpperCase();

    const order = {
      id: orderId,
      items: cart,
      subtotal,
      tax,
      shipping: shipping.cost,
      discount,
      total: finalTotal,
      customer: form,
      paymentData,
      coupon: appliedCoupon?.code || null,
      status: 'Procesado'
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

          <input
            placeholder="Nombre completo"
            className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

          <input
            placeholder="Direccion"
            className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

          <input
            placeholder="Telefono"
            className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}

          <input
            placeholder="Correo electronico"
            className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Metodo de pago</h3>
            {METHODS.map(m => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="method"
                  checked={form.method === m}
                  onChange={() => { setForm({ ...form, method: m }); setPaymentData({}); }}
                />
                {m}
              </label>
            ))}
            {errors.method && <p className="text-xs text-red-500">{errors.method}</p>}
          </div>

          {form.method && (
            <PaymentForm
              method={form.method}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              errors={paymentErrors}
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
