import { unwrap, isIdentifier } from '@sweet-js/helpers' for syntax;


syntax class = function (ctx) {
  let name = ctx.next().value;
  let bodyCtx = ctx.contextify(ctx.next().value);

  // default constructor if none specified
  let construct = #`function ${name} () {}`;
  let result = #``;
  for (let item of bodyCtx) {
    if (isIdentifier(item) && unwrap(item).value === 'constructor') {
      construct = #`
        function ${name} ${bodyCtx.next().value}
        ${bodyCtx.next().value}
      `;
    } else {
      result = result.concat(#`
        ${name}.prototype.${item} = function
            ${bodyCtx.next().value}
            ${bodyCtx.next().value};
      `);
    }
  }
  return construct.concat(result);
};

class Droid {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  rollWithIt(it) {
    return this.name + " is rolling with " + it;
  }
}
//这时一个有关于在sweetjs中class的简单实现
//他将会返回：
//function Droid(name, color) {
//  this.name = name;
//  this.color = color;
//}
//
//Droid.prototype.rollWithIt = function(it) {
//  return this.name + " is rolling with " + it;
//};
