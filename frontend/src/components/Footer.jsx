import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h3 className="text-white text-lg font-bold mb-3">TiendaHN</h3>
          <p className="text-sm leading-relaxed">
            Lo que necesitas, en un solo lugar
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h4 className="text-white font-semibold mb-3">Tienda</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/">Inicio</Link></li>
            <li><Link className="hover:text-white" to="/catalog">Catálogo</Link></li>
            <li><Link className="hover:text-white" to="/cart">Carrito</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-3">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/policies">Políticas</Link></li>
            <li><a className="hover:text-white" href="#">Centro de ayuda</a></li>
            <li><a className="hover:text-white" href="#">Contacto</a></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-white" href="#">Privacidad</a></li>
            <li><a className="hover:text-white" href="#">Términos</a></li>
            <li><a className="hover:text-white" href="#">Cookies</a></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray-500">
            © 2026 TiendaHN. Todos los derechos reservados.
          </p>


        </div>

      </div>

    </footer>
  );
}