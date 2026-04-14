import { ShieldCheck, RefreshCcw, FileText, Lock } from "lucide-react";

export default function Policies() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Centro de Políticas</h1>
          <p className="text-gray-300 text-lg">
            Transparencia total en devoluciones, privacidad y condiciones de uso
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Devoluciones */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="text-black" />
            <h2 className="text-xl font-semibold">Política de devoluciones</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Aceptamos devoluciones dentro de los 30 días posteriores a la compra,
            siempre que el producto esté en condiciones originales, sin uso y con su empaque original.
          </p>

          <p className="text-gray-600 leading-relaxed mt-3">
            Para iniciar una devolución, el cliente debe contactar soporte con su número de orden.
            Los costos de envío de devolución serán cubiertos por el cliente, salvo defectos de fábrica.
          </p>

          <div className="mt-4 text-sm text-gray-500">
            Tiempo de respuesta: 24–48 horas
          </div>
        </section>

        {/* Términos */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-black" />
            <h2 className="text-xl font-semibold">Términos y condiciones</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Al realizar una compra en TiendaHN, el usuario acepta los presentes términos.
            Nos reservamos el derecho de cancelar pedidos por errores de precio, falta de stock o datos incorrectos.
          </p>

          <p className="text-gray-600 leading-relaxed mt-3">
            Todos los precios incluyen IVA (15%) y están expresados en lempiras hondureños.
            El uso de la plataforma implica aceptación de nuestras políticas de operación.
          </p>
        </section>

        {/* Privacidad */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-black" />
            <h2 className="text-xl font-semibold">Aviso de privacidad</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Los datos personales recopilados (nombre, correo, teléfono, dirección)
            se utilizan exclusivamente para procesar pedidos y mejorar la experiencia del usuario.
          </p>

          <p className="text-gray-600 leading-relaxed mt-3">
            No compartimos información con terceros sin consentimiento del usuario.
            Puedes solicitar eliminación de datos en cualquier momento a través de soporte.
          </p>
        </section>

        {/* Bloque de confianza */}
        <section className="bg-black text-white rounded-2xl p-8 text-center">
          <ShieldCheck className="mx-auto mb-3" size={34} />
          <h3 className="text-xl font-bold mb-2">
            Tu seguridad es nuestra prioridad
          </h3>
          <p className="text-gray-300">
            Todas las políticas están diseñadas para proteger al usuario y garantizar una experiencia de compra confiable.
          </p>
        </section>

      </div>
    </main>
  );
}