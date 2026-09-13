// ============================================================
//  站点内容数据 —— 你以后只需要修改这个文件就能更新网站
// ------------------------------------------------------------
//  • 个人介绍：改下面的 profile
//  • 音乐作品：往 music 数组里加一条（见下方示例注释）
//  • 绘画作品：往 paintings 数组里加一条
//  • 游戏机制：改 club（兴趣社介绍）+ 往 gameMechanics 数组里加一条
//  改完保存 + 推送到仓库，网站会自动重新部署（详见 README.md）
// ============================================================
window.SITE_CONTENT = {
  // -------- 个人介绍 --------
  profile: {
    name: "陈熠乐",
    title: "独立音乐人 · 绘画爱好者",
    avatar: "assets/img/avatar.svg",
    tagline: "用旋律记录情绪，用画笔留住光影。",
    bio:
      "我是陈熠乐，一名即将毕业的设计专业学生。平日里喜欢写歌、画画，把生活里细碎的灵感收进作品里。" +
      "这里收录了我的日常创作——不定时更新，欢迎随意逛逛。",
    contacts: [
      { label: "邮箱", url: "mailto:you@example.com" },
      { label: "网易云音乐", url: "#" },
      { label: "微博", url: "#" }
    ]
  },

  // -------- 音乐作品 --------
  // 字段说明：
  //   title       作品名（必填）
  //   date        创作月份，如 "2026-08"（可选）
  //   cover       封面图路径（可选，不填用占位图）
  //   src         音频文件路径，如 "assets/audio/night-train.mp3"（放好文件后填写）
  //   description 配文（可选）
  music: [
    {
      title: "夜行列车",
      date: "2026-08",
      cover: "assets/img/painting-1.svg",
      src: "", // 示例：把 mp3 放进 assets/audio/ 后写 "assets/audio/night-train.mp3"
      description: "写于一次深夜的归途，吉他扫弦配上环境噪底，记录车厢里摇晃的灯光。"
    },
    {
      title: "雨后阳台",
      date: "2026-06",
      cover: "assets/img/painting-2.svg",
      src: "",
      description: "一段简单的钢琴循环，像下雨后天台上的水汽慢慢散开。"
    },
    {
      title: "给春天的便签",
      date: "2026-03",
      cover: "assets/img/painting-3.svg",
      src: "",
      description: "用手机录的人声哼唱 + 轻打击，最随意的一首小样。"
    }
  ],

  // -------- 绘画作品 --------
  // 字段说明：
  //   title       作品名（必填）
  //   date        创作月份（可选）
  //   img         图片路径，如 "assets/img/sunrise.jpg"
  //   medium      材质/尺寸说明，如 "水彩 / 21×30cm"（可选）
  //   description 配文（可选）
  paintings: [
    {
      title: "清晨的窗台",
      date: "2026-07",
      img: "assets/img/painting-2.svg",
      medium: "水彩 / 21×30cm",
      description: "早起拉开窗帘那一瞬的光，想留住它。"
    },
    {
      title: "旧巷口的猫",
      date: "2026-05",
      img: "assets/img/painting-1.svg",
      medium: "速写 / 数码",
      description: "小区楼下总来蹭饭的那只，画了第三遍才像。"
    },
    {
      title: "海边的傍晚",
      date: "2026-04",
      img: "assets/img/painting-3.svg",
      medium: "丙烯 / 30×40cm",
      description: "毕业旅行随手拍的照片，回来照着画的。"
    }
  ],

  // -------- 游戏机制 · 兴趣社介绍 --------
  club: {
    name: "游戏机制兴趣社",
    avatar: "assets/img/club.svg",
    tagline: "用规则与系统，设计好玩的体验。",
    bio:
      "这是我们学校的兴趣社，成员来自不同专业，一起研究桌游、解谜与互动装置的机制设计，" +
      "偶尔也做小型展出与试玩会。下面收录了社团近期的机制作品，以及我个人参与设计的部分。",
    contacts: [
      { label: "招新邮箱", url: "mailto:club@example.com" },
      { label: "社团主页", url: "#" }
    ]
  },

  // -------- 游戏机制作品 --------
  // 字段说明：
  //   title       作品名（必填）
  //   date        创作月份（可选）
  //   type        类型，如 "桌游 / 解谜"（可选）
  //   cover       配图路径（可选，不填用占位图）
  //   link        玩法/试玩外链（可选，可留空）
  //   description 机制说明 / 配文（可选）
  gameMechanics: [
    {
      title: "连锁反应",
      date: "2026-07",
      type: "桌游 / 解谜",
      cover: "assets/img/painting-1.svg",
      link: "",
      description: "一套以「触发—连锁」为核心的卡牌机制，每张卡牌的效果会引动下一张，强调玩家之间的因果博弈与节奏掌控。"
    },
    {
      title: "失重花园",
      date: "2026-05",
      type: "互动装置",
      cover: "assets/img/painting-2.svg",
      link: "",
      description: "用悬挂模块与重力感应做的空间交互：观众拨动一端，另一端会延时响应，像在照顾一座会呼吸的花园。"
    }
  ]
};
