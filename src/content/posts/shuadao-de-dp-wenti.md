---
title: "刷到的dp问题"
published: 2022-05-09
tags: ["算法", "刷题"]
category: "刷题日常"
draft: false
---

今天刷了几道dp问题,记一下.

1.[使序列递增的最小交换次数](https://leetcode.cn/problems/minimum-swaps-to-make-sequences-increasing/)

这道题目自己思考是完全不会做的,在看了题解之后才明白,相当于在索引i出分别计算了需要交换和不需要交换的最少交换次数,还需要考虑一点,在索引i和索引i-1处,四个数的大小关系最多只有两种(为什么?因为题目说用例保证了结果是正确的= =)

代码:

```cpp
class Solution {
public:
    int minSwap(vector& nums1, vector& nums2) {
        int m =nums1.size();
        vector change(m,INT_MAX);
        vector unchange(m,INT_MAX);
        change[0]=1;
        unchange[0]=0;
        for(int i=1;inums1[i-1] && nums2[i]>nums2[i-1])
            {
                change[i]=change[i-1]+1;
                unchange[i]=unchange[i-1];
            }

            if(nums1[i]>nums2[i-1] && nums2[i] > nums1[i-1])
            {
                change[i]=min(change[i],unchange[i-1]+1);//为什么这里求最小值,因为前一种情况可能也满足
                unchange[i]=min(unchange[i],change[i-1]);
            }
        }

        return min(change.back(),unchange.back());

    }
};
```

2.[最低加油次数](https://leetcode.cn/problems/minimum-number-of-refueling-stops/)

这道题也是按我目前水平永远都想不出来的,但是看完题解之后恍然大悟,首先关于它的dp解法,能想到这种构造方法我之前是从来没有接触过的dp[i]代表加油i次所经过的最大距离= =

然后递推方程就是每经过一个加油站,说明i可以取得的值加一,然后更新[0,i+1]中的值,每多一个加油站 station[i] = (location, capacity)，如果之前可以通过加 t 次油到达这个加油站，现在就可以加 t+1 次油得到 capcity 的油量。

举个例子，原本加一次油可以行驶的最远距离为 15，现在位置 10 有一个加油站，有 30 升油量储备，那么显然现在可以加两次油行驶 45 距离。

```cpp
class Solution {
public:
    //定义dp[i],为加油i次走的最远距离
    int minRefuelStops(int target, int startFuel, vector>& stations) {
        int m=stations.size();
        long dp[m+1];
        memset(dp,0,sizeof(dp));
        dp[0]=startFuel;

        for(int i=0;i=0;j--)
        {
            if(dp[j]>=stations[i][0])//如果到达不了该站,没必要更新了
            dp[j+1]=max(dp[j+1],dp[j]+(long)stations[i][1]);
        }

        for(int i=0;i= target)
        return i;

        return -1;

    }
};
```

还有优先队列的做法也需要知道,这里需要明白一点,在油耗尽之前,选择加油站的顺序其实对结果没有影响的.

```cpp
class Solution {
public:
    int minRefuelStops(int target, int startFuel, vector>& stations) {
       stations.push_back({target,0});//这里把目的也相当于一个油量为0的加油站,简化处理
       priority_queue pq;//默认构造的是最大堆
       int cnt=0;
       int rest=startFuel;
       int last=0;
       for(auto& v:stations)
       {
           rest = rest + last - v[0];
           //当油量小于0时,需要从前面经过的加油站选择油量最大的加上知道剩余油量大于0
           while(!pq.empty() && rest
