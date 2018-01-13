syntax m = function (ctx) {
  ctx.expand('expr');
  ctx.reset();

  const a = ctx.next().value;
  ctx.next();

  const marker = ctx.mark();
  ctx.expand('expr');
  ctx.reset(marker);

  const b = ctx.next().value;
  return #`${a} + ${b} + 24`; // 30 + 42 + 24
};
m 30 + 42 + 66
