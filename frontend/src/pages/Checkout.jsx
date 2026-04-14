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



// ─── 1. REGLAS DE VALIDACIÓN ──────────────────────────────────────────────────
const validate = (field, value) => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'El nombre es requerido.';
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo se permiten letras.';
      if (value.trim().length < 3) return 'Mínimo 3 caracteres.';
      return '';
    case 'address':
      if (!value.trim()) return 'La dirección es requerida.';
      return '';
    case 'phone':
      if (!value.trim()) return 'El teléfono es requerido.';
      if (!/^\d{8}$/.test(value.trim())) return 'Ingresa exactamente 8 dígitos.';
      return '';
    case 'email':
      if (!value.trim()) return 'El correo es requerido.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Formato de correo inválido.';
      return '';
    default:
      return '';
  }
};

// ─── 2. COMPONENTE DE ERROR (reutilizable) ────────────────────────────────────
const ErrorMsg = ({ msg }) =>
  msg ? <span className="text-xs text-red-500 mt-1 block">{msg}</span> : null;



function PaymentForm({ method, paymentData, setPaymentData }) {

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

  // ─── 3. ESTADO DE ERRORES ──────────────────────────────────────────────────
  const [errors, setErrors] = useState({ name: '', address: '', phone: '', email: '' });

  // ─── 4. CAMPOS CON TOUCH (para no mostrar error antes de que el usuario toque el campo) ─
  const [touched, setTouched] = useState({ name: false, address: false, phone: false, email: false });

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

  // ─── 5. HANDLER GENÉRICO: actualiza form + valida en tiempo real ───────────
  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  // Marca el campo como "tocado" al salir y valida
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validate(field, form[field]) }));
  };

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

    // ─── 6. VALIDACIÓN GLOBAL AL ENVIAR ───────────────────────────────────────
    const fields = ['name', 'address', 'phone', 'email'];
    const newErrors = {};
    const newTouched = {};
    fields.forEach(f => {
      newErrors[f] = validate(f, form[f]);
      newTouched[f] = true;
    });
    setErrors(newErrors);
    setTouched(newTouched);

    // Si hay algún error, detiene el envío
    if (fields.some(f => newErrors[f])) return;

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



        {/* FORMULARIO */}

        <div className="bg-white p-6 rounded-2xl space-y-4">

          <h2 className="font-bold text-lg mb-2">Datos de entrega</h2>

          {/* ── Nombre ── */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre Completo</label>
            <input
              placeholder="Nombre completo"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-400 focus:ring-red-300' : 'focus:ring-gray-400'}`}
              value={form.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            <ErrorMsg msg={errors.name} />
          </div>

          {/* ── Dirección ── */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Dirección</label>
            <input
              placeholder="Direccion"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ${errors.address ? 'border-red-400 focus:ring-red-300' : 'focus:ring-gray-400'}`}
              value={form.address}
              onChange={e => handleFieldChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
            />
            <ErrorMsg msg={errors.address} />
          </div>

          <select

            className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none"

            value={form.city}

            onChange={e => setForm({ ...form, city: e.target.value })}

          >

            {CITIES.map(c => <option key={c}>{c}</option>)}

          </select>

          {/* ── Teléfono ── */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
            <input
              placeholder="Telefono"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-400 focus:ring-red-300' : 'focus:ring-gray-400'}`}
              value={form.phone}
              onChange={e => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
            />
            <ErrorMsg msg={errors.phone} />
          </div>

          {/* ── Correo ── */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Correo Electrónico</label>
            <input
              placeholder="Correo electronico"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-red-400 focus:ring-red-300' : 'focus:ring-gray-400'}`}
              value={form.email}
              onChange={e => handleFieldChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            <ErrorMsg msg={errors.email} />
          </div>



          {/* CUPON */}

          <div className="border rounded-xl p-4 bg-gray-50">

            <label className="text-sm flex items-center gap-2 mb-2 text-gray-700">

              <Tag size={14} /> Cupon de descuento

            </label>

            <div className="flex gap-2">

              <input

                value={coupon}

                onChange={e => handleCouponChange(e.target.value)}

                placeholder="Ingresa codigo"

                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"

              />

              <button

                onClick={applyCoupon}

                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"

              >

                Aplicar

              </button>

            </div>

            {couponMsg && (

              <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>

                {couponMsg}

              </p>

            )}

          </div>



          {/* METODOS DE PAGO */}

          <div className="space-y-2">

            <h3 className="text-sm font-medium text-gray-700">Metodo de pago</h3>

            {METHODS.map(m => (

              <label key={m} className="flex items-center gap-2 cursor-pointer text-sm">

                <input

                  type="radio"

                  name="method"

                  checked={form.method === m}

                  onChange={() => { setForm({ ...form, method: m }); setPaymentData({}); }}

                />

                {m}

              </label>

            ))}

          </div>



          {/* FORMULARIO DINAMICO SEGUN METODO */}

          {form.method && (

            <PaymentForm

              method={form.method}

              paymentData={paymentData}

              setPaymentData={setPaymentData}

            />

          )}

        </div>



        {/* RESUMEN */}

        <div className="bg-white p-6 rounded-2xl h-fit sticky top-24">

          <h2 className="font-bold text-lg mb-4">Resumen de compra</h2>



          <div className="space-y-1 text-sm mb-4 max-h-40 overflow-y-auto">

            {cart.map(item => (

              <div key={item.id} className="flex justify-between">

                <span>{item.name} x{item.quantity}</span>

                <span>L. {(item.price * item.quantity).toFixed(2)}</span>

              </div>

            ))}

          </div>



          <div className="border-t pt-3 space-y-2 text-sm">

            <div className="flex justify-between">

              <span>Subtotal</span>

              <span>L. {subtotal.toFixed(2)}</span>

            </div>

            <div className="flex justify-between">

              <span>Impuesto (15%)</span>

              <span>L. {tax.toFixed(2)}</span>

            </div>

            <div className="flex justify-between">

              <span>Envio {form.city && `- ${form.city}`}</span>

              <span className={shipping.cost === 0 ? 'text-green-600 font-medium' : ''}>

                {shipping.cost === 0 ? 'Gratis' : `L. ${shipping.cost.toFixed(2)}`}

              </span>

            </div>

            {subtotal < 2000 && (

              <p className="text-xs text-gray-400">

                Compra L. {(2000 - subtotal).toFixed(2)} mas para envio gratis

              </p>

            )}

            {discount > 0 && (

              <div className="flex justify-between text-green-600">

                <span>Descuento ({appliedCoupon?.code})</span>

                <span>-L. {discount.toFixed(2)}</span>

              </div>

            )}

            <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">

              <span>Total</span>

              <span>L. {finalTotal.toFixed(2)}</span>

            </div>

          </div>



          <button

            onClick={handleSubmit}

            disabled={loading}

            className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition"

          >

            {loading ? 'Procesando...' : 'Confirmar compra'}

          </button>



          <div className="mt-4 text-xs text-gray-400 space-y-1">

            <p className="flex items-center gap-1"><ShieldCheck size={13} /> Compra segura y protegida</p>

            <p className="flex items-center gap-1"><Truck size={13} /> Envio rastreable</p>

          </div>

        </div>



      </div>

    </main>

  );

}
