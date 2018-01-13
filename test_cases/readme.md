# Test说明
这里给出了test文件夹里文件的说明；
sweetjs的相关文档在../doc文件夹里面有说明；
你如果想要亲身试验sweetjs，可以仿照getting_started文件里的说明在你的电脑安装它，或者你也可以使用[在线编辑网站](http://www.sweetjs.org/browser/editor.html) 来[sweet your JavaScript](https://github.com/sweet-js) ，这将免去你配置环境的苦恼；
## Macro

宏的实现多种多样，且工作原理各不相同，但是他们都完成了同样的效果：拿一大块代码，展开它转为一种不同的东西，再返回新的代码。宏在 lisp 系语言中，非常流行，因为它们的语法让宏就像从直觉自然出来的。
sweet.js 为 js 在理想和现实中找到了一个合适的方法。可以在这里 [官网](http://sweetjs.org/) 看些例子。它用了非常特殊的模式匹配语言来表达宏。

 js 语法有着自己的的不足，但是在不能破坏现有的 web 环境的前提下，加入/介绍宏就会非常难。他要保持向下的兼容性，各个浏览器厂商还有自己的想法（sweetjs就是mozilla发明的），这就是sweetjs自己要做的事。

## sweetjs
sweetjs给出了宏的使用方法，使得js语法更加灵活，他是用的一种比较直白的实现方式，就是在syntax层次定义的macro接收一个 AST, 然后做macro该干得事情. 但是操作语法树实在是太复杂了, 而sweet.js 给我提供了一个自制js macro的工具（mozilla还用这个实现发了篇论文）。
我们已经在doc文件中有着详细的实现说明，此不赘述；
这个文件夹中存放了我们所写的test文件，后缀名可以为sjs也可以是js，这里统一为js。

## 宏的使用
sweetjs的语法和下面所给程序的不同，在未安装与nodejs的相关依赖包时，你不可能使用命令行跑通下面所给的代码，我们只是为了让你更好的理解sweetjs的原理，过于侧重这一点将与我们的主题macrofaction不符。
比如说你想要在js中自己定义一个class，就可以这样做：
```
macro class {
  rule {
    $className {
        constructor $cparams $cbody
        $($mname $mparams $mbody) ...
    		}
  	} => {

    function $className $cparams $cbody
	    $($className.prototype.$mname
      		= function $mname $mparams $mbody; ) ...
  	}
}
class Person {
  constructor(name) {
    this.name = name;
  }

  say(msg) {
    console.log(this.name + " says: " + msg);
  }
}
var bob = new Person("Bob");
bob.say("Macros are sweet!");
```
