---
title: "关于学到的一些新东西"
published: 2022-06-05
tags: ["算法"]
category: "算法"
draft: false
---

刚刚结束了这次的周赛，最后一题还是没有写出来，但是学到了关于字符串的一些新知识：

这是原题：[https://leetcode.cn/problems/design-a-text-editor/](https://leetcode.cn/problems/design-a-text-editor/)

现在大概知道怎么做了，通过两个双端队列模拟即可，根本不需要维护光标的位置，这样思考量大大减少了。

1.c++的string也有insert和erase函数，用法和vector等容器一样，这个我以前居然不知道…

2.还有一种做法就是利用双向链表模拟，这个我就是这样做的，但是debug把自己绕糊涂了，自己对这个数据结构感觉还是比较生疏，但是学到了几个比较有用的api：next()和prev()还有advance(),    这些都是对迭代器操作的一些函数，具体用法为

advance()的函数原型

```cpp
templatevoid advance( InputIt& it, Distance n );

templateconstexpr void advance( InputIt& it, Distance n );
```

advance()的含义：
表示将输入迭代器it移动n个单位的步长，其中n可为正数与负数。注意：这里的输入迭代器为双向迭代器，即迭代器即可右移，也可左移。
若移动n个单位的步长后，超出迭代器范围[begin,end)，则此行为未定义。

advance()函数返回值：
函数返回值为void，也就是将传入的迭代器用引用的方式移动n个单位了。

next()的函数原型：

```cpp
templateForwardIt next(
	ForwardIt it, 
	typename std::iterator_traits::difference_type n = 1 );

templateconstexpr InputIt next(
	InputIt it, 
	typename std::iterator_traits::difference_type n = 1 );	
```

next()的含义：
表示迭代器右移n个单位的步长，即迭代器+n。
若移动n个单位的步长后，超出迭代器范围[begin,end)，则此行为未定义。

next()函数返回值：
函数的返回值为一个迭代器，也就是传入迭代器右移n个单位后，返回这个移动后的新迭代器，其中n=1，可以省略第二个参数。

prev()的函数原型：

```cpp
templateBidirIt prev(
  BidirIt it, 
  typename std::iterator_traits::difference_type n = 1 );

templateconstexpr BidirIt prev(
  BidirIt it, 
  typename std::iterator_traits::difference_type n = 1 );
prev()的含义：
表示迭代器左移n个单位，即迭代器-n。
若移动n个单位的步长后，超出迭代器范围[begin,end)，则此行为未定义。
```

prev()函数返回值：
函数的返回值为一个迭代器，也就是传入迭代器左移n个单位后，返回这个移动后的新迭代器，其中n=1，可以省略第二个参数。

3.有关rope的学习

```cpp
#include///头文件
using namespace __gnu_cxx;
rope  x;
int main(){
    x.push_back(x); ///在末尾加x
    x.insert(pos, x); ///在pos位置加入x
    x.erase(pos, x); ///从pos位置删除x个元素
    x.copy(pos, len, x); ///从pos开始len个元素用x代替
    x.replace(pos, x); ///从pos开始全部换为x
    x.substr(pos, x); ///提取pos开始x个元素
    x.at(x)/[x]; ///访问第x个元素
    return 0;
}
```

现在才知道c++ stl中有这么一个东西，它结合了数组和链表的优点，用于这个题非常合适，但是只适用于int和char数组。
