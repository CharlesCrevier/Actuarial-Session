/* Gouvernance et actuariat — données du "Paysage Gouvernance-Actuariat"
   Un graphe pondéré à 5 colonnes, dans l'esprit visuel du Cerveau collectif :
   Domaine des Lignes directrices -> Niveau de lien actuariel -> Fonction
   actuarielle concernée -> Levier actuariel concret -> Résultat visé.
   Tous les comptages sont dérivés directement de assets/guidelines-data.js
   (voir sa note méthodologique) ; seuls le regroupement en 7 fonctions/leviers
   et les 5 résultats visés sont un choix éditorial de présentation. */
(function () {
  var g = window.GovAct.GUIDELINES;
  var domainsMeta = window.GovAct.DOMAINS;

  // ---- Colonne 1 : domaines (comptage réel tiré de guidelines-data.js) ----
  var domainNode = {};
  domainsMeta.forEach(function (d) { domainNode[d.key] = { id: d.key, name: d.label, short: d.label.replace(/^[AB]\.\d\s/, ''), count: d.count }; });

  // ---- Colonne 2 : niveau de lien actuariel ----
  var tierNode = {
    direct: { id: 'direct', name: 'Lien direct avec la pratique actuarielle', short: 'Lien direct', count: 0 },
    indirect: { id: 'indirect', name: 'Lien indirect avec la pratique actuarielle', short: 'Lien indirect', count: 0 },
    fondamental: { id: 'fondamental', name: 'Cadre institutionnel général (fondamental)', short: 'Fondamental / cadre général', count: 0 }
  };

  // ---- Colonne 3 : fonctions actuarielles concernées ----
  var FN = {
    f1: { id: 'f1', name: 'Évaluation actuarielle et viabilité financière', short: 'Évaluation & viabilité financière', count: 0 },
    f2: { id: 'f2', name: 'Gestion actif-passif et investissement', short: 'Gestion actif-passif (ALM)', count: 0 },
    f3: { id: 'f3', name: 'Gestion des risques actuariels', short: 'Gestion des risques actuariels', count: 0 },
    f4: { id: 'f4', name: 'Communication actuaire – conseil – audit', short: 'Communication actuaire-conseil-audit', count: 0 },
    f5: { id: 'f5', name: 'Fixation des cotisations et des prestations', short: 'Fixation cotisations & prestations', count: 0 },
    f6: { id: 'f6', name: 'Gouvernance des données actuarielles', short: 'Gouvernance des données', count: 0 },
    f7: { id: 'f7', name: 'Transparence et diffusion des résultats actuariels', short: 'Transparence des résultats', count: 0 }
  };

  // ---- Colonne 4 : leviers actuariels concrets ----
  var LV = {
    l1: { id: 'l1', name: 'Évaluations actuarielles périodiques et indépendantes', short: 'Évaluations périodiques indépendantes', count: 7 },
    l2: { id: 'l2', name: 'Modélisation actif-passif et suivi du rendement des investissements', short: 'Modélisation actif-passif (ALM)', count: 5 },
    l3: { id: 'l3', name: 'Registre et scénarios de risques actuariels', short: 'Registre & scénarios de risque', count: 4 },
    l4: { id: 'l4', name: 'Dialogue structuré actuaire – conseil – audit', short: 'Dialogue actuaire-conseil-audit', count: 4 },
    l5: { id: 'l5', name: 'Mécanismes d’ajustement des cotisations et des prestations', short: 'Mécanismes d’ajustement', count: 2 },
    l6: { id: 'l6', name: 'Fiabilité et gouvernance des données actuarielles', short: 'Fiabilité des données', count: 4 },
    l7: { id: 'l7', name: 'Diffusion transparente des résultats actuariels', short: 'Diffusion transparente des résultats', count: 3 }
  };

  // ---- Colonne 5 : résultats visés ----
  var OU = {
    o1: { id: 'o1', name: 'Solvabilité et viabilité financière durable', short: 'Solvabilité & viabilité durable', count: 10 },
    o2: { id: 'o2', name: 'Protection des droits aux prestations', short: 'Protection des prestations', count: 4 },
    o3: { id: 'o3', name: 'Confiance et redevabilité envers les parties prenantes', short: 'Confiance & redevabilité', count: 5 },
    o4: { id: 'o4', name: 'Résilience face aux chocs et aux risques', short: 'Résilience face aux chocs', count: 6 },
    o5: { id: 'o5', name: 'Qualité de la gouvernance et de la décision du conseil', short: 'Qualité de la décision du conseil', count: 4 }
  };

  // guideline -> fonction actuarielle (uniquement pour les lignes direct/indirect)
  var GUIDE_TO_FN = {
    4: 'f1', 7: 'f1', 9: 'f1', 26: 'f1', 28: 'f1', 38: 'f1', 39: 'f1',
    6: 'f2', 41: 'f2', 42: 'f2', 43: 'f2', 45: 'f2',
    5: 'f3', 29: 'f3', 30: 'f3', 31: 'f3',
    10: 'f4', 33: 'f4', 34: 'f4', 35: 'f4',
    22: 'f5', 40: 'f5',
    8: 'f6', 51: 'f6', 71: 'f6', 72: 'f6',
    11: 'f7', 13: 'f7', 14: 'f7'
  };

  // Colonne1 -> Colonne2 : édges réels, calculés à partir des lignes directrices elles-mêmes
  var edgesDomainTier = [];
  var tierByDomain = {};
  g.forEach(function (row) {
    tierNode[row.tier].count++;
    tierByDomain[row.domain] = tierByDomain[row.domain] || { direct: 0, indirect: 0, fondamental: 0 };
    tierByDomain[row.domain][row.tier]++;
    if (row.tier !== 'fondamental') {
      var fn = GUIDE_TO_FN[row.num];
      if (fn) FN[fn].count++;
    }
  });
  Object.keys(tierByDomain).forEach(function (dom) {
    ['direct', 'indirect', 'fondamental'].forEach(function (tier) {
      var w = tierByDomain[dom][tier];
      if (w > 0) edgesDomainTier.push([dom, tier, w]);
    });
  });

  var edgesTierFn = [];
  ['direct', 'indirect'].forEach(function (tier) {
    var tally = {};
    g.filter(function (r) { return r.tier === tier; }).forEach(function (r) {
      var fn = GUIDE_TO_FN[r.num];
      if (fn) tally[fn] = (tally[fn] || 0) + 1;
    });
    Object.keys(tally).forEach(function (fn) { edgesTierFn.push([tier, fn, tally[fn]]); });
  });

  // Colonne3 -> Colonne4 : correspondance principale 1:1 + deux liens transversaux
  var edgesFnLever = [
    ['f1', 'l1', 5], ['f1', 'l7', 2],
    ['f2', 'l2', 5],
    ['f3', 'l3', 4],
    ['f4', 'l4', 3], ['f4', 'l1', 1],
    ['f5', 'l5', 2],
    ['f6', 'l6', 4],
    ['f7', 'l7', 3]
  ];

  // Colonne4 -> Colonne5
  var edgesLeverOutcome = [
    ['l1', 'o1', 5], ['l1', 'o2', 2],
    ['l2', 'o1', 5],
    ['l3', 'o4', 4],
    ['l4', 'o3', 2], ['l4', 'o5', 2],
    ['l5', 'o2', 2],
    ['l6', 'o4', 2], ['l6', 'o5', 2],
    ['l7', 'o3', 3]
  ];

  var LAYERS = [
    { key: 'domain', color: '#BE185D', titleFr: 'Domaines des Lignes directrices', subFr: 'Les 14 domaines thématiques des Lignes directrices AISS, sur les parties A (conseil et direction) et B (domaines spécifiques)', nodes: domainNode },
    { key: 'tier', color: '#155A82', titleFr: 'Lien avec la pratique actuarielle', subFr: 'Classification éditoriale de chacune des 72 lignes directrices selon son lien avec le travail actuariel', nodes: tierNode },
    { key: 'fn', color: '#0EA5A0', titleFr: 'Fonctions actuarielles concernées', subFr: 'Les fonctions actuarielles que les lignes directrices à lien direct ou indirect viennent outiller', nodes: FN },
    { key: 'lever', color: '#D97706', titleFr: 'Leviers actuariels concrets', subFr: 'Les pratiques et livrables actuariels concrets qui traduisent ces fonctions en action', nodes: LV },
    { key: 'outcome', color: '#7C3AED', titleFr: 'Résultats visés', subFr: 'Les résultats institutionnels ultimement recherchés pour le régime de sécurité sociale', nodes: OU }
  ];

  var EDGES = {
    'domain-tier': edgesDomainTier,
    'tier-fn': edgesTierFn,
    'fn-lever': edgesFnLever,
    'lever-outcome': edgesLeverOutcome
  };

  var GOLDEN = { domain: 'b4', tier: 'direct', fn: 'f1', lever: 'l1', outcome: 'o1' };

  window.GovAct.LANDSCAPE = {
    layers: LAYERS,
    edges: EDGES,
    golden: GOLDEN,
    totalGuidelines: g.length,
    totalDirect: tierNode.direct.count,
    totalIndirect: tierNode.indirect.count,
    totalFondamental: tierNode.fondamental.count
  };
})();
