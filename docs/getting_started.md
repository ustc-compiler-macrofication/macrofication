# START
## 简单介绍
 重构是在开发时进行的代码转换，在保持其可观察行为的同时提高了代码的质量。
 宏也是代码转换，但在编译时执行，用相应的宏体或模板替换宏调用模式的实例。
在这里，我们将对于每个pattern-template宏，我们可以自动生成一个相应的重构工具，用于查找与宏模板相匹配的复杂代码片段，并用相当简单的宏调用模式替换它们;这个新颖的重构过程为Macrofication。
从概念上讲，Macrofication涉及到反向运行宏观扩展，但是，它确实需要更复杂的模式匹配算法和附加检查来确保重构始终保留程序行为。
这里有一个实现在JavaScript的Macrofication工具，叫做sweet.js，将其整合到一个开发环境中，并通过重构进行评估。在这里，sweet.js对于复杂的重构也足够的灵活性，同时即使对于较大的代码库也能很好地运行。

## 安装 sweet.js（暂行）
在[官网](https://www.sweetjs.org/) 上给了安装方案，但是需要配置一些环境；
下面所说的示例均在linux环境上：

sweet.js需要安装相应nodejs包，这里的nodejs版本必须是7.0.0以上，所以不能使用直接apt install安装：

```
sudo apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```
这里安装的是nodejs9.0版本；
之后安装npm；
```
sudo apt install npm
```
这时你就可以安装sweet.js

```
sudo npm install -g @sweet-js/cli @sweet-js/helpers
```

这里也可能有一些版本问题，比如说minimatch默认安装版本为0.2.14，但实际要求为3.0.2+，graceful-fs为1.2.3，实际要求依赖关系为3.0.0，这里以minimatch为例，你可以使用`npm -v  minimatch`等命令去查看其版本，之后采用`sudo npm install -g npm@3`安装；

等你安装完毕后就可以使用sjs命令，下面给出一个实例：
```
// sweet_code.js
syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
};
hi
```
使用命令运行：
```
$ sjs sweet_code.js
console.log('hello, world!')
```
他会输出`console.log('hello, world!')`，这是宏扩展之后的结果。