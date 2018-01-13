import { fromIdentifier } from '@sweet-js/helpers' for syntax;

syntax m = ctx => {
  let dummy = #`dummy`.get(0);

  return #`${fromIdentifier(dummy, 'bar')}`;
};
m foo
