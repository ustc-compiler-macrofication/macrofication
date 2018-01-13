syntax new = function (ctx) {
  let ident = ctx.next().value;
  let params = ctx.next().value;
  return #`${ident}.create ${params}`;
};

new Droid('BB-8', 'orange');
//Droid.create('BB-8', 'orange');
//this code will new a object;
