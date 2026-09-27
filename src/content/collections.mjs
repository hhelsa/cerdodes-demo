// CMS collections (Services, Case studies, Insights, Team, Testimonials, Offices, FAQs).
// Every text field stores EN and FR. `placeholder: true` marks content CERFODES still has to supply;
// the CMS surfaces these in its "Content needed" list.

export const services = [
  {
    id: 'technology',
    slug: { en: 'technology', fr: 'technologie' },
    name: { en: 'Technology', fr: 'Technologie' },
    tagline: { en: 'Digital systems that public and private institutions can rely on.', fr: 'Des systèmes numériques fiables pour les institutions publiques et privées.' },
    description: {
      en: 'We assess, design and deliver information systems, connectivity and data platforms, from national network assessments to management information systems that teams actually use.',
      fr: 'Nous évaluons, concevons et déployons des systèmes d’information, de la connectivité et des plateformes de données, des évaluations de réseaux nationaux aux systèmes d’information de gestion réellement utilisés par les équipes.'
    },
    offerings: [
      { en: 'Connectivity and network infrastructure assessments', fr: 'Évaluation de la connectivité et des infrastructures réseau' },
      { en: 'Information systems audit and cybersecurity reviews', fr: 'Audit des systèmes d’information et revues de cybersécurité' },
      { en: 'Management information systems design and roll-out', fr: 'Conception et déploiement de systèmes d’information de gestion' },
      { en: 'Data strategy, dashboards and M&E platforms', fr: 'Stratégie de données, tableaux de bord et plateformes de S&E' },
      { en: 'Digital transformation roadmaps', fr: 'Feuilles de route de transformation numérique' }
    ],
    image: 'fibre',
    quote: { testimonial: 't2' },
    placeholder: true
  },
  {
    id: 'management',
    slug: { en: 'management', fr: 'management' },
    name: { en: 'Management', fr: 'Management' },
    tagline: { en: 'Stronger institutions, clearer decisions, measurable performance.', fr: 'Des institutions plus solides, des décisions plus claires, une performance mesurable.' },
    description: {
      en: 'We help organisations restructure, strengthen financial management and build the capabilities that keep performance improving long after an engagement ends.',
      fr: 'Nous aidons les organisations à se restructurer, à renforcer leur gestion financière et à développer les compétences qui font progresser la performance bien après la fin d’une mission.'
    },
    offerings: [
      { en: 'Institutional and organisational assessments', fr: 'Diagnostics institutionnels et organisationnels' },
      { en: 'Public financial management and internal audit', fr: 'Gestion des finances publiques et audit interne' },
      { en: 'Strategic planning and performance frameworks', fr: 'Planification stratégique et cadres de performance' },
      { en: 'Human resource and capacity development', fr: 'Ressources humaines et renforcement des capacités' },
      { en: 'Procurement and project management support', fr: 'Appui à la passation des marchés et à la gestion de projets' }
    ],
    image: 'inclusive-meeting',
    quote: { testimonial: 't1' },
    placeholder: true
  },
  {
    id: 'consulting',
    slug: { en: 'consulting', fr: 'conseil' },
    name: { en: 'Consulting', fr: 'Conseil' },
    tagline: { en: 'Rigorous, data-driven advice for complex programmes.', fr: 'Des conseils rigoureux et fondés sur les données pour des programmes complexes.' },
    description: {
      en: 'We provide technical advice to governments, development partners, companies and non-profits: studies, evaluations and advisory support grounded in evidence and local knowledge.',
      fr: 'Nous conseillons gouvernements, partenaires au développement, entreprises et organisations à but non lucratif : études, évaluations et appui-conseil fondés sur des preuves et une connaissance du terrain.'
    },
    offerings: [
      { en: 'Feasibility, baseline and impact studies', fr: 'Études de faisabilité, de référence et d’impact' },
      { en: 'Programme monitoring and evaluation', fr: 'Suivi et évaluation de programmes' },
      { en: 'Policy research and sector reviews', fr: 'Recherche sur les politiques et revues sectorielles' },
      { en: 'Stakeholder engagement and facilitation', fr: 'Mobilisation des parties prenantes et facilitation' },
      { en: 'Technical assistance to development partners', fr: 'Assistance technique aux partenaires au développement' }
    ],
    image: 'meeting-table',
    quote: { testimonial: 't3' },
    placeholder: true
  }
];

export const offices = [
  {
    id: 'kampala', country: { en: 'Uganda', fr: 'Ouganda' }, city: 'Kampala', hq: true,
    address: { en: 'George Courts, Wing B, 2nd Floor, Plot 34, Hannington Road, Nakasero, P.O. Box 9051, Kampala', fr: 'George Courts, Aile B, 2e étage, Plot 34, Hannington Road, Nakasero, B.P. 9051, Kampala' },
    phones: ['+256 414 230 556', '+256 414 230 558'], email: 'info@cerfodesgroup.com',
    photo: 'silhouettes', lat: 0.3136, lon: 32.5811, visible: true
  },
  {
    id: 'nairobi', country: { en: 'Kenya', fr: 'Kenya' }, city: 'Nairobi',
    address: { en: 'Nyaku House, off Argwings Kodhek Road, P.O. Box 25257-00603, Lavington, Nairobi', fr: 'Nyaku House, près d’Argwings Kodhek Road, B.P. 25257-00603, Lavington, Nairobi' },
    phones: ['+254 724 568 209'], email: 'info@cerfodesgroup.com',
    photo: 'glass', lat: -1.2921, lon: 36.8219, visible: true
  },
  {
    id: 'ouagadougou', country: { en: 'Burkina Faso', fr: 'Burkina Faso' }, city: 'Ouagadougou',
    address: { en: 'Immeuble CERFODES, Rue de l’Afrique du Sud, Quartier Somgandé, 02 BP 5472, Ouagadougou 02', fr: 'Immeuble CERFODES, Rue de l’Afrique du Sud, Quartier Somgandé, 02 BP 5472, Ouagadougou 02' },
    phones: ['+226 25 35 82 09', '+226 78 04 04 25', '+226 78 36 14 19'], email: 'info@cerfodesgroup.com',
    photo: 'presenter', lat: 12.3714, lon: -1.5197, visible: true
  },
  {
    id: 'lilongwe', country: { en: 'Malawi', fr: 'Malawi' }, city: 'Lilongwe',
    address: { en: 'Office P, Block A, 1st Floor, Century City Mall and Business Park, Kenyatta Road, P.O. Box X285, Lilongwe', fr: 'Bureau P, Bloc A, 1er étage, Century City Mall and Business Park, Kenyatta Road, B.P. X285, Lilongwe' },
    phones: ['+265 1 752 236'], email: 'info@cerfodesgroup.com',
    photo: 'one-on-one', lat: -13.9626, lon: 33.7741, visible: true
  },
  {
    id: 'abidjan', country: { en: 'Côte d’Ivoire', fr: 'Côte d’Ivoire' }, city: 'Abidjan',
    address: { en: 'Address to be confirmed', fr: 'Adresse à confirmer' },
    phones: [], email: 'info@cerfodesgroup.com',
    photo: 'team-table', lat: 5.36, lon: -4.0083, visible: true, placeholder: true
  },
  {
    id: 'nigeria', country: { en: 'Nigeria', fr: 'Nigeria' }, city: 'Abuja',
    address: { en: 'City and address to be confirmed', fr: 'Ville et adresse à confirmer' },
    phones: [], email: 'info@cerfodesgroup.com',
    photo: 'laptops', lat: 9.0765, lon: 7.3986, visible: true, placeholder: true
  },
  {
    id: 'bissau', country: { en: 'Guinea-Bissau', fr: 'Guinée-Bissau' }, city: 'Bissau',
    address: { en: 'Address to be confirmed', fr: 'Adresse à confirmer' },
    phones: [], email: 'info@cerfodesgroup.com',
    photo: 'analyst-tablet', lat: 11.8636, lon: -15.5977, visible: true, placeholder: true
  }
];

export const testimonials = [
  {
    id: 't1', rating: 5, photo: 'portrait-yellow', sector: { en: 'Public sector', fr: 'Secteur public' },
    quote: { en: 'CERFODES understood our institution before proposing anything. The restructuring plan was ours from day one, and it held.', fr: 'CERFODES a compris notre institution avant de proposer quoi que ce soit. Le plan de restructuration nous appartenait dès le premier jour, et il a tenu.' },
    name: 'Name to confirm', title: { en: 'Director of Planning', fr: 'Directrice de la planification' }, org: { en: 'Government ministry', fr: 'Ministère' }, placeholder: true
  },
  {
    id: 't2', rating: 5, photo: 'analyst-tablet', sector: { en: 'Development finance', fr: 'Financement du développement' },
    quote: { en: 'The connectivity assessment was rigorous, on time and written so our board could act on it. We used it to prioritise investment across the region.', fr: 'L’évaluation de la connectivité était rigoureuse, livrée à temps et rédigée pour que notre conseil puisse agir. Nous l’avons utilisée pour prioriser les investissements dans la région.' },
    name: 'Name to confirm', title: { en: 'Programme Manager', fr: 'Responsable de programme' }, org: { en: 'Development partner', fr: 'Partenaire au développement' }, placeholder: true
  },
  {
    id: 't3', rating: 5, photo: 'handshake', sector: { en: 'Non-profit', fr: 'Organisation à but non lucratif' },
    quote: { en: 'Their evaluation team worked in four countries and three languages without losing the thread. Practical recommendations, clearly evidenced.', fr: 'Leur équipe d’évaluation a travaillé dans quatre pays et trois langues sans jamais perdre le fil. Des recommandations concrètes, clairement étayées.' },
    name: 'Name to confirm', title: { en: 'Head of Monitoring and Evaluation', fr: 'Responsable suivi-évaluation' }, org: { en: 'International NGO', fr: 'ONG internationale' }, placeholder: true
  },
  {
    id: 't4', rating: 4, photo: 'leaders-standing', sector: { en: 'Private sector', fr: 'Secteur privé' },
    quote: { en: 'A consulting partner that respects deadlines. Every milestone arrived when promised, with a team that knew the market.', fr: 'Un partenaire qui respecte les délais. Chaque étape a été livrée comme promis, par une équipe qui connaît le marché.' },
    name: 'Name to confirm', title: { en: 'Chief Operating Officer', fr: 'Directeur des opérations' }, org: { en: 'Regional company', fr: 'Entreprise régionale' }, placeholder: true
  }
];

export const team = [
  { id: 'p1', name: 'Name to confirm', role: { en: 'Managing Partner', fr: 'Associé gérant' }, portrait: 'office-review', placeholder: true },
  { id: 'p2', name: 'Name to confirm', role: { en: 'Director, Technology', fr: 'Directrice, Technologie' }, portrait: 'portrait-yellow', placeholder: true },
  { id: 'p3', name: 'Name to confirm', role: { en: 'Director, Management', fr: 'Directrice, Management' }, portrait: 'analyst-tablet', placeholder: true }
];

export const caseStudies = [
  {
    id: 'connectivity',
    title: { en: 'Connectivity and network infrastructure condition assessment', fr: 'Évaluation de l’état de la connectivité et des infrastructures réseau' },
    client: { en: 'Development finance institution', fr: 'Institution de financement du développement' },
    sector: { en: 'Digital infrastructure', fr: 'Infrastructures numériques' },
    country: { en: 'Multi-country, East Africa', fr: 'Multi-pays, Afrique de l’Est' },
    practice: 'technology',
    challenge: { en: 'Map the real condition of national backbone and last-mile networks to guide investment.', fr: 'Cartographier l’état réel des réseaux nationaux et du dernier kilomètre pour orienter les investissements.' },
    metrics: [
      { value: 1200, suffix: '+', label: { en: 'sites assessed', fr: 'sites évalués' } },
      { value: 6, suffix: '', label: { en: 'countries covered', fr: 'pays couverts' } }
    ],
    image: 'fibre', placeholder: true
  }
];

export const faqs = [
  { tab: 'about', q: { en: 'Who is CERFODES?', fr: 'Qui est CERFODES ?' }, a: { en: 'CERFODES is an Africa-based, African-led international consulting firm founded in 2002. We provide technical advice and support to public, private and non-profit organisations across Technology, Management and Consulting.', fr: 'CERFODES est un cabinet de conseil international basé en Afrique et dirigé par des Africains, fondé en 2002. Nous apportons conseil technique et appui aux organisations publiques, privées et à but non lucratif en Technologie, Management et Conseil.' } },
  { tab: 'about', q: { en: 'Where does CERFODES have offices?', fr: 'Où se trouvent les bureaux de CERFODES ?' }, a: { en: 'We have offices in Côte d’Ivoire, Nigeria, Kenya, Uganda, Burkina Faso, Guinea-Bissau and Malawi, and we deliver engagements beyond Africa with our partners.', fr: 'Nous avons des bureaux en Côte d’Ivoire, au Nigeria, au Kenya, en Ouganda, au Burkina Faso, en Guinée-Bissau et au Malawi, et nous intervenons au-delà de l’Afrique avec nos partenaires.' } },
  { tab: 'about', q: { en: 'What do the three dots in the CERFODES identity mean?', fr: 'Que signifient les trois points de l’identité CERFODES ?' }, a: { en: 'Each dot stands for one ingredient of excellence: consistency, commitment and conscientiousness.', fr: 'Chaque point représente un ingrédient de l’excellence : la constance, l’engagement et la conscience professionnelle.' } },
  { tab: 'working', q: { en: 'How does an engagement with CERFODES start?', fr: 'Comment commence une mission avec CERFODES ?' }, a: { en: 'We start by agreeing objectives, scope and conditions in writing. We then analyse your context, customise a solution with you and deliver against agreed milestones.', fr: 'Nous commençons par convenir par écrit des objectifs, du périmètre et des conditions. Nous analysons ensuite votre contexte, adaptons une solution avec vous et livrons selon des jalons convenus.' } },
  { tab: 'working', q: { en: 'Which clients does CERFODES work with?', fr: 'Avec quels clients CERFODES travaille-t-il ?' }, a: { en: 'Governments and public agencies, development partners, private companies and non-profit organisations.', fr: 'Gouvernements et agences publiques, partenaires au développement, entreprises privées et organisations à but non lucratif.' } },
  { tab: 'working', q: { en: 'How quickly will you reply to an enquiry?', fr: 'Sous quel délai répondez-vous à une demande ?' }, a: { en: 'Within two working days. Your enquiry goes to the office nearest to you.', fr: 'Sous deux jours ouvrés. Votre demande est transmise au bureau le plus proche de vous.' } },
  { tab: 'working', q: { en: 'How do clients approve deliverables?', fr: 'Comment les clients valident-ils les livrables ?' }, a: { en: 'By WhatsApp. Each client company gets secure, expiring one-tap links to view a document, approve it or request changes, with no extra login.', fr: 'Par WhatsApp. Chaque entreprise cliente reçoit des liens sécurisés et temporaires pour consulter un document, l’approuver ou demander des modifications, sans identifiant supplémentaire.' } },
  { tab: 'careers', q: { en: 'How do I apply to CERFODES?', fr: 'Comment postuler chez CERFODES ?' }, a: { en: 'Use the careers form to send your CV as a PDF or Word file (5 MB maximum). Every file is security-scanned and you get an instant confirmation.', fr: 'Utilisez le formulaire carrières pour envoyer votre CV en PDF ou Word (5 Mo maximum). Chaque fichier est analysé et vous recevez une confirmation immédiate.' } },
  { tab: 'careers', q: { en: 'How long does the review take?', fr: 'Combien de temps dure l’examen ?' }, a: { en: 'We review every application within three weeks.', fr: 'Nous examinons chaque candidature sous trois semaines.' } },
  { tab: 'careers', q: { en: 'Do you recruit consultants for specific assignments?', fr: 'Recrutez-vous des consultants pour des missions précises ?' }, a: { en: 'Yes. Many roles are assignment-based. Choose your area of expertise in the form and we will match you to relevant engagements.', fr: 'Oui. De nombreux postes sont liés à des missions. Indiquez votre domaine d’expertise dans le formulaire et nous vous proposerons les missions pertinentes.' } }
];

export const insights = [
  {
    id: 'connectivity-gaps', slug: { en: 'closing-connectivity-gaps', fr: 'reduire-les-ecarts-de-connectivite' },
    title: { en: 'Closing Africa’s connectivity gaps starts with honest data', fr: 'Réduire les écarts de connectivité en Afrique commence par des données fiables' },
    summary: { en: 'Why condition assessments, not coverage maps, should guide the next wave of network investment.', fr: 'Pourquoi les évaluations de l’état des réseaux, et non les cartes de couverture, doivent guider les prochains investissements.' },
    category: { en: 'Technology', fr: 'Technologie' }, practice: 'technology', author: 'p2', date: '2026-09-10', image: 'fibre', readMins: 6, placeholder: true
  },
  {
    id: 'pfm-reform', slug: { en: 'public-financial-management-reform', fr: 'reforme-gestion-finances-publiques' },
    title: { en: 'Five lessons from a decade of public financial management reform', fr: 'Cinq leçons tirées d’une décennie de réforme de la gestion des finances publiques' },
    summary: { en: 'What makes reforms stick after the consultants leave, drawn from engagements across seven countries.', fr: 'Ce qui fait durer les réformes après le départ des consultants, tiré de missions dans sept pays.' },
    category: { en: 'Management', fr: 'Management' }, practice: 'management', author: 'p3', date: '2026-08-21', image: 'sticky-notes', readMins: 8, placeholder: true
  },
  {
    id: 'evaluation-local', slug: { en: 'evaluations-that-listen', fr: 'des-evaluations-a-l-ecoute' },
    title: { en: 'Evaluations that listen: designing M&E with communities, not for them', fr: 'Des évaluations à l’écoute : concevoir le S&E avec les communautés, pas pour elles' },
    summary: { en: 'Practical ways to bring local voices into programme evaluation without slowing delivery.', fr: 'Des moyens concrets d’intégrer les voix locales à l’évaluation sans ralentir la mise en œuvre.' },
    category: { en: 'Consulting', fr: 'Conseil' }, practice: 'consulting', author: 'p1', date: '2026-07-30', image: 'inclusive-meeting', readMins: 5, placeholder: true
  }
];

// Impact figures – “Real figures needed” (PRD). Years active is derived from the 2002 founding date.
export const impact = {
  figures: [
    { value: 24, suffix: '', label: { en: 'years of practice', fr: 'années d’expérience' } },
    { value: 7, suffix: '', label: { en: 'country offices', fr: 'bureaux nationaux' } },
    { value: 350, suffix: '+', label: { en: 'engagements delivered', fr: 'missions réalisées' }, placeholder: true },
    { value: 95, suffix: '%', label: { en: 'milestones on time', fr: 'jalons respectés' }, placeholder: true }
  ],
  chart: {
    title: { en: 'Engagements delivered per year', fr: 'Missions réalisées par an' },
    series: [ ['2020', 22], ['2021', 27], ['2022', 31], ['2023', 38], ['2024', 44], ['2025', 52] ],
    placeholder: true
  }
};

export const beforeAfter = {
  before: [
    { en: 'Reports that sit on a shelf', fr: 'Des rapports qui restent dans un tiroir' },
    { en: 'Imported templates that ignore local context', fr: 'Des modèles importés qui ignorent le contexte local' },
    { en: 'Deadlines that slip without warning', fr: 'Des délais qui glissent sans prévenir' },
    { en: 'Data collected, never used', fr: 'Des données collectées, jamais utilisées' },
    { en: 'Consultants who leave with the knowledge', fr: 'Des consultants qui partent avec le savoir' }
  ],
  after: [
    { en: 'Recommendations your board acts on', fr: 'Des recommandations mises en œuvre par votre conseil' },
    { en: 'Solutions customised with your team', fr: 'Des solutions adaptées avec votre équipe' },
    { en: 'Milestones agreed and met', fr: 'Des jalons convenus et respectés' },
    { en: 'Decisions grounded in evidence', fr: 'Des décisions fondées sur des preuves' },
    { en: 'Capability that stays in-house', fr: 'Des compétences qui restent en interne' }
  ],
  placeholder: true
};

export const social = [
  { network: 'LinkedIn', date: '2026-09-18', text: { en: 'Our Kampala team has just wrapped up a capacity-building week on results-based management with 40 public officers.', fr: 'Notre équipe de Kampala vient de conclure une semaine de renforcement des capacités en gestion axée sur les résultats avec 40 agents publics.' }, image: 'presenter' },
  { network: 'X', date: '2026-09-12', text: { en: 'New on the CERFODES Brief: why honest condition data should drive connectivity investment.', fr: 'Nouveau dans le CERFODES Brief : pourquoi des données fiables doivent guider l’investissement dans la connectivité.' } },
  { network: 'LinkedIn', date: '2026-09-03', text: { en: 'We are recruiting monitoring and evaluation consultants across West Africa. French and Portuguese a plus.', fr: 'Nous recrutons des consultants en suivi-évaluation en Afrique de l’Ouest. Le français et le portugais sont un atout.' }, image: 'team-table' }
];
