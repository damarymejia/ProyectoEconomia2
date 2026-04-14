import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateShipping } from '../utils/shipping';
import { trackPurchase } from '../utils/analytics';
import { ShieldCheck, Truck, CreditCard, Tag } from 'lucide-react';

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
      {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
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

  const [paymentData, setPaymentData] = useState({});
  const [errors, setErrors] = useState({});
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

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) { setDiscount(0); setCouponMsg(''); setAppliedCoupon(null); return; }

    const found = COUPONS.find(c => c.code === code);
    if (!found) { setDiscount(0); setCouponMsg('Codigo invalido'); setAppliedCoupon(null); return; }

    if (new Date() > new Date(found.expires)) {
      setDiscount(0); setCouponMsg('Cupon expirado'); setAppliedCoupon(null); return;
    }

    if (baseTotal < found.min) {
      setDiscount(0); setCouponMsg(`Minimo L. ${found.min}`); setAppliedCoupon(null); return;
    }

    const d = found.type === 'percent' ? baseTotal * (found.value / 100) : found.value;
    setDiscount(d);
    setCouponMsg(`Cupon aplicado -L. ${d.toFixed(2)}`);
    setAppliedCoupon(found);
  };

  const handleCouponChange = (value) => {
    setCoupon(value);
    if (!value.trim()) { setDiscount(0); setCouponMsg(''); setAppliedCoupon(null); }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.address.trim()) newErrors.address = 'La direccion es obligatoria';
    if (!form.phone.trim()) newErrors.phone = 'El telefono es obligatorio';
    if (!/^\d{8}$/.test(form.phone)) newErrors.phone = 'El telefono debe tener 8 digitos';
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo invalido';
    if (!form.method) newErrors.method = 'Seleccione un metodo de pago';

    if (form.method === 'Tarjeta de crédito' || form.method === 'Tarjeta de débito') {
      if (!paymentData.cardName) newErrors.cardName = 'Nombre en tarjeta requerido';
      if (!/^\d{16}$/.test(paymentData.cardNumber || '')) newErrors.cardNumber = 'Numero de tarjeta invalido';
      if (!paymentData.expiry) newErrors.expiry = 'Fecha requerida';
      if (!/^\d{3,4}$/.test(paymentData.cvv || '')) newErrors.cvv = 'CVV invalido';
    }

    if (form.method === 'Transferencia bancaria') {
      if (!paymentData.transferRef) newErrors.transferRef = 'Referencia requerida';
      if (!paymentData.transferBank) newErrors.transferBank = 'Banco requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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

          <input placeholder="Nombre completo" className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          <input placeholder="Direccion" className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, address: e.target.value })} />
          {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

          <select className="w-full border rounded-xl px-4 py-2 text-sm"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <input placeholder="Telefono" className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, phone: e.target.value })} />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

          <input placeholder="Correo electronico" className="w-full border rounded-xl px-4 py-2 text-sm"
            onChange={e => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Metodo de pago</h3>
            {METHODS.map(m => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input type="radio" checked={form.method === m}
                  onChange={() => { setForm({ ...form, method: m }); setPaymentData({}); }} />
                {m}
              </label>
            ))}
            {errors.method && <p className="text-red-500 text-xs">{errors.method}</p>}
          </div>

          {form.method && (
            <PaymentForm
              method={form.method}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              errors={errors}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl h-fit">
          <button onClick={handleSubmit}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold">
            Confirmar compra
          </button>
        </div>

      </div>
    </main>
  );
}
