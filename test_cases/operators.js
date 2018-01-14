operator >>= left 1 = (left, right) => {
  return #`${left}.then(${right})`;
};

fetch('/foo.json') >>= resp => { return resp.json() }
                   >>= json => { return processJson(json) }

//重载操作符
//fetch("/foo.json").then(resp => {
//  return resp.json();
//}).then(json => {
//  return processJson(json);
//});
