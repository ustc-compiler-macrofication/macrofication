syntax let = function (ctx) {
  let ident = ctx.next().value;
  ctx.next();
  let init = ctx.expand('expr').value;
  return #`(function (${ident}) {${ctx}} )`;//
};

let bb8 = new Droid('BB-8', 'orange');
console.log(bb8.beep());
