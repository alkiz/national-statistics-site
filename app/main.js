// DataNusa — router dan interaksi. Hash router: #/penduduk, #/ekonomi, dst.
// Tanpa pustaka, tanpa jaringan. Semua kontrol di halaman bekerja sungguhan.
(function () {
  'use strict';
  var D = window.DATANUSA;
  var C = window.DataNusaCharts;
  var V = window.DataNusaViews;
  var view = document.getElementById('view');

  function currentRoute() {
    var h = (location.hash || '#/').replace(/^#\/?/, '');
    return V.routes[h] ? h : '';
  }

  function setActiveNav(route) {
    document.querySelectorAll('.mainnav a').forEach(function (a) {
      a.classList.toggle('active', (a.getAttribute('data-route') || '') === route);
    });
  }

  // ---- Halaman Daerah: tabel yang bisa diurutkan & dicari ----
  var provSort = { key: 'pop', dir: -1 };
  function renderProvTable(filter) {
    var body = document.getElementById('provBody');
    if (!body) return;
    var q = (filter || '').trim().toLowerCase();
    var rows = D.provinces.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) !== -1; });
    rows.sort(function (a, b) {
      var k = provSort.key;
      var av = a[k], bv = b[k];
      if (typeof av === 'string') return provSort.dir * av.localeCompare(bv, 'id');
      return provSort.dir * (av - bv);
    });
    body.innerHTML = rows.map(function (p) {
      return '<tr><td>' + p.name + '</td><td>' + C.fmt(p.pop, 2).replace('.', ',') +
        '</td><td>' + C.fmt(p.share, 2).replace('.', ',') + '%</td></tr>';
    }).join('') || '<tr><td colspan="3">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
    document.getElementById('provCount').textContent =
      'Menampilkan ' + rows.length + ' dari ' + D.provinces.length + ' provinsi · diurutkan berdasarkan ' +
      (provSort.key === 'name' ? 'nama' : provSort.key === 'pop' ? 'jumlah penduduk' : 'pangsa') +
      ' (' + (provSort.dir === 1 ? 'menaik' : 'menurun') + ').';
    document.querySelectorAll('#provTable th.sortable').forEach(function (th) {
      var arrow = th.getAttribute('data-key') === provSort.key ? (provSort.dir === 1 ? ' ▲' : ' ▼') : '';
      th.textContent = th.textContent.replace(/ [▲▼]$/, '') + arrow;
    });
  }
  function initDaerah() {
    renderProvTable('');
    var search = document.getElementById('provSearch');
    search.addEventListener('input', function () { renderProvTable(search.value); });
    document.getElementById('provReset').addEventListener('click', function () {
      search.value = ''; provSort = { key: 'pop', dir: -1 }; renderProvTable('');
    });
    document.querySelectorAll('#provTable th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = th.getAttribute('data-key');
        if (provSort.key === k) provSort.dir = -provSort.dir;
        else provSort = { key: k, dir: k === 'name' ? 1 : -1 };
        renderProvTable(search.value);
      });
    });
  }

  // ---- Penjelajah Data: pilih indikator + tahun, unduh CSV ----
  var exState = { ind: 'pdbTumbuh', from: 2020, to: 2024, type: 'line' };
  function exSlice() {
    var ind = D.indicators[exState.ind];
    var i0 = D.years.indexOf(exState.from), i1 = D.years.indexOf(exState.to);
    if (i0 > i1) { var t = i0; i0 = i1; i1 = t; }
    return { ind: ind, labels: D.years.slice(i0, i1 + 1).map(String), values: ind.values.slice(i0, i1 + 1) };
  }
  function drawExplorer() {
    var s = exSlice();
    var cv = document.getElementById('ch-ex');
    if (!cv) return;
    var opts = { labels: s.labels, values: s.values, decimals: s.ind.decimals, yLabel: s.ind.unit || '' };
    if (exState.type === 'line') C.line(cv, opts);
    else C.bar(cv, opts);
    document.getElementById('exNote').textContent = s.ind.note + ' Rentang: ' + s.labels[0] + '–' + s.labels[s.labels.length - 1] + '.';
    var rows = s.labels.map(function (y, i) {
      return '<tr><td>' + y + '</td><td>' + C.fmt(s.values[i], s.ind.decimals).replace('.', ',') + '</td></tr>';
    }).join('');
    document.getElementById('exTable').innerHTML =
      '<div class="table-scroll"><table class="data"><thead><tr><th>Tahun</th><th>' + s.ind.label +
      (s.ind.unit ? ' (' + s.ind.unit + ')' : '') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function initExplorer() {
    var indSel = document.getElementById('exInd');
    var fromSel = document.getElementById('exFrom');
    var toSel = document.getElementById('exTo');
    indSel.value = exState.ind;
    fromSel.value = String(exState.from);
    toSel.value = String(exState.to);
    var sync = function () {
      exState.ind = indSel.value;
      exState.from = Number(fromSel.value);
      exState.to = Number(toSel.value);
      drawExplorer();
    };
    indSel.addEventListener('change', sync);
    fromSel.addEventListener('change', sync);
    toSel.addEventListener('change', sync);
    var lineBtn = document.getElementById('exLine');
    var barBtn = document.getElementById('exBar');
    lineBtn.addEventListener('click', function () {
      exState.type = 'line';
      lineBtn.setAttribute('aria-pressed', 'true'); barBtn.setAttribute('aria-pressed', 'false');
      drawExplorer();
    });
    barBtn.addEventListener('click', function () {
      exState.type = 'bar';
      barBtn.setAttribute('aria-pressed', 'true'); lineBtn.setAttribute('aria-pressed', 'false');
      drawExplorer();
    });
    document.getElementById('exCsv').addEventListener('click', function () {
      var s = exSlice();
      var lines = ['tahun,' + s.ind.label.replace(/,/g, '') + (s.ind.unit ? ' (' + s.ind.unit + ')' : '')];
      s.labels.forEach(function (y, i) { lines.push(y + ',' + s.values[i]); });
      var blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'datanusa-' + exState.ind + '-' + s.labels[0] + '-' + s.labels[s.labels.length - 1] + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    drawExplorer();
  }

  function render() {
    var route = currentRoute();
    view.innerHTML = V.routes[route]();
    setActiveNav(route);
    V.drawCharts(route);
    if (route === 'daerah') initDaerah();
    if (route === 'penjelajah') initExplorer();
    window.scrollTo(0, 0);
  }

  document.getElementById('navToggle').addEventListener('click', function () {
    var nav = document.getElementById('mainNav');
    var open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('mainNav').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      document.getElementById('mainNav').classList.remove('open');
      document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('hashchange', render);
  window.addEventListener('resize', function () { V.drawCharts(currentRoute()); });
  render();
})();
