/* Gouvernance et actuariat — Paysage Gouvernance-Actuariat
   Diagramme de flux en SVG vanilla, à 5 colonnes, inspiré du système visuel
   du "Cerveau collectif" (cartes proportionnelles, voie privilégiée, sélection
   avec propagation des connexions, infobulles). Données statiques (voir
   assets/landscape-data.js) : aucune dépendance externe. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var FONT = {
    'cbl-col-head': '800 11px "Segoe UI",sans-serif',
    'cbl-col-sub': '400 9.5px "Segoe UI",sans-serif',
    'cbl-n-label': '400 11px "Segoe UI",sans-serif',
    'cbl-n-count': '800 11px "Segoe UI",sans-serif'
  };
  var measureCanvas = document.createElement('canvas').getContext('2d');
  function measureText(text, cls) {
    measureCanvas.font = FONT[cls] || '11px sans-serif';
    return measureCanvas.measureText(text).width;
  }
  function wrapWords(text, maxWidth, cls) {
    var words = String(text).split(' ');
    var lines = [], cur = '';
    words.forEach(function (w) {
      var test = cur ? cur + ' ' + w : w;
      if (measureText(test, cls) > maxWidth && cur) { lines.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }
  function bezierPath(x1, y1, x2, y2) {
    var dx = Math.max(40, (x2 - x1) * 0.5);
    return 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + dx) + ' ' + y1 + ', ' + (x2 - dx) + ' ' + y2 + ', ' + x2 + ' ' + y2;
  }

  function mountLandscape(mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    var data = window.GovAct.LANDSCAPE;
    var LAYER_ORDER = data.layers.map(function (l) { return l.key; });
    var layerByKey = {}; data.layers.forEach(function (l) { layerByKey[l.key] = l; });
    var COLORS = {}; data.layers.forEach(function (l) { COLORS[l.key] = l.color; });

    var W = 1560, H = 800, COL_W = 258, GAP_X = 67;
    var COLX = {}, COLW = {};
    LAYER_ORDER.forEach(function (k, i) { COLX[k] = 14 + i * (COL_W + GAP_X); COLW[k] = COL_W; });
    var BOTY = H - 24, TOPY = 90, AVAILH = BOTY - TOPY;
    var MINH = 22, GAP = 7;

    mount.innerHTML =
      '<div class="cbl-wrap">' +
      '<div class="cbl-toolbar">' +
      '<div class="cbl-legend">' +
      data.layers.map(function (l) { return '<span><i style="background:' + l.color + '"></i>' + l.titleFr + '</span>'; }).join('') +
      '</div>' +
      '</div>' +
      '<div class="cbl-story" id="cbl-story"></div>' +
      '<div class="cbl-mode-hint" id="cbl-mode-hint"></div>' +
      '<div class="cbl-gp-caption" id="cbl-gp-caption"></div>' +
      '<div class="cbl-svg-wrap"><svg id="cbl-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"></svg></div>' +
      '</div>' +
      '<div class="cbl-tip" id="cbl-tip"></div>';

    var svg = document.getElementById('cbl-svg');
    var tip = document.getElementById('cbl-tip');
    var selected = null;

    document.getElementById('cbl-mode-hint').textContent =
      'Chaque carte est dimensionnée selon le nombre de lignes directrices qu’elle représente. Cliquez sur un élément pour tracer ses connexions dans le paysage.';

    function showTip(html, x, y) { tip.innerHTML = html; tip.style.left = (x + 14) + 'px'; tip.style.top = (y + 14) + 'px'; tip.classList.add('show'); }
    function hideTip() { tip.classList.remove('show'); }

    function visibleIds(key) {
      var nodes = layerByKey[key].nodes;
      var ids = Object.keys(nodes).filter(function (id) { return nodes[id].count > 0; });
      ids.sort(function (a, b) { return nodes[b].count - nodes[a].count; });
      return ids;
    }

    function layoutCol(key, ids) {
      var nodes = layerByKey[key].nodes;
      var total = ids.reduce(function (s, id) { return s + nodes[id].count; }, 0) || 1;
      var n = ids.length;
      var rawH = ids.map(function (id) { return Math.max(MINH, (nodes[id].count / total) * (AVAILH - GAP * (n - 1))); });
      var sumRaw = rawH.reduce(function (a, b) { return a + b; }, 0);
      var scale = sumRaw > AVAILH - GAP * (n - 1) ? (AVAILH - GAP * (n - 1)) / sumRaw : 1;
      var heights = rawH.map(function (h) { return h * scale; });
      var totalH = heights.reduce(function (a, b) { return a + b; }, 0) + GAP * (n - 1);
      var y = TOPY + (AVAILH - totalH) / 2;
      var out = {};
      ids.forEach(function (id, i) { out[id] = { y: y, h: heights[i] }; y += heights[i] + GAP; });
      return out;
    }

    var colIds = {}, nodeLayout = {};
    function nodeCenter(key, id) {
      var Lo = nodeLayout[key][id]; if (!Lo) return null;
      return { xL: COLX[key], xR: COLX[key] + COLW[key], yM: Lo.y + Lo.h / 2, y: Lo.y, h: Lo.h };
    }

    function edgesFor(fromKey, toKey) { return data.edges[fromKey + '-' + toKey] || []; }

    function draw() {
      svg.innerHTML = '';
      var HEAD_TOP = 34, TITLE_LH = 14, HEAD_GAP = 14, SUB_LH = 11, HEAD_BOTTOM_GAP = 22;
      var headerLines = {}, headerBottom = 0;
      data.layers.forEach(function (l) {
        var w = COLW[l.key];
        var titleLines = wrapWords(l.titleFr, w, 'cbl-col-head');
        var subLines = wrapWords(l.subFr, w, 'cbl-col-sub');
        headerLines[l.key] = { title: titleLines, sub: subLines };
        var subFirstY = HEAD_TOP + (titleLines.length - 1) * TITLE_LH + HEAD_GAP;
        var bottom = subFirstY + (subLines.length - 1) * SUB_LH + HEAD_BOTTOM_GAP;
        if (bottom > headerBottom) headerBottom = bottom;
      });
      TOPY = headerBottom; AVAILH = BOTY - TOPY;

      LAYER_ORDER.forEach(function (k) { colIds[k] = visibleIds(k); nodeLayout[k] = layoutCol(k, colIds[k]); });

      data.layers.forEach(function (l) {
        var x = COLX[l.key]; var hl = headerLines[l.key];
        hl.title.forEach(function (ln, i) {
          var t1 = el('text', { x: x, y: HEAD_TOP + i * TITLE_LH, class: 'cbl-col-head', fill: l.color }); t1.textContent = ln; svg.appendChild(t1);
        });
        var subFirstY = HEAD_TOP + (hl.title.length - 1) * TITLE_LH + HEAD_GAP;
        hl.sub.forEach(function (ln, i) {
          var t2 = el('text', { x: x, y: subFirstY + i * SUB_LH, class: 'cbl-col-sub' }); t2.textContent = ln; svg.appendChild(t2);
        });
      });

      var edgeLayer = el('g', {}); svg.appendChild(edgeLayer);
      var goldLayer = el('g', {}); svg.appendChild(goldLayer);
      var nodeLayer = el('g', {}); svg.appendChild(nodeLayer);
      var badgeLayer = el('g', {}); svg.appendChild(badgeLayer);

      var highlightSet = null, highlightPairs = null;
      if (selected) {
        highlightSet = { domain: {}, tier: {}, fn: {}, lever: {}, outcome: {} };
        highlightPairs = {};
        highlightSet[selected.key][selected.id] = true;
        var order = LAYER_ORDER;
        var idx = order.indexOf(selected.key);
        function expand(fromKey, toKey, edges, reverse) {
          edges.forEach(function (e) {
            var a = e[0], b = e[1];
            if (reverse) { if (highlightSet[toKey][b]) { highlightSet[fromKey][a] = true; highlightPairs[fromKey + ':' + a + '>' + toKey + ':' + b] = true; } }
            else { if (highlightSet[fromKey][a]) { highlightSet[toKey][b] = true; highlightPairs[fromKey + ':' + a + '>' + toKey + ':' + b] = true; } }
          });
        }
        for (var i = idx; i < order.length - 1; i++) expand(order[i], order[i + 1], edgesFor(order[i], order[i + 1]), false);
        for (var j = idx; j > 0; j--) expand(order[j - 1], order[j], edgesFor(order[j - 1], order[j]), true);
      }

      function drawEdgeSet(fromKey, toKey) {
        edgesFor(fromKey, toKey).forEach(function (e) {
          var a = e[0], b = e[1], w = e[2];
          if (colIds[fromKey].indexOf(a) < 0 || colIds[toKey].indexOf(b) < 0) return;
          var A = nodeCenter(fromKey, a), B = nodeCenter(toKey, b);
          if (!A || !B) return;
          var pairKey = fromKey + ':' + a + '>' + toKey + ':' + b;
          var isHighlighted = highlightPairs && highlightPairs[pairKey];
          var sw = 1.2 + w * 0.5, stroke = '#94A3B8', opacity = 0.25 + w * 0.03;
          if (selected) {
            if (isHighlighted) { stroke = COLORS[toKey]; opacity = 0.75; sw = Math.max(2, 1.4 + w * 0.7); }
            else opacity = 0.03;
          }
          var path = el('path', { d: bezierPath(A.xR, A.yM, B.xL, B.yM), class: 'cbl-edge', stroke: stroke, 'stroke-width': sw, opacity: opacity });
          var ttl = el('title', {}); ttl.textContent = layerByKey[fromKey].nodes[a].name + ' → ' + layerByKey[toKey].nodes[b].name + ' (' + w + ')';
          path.appendChild(ttl);
          edgeLayer.appendChild(path);
        });
      }
      for (var e2 = 0; e2 < LAYER_ORDER.length - 1; e2++) drawEdgeSet(LAYER_ORDER[e2], LAYER_ORDER[e2 + 1]);

      if (!selected) {
        var gd = data.golden;
        var gp = [
          ['domain', gd.domain, 'tier', gd.tier], ['tier', gd.tier, 'fn', gd.fn],
          ['fn', gd.fn, 'lever', gd.lever], ['lever', gd.lever, 'outcome', gd.outcome]
        ];
        var drawn = 0;
        gp.forEach(function (seg) {
          if (colIds[seg[0]].indexOf(seg[1]) < 0 || colIds[seg[2]].indexOf(seg[3]) < 0) return;
          var A = nodeCenter(seg[0], seg[1]), B = nodeCenter(seg[2], seg[3]);
          if (!A || !B) return;
          goldLayer.appendChild(el('path', { d: bezierPath(A.xR, A.yM, B.xL, B.yM), stroke: '#C68A3D', 'stroke-width': 3.6, fill: 'none', opacity: 0.65, 'stroke-linecap': 'round' }));
          drawn++;
        });
        document.getElementById('cbl-gp-caption').textContent = drawn ? '◆ Voie privilégiée — l’itinéraire le plus marqué du domaine au résultat' : '';
      } else {
        document.getElementById('cbl-gp-caption').textContent = '';
      }

      LAYER_ORDER.forEach(function (key) {
        colIds[key].forEach(function (id) {
          var node = layerByKey[key].nodes[id];
          var Lo = nodeLayout[key][id];
          var dim = selected && !(selected.key === key && selected.id === id) && (!highlightSet[key] || !highlightSet[key][id]);
          var isSel = selected && selected.key === key && selected.id === id;
          var g2 = el('g', { class: 'cbl-node', tabindex: 0, role: 'button', 'aria-label': node.name, 'data-key': key, 'data-id': id });
          var rect = el('rect', { class: 'cbl-card', x: COLX[key], y: Lo.y, width: COLW[key], height: Lo.h, rx: 9, fill: isSel ? COLORS[key] : '#fff', stroke: COLORS[key], 'stroke-width': isSel ? 0 : 1.6, opacity: dim ? 0.22 : 1 });
          g2.appendChild(rect);
          if (!isSel) g2.appendChild(el('rect', { x: COLX[key], y: Lo.y, width: 4, height: Lo.h, rx: 2, fill: COLORS[key], opacity: dim ? 0.22 : 1 }));
          var maxLabelW = COLW[key] - 14 - 30;
          var labelLines = wrapWords(node.short || node.name, maxLabelW, 'cbl-n-label');
          if (labelLines.length > 2) labelLines = [labelLines[0], labelLines.slice(1).join(' ')];
          var LBL_LH = 12;
          var labelStartY = Lo.y + Lo.h / 2 + 4 - (labelLines.length - 1) * LBL_LH / 2;
          labelLines.forEach(function (ln, li) {
            var label = el('text', { x: COLX[key] + 14, y: labelStartY + li * LBL_LH, class: 'cbl-n-label', fill: isSel ? '#fff' : '#0F172A', opacity: dim ? 0.32 : 1 });
            label.textContent = ln; g2.appendChild(label);
          });
          var cntTxt = el('text', { x: COLX[key] + COLW[key] - 10, y: Lo.y + Lo.h / 2 + 4, class: 'cbl-n-count', fill: isSel ? '#fff' : COLORS[key], 'text-anchor': 'end', opacity: dim ? 0.32 : 1 });
          cntTxt.textContent = node.count; g2.appendChild(cntTxt);
          g2.addEventListener('click', function () { selectNode(key, id); });
          g2.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectNode(key, id); } });
          g2.addEventListener('mousemove', function (ev) {
            var unit = ' lignes directrices (sur ' + data.totalGuidelines + ')';
            showTip('<b>' + escapeHtml(node.name) + '</b><br>' + node.count + unit, ev.clientX, ev.clientY);
          });
          g2.addEventListener('mouseleave', hideTip);
          nodeLayer.appendChild(g2);
        });
      });

      if (!selected) {
        var badges = [];
        function topOf(key, label) { var top = colIds[key][0]; if (top) badges.push({ node: nodeCenter(key, top), color: COLORS[key], text: label }); }
        topOf('domain', 'DOMAINE LE PLUS ÉTOFFÉ');
        topOf('fn', 'FONCTION LA PLUS SOLLICITÉE');
        topOf('lever', 'LEVIER PRINCIPAL');
        topOf('outcome', 'AMBITION PARTAGÉE');
        badges.forEach(function (b) {
          if (!b.node) return;
          var w = measureText(b.text, 'cbl-n-count') + 16;
          var x = b.node.xL - 2, y = b.node.y - 11;
          badgeLayer.appendChild(el('rect', { x: x, y: y - 11, width: w, height: 16, rx: 8, fill: b.color, opacity: 0.92 }));
          var t = el('text', { x: x + 8, y: y + 1, class: 'cbl-n-count', fill: '#fff' }); t.textContent = b.text;
          badgeLayer.appendChild(t);
        });
      }

      renderStory();
    }

    function selectNode(key, id) {
      if (selected && selected.key === key && selected.id === id) { clearSelection(); return; }
      selected = { key: key, id: id }; draw();
    }
    function clearSelection() { selected = null; draw(); }

    function pct(n) { return Math.round((n / data.totalGuidelines) * 100); }
    function topLinkedForward(fromKey, toKey, id) {
      var best = null;
      edgesFor(fromKey, toKey).forEach(function (e) { if (e[0] === id && (!best || e[2] > best[2])) best = e; });
      return best ? best[1] : null;
    }
    function topLinkedBackward(fromKey, toKey, id) {
      var best = null;
      edgesFor(fromKey, toKey).forEach(function (e) { if (e[1] === id && (!best || e[2] > best[2])) best = e; });
      return best ? best[0] : null;
    }

    function renderStory() {
      var html = '<button class="cbl-reset' + (selected ? ' show' : '') + '" id="cbl-reset-btn">Réinitialiser</button>';
      if (!selected) {
        var gd = data.golden;
        var dNode = layerByKey.domain.nodes[gd.domain], tNode = layerByKey.tier.nodes[gd.tier], fNode = layerByKey.fn.nodes[gd.fn], lNode = layerByKey.lever.nodes[gd.lever], oNode = layerByKey.outcome.nodes[gd.outcome];
        html += 'Sur les <b>' + data.totalGuidelines + ' lignes directrices</b> de bonne gouvernance de l’AISS, <b>' + data.totalDirect + '</b> touchent directement la pratique actuarielle, <b>' + data.totalIndirect + '</b> y sont indirectement liées, et <b>' + data.totalFondamental + '</b> établissent le cadre institutionnel général. ' +
          'Le domaine <b>' + dNode.name + '</b> est celui qui porte le plus directement sur l’actuariat : il alimente la fonction <b>' + fNode.short + '</b>, qui se traduit par le levier <b>' + lNode.short + '</b> — visant en premier lieu <b>' + oNode.short + '</b>. Sélectionnez un élément ci-dessous pour explorer ses connexions.';
      } else {
        var key = selected.key, id = selected.id, node = layerByKey[key].nodes[id], n = node.count;
        if (key === 'domain') {
          var t1 = topLinkedForward('domain', 'tier', id);
          html += '<b>' + node.name + '</b> — ' + n + ' des 72 lignes directrices. ' + (t1 ? 'Sa composante la plus importante relève du niveau <b>' + layerByKey.tier.nodes[t1].short + '</b>.' : '');
        } else if (key === 'tier') {
          var d1 = topLinkedBackward('domain', 'tier', id), f1 = topLinkedForward('tier', 'fn', id);
          html += '<b>' + node.name + '</b> — ' + n + ' lignes directrices (' + pct(n) + ' % du total). ' +
            (d1 ? 'Le domaine le plus représenté à ce niveau est <b>' + layerByKey.domain.nodes[d1].short + '</b>. ' : '') +
            (f1 ? 'Lorsqu’un lien vers l’actuariat existe, il alimente le plus souvent la fonction <b>' + layerByKey.fn.nodes[f1].short + '</b>.' : 'Ces lignes directrices ne se prolongent pas directement dans une fonction actuarielle : elles forment le cadre institutionnel général dans lequel s’exerce la pratique actuarielle.');
        } else if (key === 'fn') {
          var t2 = topLinkedBackward('tier', 'fn', id), l1 = topLinkedForward('fn', 'lever', id);
          html += '<b>' + node.name + '</b> — nourrie par ' + n + ' lignes directrices. ' + (l1 ? 'Elle se traduit avant tout par le levier <b>' + layerByKey.lever.nodes[l1].short + '</b>.' : '');
        } else if (key === 'lever') {
          var f2 = topLinkedBackward('fn', 'lever', id), o1 = topLinkedForward('lever', 'outcome', id);
          html += '<b>' + node.name + '</b> — un levier concret pour la pratique actuarielle. ' + (o1 ? 'Il contribue avant tout à <b>' + layerByKey.outcome.nodes[o1].short + '</b>.' : '');
        } else if (key === 'outcome') {
          var l2 = topLinkedBackward('lever', 'outcome', id);
          html += '<b>' + node.name + '</b> — le résultat institutionnel recherché. ' + (l2 ? 'Le levier qui y contribue le plus est <b>' + layerByKey.lever.nodes[l2].short + '</b>.' : '');
        }
      }
      document.getElementById('cbl-story').innerHTML = html;
      var resetBtn = document.getElementById('cbl-reset-btn');
      if (resetBtn) resetBtn.addEventListener('click', clearSelection);
    }

    draw();
    window.addEventListener('resize', function () { /* fixed-width canvas, scrolls horizontally by design */ });
  }

  window.GovAct = window.GovAct || {};
  window.GovAct.mountLandscape = mountLandscape;
})();
