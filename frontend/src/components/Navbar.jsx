import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  LogOut,
  LogIn,
  Shield,
  LayoutDashboard,
  Search
} from 'lucide-react';

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = !!user && user.role === 'admin';
  const isInAnalytics = location.pathname === '/analytics';
  const isInCatalog = location.pathname === '/catalog';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🔁 sincronizar input con URL
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
  }, [searchParams]);

  // 🔍 búsqueda inteligente
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/catalog?search=${search}`);
  };

  // 🔍 búsqueda en tiempo real si ya estás en catálogo
  const handleChange = (value) => {
    setSearch(value);

    if (isInCatalog) {
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      navigate(`/catalog?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* LOGO */}
        <Link to="/" className="text-xl font-black whitespace-nowrap">
          TiendaHN
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="px-3 py-2 rounded-full hover:bg-gray-100">
            Inicio
          </Link>

          <Link to="/catalog" className="px-3 py-2 rounded-full hover:bg-gray-100">
            Productos
          </Link>

          {isAdmin && (
            <Link
              to="/analytics"
              className="px-3 py-2 rounded-full bg-black text-white flex items-center gap-2"
            >
              <LayoutDashboard size={14} />
              Panel
            </Link>
          )}
        </nav>

        {/* 🔍 SEARCH */}
        {!isInAnalytics && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => handleChange(e.target.value)}
                className="bg-transparent outline-none ml-2 w-full text-sm"
              />
            </div>
          </form>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {!isInAnalytics && (
            <Link to="/cart" className="relative px-3 py-2 bg-gray-100 rounded-full">
              <ShoppingCart size={16} />

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            isInAnalytics && isAdmin ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-black text-white rounded-full flex items-center gap-2"
              >
                <LogOut size={14} />
                Salir
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-black text-white rounded-full flex items-center gap-2"
              >
                <LogOut size={14} />
                {user.name}
              </button>
            )
          ) : (
            <Link
              to="/login"
              className="px-3 py-2 bg-black text-white rounded-full flex items-center gap-2"
            >
              <LogIn size={14} />
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* ADMIN BAR */}
      {user && isAdmin && (
        <div className="bg-black text-white text-xs text-center py-2 flex justify-center items-center gap-2">
          <Shield size={14} />
          Modo administrador activo. Acceso completo al sistema.
        </div>
      )}
    </header>
  );
}