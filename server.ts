import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable JSON body parsing with large limit for base64 photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Storage directory
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'catalog-store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache fallback
let memoryStore: Record<string, any> = {
  products: null,
  mediaLibrary: null,
  heroImage: null,
  customPhone: null,
  lastUpdated: Date.now(),
};

// Load initial store from file if exists
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    memoryStore = { ...memoryStore, ...JSON.parse(raw) };
  }
} catch (err) {
  console.warn('Could not read existing store file, starting fresh:', err);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET /api/sync/data - Get synchronized catalog for all devices (phone, desktop, tablets)
app.get('/api/sync/data', (req, res) => {
  res.json({
    success: true,
    data: {
      products: memoryStore.products,
      mediaLibrary: memoryStore.mediaLibrary,
      heroImage: memoryStore.heroImage,
      customPhone: memoryStore.customPhone,
      lastUpdated: memoryStore.lastUpdated,
    },
  });
});

// POST /api/sync/data - Save synchronized catalog from Admin
app.post('/api/sync/data', (req, res) => {
  try {
    const { products, mediaLibrary, heroImage, customPhone } = req.body;
    
    if (products !== undefined) memoryStore.products = products;
    if (mediaLibrary !== undefined) memoryStore.mediaLibrary = mediaLibrary;
    if (heroImage !== undefined) memoryStore.heroImage = heroImage;
    if (customPhone !== undefined) memoryStore.customPhone = customPhone;
    memoryStore.lastUpdated = Date.now();

    // Persist to file
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
    } catch (writeErr) {
      console.error('Error writing store to file:', writeErr);
    }

    res.json({
      success: true,
      message: 'Catalogue synchronisé avec succès sur tous les appareils !',
      lastUpdated: memoryStore.lastUpdated,
    });
  } catch (err: any) {
    console.error('Error saving sync data:', err);
    res.status(500).json({ success: false, error: err?.message || 'Erreur serveur' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Eyewear Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
