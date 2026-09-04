(() => {
  'use strict';

  /* ---------------------------------------------------------
     Demo data — three ranges, each with its own headline stats,
     a week/window of listens for the waveform, top episodes,
     and a short activity feed.
  --------------------------------------------------------- */
  const DATA = {
    7: {
      stats: { listens: '41,206', subs: '9,184', time: '36:40', revenue: '$812' },
      deltas: { listens: '▲ 6.1%', subs: '▲ 1.2%', time: '▼ 1.4%', revenue: '▲ 9.0%' },
      chart: [
        { label: 'Mon', value: 4200 },
        { label: 'Tue', value: 5100 },
        { label: 'Wed', value: 4800 },
        { label: 'Thu', value: 6300 },
        { label: 'Fri', value: 7600 },
        { label: 'Sat', value: 8900 },
        { label: 'Sun', value: 7100 },
      ],
      episodes: [
        { title: 'Ep. 12 — The Last Dispatcher', share: 32 },
        { title: 'Ep. 11 — Static on the Line', share: 24 },
        { title: 'Ep. 10 — Graveyard Shift', share: 18 },
        { title: 'Ep. 9 — Signal Lost', share: 12 },
      ],
    },
    30: {
      stats: { listens: '182,940', subs: '9,184', time: '38:12', revenue: '$3,412' },
      deltas: { listens: '▲ 12.4%', subs: '▲ 4.8%', time: '▼ 0.6%', revenue: '▲ 21.9%' },
      chart: [
        { label: 'W1', value: 38200 },
        { label: 'W2', value: 41500 },
        { label: 'W3', value: 47800 },
        { label: 'W4', value: 55440 },
      ],
      episodes: [
        { title: 'Ep. 12 — The Last Dispatcher', share: 29 },
        { title: 'Ep. 9 — Signal Lost', share: 23 },
        { title: 'Ep. 7 — Cold Open', share: 21 },
        { title: 'Ep. 11 — Static on the Line', share: 15 },
      ],
    },
    90: {
      stats: { listens: '498,120', subs: '9,184', time: '39:05', revenue: '$10,244' },
      deltas: { listens: '▲ 18.7%', subs: '▲ 15.2%', time: '▲ 2.1%', revenue: '▲ 33.4%' },
      chart: [
        { label: 'Jun', value: 138000 },
        { label: 'Jul', value: 162500 },
        { label: 'Aug', value: 197620 },
      ],
      episodes: [
        { title: 'Ep. 7 — Cold Open', share: 27 },
        { title: 'Ep. 9 — Signal Lost', share: 25 },
        { title: 'Ep. 3 — First Contact', share: 20 },
        { title: 'Ep. 12 — The Last Dispatcher', share: 16 },
      ],
    },
  };

  const ACTIVITY = [
    { user: 'Siam Ahmed', time: '4m ago', text: 'Left a 5-star review: "The sound design on this episode was unreal."' },
    { user: 'Towhid Hridoy', time: '22m ago', text: 'Subscribed after finding you through the Field Notes crossover.' },
    { user: 'Nahid Rana', time: '1h ago', text: 'Commented on Ep. 11: "Wait, is the dispatcher the same guy from S2?"' },
    { user: 'Taskin Ahmed', time: '3h ago', text: 'Shared Ep. 12 to a playlist called "commute listening".' },
    { user: 'Nazmul Shanto', time: '6h ago', text: 'Left a rating and a note about the new intro music.' },
  ];

  /* ---------------------------------------------------------
     Element refs
  --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const sidebar = $('#sidebar');
  const scrim = $('#scrim');
  const menuToggle = $('#menuToggle');
  const showSwitcher = $('#showSwitcher');
  const showList = $('#showList');
  const rangePills = $$('.pill');
  const waveform = $('#waveform');
  const waveformLabels = $('#waveformLabels');
  const tooltip = $('#chartTooltip');
  const episodeListEl = $('#episodeList');
  const activityFeedEl = $('#activityFeed');

  /* ---------------------------------------------------------
     Sidebar (mobile) open/close
  --------------------------------------------------------- */
  function openSidebar() {
    sidebar.classList.add('is-open');
    scrim.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('is-open');
    scrim.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle?.addEventListener('click', () => {
    sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });
  scrim?.addEventListener('click', closeSidebar);

  /* ---------------------------------------------------------
     Section nav (sidebar links + mobile tab bar) keep the
     clicked item highlighted and close the mobile drawer.
  --------------------------------------------------------- */
  function setActiveSection(name) {
    $$('.nav-link').forEach(a => a.classList.toggle('is-active', a.dataset.section === name));
    $$('.tab-link').forEach(a => a.classList.toggle('is-active', a.dataset.section === name));
  }
  $$('.nav-link, .tab-link').forEach(link => {
    link.addEventListener('click', () => {
      setActiveSection(link.dataset.section);
      closeSidebar();
    });
  });

  /* ---------------------------------------------------------
     Show switcher dropdown
  --------------------------------------------------------- */
  showSwitcher?.addEventListener('click', () => {
    const expanded = showSwitcher.getAttribute('aria-expanded') === 'true';
    showSwitcher.setAttribute('aria-expanded', String(!expanded));
    showList.hidden = expanded;
  });
  showList?.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    $('.show-name').textContent = li.dataset.show;
    $('.show-art').textContent = li.dataset.art;
    $('.show-highlight').textContent = li.dataset.show;
    showList.hidden = true;
    showSwitcher.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (e) => {
    if (!showSwitcher.contains(e.target) && !showList.contains(e.target)) {
      showList.hidden = true;
      showSwitcher.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------------------------------------------------
     Theme toggle (in-memory only — no persistence)
  --------------------------------------------------------- */
  const themeLabel = $('#themeLabel');
  function applyTheme(mode) {
    document.body.dataset.theme = mode;
    if (themeLabel) themeLabel.textContent = mode === 'dark' ? 'Brighten the studio' : 'Dim the studio';
  }
  function toggleTheme() {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }
  $('#themeToggleDesktop')?.addEventListener('click', toggleTheme);
  $('#themeToggleMobile')?.addEventListener('click', toggleTheme);

  /* ---------------------------------------------------------
     Render: stat cards
  --------------------------------------------------------- */
  function renderStats(range) {
    const { stats, deltas } = DATA[range];
    $('#statListens').textContent = stats.listens;
    $('#statSubs').textContent = stats.subs;
    $('#statTime').textContent = stats.time;
    $('#statRevenue').textContent = stats.revenue;

    const deltaEls = $$('.stat-delta');
    const order = ['listens', 'subs', 'time', 'revenue'];
    order.forEach((key, i) => {
      const el = deltaEls[i];
      const val = deltas[key];
      el.textContent = val;
      el.classList.toggle('up', val.includes('▲'));
      el.classList.toggle('down', val.includes('▼'));
    });
  }

  /* ---------------------------------------------------------
     Render: waveform bar chart with hover tooltip
  --------------------------------------------------------- */
  function renderChart(range) {
    const points = DATA[range].chart;
    const max = Math.max(...points.map(p => p.value));
    waveform.innerHTML = '';
    waveformLabels.innerHTML = '';

    points.forEach(point => {
      const bar = document.createElement('div');
      bar.className = 'wave-bar';
      const pct = Math.max(6, Math.round((point.value / max) * 100));
      bar.style.height = pct + '%';
      bar.dataset.label = point.label;
      bar.dataset.value = point.value.toLocaleString();

      bar.addEventListener('mouseenter', showTooltip);
      bar.addEventListener('mousemove', showTooltip);
      bar.addEventListener('mouseleave', hideTooltip);
      bar.addEventListener('focus', showTooltip);
      bar.addEventListener('blur', hideTooltip);
      bar.tabIndex = 0;

      waveform.appendChild(bar);

      const label = document.createElement('span');
      label.textContent = point.label;
      waveformLabels.appendChild(label);
    });
  }

  function showTooltip(e) {
    const bar = e.currentTarget;
    const panelRect = bar.closest('.waveform-panel').getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    tooltip.textContent = `${bar.dataset.label} · ${bar.dataset.value}`;
    tooltip.style.left = (barRect.left - panelRect.left + barRect.width / 2) + 'px';
    tooltip.style.top = (barRect.top - panelRect.top) + 'px';
    tooltip.hidden = false;
    $$('.wave-bar').forEach(b => b.classList.remove('is-hover'));
    bar.classList.add('is-hover');
  }
  function hideTooltip() {
    tooltip.hidden = true;
    $$('.wave-bar').forEach(b => b.classList.remove('is-hover'));
  }

  /* ---------------------------------------------------------
     Render: top episodes list
  --------------------------------------------------------- */
  function renderEpisodes(range) {
    const episodes = DATA[range].episodes;
    episodeListEl.innerHTML = '';
    episodes.forEach(ep => {
      const li = document.createElement('li');
      li.className = 'episode-row';
      li.innerHTML = `
        <div class="episode-row-top">
          <span class="episode-title">${ep.title}</span>
          <span class="episode-share">${ep.share}%</span>
        </div>
        <div class="episode-track"><div class="episode-fill" style="width:${ep.share}%"></div></div>
      `;
      episodeListEl.appendChild(li);
    });
  }

  /* ---------------------------------------------------------
     Render: activity feed (static across ranges)
  --------------------------------------------------------- */
  function renderActivity() {
    activityFeedEl.innerHTML = '';
    ACTIVITY.forEach(item => {
      const li = document.createElement('li');
      li.className = 'activity-item';
      li.innerHTML = `
        <div class="activity-top">
          <span class="activity-user">${item.user}</span>
          <span class="activity-time">${item.time}</span>
        </div>
        <p class="activity-text">${item.text}</p>
      `;
      activityFeedEl.appendChild(li);
    });
  }

  /* ---------------------------------------------------------
     Range pills
  --------------------------------------------------------- */
  function selectRange(range) {
    rangePills.forEach(p => p.classList.toggle('is-active', p.dataset.range === String(range)));
    renderStats(range);
    renderChart(range);
    renderEpisodes(range);
  }
  rangePills.forEach(pill => {
    pill.addEventListener('click', () => selectRange(pill.dataset.range));
  });

  /* ---------------------------------------------------------
     Init
  --------------------------------------------------------- */
  applyTheme('light');
  selectRange(30);
  renderActivity();
})();
