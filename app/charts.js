// DataNusa — chart helpers. Semua grafik digambar sendiri di <canvas>:
// tanpa pustaka luar, tanpa jaringan. Warna: teal #0f766e, amber #d97706.
(function () {
  'use strict';

  var TEAL = '#0f766e', TEAL_DARK = '#0b5e57', AMBER = '#d97706',
      GRID = '#dfe9e6', AXIS = '#5b6b69', INK = '#1c2b2a';
  var PALETTE = ['#0f766e', '#d97706', '#2563eb', '#7c3aed', '#db2777',
                 '#059669', '#b45309', '#4d7c0f', '#0891b2', '#be185d'];

  function setup(canvas, hCss) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
    var h = hCss || 260;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function niceNum(x) {
    if (x <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(x)));
    var f = x / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }

  function fmt(v, decimals) {
    return v.toLocaleString('id-ID', { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 });
  }

  function axes(ctx, box, yMin, yMax, yTicks, xLabels) {
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = AXIS;
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    yTicks.forEach(function (t) {
      var y = box.y + box.h - ((t - yMin) / (yMax - yMin)) * box.h;
      ctx.beginPath(); ctx.moveTo(box.x, y); ctx.lineTo(box.x + box.w, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(fmt(t, 0), box.x - 6, y);
    });
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    xLabels.forEach(function (lab, i) {
      var x = box.x + (i + 0.5) * (box.w / xLabels.length);
      ctx.fillText(String(lab), x, box.y + box.h + 6);
    });
  }

  function lineChart(canvas, opts) {
    // opts: { labels, values, decimals, color, height, yLabel }
    var s = setup(canvas, opts.height || 260);
    var ctx = s.ctx, padL = 52, padR = 14, padT = 14, padB = 26;
    var box = { x: padL, y: padT, w: s.w - padL - padR, h: s.h - padT - padB };
    var vals = opts.values;
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var span = hi - lo || 1;
    var yMin = Math.floor((lo - span * 0.15) / niceNum(span * 0.3)) * niceNum(span * 0.3);
    var yMax = Math.ceil((hi + span * 0.15) / niceNum(span * 0.3)) * niceNum(span * 0.3);
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    var step = niceNum((yMax - yMin) / 4);
    var ticks = [];
    for (var t = Math.ceil(yMin / step) * step; t <= yMax + 1e-9; t += step) ticks.push(t);
    axes(ctx, box, yMin, yMax, ticks, opts.labels);
    var px = function (i) { return box.x + (i + 0.5) * (box.w / vals.length); };
    var py = function (v) { return box.y + box.h - ((v - yMin) / (yMax - yMin)) * box.h; };
    ctx.strokeStyle = opts.color || TEAL; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    ctx.beginPath();
    vals.forEach(function (v, i) { i ? ctx.lineTo(px(i), py(v)) : ctx.moveTo(px(i), py(v)); });
    ctx.stroke();
    // area fill
    ctx.lineTo(px(vals.length - 1), box.y + box.h); ctx.lineTo(px(0), box.y + box.h); ctx.closePath();
    ctx.fillStyle = (opts.color || TEAL) + '1f'; ctx.fill();
    // points + value labels
    ctx.font = 'bold 12px system-ui, sans-serif';
    vals.forEach(function (v, i) {
      ctx.beginPath(); ctx.arc(px(i), py(v), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.strokeStyle = opts.color || TEAL; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(fmt(v, opts.decimals || 0), px(i), py(v) - 8);
    });
    if (opts.yLabel) {
      ctx.fillStyle = AXIS; ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(opts.yLabel, padL, 0);
    }
  }

  function barChart(canvas, opts) {
    // opts: { labels, values, decimals, color, height, horizontal, yLabel }
    var s = setup(canvas, opts.height || 280);
    var ctx = s.ctx;
    if (opts.horizontal) {
      var padL = 130, padR = 56, padT = 8, padB = 10;
      var box = { x: padL, y: padT, w: s.w - padL - padR, h: s.h - padT - padB };
      var max = Math.max.apply(null, opts.values) * 1.12;
      var rowH = box.h / opts.values.length;
      ctx.font = '12px system-ui, sans-serif';
      opts.values.forEach(function (v, i) {
        var y = box.y + i * rowH + rowH * 0.18;
        var bh = rowH * 0.64;
        ctx.fillStyle = PALETTE[i % PALETTE.length];
        ctx.fillRect(box.x, y, (v / max) * box.w, bh);
        ctx.fillStyle = INK; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(opts.labels[i], box.x - 8, y + bh / 2);
        ctx.textAlign = 'left'; ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText(fmt(v, opts.decimals || 0), box.x + (v / max) * box.w + 6, y + bh / 2);
        ctx.font = '12px system-ui, sans-serif';
      });
      return;
    }
    var pL = 52, pR = 14, pT = 14, pB = 26;
    var b2 = { x: pL, y: pT, w: s.w - pL - pR, h: s.h - pT - pB };
    var hi = Math.max.apply(null, opts.values);
    var yMax = Math.ceil(hi * 1.15 / niceNum(hi * 0.3)) * niceNum(hi * 0.3);
    var step = niceNum(yMax / 4);
    var ticks = [];
    for (var t = 0; t <= yMax + 1e-9; t += step) ticks.push(t);
    axes(ctx, b2, 0, yMax, ticks, opts.labels);
    var bw = (b2.w / opts.values.length) * 0.62;
    ctx.font = 'bold 12px system-ui, sans-serif';
    opts.values.forEach(function (v, i) {
      var x = b2.x + (i + 0.5) * (b2.w / opts.values.length) - bw / 2;
      var bh = (v / yMax) * b2.h;
      ctx.fillStyle = opts.color || TEAL;
      ctx.fillRect(x, b2.y + b2.h - bh, bw, bh);
      ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(fmt(v, opts.decimals || 0), x + bw / 2, b2.y + b2.h - bh - 4);
    });
    if (opts.yLabel) {
      ctx.fillStyle = AXIS; ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(opts.yLabel, pL, 0);
    }
  }

  function donutChart(canvas, opts) {
    // opts: { labels, values, height }
    var s = setup(canvas, opts.height || 260);
    var ctx = s.ctx;
    var total = opts.values.reduce(function (a, b) { return a + b; }, 0);
    var cx = 88, cy = s.h / 2, r = Math.min(72, s.h / 2 - 12), rIn = r * 0.58;
    var a0 = -Math.PI / 2;
    opts.values.forEach(function (v, i) {
      var a1 = a0 + (v / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length]; ctx.fill();
      a0 = a1;
    });
    ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = INK; ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('100%', cx, cy - 8);
    ctx.fillStyle = AXIS; ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('pangsa PDB', cx, cy + 10);
    // legend on the right
    var lx = cx + r + 20, ly = 12;
    ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    opts.labels.forEach(function (lab, i) {
      if (ly > s.h - 10) return;
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fillRect(lx, ly - 5, 11, 11);
      ctx.fillStyle = INK;
      ctx.fillText(lab + ' — ' + fmt(opts.values[i], 1) + '%', lx + 17, ly);
      ly += 24;
    });
  }

  window.DataNusaCharts = { line: lineChart, bar: barChart, donut: donutChart, fmt: fmt };
})();
