### 概述：

​	为了将原始c++语言中的宏，替换为c++11中的新语言特性，Kumar等，提出了一种宏去除(demacrofying)的自动重构工具。类似于macrofication，其同样是基于宏的相关特性，将原始代码替换为新的代码。但相反的是demacrofying的通过删除替换掉原始的宏，提高代码质量。

​	为了了解相关工作，我们查阅了macrofaction中的相关文献[51]：`Rejuvenating C++ Programs through Demacroﬁcation`。以下介绍论文的相关内容。

### 论文简述：

​	本篇论文介绍了c++种不同的宏在c++11中的替换形式，并且简单介绍了一种demacrofying的具体实现。

### 不同宏的划分：

​	为了介绍不同种宏的替换，论文将c++的宏进行了几种简单的划分。

*  是否为对象和函数(Objects and Functions)

```c++
// 对象形式
#define PI 3.14
// 函数形式 
#define SUM(A, B) ((A)+(B))

```

* 是否完整(Completeness)

如果不能将宏用c++11中的新特性表示，那么我们将该宏称为“部分”。否则，称之为"完整"。

```c++ 
//部分
#define C_MODE_START extern "C" { 
#define CONCAT(a,b) a##b
//完整
#define Z ((X)+(Y)) 
#define FUN_CALL do { f(); } while(0) 
#define TYPE_CHAR (char*)


```

* 是否存在依赖(Dependency)

如果该宏拓展开后，包含其他需要展开的宏，则存在依赖。

```c++
//存在依赖
#define __GNUG__ (__GNUC__&&__cplusplus) 
#define DIFF(A,B) (MAX((A),(B))-MIN((A),(B))) 

```

* 是否是构型的(Conﬁguration )

任何出现在条件或包含指令中的宏都是构型的。反之则不是。

```c++
//构型的
#ifdef BOOST_NO_NOEXCEPT 
//... 
#endif

```

* 是否按次序定义(Deﬁnition Order )

```c++
//未按次序定义，CEL中用到了之后定义的宏THRESH
#define SLOPE (5.0 / 9.0) 
#define CEL(T) SLOPE * (T - THRESH) 
#define THRESH 32.0
```

解决此类问题，需要定义一个宏的关系依赖图，并使用拓扑排序获得正确的结果生成顺序。

### 宏的等价替代：

​	本论文没有提供关于部分和构型的宏的相应等价替代。而对于其他大部分宏，介绍了其到c++11新特性语句的等价映射关系。以下是不同的映射关系：

####表达式别名(Expression Alias):

当一个宏的替换文本可以被识别为c++表达式，其可以用表达式别名的方式实现映射。这个宏可以是依赖或不依赖的。

此类宏的基本格式和映射结果如下：

```c++
// 宏 
#define A X
// C++11 声明
constexpr auto A = X;
```

具体实例如下：

``` c++
//宏
#define R 10 
#define PI 3.14 
#define AREA_CIRCLE PI * R * R
//C++11 声明
constexpr auto R = 10; 
constexpr auto PI = 3.14; 
constexpr auto AREA_CIRCLE = PI * R * R;

```

当宏中变量代表局部参数的时候，我们需要在适当的位置，将其转换为lambda函数(lambda function)，插入。

如下：

```c++
//转换前
#define SUM a + b
void summer() 
{
	int a = 1, b=2;
	int c = SUM; 
}
//转换后
void summer() 
{ 
	int a = 1, b=2; 
	auto SUM = [&a, &b]() { return a + b; }; 
	int c = SUM(); 
}
```

#### 类型别名(Type Alias)：

类型别名是类似于对象的宏，它的替换文本可以被识别为c++11的类型表达式。

此类宏的基本格式和映射结果如下：

```c++
// 宏 
#define A T
// C++11声明 
using A = T;
```

具体实例如下：

```c++
//转化前
#define INT_VEC vector<int> 
#define UINT unsigned int 
#define UINT_PTR UINT* 
//转换后
using INT_VEC = vector<int>; 
using UINT = unsigned int; 
using UINT_PTR = UINT*;
```

#### 参数化表达式(Parameterized Expression)：

​	展开为表达式或者语句的函数型宏，可以通过参数表达式实现映射。

​	此类宏的基本格式和映射结果如下：

```c++
// 宏 
#define F(A1, ..., An) X
// C++11 声明 template 
<typename T1, ..., typename Tn> 
auto F(T1&& A1, ..., Tn&& An) -> decltype(X) 
{ 
	return X; 
}
```

具体实例如下：

```c++
//转换前
#define MIN(A, B) ((A) < (B) ? (A) : (B))
//转换后
template <typename T1, typename T2> 
inline auto MIN(T1&& A, T2&& B) 
	-> decltype(((A) < (B) ? (A) : (B))) 
{ 
	return ((A) < (B) ? (A) : (B)); 
}
```

### 实现简述：

​	其实现由三个独立的工具组成，这些工具一同实现了宏去除的不同阶段（建议，确定，验证），如下：

​	`初始代码     ---建议--->     中间代码     ---确定--->     最终代码`

​	其中，中间代码还需要进行反复的验证，才进行最终验证这一步。

​	cpp2cxx-suggest工具根据前面几节描述的映射关系实现对宏的直接替换，将其转换成等效的c++。当自动化转换不可能或不明显时，它会向用户提供建议。该工具的应用结果是一个中间源代码和配置文件的集合。

​	cpp2cxx-validate程序提供转换建议，以找到可能的最大重构语句集合。

​	cpp2cxx- finalize程序对源代码进行中间配置和修改，并生成最终的结果。

#### 结果评估：

​	其对6个c++库进行了测试。通过该重构工具的帮助，宏的平均成功重构率达到了85%以上。