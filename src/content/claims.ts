// src/content/claims.ts
// Traceability register mapping every site claim and fragment to CONTENT.md.

export interface ClaimEntry {
  id: string;
  text: string;
  source: string;
  isFragment?: boolean;
}

export const claimsRegister: ClaimEntry[] = [
  {
    id: 'hero-headline',
    text: 'No two businesses are alike.',
    source: 'CONTENT.md > HERO Headline & PILLARS Apt',
  },
  {
    id: 'hero-subhead',
    text: 'Our Vision is to help small and mid-sized enterprises reap the benefits of modern technology and globalization.',
    source: 'CONTENT.md > HERO Sub & ABOUT P2',
  },
  {
    id: 'hero-modernization-fragment',
    text: 'If legacy technology is holding you back',
    source: 'CONTENT.md > SERVICES 4 (Application Modernization/Migration Services, first clause fragment)',
    isFragment: true,
  },
  {
    id: 'modernization-migration-clause',
    text: 'We help you to migrate your legacy code into newer platforms that provides you with all the advantages of latest technology along with lower product maintenance cost.',
    source: 'CONTENT.md > SERVICES 4 (Sentence 1, second clause capitalized)',
  },
  {
    id: 'modernization-disruption-sentence',
    text: 'We can take you through this process with minimal disruptions and add value to your business.',
    source: 'CONTENT.md > SERVICES 4 (Sentence 2)',
  },
  {
    id: 'beat-apt',
    text: 'No two businesses are alike.',
    source: 'CONTENT.md > HERO Headline & PILLARS Apt',
  },
  {
    id: 'beat-product-engineering',
    text: 'We help companies build products from concept to commercialization.',
    source: 'CONTENT.md > SERVICES 1 (Sentence 1)',
  },
  {
    id: 'beat-delivery',
    text: 'Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones.',
    source: 'CONTENT.md > WHY APT Efficiency (Sentence 2)',
  },
  {
    id: 'beat-testing',
    text: 'Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application.',
    source: 'CONTENT.md > SERVICES 5 (Sentence 1)',
  },
  {
    id: 'sdlc-methodology',
    text: 'We follow the typical software development lifecycle (SDLC) as well as the agile methodology for software development. Our teams situated in offshore and onshore locations support you in your entire product life cycle through development, maintenance, tech support and technical documentation.',
    source: 'CONTENT.md > WHY APT Excellence (full)',
  },
  {
    id: 'app-dev-platforms',
    text: 'Mobile applications | Web applications | Standalone windows applications',
    source: 'CONTENT.md > SERVICES 2 (Custom Application Development)',
  },
  {
    id: 'saas-azure-cloud',
    text: 'SaaS is now a widely accepted model of providing dependable and cost-effective software applications to customers. Hosted on top cloud platform providers like Windows Azure by Microsoft.',
    source: 'CONTENT.md > SERVICES 3 (Cloud Software as a Service)',
  },
];
