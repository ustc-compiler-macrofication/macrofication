# Marcofication

这是一个有关于在JavaScript使用的Marcofication的项目；

## Members
|     姓名         | 学号		 |             Github       							             |职务 |
| -------------| ------------- | ---------------------------------------------------------- |-----|
|       李强	|PB15111612|[PB15111612](https://github.com/PB15111612) |队员|
| 	余浩       |PB15000372| [difftime](https://github.com/difftime)     	    |队长|
| 	周祺       |PB15050988| [ZhouQida](https://github.com/ZhouQida) 	    |队员|

## Introduction
Macrofication是运行在JavaScript语言中的一种新颖的重构过程，对于每一个pattern-template宏，他自动生成一个相应的重构工具，用于查找与宏模板相匹配的复杂片断，并用更简单的宏调用模式来替换他们；

Macrofication灵活性好，可扩展性强，在这里我们将深入研究其原理，探究其实现方式和编程模型，同时调研类似的工作和实现技术。

## Show
展示的PPT在[衔接](https://github.com/ustc-compiler-macrofication/macrofication/blob/master/11-macrofication.pptx) 中；
在展示中我们被询问Marcofication的motivation问题，由于js语言原有的一些缺憾，其对宏的支持并不友好，所以在这里Marcofication自动生成重构工具，用于查找与宏模板相匹配的复杂代码片段，并用相当简单的宏调用模式替换它们，使得代码更友好，可读性更强。
从这个项目中，我们通过深入研究Macrofication，对形式化语言的宏机制和重构过程有着更加深入的了解，同时增加了团队合作能力。


## Links
[Macrofication](https://users.soe.ucsc.edu/~cormac/papers/16esop.pdf) 

[sweetjs](https://www.sweetjs.org/doc/tutorial) 

[sweet.js-tutorials](https://github.com/jlongster/sweet.js-tutorials) 

[sweetjs-helpers](http://sweet-helpers.readthedocs.io/en/latest/) 

[edit sweetjs](http://www.sweetjs.org/browser/editor.html#macro%20foo%20%7B%0A%20%20rule%20%7B$x%7D=%3E%7B$x%7D%0A%7D%0A%0Afoo%20%22Hi%20there!%22;%0Afoo%20%22Another%20string%22;) 

[source code](https://github.com/sweet-js/sweet-core) 
