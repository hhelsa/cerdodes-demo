// Interface strings and page copy. One key set, two languages: EN/FR share every template.

export const routes = {
  home: { en: '', fr: '' },
  about: { en: 'about', fr: 'a-propos' },
  services: { en: 'services', fr: 'services' },
  where: { en: 'where-we-work', fr: 'ou-nous-travaillons' },
  insights: { en: 'insights', fr: 'analyses' },
  careers: { en: 'careers', fr: 'carrieres' },
  contact: { en: 'contact', fr: 'contact' },
  privacy: { en: 'privacy', fr: 'confidentialite' }
};

export const ui = {
  meta: {
    siteName: { en: 'CERFODES', fr: 'CERFODES' },
    tagline: { en: 'Technology · Management · Consulting', fr: 'Technologie · Management · Conseil' },
    description: {
      en: 'CERFODES is an Africa-based, African-led international consulting firm providing technology, management and consulting support to public, private and non-profit organisations.',
      fr: 'CERFODES est un cabinet de conseil international basé en Afrique et dirigé par des Africains, qui accompagne les organisations publiques, privées et à but non lucratif en technologie, management et conseil.'
    },
    skip: { en: 'Skip to content', fr: 'Aller au contenu' }
  },
  nav: {
    about: { en: 'About', fr: 'À propos' },
    services: { en: 'Services', fr: 'Services' },
    where: { en: 'Where we work', fr: 'Où nous travaillons' },
    insights: { en: 'Insights', fr: 'Analyses' },
    careers: { en: 'Careers', fr: 'Carrières' },
    contact: { en: 'Contact', fr: 'Contact' },
    talk: { en: 'Talk to us', fr: 'Nous parler' },
    login: { en: 'Log in', fr: 'Connexion' },
    menu: { en: 'Menu', fr: 'Menu' },
    close: { en: 'Close', fr: 'Fermer' },
    langLabel: { en: 'Language', fr: 'Langue' },
    portal: { en: 'Consultant portal', fr: 'Portail consultants' },
    admin: { en: 'Admin', fr: 'Administration' },
    client: { en: 'Client access', fr: 'Accès client' },
    cms: { en: 'Website CMS', fr: 'CMS du site' },
    portalHint: { en: 'Projects, timesheets, deliverables', fr: 'Projets, feuilles de temps, livrables' },
    adminHint: { en: 'Approvals, staff, security log', fr: 'Validations, équipe, journal de sécurité' },
    clientHint: { en: 'Approve work via WhatsApp', fr: 'Valider via WhatsApp' },
    cmsHint: { en: 'Pages, leads, emails', fr: 'Pages, prospects, e-mails' }
  },
  hero: {
    eyebrow: { en: 'Africa-based. African-led. International.', fr: 'Basé en Afrique. Dirigé par des Africains. International.' },
    title: { en: 'Solutions that move Africa forward', fr: 'Des solutions qui font avancer l’Afrique' },
    lead: {
      en: 'Technical advice and support for public, private and non-profit organisations, delivered by teams in seven countries since 2002.',
      fr: 'Conseil technique et appui aux organisations publiques, privées et à but non lucratif, par des équipes présentes dans sept pays depuis 2002.'
    },
    cta1: { en: 'Talk to us', fr: 'Nous parler' },
    cta2: { en: 'Explore services', fr: 'Découvrir nos services' },
    sectorsLabel: { en: 'Sectors we serve', fr: 'Secteurs accompagnés' },
    sectors: [
      { en: 'Public sector', fr: 'Secteur public' }, { en: 'Development partners', fr: 'Partenaires au développement' },
      { en: 'Private sector', fr: 'Secteur privé' }, { en: 'Non-profit', fr: 'Associatif' }, { en: 'Digital infrastructure', fr: 'Infrastructures numériques' }
    ],
    newCase: { en: 'New case study', fr: 'Nouvelle étude de cas' },
    scroll: { en: 'Scroll', fr: 'Défiler' }
  },
  featured: {
    eyebrow: { en: 'Featured engagement', fr: 'Mission à la une' },
    title: { en: 'Evidence that guided investment across six countries', fr: 'Des données qui ont orienté l’investissement dans six pays' },
    link: { en: 'Read the case study', fr: 'Lire l’étude de cas' }
  },
  beforeAfter: {
    eyebrow: { en: 'Why CERFODES', fr: 'Pourquoi CERFODES' },
    title: { en: 'From advice that stalls to results that last', fr: 'Du conseil qui s’essouffle aux résultats qui durent' },
    before: { en: 'Without the right partner', fr: 'Sans le bon partenaire' },
    after: { en: 'With CERFODES', fr: 'Avec CERFODES' }
  },
  services: {
    eyebrow: { en: 'What we do', fr: 'Ce que nous faisons' },
    title: { en: 'Three practices, one standard of excellence', fr: 'Trois pôles, une même exigence d’excellence' },
    offerings: { en: 'What we offer', fr: 'Notre offre' },
    cta: { en: 'Explore', fr: 'Découvrir' },
    discuss: { en: 'Discuss a project', fr: 'Discuter d’un projet' }
  },
  who: {
    eyebrow: { en: 'Who we are', fr: 'Qui nous sommes' },
    title: { en: 'Africa’s leading consultancy', fr: 'Le cabinet de conseil africain de référence' },
    rows: [
      { k: { en: 'Who are we?', fr: 'Qui sommes-nous ?' }, v: { en: 'A leading Africa-based, African-led, international consulting firm.', fr: 'Un cabinet de conseil international de premier plan, basé en Afrique et dirigé par des Africains.' } },
      { k: { en: 'What do we do?', fr: 'Que faisons-nous ?' }, v: { en: 'Provide technical advice and support to public, private and non-profit organisations with the primary focus of adding value.', fr: 'Nous apportons conseil technique et appui aux organisations publiques, privées et à but non lucratif, avec pour priorité la création de valeur.' } },
      { k: { en: 'How do we do it?', fr: 'Comment le faisons-nous ?' }, v: { en: 'We follow a rigorous and data-driven approach to develop customised solutions for our clients.', fr: 'Nous suivons une démarche rigoureuse, fondée sur les données, pour concevoir des solutions sur mesure.' } },
      { k: { en: 'Why do we do it?', fr: 'Pourquoi le faisons-nous ?' }, v: { en: 'To assist our clients in achieving their goals and navigating complex organisational challenges.', fr: 'Pour aider nos clients à atteindre leurs objectifs et à relever des défis organisationnels complexes.' } }
    ],
    dotsTitle: { en: 'The three dots', fr: 'Les trois points' },
    dotsText: { en: 'The road to excellence is paved with consistency, commitment and conscientiousness, and all three are engraved in our DNA.', fr: 'Le chemin de l’excellence est pavé de constance, d’engagement et de conscience professionnelle, et tous trois sont inscrits dans notre ADN.' },
    dots: [ { en: 'Consistency', fr: 'Constance' }, { en: 'Commitment', fr: 'Engagement' }, { en: 'Conscientiousness', fr: 'Conscience professionnelle' } ]
  },
  process: {
    eyebrow: { en: 'How we work', fr: 'Notre méthode' },
    title: { en: 'Four steps from brief to impact', fr: 'Quatre étapes, du cahier des charges à l’impact' },
    steps: [
      { t: { en: 'Agree', fr: 'Convenir' }, d: { en: 'We set objectives, scope and conditions in writing, so every collaboration starts clear, explicit and built on trust.', fr: 'Nous fixons par écrit objectifs, périmètre et conditions : chaque collaboration démarre sur une base claire, explicite et de confiance.' }, img: 'hands' },
      { t: { en: 'Analyse', fr: 'Analyser' }, d: { en: 'Our teams gather and test the evidence on the ground, combining rigorous data work with local knowledge.', fr: 'Nos équipes collectent et vérifient les données sur le terrain, en alliant rigueur analytique et connaissance locale.' }, img: 'sticky-notes' },
      { t: { en: 'Customise', fr: 'Adapter' }, d: { en: 'We design the solution with you, not for you, shaped to your institution, budget and context.', fr: 'Nous concevons la solution avec vous, et non pour vous, en fonction de votre institution, de votre budget et de votre contexte.' }, img: 'laptops' },
      { t: { en: 'Deliver', fr: 'Livrer' }, d: { en: 'We deliver against agreed milestones, respect deadlines and transfer the know-how that keeps results going.', fr: 'Nous livrons selon les jalons convenus, respectons les délais et transférons le savoir-faire qui fait durer les résultats.' }, img: 'target' }
    ]
  },
  map: {
    eyebrow: { en: 'Where we work', fr: 'Où nous travaillons' },
    title: { en: 'Rooted in Africa, working worldwide', fr: 'Ancrés en Afrique, présents dans le monde' },
    lead: { en: 'Seven country offices and a network of partners let us deliver wherever our clients need us.', fr: 'Sept bureaux nationaux et un réseau de partenaires nous permettent d’intervenir partout où nos clients en ont besoin.' },
    showOffices: { en: 'Show offices', fr: 'Afficher les bureaux' },
    contactOffice: { en: 'Contact this office', fr: 'Contacter ce bureau' },
    directions: { en: 'Directions', fr: 'Itinéraire' },
    prev: { en: 'Previous office', fr: 'Bureau précédent' },
    next: { en: 'Next office', fr: 'Bureau suivant' },
    hq: { en: 'Head office', fr: 'Siège' },
    listLabel: { en: 'Our offices', fr: 'Nos bureaux' },
    hint: { en: 'Select an office to see its details. Use arrow keys to move between offices.', fr: 'Sélectionnez un bureau pour voir ses coordonnées. Utilisez les flèches pour passer d’un bureau à l’autre.' }
  },
  team: {
    eyebrow: { en: 'Our people', fr: 'Nos équipes' },
    title: { en: 'Experts who know the ground', fr: 'Des experts qui connaissent le terrain' },
    hiringTitle: { en: 'We are hiring', fr: 'Nous recrutons' },
    hiringText: { en: 'Consultants, analysts and specialists across our seven offices.', fr: 'Consultants, analystes et spécialistes dans nos sept bureaux.' },
    apply: { en: 'Apply now', fr: 'Postuler' }
  },
  testimonials: {
    eyebrow: { en: 'Client voices', fr: 'Paroles de clients' },
    title: { en: 'Trusted by institutions that cannot afford to miss', fr: 'La confiance d’institutions qui ne peuvent pas se permettre l’échec' },
    rating: { en: 'Average client rating', fr: 'Note moyenne des clients' },
    ratingSource: { en: 'Source to confirm', fr: 'Source à confirmer' }
  },
  impact: {
    eyebrow: { en: 'Impact', fr: 'Impact' },
    title: { en: 'Excellence you can measure', fr: 'Une excellence mesurable' }
  },
  quote: {
    text: { en: 'There are no shortcuts to excellence. We do not take on an engagement unless we know our client will gain real value from it.', fr: 'Il n’y a pas de raccourci vers l’excellence. Nous n’acceptons une mission que si nous savons que notre client en tirera une réelle valeur.' },
    name: { en: 'Name to confirm', fr: 'Nom à confirmer' },
    role: { en: 'Managing Partner, CERFODES', fr: 'Associé gérant, CERFODES' },
    cta: { en: 'Book a call', fr: 'Réserver un appel' }
  },
  caseStudy: {
    eyebrow: { en: 'Case study', fr: 'Étude de cas' },
    client: { en: 'Client', fr: 'Client' }, sector: { en: 'Sector', fr: 'Secteur' }, country: { en: 'Country', fr: 'Pays' }, practice: { en: 'Practice', fr: 'Pôle' },
    challenge: { en: 'Challenge', fr: 'Enjeu' }
  },
  faq: {
    eyebrow: { en: 'FAQ', fr: 'FAQ' },
    title: { en: 'Questions, answered', fr: 'Vos questions, nos réponses' },
    tabs: { about: { en: 'About', fr: 'À propos' }, working: { en: 'Working with us', fr: 'Travailler avec nous' }, careers: { en: 'Careers', fr: 'Carrières' } },
    more: { en: 'Still have a question?', fr: 'Une autre question ?' }
  },
  insights: {
    eyebrow: { en: 'Insights', fr: 'Analyses' },
    title: { en: 'Thinking from the field', fr: 'Des analyses venues du terrain' },
    all: { en: 'All insights', fr: 'Toutes les analyses' },
    read: { en: 'min read', fr: 'min de lecture' },
    by: { en: 'By', fr: 'Par' },
    lead: { en: 'Analysis and lessons from our engagements across Technology, Management and Consulting.', fr: 'Analyses et enseignements tirés de nos missions en Technologie, Management et Conseil.' },
    back: { en: 'Back to insights', fr: 'Retour aux analyses' },
    related: { en: 'Related service', fr: 'Service associé' }
  },
  newsletter: {
    name: { en: 'The CERFODES Brief', fr: 'Le CERFODES Brief' },
    text: { en: 'One email a month with our latest analysis, tenders we are watching and lessons from the field.', fr: 'Un e-mail par mois avec nos dernières analyses, les appels d’offres suivis et les leçons du terrain.' },
    label: { en: 'Work email', fr: 'E-mail professionnel' },
    placeholder: { en: 'you@organisation.org', fr: 'vous@organisation.org' },
    cta: { en: 'Subscribe', fr: 'S’abonner' },
    note: { en: 'Double opt-in. Unsubscribe at any time.', fr: 'Double confirmation. Désabonnement à tout moment.' },
    sent: { en: 'Almost there. We have sent a confirmation link to your inbox.', fr: 'Presque terminé. Nous avons envoyé un lien de confirmation dans votre boîte mail.' },
    invalid: { en: 'Please enter a valid email address.', fr: 'Veuillez saisir une adresse e-mail valide.' }
  },
  social: {
    eyebrow: { en: 'Latest updates', fr: 'Dernières actualités' },
    title: { en: 'Follow our work', fr: 'Suivez notre actualité' },
    follow: { en: 'Follow on', fr: 'Suivre sur' }
  },
  contact: {
    eyebrow: { en: 'Contact', fr: 'Contact' },
    title: { en: 'Let’s talk about your next engagement', fr: 'Parlons de votre prochaine mission' },
    lead: { en: 'Tell us what you need. Your enquiry goes straight to the office nearest you and we reply within two working days.', fr: 'Dites-nous ce dont vous avez besoin. Votre demande est transmise au bureau le plus proche et nous répondons sous deux jours ouvrés.' },
    name: { en: 'Full name', fr: 'Nom complet' },
    email: { en: 'Work email', fr: 'E-mail professionnel' },
    org: { en: 'Organisation', fr: 'Organisation' },
    sector: { en: 'Sector', fr: 'Secteur' },
    office: { en: 'Nearest office', fr: 'Bureau le plus proche' },
    message: { en: 'How can we help?', fr: 'Comment pouvons-nous vous aider ?' },
    trap: { en: 'Leave this field empty', fr: 'Laissez ce champ vide' },
    submit: { en: 'Send enquiry', fr: 'Envoyer la demande' },
    sending: { en: 'Screening…', fr: 'Vérification…' },
    choose: { en: 'Choose…', fr: 'Choisir…' },
    sectors: [
      { en: 'Government or public agency', fr: 'Gouvernement ou agence publique' }, { en: 'Development partner', fr: 'Partenaire au développement' },
      { en: 'Private company', fr: 'Entreprise privée' }, { en: 'Non-profit', fr: 'Organisation à but non lucratif' }, { en: 'Other', fr: 'Autre' }
    ],
    okTitle: { en: 'Thank you, your enquiry is on its way', fr: 'Merci, votre demande est transmise' },
    okText: { en: 'We have sent a confirmation to your inbox. The {office} office will reply within two working days.', fr: 'Nous vous avons envoyé une confirmation. Le bureau de {office} vous répondra sous deux jours ouvrés.' },
    reviewTitle: { en: 'Thank you, we have received your message', fr: 'Merci, nous avons bien reçu votre message' },
    reviewText: { en: 'Our team will review it and get back to you if it relates to our services.', fr: 'Notre équipe va l’examiner et reviendra vers vous s’il concerne nos services.' },
    required: { en: 'Please complete this field.', fr: 'Veuillez remplir ce champ.' },
    emailInvalid: { en: 'Please enter a valid email address.', fr: 'Veuillez saisir une adresse e-mail valide.' },
    privacy: { en: 'We use your details only to answer your enquiry. See our privacy policy.', fr: 'Nous utilisons vos données uniquement pour répondre à votre demande. Voir notre politique de confidentialité.' },
    captcha: { en: 'Protected by rate limiting and an invisible CAPTCHA.', fr: 'Protégé par une limitation de fréquence et un CAPTCHA invisible.' },
    rate: { en: 'Too many attempts. Please wait a minute and try again.', fr: 'Trop de tentatives. Veuillez patienter une minute.' },
    demoScore: { en: 'Prototype: lead score', fr: 'Prototype : score du prospect' }
  },
  careers: {
    eyebrow: { en: 'Careers', fr: 'Carrières' },
    title: { en: 'Build a career that moves institutions', fr: 'Une carrière au service des institutions' },
    lead: { en: 'We invest in the growth of every consultant, with the tools, skills and support to deliver lasting value.', fr: 'Nous investissons dans l’évolution de chaque consultant, avec les outils, compétences et soutien nécessaires pour créer une valeur durable.' },
    formTitle: { en: 'Apply to CERFODES', fr: 'Postuler chez CERFODES' },
    area: { en: 'Area of expertise', fr: 'Domaine d’expertise' },
    cv: { en: 'CV (PDF or Word, 5 MB max)', fr: 'CV (PDF ou Word, 5 Mo max)' },
    drop: { en: 'Drop your CV here or browse', fr: 'Déposez votre CV ici ou parcourez' },
    scanning: { en: 'Running security checks…', fr: 'Contrôles de sécurité en cours…' },
    clean: { en: 'Your file passed all security checks.', fr: 'Votre fichier a passé tous les contrôles de sécurité.' },
    cleaned: { en: 'Your file passed. We removed active content (macros or scripts) for safety.', fr: 'Votre fichier est accepté. Nous avons retiré le contenu actif (macros ou scripts) par sécurité.' },
    blocked: { en: 'We could not accept this file. Please upload a clean PDF or Word document.', fr: 'Nous ne pouvons pas accepter ce fichier. Veuillez envoyer un document PDF ou Word sain.' },
    submit: { en: 'Submit application', fr: 'Envoyer la candidature' },
    okTitle: { en: 'Thank you for applying to CERFODES', fr: 'Merci d’avoir postulé chez CERFODES' },
    okText: { en: 'Your CV passed our security checks. We review every application within three weeks and have emailed you a confirmation.', fr: 'Votre CV a passé nos contrôles de sécurité. Nous examinons chaque candidature sous trois semaines et vous avons envoyé une confirmation.' },
    areas: [ { en: 'Technology', fr: 'Technologie' }, { en: 'Management', fr: 'Management' }, { en: 'Consulting', fr: 'Conseil' }, { en: 'Finance and administration', fr: 'Finance et administration' } ],
    why: [
      { t: { en: 'Growth', fr: 'Évolution' }, d: { en: 'Structured development and mentoring from senior experts.', fr: 'Un développement structuré et le mentorat d’experts confirmés.' } },
      { t: { en: 'Impact', fr: 'Impact' }, d: { en: 'Work that shapes public services and markets across Africa.', fr: 'Des missions qui transforment services publics et marchés en Afrique.' } },
      { t: { en: 'Respect', fr: 'Respect' }, d: { en: 'A culture of empathy, respect and diversity of opinions and backgrounds.', fr: 'Une culture d’empathie, de respect et de diversité des opinions et des parcours.' } }
    ]
  },
  about: {
    title: { en: 'Africa-based. African-led. International.', fr: 'Basé en Afrique. Dirigé par des Africains. International.' },
    lead: { en: 'Founded in 2002, CERFODES provides technical advice and support to public, private and non-profit organisations, with the primary focus of adding value.', fr: 'Fondé en 2002, CERFODES apporte conseil technique et appui aux organisations publiques, privées et à but non lucratif, avec pour priorité la création de valeur.' },
    visionT: { en: 'Our vision', fr: 'Notre vision' }, vision: { en: 'Provide up-to-date solutions to our clients and improve their organisations’ operations.', fr: 'Offrir à nos clients des solutions à jour et améliorer le fonctionnement de leurs organisations.' },
    missionT: { en: 'Our mission', fr: 'Notre mission' }, mission: { en: 'To enable our clients and their partners to stay in the lead by providing them with up-to-date solutions.', fr: 'Permettre à nos clients et à leurs partenaires de garder une longueur d’avance grâce à des solutions à jour.' },
    valuesT: { en: 'Our values', fr: 'Nos valeurs' },
    values: [
      { t: { en: 'Dignity of the individual', fr: 'Dignité de la personne' }, d: { en: 'Every individual deserves to be treated with the utmost respect, regardless of gender, race or background.', fr: 'Chaque personne mérite d’être traitée avec le plus grand respect, quels que soient son genre, son origine ou son parcours.' } },
      { t: { en: 'Excellence', fr: 'Excellence' }, d: { en: 'There are no shortcuts to excellence: consistency, commitment and conscientiousness.', fr: 'Il n’y a pas de raccourci vers l’excellence : constance, engagement et conscience professionnelle.' } },
      { t: { en: 'Service', fr: 'Service' }, d: { en: 'Value addition is our lifeblood, and our clients should never settle for less.', fr: 'La création de valeur est notre raison d’être, et nos clients ne doivent jamais se contenter de moins.' } },
      { t: { en: 'Reliability', fr: 'Fiabilité' }, d: { en: 'Respecting deadlines is an absolute criterion for us.', fr: 'Le respect des délais est pour nous un critère absolu.' } },
      { t: { en: 'Transparency', fr: 'Transparence' }, d: { en: 'Clear, explicit objectives and conditions for every collaboration.', fr: 'Des objectifs et conditions clairs et explicites pour chaque collaboration.' } },
      { t: { en: 'Efficiency', fr: 'Efficacité' }, d: { en: 'We equip our people to deliver sustainable value at peak performance.', fr: 'Nous donnons à nos équipes les moyens de créer une valeur durable au meilleur niveau.' } }
    ]
  },
  where: {
    lead: { en: 'Seven offices across West, East and Southern Africa, and engagements wherever our clients need us.', fr: 'Sept bureaux en Afrique de l’Ouest, de l’Est et australe, et des missions partout où nos clients en ont besoin.' }
  },
  footer: {
    rights: { en: 'All rights reserved.', fr: 'Tous droits réservés.' },
    company: { en: 'Company', fr: 'Entreprise' },
    access: { en: 'Access', fr: 'Accès' },
    offices: { en: 'Offices', fr: 'Bureaux' },
    privacy: { en: 'Privacy policy', fr: 'Politique de confidentialité' },
    cookies: { en: 'Cookie settings', fr: 'Paramètres des cookies' },
    prototype: { en: 'Prototype. Items marked as sample are placeholders until CERFODES supplies final content.', fr: 'Prototype. Les éléments marqués « exemple » sont provisoires en attendant le contenu final de CERFODES.' }
  },
  consent: {
    text: { en: 'We use privacy-friendly analytics to improve this site. No advertising cookies.', fr: 'Nous utilisons une mesure d’audience respectueuse de la vie privée. Aucun cookie publicitaire.' },
    accept: { en: 'Accept', fr: 'Accepter' },
    decline: { en: 'Decline', fr: 'Refuser' }
  },
  common: {
    sample: { en: 'Sample', fr: 'Exemple' },
    learnMore: { en: 'Learn more', fr: 'En savoir plus' },
    home: { en: 'Home', fr: 'Accueil' },
    switchTo: { en: 'Français', fr: 'English' }
  },
  privacy: {
    title: { en: 'Privacy policy', fr: 'Politique de confidentialité' },
    body: {
      en: [
        'CERFODES processes personal data in line with the data protection laws of the countries where we operate, including Uganda’s Data Protection and Privacy Act 2019, Kenya’s Data Protection Act 2019 and the Nigeria Data Protection Act 2023.',
        'Enquiries: we keep contact details for 24 months after our last exchange. Messages marked as spam are deleted after 30 days.',
        'Applications: CVs are kept for 12 months unless you ask us to delete them sooner. Every file is security-scanned before storage and encrypted at rest.',
        'Newsletter: we send the CERFODES Brief only after you confirm your subscription. Every email includes an unsubscribe link.',
        'Analytics: we use privacy-friendly, cookie-less analytics and only after you consent.',
        'To access, correct or delete your data, email info@cerfodesgroup.com.'
      ],
      fr: [
        'CERFODES traite les données personnelles conformément aux lois sur la protection des données des pays où nous opérons, notamment la loi ougandaise de 2019 sur la protection des données et de la vie privée, la loi kényane de 2019 sur la protection des données et la loi nigériane de 2023 sur la protection des données.',
        'Demandes : nous conservons les coordonnées 24 mois après notre dernier échange. Les messages classés comme spam sont supprimés après 30 jours.',
        'Candidatures : les CV sont conservés 12 mois, sauf demande de suppression anticipée. Chaque fichier est analysé avant stockage et chiffré.',
        'Newsletter : nous envoyons le CERFODES Brief uniquement après confirmation de votre abonnement. Chaque e-mail comporte un lien de désabonnement.',
        'Mesure d’audience : nous utilisons une mesure sans cookie, respectueuse de la vie privée, et uniquement avec votre consentement.',
        'Pour accéder à vos données, les corriger ou les supprimer, écrivez à info@cerfodesgroup.com.'
      ]
    }
  }
};
