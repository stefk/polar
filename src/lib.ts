import { compile, EvalFunction } from "mathjs";

export function isValidExpr(expression: string): boolean {
  try {
    const fn = compile(expression);

    return typeof fn.evaluate({ x: 1 }) === "number";
  } catch (err) {
    return false;
  }
}

export function draw(
  expression: string,
  cartesianCtx: CanvasRenderingContext2D,
  polarCtx: CanvasRenderingContext2D,
  unitsPerAxe: number
) {
  const fn = compile(expression);

  drawBasis(cartesianCtx);
  drawBasis(polarCtx);

  const cartesian = getCartesianGraph(fn, unitsPerAxe);
  const polar = getPolarGraph(fn);

  drawPoints(cartesianCtx, cartesian, unitsPerAxe);
  drawPoints(polarCtx, polar, unitsPerAxe);
}

function getCartesianGraph(
  fn: EvalFunction,
  unitsPerAxe: number
): number[][] {
  const halfAxe = unitsPerAxe / 2;
  const xInc = unitsPerAxe / 10000;
  const points = [];

  for (let x = -halfAxe; x < halfAxe; x += xInc) {
    const y = fn.evaluate({ x });
    points.push([x, y]);
  }

  return points;
}

function getPolarGraph(fn: EvalFunction): number[][] {
  // rough estimate of periodicity, to avoid drawing the same
  // figure over and over, which darkens the path
  const val1 = fn.evaluate({ x: 0 });
  const val2 = fn.evaluate({ x: 2 * Math.PI });
  const isPeriodic = Math.abs(val1 - val2) < 1e-14;

  const halfRot = (isPeriodic ? 1 : 100) * Math.PI;
  const rotInc = Math.PI / 500;
  const points = [];

  for (let t = -halfRot, i = 0; t < halfRot; t += rotInc, i++) {
    const r = fn.evaluate({ x: t });

    if (r < 0) {
      continue;
    }

    const x = r * Math.cos(t);
    const y = r * Math.sin(t);

    points.push([x, y]);
  }

   return points;
}

function drawBasis(ctx: CanvasRenderingContext2D) {
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

function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: number[][],
  unitsPerAxe: number
) {
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
