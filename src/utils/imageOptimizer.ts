/**
 * Image processing & compression utility for Eternal Chic
 * Automatically resizes and compresses user-uploaded photos to prevent memory exhaustion,
 * localStorage quota issues, and slow load times on mobile devices.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export const DEFAULT_PHOTO_PLACEHOLDER =
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80';

/**
 * Compresses and scales an image File or Blob into an optimized data URL string.
 */
export async function optimizeImageFile(
  file: File | Blob,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Read file as Data URL
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo da foto.'));
    };

    reader.onload = (event) => {
      const src = event.target?.result;
      if (typeof src !== 'string') {
        reject(new Error('Formato de imagem inválido.'));
        return;
      }

      // 2. Create Image element to determine natural dimensions
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onerror = () => {
        reject(new Error('Não foi possível decodificar a imagem. Tente outro arquivo.'));
      };

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // If image is already smaller than max dimensions and smaller than 400KB, return as is
          if (file.size && file.size < 400 * 1024 && width <= maxWidth && height <= maxHeight && format === 'image/jpeg') {
            resolve(src);
            return;
          }

          // Calculate new proportional dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Ensure minimum valid dimensions
          width = Math.max(1, width);
          height = Math.max(1, height);

          // 3. Draw on Canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: format === 'image/png' });
          if (!ctx) {
            // Fallback to original string if canvas context unavailable
            resolve(src);
            return;
          }

          // Fill white background for JPEGs (handles transparent PNGs nicely)
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // 4. Export as compressed Data URL
          const outputDataUrl = canvas.toDataURL(format, quality);
          resolve(outputDataUrl);
        } catch (err) {
          console.warn('Canvas optimization failed, falling back to reader result:', err);
          resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates whether a given URL is a valid image URL.
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('blob:')
  );
}
