/**
 * Utility for handling user image uploads, resizing for localStorage persistence,
 * and managing custom user images across the application and Admin Media Library.
 */
import { MediaImage, Product } from '../types';

export async function fileToBase64(
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Fill background with white for transparency safety
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const HERO_IMAGE_KEY = 'aura_custom_hero_image';
const GALLERY_KEY = 'aura_custom_gallery';
const MEDIA_LIBRARY_KEY = 'aura_media_library_v1';

export function getStoredHeroImage(): string | null {
  try {
    return localStorage.getItem(HERO_IMAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredHeroImage(image: string | null): void {
  try {
    if (image) {
      localStorage.setItem(HERO_IMAGE_KEY, image);
      // Also register in Media Library as hero
      addPhotoToMediaLibrary(image, 'Photo Accueil Hero', undefined, undefined, true);
    } else {
      localStorage.removeItem(HERO_IMAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving hero image:', err);
  }
}

export function getStoredGallery(): string[] {
  try {
    const saved = localStorage.getItem(GALLERY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveStoredGallery(images: string[]): void {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(images));
  } catch (err) {
    console.error('Error saving gallery:', err);
  }
}

/**
 * Global Admin Media Library (Médiathèque)
 */
export function getStoredMediaLibrary(): MediaImage[] {
  try {
    const saved = localStorage.getItem(MEDIA_LIBRARY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveStoredMediaLibrary(items: MediaImage[]): void {
  try {
    localStorage.setItem(MEDIA_LIBRARY_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving media library:', err);
  }
}

/**
 * Add a photo to the Media Library if not already present, or update existing entry
 */
export function addPhotoToMediaLibrary(
  url: string,
  name?: string,
  assignedProductId?: string,
  assignedProductName?: string,
  isHero?: boolean
): MediaImage {
  const library = getStoredMediaLibrary();
  const existingIdx = library.findIndex((item) => item.url === url);

  if (existingIdx >= 0) {
    const updatedItem: MediaImage = {
      ...library[existingIdx],
      name: name || library[existingIdx].name,
      assignedProductId: assignedProductId !== undefined ? assignedProductId : library[existingIdx].assignedProductId,
      assignedProductName: assignedProductName !== undefined ? assignedProductName : library[existingIdx].assignedProductName,
      isHero: isHero !== undefined ? isHero : library[existingIdx].isHero,
    };
    library[existingIdx] = updatedItem;
    saveStoredMediaLibrary(library);
    return updatedItem;
  }

  const newItem: MediaImage = {
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    url,
    name: name || `Photo ${library.length + 1}`,
    createdAt: Date.now(),
    assignedProductId,
    assignedProductName,
    isHero: isHero || false,
  };

  const newLib = [newItem, ...library];
  saveStoredMediaLibrary(newLib);
  return newItem;
}

/**
 * Synchronize all current product photos and hero photo into the Admin Media Library
 */
export function syncAllPhotosToMediaLibrary(products: Product[], heroImg?: string | null): MediaImage[] {
  const library = getStoredMediaLibrary();
  let updated = [...library];

  // 1. Check Hero Image
  const currentHero = heroImg || getStoredHeroImage();
  if (currentHero) {
    const existingHero = updated.find((m) => m.url === currentHero);
    if (existingHero) {
      existingHero.isHero = true;
    } else {
      updated.unshift({
        id: `media-hero-${Date.now()}`,
        url: currentHero,
        name: "Photo d'Accueil Principale (Hero)",
        createdAt: Date.now(),
        isHero: true,
      });
    }
  }

  // 2. Check all Product Images
  products.forEach((prod) => {
    if (prod.images && prod.images.length > 0) {
      prod.images.forEach((imgUrl, imgIdx) => {
        const existing = updated.find((m) => m.url === imgUrl);
        if (existing) {
          existing.assignedProductId = prod.id;
          existing.assignedProductName = prod.name;
        } else {
          updated.unshift({
            id: `media-${prod.id}-${imgIdx}-${Date.now()}`,
            url: imgUrl,
            name: `${prod.name} (Vue ${imgIdx + 1})`,
            createdAt: Date.now(),
            assignedProductId: prod.id,
            assignedProductName: prod.name,
            isHero: imgUrl === currentHero,
          });
        }
      });
    }
  });

  saveStoredMediaLibrary(updated);
  return updated;
}
