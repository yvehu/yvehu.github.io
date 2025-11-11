# 推送代码到 GitHub 的步骤：

# 1. 添加远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名 yvehu）
git remote add origin https://github.com/yvehu/yvehu.git

# 2. 推送代码到 GitHub
git push -u origin main

# 如果遇到认证问题，可以使用 GitHub CLI 或者设置 Personal Access Token
# 使用 GitHub CLI:
# gh auth login
# git push -u origin main

# 或者使用 Personal Access Token:
# 1. 访问 https://github.com/settings/tokens
# 2. 生成一个新的 token (classic)，勾选 repo 权限
# 3. 使用 token 作为密码推送

