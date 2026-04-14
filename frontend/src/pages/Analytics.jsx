import { useMemo } from 'react';
import { getMetrics } from '../utils/analytics';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const metrics = useMemo(() => getMetrics(), []);

  const popularLabels = Object.keys(metrics.productViewCounts || {});
  const popularData = Object.values(metrics.productViewCounts || {});

  const purchaseDates = metrics.purchases.map(e =>
    e.timestamp.slice(0, 10)
  );

  const uniqueDates = [...new Set(purchaseDates)].sort();

  const salesByDate = uniqueDates.map(date =>
    metrics.purchases
      .filter(e => e.timestamp.startsWith(date))
      .reduce((sum, e) => sum + (e.data?.total || 0), 0)
  );

  const totalSales = metrics.totalSales || 0;

  const stats = [
    {
      label: 'Ingresos totales',
      value: `L. ${totalSales.toFixed(2)}`,
      color: 'text-green-600'
    },
    {
      label: 'Órdenes',
      value: metrics.purchases.length,
      color: 'text-blue-600'
    },
    {
      label: 'Eventos de carrito',
      value: metrics.cartAdds.length,
      color: 'text-purple-600'
    },
    {
      label: 'Conversion rate',
      value: `${metrics.conversionRate || 0}%`,
      color: 'text-black'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Panel de analítica
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Resumen del rendimiento de la tienda en tiempo real
        </p>

      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}

      </div>

      {/* CHARTS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

        {/* PRODUCTOS MÁS VISTOS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <h2 className="font-semibold text-gray-900 mb-4">
            Productos más vistos
          </h2>

          {popularLabels.length > 0 ? (
            <Bar
              data={{
                labels: popularLabels,
                datasets: [
                  {
                    label: 'Vistas',
                    data: popularData,
                    backgroundColor: '#111827'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          ) : (
            <p className="text-sm text-gray-400">
              Aún no hay datos de visualización
            </p>
          )}
        </div>

        {/* VENTAS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <h2 className="font-semibold text-gray-900 mb-4">
            Ventas por día
          </h2>

          {uniqueDates.length > 0 ? (
            <Line
              data={{
                labels: uniqueDates,
                datasets: [
                  {
                    label: 'Ventas',
                    data: salesByDate,
                    borderColor: '#111827',
                    backgroundColor: '#111827',
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          ) : (
            <p className="text-sm text-gray-400">
              No hay ventas registradas aún
            </p>
          )}
        </div>

      </div>

      {/* FOOTER INSIGHT */}
      

    </main>
  );
}