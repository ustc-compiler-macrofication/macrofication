# Test说明
这里给出了test文件夹里文件的说明；
sweetjs的相关文档在../doc文件夹里面有说明；
你如果想要亲身试验sweetjs，可以仿照getting_started文件里的说明在你的电脑安装它，或者你也可以使用[在线编辑网站](http://www.sweetjs.org/browser/editor.html) 来[sweet your JavaScript](https://github.com/sweet-js) ，这将免去你配置环境的苦恼；
## Macro

宏的实现多种多样，且工作原理各不相同，但是他们都完成了同样的效果：拿一大块代码，展开它转为一种不同的东西，再返回新的代码。宏在 lisp 系语言中，非常流行，因为它们的语法让宏就像从直觉自然出来的。
sweet.js 为 js 在理想和现实中找到了一个合适的方法。可以在这里 [官网](http://sweetjs.org/) 看些例子。它用了非常特殊的模式匹配语言来表达宏。

 js 语法有着自己的的不足，但是在不能破坏现有的 web 环境的前提下，加入/介绍宏就会非常难。他要保持向下的兼容性，各个浏览器厂商还有自己的想法（sweetjs就是mozilla发明的），这就是sweetjs自己要做的事。

## sweetjs
sweetjs给出了宏的使用方法，使得js语法更加灵活，他是用的一种比较直白的实现方式，就是在syntax层次定义的macro接收一个 AST, 然后做macro该干得事情. 但是操作语法树实在是太复杂了, 而sweet.js 给我们提供了一个自制js macro的工具（mozilla还用这个实现发了篇论文）。
我们已经在doc文件中有着详细的实现说明，此不赘述；
这个文件夹中存放了我们所写的test文件，后缀名可以为sjs也可以是js，这里统一为js。

## 宏的使用
sweetjs的语法和下面所给程序的不同，在未安装与nodejs的宏的相关依赖包时，你不可能使用命令行跑通下面所给的代码，在这里我们简单介绍js的Macro的使用，有关于他的高级语法不在我们的研究范围内。
一个比较简单的实现是直接用宏代表字符串：
```
macro foo {
  	rule { $x } => { $x }
}
foo "Hi there!";
foo "Another string";
```
输出将为：
```
'Hi there!';
'Another string';
```
你可以在[tutorial](http://jlongster.com/Writing-Your-First-Sweet.js-Macro#tutorial) 网站里看到他的使用，这是一个非常简单的实现；
### Multiple Patterns
宏的使用比较灵活，你可以使用多种rules and patterns
在我们所写的文档中有提到了对于重复和匹配的关系，你可以观看下面的代码，他的rule将会正确匹配所有的模式
```
macro foo {
  rule { => $x } => { $x + 'rule1' }
  rule { [$x] } => { $x + 'rule2' }
  rule { $x } => { $x + 'rule3' }
}
foo => 5;
foo 6;
foo [bar];
```
规则的顺序是严格的。这是我们要学习的模式匹配的一个基本的原则。他是从顶至底匹配的，所以更细的模式应在包容性更强的模式上面。例如，[$x] 是比 $x 更细粒度的，如果你切换他们的顺序，foo [bar]将匹配到更包容的模式，也就是说有些就匹配不到了;
### Pattern class
当你用一个模式变量 $x，他匹配任何在其位置代表的东西，无论是字符串，数组表达式,如果要限定他匹配的类型,可以指定一个特殊的解析类 parse class:
- expr 表达式
- ident 一个标识符
- lit 一段文字
使用模式解析类，当出问题的时候，你会得到很好的匹配错误警告。
```
macro foo {
  rule { $x:lit } => { $x + 'lit' }
  rule { $x:ident } => { $x + 'ident' }
  rule { $x:expr } => { $x + 'expr' }
}

foo 3;
foo "string";
foo bar;
foo [1, 2, 3];
foo baz();
```
会有
```
3 + 'lit';
'string' + 'lit';
bar + 'ident';
[
    1,
    2,
    3
] + 'expr';
baz + 'ident'();
```
在这里sweetjs是不贪婪的；

### Recursive Macros and let
而下面对于这种格式，他将会输出 ` 'expression: ' + 1 + 2 + 3;`你可以阅读我们所写的../doc/中的section3来了解其工作原理；
```
macro foo {
  rule { { $expr:expr } } => {
    foo ($expr + 3)
  }

  rule { ($expr:expr) } => {
    "expression: " + $expr
  }
}

foo { 1 + 2 }
```
### Repeated Patterns
重复模式允许一次捕获一个模式的多个实例。这时添加一个省略号...以匹配模式的重复。
对于下面的示例，这里调用...，他将会输出`wrapped(x, y, z);`
```
macro basic {
  rule { { $x (,) ... } } => {
    wrapped($x (,) ...);
  }
}
basic { x, y, z }
```
### Hygiene
sweetjs中所有的宏都是卫生的，这意味着标识符总是引用正确的东西。如果一个宏创建一个新的变量（如使用var），它只会在宏的正文中可用。它不会与使用该宏的代码中的另一个相同名称的变量冲突。
```
macro foo {
  rule { $id = $init } => {
    var $id = $init
  }
  rule { $init } => { var x = $init }
}

foo 5;
var x = 6;

foo y = 10;
var y = 11;
```
他将会输出
```
var x = 5;
var x$2 = 6;
var y = 10;
var y = 11;
```

你也想可以在js中自己定义一个class：
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