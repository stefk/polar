const mathjs = require("mathjs");

(() => {
  const input = document.querySelector("input[name=expression]");
  const submit = document.querySelector("button[type=submit]");
  const canvas1 = document.querySelector("#cartesian");
  const canvas2 = document.querySelector("#polar");
  const cartesianCtx = canvas1.getContext("2d");
  const polarCtx = canvas2.getContext("2d");
  const unitsPerAxe = 8;

  const computedStyle = getComputedStyle(canvas1);
  const width = computedStyle.getPropertyValue("width");
  const height = computedStyle.getPropertyValue("height");

  canvas1.width = canvas2.width = parseInt(width);
  canvas1.height = canvas2.height = parseInt(height);

  submit.addEventListener("click", event => {
    event.preventDefault();
    draw(input.value);
  });

  draw(input.value);

  function draw(expression) {
    const compiled = mathjs.compile(expression);
    drawBasis(cartesianCtx);
    drawBasis(polarCtx);
    drawCartesian(cartesianCtx, compiled, unitsPerAxe);
    drawPolar(polarCtx, compiled, unitsPerAxe);
  }
})();

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
