// DataNusa — route renderers. Setiap halaman dirender dari window.DATANUSA;
// grafik digambar setelah HTML masuk ke DOM (drawCharts).
(function () {
  'use strict';
  var D = window.DATANUSA;
  var C = window.DataNusaCharts;
  var fmt = C.fmt;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function num(v, d) { return fmt(v, d == null ? 2 : d); }
  function id(n) { return num(n, 1).replace('.', ','); }
  function pct(v) { return num(v, 2).replace('.', ',') + '%'; }

  function kpi(label, value, note, delta) {
    return '<div class="kpi"><div class="k-label">' + esc(label) + '</div>' +
      '<div class="k-value">' + value + '</div>' +
      (delta ? '<div class="k-delta">' + delta + '</div>' : '') +
      '<div class="k-note">' + esc(note) + '</div></div>';
  }

  function head(crumbs, title, sub) {
    return '<div class="page-head"><p class="crumbs">' + crumbs + '</p><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p></div>';
  }

  function seriesTable(ind, extraCols) {
    var rows = D.years.map(function (y, i) {
      return '<tr><td>' + y + '</td><td>' + num(ind.values[i], ind.decimals).replace('.', ',') + '</td></tr>';
    }).join('');
    return '<div class="table-scroll"><table class="data"><thead><tr><th>Tahun</th><th>' +
      esc(ind.label) + (ind.unit ? ' (' + esc(ind.unit) + ')' : '') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function home() {
    var kpis =
      kpi('Penduduk 2024', '281,6 <small>juta</small>', 'naik dari 270,2 jt (2020)', '▲ +1,0% / thn') +
      kpi('PDB nominal 2024', 'Rp22.139 <small>T</small>', 'Rp78,6 jt per kapita', '▲ +6,0% nominal') +
      kpi('Pertumbuhan PDB', '5,03<small>%</small>', '2024, year-on-year', '▲ stabil di atas 5%') +
      kpi('Inflasi Des 2024', '1,57<small>%</small>', 'year-on-year', '▼ terendah 2 dekade*') +
      kpi('Pengangguran Agu 2024', '4,91<small>%</small>', '7,47 juta orang menganggur', '▼ dari 7,07% (2020)') +
      kpi('Kemiskinan Sep 2024', '8,57<small>%</small>', '24,06 juta jiwa — terendah sepanjang pencatatan', '▼ dari 9,78% (2020)') +
      kpi('IPM 2024', '75,02', 'naik 0,63 poin dari 2023', '▲ +2,21 poin sejak 2020') +
      kpi('Rasio gini Mar 2024', '0,379', 'ketimpangan pengeluaran', '▼ dari 0,388 (2023)');
    var rel = D.releases.map(function (r) {
      return '<li><span class="r-date">' + esc(r.date) + '</span><span class="r-body"><b>' +
        esc(r.title) + '</b><span>' + esc(r.body) + '</span></span></li>';
    }).join('');
    return '' +
      '<section class="hero"><h1>Indonesia dalam angka, <em>tanpa ribet.</em></h1>' +
      '<p class="lede">DataNusa merangkum angka-angka utama Indonesia — penduduk, ekonomi, tenaga kerja, kemiskinan, dan daerah — dari publikasi BPS, dalam satu situs yang berjalan luring di desktop maupun ponsel.</p>' +
      '<p class="updated">Data terakhir diperbarui ' + esc(D.updated) + ' · deret 2020–2024</p></section>' +
      '<div class="kpis">' + kpis + '</div>' +
      '<div class="grid-2wide">' +
        '<section class="panel"><h3>Pertumbuhan ekonomi 2020–2024</h3>' +
          '<p class="panel-sub">Pertumbuhan PDB year-on-year (%). Kontraksi −2,07% pada 2020, lalu pulih di atas 5% sejak 2022.</p>' +
          '<canvas id="ch-growth" class="chart" height="260"></canvas></section>' +
        '<section class="panel"><h3>Pangsa PDB 2024</h3>' +
          '<p class="panel-sub">Menurut lapangan usaha (perkiraan, %).</p>' +
          '<canvas id="ch-sectors" class="chart" height="260"></canvas></section>' +
      '</div>' +
      '<section class="panel"><h3>Rilis terbaru</h3>' +
        '<p class="panel-sub">Kabar angka dari BPS yang dirangkum DataNusa.</p><ul class="releases">' + rel + '</ul></section>' +
      '<section class="panel"><h3>Jelajahi berdasarkan topik</h3>' +
        '<p class="panel-sub">Setiap halaman punya grafik, tabel, dan penjelasan singkat.</p>' +
        '<div class="chips">' +
          '<a class="chip" href="#/penduduk">Penduduk</a><a class="chip" href="#/ekonomi">Ekonomi</a>' +
          '<a class="chip" href="#/tenaga-kerja">Tenaga Kerja</a><a class="chip" href="#/kemiskinan">Kemiskinan &amp; Kesejahteraan</a>' +
          '<a class="chip" href="#/daerah">Daerah</a><a class="chip" href="#/penjelajah">Penjelajah Data</a>' +
        '</div></section>' +
      '<p class="note">* Inflasi Desember 2024 sebesar 1,57% adalah yang terendah dalam dua dekade di luar 2020–2021.</p>';
  }

  function penduduk() {
    var rows = D.provinces.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td>' + num(p.pop, 2).replace('.', ',') + '</td><td>' +
        num(p.share, 2).replace('.', ',') + '%</td></tr>';
    }).join('');
    return head('<a href="#/">Beranda</a> › Penduduk', 'Penduduk', '281,6 juta jiwa pada 2024 — bertambah sekitar 2,9 juta jiwa per tahun sejak 2020. Lebih dari separuh penduduk tinggal di Jawa.') +
      '<div class="kpis">' +
        kpi('Penduduk 2024', '281,6 <small>juta</small>', 'Juni 2024 (BPS)', '▲ +1,04% dari 2023') +
        kpi('Provinsi terpadat', 'Jawa Barat', '50,35 juta jiwa — 17,88% penduduk Indonesia') +
        kpi('Jawa Timur', '41,81 <small>juta</small>', '14,85% penduduk Indonesia') +
        kpi('Jawa Tengah', '37,89 <small>juta</small>', '13,46% penduduk Indonesia') +
      '</div>' +
      '<section class="panel"><h3>Jumlah penduduk 2020–2024</h3>' +
        '<p class="panel-sub">Estimasi pertengahan tahun BPS (juta jiwa).</p>' +
        '<canvas id="ch-pop" class="chart" height="260"></canvas></section>' +
      '<div class="grid-2">' +
        '<section class="panel"><h3>Provinsi terpadat 2024</h3>' +
          '<p class="panel-sub">Enam provinsi dengan penduduk terbanyak (juta jiwa), BPS.</p>' +
          '<div class="table-scroll"><table class="data"><thead><tr><th>Provinsi</th><th>Penduduk (jt)</th><th>Pangsa</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
        '<section class="panel"><h3>Di mana penduduk tinggal?</h3>' +
          '<p class="panel-sub">Pangsa penduduk enam provinsi terpadat, 2024.</p>' +
          '<canvas id="ch-prov" class="chart" height="280"></canvas>' +
          '<p class="note">Enam provinsi ini menampung ' + num(168.76, 2).replace('.', ',') + ' juta jiwa — sekitar 60% penduduk Indonesia. Jawa Barat, Jawa Timur, dan Jawa Tengah saja sudah 46%.</p></section>' +
      '</div>';
  }

  function ekonomi() {
    return head('<a href="#/">Beranda</a> › Ekonomi', 'Ekonomi', 'PDB nominal Rp22.139 triliun pada 2024, tumbuh 5,03%. PDB per kapita Rp78,6 juta (US$4.960,3).') +
      '<div class="kpis">' +
        kpi('PDB nominal 2024', 'Rp22.139 <small>T</small>', 'atas dasar harga berlaku', '▲ +6,0% dari 2023') +
        kpi('Pertumbuhan 2024', '5,03<small>%</small>', 'year-on-year', '▲ di atas 5% tiga tahun beruntun') +
        kpi('PDB per kapita', 'Rp78,6 <small>jt</small>', 'US$4.960,3 (2024)') +
        kpi('Inflasi Des 2024', '1,57<small>%</small>', 'year-on-year', '▼ dari 2,61% (2023)') +
      '</div>' +
      '<div class="grid-2">' +
        '<section class="panel"><h3>PDB nominal 2020–2024</h3>' +
          '<p class="panel-sub">Atas dasar harga berlaku (Rp triliun).</p>' +
          '<canvas id="ch-gdp" class="chart" height="260"></canvas></section>' +
        '<section class="panel"><h3>Pertumbuhan PDB 2020–2024</h3>' +
          '<p class="panel-sub">Year-on-year (%).</p>' +
          '<canvas id="ch-growth2" class="chart" height="260"></canvas></section>' +
      '</div>' +
      '<div class="grid-2">' +
        '<section class="panel"><h3>Inflasi Desember 2020–2024</h3>' +
          '<p class="panel-sub">Year-on-year (%). Puncak 5,51% pada 2022, lalu mereda ke 1,57% pada 2024.</p>' +
          '<canvas id="ch-inf" class="chart" height="260"></canvas></section>' +
        '<section class="panel"><h3>Pangsa PDB menurut lapangan usaha 2024</h3>' +
          '<p class="panel-sub">Perkiraan dari pangsa yang dipublikasikan (%). Industri pengolahan tetap yang terbesar.</p>' +
          '<canvas id="ch-sectors2" class="chart" height="260"></canvas></section>' +
      '</div>' +
      '<section class="panel"><h3>Tabel: PDB dan pertumbuhan</h3>' + seriesTable(D.indicators.pdbNominal) + '</section>';
  }

  function tenagaKerja() {
    return head('<a href="#/">Beranda</a> › Tenaga Kerja', 'Tenaga Kerja', 'Angkatan kerja 152,11 juta orang pada Agustus 2024; 144,64 juta bekerja dan 7,47 juta menganggur. TPT turun ke 4,91%.') +
      '<div class="kpis">' +
        kpi('Angkatan kerja Agu 2024', '152,11 <small>juta</small>', 'naik 4,40 juta dari Agu 2023') +
        kpi('Bekerja', '144,64 <small>juta</small>', '95,09% angkatan kerja') +
        kpi('Menganggur', '7,47 <small>juta</small>', 'TPT 4,91%') +
        kpi('TPT Agu 2020', '7,07<small>%</small>', 'puncak pandemi; turun 2,16 poin ke 2024', '▼ −2,16 poin') +
      '</div>' +
      '<div class="grid-2">' +
        '<section class="panel"><h3>Tingkat pengangguran terbuka 2020–2024</h3>' +
          '<p class="panel-sub">Sakernas Agustus (%). Turun setiap tahun sejak puncak pandemi 2020.</p>' +
          '<canvas id="ch-tpt" class="chart" height="260"></canvas></section>' +
        '<section class="panel"><h3>Angkatan kerja 2020–2024</h3>' +
          '<p class="panel-sub">Sakernas Agustus (juta orang).</p>' +
          '<canvas id="ch-ak" class="chart" height="260"></canvas></section>' +
      '</div>' +
      '<div class="callout">Sejak Agustus 2020, angkatan kerja bertambah 13,89 juta orang sementara jumlah penganggur berkurang dari 9,77 juta menjadi 7,47 juta — pasar kerja pulih, tetapi 7,47 juta orang masih mencari pekerjaan.</div>' +
      '<section class="panel"><h3>Tabel: pengangguran terbuka</h3>' + seriesTable(D.indicators.tpt) + '</section>';
  }

  function kemiskinan() {
    return head('<a href="#/">Beranda</a> › Kemiskinan', 'Kemiskinan & Kesejahteraan', 'Penduduk miskin 8,57% pada September 2024 — terendah sepanjang sejarah pencatatan. IPM naik ke 75,02 dan gini turun ke 0,379.') +
      '<div class="kpis">' +
        kpi('Kemiskinan Sep 2024', '8,57<small>%</small>', '24,06 juta jiwa — terendah sepanjang pencatatan', '▼ dari 9,03% (Mar 2024)') +
        kpi('Kemiskinan Mar 2024', '9,03<small>%</small>', 'turun dari 10,14% (Mar 2021)') +
        kpi('IPM 2024', '75,02', 'naik 0,63 poin dari 2023', '▲ +2,21 poin sejak 2020') +
        kpi('Rasio gini Mar 2024', '0,379', 'dari 0,388 (Mar 2023)', '▼ ketimpangan menurun') +
      '</div>' +
      '<div class="grid-2">' +
        '<section class="panel"><h3>Penduduk miskin Maret 2020–2024</h3>' +
          '<p class="panel-sub">Persentase penduduk miskin (%). September 2024: 8,57%.</p>' +
          '<canvas id="ch-pov" class="chart" height="260"></canvas></section>' +
        '<section class="panel"><h3>Indeks Pembangunan Manusia 2020–2024</h3>' +
          '<p class="panel-sub">IPM BPS. Indonesia naik kelas dari 72,81 ke 75,02 dalam lima tahun.</p>' +
          '<canvas id="ch-ipm" class="chart" height="260"></canvas></section>' +
      '</div>' +
      '<section class="panel"><h3>Rasio gini Maret 2020–2024</h3>' +
        '<p class="panel-sub">Ketimpangan pengeluaran (0 = merata sempurna). Maret 2024: 0,379.</p>' +
        '<canvas id="ch-gini" class="chart" height="240"></canvas></section>' +
      '<section class="panel"><h3>Tabel: penduduk miskin</h3>' + seriesTable(D.indicators.kemiskinan) + '</section>';
  }

  function daerah() {
    var opts = D.provinces.map(function (p) { return p.name; }).join('|');
    return head('<a href="#/">Beranda</a> › Daerah', 'Daerah', 'Enam provinsi terpadat menampung sekitar 60% penduduk Indonesia. Klik judul kolom untuk mengurutkan, ketik di kotak cari untuk menyaring.') +
      '<section class="panel"><h3>Provinsi terpadat 2024</h3>' +
        '<p class="panel-sub">Penduduk (juta jiwa) dan pangsa terhadap penduduk nasional, BPS 2024.</p>' +
        '<div class="controls"><label class="field">Cari provinsi<input type="search" id="provSearch" placeholder="mis. Jawa…" autocomplete="off"></label>' +
        '<button class="btn ghost" id="provReset" type="button">Atur ulang</button></div>' +
        '<div class="table-scroll"><table class="data" id="provTable"><thead><tr>' +
        '<th class="sortable" data-key="name" data-dir="1">Provinsi ▲</th>' +
        '<th class="sortable" data-key="pop" data-dir="-1">Penduduk (jt)</th>' +
        '<th class="sortable" data-key="share" data-dir="-1">Pangsa</th></tr></thead><tbody id="provBody"></tbody></table></div>' +
        '<p class="note" id="provCount"></p></section>' +
      '<section class="panel"><h3>Perbandingan penduduk provinsi</h3>' +
        '<p class="panel-sub">Juta jiwa, 2024. Jawa Barat hampir lima kali DKI Jakarta.</p>' +
        '<canvas id="ch-prov2" class="chart" height="280"></canvas></section>';
  }

  function penjelajah() {
    var indOpts = Object.keys(D.indicators).map(function (k) {
      var ind = D.indicators[k];
      return '<option value="' + k + '">' + esc(ind.label) + (ind.unit ? ' (' + esc(ind.unit) + ')' : '') + '</option>';
    }).join('');
    var yearOpts = D.years.map(function (y) { return '<option value="' + y + '">' + y + '</option>'; }).join('');
    return head('<a href="#/">Beranda</a> › Penjelajah Data', 'Penjelajah Data', 'Pilih indikator dan rentang tahun, lalu lihat grafik dan tabelnya — dan unduh sebagai CSV.') +
      '<section class="panel"><h3>Buat tampilanmu sendiri</h3>' +
        '<div class="controls">' +
        '<label class="field">Indikator<select id="exInd">' + indOpts + '</select></label>' +
        '<label class="field">Dari tahun<select id="exFrom">' + yearOpts + '</select></label>' +
        '<label class="field">Sampai tahun<select id="exTo">' + yearOpts + '</select></label>' +
        '<span class="field">Jenis grafik<span class="toggle" role="group" aria-label="Jenis grafik">' +
        '<button type="button" id="exLine" aria-pressed="true">Garis</button>' +
        '<button type="button" id="exBar" aria-pressed="false">Batang</button></span></span>' +
        '<button class="btn amber" id="exCsv" type="button">Unduh CSV</button>' +
        '</div>' +
        '<canvas id="ch-ex" class="chart" height="280"></canvas>' +
        '<p class="note" id="exNote"></p>' +
        '<div id="exTable"></div></section>';
  }

  function tentang() {
    return head('<a href="#/">Beranda</a> › Tentang', 'Tentang DataNusa', 'Apa itu DataNusa, dari mana angkanya, dan bagaimana cara membacanya.') +
      '<section class="panel"><h3>Apa itu DataNusa?</h3>' +
      '<p>DataNusa adalah situs statistik independen tentang Indonesia. Situs ini merangkum angka-angka utama — penduduk, ekonomi, tenaga kerja, kemiskinan, dan daerah — dari publikasi Badan Pusat Statistik (BPS) ke dalam halaman-halaman yang mudah dibaca di desktop maupun ponsel.</p>' +
      '<p>DataNusa <strong>bukan</strong> situs resmi BPS dan tidak berafiliasi dengan BPS. Nama, desain, dan tulisan di situs ini asli buatan DataNusa.</p></section>' +
      '<section class="panel"><h3>Dari mana angkanya?</h3>' +
      '<p>Semua angka berasal dari publikasi BPS: hasil Sensus dan estimasi penduduk, PDB, Sakernas (Survei Angkatan Kerja Nasional), Susenas (kemiskinan dan gini), serta Indeks Pembangunan Manusia. Deret yang ditampilkan adalah 2020–2024. Angka yang belum terverifikasi tidak ditampilkan. Pangsa PDB menurut lapangan usaha 2024 ditandai sebagai perkiraan dari pangsa yang dipublikasikan.</p>' +
      '<p class="note">Sumber: BPS — Badan Pusat Statistik (diolah, 2026). Situs independen, bukan afiliasi BPS.</p></section>' +
      '<section class="panel"><h3>Definisi singkat</h3>' +
      '<div class="table-scroll"><table class="data"><thead><tr><th>Istilah</th><th>Arti</th></tr></thead><tbody>' +
      '<tr><td>PDB nominal</td><td>Nilai tambah seluruh barang dan jasa atas dasar harga berlaku.</td></tr>' +
      '<tr><td>TPT</td><td>Tingkat pengangguran terbuka: penganggur dibagi angkatan kerja.</td></tr>' +
      '<tr><td>Angkatan kerja</td><td>Penduduk usia kerja (15+) yang bekerja atau mencari pekerjaan.</td></tr>' +
      '<tr><td>Garis kemiskinan</td><td>Batas pengeluaran per kapita per bulan; di bawahnya disebut miskin.</td></tr>' +
      '<tr><td>Rasio gini</td><td>Ukuran ketimpangan 0–1; 0 berarti pengeluaran semua orang sama.</td></tr>' +
      '<tr><td>IPM</td><td>Indeks Pembangunan Manusia: kesehatan, pendidikan, dan standar hidup layak.</td></tr>' +
      '</tbody></table></div></section>' +
      '<section class="panel"><h3>Teknis</h3>' +
      '<p>Situs ini berupa berkas statis tanpa langkah build dan tanpa permintaan jaringan apa pun: semua data, gaya, dan grafik tersimpan di dalam situs. Buka <code>index.html</code> lewat server statis apa pun (misalnya <code>npx serve app</code>) dan semua halaman bekerja. Grafik digambar dengan kode canvas buatan sendiri.</p></section>';
  }

  var ROUTES = {
    '': home, 'penduduk': penduduk, 'ekonomi': ekonomi,
    'tenaga-kerja': tenagaKerja, 'kemiskinan': kemiskinan,
    'daerah': daerah, 'penjelajah': penjelajah, 'tentang': tentang
  };

  function drawCharts(route) {
    var $ = function (s) { return document.querySelector(s); };
    var years = D.years.map(String);
    var sec = D.sectors;
    if (route === '') {
      C.line($('#ch-growth'), { labels: years, values: D.indicators.pdbTumbuh.values, decimals: 2, color: '#0f766e', yLabel: '% y-on-y' });
      C.donut($('#ch-sectors'), { labels: sec.map(function (s) { return s.short; }), values: sec.map(function (s) { return s.share; }) });
    } else if (route === 'penduduk') {
      C.line($('#ch-pop'), { labels: years, values: D.indicators.penduduk.values, decimals: 1, color: '#0f766e', yLabel: 'juta jiwa' });
      C.bar($('#ch-prov'), { labels: D.provinces.map(function (p) { return p.name; }), values: D.provinces.map(function (p) { return p.pop; }), decimals: 2, horizontal: true });
    } else if (route === 'ekonomi') {
      C.bar($('#ch-gdp'), { labels: years, values: D.indicators.pdbNominal.values, decimals: 0, color: '#0f766e', yLabel: 'Rp triliun' });
      C.line($('#ch-growth2'), { labels: years, values: D.indicators.pdbTumbuh.values, decimals: 2, color: '#0f766e', yLabel: '% y-on-y' });
      C.line($('#ch-inf'), { labels: years, values: D.indicators.inflasi.values, decimals: 2, color: '#d97706', yLabel: '% y-on-y' });
      C.donut($('#ch-sectors2'), { labels: sec.map(function (s) { return s.short; }), values: sec.map(function (s) { return s.share; }) });
    } else if (route === 'tenaga-kerja') {
      C.line($('#ch-tpt'), { labels: years, values: D.indicators.tpt.values, decimals: 2, color: '#0f766e', yLabel: '%' });
      C.line($('#ch-ak'), { labels: years, values: D.indicators.angkatanKerja.values, decimals: 2, color: '#d97706', yLabel: 'juta orang' });
    } else if (route === 'kemiskinan') {
      C.line($('#ch-pov'), { labels: years, values: D.indicators.kemiskinan.values, decimals: 2, color: '#0f766e', yLabel: '%' });
      C.line($('#ch-ipm'), { labels: years, values: D.indicators.ipm.values, decimals: 2, color: '#0f766e' });
      C.line($('#ch-gini'), { labels: years, values: D.indicators.gini.values, decimals: 3, color: '#d97706' });
    } else if (route === 'daerah') {
      C.bar($('#ch-prov2'), { labels: D.provinces.map(function (p) { return p.name; }), values: D.provinces.map(function (p) { return p.pop; }), decimals: 2, horizontal: true });
    }
  }

  window.DataNusaViews = { routes: ROUTES, drawCharts: drawCharts };
})();
