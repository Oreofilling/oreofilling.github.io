---
title: "c++---有关string用法总结"
published: 2021-10-30
tags: ["C++"]
category: "C++的一些事"
draft: false
---

## C++的string标准库

string是C++标准库的重要部分，主要用于字符串处理。使用string库需要在同文件中包括该库 `#include`

### 声明

```text
string s;
string ss[10];
```

### 初始化

使用等号的初始化叫做拷贝初始化，不使用等号的初始化叫直接初始化。

```text
#include
#include

using namespace std;

int main(){
    string s;               //  默认初始化，一个空白的字符串
    string s1("ssss");      // s1是字面值"ssss"的副本
    string s2(s1);          // s2是s1的副本
    string s3 = s2;         // s3是s2的副本
    string s4(10, '4');     // s4初始化
    string s5 = "Andre";    // 拷贝初始化
    string s6 = string(10, 'c');    // 可拷贝初始化，生成一个初始化好的对象，拷贝给s6

    char cs[] = "12345";
    string s7(cs, 3);       // 复制字符串cs的前三个字符到s当中

    string s8 = "abcde";
    string s9(s8, 2);

    string s10 = "asdsfasdgf";
    string s11(s10, 3, 4);  // s4是s3从下标s开始4个字符的拷贝，超出s10.size出现未定义
    return 0;
}
```

### string类型的读入

```text
string s;
cin >> s;   //不能读入空格，以空格，制表符，回车符作为结束标志
getline(cin, s); //可以读入空格和制表符，以回车符作为结束的标志
```

### 字符串末尾添加字符

可以用+号和append()函数在函数的末尾添加字符。

```text
string s;
s += 'a';
s.append('a');
```

### sting类型变量的访问

string字符串变量访问可以采用at, operator[]来访问指定index对应的字符。其中at有越界检查,如果index越界，无论Debug还是在Release编译的环境下，程序异常跳出执行；operator[]无越界检查，如果index越界，则会取得不可预知的字符。

```text
string s("abcd");
cout 
using namespace std;
stringstream ss;
```

< sstream > 库定义了三种类：istringstream、ostringstream和stringstream，分别用来进行流的输入、输出和输入输出操作。另外，每个类都有一个对应的宽字符集版本。一般情况下使用stringstream就足够，因为字符串要频繁的涉及到输入输出。

< sstream > 使用string对象来代替字符数组，这样可以避免缓冲区溢出的危险。而且，传入参数和目标对象的类型被自动推导出来，即便使用了不正确的格式化符也没有危险。

与文件流fstream类似，通过插入器(<<)和析取器(>>)这两个运算符可以直接对stringstream上的数据输入输出，而将stringstream中的全部数据输出则是使用成员函数str()，其有两种形式：
1、void **str()** //无参形式，用于将stringstream流中的数据以string字符串的形式输出
2、void **str (const string& s)**//以字符串为参数，用以覆盖stringstream流中的数据

可以用stringstream完成int与string之间的转换 

```cpp
stringstream s1;
int i = 22;
s1 > i;
cout
