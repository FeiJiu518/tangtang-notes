# 应用图标

请将你的应用图标（.ico 格式，建议 256x256 像素）放在此目录并命名为 `icon.ico`。

## 如何创建 .ico 图标

1. 准备一张 256x256 的 PNG 图片
2. 使用在线转换工具：
   - https://convertio.co/png-ico/
   - https://cloudconvert.com/png-to-ico
3. 将转换后的 .ico 文件放在此目录

## 临时解决方案

如果没有图标，可以先移除 package.json 中的 icon 配置，构建时会使用默认图标：

```json
"win": {
  "target": [...],
  // "icon": "public/icon.ico"  // 注释掉这行
}
```
