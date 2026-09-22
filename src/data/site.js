// Single source of truth for every fact and every word on the site.
// Only the facts listed in the brief appear here. Nothing is invented.

export const site = {
  name: 'Gas Designs',
  email: 'pierre@gasdesigns.co.za',
  domain: 'gasdesigns.co.za',
  canonicalOrigin: 'https://gasdesigns.co.za',
  country: 'South Africa',
  agency: { name: 'Logi-Ink', url: 'https://logi-ink.co.za' },
  gtmId: 'GTM-XXXXXXX',
  description:
    'Gas Designs installs, services and certifies gas systems for homes, commercial kitchens, industrial premises and property developments in South Africa.',
  footerLine: 'Gas installation, maintenance and certification in South Africa.',
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
    metaTitle: 'Residential Gas Installations',
    metaDescription:
      'Gas Designs installs gas hobs, ovens, water heaters and fireplaces in South African homes, then pressure tests and leak tests the line before handover.',
    card:
      'We install gas hobs, ovens, water heaters and fireplaces in homes. Every line is pressure tested and leak tested before you use it.',
    intro:
      'Gas Designs installs gas in houses, flats and townhouses. We run the supply from the cylinder, bulk tank or meter to each appliance, then test the line and commission the appliance.',
    included: [
      'Connection to a cylinder, bulk tank or meter',
      'Regulator, isolation valves and labelled pipework',
      'Copper or approved steel pipework, clipped and supported',
      'Appliance connection and commissioning',
      'Pressure test and leak test on the finished line',
      'Certificate of Conformity where it is required',
    ],
    forWho:
      'Homeowners fitting a gas hob, water heater or fireplace. Landlords preparing a property to let. Sellers who need a certificate before transfer.',
    related: ['gas-system-maintenance', 'certificate-of-conformity'],
  },
  {
    slug: 'commercial-kitchen-gas-systems',
    name: 'Commercial Kitchen Gas Systems',
    image: 'service-04',
    alt: 'Stainless steel gas manifold with labelled isolation valves and braided hoses feeding a commercial range under an extraction canopy.',
    metaTitle: 'Commercial Kitchen Gas Systems',
    metaDescription:
      'Gas Designs installs and upgrades gas reticulation for restaurant, hotel and canteen kitchens, from the manifold to each appliance, tested and certified.',
    card:
      'We install gas reticulation for restaurant, hotel and canteen kitchens, from the manifold to each appliance. Work can be staged around your service hours.',
    intro:
      'Gas Designs installs and upgrades gas systems in commercial kitchens. We size the pipework for the full appliance load, fit a manifold with isolation valves, and connect each appliance.',
    included: [
      'Assessment of the load for the appliances you run',
      'Manifold with a labelled isolation valve per appliance',
      'Flexible connections rated for commercial appliances',
      'An emergency shut-off point at the kitchen entrance',
      'Pressure test, leak test and commissioning',
      'Certificate of Conformity on completion',
    ],
    forWho:
      'Restaurant and hotel owners. Canteen and catering operators. Facilities managers running a kitchen refit.',
    related: ['industrial-gas-installations-maintenance', 'certificate-of-conformity'],
  },
  {
    slug: 'industrial-gas-installations-maintenance',
    name: 'Industrial Gas Installations & Maintenance',
    image: 'service-06',
    alt: 'Copper and steel gas reticulation on a dark brick wall, marked with yellow LPG and gas labels, feeding a regulator and cylinder.',
    metaTitle: 'Industrial Gas Installations and Maintenance',
    metaDescription:
      'Gas Designs installs gas reticulation for factories, workshops and process plant in South Africa, and maintains it with scheduled inspections and leak testing.',
    card:
      'We install and maintain gas reticulation in factories, workshops and process plant. Scheduled maintenance keeps the system available and compliant.',
    intro:
      'Gas Designs installs gas reticulation for industrial sites and keeps it running afterwards. We route and mark the line, fit regulators and isolation points, and record the installation for your files.',
    included: [
      'Reticulation from the bulk supply to each point of use',
      'Regulators, isolation valves and marked pipework',
      'Pipe supports and protection where vehicles or plant pass',
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
    metaTitle: 'Bulk LPG Installations',
    metaDescription:
      'Gas Designs installs bulk LPG storage tanks, plinths, valve manifolds and site reticulation, set out for safe access and separation distances.',
    card:
      'We install bulk LPG tanks and the pipework that feeds your site, including the plinth and valve manifold. The layout is set out for safe access.',
    intro:
      'Gas Designs installs bulk LPG storage for sites that use more gas than cylinders can supply. We prepare the base, set the tank, build the valve manifold and run the line to your buildings.',
    included: [
      'Site layout, with separation distances planned before work starts',
      'Concrete plinth and tank placement',
      'Valve manifold, regulators and first-stage pipework',
      'Reticulation to each building or point of use',
      'Protective fencing or barriers where they are needed',
      'Pressure test, leak test and commissioning',
    ],
    forWho:
      'Sites with a continuous gas demand, including factories, farms, lodges, schools and estates.',
    related: ['industrial-gas-installations-maintenance', 'custom-projects-developments'],
  },
  {
    slug: 'custom-projects-developments',
    name: 'Custom Projects & Developments',
    image: 'service-09',
    alt: 'Row of locked steel gas cylinder cages with yellow safety signage beside marked reticulation pipework at a residential development.',
    metaTitle: 'Custom Gas Projects and Developments',
    metaDescription:
      'Gas Designs handles gas for townhouse schemes, apartment blocks and mixed-use developments, priced from drawings and installed to the site programme.',
    card:
      'We handle gas for townhouse schemes, apartment blocks and mixed-use developments. We work to the programme agreed with the main contractor.',
    intro:
      'Gas Designs takes on installations that do not fit a standard layout. That includes multi-unit developments, staged handovers, and systems designed around an architect&rsquo;s drawings.',
    included: [
      'Pricing and planning from architectural or services drawings',
      'Cylinder enclosures or bulk storage for the scheme',
      'Reticulation to each unit, separately isolated',
      'Installation staged to follow the site programme',
      'Testing and certification unit by unit',
      'As-built information handed to the owner or body corporate',
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
    metaTitle: 'Certificate of Conformity for Gas Installations',
    metaDescription:
      'Gas Designs inspects and tests an existing gas installation and issues a Certificate of Conformity once it passes, with any corrections listed in writing.',
    card:
      'We inspect and test an existing installation and issue a Certificate of Conformity when it passes. Banks, insurers and conveyancers usually ask for this document.',
    intro:
      'A Certificate of Conformity records that a gas installation was inspected and tested, and that it met the requirements that apply to it. Gas Designs inspects the installation, tests the line, and lists anything that must be corrected first.',
    included: [
      'Inspection of pipework, valves, regulators and appliances',
      'Pressure test and leak test on the installation',
      'A written list of anything that must be corrected',
      'Repairs or replacement where you ask us to proceed',
      'The Certificate of Conformity once the installation passes',
      'A copy sent to you by email for your records',
    ],
    forWho:
      'Sellers and buyers in a property transfer. Landlords. Owners who need the certificate for insurance cover.',
    related: ['gas-system-maintenance', 'residential-gas-installations'],
  },
  {
    slug: 'gas-system-maintenance',
    name: 'Gas System Maintenance',
    image: 'service-02',
    alt: 'Wall-mounted gas water heater outside a home, with copper pipework and yellow tagged isolation valves marked gas inlet and hot water out.',
    metaTitle: 'Gas System Maintenance',
    metaDescription:
      'Gas Designs services installed gas systems: appliance checks, valve and regulator inspection, leak testing, and a written report of every fault found.',
    card:
      'We service installed gas systems: appliance checks, valve and regulator inspection, and leak testing on the line. You get a written report of what we found.',
    intro:
      'Gas systems need checking as they age. Gas Designs inspects the appliances, valves, regulators and pipework, tests the line for leaks, and reports what we found. You decide what to repair.',
    included: [
      'Appliance inspection and burner check',
      'Valve, regulator and connector inspection',
      'Leak test across the installation',
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
    metaTitle: 'Gas Leak Detection and Emergency Repairs',
    metaDescription:
      'Gas Designs traces gas leaks with electronic detection equipment, isolates and repairs the failed section, and retests the line before the gas goes back on.',
    card:
      'We trace gas leaks with electronic detection equipment and repair the section that fails. The line is retested before the gas goes back on.',
    intro:
      'A gas smell needs acting on straight away. Gas Designs traces the source with electronic detection equipment, isolates the affected section, and repairs or replaces it.',
    included: [
      'Electronic leak detection across the installation',
      'Isolation of the affected section',
      'Repair or replacement of failed pipework, valves and connectors',
      'Pressure test and leak test after the repair',
      'A written record of the fault and the repair',
    ],
    forWho:
      'Anyone who can smell gas. Owners whose installation has failed a test. Operators who need a line back in service.',
    related: ['gas-system-maintenance', 'certificate-of-conformity'],
    safety: true,
  },
  {
    slug: 'basic-electrical-gas-system-support',
    name: 'Basic Electrical & Gas System Support',
    image: 'service-03',
    alt: 'Lit gas fireplace set into a dark plastered wall in a living room, with a timber shelf above it.',
    metaTitle: 'Basic Electrical and Gas System Support',
    metaDescription:
      'Gas Designs carries out the basic electrical work that gas appliances need, including isolators, ignition supply, control wiring and fan connections.',
    card:
      'We handle the basic electrical work that gas appliances need, such as isolators, ignition supply and fan connections. One team then finishes the appliance.',
    intro:
      'Some gas appliances need an electrical supply to run: ignition, controls, fans and flue units. Gas Designs does the basic electrical work that goes with the gas installation.',
    included: [
      'Isolator and socket positions for gas appliances',
      'Supply to ignition units and appliance controls',
      'Flue fan and extraction connections',
      'Fault finding where an appliance fails to start',
      'Testing of the appliance once it is connected',
    ],
    forWho:
      'Homeowners and businesses fitting an appliance that needs both gas and power.',
    related: ['residential-gas-installations', 'gas-system-maintenance'],
  },
];
