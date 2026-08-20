import { Product, ProductColor, PromoBannerItem } from '../types';
import { STORE_CONFIG } from '../config/store';
import { trackAnalyticsEvent } from './analytics';

export interface WhatsAppOrderOptions {
  product: Product;
  selectedColor?: ProductColor | string;
  quantity?: number;
  customPhone?: string;
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + STORE_CONFIG.currency;
}

export function getCleanPhoneNumber(phone?: string): string {
  const target = phone || STORE_CONFIG.phoneRaw;
  return target.replace(/[^\d]/g, '');
}

/**
 * Génère le lien WhatsApp avec message pré-rempli pour la commande d'une paire de lunettes
 */
export function buildProductWhatsAppUrl({
  product,
  selectedColor,
  quantity = 1,
  customPhone,
}: WhatsAppOrderOptions): string {
  const phone = getCleanPhoneNumber(customPhone);
  const colorName = typeof selectedColor === 'object' ? selectedColor?.name : (selectedColor || product.colors[0]?.name || 'Standard');
  const totalPrice = product.price * quantity;
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#${product.slug}` : `https://aura-eyewear.ci/#${product.slug}`;

  const message = `Bonjour 👋

Je souhaite commander cette paire de lunettes :

🕶 Modèle : ${product.name}
🎨 Couleur : ${colorName}
💰 Prix unitaire : ${formatFCFA(product.price)}
🔢 Quantité : ${quantity}
📦 Total : ${formatFCFA(totalPrice)}

Lien du modèle : ${currentUrl}

Pouvez-vous me confirmer la disponibilité et les modalités de livraison à Abidjan ? Merci !`;

  // Track event
  trackAnalyticsEvent('whatsapp_order_click', {
    product_id: product.id,
    product_name: product.name,
    color: colorName,
    quantity,
    value: totalPrice,
    currency: 'XOF',
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un lien WhatsApp pour le contact général ou l'offre promo
 */
export function buildGeneralWhatsAppUrl(context: 'general' | 'promo' | 'help' | 'bestseller' = 'general', customPhone?: string): string {
  const phone = getCleanPhoneNumber(customPhone);

  let message = `Bonjour 👋

Je vous contacte depuis votre boutique en ligne AURA Eyewear.
J'aimerais avoir plus d'informations sur vos modèles de lunettes disponibles et les livraisons à Abidjan.`;

  if (context === 'promo') {
    message = `Bonjour 👋

Je souhaite profiter de l'offre spéciale :
✨ « 2 paires achetées = Livraison offerte à Abidjan » ✨

Pouvez-vous me conseiller sur les modèles disponibles pour constituer mon pack ? Merci !`;
  } else if (context === 'help') {
    message = `Bonjour 👋

J'ai besoin de conseils pour choisir la paire de lunettes la plus adaptée à la forme de mon visage. Pouvez-vous m'aider ?`;
  } else if (context === 'bestseller') {
    message = `Bonjour 👋

Je souhaite découvrir vos modèles best-sellers du moment et passer commande. Merci de m'envoyer le catalogue disponible !`;
  }

  // Track event
  trackAnalyticsEvent('whatsapp_contact_click', {
    context,
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un lien WhatsApp pour une bannière promotionnelle spécifique
 */
export function buildCustomPromoWhatsAppUrl(promo: PromoBannerItem, customPhone?: string): string {
  const phone = getCleanPhoneNumber(customPhone);

  const message = promo.whatsappMessage || `Bonjour 👋

Je souhaite profiter de l'offre spéciale :
✨ « ${promo.title} » ✨

Pouvez-vous me donner plus de détails et me conseiller sur les modèles disponibles à Abidjan ? Merci !`;

  trackAnalyticsEvent('whatsapp_promo_banner_click', {
    promo_id: promo.id,
    promo_title: promo.title,
    promo_badge: promo.badge,
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
