---
title: "[DEBUG] 深入终端：5 个基础 Linux 命令"
date: 2025-05-04 16:06:58
tags:
  - Linux
  - Terminal
  - Tutorial
  - Beginner
toc: true
---

命令行界面 (CLI) 是许多开发者和安全爱好者的主战场。它高效、强大，并且是通往系统核心的直接路径。掌握基础命令是遨游 Linux 世界的第一步，也是构筑更复杂操作的基石。

这篇文章将介绍 5 个极其基础但你每天都可能用到的 Linux 命令。如果你是新手，务必熟悉它们；如果你是老手，权当复习。

<!-- more -->

# 1. `ls` - 列出目录内容

最常用的命令之一。它能显示当前目录下（或指定目录下）的文件和文件夹。

*   **基本用法:** `ls`
*   **显示隐藏文件和详细信息:** `ls -al`

```bash
touhikari@kali:~$ ls -al /home/touhikari
total 88
drwxr-xr-x 5 touhikari touhikari 4096 Oct 29 14:00 .
drwxr-xr-x 3 root      root      4096 Oct 28 09:00 ..
-rw------- 1 touhikari touhikari 1350 Oct 29 14:15 .bash_history
-rw-r--r-- 1 touhikari touhikari  220 Oct 28 09:00 .bash_logout
-rw-r--r-- 1 touhikari touhikari 3771 Oct 28 09:00 .bashrc
drwxr-xr-x 2 touhikari touhikari 4096 Oct 28 11:00 Documents
drwxr-xr-x 2 touhikari touhikari 4096 Oct 28 11:00 Downloads
# ... 其他文件和目录
```

# 2. `cd` - 切换目录

用于在文件系统的不同目录间移动。

*   **进入子目录:** `cd Documents`
*   **返回上一级目录:** `cd ..`
*   **返回用户主目录:** `cd` 或 `cd ~`

# 3. `pwd` - 显示当前工作目录

如果你在终端里“迷路”了，不知道自己在哪，`pwd` (Print Working Directory) 会告诉你当前所在的绝对路径。

```bash
touhikari@kali:~/Documents/notes$ pwd
/home/touhikari/Documents/notes
```

# 4. `mkdir` - 创建新目录

需要一个新文件夹来存放你的项目或笔记？`mkdir` (Make Directory) 来帮忙。

*   **创建单个目录:** `mkdir my_project`
*   **递归创建多层目录:** `mkdir -p path/to/deep/folder` (如果父目录不存在也会创建)

# 5. `cat` - 查看文件内容

`cat` (Concatenate) 最常用的功能是快速查看一个文件的全部内容。对于小程序代码或配置文件很有用。

*   **查看文件:** `cat config.txt`
*   **查看并显示行号:** `cat -n script.py`

**总结**

这五个命令只是冰山一角，但它们构成了你在 Linux 终端中导航和基本操作的基础。熟练运用它们，将大大提高你的效率。下一步，可以探索 `cp` (复制), `mv` (移动/重命名), `rm` (删除), `grep` (文本搜索) 等命令。

保持好奇，不断探索。终端是你的利器。