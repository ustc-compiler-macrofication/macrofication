# Evaluation
在这里，我们对一个专门为宏定制的宏系统执行一个JavaScript库的复杂重构，以及对具有大量现有宏的JavaScript项目的案例研究，评估宏重构工具的效用和性能。
## Experimental Results
宏可以使用来扩展语言而不需要用额外的语法。对于JavaScript来说，其语法特征之一是声明式类语法。不过最新版本的JavaScript（ECMAScript 2015 / ES6 [23]）将类定义添加到语言6中。
在这里我们用Backbone.js。
[Backbone.js](http://backbonejs.org/) 是一个特别流行的JavaScript框架，它依赖于继承来集成用户提供的代码。它是开源的（你可以在github上找到他）并且有1633行代码。 Backbone.js定义的原型对象通常遵循一个简单的基于类的继承方法。因此，代码将受益于语言中的声明性类定义。
自动macrofication重构Backbone.js代码需要一个自定义的类宏，它与Backbone.js使用的具体模式匹配，并且用_.extend函数声明原型。在这里，'_'是Backbone.js库中的一个变量且具有常见的帮助函数，比如extend来为对象添加属性。由于Backbone.js代码不使用任何超级调用，因此下面显示的简单宏就足以将类去除到Backbone.js中使用的原型模式。
```
macro class {
	rule {
		$name extends Events {
			constructor $cargs $cbody
			$ ( $mname $margs $mbody ) ...
		}
	} => {
		var $name = Backbone . $name = function $cargs $cbody ;
		_ . extend ( $name . prototype , Events . prototype , {
		$(
			$mname : function $margs $mbody
		) ( ,) ...
	});
}
```
作为额外的手动重构步骤，Backbone.js代码中的非函数默认属性必须移入构造函数，因为ES2015 / ES6类语法尚不支持它们。在这个细微的代码更改之后，sweet.js宏观化成功地确定了Backbone.js中使用的所有五个原型，并且在不改变程序行为的情况下用类声明重构了这些原型。
另一个案例研究是使用开源项目[ru](http://ru-lang.org/) 进行的，这个项目是由Clojure开发的JavaScript的66个宏规则的集合。 为了重构ru-lang库，在这里我们只考虑了27条宏规则（因为macrofication工具目前不支持宏宏和自定义运算符）。 虽然该工具报告了大量正确的宏选项，但其中一些并没有改善代码质量。 例如，一些macrofication候选引入一个调用cond的宏只有一个默认的其他分支。 虽然这个macrofication正确地扩展到原来的代码，但它本质上还是用“if（true）x;”代替JavaScript语句“x;”。

如下，这里显示了使用在NodeJS v0.11.13上运行的sweet.js命令行测量的macrofication步骤和读取步骤的运行时间; 所有时间平均测量10次。对于扩展重构代码，macrofications步骤比读取/解压缩输入和加载宏环境的时间慢大约6.5到13倍。 虽然未来的优化可以提高性能，但宏观化的运行时间通常是有保证的。

|     Project    | LOC| Time to Read  | Time to Refactor  | Macros  | Macrofactions |
| -------------   | ------------- | ----------------- |-----|-----| -----|
|  Backbone.js|1633| 151ms| 984ms |1  |   5 |
|  ru-lang      |257| 1350ms   | 17921ms    | 27 | 52 | 


## Discussion
总的来说，实验结果表明，macrofications比手动重构方法具有更大的优势。
1.macrofications保证程序的行为，从而避免人为错误的风险。
2.重构的时间大部分花在了写宏的上。使用给定的宏重构代码只需要很少的手工工作，在编辑器中交互使用足够快，并且即使对于大型代码库也能很好地扩展。

但是，实验也显示了宏观化的三个局限性。
1.宏必须在重构之前预先存在或由程序员提供。
2.虽然体量比较小的宏可以是通用的，但是更大的宏可能需要专门为代码量身定制。
3.宏模板和代码之间的细微差别，例如语句顺序或附加或缺少分号的语言，可选分号等，会导致宏指令算法由于算法的严格语法等价性检查而错过潜在的重构选项。

第一个限制可以通过自动宏合成/推理算法来克服，这可能是未来研究的一个有前途的领域。
第二个限制在一定程度上适用于所有当前使用的宏系统。小的通用宏，例如循环的新语法可能是普遍适用的，但较大的宏通常是特定于代码的。为了宏观化，这既适用于模式也适用于模板。
程序员可以通过指定具有相同模式的多个宏规则来解决第三个限制，但为了在匹配过程中容忍模板和未构造代码之间的差异， 基于语言的语义来去除语法等价约束有利于行为等价。 但这很难融入到重构中，因为语义等价性通常是不可判定的。 语义等价的保守而可靠的近似比语法等价更精确可能有助于macrofications，但这仍然是未来工作的主题。