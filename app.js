/* ============================================================
   POMO — Pomodoro Timer Application Logic
   ============================================================ */

'use strict';

/* ---------- Constants ---------- */
const RING_CIRCUMFERENCE = 2 * Math.PI * 124; // matches SVG r="124"

const MODE = {
  work:      { label: 'Focus Time',   color: '#7c6fff', dur: () => settings.work },
  break:     { label: 'Short Break',  color: '#3ecf8e', dur: () => settings.break },
  longbreak: { label: 'Long Break',   color: '#38bdf8', dur: () => settings.longbreak },
};

const LIMITS = {
  work:      { min: 1, max: 90 },
  break:     { min: 1, max: 30 },
  longbreak: { min: 1, max: 60 },
  goal:      { min: 1, max: 20 },
};

/* ---------- State ---------- */
let settings = {
  work: 25, break: 5, longbreak: 15,
  cycles: 4, goal: 8,
  autoBreak: false, autoSession: false, notifications: true,
};

let timer = {
  mode: 'work',
  running: false,
  remaining: 0,       // seconds
  interval: null,
  sessionCount: 0,    // completed work sessions
};

// Persisted data
let history    = loadJSON('pom_history', []);
let todayData  = loadJSON('pom_today',   { date: '', count: 0 });

/* ---------- DOM References ---------- */
const $ = id => document.getElementById(id);

const dom = {
  clockDisplay:  $('clock-display'),
  clockLabel:    $('clock-label'),
  ringProgress:  $('ring-progress'),
  sessionDots:   $('session-dots'),
  playBtn:       $('btn-play'),
  playIcon:      $('play-icon'),
  soundSelect:   $('sound-select'),
  toast:         $('toast'),

  // Settings fields
  setWork:       $('set-work'),
  setBreak:      $('set-break'),
  setLongbreak:  $('set-longbreak'),
  setGoal:       $('set-goal'),
  setCycles:     $('set-cycles'),

  // Toggles
  togAutobreak:  $('tog-autobreak'),
  togAutosession:$('tog-autosession'),
  togNotif:      $('tog-notif'),

  // Dashboard
  statToday:     $('stat-today'),
  statFocus:     $('stat-focus'),
  statTotal:     $('stat-total'),
  statStreak:    $('stat-streak'),
  barChart:      $('bar-chart'),
  historyList:   $('history-list'),
};

/* ============================================================
   INITIALIZATION
   ============================================================ */
function init() {
  loadSettings();
  resetTimerState();
  bindEvents();
  renderTimer();
  renderDots();
  syncSettingsUI();
  updateRing(1);
}

function resetTimerState() {
  timer.remaining = MODE[timer.mode].dur() * 60;
}

/* ============================================================
   EVENT BINDING
   ============================================================ */
function bindEvents() {
  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Mode pills
  document.querySelectorAll('.mode-pill').forEach(pill => {
    pill.addEventListener('click', () => switchMode(pill.dataset.mode));
  });

  // Timer controls
  $('btn-play').addEventListener('click', toggleTimer);
  $('btn-reset').addEventListener('click', resetTimer);
  $('btn-skip').addEventListener('click', skipSession);

  // Sound test
  $('btn-test-sound').addEventListener('click', playSound);

  // Settings steppers
  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      adjustSetting(btn.dataset.key, parseInt(btn.dataset.delta));
    });
  });

  // Cycles select
  $('set-cycles').addEventListener('change', e => {
    settings.cycles = parseInt(e.target.value);
    renderDots();
  });

  // Toggles
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => flipToggle(btn));
  });

  // Save button
  $('btn-save').addEventListener('click', saveSettings);

  // Clear data
  $('btn-clear').addEventListener('click', clearData);

  // Keyboard shortcut: Space = play/pause
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
      e.preventDefault();
      toggleTimer();
    }
  });
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  if (tab === 'dashboard') renderDashboard();
}

/* ============================================================
   TIMER CORE
   ============================================================ */
function toggleTimer() {
  if (timer.running) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  timer.running = true;
  dom.playIcon.className = 'ti ti-player-pause';
  dom.playBtn.setAttribute('title', 'Pause');
  timer.interval = setInterval(tick, 1000);
}

function pauseTimer() {
  timer.running = false;
  dom.playIcon.className = 'ti ti-player-play';
  dom.playBtn.setAttribute('title', 'Start');
  clearInterval(timer.interval);
}

function tick() {
  if (timer.remaining <= 0) {
    finishSession();
    return;
  }
  timer.remaining--;
  renderTimer();
  updateRing(timer.remaining / (MODE[timer.mode].dur() * 60));
}

function resetTimer() {
  pauseTimer();
  timer.remaining = MODE[timer.mode].dur() * 60;
  renderTimer();
  updateRing(1);
}

function skipSession() {
  pauseTimer();
  if (timer.mode === 'work') {
    timer.sessionCount++;
    renderDots();
    const next = (timer.sessionCount % settings.cycles === 0) ? 'longbreak' : 'break';
    switchMode(next, false);
  } else {
    switchMode('work', false);
  }
}

function finishSession() {
  pauseTimer();
  playSound();
  sendNotification(timer.mode);

  if (timer.mode === 'work') {
    timer.sessionCount++;
    logSession('work', settings.work);
    renderDots();

    const nextMode = (timer.sessionCount % settings.cycles === 0) ? 'longbreak' : 'break';
    showToast('Session complete! Time for a break 🎉');

    if (settings.autoBreak) {
      switchMode(nextMode, true);
    } else {
      switchMode(nextMode, false);
    }
  } else {
    showToast('Break over — back to work! 💪');
    if (settings.autoSession) {
      switchMode('work', true);
    } else {
      switchMode('work', false);
    }
  }
}

/* ============================================================
   MODE SWITCHING
   ============================================================ */
function switchMode(mode, autoStart = false) {
  timer.mode = mode;
  timer.running = false;
  clearInterval(timer.interval);
  dom.playIcon.className = 'ti ti-player-play';
  timer.remaining = MODE[mode].dur() * 60;

  // Update pills
  document.querySelectorAll('.mode-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.mode === mode);
  });

  // Update ring color
  dom.ringProgress.style.stroke = MODE[mode].color;

  renderTimer();
  updateRing(1);

  if (autoStart) startTimer();
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */
function renderTimer() {
  const m = Math.floor(timer.remaining / 60);
  const s = timer.remaining % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  dom.clockDisplay.textContent = display;
  dom.clockLabel.textContent = MODE[timer.mode].label;
  document.title = `${display} — Pomo`;
}

function updateRing(fraction) {
  const offset = RING_CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, fraction)));
  dom.ringProgress.style.strokeDasharray = RING_CIRCUMFERENCE;
  dom.ringProgress.style.strokeDashoffset = offset;
  dom.ringProgress.style.stroke = MODE[timer.mode].color;
}

function renderDots() {
  const cycles = parseInt(settings.cycles);
  dom.sessionDots.innerHTML = '';
  for (let i = 0; i < cycles; i++) {
    const dot = document.createElement('div');
    dot.className = 'session-dot' + (i < timer.sessionCount % cycles ? ' done' : '');
    dom.sessionDots.appendChild(dot);
  }
}

/* ============================================================
   SETTINGS
   ============================================================ */
function adjustSetting(key, delta) {
  const lim = LIMITS[key];
  settings[key] = Math.max(lim.min, Math.min(lim.max, settings[key] + delta));
  document.getElementById('set-' + key).textContent = settings[key];
}

function flipToggle(btn) {
  const key = btn.dataset.key;
  settings[key] = !settings[key];
  btn.classList.toggle('on', settings[key]);
  btn.setAttribute('aria-pressed', settings[key]);
}

function saveSettings() {
  settings.cycles = parseInt($('set-cycles').value);
  persistSettings();
  resetTimer();
  renderDots();
  showToast('Settings saved ✓');
}

function syncSettingsUI() {
  dom.setWork.textContent      = settings.work;
  dom.setBreak.textContent     = settings.break;
  dom.setLongbreak.textContent = settings.longbreak;
  dom.setGoal.textContent      = settings.goal;
  dom.setCycles.value          = settings.cycles;
  dom.togAutobreak.classList.toggle('on', settings.autoBreak);
  dom.togAutosession.classList.toggle('on', settings.autoSession);
  dom.togNotif.classList.toggle('on', settings.notifications);
}

/* ============================================================
   PERSISTENCE
   ============================================================ */
function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

function loadSettings() {
  const saved = loadJSON('pom_settings', null);
  if (saved) Object.assign(settings, saved);
}

function persistSettings() {
  localStorage.setItem('pom_settings', JSON.stringify(settings));
}

/* ============================================================
   SESSION LOGGING
   ============================================================ */
function logSession(type, dur) {
  const now  = new Date();
  const today = now.toDateString();

  // Update today counter
  if (todayData.date !== today) todayData = { date: today, count: 0 };
  todayData.count++;
  localStorage.setItem('pom_today', JSON.stringify(todayData));

  // Append to history (most-recent first, cap at 100)
  history.unshift({
    type,
    dur,
    date: today,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  if (history.length > 100) history.length = 100;
  localStorage.setItem('pom_history', JSON.stringify(history));
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const today = new Date().toDateString();
  if (todayData.date !== today) todayData = { date: today, count: 0 };

  // Stat cards
  dom.statToday.textContent = todayData.count;
  const focusMins = todayData.count * settings.work;
  dom.statFocus.textContent = focusMins >= 60
    ? Math.floor(focusMins / 60) + 'h ' + (focusMins % 60 > 0 ? (focusMins % 60) + 'm' : '')
    : focusMins + 'm';

  dom.statTotal.textContent = history.filter(h => h.type === 'work').length;

  // Streak — count back from today while we have sessions
  const sessionDays = new Set(history.map(h => h.date));
  let streak = 0, d = new Date();
  while (sessionDays.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  dom.statStreak.textContent = streak;

  // Weekly bar chart
  renderBarChart();

  // History list
  renderHistoryList();
}

function renderBarChart() {
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const now = new Date();
  const todayIdx = now.getDay();

  // Count sessions per day (last 7 days, index 0 = 6 days ago, index 6 = today)
  const counts = Array(7).fill(0);
  history.forEach(h => {
    if (h.type !== 'work') return;
    const diff = Math.round((now - new Date(h.date)) / 86400000);
    if (diff >= 0 && diff < 7) counts[6 - diff]++;
  });

  const maxCount = Math.max(...counts, 1);
  dom.barChart.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const dayOffset = 6 - i;
    const dayIdx = ((todayIdx - dayOffset) + 7) % 7;
    const isToday = dayOffset === 0;
    const height = Math.max(3, Math.round((counts[i] / maxCount) * 88));

    const col = document.createElement('div');
    col.className = 'bar-col';

    const bar = document.createElement('div');
    bar.className = 'bar-fill ' + (counts[i] > 0 ? (isToday ? 'today' : 'has-data') : 'no-data');
    bar.style.height = height + 'px';
    bar.title = `${counts[i]} session${counts[i] !== 1 ? 's' : ''}`;

    const lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.textContent = isToday ? '•' : DAYS[dayIdx];

    col.appendChild(bar);
    col.appendChild(lbl);
    dom.barChart.appendChild(col);
  }
}

function renderHistoryList() {
  if (history.length === 0) {
    dom.historyList.innerHTML = '<div class="empty-state">No sessions yet — start your first!</div>';
    return;
  }

  const today = new Date().toDateString();
  dom.historyList.innerHTML = history.slice(0, 10).map(h => {
    const name = h.type === 'work' ? 'Work session' : (h.type === 'break' ? 'Short break' : 'Long break');
    const timeStr = h.date === today ? h.time : `${h.date} ${h.time}`;
    return `
      <div class="history-item">
        <div class="hist-indicator ${h.type === 'work' ? 'work' : 'break'}"></div>
        <div class="hist-text">
          <div class="hist-name">${name}</div>
          <div class="hist-dur">${h.dur} min</div>
        </div>
        <div class="hist-time">${timeStr}</div>
      </div>`;
  }).join('');
}

/* ============================================================
   SOUND ENGINE
   ============================================================ */
function playSound() {
  const type = dom.soundSelect.value;
  if (type === 'none') return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const tones = {
      bell:    [[523.25, 0, 0.6, 'sine'], [659.25, 0.08, 0.5, 'sine'], [783.99, 0.16, 0.4, 'sine']],
      chime:   [[880, 0, 0.3, 'sine'], [1174.66, 0.12, 0.25, 'sine'], [1396.91, 0.24, 0.2, 'sine'], [1760, 0.36, 0.18, 'sine']],
      digital: [[440, 0, 0.08, 'square'], [440, 0.12, 0.08, 'square'], [440, 0.24, 0.08, 'square'], [550, 0.36, 0.12, 'square']],
      soft:    [[528, 0, 0.8, 'sine'], [396, 0.1, 0.6, 'sine']],
    };

    (tones[type] || tones.bell).forEach(([freq, delay, dur, wave]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = wave;
      osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  } catch (e) {
    console.warn('AudioContext not available:', e);
  }
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
function sendNotification(mode) {
  if (!settings.notifications) return;
  if (!('Notification' in window)) return;

  const messages = {
    work:      { title: '⏰ Session complete!', body: 'Great work! Time for a break.' },
    break:     { title: '☕ Break over!',        body: 'Ready to focus again?' },
    longbreak: { title: '🔋 Long break over!',   body: 'Recharged? Let\'s get back to it.' },
  };

  const msg = messages[mode] || messages.work;

  if (Notification.permission === 'granted') {
    new Notification(msg.title, { body: msg.body, icon: '' });
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') new Notification(msg.title, { body: msg.body });
    });
  }
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimeout = null;

function showToast(msg) {
  clearTimeout(toastTimeout);
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  toastTimeout = setTimeout(() => dom.toast.classList.remove('show'), 2800);
}

/* ============================================================
   CLEAR DATA
   ============================================================ */
function clearData() {
  if (!confirm('Delete all session history and stats? This cannot be undone.')) return;
  history = [];
  todayData = { date: new Date().toDateString(), count: 0 };
  localStorage.removeItem('pom_history');
  localStorage.removeItem('pom_today');
  renderDashboard();
  showToast('All data cleared');
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);