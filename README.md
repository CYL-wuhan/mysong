# 个人创作集 · 部署与维护指南

一个**零依赖、纯静态**的个人作品集网站：展示音乐创作、绘画作品与个人介绍，
所有内容由一个数据文件驱动，改完推送到仓库即可自动重新上线。

---

## 一、项目结构

```
.
├── index.html              # 页面骨架（一般不用改）
├── content.json            # ★ 线上内容数据源（由 /admin 后台管理）
├── assets/
│   ├── css/style.css       # 样式 + 三套主题（极简 / 活力 / 暗夜）
│   ├── js/
│   │   ├── content.js      # 本地预览兜底数据（file:// 用，线上不用改）
│   │   └── main.js         # 渲染脚本（读取 content.json）
│   ├── img/                # 头像、作品占位图
│   ├── uploads/            # 后台上传的图片/音频实际存放处
│   └── audio/              # 音乐文件
├── admin/
│   ├── index.html          # 后台入口
│   └── config.yml          # Decap CMS 配置
└── README.md               # 本文件
```

---

## 二、风格（已锁定：活力）

默认风格已锁定为 **`b` 现代活力风**（浅底 + 紫橙渐变，年轻明快）。
打开网站后右下角仍有「极简 / 活力 / 沉浸」三个按钮，访客可**实时切换**预览，
选择会被记在各自浏览器里（localStorage），不影响全站默认风格。

- `a` = 极简编辑风（黑白 + 陶土红，文艺克制）
- `b` = 现代活力风（浅底 + 紫橙渐变，年轻明快）★ 当前默认
- `c` = 暗夜沉浸风（深底 + 紫青辉光，最适合突出作品本身）

> 想换默认风格：把 `index.html` 顶部 `<html data-theme="b">` 改成 `a` 或 `c` 即可。

---

## 三、本地预览（上线前先看看）

最简单：双击 `index.html` 用浏览器打开即可。
或用本地服务器（更贴近真实环境，避免个别浏览器对本地文件的限制）：

```bash
# 在仓库根目录执行其一：
python3 -m http.server 8080
# 或
npx serve .
```

然后浏览器访问 `http://localhost:8080`。

---

## 四、部署上线（公网可访问）

下面四选一，**全部免费**、都支持「推送即自动部署」。
- 想要**网页后台 /admin 上传**（本项目的核心诉求）→ 选 **方案 B：Netlify 连接 Git 仓库**（自带 Identity 登录，零配置）。
- 只想纯静态托管、手动改文件 → 选 **方案 A：Cloudflare Pages**（国内访问稳、自带 HTTPS、自定义域名方便）或其它。

> ⚠️ 注意：**Netlify Drop（拖文件夹）和 GitHub Pages 没有 Git 后端，无法驱动 /admin 后台**。要用后台必须走「连接 Git 仓库」的部署方式。

### 方案 A：Cloudflare Pages（纯静态托管推荐）

1. 把本项目推到 GitHub / GitLab 仓库（新建仓库，把文件夹内容上传进去）。
2. 注册登录 [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **连接到 Git**。
3. 授权并选择你的仓库。
4. 构建设置：
   - **Framework preset**：选 `None`（无框架）
   - **Build command**：留空
   - **Build output directory**：`/`（根目录，因为直接是静态文件）
5. 点 **Save and Deploy**，等待约 1 分钟，会得到一个 `xxx.pages.dev` 的公网地址。
6. （可选）绑定自己的域名：在 Pages 项目里 **Custom domains** 添加域名，按提示去域名商处加一条 **CNAME** 记录指向 `xxx.pages.dev`，Cloudflare 会自动签发 HTTPS 证书。
7. 以后每次 `git push`，Cloudflare 自动重新部署。

### 方案 B：Netlify 连接 Git 仓库（★ 用网页后台 /admin 必选）

> 这是能让你「登录后台、点几下就上传音乐和图片」的部署方式。
> 📘 超详细带图分步教程见 **[Netlify部署详细指南.md](Netlify部署详细指南.md)**（每一步都标了按钮位置和该填什么）。

1. 把本项目推到 GitHub 仓库（新建仓库，把文件夹内容上传进去）。
2. 打开 [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** → 选择你的 GitHub 仓库。
3. 构建设置：**Build command** 留空，**Publish directory** 填 `/`（根目录）。
4. 点 **Deploy**，约 1 分钟后得到 `xxx.netlify.app` 公网地址。
5. 开启后台登录：站点 **Site configuration → Identity → Enable Identity**；再进 **Identity → Services → Git Gateway → Enable Git Gateway**。
6. 邀请自己：进入 **Identity**，点 **Invite users** 输入你的邮箱 → 去邮箱点确认链接（或把 **Identity → Registration** 设为 Open 自行注册）。
7. 打开登录网址 👉 **`https://你的站点.netlify.app/admin`**（用自己的域名就是 `https://你的域名/admin`），点「Continue with Netlify Identity」，邮箱收魔法链接登录即可。
8. 之后：在后台改内容 → 点 **Publish** → Netlify 自动重新构建并上线。

### 方案 C：Vercel

1. 注册 [vercel.com](https://vercel.com) → **New Project** → 导入 Git 仓库（或 `vercel deploy` 拖文件夹）。
2. Framework 选 `Other`，Output Directory 默认 `/`。
3. 部署后得到 `xxx.vercel.app`，支持自定义域名与自动 HTTPS。

### 方案 D：GitHub Pages（零额外账号）

1. 仓库 **Settings → Pages**，Source 选 `main` 分支根目录。
2. 等待后访问 `https://你的用户名.github.io/仓库名/`。
3. 注意：GitHub Pages 项目页路径带子目录，若样式/图片加载异常，把 `index.html` 里资源路径改为相对路径（本模板已用相对路径，通常无需改）。

### 自定义域名 + DNS + HTTPS 通用步骤

- 在域名服务商（阿里云/腾讯云/Cloudflare/Namecheap 等）添加记录：
  - 用 Cloudflare Pages / Netlify / Vercel：加 **CNAME** 指向平台给的地址。
  - 用 GitHub Pages：加 **CNAME** 指向 `你的用户名.github.io`（并开启 Enforce HTTPS）。
- 证书：上述平台都**自动签发并续期**免费 HTTPS，无需手动操作。
- 生效时间：DNS 通常几分钟到几小时（最长 48h）。

---

## 五、以后怎么上传新作品（核心诉求）

**推荐方式一：网页后台（零代码）**
部署到 Netlify 并开启 Identity 后，打开 `https://你的站点.netlify.app/admin` 登录：
- 「个人介绍」：改姓名、头衔、标语、自我介绍、头像、联系方式。
- 「音乐作品」：点「新增」，填曲名 / 日期 / 配文，用「封面图」「音频文件」两个字段**直接上传图片和 mp3**（自动存到 `assets/uploads/`）。
- 「绘画作品」：同样点「新增」，用「图片」字段上传画作。
- 「游戏机制 · 兴趣社介绍」：填兴趣社名称、社徽、标语、介绍、招新联系方式。
- 「游戏机制作品」：点「新增」，填作品名 / 日期 / 类型（如 桌游·解谜）/ 配图 / 机制说明，可选填「玩法或试玩」外链。
- 改完点右上角 **Publish**，网站自动更新。

**方式二：手动改文件（备用 / 本地调试）**
> 设计目标：不依赖后台，直接改数据文件 + 放素材文件。

### 上传一首音乐

1. 把 mp3 放进 `assets/audio/`，例如 `assets/audio/night-train.mp3`。
2. 打开 `assets/js/content.js`，在 `music` 数组里加一条：

```js
{
  title: "夜行列车",
  date: "2026-08",
  cover: "assets/img/painting-1.svg",   // 封面图，可换成你自己的图
  src: "assets/audio/night-train.mp3",   // ★ 填刚才的文件路径
  description: "写于一次深夜的归途……"     // 配文
}
```

3. 保存 → 推送到仓库（或重新拖到 Netlify）→ 网站自动更新，出现带播放器的卡片。

### 上传一幅画

1. 把图片（jpg/png/webp）放进 `assets/img/`，例如 `assets/img/sunrise.jpg`。
2. 在 `paintings` 数组里加一条：

```js
{
  title: "清晨的窗台",
  date: "2026-07",
  img: "assets/img/sunrise.jpg",        // ★ 你的图片路径
  medium: "水彩 / 21×30cm",              // 材质尺寸，可留空
  description: "早起拉开窗帘那一瞬的光……" // 配文
}
```

### 加一个游戏机制作品

1. 把配图放进 `assets/img/`，例如 `assets/img/chain-reaction.jpg`。
2. 在 `gameMechanics` 数组里加一条：

```js
{
  title: "连锁反应",
  date: "2026-07",
  type: "桌游 / 解谜",                  // 类型，可留空
  cover: "assets/img/chain-reaction.jpg", // ★ 配图
  link: "",                             // 玩法/试玩外链，可留空
  description: "一套以触发—连锁为核心的卡牌机制……" // 机制说明 / 配文
}
```

### 改兴趣社介绍

改 `content.js` 里的 `club` 对象：`name`、`avatar`、`tagline`、`bio`、`contacts`。

### 改个人介绍 / 联系方式

改 `content.js` 里的 `profile` 对象：`name`、`title`、`tagline`、`bio`、`avatar`、`contacts` 即可。

> 图片建议：单张控制在 **300KB–1MB**、最长边 1600px 左右，网页加载更快。
> 音频建议：用 mp3，单首别太大；如需更专业可转 128–192kbps。

---

## 六、网页后台已接好（Decap CMS）

后台已集成，无需额外配置。要点：
- 入口：`https://你的站点.netlify.app/admin`（或你的自定义域名 `/admin`）。
- 登录：Netlify Identity 魔法链接，无需记密码。
- 它直接读写仓库里的 `content.json` 并触发重新部署，所以**线上内容以 `content.json` 为准**。
- 本地双击 `index.html` 预览时走 `content.js` 兜底（仅供看版式），线上内容看后台。

---

## 七、浏览量统计 & 作品留言板（新增功能）

### 1) 浏览量统计（不蒜子，已内置，零配置）
站点页脚已接入「不蒜子 busuanzi」，自动统计并展示：
- 全站总浏览量（PV）
- 全站独立访客数（UV）

部署上线后即可看到数字，**无需任何配置**。原理是引用一段公共脚本，
数据由不蒜子公共服务保存（免费、不收集隐私）。本地双击预览时显示 `0` 属正常
（脚本需要 http(s) 环境才会计数）。如未来想换成自有统计
（如 GoatCounter / Umami / 自写 Netlify Function 计数器），告诉我即可替换。

### 2) 作品留言板（Giscus，需 3 步配置）
留言基于 GitHub Discussions，安全、免费、零数据库，且**每件作品都有独立留言串**。需先在仓库侧准备：

1. **开启 Discussions**：进你的 GitHub 仓库 → **Settings** → 勾选 **Discussions**（General 分区）。
2. **安装 Giscus 应用**：打开 https://github.com/apps/giscus 点 **Install**，授权到你的账号/仓库。
3. **拿到 ID 并填入配置**：打开 https://giscus.app ，依次填写：
   - Repository：`你的用户名/你的仓库名`
   - 选一个用于留言的 Discussion 分类（可新建一个叫「留言」的分类）
   - 页面会生成 `data-repo-id` 与 `data-category-id` 两段 ID。
   然后把这两项 ID、以及仓库名，填进 `assets/js/main.js` 顶部的 `GISCUS` 配置：
   ```js
   var GISCUS = {
     repo: "你的用户名/你的仓库名",
     repoId: "MDEwOlJ...",          // 页面给出的 Repository ID
     category: "留言",
     categoryId: "DIC_kw...",       // 页面给出的 Category ID
     mapping: "specific-term"
   };
   ```
   保存并推送，刷新网站即可在「留言板」区与每件作品下看到留言框。

**使用说明**
- 访客需用自己的 GitHub 账号登录后才能评论（天然防垃圾）。
- 每件作品（音乐/绘画）独立留言串：点卡片上的「💬 留言」展开。
- 切换主题（极简/活力/暗夜）时，留言框配色会自动跟随。

> 注意：Giscus 与后台（/admin）一样，依赖你已按「方案 B：Netlify 连接 Git 仓库」部署。

---

## 八、部署检查清单（上线前逐项核对）

- [ ] `index.html` 的 `<title>`、`<meta name="description">` 已改成你自己的信息
- [ ] `<link rel="canonical">` 改成你的正式域名
- [ ] 已在后台（/admin）或 `content.json` 填写真实姓名、简介、联系方式
- [ ] 至少上传了 1 张头像、1 个音乐文件、1 张作品图（替换占位图）
- [ ] 已填写「游戏机制 · 兴趣社介绍」并上传至少 1 个机制作品（替换占位图）
- [ ] 本地预览三套主题都正常显示、手机端排版正常
- [ ] 部署平台显示 Deploy Success，公网地址能打开
- [ ] 已配置自定义域名并完成 HTTPS（地址栏出现小锁）
- [ ] 手机上打开测试：导航、图片、音频播放正常
- [ ] 已在 GitHub 仓库开启 Discussions，并安装 Giscus 应用
- [ ] 已把 GISCUS 的 repo / repoId / categoryId 填进 assets/js/main.js
- [ ] 页脚能看到浏览量数字（部署后才有，本地预览显示 0 属正常）
- [ ] 「留言板」区能正常加载、能提交一条测试留言

---

## 九、常见问题

- **图片/样式不显示？** 多半是路径问题。本模板全部用相对路径，只要 `index.html` 和 `assets` 文件夹保持同级就不会错。
- **音频没声音？** 确认 `src` 路径写对、文件确实在 `assets/audio/` 里；浏览器需用户点击播放（自动播放被禁是正常策略）。
- **改了内容没更新？** 静态站点有缓存，强制刷新（Ctrl/Cmd+Shift+R）或等部署完成；Cloudflare/Netlify 部署有 1–2 分钟延迟。
- **想要更多板块（如「日志」「商店」）？** 告诉我，我在 `content.json` 里加一类数据、在 `main.js` 加一段渲染即可扩展（「游戏机制」栏目已内置）。
