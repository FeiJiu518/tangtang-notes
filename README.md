# 🍬 糖糖便签

一款精致的桌面便签应用，帮助你管理各类信息。

![糖糖便签](./screenshots/preview.png)

## ✨ 功能特性

- 📝 **多种便签类型** - 支持文本、密码、链接、日期、消费记录 5 种类型
- 🔐 **隐私保护** - 私密便签需要 PIN 码验证，密码可设为私密
- 👥 **多用户支持** - 不同用户数据完全隔离
- 🔑 **安全机制** - 支持安全问题找回密码
- 🎨 **自定义分类** - 可自定义分类图标和颜色
- 📌 **侧边吸附** - 拖到屏幕边缘自动收缩为迷你模式，置顶显示
- 🖼️ **图片支持** - 便签支持添加图片
- 👤 **个性头像** - 支持上传并裁剪自定义头像
- 🎯 **圆角窗口** - 现代化无边框圆角设计

## 📸 截图

| 登录界面 | 主界面 | 侧边吸附 |
|---------|--------|---------|
| ![登录](./screenshots/login.png) | ![主界面](./screenshots/main.png) | ![吸附](./screenshots/collapse.png) |

## 🚀 快速开始

### 直接下载

前往 [Releases](../../releases) 页面下载最新版本的安装包。

### 从源码构建

```bash
# 克隆项目
git clone https://github.com/你的用户名/tangtang-notes.git
cd tangtang-notes

# 安装依赖
npm install

# 开发模式运行
npm run electron:dev

# 打包 Windows 版本
npm run electron:build:win

# 打包 Mac 版本
npm run electron:build:mac
```

## 🛠️ 技术栈

- **前端框架**: React 18
- **桌面框架**: Electron
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 📁 项目结构

```
tangtang-notes/
├── electron/           # Electron 主进程
│   ├── main.js        # 主进程入口
│   └── preload.js     # 预加载脚本
├── src/
│   ├── assets/        # 静态资源
│   ├── App.jsx        # 主应用组件
│   ├── main.jsx       # 渲染进程入口
│   └── index.css      # 全局样式
├── public/            # 公共资源
└── package.json
```

## 📝 便签类型说明

| 类型 | 说明 | 特殊功能 |
|-----|------|---------|
| 文本 | 普通文本便签 | 支持图片 |
| 密码 | 账号密码管理 | 可设为私密，密码隐藏显示 |
| 链接 | 网址收藏 | 一键打开链接 |
| 日期 | 重要日期提醒 | 显示倒计时/已过天数 |
| 消费 | 消费记录 | 自动统计金额 |

## 🔒 安全说明

- 所有数据存储在本地，不会上传到任何服务器
- 密码类便签支持 PIN 码二次保护
- 支持账号密码 + 安全问题双重验证
- 数据存储位置: `C:\Users\<用户名>\AppData\Roaming\tangtang-notes\`

## 📄 开源协议

[MIT License](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 💖 致谢

感谢所有使用和支持糖糖便签的朋友们！

---

如果觉得这个项目有帮助，欢迎 ⭐ Star 支持一下！
