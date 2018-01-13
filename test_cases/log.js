let log = msg => console.log(msg);

syntax m = ctx => {
  log('doing some Sweet things'); // ERROR: unbound variable `log`
  // ...
};
