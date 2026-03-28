#!/bin/bash
# 压缩 demos 目录下所有图片为 webp 格式
# 使用 cwebp 工具，保留原文件，生成同名 .webp 文件后删除原图

set -e

DEMOS_DIR="$(cd "$(dirname "$0")/../demos" && pwd)"
QUALITY=80
COUNT=0
SKIP=0

echo "[compress] 扫描 $DEMOS_DIR 下的图片..."

find "$DEMOS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.bmp" \) | while read -r img; do
  webp="${img%.*}.webp"

  # 如果 webp 已存在且比原图新，跳过
  if [ -f "$webp" ] && [ "$webp" -nt "$img" ]; then
    SKIP=$((SKIP + 1))
    continue
  fi

  echo "[compress] $img → $webp"
  cwebp -q "$QUALITY" "$img" -o "$webp" -quiet

  # 压缩成功后删除原图
  if [ -f "$webp" ]; then
    rm "$img"
    COUNT=$((COUNT + 1))
  fi
done

echo "[compress] 完成，共压缩 $COUNT 张图片"
