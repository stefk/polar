import { compile } from "mathjs";

export function draw(
  expression,
  cartesianCtx,
  polarCtx,
  unitsPerAxe
) {
  const compiled = compile(expression);
  drawBasis(cartesianCtx);
  drawBasis(polarCtx);                                 drawCartesian(cartesianCtx, compiled, unitsPerAxe);
  drawPolar(polarCtx, compiled, unitsPerAxe);
}

function drawBasis(ctx) {
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgb(100, 100, 100)";

  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
}

function drawCartesian(ctx, expression, unitsPerAxe) {
  const halfAxe = unitsPerAxe / 2;
  const xInc = unitsPerAxe / 10000;
  const points = [];

  for (let x = -halfAxe; x < halfAxe; x += xInc) {
    const y = expression.eval({ x });
    points.push([x, y]);
  }

  drawPoints(ctx, points, unitsPerAxe);
}

function drawPolar(ctx, expression, unitsPerAxe) {
  // rough estimate of periodicity, to avoid drawing the same
  // figure over and over, which darkens the path
  const val1 = expression.eval({ x: 0 });
  const val2 = expression.eval({ x: 2 * Math.PI });
  const isPeriodic = Math.abs(val1 - val2) < 1e-14;

  const halfRot = (isPeriodic ? 1 : 100) * Math.PI;
  const rotInc = Math.PI / 500;
  const points = [];

  for (let t = -halfRot, i = 0; t < halfRot; t += rotInc, i++) {
    const r = expression.eval({ x: t });

    if (r < 0) {
      continue;
    }

    const x = r * Math.cos(t);
    const y = r * Math.sin(t);

    points.push([x, y]);
  }

   drawPoints(ctx, points, unitsPerAxe);
}

function drawPoints(ctx, points, unitsPerAxe) {
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;
  const scale = width / unitsPerAxe;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgb(0, 50, 100)";
  ctx.beginPath();

  for (let i = 0; i < points.length; ++i) {
    const [x, y] = points[i];

    if (y === Infinity || y === -Infinity) {
      ctx.stroke();
      ctx.beginPath();
      continue;
    }

    const mappedX = width / 2 + x * scale;
    const mappedY = height / 2 - y * scale;

    ctx.lineTo(mappedX, mappedY);
  }

  ctx.stroke();
}
