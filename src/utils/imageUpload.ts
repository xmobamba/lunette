/**
 * Utility for handling user image uploads, resizing for localStorage persistence,
 * and managing custom user images across the application.
 */

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
