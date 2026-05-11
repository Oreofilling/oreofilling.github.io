---
title: "c++STL的二分查找"
published: 2022-01-23
tags: ["C++"]
category: "C++的一些事"
draft: false
---

# C++ STL中的Binary search（二分查找）

## 一.解释

　　以前遇到二分的题目都是手动实现二分，不得不说错误比较多，关于返回值，关于区间的左闭右开等很容易出错，最近做题发现直接使用STL中的二分函数方便快捷还不会出错，不过对于没有接触过的同学，二分函数确实是一个头疼的部分，自己查的内容又有点乱，找不到具体的使用方法，有必要自己总结一份完整的以后备用。

## 二.常用操作

### 1.头文件

```cpp
#include 
```

### 2.使用方法

**a.binary_search：查找某个元素是否出现。**

a.函数模板：binary_search(arr[],arr[]+size , indx)

b.参数说明：
  arr[]： 数组首地址
  size：数组元素个数
  indx:需要查找的值

c.函数功能： 在数组中以二分法检索的方式查找，若在数组(要求数组元素非递减)中查找到indx元素则真，若查找不到则返回值为假。

**2.lower_bound：查找第一个大于或等于某个元素的位置。**
a.函数模板：lower_bound(arr[],arr[]+size , indx):
b.参数说明：
  arr[]： 数组首地址
  size：数组元素个数
  indx:需要查找的值
c.函数功能： 函数lower_bound()在first和last中的前闭后开区间进行二分查找，返回大于或等于val的第一个元素位置(注意是地址)。如果所有元素都小于val，则返回last的位置
d.举例如下：
　　一个数组number序列为：4,10,11,30,69,70,96,100.设要插入数字3,9,111.pos为要插入的位置的下标，则
　　/*注意因为返回值是一个指针，所以减去数组的指针就是int变量了*/
　　pos = lower_bound( number, number + 8, 3) - number，pos = 0.即number数组的下标为0的位置。
　　pos = lower_bound( number, number + 8, 9) - number， pos = 1，即number数组的下标为1的位置（即10所在的位置）。
　　pos = lower_bound( number, number + 8, 111) - number， pos = 8，即number数组的下标为8的位置（但下标上限为7，所以返回最后一个元素的下一个元素）。
e.注意：函数lower_bound()在first和last中的前闭后开区间进行二分查找，返回大于或等于val的第一个元素位置。**如果所有元素都小于val，则返回last的位置，且last的位置是越界的！**

　　返回查找元素的第一个可安插位置，也就是“元素值>=查找值”的第一个元素的位置

**3.upper_bound：查找第一个大于某个元素的位置。**
a.函数模板：upper_bound(arr[],arr[]+size , indx):
b.参数说明：
  arr[]： 数组首地址
  size：数组元素个数
  indx:需要查找的值
c.函数功能：函数upper_bound()返回的在前闭后开区间查找的关键字的上界，返回大于val的第一个元素位置
　　例如：一个数组number序列1,2,2,4.upper_bound(2)后，返回的位置是3（下标）也就是4所在的位置,同样，**如果插入元素大于数组中全部元素，返回的是last。(注意：数组下标越界)**
　　返回查找元素的最后一个可安插位置，也就是“元素值>查找值”的第一个元素的位置 。

## 三、代码

```cpp
#include
#include
using namespace std;
int main()
{
    int a[100]= {4,10,11,30,69,70,96,100};
    int b=binary_search(a,a+9,4);//查找成功，返回1
    cout
#include 
using namespace std;
int a[100]= {4,10,11,30,69,70,96,100};
int binarySearch(int x,int n)
{
    int left =0;
    int right=n-1;
    while(lefta[mid])
        {
            left=mid+1;
        }
        else
        {
            right =mid-1;
        }
    }
    return -1;//未找到x
}
//二分搜索递归实现
int recurisonBinarySearch(int left,int right,int x)
{
    if(left>right)
    {
        return -1;
    }
    int mid =(left+right)/2;
    if(x==a[mid])
    {
        return mid;
    }
    if(x>a[mid])
    {
        return recurisonBinarySearch(mid+1,right,x);
    }
    else
    {
        return recurisonBinarySearch(left,mid-1,x);
    }
}
int main()
{
    int x;
    int ans1,ans2;
    scanf("%d",&x);
    ans1=binarySearch(x,8);
    ans2=recurisonBinarySearch(0,7,x);
    printf("%d %d\n",ans1,ans2);
    return 0;
}
```
