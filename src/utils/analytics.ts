// Helper pour tracker les événements analytics (Meta Pixel, GA4, TikTok Pixel)

export interface AnalyticsEventData {
  [key: string]: any;
}

export function trackAnalyticsEvent(eventName: string, data?: AnalyticsEventData) {
  if (typeof window === 'undefined') return;

  // Log in console for development/demo transparency
  console.log(`[Analytics Event: ${eventName}]`, data);

  // Meta Pixel (Facebook) integration support
  if ((window as any).fbq) {
    if (eventName === 'whatsapp_order_click') {
      (window as any).fbq('track', 'Lead', {
        content_name: data?.product_name,
        content_category: 'Eyewear',
        value: data?.value,
        currency: 'XOF',
      });
    } else if (eventName === 'view_product') {
      (window as any).fbq('track', 'ViewContent', {
        content_name: data?.product_name,
        content_ids: [data?.product_id],
        value: data?.price,
        currency: 'XOF',
      });
    } else {
      (window as any).fbq('trackCustom', eventName, data);
    }
  }

  // Google Analytics 4 integration support
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, data);
  }

  // Dispatch custom window event in case UI components want to show a toast or feedback
  window.dispatchEvent(
    new CustomEvent('aura_analytics_event', {
      detail: { eventName, data, timestamp: new Date().toLocaleTimeString() },
    })
  );
}
