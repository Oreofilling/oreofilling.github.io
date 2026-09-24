---
title: "关于C函数的实现"
published: 2022-01-23
tags: ["C++"]
category: "C++的一些事"
draft: false
description: "几个常见 C 函数的实现思路与原理分析。"
image: "assets/images/covers/cpp.jpg"
---

一些关于c函数的实现，后面慢慢补…

1.memcpy函数

```c
void memcpy(void*psrc,void*pdst,size_t length)
{
    if(psrc == NULL || pdst == NULL)
        return;

    char*d = NULL;
    char*s = NULL;

    if(pdst > psrc + length || pdst
