// Single source of truth for every fact and every word on the site.
// Only facts the client has supplied appear here. Nothing is invented: no
// registration numbers, no response times, no prices, no reviews.
// See qa/AUDIT.md for the facts still waiting on the client.

export const site = {
  name: 'Gas Designs',
  email: 'pierre@gasdesigns.co.za',
  phone: {
    display: '061 039 7034',
    international: '+27 61 039 7034',
    tel: '+27610397034',
    whatsapp: 'https://wa.me/27610397034',
  },
  domain: 'gasdesigns.co.za',
  canonicalOrigin: 'https://gasdesigns.co.za',
  country: 'South Africa',
  // The area the copy and the schema name. Change it here and rebuild.
  region: 'Gauteng',
  cities: ['Pretoria', 'Johannesburg'],
  areasLine: 'Pretoria, Johannesburg and the rest of Gauteng, including outlying areas',
  // Supplied by the client as "10, 15 years": the lower figure is used.
  experience: '10+ years',
  emergency: '24/7',
  agency: { name: 'Logi-Ink', url: 'https://logi-ink.co.za' },
  ga4Id: 'G-JDXDHXGZ5Q',
  description:
    'Gas Designs installs, services and certifies LPG gas systems for homes, commercial kitchens, industrial sites and developments in Pretoria, Johannesburg and across Gauteng. 10+ years in gas and electrical, and 24/7 for gas emergencies.',
  footerLine:
    'Gas installation, maintenance and Certificates of Conformity in Pretoria, Johannesburg and across Gauteng, including outlying areas. 24/7 for gas emergencies.',
};

export const safetyAdvice = {
  heading: 'What to do if you smell gas',
  steps: [
    'Close the supply valve at the cylinder or meter.',
    'Open the doors and windows.',
    'Do not switch anything on or off, and do not use a flame, a match or a lighter.',
    'Leave the area.',
    'Call for help once you are outside.',
  ],
  // Short forms for the safety band on the home page.
  stepsShort: [
    'Close the valve at the cylinder or meter',
    'Open doors and windows',
    'Switch nothing on or off. No flames',
    'Get everyone out',
    'Call for help from outside',
  ],
  short:
    'If you smell gas, close the supply valve, open doors and windows, do not switch anything on or off, leave the area and call for help.',
};

export const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Development'];

export const services = [
  {
    slug: 'residential-gas-installations',
    name: 'Residential Gas Installations',
    image: 'service-01',
    alt: 'Gloved hand closing a yellow-handled isolation valve on the gas connection beneath a domestic hob.',
    metaTitle: 'Residential Gas Installations in Pretoria and Johannesburg',
    metaDescription:
      'Gas hobs, ovens, geysers and fireplaces installed in Gauteng homes, with every line pressure-tested and leak-tested and a Certificate of Conformity where required.',
    card:
      'Gas hobs, ovens, geysers and fireplaces, connected neatly and tested before you light them. CoC issued where required.',
    intro:
      'A gas hob keeps cooking when the power goes off, and a gas geyser or fireplace takes load off the electricity. We run the line from the cylinder, bulk tank or meter to each appliance, keep the pipework neat and clipped, and test everything before you use it.',
    included: [
      'Connection to a cylinder, bulk tank or meter',
      'Regulator, isolation valves and clearly labelled pipework',
      'Copper or approved steel pipework, neatly clipped and supported',
      'Connection and commissioning of each appliance',
      'Pressure test and leak test on the finished line',
      'Certificate of Conformity where it is required',
    ],
    forWho:
      'Homeowners adding a gas hob, geyser or fireplace. Landlords getting a property ready to let. Sellers who need a gas CoC before transfer.',
    related: ['gas-system-maintenance', 'certificate-of-conformity'],
  },
  {
    slug: 'commercial-kitchen-gas-systems',
    name: 'Commercial Kitchen Gas Systems',
    image: 'service-04',
    alt: 'Stainless steel gas manifold with labelled isolation valves and braided hoses feeding a commercial range under an extraction canopy.',
    metaTitle: 'Commercial Kitchen Gas Installations in Gauteng',
    metaDescription:
      'Gas reticulation for restaurant, hotel and canteen kitchens in Gauteng: sized for the full appliance load, installed around trading hours, tested and certified.',
    card:
      'Manifolds, shut-offs and reticulation sized for a full service, and installed around your trading hours.',
    intro:
      'A kitchen that goes down mid-service loses money by the minute. We size the pipework for every appliance running at once, fit a manifold with its own isolation valve per appliance and an emergency shut-off at the door, and stage the work around your trading hours.',
    included: [
      'Load assessment for every appliance you run',
      'Manifold with a labelled isolation valve per appliance',
      'Flexible connections rated for commercial appliances',
      'Emergency shut-off point at the kitchen entrance',
      'Pressure test, leak test and commissioning',
      'Certificate of Conformity on completion',
    ],
    forWho:
      'Restaurant, hotel and canteen owners. Caterers and franchise operators. Facilities managers planning a kitchen refit.',
    related: ['industrial-gas-installations-maintenance', 'certificate-of-conformity'],
  },
  {
    slug: 'industrial-gas-installations-maintenance',
    name: 'Industrial Gas Installations & Maintenance',
    image: 'service-06',
    alt: 'Copper and steel gas reticulation on a dark brick wall, marked with yellow LPG and gas labels, feeding a regulator and cylinder.',
    metaTitle: 'Industrial Gas Installations and Maintenance in Gauteng',
    metaDescription:
      'Gas reticulation for Gauteng factories, workshops and process plant, installed, marked and recorded, then kept in service with scheduled inspections and leak testing.',
    card:
      'Reticulation for factories, workshops and process plant: installed, marked, recorded and kept compliant.',
    intro:
      'On a gas-fired line, the downtime costs more than the repair. We install reticulation from the bulk supply to each point of use, mark it and protect it where vehicles and plant pass, and record it for your files. Scheduled inspections and leak testing then keep it running.',
    included: [
      'Reticulation from the bulk supply to each point of use',
      'Regulators, isolation valves and marked pipework',
      'Supports and protection where vehicles or plant pass',
      'Scheduled maintenance visits and leak testing',
      'Written fault reports listing the parts needed',
      'Certificate of Conformity where it is required',
    ],
    forWho:
      'Factory and plant managers. Maintenance teams. Property managers responsible for industrial premises.',
    related: ['bulk-lpg-installations', 'gas-system-maintenance'],
  },
  {
    slug: 'bulk-lpg-installations',
    name: 'Bulk LPG Installations',
    image: 'service-05',
    alt: 'Technician working on the valve manifold of a horizontal bulk LPG storage tank on a concrete plinth behind palisade fencing.',
    metaTitle: 'Bulk LPG Tank Installations in Gauteng',
    metaDescription:
      'Bulk LPG storage for Gauteng sites that have outgrown cylinders: layout, plinth, tank, valve manifold and site reticulation, tested and commissioned.',
    card:
      'When cylinders can’t keep up: tank, plinth, valve manifold and site reticulation, laid out for safe access.',
    intro:
      'If swapping cylinders has become part of the weekly routine, it is time for bulk. We plan the layout and the separation distances first, then prepare the plinth, set the tank, build the valve manifold and run the line to every building on site.',
    included: [
      'Site layout, with separation distances planned before work starts',
      'Concrete plinth and tank placement',
      'Valve manifold, regulators and first-stage pipework',
      'Reticulation to each building or point of use',
      'Protective fencing or barriers where they are needed',
      'Pressure test, leak test and commissioning',
    ],
    forWho:
      'Sites with a steady gas demand: factories, farms, lodges, schools and residential estates.',
    related: ['industrial-gas-installations-maintenance', 'custom-projects-developments'],
  },
  {
    slug: 'custom-projects-developments',
    name: 'Custom Projects & Developments',
    image: 'service-09',
    alt: 'Row of locked steel gas cylinder cages with yellow safety signage beside marked reticulation pipework at a residential development.',
    metaTitle: 'Gas Installations for Developments in Gauteng',
    metaDescription:
      'Gas for Gauteng townhouse schemes, apartment blocks and mixed-use developments: priced from drawings, installed to the site programme, certified unit by unit.',
    card:
      'Townhouse schemes, apartment blocks and mixed-use sites, priced from drawings and installed to the main contractor’s programme.',
    intro:
      'Gas is easiest to get right before the walls close. We price from the architect’s or services drawings, plan the cylinder enclosures or bulk storage for the scheme, and install to the site programme. Every unit is tested and certified, and the as-built information is handed over with the keys.',
    included: [
      'Pricing and planning from architectural or services drawings',
      'Cylinder enclosures or bulk storage for the scheme',
      'Reticulation to each unit, separately isolated',
      'Installation staged to follow the site programme',
      'Testing and certification unit by unit',
      'As-built information for the owner or body corporate',
    ],
    forWho:
      'Developers and main contractors. Architects and project managers. Body corporates extending an existing scheme.',
    related: ['bulk-lpg-installations', 'certificate-of-conformity'],
  },
  {
    slug: 'certificate-of-conformity',
    name: 'Certificate of Conformity',
    image: 'service-08',
    alt: 'A Certificate of Conformity on a clipboard beside a pressure gauge, valve and tools, with a technician working on a gas manifold behind.',
    metaTitle: 'Gas Certificate of Conformity (CoC) in Pretoria and Johannesburg',
    metaDescription:
      'Gas CoC inspections in Gauteng for property transfers, rentals and insurance. The installation is inspected and tested, fixes are listed in writing, and the certificate is issued once it passes.',
    card:
      'Selling, letting or insuring? We inspect, test and certify, and list any fixes in writing first.',
    intro:
      'Estate agents, conveyancers, banks and insurers all ask for a gas Certificate of Conformity. We inspect the installation, pressure-test and leak-test it, and list in writing anything that must be corrected. Once it passes, you get the certificate by email, ready to forward.',
    included: [
      'Inspection of pipework, valves, regulators and appliances',
      'Pressure test and leak test on the installation',
      'A written list of anything that must be corrected',
      'Repairs or replacement, only if you ask us to go ahead',
      'The Certificate of Conformity once the installation passes',
      'A copy by email for you, your agent or your conveyancer',
    ],
    forWho:
      'Sellers and buyers in a property transfer, and the estate agents and conveyancers acting for them. Landlords. Owners whose insurer wants proof the installation is safe.',
    related: ['gas-system-maintenance', 'residential-gas-installations'],
  },
  {
    slug: 'gas-system-maintenance',
    name: 'Gas System Maintenance',
    image: 'service-02',
    alt: 'Wall-mounted gas water heater outside a home, with copper pipework and yellow tagged isolation valves marked gas inlet and hot water out.',
    metaTitle: 'Gas System Maintenance and Servicing in Pretoria and Johannesburg',
    metaDescription:
      'Gas servicing in Gauteng: appliance, valve and regulator checks, a full leak test and a written report of every fault found, for homes and businesses.',
    card:
      'Appliance, valve and regulator checks plus a full leak test, with a written report so you know where you stand.',
    intro:
      'Hoses perish, seals harden and regulators drift out of setting. We inspect every appliance, valve, regulator and connector, test the whole line for leaks, and give you a written report of what we found and what it needs. You decide what gets repaired.',
    included: [
      'Appliance inspection and burner check',
      'Valve, regulator and connector inspection',
      'Leak test across the whole installation',
      'Replacement of perished hoses and seals',
      'A written report listing the faults and the parts',
      'Certificate of Conformity where it is required',
    ],
    forWho:
      'Homeowners and landlords with gas already installed. Restaurant operators and facilities managers keeping a system in service.',
    related: ['gas-leak-detection-emergency-repairs', 'certificate-of-conformity'],
  },
  {
    slug: 'gas-leak-detection-emergency-repairs',
    name: 'Gas Leak Detection & Emergency Repairs',
    image: 'service-07',
    alt: 'Gloved hands holding an electronic gas leak detector against a copper pipe joint fitted with a yellow tag.',
    metaTitle: '24/7 Gas Leak Detection and Emergency Repairs in Pretoria and Johannesburg',
    metaDescription:
      '24/7 gas leak callouts in Pretoria, Johannesburg and across Gauteng. The leak is traced electronically, the failed section isolated and repaired, and the line retested before the gas goes back on.',
    card:
      'Available 24/7. We trace the leak electronically, repair the failed section and retest before the gas goes back on.',
    intro:
      'A gas smell is never a case of wait and see, which is why we take emergency calls 24 hours a day. We trace the source with electronic detection equipment, isolate the affected section and repair or replace what failed. The line is then pressure-tested and leak-tested before the gas goes back on.',
    included: [
      'Electronic leak detection across the installation',
      'Isolation of the affected section',
      'Repair or replacement of failed pipework, valves and connectors',
      'Pressure test and leak test after the repair',
      'A written record of the fault and the repair',
    ],
    forWho:
      'Anyone who can smell gas, at any hour. Owners whose installation has failed a test. Operators who need a line back in service.',
    related: ['gas-system-maintenance', 'certificate-of-conformity'],
    safety: true,
  },
  {
    slug: 'basic-electrical-gas-system-support',
    name: 'Basic Electrical & Gas System Support',
    image: 'service-03',
    alt: 'Lit gas fireplace set into a dark plastered wall in a living room, with a timber shelf above it.',
    metaTitle: 'Electrical Connections for Gas Appliances in Gauteng',
    metaDescription:
      'The basic electrical work gas appliances need, including isolators, ignition supply, control wiring and fan connections, done by the team that installs the gas.',
    card:
      'Isolators, ignition supply and fan connections for gas appliances, so one team finishes the job instead of two.',
    intro:
      'Plenty of gas appliances need power too: ignition, controls, extraction fans and flue units. We do the basic electrical work that goes with the gas installation, so you are not left waiting on a second contractor to finish the job.',
    included: [
      'Isolator and socket positions for gas appliances',
      'Supply to ignition units and appliance controls',
      'Flue fan and extraction connections',
      'Fault finding when an appliance will not start',
      'Testing of the appliance once it is connected',
    ],
    forWho:
      'Homeowners and businesses fitting an appliance that needs both gas and power.',
    related: ['residential-gas-installations', 'gas-system-maintenance'],
  },
];
