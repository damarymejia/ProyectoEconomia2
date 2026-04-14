import { analyticsDB } from './storage';

export const trackProductView = (product) => {
  analyticsDB.recordEvent('product_view', { productId: product.id, name: product.name });
};

export const trackAddToCart = (product) => {
  analyticsDB.recordEvent('add_to_cart', { productId: product.id, name: product.name, price: product.price });
};

export const trackPurchase = (order) => {
  analyticsDB.recordEvent('purchase', { orderId: order.id, total: order.total, items: order.items });
};

export const getMetrics = () => {
  const events = analyticsDB.getEvents();
  const views = events.filter(e => e.type === 'product_view');
  const cartAdds = events.filter(e => e.type === 'add_to_cart');
  const purchases = events.filter(e => e.type === 'purchase');

  const productViewCounts = {};
  views.forEach(e => {
    const key = e.data.name;
    productViewCounts[key] = (productViewCounts[key] || 0) + 1;
  });

  const totalSales = purchases.reduce((sum, e) => sum + (e.data.total || 0), 0);
  const conversionRate = views.length > 0
    ? ((purchases.length / views.length) * 100).toFixed(1)
    : 0;

  return { views, cartAdds, purchases, productViewCounts, totalSales, conversionRate };
};