/* Gouvernance et actuariat — rendu du header/footer partagé + logique des onglets */
(function () {
  var NAV = [
    { key: 'apercu', label: 'Aperçu', href: 'index.html' },
    { key: 'paysage', label: 'Paysage Gouvernance–Actuariat', href: 'paysage.html' },
    { key: 'explorateur', label: 'Explorateur des lignes directrices', href: 'explorateur.html' },
    { key: 'focus', label: 'Focus actuariel', href: 'focus.html' }
  ];

  function renderHeader(opts) {
    var mount = document.getElementById('site-header-mount');
    if (!mount) return;
    var navHtml = NAV.map(function (item, i) {
      var sep = i > 0 ? '<span class="sep">|</span>' : '';
      var cls = item.key === opts.activeKey ? ' class="active"' : '';
      return sep + '<a href="' + item.href + '"' + cls + '>' + item.label + '</a>';
    }).join('');
    mount.innerHTML =
      '<header class="site-header">' +
      '<div class="header-top">' +
      '<div class="header-logo">AISS<br>ITC&#8209;OIT</div>' +
      '<div class="header-title"><h1>' + opts.titleHtml + '</h1><p>' + opts.subtitle + '</p></div>' +
      '<div class="header-right"><div class="header-badge"><strong>72 lignes directrices</strong>Édition 2025</div></div>' +
      '</div>' +
      '<nav class="nav-links">' + navHtml + '</nav>' +
      '</header>';
  }

  function renderFooter() {
    var mount = document.getElementById('site-footer-mount');
    if (!mount) return;
    mount.innerHTML =
      '<footer class="site-footer">' +
      'Outil d’analyse indépendant élaboré à des fins pédagogiques par le programme Gouvernance de la protection sociale et tripartisme (SPGT) de l’ITC-OIT, ' +
      'sur la base des <em>Lignes directrices de l’AISS en matière de bonne gouvernance</em> (édition révisée 2025). ' +
      'Ne constitue pas une publication officielle de l’AISS ou de l’OIT — le texte intégral des Lignes directrices est disponible sur ' +
      '<a href="https://www.issa.int/guidelines" target="_blank" rel="noopener">www.issa.int/guidelines</a>.' +
      '</footer>';
  }

  function initTabs() {
    var btns = document.querySelectorAll('.tab-btn[data-tab]');
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn[data-tab]').forEach(function (b) { b.classList.toggle('active', b === btn); });
        document.querySelectorAll('.tab-panel[data-panel]').forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-panel') === target);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initTabs);

  window.GovAct = { renderHeader: renderHeader, renderFooter: renderFooter, NAV: NAV };
})();
