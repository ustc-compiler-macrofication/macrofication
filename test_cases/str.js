import { isStringLiteral } from '@sweet-js/helpers' for syntax;

syntax m = ctx => {
  return isStringLiteral(ctx.next().value) ? #`'a string'` : #`'not a string'`;
};
m 'foo'
//这是一个有关于判断字符串的code
