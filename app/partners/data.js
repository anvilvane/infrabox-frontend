// Partner directory data - Infrabox Partner Network.
// Source: Infrabox Partner Tiers spreadsheet (Spring 2026).
// Tier names: Platinum Elite, Gold, Growth, Certified.
// IMPORTANT: do not expose per-partner mailbox counts or revenue - competitor scraping risk.

export const slugify = (s) =>
  s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const withSlug = (p) => ({ ...p, slug: slugify(p.name) });

export const PARTNERS = {
  platinum: [
    { name:'The Playbook Agency',   monogram:'TP', color:'#0033bb', tagline:'Email, GTM engineering, RevOps & Clay for venture-backed B2B teams.', location:'UAE',         services:['Email','GTM engineering','RevOps','Clay builds'],         industries:['B2B SaaS','Web3','Enterprise'],   languages:['English'],            featured:true,  href:'https://theplaybook.agency', book:'https://cal.com/theplaybook' },
    { name:'cold.email',            monogram:'CE', color:'#0033bb', tagline:'Full-stack email agency for B2B SaaS. Built-for-you outbound with creator distribution.', location:'USA', services:['Whitelabel studio','Co-marketing','Domain & DNS','Mailbox provisioning'], industries:['B2B SaaS','Agencies','Creators'], languages:['English'], featured:true },
    { name:'Magnetic Minds Digital',monogram:'MM', color:'#2a1f4a', tagline:'AI-powered outbound for SaaS and services teams across APAC and the US.', location:'India',        services:['AI outbound','Infrastructure','Lead research','Reporting'],    industries:['SaaS','Agencies','Services'],     languages:['English','Hindi'],    featured:true },
    { name:'SendtoWin',             monogram:'SW', color:'#1b3a4b', tagline:'Pipeline generation for venture-backed B2B SaaS and fintech teams. Operator-led delivery.', location:'USA', services:['Pipeline generation','Sequencer build','Copywriting','Reply handling'], industries:['B2B SaaS','Fintech','Enterprise'], languages:['English'] },
    { name:'Prospeqt',              monogram:'PQ', color:'#1e3a8a', tagline:'DACH-market outbound agency. Localized copy for German enterprise buyers.', location:'Germany', services:['DACH outbound','Sequencer build','Copywriting','GDPR audit'], industries:['B2B SaaS','Industrial'], languages:['German','English'] },
    { name:'Anevo Marketing',       monogram:'AM', color:'#7c2d12', tagline:'Founder-led outbound retainer for US SaaS.',                                                location:'USA',         services:['Setup','Sequencer build','Copywriting','Reporting'],         industries:['B2B SaaS','Agencies'],            languages:['English'] },
    { name:'Vertical GTM',          monogram:'VG', color:'#6d28d9', tagline:'LinkedIn-led GTM agency combining outbound, content, and ABM for venture-backed SaaS.', location:'USA',         services:['GTM strategy','LinkedIn + email','Sequencer build'],          industries:['B2B SaaS','PLG'],                 languages:['English'] },
    { name:'Cold Labs',             monogram:'CL', color:'#0d9488', tagline:'Eastern European outbound lab covering the CEE coverage gap.',                            location:'Bulgaria',    services:['Setup','Sequencer build','Deliverability'],                   industries:['SaaS','Marketplaces'],            languages:['English','Bulgarian'] },
    { name:'LeadHaste',             monogram:'LH', color:'#9f1239', tagline:'Referral-driven outbound shop for European B2B teams.',                                   location:'Europe',      services:['Setup','Sequencer build','Reply handling'],                   industries:['SaaS','Agencies'],                languages:['English'] },
    { name:'LeadHype',              monogram:'LY', color:'#b45309', tagline:'Outbound for US mid-market SaaS with a global delivery team.',                            location:'USA',         services:['Mid-market outbound','Sequencer build','Reply handling'],     industries:['B2B SaaS','Enterprise'],          languages:['English','Korean'] },
    { name:'Understory',            monogram:'US', color:'#374151', tagline:'Long-tenured boutique focused on creative-led outbound for SaaS and D2C.',                location:'USA',         services:['Strategy','Copywriting','Creative','Sequencer build'],        industries:['SaaS','D2C'],                     languages:['English'] },
    { name:'Netswick',              monogram:'NS', color:'#1f2937', tagline:'Revenue-first outbound optimizing for fewer, hotter accounts.',                           location:'MENA',        services:['Account-based outbound','Sequencer build','RevOps'],          industries:['B2B SaaS','Enterprise'],          languages:['English','Arabic'] },
    { name:'Outstation',            monogram:'OS', color:'#0369a1', tagline:'UK-market outbound team. Local-buyer copy and EU compliance.',                            location:'UK',          services:['UK & EU outbound','Sequencer build','Reporting'],             industries:['SaaS','Agencies'],                languages:['English'] },
    { name:'Avalanche Capital',     monogram:'AC', color:'#581c87', tagline:'UK consultancy running outbound for revenue and capital-raising teams.',                  location:'UK',          services:['Capital raising','Sequencer build','Reply handling'],          industries:['Financial services','Consulting'], languages:['English'] },
    { name:'OutreachBloom',         monogram:'OB', color:'#0d9488', tagline:'Veteran outbound shop with strong brand authority and content distribution.',             location:'USA',         services:['Outbound strategy','Sequencer build','Reporting'],            industries:['B2B SaaS','Agencies'],            languages:['English'] },
    { name:'A-Sales',               monogram:'AS', color:'#0891b2', tagline:'Nordic outbound specialist with high-volume infrastructure experience.',                  location:'Sweden',      services:['Nordic outbound','Infrastructure','Sequencer build'],         industries:['B2B SaaS','Industrial'],          languages:['Swedish','English'] },
    { name:'EventCaptain',          monogram:'EC', color:'#be185d', tagline:'Event-marketing outbound niche. Email programs that fill venues and conferences.',   location:'USA',         services:['Event outbound','Sequencer build','Copywriting'],             industries:['Events','Hospitality'],           languages:['English'] },
    { name:'Referral Program Pros', monogram:'RP', color:'#7c2d12', tagline:'Referral-marketing outbound shop with a large infrastructure footprint.',                 location:'USA',         services:['Referral outbound','Setup','Sequencer build'],                industries:['D2C','SaaS'],                     languages:['English'] },
    { name:'Rillation Revenue',     monogram:'RR', color:'#155e75', tagline:'Outbound + revenue operations boutique for B2B SaaS.',                                    location:'Global',      services:['RevOps','Sequencer build','CRM integration'],                  industries:['B2B SaaS','PLG'],                 languages:['English'] },
    { name:'Fundraisly',            monogram:'FR', color:'#5b21b6', tagline:'Fundraising-via-email niche for nonprofits and education.',                          location:'Global',      services:['Nonprofit outbound','Sequencer build','Reply handling'],       industries:['Nonprofit','Education'],          languages:['English'] },
    { name:'The Growth Pro',        monogram:'GP', color:'#0f766e', tagline:'Bilingual outbound team covering North America and LATAM.',                                location:'Canada',     services:['Bilingual outbound','Sequencer build','Copywriting'],         industries:['SaaS','Agencies'],                languages:['English','French','Spanish'] },
    { name:'Magically Genius',      monogram:'MG', color:'#4338ca', tagline:'Full-stack outbound specialist scaling email programs end-to-end.',                  location:'Global',      services:['Full-stack outbound','Sequencer build','Reporting'],          industries:['B2B SaaS','Agencies'],            languages:['English'] },
  ].map(withSlug),

  gold: [
    { name:'Lidgen',              monogram:'LG', color:'#1e40af', tagline:'MENA/Israel outbound specialist with sequencer build and reply handling.',                                location:'Israel',       services:['MENA outbound','Sequencer build','Reply handling'],   industries:['B2B SaaS','Agencies'], languages:['English','Hebrew'] },
    { name:'Source It Marketing', monogram:'SI', color:'#0891b2', tagline:'Mid-market outbound on retainer for B2B services.',                location:'Global',       services:['Retainer outbound','Sequencer build','Reporting'],    industries:['B2B services','SaaS'],  languages:['English'] },
    { name:'Sales Boutique',      monogram:'SB', color:'#0d9488', tagline:'Netherlands boutique covering the European B2B market.',          location:'Netherlands',  services:['EU outbound','Sequencer build','Copywriting'],        industries:['SaaS','Agencies'],       languages:['Dutch','English'] },
    { name:'Maildoso',            monogram:'MD', color:'#dc2626', tagline:'US outbound with strong deliverability discipline.',              location:'USA',          services:['Deliverability','Setup','Sequencer build'],            industries:['SaaS','Agencies'],       languages:['English'] },
    { name:'SuperSend',           monogram:'SS', color:'#7c3aed', tagline:'High-volume US outbound team with deep tooling expertise.',        location:'USA',          services:['Sequencer build','Tooling','Reporting'],              industries:['B2B SaaS','PLG'],        languages:['English'] },
    { name:'Abstrakt MG',         monogram:'AB', color:'#b45309', tagline:'Large US agency with enterprise outbound playbooks.',              location:'USA',          services:['Enterprise outbound','SDR-as-a-service','Sequencer build'], industries:['Enterprise','Industrial'], languages:['English'] },
    { name:'Enrichflow',          monogram:'EF', color:'#0f766e', tagline:'Data + sequencing workflows for B2B outbound teams.',              location:'Global',       services:['Data enrichment','Sequencer build','Reporting'],      industries:['B2B SaaS','Agencies'],   languages:['English'] },
    { name:'Axia Growth',         monogram:'AX', color:'#1f2937', tagline:'M&A deal-flow outbound niche with account research and sequencer build.',                                    location:'USA',          services:['M&A outbound','Account research','Sequencer build'],  industries:['Financial services','M&A'], languages:['English'] },
    { name:'Scaletopia',          monogram:'ST', color:'#9333ea', tagline:'Growth agency taking outbound from setup to scale.',                location:'USA',          services:['Growth outbound','Sequencer build','Reporting'],      industries:['SaaS','D2C'],            languages:['English'] },
    { name:'Success.ai',          monogram:'SA', color:'#0369a1', tagline:'Operator-led outbound for scaled email programs.',            location:'Global',       services:['Email programs','Sequencer build','Deliverability'], industries:['SaaS','Agencies'],    languages:['English'] },
    { name:'Deliverability Ninja',monogram:'DN', color:'#059669', tagline:'Deliverability-first outbound brand.',                              location:'Global',       services:['Deliverability audit','DNS','Warmup'],                industries:['B2B SaaS','Agencies'],   languages:['English'] },
    { name:'OppDrip',             monogram:'OD', color:'#be185d', tagline:'Infrastructure-heavy outbound for mid-market clients.',            location:'Global',       services:['Infrastructure','Sequencer build','Reporting'],       industries:['SaaS','Agencies'],       languages:['English'] },
    { name:'SalesUp Club',        monogram:'SU', color:'#4338ca', tagline:'India-based outbound community-meets-agency for SaaS founders.',  location:'India',        services:['Outbound community','Sequencer build','Copywriting'], industries:['SaaS','Agencies'],       languages:['English','Hindi'] },
  ].map(withSlug),

  growth: [
    { name:'Prospectify',         monogram:'PR', color:'#1e40af', tagline:'Outbound for European B2B SaaS with sequencer build and pan-EU account research.',                            location:'Spain',         services:['EU outbound','Sequencer build'],         industries:['SaaS','Agencies'],         languages:['Spanish','English'] },
    { name:'Level180',            monogram:'L1', color:'#0d9488', tagline:'African-market outbound specialist with sequencer build for SaaS teams.',                        location:'South Africa',  services:['Africa outbound','Sequencer build'],     industries:['SaaS','Services'],         languages:['English'] },
    { name:'GTMx',                monogram:'GX', color:'#7c3aed', tagline:'High-volume outbound shop for B2B SaaS with sequencer builds and reply handling.',                    location:'Global',        services:['High-volume outbound','Sequencer build'], industries:['B2B SaaS'],              languages:['English'] },
    { name:'NerasVenture',        monogram:'NV', color:'#dc2626', tagline:'Outbound and venture-backed GTM consultancy.',                location:'Global',        services:['GTM consulting','Sequencer build'],      industries:['Venture-backed SaaS'],     languages:['English'] },
    { name:'Oneaway',             monogram:'OW', color:'#0891b2', tagline:'Founder-led outbound team grown via referral.',               location:'Global',        services:['Founder-led outbound'],                  industries:['SaaS','Agencies'],         languages:['English'] },
    { name:'Elsa Consulting',     monogram:'EL', color:'#475569', tagline:'Boutique outbound and revenue consultancy.',                  location:'Global',        services:['Outbound','RevOps'],                     industries:['B2B SaaS','Services'],     languages:['English'] },
    { name:'Wild Community',      monogram:'WC', color:'#9333ea', tagline:'Community-led outbound for venture-backed SaaS.',             location:'Global',        services:['Community-led outbound'],                industries:['Venture-backed SaaS'],     languages:['English'] },
    { name:'Predictable Revenue', monogram:'PV', color:'#059669', tagline:'Veteran B2B sales brand running outbound retainers.',         location:'Canada',        services:['Outbound retainers','Sequencer build'],  industries:['B2B SaaS'],                languages:['English'] },
    { name:'Outbound Buddy',      monogram:'OU', color:'#0369a1', tagline:'UK outbound team running retainer engagements for SaaS.',     location:'UK',            services:['Retainer outbound','Sequencer build'],   industries:['SaaS','Agencies'],         languages:['English'] },
    { name:'AI Agency Institute', monogram:'AI', color:'#7c2d12', tagline:'Australia-based AI agency content + outbound.',                location:'Australia',     services:['AI outbound','Content'],                 industries:['SaaS','Agencies'],         languages:['English'] },
    { name:'Thriving Arc',        monogram:'TA', color:'#be185d', tagline:'LinkedIn-channel-led outbound consultancy.',                   location:'Global',        services:['LinkedIn + email'],                      industries:['B2B SaaS','Agencies'],     languages:['English'] },
    { name:'North Consulting',    monogram:'NC', color:'#0f766e', tagline:'Australia outbound team for SaaS and services.',              location:'Australia',     services:['Outbound','Sequencer build'],            industries:['SaaS','Services'],         languages:['English'] },
    { name:'Enavra',              monogram:'EV', color:'#581c87', tagline:'Boutique outbound for B2B SaaS teams with done-with-you sequencer builds and reply handling.',                             location:'Global',        services:['Outbound'],                              industries:['B2B SaaS'],                languages:['English'] },
    { name:'Automindz Solutions', monogram:'AZ', color:'#1f2937', tagline:'UAE-based outbound for the Middle East market.',              location:'UAE',           services:['MENA outbound'],                         industries:['SaaS','Agencies'],         languages:['English','Arabic'] },
    { name:'Unify GTM',           monogram:'UG', color:'#a16207', tagline:'US outbound team focused on go-to-market programs.',          location:'USA',           services:['GTM outbound'],                          industries:['B2B SaaS'],                languages:['English'] },
    { name:'InboxNavigator',      monogram:'IN', color:'#155e75', tagline:'Mid-volume outbound shop scaling B2B retainers.',             location:'Global',        services:['Retainer outbound','Sequencer build'],   industries:['B2B SaaS','Agencies'],     languages:['English'] },
    { name:'Email Ethos',         monogram:'EE', color:'#4338ca', tagline:'Ethical, deliverability-safe outbound with sender-reputation guardrails.',                       location:'Global',        services:['Deliverability','Outbound'],             industries:['B2B SaaS','Agencies'],     languages:['English'] },
    { name:'Deal GTM',            monogram:'DG', color:'#9f1239', tagline:'Outbound for revenue and partnership pipelines.',              location:'Global',        services:['Partnership outbound','Sequencer build'], industries:['B2B SaaS'],               languages:['English'] },
    { name:'LeadzROI',            monogram:'LZ', color:'#1e3a8a', tagline:'US team optimizing outbound ROI on mid-volume programs.',     location:'USA',           services:['ROI outbound','Sequencer build'],        industries:['B2B SaaS'],                languages:['English'] },
    { name:'Plenty Deals',        monogram:'PD', color:'#0d9488', tagline:'Spain-based outbound for B2B and marketplaces.',              location:'Spain',         services:['EU outbound','Sequencer build'],         industries:['SaaS','Marketplaces'],     languages:['Spanish','English'] },
    { name:'RevCentric',          monogram:'RV', color:'#7c3aed', tagline:'Revenue-centric outbound and pipeline consultancy.',          location:'Global',        services:['Revenue ops','Outbound'],                industries:['B2B SaaS'],                languages:['English'] },
    { name:'Relevance AI',        monogram:'RA', color:'#0891b2', tagline:'AI-driven outbound personalization at scale for SaaS and agency teams.',                          location:'Cyprus',        services:['AI outbound','Personalization'],         industries:['SaaS','Agencies'],         languages:['English'] },
    { name:'Hypergen / Hypernova',monogram:'HG', color:'#dc2626', tagline:'Portugal-based outbound team scaling EU pipelines.',          location:'Portugal',      services:['EU outbound','Sequencer build'],         industries:['SaaS','Agencies'],         languages:['Portuguese','English'] },
  ].map(withSlug),

  certified: [
    { name:'Revenue Boost',        monogram:'RB', color:'#1e40af', location:'USA',    tagline:'Outbound retainers for early-stage SaaS founders, from copy to reply handling.' },
    { name:'Prospero AI',          monogram:'PA', color:'#0d9488', location:'UK',     tagline:'AI-augmented prospecting for B2B teams with enriched targeting and copy generation.' },
    { name:'Heavn Media',          monogram:'HM', color:'#7c3aed', location:'Global', tagline:'Content + outbound studio for venture-backed SaaS.' },
    { name:'Enrow',                monogram:'EN', color:'#dc2626', location:'France', tagline:'French-market outbound operator with native French sequences and CNIL-aware deliverability.' },
    { name:'Legacy GTM',           monogram:'LG', color:'#0891b2', location:'Global', tagline:'Outbound consultancy with enterprise focus.' },
    { name:'Best Leads',           monogram:'BL', color:'#059669', location:'Global', tagline:'Lead-generation focused outbound shop with sequencer build and copywriting.' },
    { name:'Incendium Strategies', monogram:'IS', color:'#7c2d12', location:'USA',    tagline:'US outbound operator for mid-market services.' },
    { name:'Primavera Solar',      monogram:'PS', color:'#be185d', location:'Brazil', tagline:'LATAM-market outbound with native Spanish and Portuguese sequences.' },
  ].map(withSlug),
};

export const TIER_META = {
  platinum: { key:'platinum', label:'Platinum Elite',      short:'Platinum Elite', tag:'PLATINUM ELITE', dot:'#001040', mark:'#d9fad3', blurb:'Our top tier. Whitelabel Studio access and co-marketing with Infrabox.' },
  gold:     { key:'gold',     label:'Gold Partners',        short:'Gold',           tag:'GOLD',           dot:'#c79324', blurb:'Senior partners with partner-page listing, early feature access, and Gold badge.' },
  growth:   { key:'growth',   label:'Growth Partners',      short:'Growth',         tag:'GROWTH',         dot:'#8b95a3', blurb:'Active partners with partner-page listing, affiliate links, and Growth badge.' },
  certified:{ key:'certified',label:'Certified Partners',   short:'Certified',      tag:'CERTIFIED',      dot:'#b87333', blurb:'Infrabox-certified operators. Affiliate links and Certified badge.' },
};

export const TIER_COUNTS = {
  total: Object.values(PARTNERS).reduce((n, arr) => n + arr.length, 0),
  platinum: PARTNERS.platinum.length,
  gold: PARTNERS.gold.length,
  growth: PARTNERS.growth.length,
  certified: PARTNERS.certified.length,
};

// Map slug → { ...partner, tier }
export const PARTNER_BY_SLUG = (() => {
  const map = {};
  for (const tier of Object.keys(PARTNERS)) {
    for (const p of PARTNERS[tier]) {
      map[p.slug] = { ...p, tier };
    }
  }
  return map;
})();

export const ALL_SLUGS = Object.keys(PARTNER_BY_SLUG);

// Full profile content for partners that have provided it.
// All other partners fall back to a minimal template using the directory fields above.
export const PROFILE_CONTENT = {
  'the-playbook-agency': {
    heroMonogramText: 'TPBA',
    heroTagline: '#1 GTM Operations Agency in Europe. Email, GTM engineering, RevOps consultancy, and Clay automation.',
    headquartersDisplay: 'London · Dubai · Wyoming',
    website: 'theplaybook.agency',
    websiteUrl: 'https://theplaybook.agency',
    partnerSince: '2024',
    bookUrl: 'https://cal.com/theplaybook',
    bestFor: 'SaaS · Web3 · Enterprise B2B',
    engagement: 'Retainer · 6+ months',
    response: '< 4 hours during business',
    stats: [
      { n: '30+',  l: 'Companies supported',                verified: true },
      { n: '1.2M', l: 'Sends per month via Infrabox',       verified: true },
      { n: '40%',  l: 'Avg. tech cost savings for clients', verified: false },
    ],
    aboutTitle: "Europe's leading GTM operations agency.",
    aboutParas: [
      "The Playbook Agency is Europe's leading GTM operations agency, helping SaaS, Web3, and enterprise B2B companies build scalable pipeline through email infrastructure, Clay-powered automation, and hands-on RevOps consulting. They build, automate, or fully run inbound and outbound sales workflows - so revenue teams can focus on closing, not configuring.",
      "Founded by ex-Heads of Sales, the team brings real operator experience across SDR, AE, and sales leadership roles. Clients range from pre-seed founders doing founder-led sales to Series B companies with 100+ reps. Most engagements run 6+ months on a retainer basis, transitioning to in-house when the client is ready.",
      "As an Infrabox Platinum Elite partner, TPBA has deep expertise deploying email infrastructure at scale - managing deliverability strategy, inbox rotation, and campaign architecture across Google, Outlook, and Azure environments.",
    ],
    services: [
      { icon:'Mail',       t:'Email infrastructure', d:'Domain strategy, mailbox provisioning, warmup, and deliverability ops - all wired through Infrabox.' },
      { icon:'Settings',   t:'GTM engineering',           d:'Custom-built outbound systems connecting your CRM, enrichment, sequencer, and reporting into one workflow.' },
      { icon:'BarChart',   t:'RevOps consultancy',        d:'Process design, attribution, and forecasting for revenue teams scaling past founder-led sales.' },
      { icon:'Cpu',        t:'Clay automation',           d:'End-to-end Clay tables, agents, and waterfalls - research, enrichment, and signal-driven outbound on autopilot.' },
    ],
    industries: ['SaaS','Web3','Enterprise B2B','Fintech','HRTech','DevTools'],
    tools: ['Infrabox','Clay','Smartlead','Instantly','HubSpot','Salesforce','Apollo','Slack'],
    languages: ['English','French','Arabic'],
    testimonials: [
      { n:'Jon Rudoe',     r:'CCO · Nous (HRTech)',                a:'#B5D4F4', af:'#0C447C',
        q:"TPBA helped build our outbound playbook, proving that we had real B2B traction. We were able to go from 0 to a consistent 10 meetings per week. They did the heavy lifting, so that we could focus on strategic initiatives - and scale into our Series B." },
      { n:'Anas Ammari',   r:'Head of Growth · Compilot',          a:'#E5D5B7', af:'#5C4419',
        q:"TPBA was able to extend our outreach way beyond what was possible with our existing processes. We were able to book opportunities with organisations like Binance & MoonPay through email, which I wouldn't have believed if we didn't experience it." },
      { n:'Max Beauroyre', r:'Abacum (Spend Management Platform)', a:'#D4C5E8', af:'#3C2A5C',
        q:"Best GTM Engineering team in Europe right now. The pipeline impact in just 14 days was remarkable - and we own everything they built." },
    ],
  },
};
