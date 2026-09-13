// ============================================================
//  渲染脚本：读取 content.json（线上，由 /admin 后台管理）渲染页面
//  本地双击预览（file://）无法 fetch，会回退到 content.js 兜底
// ============================================================
(function () {
  'use strict';
  var root = document.documentElement;

  // ---------- 留言系统配置（Giscus，基于 GitHub Discussions） ----------
  // ⚠️ 部署后请到 https://giscus.app 填写你的仓库信息，替换下面占位值：
  //   repo       : "你的GitHub用户名/你的仓库名"
  //   repoId     : 页面给出的 Repository ID
  //   category    : 仓库里用于留言的 Discussions 分类名（需先在仓库开启 Discussions）
  //   categoryId  : 页面给出的 Category ID
  var GISCUS = {
    repo: "YOUR_USERNAME/YOUR_REPO",
    repoId: "YOUR_REPO_ID",
    category: "留言",
    categoryId: "YOUR_CATEGORY_ID",
    mapping: "specific-term"   // 每件作品用独立讨论串
  };

  function giscusDataTheme() {
    return root.getAttribute('data-theme') === 'c' ? 'dark' : 'light';
  }

  // 懒加载一条 Giscus 留言串（每个容器只加载一次）
  function loadGiscus(container, term) {
    if (!container || container.dataset.loaded === '1') return;
    container.dataset.loaded = '1';

    if (GISCUS.repo.indexOf('YOUR_') === 0) {
      var tip = document.createElement('p');
      tip.className = 'placeholder-note';
      tip.textContent = '留言功能待配置：请按 README「作品留言板（Giscus）配置」步骤填写仓库信息。';
      container.appendChild(tip);
      return;
    }

    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-repo', GISCUS.repo);
    s.setAttribute('data-repo-id', GISCUS.repoId);
    s.setAttribute('data-category', GISCUS.category);
    s.setAttribute('data-category-id', GISCUS.categoryId);
    s.setAttribute('data-mapping', GISCUS.mapping);
    s.setAttribute('data-term', term);
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', giscusDataTheme());
    s.setAttribute('data-lang', 'zh-CN');
    s.setAttribute('data-loading', 'lazy');
    container.appendChild(s);
  }

  // 主题切换时，同步更新已加载的留言框配色
  function syncGiscusTheme() {
    var theme = giscusDataTheme();
    var frames = document.querySelectorAll('iframe.giscus-frame');
    for (var i = 0; i < frames.length; i++) {
      frames[i].contentWindow.postMessage(
        { giscus: { setConfig: { theme: theme } } },
        'https://giscus.app'
      );
    }
  }

  // ---------- 主题切换（记忆到 localStorage） ----------
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('portfolio-theme', t); } catch (e) {}
    var btns = document.querySelectorAll('[data-set-theme]');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-set-theme') === t;
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    syncGiscusTheme();
  }
  try {
    var saved = localStorage.getItem('portfolio-theme');
    if (saved) applyTheme(saved);
  } catch (e) {}
  var switchBtns = document.querySelectorAll('[data-set-theme]');
  for (var i = 0; i < switchBtns.length; i++) {
    switchBtns[i].addEventListener('click', function () {
      applyTheme(this.getAttribute('data-set-theme'));
    });
  }

  // ---------- 小工具 ----------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function setText(sel, text) { var el = $(sel); if (el && text != null) el.textContent = text; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  }); }
  function card(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }

  // 给作品卡片绑定「💬 留言」展开/收起
  function attachComments(cardNode, term) {
    var toggle = cardNode.querySelector('.comment-toggle');
    var box = cardNode.querySelector('.comments');
    if (!toggle || !box) return;
    toggle.addEventListener('click', function () {
      var willOpen = box.hasAttribute('hidden');
      if (willOpen) {
        box.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        loadGiscus(box, term);
      } else {
        box.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- 渲染 ----------
  function render(data) {
    if (!data) return;
    var p = data.profile || {};

    setText('#hero-name', p.name);
    setText('#hero-title', p.title);
    setText('#hero-tagline', p.tagline);
    var heroAvatar = $('#hero-avatar');
    if (heroAvatar) {
      heroAvatar.src = p.avatar || 'assets/img/avatar.svg';
      heroAvatar.alt = (p.name || '我') + ' 头像';
    }

    setText('#about-name', p.name ? ('关于 ' + p.name) : '关于我');
    setText('#about-bio', p.bio);
    var aboutAvatar = $('#about-avatar');
    if (aboutAvatar) {
      aboutAvatar.src = p.avatar || 'assets/img/avatar.svg';
      aboutAvatar.alt = (p.name || '我') + ' 头像';
    }

    var contacts = $('#contacts');
    if (contacts && isArr(p.contacts)) {
      contacts.innerHTML = '';
      p.contacts.forEach(function (c) {
        if (!c || !c.label) return;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = c.url || '#';
        a.textContent = c.label;
        a.target = '_blank';
        a.rel = 'noopener';
        li.appendChild(a);
        contacts.appendChild(li);
      });
    }

    // 音乐
    var musicWrap = $('#music-list');
    if (musicWrap && isArr(data.music)) {
      musicWrap.innerHTML = '';
      data.music.forEach(function (m) {
        if (!m || !m.title) return;
        var node = card(
          '<article class="card music-card">' +
            '<img class="thumb" alt="' + esc(m.title) + ' 封面" />' +
            '<div class="body">' +
              '<h3>' + esc(m.title) + '</h3>' +
              (m.date ? '<p class="meta">' + esc(m.date) + '</p>' : '<p class="meta"></p>') +
              (m.description ? '<p class="desc">' + esc(m.description) + '</p>' : '') +
              '<div class="audio-slot"></div>' +
              '<button type="button" class="comment-toggle" aria-expanded="false" data-term="music::' + esc(m.title) + '">💬 留言</button>' +
              '<div class="comments" hidden></div>' +
            '</div>' +
          '</article>'
        );
        var img = node.querySelector('.thumb');
        if (img) img.src = m.cover || 'assets/img/painting-1.svg';
        var slot = node.querySelector('.audio-slot');
        if (slot) {
          if (m.src) {
            var audio = document.createElement('audio');
            audio.controls = true;
            audio.preload = 'none';
            audio.src = m.src;
            audio.setAttribute('aria-label', m.title + ' 试听');
            slot.appendChild(audio);
          } else {
            var note = document.createElement('p');
            note.className = 'placeholder-note';
            note.textContent = '音频待上传：在后台「音乐作品」里用「音频文件」字段上传 mp3 即可。';
            slot.appendChild(note);
          }
        }
        musicWrap.appendChild(node);
        attachComments(node, 'music::' + m.title);
      });
    }

    // 绘画
    var galWrap = $('#gallery-list');
    if (galWrap && isArr(data.paintings)) {
      galWrap.innerHTML = '';
      data.paintings.forEach(function (art) {
        if (!art || !art.title) return;
        var meta = [art.date, art.medium].filter(Boolean).join(' · ');
        var node = card(
          '<article class="card">' +
            '<img class="thumb" alt="' + esc(art.title) + ' 作品图" />' +
            '<div class="body">' +
              '<h3>' + esc(art.title) + '</h3>' +
              (meta ? '<p class="meta">' + esc(meta) + '</p>' : '<p class="meta"></p>') +
              (art.description ? '<p class="desc">' + esc(art.description) + '</p>' : '') +
              '<button type="button" class="comment-toggle" aria-expanded="false" data-term="painting::' + esc(art.title) + '">💬 留言</button>' +
              '<div class="comments" hidden></div>' +
            '</div>' +
          '</article>'
        );
        var img = node.querySelector('.thumb');
        if (img) img.src = art.img || 'assets/img/painting-1.svg';
        galWrap.appendChild(node);
        attachComments(node, 'painting::' + art.title);
      });
    }

    // 兴趣社介绍（游戏机制栏目）
    var clubWrap = $('#club');
    if (clubWrap && data.club) {
      var c = data.club;
      clubWrap.innerHTML = '';
      var cnode = card(
        '<div class="club-intro">' +
          '<img class="club-avatar" alt="兴趣社社徽" />' +
          '<div>' +
            '<h3 class="club-name"></h3>' +
            '<p class="club-tagline"></p>' +
            '<p class="club-bio"></p>' +
            '<ul class="contacts club-contacts"></ul>' +
          '</div>' +
        '</div>'
      );
      var cavatar = cnode.querySelector('.club-avatar');
      if (cavatar) cavatar.src = c.avatar || 'assets/img/club.svg';
      var cname = cnode.querySelector('.club-name');
      if (cname) cname.textContent = c.name || '兴趣社';
      var ctag = cnode.querySelector('.club-tagline');
      if (ctag) ctag.textContent = c.tagline || '';
      var cbio = cnode.querySelector('.club-bio');
      if (cbio) cbio.textContent = c.bio || '';
      var ccontacts = cnode.querySelector('.club-contacts');
      if (ccontacts && isArr(c.contacts)) {
        c.contacts.forEach(function (cc) {
          if (!cc || !cc.label) return;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = cc.url || '#';
          a.textContent = cc.label;
          a.target = '_blank';
          a.rel = 'noopener';
          li.appendChild(a);
          ccontacts.appendChild(li);
        });
      }
      clubWrap.appendChild(cnode);
    }

    // 游戏机制作品
    var gameWrap = $('#games-list');
    if (gameWrap && isArr(data.gameMechanics)) {
      gameWrap.innerHTML = '';
      data.gameMechanics.forEach(function (g) {
        if (!g || !g.title) return;
        var gmeta = [g.date, g.type].filter(Boolean).join(' · ');
        var gnode = card(
          '<article class="card game-card">' +
            '<img class="thumb" alt="' + esc(g.title) + ' 配图" />' +
            '<div class="body">' +
              '<h3>' + esc(g.title) + '</h3>' +
              (gmeta ? '<p class="meta">' + esc(gmeta) + '</p>' : '<p class="meta"></p>') +
              (g.description ? '<p class="desc">' + esc(g.description) + '</p>' : '') +
              (g.link ? '<a class="btn ghost game-link" href="' + esc(g.link) + '" target="_blank" rel="noopener">查看玩法 / 试玩 ↗</a>' : '') +
              '<button type="button" class="comment-toggle" aria-expanded="false" data-term="game::' + esc(g.title) + '">💬 留言</button>' +
              '<div class="comments" hidden></div>' +
            '</div>' +
          '</article>'
        );
        var gimg = gnode.querySelector('.thumb');
        if (gimg) gimg.src = g.cover || 'assets/img/painting-1.svg';
        gameWrap.appendChild(gnode);
        attachComments(gnode, 'game::' + g.title);
      });
    }

    var yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // 线上内容加载失败时，显示可见的红色警告条（避免无声回退到旧占位数据）
  function showContentError(msg) {
    var el = document.getElementById('content-error');
    if (!el) {
      el = document.createElement('div');
      el.id = 'content-error';
      el.className = 'content-error';
      el.setAttribute('role', 'alert');
      var main = document.querySelector('main') || document.body;
      main.insertBefore(el, main.firstChild);
    }
    el.textContent = '⚠️ 内容加载失败：content.json ' + msg +
      '。请确认文件是 UTF-8 编码且为合法 JSON，再重新部署。';
  }

  // ---------- 加载内容：优先 content.json（后台管理），失败回退 content.js ----------
  function load() {
    var fallback = window.SITE_CONTENT || null;
    fetch('content.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) { render(json); })
      .catch(function (err) {
        // 线上（非 file://）加载失败给出可见提示；本地双击预览才静默回退
        if (location.protocol !== 'file:') {
          showContentError((err && err.message) ? err.message : '解析出错');
        }
        render(fallback);
      })
      .then(function () {
        var box = document.getElementById('guestbook-comments');
        if (box) loadGiscus(box, 'guestbook');
      });
  }
  load();
})();
