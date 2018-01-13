
import { unwrap, isKeyword } from '@sweet-js/helpers' for syntax;

syntax cond = function (ctx) {
  let bodyCtx = ctx.contextify(ctx.next().value);

  let result = #``;
  for (let stx of bodyCtx) { // <2>
    if (isKeyword(stx) && unwrap(stx).value === 'case') {
      let test = bodyCtx.expand('expr').value;
      // eat `:`
      bodyCtx.next();
      let r = bodyCtx.expand('expr').value;
      result = result.concat(#`${test} ? ${r} :`);
    } else if (isKeyword(stx) && unwrap(stx).value === 'default') {
      // eat `:`
      bodyCtx.next();
      let r = bodyCtx.expand('expr').value;
      result = result.concat(#`${r}`);
    } else {
      throw new Error('unknown syntax: ' + stx);
    }
  }
  return result;
};

let x = null;

let realTypeof = cond {
  case x === null: 'null'
  case Array.isArray(x): 'array'
  case typeof x === 'object': 'object'
  default: typeof x
}
