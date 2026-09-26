// Prepares display assets from a supplied raster logo.
// The artwork is never restyled, recoloured or redrawn: the supplied file is
// knocked out of its flat background, trimmed, and split into the mark and the
// wordmark so a horizontal lockup can be laid out. A white rendering for dark
// backgrounds is produced by a CSS filter on the wordmark, not by editing it.

import sharp from 'sharp';

const WHITE_CUTOFF = 235;
// Anti-aliased edge pixels are the artwork's colour blended with the white
// background. Left as they are, they draw a pale halo round the flame on any
// dark or transparent surface. Pixels this light are un-mixed from white: the
// white share becomes transparency and the colour share keeps its colour.
const FRINGE_FLOOR = 100;

export async function analyseLogo(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * channels;
    const [r, g, b] = [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    if (r > WHITE_CUTOFF && g > WHITE_CUTOFF && b > WHITE_CUTOFF) {
      pixels[offset + 3] = 0;
      continue;
    }
    const lightest = Math.min(r, g, b);
    if (lightest >= FRINGE_FLOOR) {
      const alpha = (255 - lightest) / 255;
      const unmix = (value) => Math.max(0, Math.min(255, Math.round((value - 255 * (1 - alpha)) / alpha)));
      pixels[offset] = unmix(r);
      pixels[offset + 1] = unmix(g);
      pixels[offset + 2] = unmix(b);
      pixels[offset + 3] = Math.round((pixels[offset + 3] * alpha));
    }
  }

  const opaque = (x, y) => pixels[(y * width + x) * channels + 3] > 8;

  const rowHasInk = [];
  for (let y = 0; y < height; y += 1) {
    let ink = false;
    for (let x = 0; x < width; x += 1) {
      if (opaque(x, y)) {
        ink = true;
        break;
      }
    }
    rowHasInk.push(ink);
  }

  const top = rowHasInk.indexOf(true);
  const bottom = rowHasInk.lastIndexOf(true);
  if (top < 0) throw new Error('the supplied logo appears to be blank');

  // The widest band of empty rows inside the artwork separates the mark from
  // the wordmark on a stacked logo.
  const gaps = [];
  let open = null;
  for (let y = top; y <= bottom; y += 1) {
    if (!rowHasInk[y]) {
      if (!open) open = { start: y };
    } else if (open) {
      open.end = y - 1;
      gaps.push(open);
      open = null;
    }
  }
  const split = gaps.sort((a, b) => b.end - b.start - (a.end - a.start))[0] || null;

  const columnBox = (fromY, toY) => {
    let left = width;
    let right = -1;
    for (let y = fromY; y <= toY; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (opaque(x, y)) {
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }
    return { left, right };
  };

  const transparent = await sharp(pixels, { raw: { width, height, channels } }).png().toBuffer();

  const crop = async (fromY, toY) => {
    const { left, right } = columnBox(fromY, toY);
    return sharp(transparent)
      .extract({ left, top: fromY, width: right - left + 1, height: toY - fromY + 1 })
      .png()
      .toBuffer();
  };

  const stacked = await crop(top, bottom);
  const hasSplit = Boolean(split) && split.start > top && split.end < bottom;

  return {
    stacked,
    mark: hasSplit ? await crop(top, split.start - 1) : stacked,
    wordmark: hasSplit ? await crop(split.end + 1, bottom) : null,
    split: hasSplit,
  };
}

// Renders any opaque pixel as pure white, keeping the shape and the edges.
export async function toWhite(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);
  for (let index = 0; index < info.width * info.height; index += 1) {
    const offset = index * info.channels;
    if (pixels[offset + 3] > 0) {
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
    }
  }
  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}
