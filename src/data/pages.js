import { site, safetyAdvice } from './site.js';

export const home = {
  title: 'Gas Designs | Gas installers in Pretoria, Johannesburg and Gauteng – 24/7 emergencies',
  metaDescription:
    'Gas installations, CoCs, maintenance and 24/7 leak repairs in Pretoria, Johannesburg and across Gauteng. 15 years in gas and electrical. Every line tested before handover.',
  eyebrow: `Gas installers · ${site.cities.join(' · ')} · ${site.region}`,
  // The phrase in accent colour is marked with square brackets.
  h1: 'Gas, installed properly. [Tested before you light it.]',
  heroLead:
    'From a single gas hob to a bulk LPG tank on a factory site, we plan the run, install it neatly and pressure-test every line. Then we hand you the Certificate of Conformity.',
  heroImageAlt:
    'Technician kneeling in a dark fitted kitchen, holding a digital pressure gauge connected to copper gas pipework above the hob.',
  proof: [
    { icon: 'bolt', title: `${site.experience}’ experience`, text: 'In gas and electrical work' },
    { icon: 'clock', title: `${site.emergency} emergency callouts`, text: 'For gas leaks and gas smells' },
    { icon: 'gauge', title: 'Pressure and leak tested', text: 'On every installation, before handover' },
    { icon: 'doc', title: 'Certificate of Conformity', text: 'Issued once the installation passes' },
  ],

  servicesEyebrow: 'What we do',
  servicesHeading: 'Every gas job, from one hob to a bulk tank',
  servicesLead:
    'Homes, commercial kitchens, factories and new developments. The testing and the paperwork come with every service. They are not extras.',

  safetyEyebrow: 'Gas safety',
  safetyHeading: 'Smell gas? Do this first.',
  safetyLead:
    'Stay calm and work through these five steps. Do not try to find the leak yourself. Once you are outside, call us: we take gas emergencies 24 hours a day.',
  safetyNote:
    'If anyone feels unwell or there is a fire, call emergency services on 112 from a mobile phone.',

  stepsEyebrow: 'How it works',
  stepsHeading: 'From first message to signed-off certificate',
  stepsLead: 'Five steps and no guesswork. You know the price before we start and the result before we leave.',
  steps: [
    {
      name: 'Tell us the job',
      text: 'Call, send a WhatsApp or use the form. The appliance, the property and the suburb are enough to start.',
      tag: 'Phone, WhatsApp or form',
    },
    {
      name: 'Site assessment',
      text: 'We measure the run and check what each appliance needs, so the quote is based on your site and not on a guess.',
      tag: 'Measured on site',
    },
    {
      name: 'Written quote',
      text: 'The work, the materials and the price, itemised in writing. You approve it before anything is fitted.',
      tag: 'Itemised price',
    },
    {
      name: 'Install and test',
      text: 'Neat, supported pipework, then a pressure test and a leak test on the finished line.',
      tag: 'Pressure and leak test',
    },
    {
      name: 'Handover',
      text: 'We show you how to shut off the supply and issue the Certificate of Conformity where it is required.',
      tag: 'CoC issued',
    },
  ],
  stepsCta: 'Ready for step one?',

  complianceEyebrow: 'Safety and compliance',
  complianceHeading: 'Nothing is handed over until it passes',
  complianceBody: [
    'Every installation is pressure-tested and leak-tested before we hand it over. Where a Certificate of Conformity is required, you get one.',
    'We work to SANS 10087 and to the Pressure Equipment Regulations under the Occupational Health and Safety Act. Your insurer, your bank and your conveyancer will ask about both.',
  ],
  complianceImageAlt:
    'Pressure gauge on a gas test point, with a yellow tag recording the test date, the pressure and a pass result.',
  testTag: {
    title: 'Before handover',
    rows: [
      ['Pressure test', 'Every job'],
      ['Leak test', 'Every job'],
      ['Written record', 'Every job'],
      ['CoC', 'Where required'],
    ],
  },

  aboutEyebrow: 'About Gas Designs',
  aboutHeading: 'Gas specialists who finish the job',
  aboutBody: [
    'Gas Designs is a registered company that installs, services and certifies gas systems for homes, commercial kitchens, industrial sites and property developments. We work in Pretoria, Johannesburg and the rest of Gauteng, including outlying areas.',
    'Behind it is 15 years of hands-on experience in gas and electrical work. That is why we also do the basic electrical side of gas appliances, including isolators, ignition supply and fans. You deal with one team and get one handover.',
  ],
  aboutPoints: [
    { icon: 'bolt', text: `${site.experience} in gas and electrical` },
    { icon: 'clock', text: '24/7 for gas leaks and emergencies' },
    { icon: 'gauge', text: 'Every line tested before you use it' },
    { icon: 'list', text: 'Written quotes, written reports, written fixes' },
  ],
  aboutImageAlt:
    'Technician loading gas cylinders on a trolley into a white bakkie on a suburban street at dusk.',

  faqEyebrow: 'Questions',
  faqHeading: 'Straight answers',
  faqLead: 'Here are the questions we hear most. If yours is not here, send it on WhatsApp.',
  faqs: [
    {
      q: 'Do you issue gas Certificates of Conformity (CoCs)?',
      a: 'Yes. We inspect and test the installation and issue the certificate once it passes. If anything must be corrected first, you get it in writing and decide whether we fix it.',
    },
    {
      q: 'Do you handle gas emergencies after hours?',
      a: `Yes. We take gas emergency calls 24 hours a day, 7 days a week. Call ${site.phone.display} once you are safely outside.`,
    },
    {
      q: 'Which areas do you cover?',
      a: 'Pretoria, Johannesburg and the rest of Gauteng, including outlying areas. If you are not sure whether we reach you, send your suburb on WhatsApp.',
    },
    {
      q: 'What should I do if I smell gas?',
      a: 'Close the supply valve at the cylinder or meter. Open the doors and windows. Do not switch anything on or off, and do not use a flame. Leave the area, then call for help.',
    },
    {
      q: 'Do you work on commercial kitchens and industrial sites as well as homes?',
      a: 'Yes. We work in homes, restaurant and hotel kitchens, factories, bulk LPG sites and new developments. Commercial work can be staged around your trading hours.',
    },
    {
      q: 'How do I get a price?',
      a: 'Call, send a WhatsApp or use the quote form. We assess the site, then send a written quote that itemises the work, the materials and the price.',
    },
    {
      q: 'Is everything tested before I use it?',
      a: 'Yes. Every installation is pressure-tested and leak-tested before we hand it over.',
    },
    {
      q: 'Can you do the electrical side of a gas appliance?',
      a: 'Yes, the basic electrical work that gas appliances need: isolators, ignition supply, control wiring and fan connections. One team, one handover.',
    },
    {
      q: 'When should I move from cylinders to a bulk LPG tank?',
      a: 'When swapping cylinders has become a routine job, or your appliances need more gas than cylinders can supply. We look at your usage and the site, then lay out the tank, plinth and manifold with safe separation distances.',
    },
  ],

  contactEyebrow: 'Get a quote',
  contactHeading: 'Tell us about the job',
  contactLead: `Send a few details and we will come back to you. In a hurry? Call or WhatsApp ${site.phone.display}.`,
  contactAsideHeading: 'Rather talk to someone?',
  contactAsideText: 'Call or send a WhatsApp message with a photo of the appliance or the meter. It often saves a trip.',
  contactImageAlt:
    'Technician in work gloves handing a folder of completed paperwork to a client across a kitchen counter.',
};

// Shown near the foot of every service page.
export const serviceCta = {
  eyebrow: 'Next step',
  heading: 'Get a written quote for your job',
  text: 'Send the details, a photo helps, and we will come back with the next step. You approve the quote before any work starts.',
};

export const thankYou = {
  title: 'Thank you | Gas Designs',
  metaDescription: 'Your quote request has reached Gas Designs. We will phone, WhatsApp or email you.',
  h1: 'Thank you. Your request is with us.',
  body: [
    'We will read it and come back to you by phone, WhatsApp or email.',
    `If it is urgent, call or WhatsApp ${site.phone.international}, or write to ${site.email}.`,
  ],
  safetyNote: safetyAdvice.short,
};

export const privacy = {
  title: 'Privacy policy | Gas Designs',
  metaDescription:
    'How Gas Designs handles the information you send through the quote form on this website, and the analytics this website loads.',
  h1: 'Privacy policy',
  sections: [
    {
      heading: 'What this policy covers',
      body: [
        'This policy covers the quote form on this website and the analytics this website loads. It covers nothing else.',
      ],
    },
    {
      heading: 'Information you send through the quote form',
      body: [
        'The quote form asks for your name, phone number, email address, suburb, property type, the service you need and your message. You choose what to enter.',
        'The form is delivered to Gas Designs by email through Formspree, a third-party form service. We use what you send to answer your enquiry and to prepare a quote.',
        `Write to ${site.email} if you want your enquiry and its details deleted.`,
      ],
    },
    {
      heading: 'Analytics',
      body: [
        'This website loads Google Analytics, which records how pages are used. You can block it in your browser.',
      ],
    },
    {
      heading: 'Sharing',
      body: [
        'We do not sell your information. We share it only as far as needed to deliver the form and to answer your enquiry.',
      ],
    },
    {
      heading: 'Contact',
      body: [`Write to ${site.email} with any question about this policy.`],
    },
  ],
};

export const notFound = {
  title: 'Page not found | Gas Designs',
  metaDescription: 'That page does not exist on the Gas Designs website.',
  h1: 'This page doesn’t exist',
  body: 'It may have moved, or the address may have a typing error in it. These links will get you back on track.',
  linksHeading: 'Where to go next',
};
