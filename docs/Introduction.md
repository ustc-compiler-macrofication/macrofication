# Introduction
## Refactoring
重构是一种只改变代码以改善其内部结构而不改变其外部行为的过程，除了需要工程师的正确决策之外，一些好的重构工具将会提供支持和自动化检测代码异常并且选择正确的转换，以保留行为的模式执行；

下面是一个JavaScript示例，这是一个非常常用而普通的语法，他定义了一个构造函数Person，用sayHello和rename方法创建新的对象

```
function Person ( name ) {
	this.name = name ;
}
Person.prototype . sayHello = function sayHello () {
	console.log ( " Hi , I ’m " + this . name );
};
Person.prototype . rename = function rename ( n ) {
	this.name = n ;
};
```

当然你也可以用声明式类定义，这将使用一个重构工具自动执行这个转换，如下，这种类型的语法在ES6标准中被提供了支持：

```
class Person {
	constructor ( name ) {
		this.name = name ;
	}
	sayHello () {
		console.log ( " Hi , I 'm " + this . name );
	}
	rename ( n ) {
		this.name = n ;
	}
}
```

或者使用箭头语法，这更加简洁紧凑：

```
a.map ( function ( s ) { return s . length ; });// ES5 code
a.map ( s = > s . length );// equivalent ES2015 code
```

如上，我们可以看到，对现有代码执行转换的自动重构工具将是非常有帮助的；

但是，工程师不用等待浏览器的实现才能够使用这样好的语法扩展，我们下面可以看到宏系统也可以定义并且支持这种语法，比如说C和assembler中的基于字符串的宏，lisp与rust和JavaScript中的支持的parser级别的宏


## Macro
在一般的形式中，宏是语法转换器，是一种从语法到语法的函数，在编译时被evaluated。在这里，我们考虑的宏的类型是一个更受限制的形式，称为"pattern-template macros"。

在这里，我们所说的pattern-template宏是使用与语法匹配的模式和生成语法的模板定义的。模板可以通过模式变量引用在模式中匹配的语法。一旦所有的宏被扩展，所得到的程序将根据目标语言的语法和语义进行分析和评估。

在一个好的宏系统中，宏的扩展也尊重变量的范围，从而防止宏和扩展背景之间意外的名称冲突。

在这里我们将使用sweet.js，这是一个支持语法扩展的JavaScript的宏系统，比如说上面我们提到的类定义和箭头。

如下，下面是一个class macro，我们通过匹配类名与构造函数和任意数量的方法，扩展构造函数并且重复赋值给此构造函数的原型，来引入类定义的语法：

```
macro class {
	rule {
		$cname {
			constructor   $cparams 	$cbody
			$ ( $mname   $mparams        $mbody )...
		}
	} => {
			function  $cname  $cparams $cbody
			$ ( $cname.prototype.$mname = function $mparams $mbody ;)...
		}
}
function Person(name){
	this.name=name;
} 
Person.prototype.sayHello = function(){
	console.log ( " Hi , I 'm " + this . name );
};
```

## Macrofication
在这里我们将利用重构与宏观拓展的相似性，引入Macrofication，这种方法的思想是通过反向宏扩展重构。Pattern-template macros（如类定义的宏）允许算法自动发现程序中可以被相应的宏所替代的匹配。

从概念上讲，Macrofication是宏expanded的逆向;Macrofication用模板替换模式，而宏用模式替换模板。然而，由于模式和模板中的宏变量的处理不同，Macrofication需要比目前的宏系统更复杂的匹配算法。例如，变量经常在模板中重复，而当前宏系统不支持模式中的重复变量。重复引入了额外的复杂性，我们使用模式匹配算法解决这个问题，该算法将重复变量的嵌套级别考虑在内，以便使复杂的宏模板能够正确宏观化。

Macrofication应该保留程序行为。即使正确地替换了特定Macrofication所涉及的语法，周围的代码也可能导致不同的扩展，从而导致不同的程序行为。此外，Macrofication系统将宏和扩展上下文中使用的变量范围分开，因此，如果重构不考虑重命名的话，就可能会导致问题。

我们的工作将围绕着如下几方面展开：
1. 通过 Macrofication的实现，分析其原理和特点；
2. 除了扩展macrofication算法，我们还会开展一些有关于一个基于sweet.js的JavaScript工作原型的调研与使用。