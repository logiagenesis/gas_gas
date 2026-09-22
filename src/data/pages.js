import { site, safetyAdvice } from './site.js';

export const home = {
  title: 'Gas Designs | Gas installation, maintenance and certification',
  metaDescription:
    'Gas Designs installs, services and certifies gas systems for homes, commercial kitchens, industrial premises and property developments in South Africa.',
  h1: 'Gas installation, maintenance and certification in South Africa',
  heroLead:
    'Gas Designs installs, services and certifies gas systems for homes, commercial kitchens, industrial premises and property developments.',
  heroImageAlt:
    'Technician kneeling in a dark fitted kitchen, holding a digital pressure gauge connected to copper gas pipework above the hob.',

  servicesHeading: 'Gas services we install, maintain and certify',
  servicesLead:
    'Each service below covers the work, the testing and the paperwork that goes with it.',

  stepsHeading: 'How an installation runs, from enquiry to handover',
  steps: [
    {
      name: 'Enquiry',
      text: 'Tell us what you need installed, serviced or certified. We ask for the details that affect the price.',
    },
    {
      name: 'Site assessment',
      text: 'We look at the site, measure the run, and check what the appliances need.',
    },
    {
      name: 'Written quote',
      text: 'You receive a written quote that lists the work, the materials and the price.',
    },
    {
      name: 'Installation and testing',
      text: 'We install the system, then pressure test and leak test the completed line.',
    },
    {
      name: 'Handover and certificate',
      text: 'We show you how to isolate the supply, and issue a Certificate of Conformity where it is required.',
    },
  ],

  complianceHeading: 'Every installation is tested before we hand it over',
  complianceBody: [
    'Every installation is pressure tested and leak tested before handover. A Certificate of Conformity is issued where it is required.',
    'We work to the Pressure Equipment Regulations under the Occupational Health and Safety Act, and to the SANS standards that apply to your installation.',
  ],
  complianceImageAlt:
    'Pressure gauge on a gas test point, with a yellow tag recording the test date, the pressure and a pass result.',

  aboutHeading: 'About Gas Designs',
  aboutBody: [
    'Gas Designs is a gas installation company based in South Africa. It installs, services and certifies gas systems for homes, commercial kitchens, industrial premises and property developments.',
    'The company also carries out the basic electrical work that gas appliances need, so one team completes the appliance and tests it.',
  ],
  aboutImageAlt:
    'Technician loading gas cylinders on a trolley into a white bakkie on a suburban street at dusk.',

  faqHeading: 'Questions we are asked most often',
  faqs: [
    {
      q: 'Do you issue a Certificate of Conformity?',
      a: 'Yes. We inspect and test the installation, then issue the certificate once it passes. Anything that must be corrected first is listed in writing.',
    },
    {
      q: 'What should I do if I smell gas?',
      a: 'Close the supply valve at the cylinder or meter. Open the doors and windows. Do not switch anything on or off, and do not use a flame. Leave the area, then call for help.',
    },
    {
      q: 'Do you work on commercial kitchens as well as homes?',
      a: 'Yes. We install and maintain gas systems in homes, commercial kitchens, industrial premises and property developments.',
    },
    {
      q: 'How do I get a price?',
      a: 'Send a quote request through this website. We assess the site, then send a written quote listing the work, the materials and the price.',
    },
    {
      q: 'Is the installation tested before I use it?',
      a: 'Yes. Every installation is pressure tested and leak tested before we hand it over.',
    },
    {
      q: 'Do you do the electrical work for a gas appliance?',
      a: 'We do the basic electrical work that gas appliances need, such as isolators, ignition supply, control wiring and fan connections.',
    },
  ],

  contactHeading: 'Request a quote',
  contactLead:
    'Send the details below and we will come back to you. If it is urgent, call or send a WhatsApp message instead.',
  contactImageAlt:
    'Technician in work gloves handing a folder of completed paperwork to a client across a kitchen counter.',
};

export const thankYou = {
  title: 'Thank you | Gas Designs',
  metaDescription: 'Your quote request has reached Gas Designs. We will reply by email.',
  h1: 'Your quote request has been sent',
  body: [
    'Thank you. Your request has reached us and we will reply by email.',
    `If your enquiry is urgent, call or send a WhatsApp message to ${site.phone.international}, or write to ${site.email}.`,
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
        'The form is delivered to Gas Designs by email through FormSubmit, a third-party form service. We use what you send to answer your enquiry and to prepare a quote.',
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
        'We do not sell your information. We do not share it except to the extent needed to deliver the form and to answer your enquiry.',
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
  h1: 'That page does not exist',
  body: 'The page you asked for is not on this website. It may have been moved, or the address may have a typing error in it.',
  linksHeading: 'Where to go next',
};
