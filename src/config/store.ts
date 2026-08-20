import { StoreConfig } from '../types';

export const STORE_CONFIG: StoreConfig = {
  storeName: "L'AURA EYEWEAR",
  tagline: "Lunettes de soleil tendance & haute couture",
  // Numéro WhatsApp par défaut (au format international sans espaces/plus pour wa.me)
  phoneRaw: "2250701020304", // Remplaçable facilement
  phoneDisplay: "+225 07 01 02 03 04",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  currency: "FCFA",
  deliveryNotice: "Livraison disponible partout à Abidjan (Cocody, Marcory, Plateau, Riviera, Yopougon...)",
  promoText: "2 paires achetées = livraison offerte*",
  promoSubtext: "*Selon zone de livraison à Abidjan et communes proches.",
  isPromoActive: true,
  instagramHandle: "@aura.eyewear.ci",
  tiktokHandle: "@aura.eyewear",
  facebookPage: "Aura Eyewear Abidjan",
};

export const CATEGORIES_LIST = [
  { id: 'all', label: 'Tous' },
  { id: 'femme', label: 'Femme' },
  { id: 'homme', label: 'Homme' },
  { id: 'oversize', label: 'Oversize' },
  { id: 'classique', label: 'Classique' },
  { id: 'tendance', label: 'Tendance' },
  { id: 'cateye', label: 'Yeux de Chat' },
  { id: 'nouveautes', label: 'Nouveautés' },
] as const;

export const ADVANTAGES = [
  {
    icon: 'Sparkles',
    title: 'Modèles tendance',
    description: 'Une sélection régulièrement renouvelée selon les dernières tendances mondiales et ivoiriennes.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Qualité sélectionnée',
    description: 'Verres haute protection UV400, montures robustes et finitions soignées pour sublimer votre regard.',
  },
  {
    icon: 'Truck',
    title: 'Livraison rapide',
    description: 'Livraison express à Abidjan en 24h à 48h selon votre commune (Cocody, Marcory, Zone 4, Riviera...).',
  },
  {
    icon: 'MessageCircle',
    title: 'Commande simple',
    description: 'Commandez en 30 secondes directement sur WhatsApp, sans création de compte compliquée.',
  },
];

export const FAQ_ITEMS = [
  {
    question: "Comment commander ?",
    answer: "Cliquez simplement sur le bouton « Commander sur WhatsApp » du modèle qui vous plaît. Votre message sera pré-rempli avec les détails de la paire, il vous suffit de cliquer sur « Envoyer » pour échanger directement avec notre équipe.",
  },
  {
    question: "Comment payer ?",
    answer: "Les moyens de paiement disponibles sont le paiement à la livraison (Cash) à Abidjan, ainsi que les transferts mobiles sécurisés (Wave, Orange Money, MTN MoMo).",
  },
  {
    question: "Livrez-vous à Abidjan et à l'intérieur ?",
    answer: "Oui ! Nous livrons dans toutes les communes d'Abidjan (Cocody, Marcory, Plateau, Riviera, Yopougon, Treichville, Port-Bouët...) en 24h à 48h. Pour l'intérieur du pays (Yamoussoukro, Bouaké, San Pedro...), nous expédions par compagnie de transport sécurisée.",
  },
  {
    question: "Puis-je commander plusieurs lunettes ?",
    answer: "Absolument ! Profitez de notre offre du moment : 2 paires achetées = Livraison offerte. Vous pouvez préciser les modèles et couleurs souhaités directement dans votre message WhatsApp.",
  },
  {
    question: "Comment savoir si un modèle est disponible ?",
    answer: "La disponibilité et les stocks sont confirmés instantanément par notre équipe dès réception de votre message sur WhatsApp.",
  },
  {
    question: "Les lunettes sont-elles livrées avec un étui ?",
    answer: "Oui, chaque paire de lunettes est soigneusement emballée et livrée avec son étui de protection élégant et sa lingette microfibre de nettoyage offerte.",
  },
];
