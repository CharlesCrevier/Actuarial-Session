/* Gouvernance et actuariat — jeu de données des 72 Lignes directrices de l'AISS
   en matière de bonne gouvernance (édition 2025), avec classification éditoriale
   du lien avec la pratique actuarielle (direct / indirect / fondamental) et une
   note d'implication actuarielle par ligne directrice.

   Méthodologie : chaque ligne directrice a été lue dans le texte intégral (AISS,
   « Lignes directrices de l'AISS en matière de bonne gouvernance », édition
   révisée 2025) et classée en trois niveaux :
   - direct       : la ligne directrice porte explicitement sur le travail actuariel,
                    la viabilité financière ou la modélisation actif-passif ;
   - indirect      : la ligne directrice s'appuie sur des données, résultats ou
                    intrants actuariels, ou fait explicitement participer l'actuaire,
                    sans porter elle-même sur la technique actuarielle ;
   - fondamental   : la ligne directrice établit le cadre institutionnel général
                    (structures, responsabilités, ressources humaines, TIC, services)
                    dans lequel s'exerce la pratique actuarielle, sans lien technique
                    direct identifiable dans le texte.
   Cette classification est un jugement éditorial du programme SPGT de l'ITC-OIT,
   pas une catégorisation officielle de l'AISS. */
(function () {
  var DOMAINS = [
    { key: 'a1', part: 'A', label: 'A.1 Responsabilité', count: 10 },
    { key: 'a2', part: 'A', label: 'A.2 Transparence', count: 4 },
    { key: 'a3', part: 'A', label: 'A.3 Prévisibilité', count: 3 },
    { key: 'a4', part: 'A', label: 'A.4 Participation', count: 2 },
    { key: 'a5', part: 'A', label: 'A.5 Dynamisme', count: 4 },
    { key: 'b1', part: 'B', label: 'B.1 Planification stratégique', count: 5 },
    { key: 'b2', part: 'B', label: 'B.2 Gestion des risques', count: 5 },
    { key: 'b3', part: 'B', label: 'B.3 Audit interne des activités', count: 4 },
    { key: 'b4', part: 'B', label: 'B.4 Évaluation actuarielle de la viabilité financière', count: 4 },
    { key: 'b5', part: 'B', label: 'B.5 Prudence dans la gestion des investissements', count: 9 },
    { key: 'b6', part: 'B', label: 'B.6 Prévention de l’erreur, de l’évasion et de la fraude', count: 1 },
    { key: 'b7', part: 'B', label: 'B.7 Normes de services aux membres et bénéficiaires', count: 2 },
    { key: 'b8', part: 'B', label: 'B.8 Gestion des ressources humaines', count: 10 },
    { key: 'b9', part: 'B', label: 'B.9 Gouvernance des TIC', count: 9 }
  ];

  var GUIDELINES = [
    { num: 1, domain: 'a1', tier: 'fondamental', title: 'Pouvoirs et responsabilités du conseil et de la direction', note: 'Définit la frontière entre l’organe de gouvernance (conseil) et la direction exécutive — le socle institutionnel sur lequel repose le niveau auquel l’actuaire doit rapporter.' },
    { num: 2, domain: 'a1', tier: 'fondamental', title: 'Aptitude, compétence et indépendance politique du conseil et de la direction', note: 'Exige des administrateurs compétents et indépendants — une condition de base pour qu’ils soient en mesure de comprendre et d’exploiter les résultats actuariels.' },
    { num: 3, domain: 'a1', tier: 'fondamental', title: 'Responsabilité légale des membres du conseil et de la direction', note: 'Établit la responsabilité juridique des dirigeants, y compris pour les décisions prises sur la base des évaluations actuarielles.' },
    { num: 4, domain: 'a1', tier: 'indirect', title: 'Planification stratégique', note: 'Le plan stratégique doit couvrir explicitement la viabilité financière des programmes gérés — l’un des cinq volets que l’actuaire est appelé à documenter.' },
    { num: 5, domain: 'a1', tier: 'direct', title: 'Gestion du risque', note: 'Désigne l’actuaire en chef parmi les « propriétaires du risque » chargés d’identifier et d’atténuer les risques pesant sur la viabilité financière des programmes.' },
    { num: 6, domain: 'a1', tier: 'direct', title: 'Gestion des investissements', note: 'Recommande explicitement la modélisation actif-passif comme volet de la gouvernance des investissements — un exercice actuariel par excellence.' },
    { num: 7, domain: 'a1', tier: 'direct', title: 'Viabilité financière des programmes', note: 'Ligne directrice intégralement actuarielle : nomination d’un actuaire rapportant au conseil, fréquence des évaluations, conformité aux normes de l’Association actuarielle internationale.' },
    { num: 8, domain: 'a1', tier: 'indirect', title: 'Gouvernance numérique', note: 'Le cadre de gouvernance des données et de l’intelligence artificielle qu’elle prescrit conditionne la qualité des données mobilisées dans les évaluations actuarielles.' },
    { num: 9, domain: 'a1', tier: 'indirect', title: 'Performance de la direction', note: 'Les indicateurs de viabilité financière issus des évaluations actuarielles servent de référence pour juger la performance de la direction.' },
    { num: 10, domain: 'a1', tier: 'direct', title: 'Systèmes de contrôle internes et externes', note: 'Prescrit explicitement la nomination d’un actuaire (interne, externe ou les deux) rapportant directement au conseil, aux côtés des auditeurs interne et externe.' },

    { num: 11, domain: 'a2', tier: 'indirect', title: 'Politique sur la divulgation', note: 'Encadre la publication des résultats institutionnels, dont les indicateurs actuariels de viabilité financière.' },
    { num: 12, domain: 'a2', tier: 'fondamental', title: 'Code de conduite', note: 'Fixe les règles d’intégrité applicables à l’ensemble du personnel, actuaires compris.' },
    { num: 13, domain: 'a2', tier: 'indirect', title: 'Communication avec les parties prenantes', note: 'Sert de canal pour expliquer aux parties prenantes les conclusions des évaluations actuarielles et leurs implications concrètes.' },
    { num: 14, domain: 'a2', tier: 'indirect', title: 'Rapports publics', note: 'Les rapports publics annuels sont un vecteur de diffusion des résultats actuariels et des indicateurs de viabilité financière.' },

    { num: 15, domain: 'a3', tier: 'fondamental', title: 'Devoirs et responsabilités des membres et des bénéficiaires', note: 'Clarifie les obligations des affiliés — un intrant du travail actuariel, mais non un objet direct de celui-ci.' },
    { num: 16, domain: 'a3', tier: 'fondamental', title: 'Droits et privilèges des membres et des bénéficiaires', note: 'Protège les droits aux prestations, dont l’ampleur et la soutenabilité sont mesurées par l’évaluation actuarielle.' },
    { num: 17, domain: 'a3', tier: 'fondamental', title: 'Application cohérente des décisions du conseil', note: 'Garantit la stabilité réglementaire — une condition-cadre plutôt qu’un levier actuariel direct.' },

    { num: 18, domain: 'a4', tier: 'fondamental', title: 'Participation des parties prenantes', note: 'Structure la participation des parties prenantes à la gouvernance, en amont du travail technique actuariel.' },
    { num: 19, domain: 'a4', tier: 'fondamental', title: 'Gestion des initiatives des parties prenantes', note: 'Encadre la manière dont les propositions des parties prenantes sont reçues et traitées par l’institution.' },

    { num: 20, domain: 'a5', tier: 'fondamental', title: 'Règles et règlements d’application de la loi, de la politique ou du décret', note: 'Porte sur la flexibilité du cadre réglementaire, sans lien technique direct avec l’actuariat.' },
    { num: 21, domain: 'a5', tier: 'fondamental', title: 'Leadership dans l’institution', note: 'Vise les compétences de leadership du conseil et de la direction, non les compétences techniques actuarielles.' },
    { num: 22, domain: 'a5', tier: 'indirect', title: 'Adaptation aux besoins du public et à un environnement en constante évolution', note: 'Prévoit explicitement la participation des actuaires internes et externes aux discussions et propositions relatives aux réformes de programme.' },
    { num: 23, domain: 'a5', tier: 'fondamental', title: 'Adopter une démarche souple et structurée pour gérer le changement et l’innovation', note: 'Porte sur la gestion du changement organisationnel au sens large.' },

    { num: 24, domain: 'b1', tier: 'fondamental', title: 'Énoncé de la vision stratégique', note: 'Fixe le cap institutionnel de long terme, en amont des choix techniques actuariels.' },
    { num: 25, domain: 'b1', tier: 'fondamental', title: 'Lancement du processus de planification stratégique', note: 'Organise le processus de planification, sans porter lui-même sur des questions actuarielles.' },
    { num: 26, domain: 'b1', tier: 'indirect', title: 'Formulation de la stratégie', note: 'La formulation stratégique s’appuie notamment sur les projections et indicateurs actuariels de viabilité financière.' },
    { num: 27, domain: 'b1', tier: 'fondamental', title: 'Mise en œuvre de la stratégie', note: 'Porte sur l’exécution opérationnelle du plan stratégique.' },
    { num: 28, domain: 'b1', tier: 'indirect', title: 'Diagnostic stratégique et évaluation des performances', note: 'Le diagnostic stratégique mobilise les indicateurs financiers et actuariels pour évaluer la trajectoire de l’institution.' },

    { num: 29, domain: 'b2', tier: 'direct', title: 'Cadre de gestion du risque', note: 'Le registre des risques couvre explicitement les risques pesant sur la viabilité financière, « comme les mesures actuarielles établies l’indiquent ».' },
    { num: 30, domain: 'b2', tier: 'direct', title: 'Processus type', note: 'Les processus types de gestion du risque couvrent la viabilité financière des programmes selon les mesures actuarielles établies.' },
    { num: 31, domain: 'b2', tier: 'indirect', title: 'Identification, analyse et évaluation des risques', note: 'Recommande l’usage de scénarios économiques prospectifs — une démarche proche des projections actuarielles de long terme.' },
    { num: 32, domain: 'b2', tier: 'fondamental', title: 'Préparation des plans de gestion du risque', note: 'Porte sur la structure de réaction organisationnelle en cas de risque avéré.' },
    { num: 33, domain: 'b2', tier: 'indirect', title: 'Communication et suivi des risques', note: 'La communication des risques financiers s’appuie sur les constats et alertes remontés par la fonction actuarielle.' },

    { num: 34, domain: 'b3', tier: 'indirect', title: 'Charte d’audit interne', note: 'Le plan d’audit doit couvrir les principaux domaines à risque, dont la viabilité financière évaluée par l’actuaire.' },
    { num: 35, domain: 'b3', tier: 'direct', title: 'Communication entre l’auditeur interne et l’actuaire', note: 'Ligne directrice entièrement dédiée : échange structuré sur les hypothèses, méthodes et données actuarielles utilisées dans les rapports institutionnels.' },
    { num: 36, domain: 'b3', tier: 'fondamental', title: 'Évaluation des performances et assurance qualité', note: 'Porte sur la qualité de la fonction d’audit interne elle-même.' },
    { num: 37, domain: 'b3', tier: 'fondamental', title: 'Mise en œuvre et gestion des résultats de l’audit', note: 'Porte sur le suivi des recommandations d’audit en général.' },

    { num: 38, domain: 'b4', tier: 'direct', title: 'Indicateurs actuariels de la viabilité financière d’un programme de sécurité sociale', note: 'Définit et documente les indicateurs actuariels de viabilité financière et la politique de capitalisation de chaque programme géré.' },
    { num: 39, domain: 'b4', tier: 'direct', title: 'Évaluations actuarielles du programme de sécurité sociale', note: 'Fixe la périodicité des évaluations actuarielles — au moins tous les cinq ans pour les retraites, chaque année pour la santé, les accidents du travail et le chômage — et l’examen indépendant par les pairs.' },
    { num: 40, domain: 'b4', tier: 'direct', title: 'Modification des taux de cotisation et des droits aux prestations afin de rétablir la viabilité financière', note: 'L’actuaire propose les indicateurs, mécanismes de déclenchement et ajustements de paramètres nécessaires pour restaurer la viabilité financière.' },
    { num: 41, domain: 'b4', tier: 'direct', title: 'Rendement des investissements et indicateurs de référence', note: 'L’actuaire participe directement à la définition des normes et indicateurs de référence du rendement des investissements.' },

    { num: 42, domain: 'b5', tier: 'indirect', title: 'Principe de prudence', note: 'Le principe de prudence encadre la gestion des fonds dont dépend la viabilité financière évaluée par l’actuaire.' },
    { num: 43, domain: 'b5', tier: 'direct', title: 'Politiques d’investissement', note: 'Recommande la modélisation actif-passif et son articulation avec les projections actuarielles de l’évolution de l’actif et du passif.' },
    { num: 44, domain: 'b5', tier: 'fondamental', title: 'Diligence raisonnable', note: 'Porte sur la vérification des propositions d’investissement avant décision.' },
    { num: 45, domain: 'b5', tier: 'indirect', title: 'Évaluation du portefeuille d’investissement', note: 'L’évaluation du portefeuille selon des normes comptables internationales alimente les données financières utilisées par l’actuaire.' },
    { num: 46, domain: 'b5', tier: 'fondamental', title: 'Mesures externes de bonne garde', note: 'Porte sur la sécurité physique et la garde des actifs de placement.' },
    { num: 47, domain: 'b5', tier: 'fondamental', title: 'Processus de sélection des gestionnaires de fonds externes', note: 'Porte sur la procédure de sélection des gestionnaires externes.' },
    { num: 48, domain: 'b5', tier: 'fondamental', title: 'Cohérence des mesures incitatives', note: 'Porte sur l’alignement des incitations des gestionnaires de fonds externes.' },
    { num: 49, domain: 'b5', tier: 'fondamental', title: 'Garde des actifs de placement', note: 'Porte sur la sécurisation des actifs confiés à des gestionnaires externes.' },
    { num: 50, domain: 'b5', tier: 'fondamental', title: 'Objectifs des représentants de l’institution au sein des conseils d’administration d’entreprises', note: 'Porte sur la représentation de l’institution dans les entreprises où elle détient une part importante du capital.' },

    { num: 51, domain: 'b6', tier: 'indirect', title: 'Prévention et contrôle de l’erreur, de l’évasion et de la fraude en matière de cotisations, de services et de prestations', note: 'La fiabilité des données de cotisations et de prestations conditionne directement la qualité des évaluations actuarielles.' },

    { num: 52, domain: 'b7', tier: 'fondamental', title: 'Qualité de la prestation de services de sécurité sociale aux membres et bénéficiaires', note: 'Porte sur la qualité opérationnelle des services rendus aux affiliés.' },
    { num: 53, domain: 'b7', tier: 'fondamental', title: 'Services de sécurité sociale, technologies de l’information et de la communication, et technologies en ligne', note: 'Porte sur la prestation de services par voie numérique.' },

    { num: 54, domain: 'b8', tier: 'fondamental', title: 'Gestion stratégique des ressources humaines dans un monde numérique', note: 'Porte sur la gestion des ressources humaines de l’institution dans son ensemble.' },
    { num: 55, domain: 'b8', tier: 'fondamental', title: 'Planification stratégique des ressources humaines dans un monde numérique', note: 'Porte sur l’anticipation des besoins futurs en personnel.' },
    { num: 56, domain: 'b8', tier: 'fondamental', title: 'Travailler dans un environnement hybride', note: 'Porte sur l’organisation du travail hybride du personnel.' },
    { num: 57, domain: 'b8', tier: 'fondamental', title: 'Politiques de recrutement, de sélection et de promotion', note: 'Porte sur les processus de recrutement et de promotion du personnel, y compris les profils techniques rares tels que les actuaires.' },
    { num: 58, domain: 'b8', tier: 'fondamental', title: 'Évaluation de la performance du personnel', note: 'Porte sur l’appréciation individuelle des performances du personnel.' },
    { num: 59, domain: 'b8', tier: 'fondamental', title: 'Développement et formation', note: 'Porte sur le développement des compétences du personnel en général.' },
    { num: 60, domain: 'b8', tier: 'fondamental', title: 'Gestion et rétention des talents', note: 'Couvre notamment la rétention d’expertises techniques rares — dont l’expertise actuarielle interne fait partie.' },
    { num: 61, domain: 'b8', tier: 'fondamental', title: 'Planification des remplacements', note: 'Porte sur la continuité des postes clés, y compris potentiellement les fonctions actuarielles internes.' },
    { num: 62, domain: 'b8', tier: 'fondamental', title: 'Motivation du personnel, politique de rémunération et travail décent', note: 'Porte sur la rémunération et la motivation du personnel en général.' },
    { num: 63, domain: 'b8', tier: 'fondamental', title: 'Promouvoir les valeurs institutionnelles et la marque employeur', note: 'Porte sur l’image employeur de l’institution.' },

    { num: 64, domain: 'b9', tier: 'fondamental', title: 'Cadre de gouvernance des TIC', note: 'Établit le cadre général de gouvernance des technologies de l’information.' },
    { num: 65, domain: 'b9', tier: 'fondamental', title: 'Objectifs stratégiques de l’application des TIC', note: 'Porte sur l’alignement des TIC avec la stratégie institutionnelle.' },
    { num: 66, domain: 'b9', tier: 'fondamental', title: 'Innovations fondées sur les TIC et les technologies émergentes', note: 'Porte sur l’adoption de technologies émergentes.' },
    { num: 67, domain: 'b9', tier: 'fondamental', title: 'Coût total du cycle de vie des produits et des services des TIC', note: 'Porte sur la gestion budgétaire des investissements TIC.' },
    { num: 68, domain: 'b9', tier: 'fondamental', title: 'Politiques et procédures types relatives aux passations de marchés et aux investissements dans les TIC', note: 'Porte sur les procédures d’achat de solutions TIC.' },
    { num: 69, domain: 'b9', tier: 'fondamental', title: 'Évaluation a posteriori des investissements dans les TIC', note: 'Porte sur le bilan des investissements TIC réalisés.' },
    { num: 70, domain: 'b9', tier: 'fondamental', title: 'Créer un cadre de gouvernance de la cybersécurité', note: 'Porte sur la protection des systèmes d’information contre les cybermenaces.' },
    { num: 71, domain: 'b9', tier: 'indirect', title: 'Risques liés aux TIC et continuité des services de sécurité sociale', note: 'La continuité des systèmes d’information conditionne la disponibilité et la fiabilité des données nécessaires aux évaluations actuarielles.' },
    { num: 72, domain: 'b9', tier: 'indirect', title: 'Cadre de gouvernance des données', note: 'Une donnée gouvernée, vérifiée et fiable est la matière première de toute évaluation actuarielle.' }
  ];

  window.GovAct = window.GovAct || {};
  window.GovAct.DOMAINS = DOMAINS;
  window.GovAct.GUIDELINES = GUIDELINES;
})();
