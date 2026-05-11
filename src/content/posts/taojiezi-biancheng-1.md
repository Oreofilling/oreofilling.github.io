---
title: "套接字编程---1"
published: 2021-10-31
tags: ["Linux"]
category: "Linux网络"
draft: false
---

### 前言

认识套接字编程从套接字地址开始熟悉，这些结构可以在两个方向上传递：从进程到内核和从内核到进程。

### 一.套接字地址结构

#### 1.IPv4套接字地址结构

IPv4套接字地址结构通常也称为“网际套接字地址结构”，它以sockaddr_in命名，定义在<netinet/in.h>头文件当中，下面给出它的POSIX（可移植操作系统）定义。

```c
struct in_addr{
    in_addr_t s_addr;   //32-bit ipv4 address 网络字节序

}

struct sockaddr_in{
    uint8_t  sin_len; //length of structure
    sa_family_t sin_family; //AF_INFT
    in_port_t sin_port;  //16-bit TCP or UDP port number
                         //网络字节序
    struct in_addr   sin_addr;  //32-bit IPv4 address 网络字节序
    char             sin_zero[8];   //unused
}
```

几点说明

- 长度字段sin_len是为了增加对OSI协议的支持而随4.3BSD-Reno添加的。在此之前，第一个成员是sin_family,它是一个无符号整数。并不是所有的厂家都支持套接字地址结构的长度字段，而且POSIX规范也不要求有这个成员。

- POSIX规范只需要结构中有这三个字段：sin_family,sin_addr,sin_port。对于符合POSIX的实现来说，定义额外的结构字段是可以接受的，这对于网际套接字地址结构也是正常的、几乎所有的实现都增加了sin_zero字段，所以所有的套接字地址结构大小至少都是16字节。

- IPv4地址和TCP、UDP端口号在套接字地址结构总是以网络字节序存储。在使用这些字段时，我们必须牢记这一点。

- sin_zero字段未曾使用，不过在填写这种套接字地址结构时，我们总是把该字段置为0.

- 套接字地址仅在本主机中使用：虽然结构中的某些字段结构总是用在不同主机的通信当中，但是结构把本身并不在主机之间传递.

#### 2.通用套接字地址结构

         当作为一个参数传递进任何套接字函数时,套接字地址总是以引用形式(也就是以指向该指结构的指针)传递.然而以这样的指针作为参数之一的任何套接字函数必须处理来自所有支持的任何协议族的套接字地址结构.

          在如何声明所传递的数据类型上存在一个问题.有了ANSI C后解决问题很简单:void*指针.然而套接字函数是在ANSI C之前定义的,在1982年采取的办法是在<sys/socket.h>头文件中定义一个通用的套接字地址结构:

```c
struct sockaddr{
     uint_8  sa_len;
     sa_family_t sa_family;  //address family:AF_XXX value
     char sa_data[14];  //protocol-specific address
}
```

比如bind函数原型定义:

`int bind(int, struct sockaddr*,socklen_t)`

这就要求我们对这些函数的任何调用都必须要将指向特定于协议的套接字地址结构地方指针进行强制转换,变成指向某个通用套接字地址结构的指针,比如:

```c
struct sockaddr_in serv; //ipv4 socket address structure

/*fill in int serv()*/
bind(sockfd,(struct socketaddr *)&serv,sizeof(serv));
```

从应用程序的开发人员角度来看,这些通用套接字的地址结构**唯一用途就是用来强制转换**

#### 3.IPv6套接字地址结构

```c
struct in6_addr{
    unit8_t　　sa_addr[16];

};

#define　　SIN6_LEN

struct sockaddr_in6{
    unit8_t　　sin6_len;

    sa_family_t 　　sin6_family;

    in_port_t 　　port;

    unit32_t 　　sin6_flowinfo;

    struct in6_addr 　　sin6_addr;

    unit32-t 　　sin6_scope_id;

};
```

- IPv6的地址族为AF_INET6,而IPv4的地址族为AF_INET.

### 二.值-结果参数

      当往一个套接字函数传递一个套接字地址结构时,该结构总是以引用形式来传递,也就是说传递的是指向该结构的一个指针.该结构的长度也作为参数来传递,不过其传递方式取决于该结构的传递方向:是从进程到内核,还是从内核到进程.

  (1)从进程到内核传递套接字地址结构的函数有3个:bind,connect,sendto.这些函数的一个参数是指向某个套接字地址结构的指针,另一个参数是该结构的整数大小,例如:

```c
struct sockaddr_in serv;

connect(sockfd,(SA*)&serv,sizeof(serv));
```

既然指针和指针大小都传给了内核,于是内核知道到底需要从进程中复制多少数据进来.后面我们可以知道,套接字地址大小的数据类型其实是socklen_t,而不是int,不过POSIX规范建议将socklen_t定义为int.

(2)从内核到进程的传递套接字地址结构的函数有4个:accept,recvfrom,getsockname和getpeername.这四个函数的其中两个参数是指向某个套接字地址结构的指针和指向表示该结构大小的整数变量的指针.例如:

```c
struct sockaddr_in cli;
socklen_t len;

len = sizeof(cli);
getpeername(fd,(SA*)&cli,&len);
```

其中把套接字地址结构大小这个参数从一个整数改为指向某个整数的指针的原因在于:当函数被调用时,结构大小是一个值,它会告诉内核的大小,这样内核在写该结构的时候就不会越界;当函数返回时,结构大小又是另外一个值,它告诉进程内核在该结构中究竟储存了多少信息.这种类型的参数称为值-类型(value-result)参数.

当使用值-结果作为套接字地址结构的参数时,如果套接字地址结构是固定长度的话,那么从内核返回的值总是固定长度,例如IPv4的sockaddr_in长度为16,IPv6的sockaddr_in6的长度为28.然而对于可变长度的地址结构(比如Unix域的sockaddr_un)返回值可能小于该结构的最大长度.

后面还会遇到其他使用值-结果参数的函数

后面总结…
