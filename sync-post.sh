#!/bin/bash
#
# sync-post.sh - 从 Obsidian 同步文章到 Fuwari 博客
#
# 用法:
#   ./sync-post.sh              # 交互式选择文章
#   ./sync-post.sh 文件名.md     # 直接指定文件
#   ./sync-post.sh --publish     # 同步并自动 git push
#

set -e

# ===== 配置 =====
OBSIDIAN="/mnt/f/work/doc"
BLOG_DIR="/tmp/astro-blog"
POSTS_DIR="$BLOG_DIR/src/content/posts"
BLOG_FOLDER="Blog"  # Obsidian 中的博客文件夹名

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }

# 确保文章目录存在
mkdir -p "$POSTS_DIR"

# 生成 URL-safe 的 slug
to_slug() {
	echo "$1" | tr '[:upper:]' '[:lower:]' \
		| sed 's/[[:space:]]/-/g' \
		| sed 's/[\/\\:*?"<>|]//g' \
		| sed 's/\xe2\x80\x9c\|\xe2\x80\x9d//g' \
		| sed 's/--*/-/g' \
		| sed 's/^-//;s/-$//'
}

# 添加 frontmatter
add_frontmatter() {
	local file="$1"
	local title
	title=$(basename "$FILE" .md)
	local today
	today=$(date +%Y-%m-%d)

	# 创建临时文件，写入 frontmatter + 原内容
	{
		echo "---"
		echo "title: \"$title\""
		echo "published: $today"
		echo "tags: []"
		echo "category: \"\""
		echo "draft: false"
		echo "---"
		echo ""
		cat "$file"
	} > "${file}.tmp"
	mv "${file}.tmp" "$file"
}

# 处理单个文件
sync_file() {
	local src="$1"
	local filename
	filename=$(basename "$src")
	local name="${filename%.md}"
	local slug
	slug=$(to_slug "$name")
	local dest="$POSTS_DIR/${slug}.md"

	# 检查是否有 frontmatter
	if ! head -1 "$src" | grep -q "^---"; then
		warn "\"$name\" 缺少 frontmatter，自动添加..."
		add_frontmatter "$src"
	fi

	# 复制到博客目录
	cp "$src" "$dest"
	ok "已同步: $slug.md"

	# 显示 frontmatter 摘要
	echo ""
	head -10 "$dest" | grep -E "^(title|published|tags|category):" | while read -r line; do
		echo "  $line"
	done
	echo ""
}

# ===== 主流程 =====

if [ -n "$1" ]; then
	if [ "$1" = "--publish" ]; then
		# 同步 Blog 文件夹中所有文章并推送
		shift
		if [ -n "$1" ]; then
			# 指定了文件
			FILE_PATH="$1"
			[ ! -f "$FILE_PATH" ] && FILE_PATH="$OBSIDIAN/$1"
			[ ! -f "$FILE_PATH" ] && FILE_PATH="$OBSIDIAN/$BLOG_FOLDER/$1"
			[ ! -f "$FILE_PATH" ] && { echo "找不到文件: $1"; exit 1; }
			sync_file "$FILE_PATH"
		else
			# 同步整个 Blog 文件夹
			count=0
			for f in "$OBSIDIAN/$BLOG_FOLDER"/*.md; do
				[ -f "$f" ] || continue
				sync_file "$f"
				count=$((count + 1))
			done
			if [ $count -eq 0 ]; then
				warn "Blog 文件夹中没有文章"
				exit 0
			fi
			ok "共同步 $count 篇文章"
		fi

		# git commit & push
		cd "$BLOG_DIR"
		if git diff --quiet && git diff --cached --quiet; then
			info "没有变更需要提交"
		else
			git add "$POSTS_DIR"
			TODAY=$(date +%Y-%m-%d)
			git commit -m "发布文章 $TODAY"
			git push origin main
			ok "已推送到 GitHub，等待自动部署 (~2分钟)"
		fi
		exit 0
	fi

	# 指定文件名同步（不推送）
	FILE_PATH="$1"
	[ ! -f "$FILE_PATH" ] && FILE_PATH="$OBSIDIAN/$1"
	[ ! -f "$FILE_PATH" ] && FILE_PATH="$OBSIDIAN/$BLOG_FOLDER/$1"
	[ ! -f "$FILE_PATH" ] && { echo "找不到文件: $1"; exit 1; }
	sync_file "$FILE_PATH"
	info "预览: cd $BLOG_DIR && pnpm dev"
	exit 0
fi

# ===== 交互模式 =====
echo ""
echo "========== Obsidian → Blog 同步工具 =========="
echo "  Obsidian 库: $OBSIDIAN"
echo "  博客目录: $BLOG_DIR"
echo ""
echo "选择操作:"
echo "  1) 选择 Obsidian 中的文章同步"
echo "  2) 同步 Blog 文件夹所有文章并发布"
echo "  3) 仅同步 Blog 文件夹（不推送）"
echo "  4) 退出"
echo ""
read -rp "请输入 [1-4]: " choice

case $choice in
	1)
		# 列出 Obsidian 库中的 md 文件
		echo ""
		files=()
		i=1
		while IFS= read -r f; do
			rel="${f#$OBSIDIAN/}"
			echo "  $i) $rel"
			files+=("$f")
			i=$((i + 1))
		done < <(find "$OBSIDIAN" -name "*.md" -not -path "*/.obsidian/*" -not -path "*/.trash/*" | sort)

		if [ ${#files[@]} -eq 0 ]; then
			warn "没有找到 Markdown 文件"
			exit 0
		fi

		echo ""
		read -rp "选择文件编号: " num
		if [ "$num" -ge 1 ] && [ "$num" -le "${#files[@]}" ] 2>/dev/null; then
			sync_file "${files[$((num - 1))]}"
			read -rp "是否立即推送到 GitHub? [y/N] " push
			if [ "$push" = "y" ] || [ "$push" = "Y" ]; then
				cd "$BLOG_DIR"
				git add "$POSTS_DIR"
				TODAY=$(date +%Y-%m-%d)
				git commit -m "发布文章 $TODAY"
				git push origin main
				ok "已推送，等待自动部署 (~2分钟)"
			fi
		else
			echo "无效选择"
		fi
		;;
	2)
		# 同步 Blog 文件夹 + 推送
		count=0
		for f in "$OBSIDIAN/$BLOG_FOLDER"/*.md; do
			[ -f "$f" ] || continue
			sync_file "$f"
			count=$((count + 1))
		done
		if [ $count -eq 0 ]; then
			warn "Blog 文件夹中没有文章，请先将文章移到 $OBSIDIAN/$BLOG_FOLDER/"
			exit 0
		fi
		ok "共同步 $count 篇文章"

		cd "$BLOG_DIR"
		git add "$POSTS_DIR"
		TODAY=$(date +%Y-%m-%d)
		git commit -m "发布文章 $TODAY"
		git push origin main
		ok "已推送，等待自动部署 (~2分钟)"
		;;
	3)
		count=0
		for f in "$OBSIDIAN/$BLOG_FOLDER"/*.md; do
			[ -f "$f" ] || continue
			sync_file "$f"
			count=$((count + 1))
		done
		if [ $count -eq 0 ]; then
			warn "Blog 文件夹中没有文章"
		else
			ok "共同步 $count 篇文章（未推送）"
			info "预览: cd $BLOG_DIR && pnpm dev"
		fi
		;;
	*)
		echo "退出"
		;;
esac
