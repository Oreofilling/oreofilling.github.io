// 一次性脚本:为所有文章补充 description 与分类头图 frontmatter
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const postsDir = path.join(process.cwd(), "src", "content", "posts");

const descriptions = {
  "2022-5-15-zhousai-zongjie.md": "一次周赛的复盘笔记:每道题的思路、卡壳的地方和赛后的补题总结。",
  "begin.md": "博客的第一篇文章,从这里开始记录。",
  "cpp-changjian-wenti-1.md": "整理 C++ 学习中遇到的常见问题与易混淆点,第一期。",
  "cpp-stl-erfen-chazhao.md": "总结 STL 中的二分查找函数:lower_bound、upper_bound 与 binary_search 的用法和边界问题。",
  "cpp-string-yongfa.md": "C++ string 的常用操作总结:拼接、查找、截取与转换。",
  "cpp-suijishu-hanshu.md": "C++ 随机数相关函数的使用笔记:rand 的局限与 C++11 随机库的用法。",
  "guanyu-c-hanshu-shixian.md": "几个常见 C 函数的实现思路与原理分析。",
  "guanyu-xuedao-de-xin-dongxi.md": "近期学到的新东西汇总,零散但值得记下来的知识点。",
  "linux-wangluo-xieyi-zhan.md": "Linux 网络协议栈的入门梳理,从分层模型说起。",
  "linux-wuzhong-io-moxing.md": "五种 IO 模型的对比:阻塞、非阻塞、IO 多路复用、信号驱动与异步 IO。",
  "shuadao-de-dp-wenti.md": "刷题遇到的动态规划问题集合,附状态设计与转移思路。",
  "suibian-xiexie.md": "一段随手写下的生活随记。",
  "taojiezi-biancheng-1.md": "套接字编程入门第一篇:从 socket API 到一个最小的 TCP 例子。",
  "tu-youguan-suanfa.md": "图论相关算法整理:遍历、最短路等常用算法与实现。",
  "turan-chuxian.md": "久违的更新,记一段突然想说的话。",
  "wo-hai-huozhe.md": "冒个泡,证明博客还活着。",
  "youguan-huadong-chuangkou.md": "滑动窗口技巧总结:适用场景与模板写法。",
  "youguan-kuohao-pipei.md": "括号匹配问题的解法整理,栈的经典应用。",
};

const coverByCategory = {
  "C++的一些事": "assets/images/covers/cpp.jpg",
  算法: "assets/images/covers/algo.jpg",
  刷题日常: "assets/images/covers/practice.jpg",
  总结: "assets/images/covers/practice.jpg",
  Linux网络: "assets/images/covers/linux.jpg",
  生活: "assets/images/covers/life.jpg",
};

const files = (await readdir(postsDir)).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const full = path.join(postsDir, file);
  let text = await readFile(full, "utf8");

  if (text.includes("description:") && text.includes("image:")) {
    console.log(`skip  ${file}`);
    continue;
  }

  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    console.log(`WARN   ${file}: frontmatter not found`);
    continue;
  }

  const catMatch = text.slice(0, end).match(/^category:\s*"?(.+?)"?\s*$/m);
  const category = catMatch ? catMatch[1].trim() : "";
  const cover = coverByCategory[category] || "assets/images/covers/algo.jpg";

  const add = [];
  if (!text.slice(0, end).includes("description:")) {
    add.push(`description: "${descriptions[file] ?? ""}"`);
  }
  if (!text.slice(0, end).includes("image:")) {
    add.push(`image: "${cover}"`);
  }

  text = `${text.slice(0, end)}\n${add.join("\n")}${text.slice(end)}`;
  await writeFile(full, text, "utf8");
  console.log(`done   ${file}  <- ${cover.split("/").pop()} [${category}]`);
}
