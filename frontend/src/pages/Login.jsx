import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.email.trim()) e.email = 'Usuario requerido';
    if (!form.password.trim()) e.password = 'Contraseña requerida';

    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) return setErrors(e);

    setLoading(true);

    setTimeout(() => {
      const isAdmin =
        form.email === 'admin' && form.password === '1234';

      login({
        name: isAdmin ? 'Administrador' : form.email,
        email: form.email,
        role: isAdmin ? 'admin' : 'user'
      });

      navigate('/');
    }, 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            TiendaHN
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Acceso al sistema
          </p>
        </div>

        {/* DEMO INFO */}
        

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Usuario
            </label>

            <input
              type="text"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-gray-300'
              }`}
              placeholder="Ingrese su usuario"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-gray-300'
              }`}
              placeholder="Ingrese su contraseña"
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-6">
          Sistema de autenticación TiendaHN
        </p>

      </div>

    </main>
  );
}