---
title: "有关滑动窗口"
published: 2022-05-09
tags: ["算法", "刷题"]
category: "刷题日常"
draft: false
---

### 题目链接:https://leetcode-cn.com/problems/subarray-product-less-than-k/

这道题其实自己开始能想到用双指针来做,

但是自己用一个窗口来维护乘积小于k,但是在计算满足条件的个数走了弯路,自己是在刚好不满足小于k的时候来计算cnt的,这时候要考虑是否有多计算的情况,其实在窗口移动的过程中,已经可以计算了.

自己的代码:

```cpp
class Solution {
public:
    int numSubarrayProductLessThanK(vector& nums, int k) {
		int cnt=0;
		int l=0;
		int r=0;
		int lastr=-1;
		int sum=1;
		if(k==0)
		return 0;
		while(rl)
				cnt+=(r-l)*(r-l+1)/2;
				if (lastr>=l)
				cnt-=(lastr-l+2)*(lastr-l+1)/2;	//这里要减去重复的区间
				lastr=r-1;

				while(sum>=k)//这里要更新窗口左端点
				{
					sum/=nums[l];
					l++;
				}

				r++;
			}

		}

		if(r>l)
		cnt+=(r-l)*(r-l+1)/2;
		if (lastr>=l)
		cnt-=(lastr-l+2)*(lastr-l+1)/2;	

		return cnt;

    }
};
```

官方题解:

```cpp
class Solution {
public:
    int numSubarrayProductLessThanK(vector& nums, int k) {
        int n = nums.size(), ret = 0;
        int prod = 1, i = 0;
        for (int j = 0; j = k) {
                prod /= nums[i];
                i++;
            }
            ret += j - i + 1;//这里要明白这个等式是怎么来的,相当于固定了右端点.求子集个数.
        }
        return ret;
    }
};
```
