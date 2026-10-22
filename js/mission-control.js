/* ==========================================================================
   COSMIC ODYSSEY v3 — MISSION CONTROL
   New, self-contained features. Everything is wrapped in an IIFE and uses
   v3-/mc-/pal- prefixed ids so it can never collide with the v2 engine.
   Data: published NASA / textbook values (radii, gravity, periods, temps).
   Moon phase: synodic calculation from the 2000-01-06 new-moon epoch —
   a real astronomical approximation, labelled as such in the UI.
   ========================================================================== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ data */
  // radiusKm, gravity (m/s^2), tempC (mean), periodDays, distAU (from its star),
  // escapeKmS, color for the orb preview.
  var WORLDS = [
    { id:'mercury', name:'Mercury', bn:'বুধ', type:'Rocky · Solar System', radiusKm:2439.7, gravity:3.7,  tempC:167,  periodDays:88,     distAU:0.387, escapeKmS:4.25,  color:'#b8a89a', fact:'A year on Mercury is 88 days — but a single solar day lasts 176 Earth days.' },
    { id:'venus',   name:'Venus',   bn:'শুক্র', type:'Rocky · Solar System', radiusKm:6051.8, gravity:8.87, tempC:464,  periodDays:225,    distAU:0.723, escapeKmS:10.36, color:'#e8c07a', fact:'Venus spins backwards, and its day is longer than its year.' },
    { id:'earth',   name:'Earth',   bn:'পৃথিবী', type:'Rocky · Habitable Zone', radiusKm:6371, gravity:9.8, tempC:15, periodDays:365.25, distAU:1.0, escapeKmS:11.19, color:'#4fa3e3', fact:'The only known world with liquid-water oceans, oxygen air and life.' },
    { id:'mars',    name:'Mars',    bn:'মঙ্গল', type:'Rocky · Solar System', radiusKm:3389.5, gravity:3.71, tempC:-65,  periodDays:687,    distAU:1.524, escapeKmS:5.03,  color:'#e07a4a', fact:'Home to Olympus Mons — a volcano nearly three times the height of Everest.' },
    { id:'jupiter', name:'Jupiter', bn:'বৃহস্পতি', type:'Gas Giant · Solar System', radiusKm:69911, gravity:24.79, tempC:-110, periodDays:4333, distAU:5.203, escapeKmS:59.5, color:'#d8b48f', fact:'The Great Red Spot is a storm wider than Earth that has raged for centuries.' },
    { id:'saturn',  name:'Saturn',  bn:'শনি', type:'Gas Giant · Ringed', radiusKm:58232, gravity:10.44, tempC:-140, periodDays:10759, distAU:9.537, escapeKmS:35.5, color:'#e6cf9a', fact:'Saturn is so light for its size that it would float in a big enough ocean.' },
    { id:'uranus',  name:'Uranus',  bn:'ইউরেনাস', type:'Ice Giant · Solar System', radiusKm:25362, gravity:8.69, tempC:-195, periodDays:30687, distAU:19.19, escapeKmS:21.3, color:'#9adbe8', fact:'Uranus rolls around the Sun on its side, tilted a dramatic 98 degrees.' },
    { id:'neptune', name:'Neptune', bn:'নেপচুন', type:'Ice Giant · Solar System', radiusKm:24622, gravity:11.15, tempC:-200, periodDays:60190, distAU:30.07, escapeKmS:23.5, color:'#5a7de0', fact:'Neptune has the fastest winds in the Solar System — up to 2,100 km/h.' },
    { id:'moon',    name:'Moon',    bn:'চাঁদ', type:'Natural Satellite · Earth', radiusKm:1737.4, gravity:1.62, tempC:-20, periodDays:27.3, distAU:0.00257, escapeKmS:2.38, color:'#c9ced6', fact:'The Moon drifts about 3.8 cm farther from Earth every year.' },
    { id:'proxima-b', name:'Proxima Centauri b', bn:'প্রক্সিমা বি', type:'Exoplanet · Habitable Zone', radiusKm:6920, gravity:10.1, tempC:-39, periodDays:11.19, distAU:0.048, escapeKmS:11.5, color:'#7fc97f', fact:'The closest exoplanet to Earth — only 4.24 light-years away.' },
    { id:'trappist-1e', name:'TRAPPIST-1e', bn:'ট্রাপিস্ট-১ই', type:'Exoplanet · Habitable Zone', radiusKm:5860, gravity:8.9, tempC:-22, periodDays:6.1, distAU:0.029, escapeKmS:10.2, color:'#6fc7b8', fact:'One of seven Earth-sized worlds around an ultra-cool red dwarf, 39 light-years away.' },
    { id:'kepler-186f', name:'Kepler-186f', bn:'কেপলার-১৮৬এফ', type:'Exoplanet · Habitable Zone', radiusKm:7450, gravity:10.8, tempC:-46, periodDays:130, distAU:0.36, escapeKmS:11.8, color:'#8fb8e8', fact:'The first Earth-sized planet found in another star\u2019s habitable zone (2014).' },
    { id:'kepler-452b', name:'Kepler-452b', bn:'কেপলার-৪৫২বি', type:'Exoplanet · Earth Cousin', radiusKm:10200, gravity:18.6, tempC:-8, periodDays:385, distAU:1.05, escapeKmS:15.1, color:'#a8d89a', fact:'Orbits a Sun-like star every 385 days — Earth\u2019s older, bigger cousin.' },
    { id:'hd189733b', name:'HD 189733b', bn:'এইচডি ১৮৯৭৩৩বি', type:'Exoplanet · Hot Jupiter', radiusKm:81100, gravity:21.8, tempC:920, periodDays:2.22, distAU:0.031, escapeKmS:42.0, color:'#4a90d9', fact:'A deep-blue hot Jupiter where it may rain molten glass — sideways.' }
  ];
  function world(id) { for (var i = 0; i < WORLDS.length; i++) if (WORLDS[i].id === id) return WORLDS[i]; return WORLDS[2]; }

  var DESTINATIONS = [
    { id:'moon',    name:'The Moon', bn:'চাঁদ', km: 384400 },
    { id:'mars',    name:'Mars (closest approach)', bn:'মঙ্গল', km: 55700000 },
    { id:'venus',   name:'Venus (closest approach)', bn:'শুক্র', km: 41400000 },
    { id:'jupiter', name:'Jupiter', bn:'বৃহস্পতি', km: 628730000 },
    { id:'saturn',  name:'Saturn', bn:'শনি', km: 1275000000 },
    { id:'voyager1',name:'Voyager 1 (current, approx.)', bn:'ভয়েজার ১', km: 24900000000 },
    { id:'proxima', name:'Proxima Centauri', bn:'প্রক্সিমা সেন্টাউরি', km: 4.0175e13 },
    { id:'trappist',name:'TRAPPIST-1 system', bn:'ট্রাপিস্ট-১', km: 3.7e14 },
    { id:'core',    name:'Galactic Core — Sagittarius A*', bn:'ছায়াপথের কেন্দ্র', km: 2.463e17 },
    { id:'andromeda', name:'Andromeda Galaxy (M31)', bn:'অ্যান্ড্রোমিডা', km: 2.4e19 }
  ];

  var CITIES = [
    { id:'dhaka',   name:'Dhaka, Bangladesh', lat: 23.81 },
    { id:'kolkata', name:'Kolkata, India', lat: 22.57 },
    { id:'delhi',   name:'Delhi, India', lat: 28.61 },
    { id:'london',  name:'London, UK', lat: 51.5 },
    { id:'newyork', name:'New York, USA', lat: 40.71 },
    { id:'sydney',  name:'Sydney, Australia', lat: -33.87 }
  ];

  /* ------------------------------------------------------- favourites store */
  var FAV_KEY = 'cosmic-odyssey-favs-v3';
  function loadFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
  function saveFavs(f) { try { localStorage.setItem(FAV_KEY, JSON.stringify(f)); } catch (e) {} }
  function isFav(id) { return loadFavs().indexOf(id) !== -1; }
  function toggleFav(id) {
    var f = loadFavs(), i = f.indexOf(id);
    if (i === -1) f.push(id); else f.splice(i, 1);
    saveFavs(f); renderFavs(); syncFavButtons();
    return i === -1;
  }
  function favLabel(id) {
    var w = null, d = null, i;
    for (i = 0; i < WORLDS.length; i++) if (WORLDS[i].id === id) w = WORLDS[i];
    for (i = 0; i < DESTINATIONS.length; i++) if (DESTINATIONS[i].id === id) d = DESTINATIONS[i];
    if (w) return '🪐 ' + w.name;
    if (d) return '📍 ' + d.name;
    return id;
  }
  function renderFavs() {
    var box = $('mcFavs'); if (!box) return;
    var f = loadFavs();
    if (!f.length) { box.innerHTML = '<span class="mc-empty">No favourites yet — tap ☆ on any world or destination and it will live here, saved on this device.</span>'; return; }
    box.innerHTML = '';
    f.forEach(function (id) {
      var chip = document.createElement('span'); chip.className = 'mc-chip';
      var label = document.createElement('span'); label.textContent = favLabel(id);
      label.addEventListener('click', function () { openFav(id); });
      var x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label', 'Remove favourite');
      x.addEventListener('click', function () { toggleFav(id); });
      chip.appendChild(label); chip.appendChild(x); box.appendChild(chip);
    });
  }
  function openFav(id) {
    var el = $('mission-control'); if (el) el.scrollIntoView({ behavior: 'smooth' });
    var isWorld = WORLDS.some(function (w) { return w.id === id; });
    if (isWorld) { var s = $('mcGravityWorld'); if (s) { s.value = id; updateGravity(); } }
    else { var d = $('mcDest'); if (d) { d.value = id; updateTravel(); } }
  }
  function syncFavButtons() {
    $$('.mc-fav-btn').forEach(function (b) {
      var id = b.getAttribute('data-fav'); if (!id) return;
      var on = isFav(id); b.classList.toggle('on', on); b.textContent = on ? '★' : '☆';
    });
  }

  /* ------------------------------------------------------------ formatting */
  function fmt(n, dec) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: dec == null ? 2 : dec, minimumFractionDigits: dec == null ? 0 : dec }); }
  function humanDuration(seconds) {
    if (!isFinite(seconds)) return '—';
    var m = 60, h = 3600, d = 86400, y = 31557600;
    if (seconds < 90) return fmt(seconds, 1) + ' seconds';
    if (seconds < h * 1.5) return fmt(seconds / m, 1) + ' minutes';
    if (seconds < d * 2) return fmt(seconds / h, 2) + ' hours';
    if (seconds < y * 2) return fmt(seconds / d, 1) + ' days';
    if (seconds < y * 10000) return fmt(seconds / y, 1) + ' years';
    return fmt(seconds / y, 0) + ' years';
  }

  /* ------------------------------------------------------------- TONIGHT'S SKY */
  var SYNODIC = 29.53058867, NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  function moonData(date) {
    var days = date.getTime() / 86400000;
    var age = ((days - NEW_MOON_EPOCH) % SYNODIC + SYNODIC) % SYNODIC;
    var illum = (1 - Math.cos(2 * Math.PI * age / SYNODIC)) / 2;
    var names = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
    var idx = Math.floor(((age / SYNODIC) * 8 + 0.5)) % 8;
    return { age: age, illum: illum, name: names[idx], idx: idx };
  }
  function drawMoon(age) {
    var c = $('mcMoonCanvas'); if (!c) return;
    var ctx = c.getContext('2d'); if (!ctx) return;
    var S = c.width, R = S * 0.36, cx = S / 2, cy = S / 2;
    ctx.clearRect(0, 0, S, S);
    var g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
    g.addColorStop(0, '#f8fafc'); g.addColorStop(0.7, '#cbd5e1'); g.addColorStop(1, '#94a3b8');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    // craters
    ctx.fillStyle = 'rgba(100,116,139,.35)';
    [[-0.3,-0.2,0.16],[0.25,0.3,0.12],[0.1,-0.42,0.09],[-0.42,0.35,0.08]].forEach(function (cr) {
      ctx.beginPath(); ctx.arc(cx + cr[0] * R, cy + cr[1] * R, cr[2] * R, 0, Math.PI * 2); ctx.fill();
    });
    // shadow terminator
    var phase = age / SYNODIC, k = Math.cos(2 * Math.PI * phase);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = 'rgba(2,6,18,.88)';
    ctx.beginPath();
    if (phase <= 0.5) { // waxing: shadow on left, terminator bulges left->right
      ctx.ellipse(cx, cy, R, R, 0, Math.PI / 2, Math.PI * 1.5, false);
      ctx.ellipse(cx, cy, Math.abs(k) * R, R, 0, Math.PI * 1.5, Math.PI / 2, k > 0);
    } else { // waning: shadow on right
      ctx.ellipse(cx, cy, R, R, 0, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(cx, cy, Math.abs(k) * R, R, 0, Math.PI / 2, Math.PI * 1.5, k > 0);
    }
    ctx.fill(); ctx.restore();
  }
  function coreVisibility(month, lat) {
    // Sagittarius (galactic core) evening visibility — seasonal approximation.
    var north = lat >= 0;
    var tableN = ['Not in the evening sky','Not in the evening sky','Rises late at night','Rises late at night','Visible after midnight','Prime time — high in the south after dark','Prime time — the year\u2019s best core views','Prime time — high after sunset','Great evening views, setting by midnight','Evening views, low in the southwest','Sets soon after sunset','Not in the evening sky'];
    var tableS = ['Prime time in the southern summer sky','Prime time in the southern summer sky','Excellent evening views','Excellent evening views','Visible most of the night','Visible most of the night','High overhead in the evening','High overhead in the evening','Evening views, setting late','Rises late at night','Rises late at night','Prime time in the southern summer sky'];
    return (north ? tableN : tableS)[month];
  }
  function updateSky() {
    var citySel = $('mcCity'); if (!citySel) return;
    var city = CITIES.filter(function (c) { return c.id === citySel.value; })[0] || CITIES[0];
    var now = new Date();
    var m = moonData(now);
    drawMoon(m.age);
    $('mcMoonPhase').textContent = m.name;
    $('mcMoonIllum').textContent = fmt(m.illum * 100, 0) + '% lit';
    $('mcMoonAge').textContent = fmt(m.age, 1) + ' days';
    var daysToFull = ((SYNODIC / 2 - m.age) % SYNODIC + SYNODIC) % SYNODIC;
    $('mcMoonNext').textContent = daysToFull < 0.6 ? 'Tonight!' : 'in ~' + fmt(daysToFull, 0) + ' days';
    $('mcCoreVis').textContent = coreVisibility(now.getMonth(), city.lat);
    $('mcSkyDate').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + city.name;
  }

  /* -------------------------------------------------------------- COMPARATOR */
  function barRow(label, a, b, unit, logScale) {
    function norm(v) { return logScale ? Math.log10(Math.max(v, 0.001) + 1) : v; }
    var max = Math.max(norm(a), norm(b)) || 1;
    var pa = Math.max(4, norm(a) / max * 100), pb = Math.max(4, norm(b) / max * 100);
    return '<div class="mc-bar-row"><span class="lab">' + label + '</span>' +
      '<span class="va">' + fmt(a) + ' ' + unit + '</span><div class="mc-bar a"><i style="width:' + pa + '%"></i></div><span></span>' +
      '<span></span><div class="mc-bar b"><i style="width:' + pb + '%"></i></div><span class="vb">' + fmt(b) + ' ' + unit + '</span></div>';
  }
  function updateCompare() {
    var a = world($('mcWorldA').value), b = world($('mcWorldB').value);
    $('mcOrbA').style.background = 'radial-gradient(circle at 34% 32%, #ffffffcc, ' + a.color + ' 42%, #050a18 130%)';
    $('mcOrbB').style.background = 'radial-gradient(circle at 34% 32%, #ffffffcc, ' + b.color + ' 42%, #050a18 130%)';
    $('mcNameA').textContent = a.name + ' (' + a.bn + ')'; $('mcNameB').textContent = b.name + ' (' + b.bn + ')';
    $('mcTypeA').textContent = a.type; $('mcTypeB').textContent = b.type;
    $('mcFactA').textContent = a.fact; $('mcFactB').textContent = b.fact;
    $('mcBars').innerHTML =
      barRow('Radius', a.radiusKm, b.radiusKm, 'km', true) +
      barRow('Surface gravity', a.gravity, b.gravity, 'm/s²', false) +
      barRow('Year length', a.periodDays, b.periodDays, 'days', true) +
      barRow('Escape velocity', a.escapeKmS, b.escapeKmS, 'km/s', false);
    var bigger = a.radiusKm === b.radiusKm ? null : (a.radiusKm > b.radiusKm ? a : b);
    var hotter = a.tempC === b.tempC ? null : (a.tempC > b.tempC ? a : b);
    var ratio = bigger ? fmt(Math.max(a.radiusKm, b.radiusKm) / Math.min(a.radiusKm, b.radiusKm), 1) : null;
    $('mcVerdict').innerHTML =
      (bigger ? '<strong>' + bigger.name + '</strong> is the larger world — about <strong>' + ratio + '×</strong> the radius of the other. ' : 'These two worlds are almost exactly the same size. ') +
      (hotter ? '<strong>' + hotter.name + '</strong> is hotter on average (' + fmt(Math.max(a.tempC, b.tempC)) + '°C vs ' + fmt(Math.min(a.tempC, b.tempC)) + '°C). ' : '') +
      'A year lasts <strong>' + fmt(a.periodDays) + ' days</strong> on ' + a.name + ' and <strong>' + fmt(b.periodDays) + ' days</strong> on ' + b.name + '.';
    $('mcFavA').setAttribute('data-fav', a.id); $('mcFavB').setAttribute('data-fav', b.id);
    syncFavButtons();
  }

  /* ----------------------------------------------------------------- GRAVITY */
  function updateGravity() {
    var w = world($('mcGravityWorld').value);
    var kg = parseFloat($('mcWeight').value);
    if (isNaN(kg) || kg < 0) kg = 0;
    var equiv = kg * w.gravity / 9.8;
    var jump = 0.5 * 9.8 / w.gravity; // a 50 cm Earth jump, same leg power
    $('mcGravityOut').innerHTML =
      '<div class="mc-big">' + fmt(equiv, 1) + ' kg <span style="font-size:.95rem;color:#7dd3fc">on ' + w.name + '</span></div>' +
      '<div class="mc-mono" style="margin-top:.35rem">SURFACE GRAVITY ' + fmt(w.gravity) + ' m/s² · ' + fmt(w.gravity / 9.8) + '× EARTH</div>' +
      '<p style="font-size:.86rem;color:#cbd5e1;margin-top:.55rem;line-height:1.6">Your mass never changes — but the ground pulls ' +
      (w.gravity > 9.8 ? 'harder' : 'more gently') + ' here. With the same jump that lifts you 50 cm on Earth, you would float up about <strong>' +
      fmt(jump, 2) + ' m</strong> on ' + w.name + '. To leave this world forever you would need to reach its escape velocity of <strong>' + fmt(w.escapeKmS) + ' km/s</strong>.</p>';
    $('mcFavGravity').setAttribute('data-fav', w.id); syncFavButtons();
  }

  /* ------------------------------------------------------------- LIGHT TRAVEL */
  function updateTravel() {
    var d = DESTINATIONS.filter(function (x) { return x.id === $('mcDest').value; })[0] || DESTINATIONS[0];
    var km = d.km, C = 299792.458; // km/s
    var lightSec = km / C;
    $('mcTravelTitle').innerHTML = 'Earth → ' + d.name;
    $('mcTravelDist').textContent = 'DISTANCE ' + km.toLocaleString('en-US') + ' KM · ' + fmt(km / 149597870.7, 3) + ' AU';
    $('mcTLight').textContent = humanDuration(lightSec);
    $('mcTVoyager').textContent = humanDuration(km / 17.0);
    $('mcTParker').textContent = humanDuration(km / 191.7);
    $('mcTJet').textContent = humanDuration(km / (900 / 3600));
    $('mcFavDest').setAttribute('data-fav', d.id); syncFavButtons();
  }

  /* --------------------------------------------------------- COMMAND PALETTE */
  var PAL_ITEMS = [];
  function buildPalette() {
    PAL_ITEMS = [];
    [['Observatory / Galaxy', 'hero', 'GO'], ['Anatomy of the Galaxy', 'anatomy', 'GO'], ['Spiral Arms', 'spiral-arms', 'GO'],
     ['Sagittarius A* Black Hole Lab', 'blackhole', 'GO'], ['NASA Gallery', 'nasa-gallery', 'GO'], ['Our Cosmic Address', 'solar-system', 'GO'],
     ['Cosmic Scale', 'scale', 'GO'], ['Galactic Timeline', 'timeline', 'GO'], ['Mission Control (new tools)', 'mission-control', 'NEW'], ['Astrophysics Quiz', 'quiz', 'GO']
    ].forEach(function (s) { PAL_ITEMS.push({ label: s[0], kind: s[2], run: function () { var el = $(s[1]); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }); });
    $$('.system-pill-btn').forEach(function (btn) {
      PAL_ITEMS.push({ label: 'Zoom to system: ' + btn.textContent.trim(), kind: 'ZOOM', run: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(function () { btn.click(); }, 450); } });
    });
    WORLDS.forEach(function (w) {
      PAL_ITEMS.push({ label: 'Compare world: ' + w.name, kind: 'WORLD', run: function () { $('mcWorldB').value = w.id; updateCompare(); $('mission-control').scrollIntoView({ behavior: 'smooth' }); } });
    });
    PAL_ITEMS.push({ label: 'Toggle language EN / বাংলা', kind: 'ACTION', run: function () { var b = $('langToggleBtn'); if (b) b.click(); } });
    PAL_ITEMS.push({ label: 'Toggle cosmic audio', kind: 'ACTION', run: function () { var b = $('audioToggleBtn'); if (b) b.click(); } });
    PAL_ITEMS.push({ label: 'Toggle warp mode', kind: 'ACTION', run: function () { var b = $('warpDriveBtn'); if (b) b.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  }
  var palSel = 0, palFiltered = [];
  function renderPalette(q) {
    palFiltered = PAL_ITEMS.filter(function (it) { return it.label.toLowerCase().indexOf(q.toLowerCase()) !== -1; });
    if (palSel >= palFiltered.length) palSel = 0;
    var list = $('palList'); list.innerHTML = '';
    if (!palFiltered.length) { list.innerHTML = '<div style="padding:1rem;color:#94a3b8;font-size:.88rem">No matches in this galaxy. Try “Mars”, “quiz” or “warp”.</div>'; return; }
    palFiltered.slice(0, 12).forEach(function (it, i) {
      var b = document.createElement('button'); b.className = 'pal-item' + (i === palSel ? ' sel' : '');
      b.innerHTML = '<span class="k">' + it.kind + '</span><span></span>';
      b.lastChild.textContent = it.label;
      b.addEventListener('click', function () { closePalette(); it.run(); });
      list.appendChild(b);
    });
  }
  function openPalette() { buildPalette(); $('palOverlay').classList.add('open'); $('palInput').value = ''; palSel = 0; renderPalette(''); setTimeout(function () { $('palInput').focus(); }, 30); }
  function closePalette() { $('palOverlay').classList.remove('open'); }

  /* ------------------------------------------------------------ page chrome */
  function initChrome() {
    var nav = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      $('v3Progress').style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      $('v3TopBtn').classList.toggle('show', y > 700);
      if (nav) nav.classList.toggle('v3-scrolled', y > 40);
    }, { passive: true });
    $('v3TopBtn').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // reveal on scroll
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('v3-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 }) : null;
    $$('.section-container, .stats-strip, .mc-card').forEach(function (el) {
      el.classList.add('v3-reveal'); if (io) io.observe(el); else el.classList.add('v3-in');
    });

    // animated stat counters (numeric prefix only, suffix preserved)
    var cio = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, txt = el.textContent, m = txt.match(/^([\d.,]+)(.*)$/); if (!m) return;
        var target = parseFloat(m[1].replace(/,/g, '')), suffix = m[2], dec = (m[1].split('.')[1] || '').length, t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * ease).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
          if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 }) : null;
    if (cio) $$('.stat-value').forEach(function (el) { cio.observe(el); });
  }

  /* ------------------------------------------------------------------- init */
  function fillSelect(sel, items, labelFn) {
    if (!sel) return; sel.innerHTML = '';
    items.forEach(function (it) { var o = document.createElement('option'); o.value = it.id; o.textContent = labelFn(it); sel.appendChild(o); });
  }
  function init() {
    fillSelect($('mcWorldA'), WORLDS, function (w) { return w.name; });
    fillSelect($('mcWorldB'), WORLDS, function (w) { return w.name; });
    fillSelect($('mcGravityWorld'), WORLDS, function (w) { return w.name + ' — ' + w.gravity + ' m/s²'; });
    fillSelect($('mcDest'), DESTINATIONS, function (d) { return d.name; });
    fillSelect($('mcCity'), CITIES, function (c) { return c.name; });
    if ($('mcWorldA')) { $('mcWorldA').value = 'earth'; $('mcWorldB').value = 'jupiter'; $('mcGravityWorld').value = 'mars'; $('mcDest').value = 'core'; }

    ['mcWorldA', 'mcWorldB'].forEach(function (id) { $(id).addEventListener('change', updateCompare); });
    $('mcSwap').addEventListener('click', function () { var a = $('mcWorldA').value; $('mcWorldA').value = $('mcWorldB').value; $('mcWorldB').value = a; updateCompare(); });
    $('mcGravityWorld').addEventListener('change', updateGravity);
    $('mcWeight').addEventListener('input', updateGravity);
    $('mcDest').addEventListener('change', updateTravel);
    $('mcCity').addEventListener('change', updateSky);
    $$('.mc-fav-btn').forEach(function (b) { b.addEventListener('click', function () { var id = b.getAttribute('data-fav'); if (id) toggleFav(id); }); });
    var searchBtn = $('v3SearchBtn'); if (searchBtn) searchBtn.addEventListener('click', openPalette);
    $('palOverlay').addEventListener('click', function (e) { if (e.target === this) closePalette(); });
    $('palInput').addEventListener('input', function () { palSel = 0; renderPalette(this.value); });
    $('palInput').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palSel + 1, Math.min(palFiltered.length, 12) - 1); renderPalette(this.value); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(palSel - 1, 0); renderPalette(this.value); }
      else if (e.key === 'Enter') { var it = palFiltered[palSel]; if (it) { closePalette(); it.run(); } }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
      if (e.key === 'Escape') closePalette();
    });

    updateSky(); updateCompare(); updateGravity(); updateTravel(); renderFavs(); syncFavButtons(); initChrome();
    setInterval(updateSky, 60000); // keep the moon honest as time passes
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* v3.1 mobile navigation — appended module (kept separate from the v3 block
   above so the diff stays reviewable). Builds the slide-down menu from the
   desktop nav links so the two can never drift apart. */
(function () {
  'use strict';
  function initBurger() {
    var burger = document.getElementById('v3Burger');
    var menu = document.getElementById('v3MobileMenu');
    var links = document.querySelector('.nav-links');
    if (!burger || !menu || !links) return;
    menu.innerHTML = '';
    Array.prototype.forEach.call(links.querySelectorAll('a'), function (a) {
      var clone = document.createElement('a');
      clone.href = a.getAttribute('href');
      clone.textContent = a.textContent;
      clone.addEventListener('click', close);
      menu.appendChild(clone);
    });
    function close() { menu.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1440) close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBurger); else initBurger();
})();
