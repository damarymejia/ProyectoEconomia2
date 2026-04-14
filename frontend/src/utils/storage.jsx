export const analyticsDB = {
  events: [],

  recordEvent(type, data) {
    const event = { type, data, timestamp: new Date().toISOString() };
    this.events.push(event);
    const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    stored.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(stored));
  },

  getEvents() {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  },

  clearEvents() {
    localStorage.removeItem('analytics_events');
    this.events = [];
  }
};