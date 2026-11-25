// src/content/site.ts
// Single source of truth for site content derived strictly from CONTENT.md

export interface ServiceDetail {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  fullDescription: string;
  bulletPoints?: string[];
  iconType: 'engineering' | 'custom-app' | 'saas' | 'modernization' | 'testing' | 'analytics';
}

export interface EngagementModel {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
}

export interface WhyAptPillar {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  models?: EngagementModel[];
}

export interface CorePillar {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
}

export interface AudienceItem {
  id: string;
  letter: string;
  title: string;
  description: string;
  matchedServices: string[];
}

export interface CareerRole {
  id: string;
  title: string;
  department: string;
  status: string;
  statusDetail: string;
}

export const siteContent = {
  meta: {
    siteName: 'Apt Infosoft',
    siteTitle: 'Apt Infosoft – Engineering Software Built to Last',
    description: 'Product engineering, custom application development, cloud SaaS, application modernization, testing, and business reporting & analytics for SMEs.',
    url: 'https://kubendrasn-creator.github.io/NewWebsite/',
  },
  nav: [
    { name: 'Services', href: '/services/' },
    { name: 'Why Apt', href: '/why-apt/' },
    { name: 'About', href: '/about/' },
    { name: 'Careers', href: '/careers/' },
    { name: 'Contact Us', href: '/contact/' },
  ],
  hero: {
    badge: 'Tailored Software Solutions',
    headlinePrefix: 'No two businesses',
    headlineEmphasis: 'are alike.',
    subhead: 'Our Vision is to help small and mid-sized enterprises reap the benefits of modern technology and globalization.',
    primaryCTA: 'Our Services',
    primaryHref: '/services/',
    secondaryCTA: 'Contact Us',
    secondaryHref: '/contact/',
    scrollCue: 'Scroll to explore',
  },
  motionBeats: [
    {
      id: 'apt',
      title: 'Apt',
      caption: 'No two businesses are alike.',
      keyPath: 'siteContent.motionBeats[0].caption',
      sourceDoc: 'CONTENT.md: HERO Headline & PILLARS Apt',
    },
    {
      id: 'product-engineering',
      title: 'Product Engineering',
      caption: 'We help companies build products from concept to commercialization.',
      keyPath: 'siteContent.motionBeats[1].caption',
      sourceDoc: 'CONTENT.md: SERVICES 1 (Sentence 1)',
    },
    {
      id: 'delivery',
      title: 'Delivery',
      caption: 'Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones.',
      keyPath: 'siteContent.motionBeats[2].caption',
      sourceDoc: 'CONTENT.md: WHY APT Efficiency (Sentence 2)',
    },
    {
      id: 'testing',
      title: 'Testing',
      caption: 'Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application.',
      keyPath: 'siteContent.motionBeats[3].caption',
      sourceDoc: 'CONTENT.md: SERVICES 5 (Sentence 1)',
    },
  ],
  marquee: [
    'Product Engineering Services',
    'Custom Application Development',
    'Cloud Software as a Service (SaaS)',
    'Application Modernization / Migration',
    'Quality Assurance & Testing',
    'Business Reporting & Analytics',
  ],
  pillars: [
    {
      id: 'apt',
      name: 'Apt',
      eyebrow: '01 / Tailored Precision',
      description: 'No two businesses are alike. What is suitable for others may not be true for you. Apt InfoSoft believes in working closely with you to design solutions that are suitable, appropriate and relevant for your business needs.',
      image: '1.jpg',
    },
    {
      id: 'agile',
      name: 'Agile',
      eyebrow: '02 / Rapid Adaptation',
      description: 'We are aware of the high obsolescence in the technology landscape. Therefore we keep close pace with the changes in technology as well as your business to deliver solutions that meet your current and future needs.',
      image: '2.jpg',
    },
    {
      id: 'assured',
      name: 'Assured',
      eyebrow: '03 / Guaranteed Reliability',
      description: 'We understand how important it is for you to not only get a great solution, but also a solution that works as expected the first time and every time. Our systems and processes ensure that you get high quality solutions always and in all ways.',
      image: '3.jpg',
    },
  ] as CorePillar[],
  services: [
    {
      id: 'product-engineering',
      slug: 'product-engineering',
      number: '01',
      title: 'Product Engineering Services',
      shortTitle: 'Product Engineering',
      tagline: 'From concept to commercialization',
      summary: 'We help companies build products from concept to commercialization. We work closely and continuously with our customers to understand their ideas and requirements and develop those into new products.',
      fullDescription: 'We also facilitate building proof-of-concept, product prototypes, and maintaining existing products cost effectively, through innovative engagement models that works for you.',
      bulletPoints: [
        'Proof-of-concept and prototype generation',
        'Full product development lifecycle',
        'Cost-effective product maintenance',
      ],
      iconType: 'engineering',
    },
    {
      id: 'custom-application',
      slug: 'application-development',
      number: '02',
      title: 'Custom Application Development',
      shortTitle: 'Custom Applications',
      tagline: 'Mobile, Web, & Desktop standards-driven quality',
      summary: 'We specialize in developing new applications and maintaining your existing ones. Our rich experience will help us understand your business needs and deliver standards-driven quality applications at low cost.',
      fullDescription: 'We can meet your development needs across multiple platforms with standards-driven software architecture.',
      bulletPoints: [
        'Mobile applications',
        'Web applications',
        'Standalone windows applications',
      ],
      iconType: 'custom-app',
    },
    {
      id: 'saas',
      slug: 'saas',
      number: '03',
      title: 'Cloud Software as a Service (SaaS)',
      shortTitle: 'Cloud SaaS',
      tagline: 'Scalable cloud delivery & pay-as-you-go efficiency',
      summary: 'SaaS is now a widely accepted model of providing dependable and cost-effective software applications to customers. Hosted on top cloud platform providers like Windows Azure by Microsoft.',
      fullDescription: 'Our systematic approach will help you transition your product to the cloud, or develop new web-applications for you. The SaaS model provides several advantages to both the vendor and the customer.',
      bulletPoints: [
        'Reduced upfront investment eliminating expensive IT infrastructure procurement and maintenance',
        'Reduced operational cost with pay-as-you-go model and dynamically scalable capacity',
      ],
      iconType: 'saas',
    },
    {
      id: 'modernization',
      slug: 'application-modernization',
      number: '04',
      title: 'Application Modernization / Migration Services',
      shortTitle: 'Modernization',
      tagline: 'Legacy code transformation with minimal disruption',
      summary: 'If legacy technology is holding you back, we help you to migrate your legacy code into newer platforms that provides you with all the advantages of latest technology along with lower product maintenance cost.',
      fullDescription: 'We can take you through this process with minimal disruptions and add value to your business.',
      bulletPoints: [
        'Modern cloud-native platform re-architecture',
        'Significantly lower maintenance cost and technical debt',
        'Business continuity with zero service disruption',
      ],
      iconType: 'modernization',
    },
    {
      id: 'testing',
      slug: 'testing',
      number: '05',
      title: 'Testing Services',
      shortTitle: 'Testing & QA',
      tagline: 'Comprehensive automated & manual quality assurance',
      summary: 'Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application. We offer end-to-end, professional quality assurance services.',
      fullDescription: 'We undertake robust product functionality, security, and performance testing through a combination of manual and automated processes to ensure a high level of quality assurance.',
      bulletPoints: [
        'Robust product functionality testing',
        'Application security and compliance verification',
        'Performance testing and automated regression suites',
      ],
      iconType: 'testing',
    },
    {
      id: 'analytics',
      slug: 'business-analytics',
      number: '06',
      title: 'Business Reporting and Analytics',
      shortTitle: 'Business Analytics',
      tagline: 'Insight from data islands across the enterprise',
      summary: 'To get ahead in competition, companies equip themselves with ability to gain insight into data and business metrics using technology and statistical modeling tools. We help eliminate dispersed data islands.',
      fullDescription: 'We can help you bring out enterprise wide reporting and analytics capabilities enabling you to analyze current data, build, and validate models.',
      bulletPoints: [
        'Consolidated cross-enterprise reporting',
        'Statistical modeling and metric visualization',
        'Data-driven decision support systems',
      ],
      iconType: 'analytics',
    },
  ] as ServiceDetail[],
  delivery: {
    heading: 'Global Delivery Model',
    subheading: 'Onsite-Offshore Synergy',
    origin: 'United States',
    destination: 'Bengaluru, India',
    coreStatement: 'Every penny and every minute counts and we make them count for you. Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones.',
    methodology: 'We follow the typical software development lifecycle (SDLC) as well as the agile methodology for software development. Our teams situated in offshore and onshore locations support you in your entire product life cycle through development, maintenance, tech support and technical documentation.',
  },
  whyApt: [
    {
      id: 'flexibility',
      title: 'Flexibility',
      shortDescription: 'We provide services through time-tested business engagement models, but are open to customize the engagement model to suit your specific requirements.',
      fullDescription: 'We provide services through time-tested business engagement models, but are open to customize the engagement model to suit your specific requirements. Typical models we support are:',
      models: [
        {
          id: 'time-and-material',
          name: 'Time & Material',
          shortDescription: 'Managed per your depth of scope, skillset requirements, and project timeline.',
          fullDescription: 'We manage T&M projects as per your specific requirements, depth of scope, and degree of coverage. In this model, we ensure that your project gets the right resources with the right education, skillset and relevant project experience. We could also work out a single blend rate, i.e., one agreed upon rate for all resources involved in the project. In such cases we work in close coordination with you to agree upon a decomposition and resource allocation model to help you understand the rationale behind such blending.',
        },
        {
          id: 'fixed-price',
          name: 'Fixed Price',
          shortDescription: 'Pre-planned execution with transparent milestone deliverables.',
          fullDescription: 'As per this model we furnish complete details on how the project will be executed well before project kick-off. As the requirements are clear, periodic deliverables at agreed upon timelines (milestones) are possible in this model. Planning is the key in such projects and any scope creep and scope changes may need to be treated on a case to case basis and additional effort would need to be planned accordingly.',
        },
      ],
    },
    {
      id: 'reliability-and-scalability',
      title: 'Reliability and Scalability',
      shortDescription: "Right technical talent to perform the right job is Apt-e-Soft's promise. Rely on us to provide you the right talent and a critical mass of high skilled technical manpower when needed.",
      fullDescription: "Right technical talent to perform the right job is Apt-e-Soft's promise. Rely on us to provide you the right talent and a critical mass of high skilled technical manpower when needed. Our technology expertise and the industry domain knowledge are the key factors that fulfil your business objectives. We work with you closely to assimilate your business objectives and technology requirements so that we provide you the right solution by leveraging the incredibly large talent pool at our disposal. Our global delivery model is built to address both the depth and scale depending on your specific needs. So choosing Apt-e-soft is the apt thing to do for you.",
    },
    {
      id: 'efficiency',
      title: 'Efficiency',
      shortDescription: 'Every penny counts and we make them count for you. Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones.',
      fullDescription: 'Every penny counts and we make them count for you. Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones. We follow the typical software development lifecycle (SDLC) as well as the agile methodology for software development. Our teams situated in offshore and onshore locations support you in your entire product life cycle through development, maintenance, tech support and technical documentation. Our approach is transparency at all levels, cooperation in partnership, and collaboration in all that we do. Trust is our biggest asset and it is the cornerstone of our business success. We therefore invest considerable amount of our time in getting comprehensive knowledge of your business before beginning work. While we certainly assure you the cost-advantage, we deliver the highest quality through well-established processes and time tested methodologies that contribute to the overall efficiency of our operations.',
    },
  ] as WhyAptPillar[],
  about: {
    eyebrow: 'Know The Reasons Behind Our Success',
    title: 'Driving Efficiency through Globalization',
    paragraphs: [
      'Apt InfoSoft focuses on providing high quality, reliable, world-class software development services for small and mid-sized enterprises (SME) leveraging the power of modern technology like cloud based services, along with the talent and cost-advantage of an off-shore delivery model. This helps companies significantly reduce their product ownership and maintenance costs giving them a competitive edge in the market.',
      'Our Vision is to help small and mid-sized enterprises reap the benefits of modern technology and globalization. We understand that the business dynamics of SMEs are different from large enterprises. Business processes and technology solutions offered for big enterprises rarely suit the needs of SMEs. We at Apt InfoSoft work with you to chalk out a process, budget and timeline to suit the scale of your software development needs and help you achieve your product/application development goals in a cost-competitive manner.',
    ],
    audienceHeading: 'Who can benefit from our engagement?',
    audienceItems: [
      {
        id: 'product-founders',
        letter: 'A',
        title: 'New Product Ventures',
        description: 'If you have a product Idea and are looking to get it into the market we can work with you to convert your ideas into a marketable product.',
        matchedServices: ['Product Engineering', 'Custom Applications'],
      },
      {
        id: 'product-owners',
        letter: 'B',
        title: 'Product Modernization & Scale',
        description: 'If you are a product owner seeking to expand or upgrade your existing software products we can facilitate the migration of legacy systems into modern technology platforms and also take care of your new applications development needs.',
        matchedServices: ['Cloud SaaS', 'Modernization'],
      },
      {
        id: 'sme-enterprises',
        letter: 'C',
        title: 'SME Operational Streamlining',
        description: 'If you are a small or mid-sized enterprise considering technology to streamline business efficiency and improve quality, we help you find and implement off-the-shelf technology solutions or develop a custom solution for you to meet your specific needs and budget.',
        matchedServices: ['Custom Applications', 'Business Analytics'],
      },
      {
        id: 'strategic-roadmaps',
        letter: 'D',
        title: 'Enterprise Architecture & Roadmaps',
        description: "If you need a product roadmap or need us to determine your organization's technology landscape we partner with you to propose the right solutions for you.",
        matchedServices: ['Modernization', 'Business Analytics', 'Testing & QA'],
      },
    ] as AudienceItem[],
  },
  careers: {
    eyebrow: 'Talent & Opportunities',
    title: 'Careers at Apt Infosoft',
    subtitle: 'Transparent role availability and technical staffing opportunities.',
    roles: [
      {
        id: 'software-engineer',
        title: 'Software Engineer',
        department: 'Development',
        status: 'No Openings in Development',
        statusDetail: 'Currently at capacity. Check back for upcoming openings.',
      },
      {
        id: 'software-testing',
        title: 'Software Testing',
        department: 'Quality Assurance',
        status: 'No Openings in Testing',
        statusDetail: 'Currently at capacity. Check back for upcoming openings.',
      },
    ] as CareerRole[],
  },
  contact: {
    eyebrow: 'Direct Inquiries',
    heading: "Let's Build Software Built to Last.",
    subheading: 'Contact our onshore and offshore delivery teams directly for project scoping and consultations.',
    phones: [
      { region: 'United States', number: '(+1) 678-389-2238', href: 'tel:+16783892238' },
      { region: 'India', number: '+91-9902999224', href: 'tel:+919902999224' },
    ],
    emails: [
      { label: 'General Inquiries', email: 'info@aptinfosoft.com' },
      { label: 'Sales & Engagements', email: 'sales@aptinfosoft.com' },
    ],
    address: {
      country: 'INDIA',
      details: '4th Floor Vista Pixel, Vista Spaces, Jakkuru Layout, Bengaluru, Karnataka, INDIA, Pin Code - 560092',
    },
    form: {
      submitLabel: 'Send Message',
      submittingLabel: 'Transmitting Message...',
      successTitle: 'Message Received',
      successMessage: 'Thank you. Our engineering team will review your inquiry and respond promptly.',
    },
  },
  footer: {
    companyName: 'Apt Infosoft',
    copyrightNotice: 'Apt Infosoft. All rights reserved.',
  },
};
