#!/bin/bash

# 传入的项目目录
WINDOWS_PATH=$1

# 将 Windows 路径转换为 Unix 路径
PROJECT_DIR=$(echo "$WINDOWS_PATH" | sed 's#\\#/#g' | sed 's#^\([a-zA-Z]\):#/\L\1#')

# 切换到项目目录
cd "$PROJECT_DIR" || { echo "目录不存在: $PROJECT_DIR"; exit 1; }

# 获取当前分支名称
CURRENT_BRANCH=$(git symbolic-ref --short -q HEAD)

# 定义需要使用的分支
DEV_BRANCH="dev"
PRE_BRANCH="pre"

# 如果当前分支不是dev，切换到dev分支
if [ "$CURRENT_BRANCH" != "$DEV_BRANCH" ]; then
    echo "当前不在 $DEV_BRANCH 分支，切换到 $DEV_BRANCH 分支..."
    git checkout "$DEV_BRANCH" || { echo "切换到 $DEV_BRANCH 分支失败"; exit 1; }
fi

# 确保在dev分支上，拉取最新代码
echo "拉取最新的 $DEV_BRANCH 分支代码..."
git pull origin "$DEV_BRANCH" || { echo "拉取 $DEV_BRANCH 分支代码失败"; exit 1; }

# 切换到pre分支
echo "切换到 $PRE_BRANCH 分支..."
git checkout "$PRE_BRANCH" || { echo "切换到 $PRE_BRANCH 分支失败"; exit 1; }

# 将dev rebase到pre
echo "将 $DEV_BRANCH rebase 到 $PRE_BRANCH ..."
git rebase "$DEV_BRANCH" || { echo "rebase 失败"; exit 1; }

# 推送代码到远程仓库
echo "推送代码到远程仓库..."
git push origin "$PRE_BRANCH" || { echo "推送代码失败"; exit 1; }

# 切换回dev分支
echo "切换回 $DEV_BRANCH 分支..."
git checkout "$DEV_BRANCH" || { echo "切换回 $DEV_BRANCH 分支失败"; exit 1; }

echo "操作完成！"
