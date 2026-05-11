---
title: "关于c++随机数的一些函数"
published: 2022-06-10
tags: ["C++"]
category: "C++的一些事"
draft: false
---

## 前言

         我们都知道由于rand()返回的是伪随机数，可以用rand()%n生成[0,n)范围内的随机数，但是最近发现它的一些缺陷，就是当需要在一个大数范围中生成一个随机数，可能达不到随机的效果，而且也不能在范围内生成浮点数。这是在c++标准库第二版看到的缺陷说明：

1.当商是小整数时，许多C++系统环境的伪随机数生成器所产生的余数并不是绝对随机的。例如当n等于2时，rand()%n连续结果就将在0和1之间选择。
2.当n的值非常大是，那么RAND_MAX（rand()返回的最大值）不会被均匀地被n除尽，一些余数出现的频率将会比其他的大。

例如：假设RAND_MAX是32767（对于任何系统环境，RAND_MAX最小的允许值）且n是20000。这样rand（）将会有两个不同的值能令rand()%n等于10000（即10000和30000），但是rand()仅有一个值能让rand()%n等于15000(就是15000)。因此，简单实现产生10000将会是15000的两倍。

其实c++11有提供相关的随机数生成函数：

#### 随机生成浮点数：

```plaintext
mt19937 gen{random_device{}()};
uniform_real_distribution dis(min,max);
double x=dis(gen);//生成[min,max]之间的浮点数
```

#### 随机生成整数：

```plaintext
mt19937 gen{random_device{}()};
uniform_int_distribution dis(min,max)；
int x=dis(gen); //生成[min,max]之间的非负整数
```

如果需要动态修改生成随机数的范围，可以这样写：

```plaintext
//1
decltype(dis.param()) new_range (min, max);
dis.param(new_range);

//2
dis(eng, decltype(dis)::param_type(min, max))
```

经验证，两种方法都可以，个人推荐第二种。
