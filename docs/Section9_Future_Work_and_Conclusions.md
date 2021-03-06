## 未来方向

​	虽然该算法基于重构时的宏调用，但也可以用这种方法实现非宏重构。例如，标识符可以通过一个简单的、临时的、大范围的宏来重命名。

​	正如第6节所述，本文提出的宏化算法假设了一个静态的宏观环境。未来的工作可以扩展这个算法，这样它也可以重构宏定义，修改宏模板，删除重复的宏，甚至自动合成新的宏。但是，有的宏的搜索空间是巨大的，所以精心设计的搜索可以优化代码质量的某些度量。为了给程序员提供最好的宏候选者，这是必要的。

​	另外一个很有前途的研究课题是将该算法扩展到语法示例(syntax-case)宏。与模式模板(pattern-template)宏相反，语法用例宏使用生成函数而不是模板。因此，寻找重构选项需要找到可以由宏生成的语法，其等效于找到输出函数的输入。尽管这个问题的本质是不可解的，但是找到潜在宏候选者的不完整子集也是很有用的。



## 总结

​	本文提出的算法允许通过给定的模式模板宏使用宏代码进行自动重构。该算法通过一个拓展的模式匹配算法，实现了重复变量，模式和模板中的重复的正确处理。宏展开的顺序和卫生重命名( hygienic renaming)可能让当前朴素的macrofication方法产生一个不正确的结果。为了确保代码在重构前后行为不变，该算法检查执行完macrofication后，完全展开的代码和之前的代码是否是α-等价( α-equivalence )的。该算法是独立于语言的，但仅仅基于sweet.js的实现对JavaScript的macrofication进行了评估。我们使用其重构了Backbone.js，这是一个很受欢迎的JavaScript库，有上千行代码。运行时的性能表明，即使对于大型代码库，这种方法也是可行的。最后，IDE集成支持并自动化了宏开发过程，其为将来的研究提供了有希望的扩展。
