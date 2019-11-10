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

