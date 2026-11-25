# 简历上传页 · Figma 还原（前端题）

> English version: [README.md](README.md) · 仓库：<https://github.com/lsp013/d5data-frontend-resume-upload>
>
> 在线预览：<https://lsp013.github.io/d5data-frontend-resume-upload/>（GitHub Actions 部署，push 到 `main` 自动发布）

用**纯 HTML + CSS + 原生 JavaScript**（零构建、零依赖）还原 Figma 设计稿
[`前端工程师（实习）`，frame `0:1`](https://www.figma.com/design/D0jjN7Twkq0DGm3ZJvQabz/?node-id=0-1)
里的「上传简历」这一步。

## 如何打开

```powershell
# 方式一：直接双击打开
start index.html

# 方式二：起一个静态服务器（任意一个都行）
python -m http.server 5173
# 然后访问 http://127.0.0.1:5173
```

已在 Chrome 130+ / Edge 130+ 下按 1440×900、1024×768、414×896 三个尺寸验证。

## 实现了什么

| 区域 | 说明 |
| --- | --- |
| 布局 | 左右两栏：左侧文案 + 插画，右侧上传卡片；宽度低于 960 px 自动折成上下结构 |
| 拖拽区 | 2 px 虚线边框 `#6E9BFF`、浅蓝填充、16 px 圆角，图标与两行提示居中 |
| 按钮 | `Last step`（`#75ACFF`）与 `Finish`（`#1B5AFF`），带 hover / active / focus-visible / disabled 四态 |
| 步骤条 | 三个节点：前两个打勾、第三个为当前步 `3`，浅蓝连接线 |
| 选文件 | 点击打开系统文件选择框；也支持把文件拖到区域内，拖入时整块高亮 |
| 选中反馈 | 显示文件名 + 大小（自动换算 B / KB / MB），并提供 `Remove` 清除 |
| Finish | 未选文件时给出提示；已选文件则走一段「上传中」状态后报成功 |
| 键盘 | 拖拽区是真正的 `<button>`，全部控件可 Tab 到达，聚焦环可见 |
| 动效 | 只做颜色/位移过渡，`prefers-reduced-motion` 下全部关闭 |

## 设计令牌（从设计稿采样，不是估的）

| 令牌 | 值 | 用在哪 |
| --- | --- | --- |
| 页面底色 | `#F8FBF9` | 两栏背后 |
| 卡片底色 | `#FFFFFF` | 上传卡片 |
| 主蓝 | `#1B5AFF` | `Finish`、步骤节点、当前圆点 |
| 次蓝 | `#75ACFF` | `Last step` |
| 步骤条连接线 | `#C9D8FF` | 节点之间 |
| 输入区底色 | `#F3F8FF` | 拖拽区 |
| 虚线边框 | `#6E9BFF` | 拖拽区边框 |
| 弱化文字 | `#98A2B3` | 提示文案、副标题 |
| 卡片圆角/阴影 | `24 px` / `0 20px 60px rgba(16,24,40,.08)` | 上传卡片 |

尺寸全部用 `clamp()` 绑定视口宽度，让两栏比例在约 960–1920 px 之间连续变化，
而不是在某个断点上"跳"一下。

## 目录结构

```text
index.html     语义化结构：<main>、<section>、<h1>/<h2>、<button>、带 label 的文件输入
styles.css     :root 里集中放设计令牌，类名接近 BEM，响应式规则在文件末尾
app.js         约 130 行：文件选择、拖放、文件名格式化、按钮状态
assets/
  illustration.png   从设计稿渲染图裁出的插画（见下文"与设计稿的偏差"）
```

## 与设计稿的偏差（以及原因）

1. **插画**：Figma 文件对匿名访问者只读，矢量/位图资产无法导出。插画是从渲染帧上以 3× 裁下来的
   PNG（1100×726，底色 `#F8FBF9`，因此能与页面无缝融合）。云上传、勾选等图标全部用内联 SVG 重画，
   任意缩放都清晰。
2. **批注图钉**：共享文件里有一个 Figma 评论标记（`1 朱`）压在副标题上，那是协作痕迹不是设计，
   没有复刻。
3. **字体**：文件没有暴露字体栈，页面用 `Inter → Segoe UI → system-ui` 近似，字宽与设计基本一致。
4. **步骤条语义**：设计上 1、2 已完成、第 3 步进行中；标记第三节点为 `aria-current="step"`。

## 无障碍

- 拖拽区是 `<button>`，并用 `aria-describedby` 指向提示文字，键盘可触发、会被读屏念成按钮。
- 文件输入视觉上隐藏但带 label，通过拖拽区聚焦；它是文件选择的唯一数据源。
- 状态更新用 `role="status"` + `aria-live="polite"`。
- 插画有描述性 `alt`，纯装饰图标标 `aria-hidden`。

## 有意不做的部分

不调上传后端、不接埋点、不引框架。这是 UI/UX 还原题；真要接真实 API，`app.js` 里大约十行就能接上。
