# 代码重构

​	重构(refactoring)就是通过调整程序代码改善软件的质量、性能，使其程序的设计模式和架构更趋合理，提高软件的扩展性和维护性。

####重构的原因：

​	随着不断被提出的软件需求的不断变化，原有的代码被不断修改，变得越来越难以维护 。此时便需要进行代码的重构。

#### 重构的目的：

 * 提高代码性能
* 帮助发现隐藏的代码缺陷
* 调整系统解耦，便于进一步开发
* 提高代码的可读性

#### 重构的时机：

​	当编程时，发现现有工程出现以下问题时，便需要进行重构：

* 代码中存在较多的重复
* 存在过长的类和过长的方法
* 不再便于拓展，增加一个小的功能需要大量的修改
* 类之间存在过多的参数传递
* 过渡耦合的信息链

.........

####重构的难题：

* 数据库
  * 许多程序往往与其背后的database schema紧密地联系在一起，因此难以修改。同时数据迁移也往往十分困难。
* 修改接口
  * 修改已发布的接口，因为已发布的接口会供外部人员（其它公司）使用，因此，修改接口会导致引用接口的其它程序不修改程序就无法运行。

#### 自动重构工具：

​	包括Visual Studio，Eclipse，IntelliJ IDEA等的很多集成开发环境，都已经集成了内置的自动重构工具。

​	这些工具提供了大量的重构方法的自动化实现，包括变量与方法的重命名，接口的重新生成，父类和方法的析取，资源文件的迁移等。

​	