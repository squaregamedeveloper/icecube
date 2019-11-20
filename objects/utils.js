export let generateID = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export function createGradient(ctx, x0, y0, x1, y1) {
  let grd = ctx.createLinearGradient(x0, y0, x1, y1);

  // Add colors
  grd.addColorStop(0.000, '#d4f1f9');
  grd.addColorStop(0.2, '#d4f1f9');
  grd.addColorStop(0.2, '#75aedc');
  grd.addColorStop(0.26, '#75aedc');
  grd.addColorStop(0.26, '#9ed8f0');
  grd.addColorStop(1, '#9ed8f0');
  return grd;
}

export function LightenDarkenColor(col, amt) {
  let num = parseInt(col, 16);
  let r = ((num >> 16) + amt) % 256;
  let b = (((num >> 8) & 0x00FF) + amt) % 256;
  let g = ((num & 0x0000FF) + amt) % 256;
  let newColor = g | (b << 8) | (r << 16);
  return "#" + newColor.toString(16);
}

export function PickEyesColor(col) {
  let num = parseInt(col.substr(1), 16);
  let r = (num >> 16);
  let b = ((num >> 8) & 0x00FF);
  let g = (num & 0x0000FF);
  let newColor = b | (r << 8) | (g << 16);
  return "#000";
  // TODO: fix this.
}
