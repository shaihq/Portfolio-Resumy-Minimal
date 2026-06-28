import { useState, useEffect } from "react";

function extractDominantColor(img: HTMLImageElement): string {
  try {
    const canvas = document.createElement("canvas");
    const size = 80;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "150,150,150";

    // Sample the bottom 45% of the image where dominant landscape colors live
    ctx.drawImage(
      img,
      0, Math.floor(img.naturalHeight * 0.55),
      img.naturalWidth, Math.floor(img.naturalHeight * 0.45),
      0, 0, size, size
    );

    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    // Slightly boost the dominant channel for a more saturated glow
    const max = Math.max(r, g, b);
    const boost = 1.2;
    r = Math.min(255, Math.round(r * (max === r ? boost : 1)));
    g = Math.min(255, Math.round(g * (max === g ? boost : 1)));
    b = Math.min(255, Math.round(b * (max === b ? boost : 1)));

    return `${r},${g},${b}`;
  } catch {
    return "150,150,150";
  }
}

export function useImageColor(src: string): string | null {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setColor(null);
      return;
    }
    setColor(null);

    const img = new Image();
    // No crossOrigin needed for same-origin images — adding it can taint the canvas
    img.onload = () => {
      const c = extractDominantColor(img);
      setColor(c);
    };
    img.onerror = () => setColor("150,150,150");
    img.src = src;
  }, [src]);

  return color;
}
