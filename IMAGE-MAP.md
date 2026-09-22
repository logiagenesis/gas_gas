# Image map

Every photograph in `public/assets/img/` was opened and assigned to the slot whose
subject it actually shows. The filenames in the supplied set do not follow the order
of the services, so several photographs fill a different slot from the one their name
suggests. Those cases are noted in the table.

Source files stay in `public/assets/img/` and are never copied into `dist/`. The build
resizes each one and writes a WebP with a JPG fallback into `dist/assets/img/`. Every
output file is under 300 KB.

| Source file | Slot | What the photograph shows | Source size | Output files |
| --- | --- | --- | --- | --- |
| `hero.jpg` | Home hero | Technician kneeling in a dark fitted kitchen with a digital pressure gauge on the gas line above the hob | 1920x1080 | hero-1920.webp (98 KB)<br>hero-1920.jpg (171 KB) |
| `service-01.jpg` | Residential Gas Installations | Gloved hand closing a yellow-handled isolation valve on the gas connection beneath a domestic hob. | 1200x900 | service-01-1200.webp (47 KB)<br>service-01-1200.jpg (79 KB) |
| `service-04.jpg` | Commercial Kitchen Gas Systems | Stainless steel gas manifold with labelled isolation valves and braided hoses feeding a commercial range under an extraction canopy.<br>**Note:** Filename suggested service 4. The photograph shows a commercial kitchen, so it fills service 2. | 1200x900 | service-04-1200.webp (63 KB)<br>service-04-1200.jpg (103 KB) |
| `service-06.jpg` | Industrial Gas Installations & Maintenance | Copper and steel gas reticulation on a dark brick wall, marked with yellow LPG and gas labels, feeding a regulator and cylinder.<br>**Note:** Filename suggested service 6. The photograph shows marked back-of-house reticulation, so it fills service 3. | 1200x900 | service-06-1200.webp (94 KB)<br>service-06-1200.jpg (127 KB) |
| `service-05.jpg` | Bulk LPG Installations | Technician working on the valve manifold of a horizontal bulk LPG storage tank on a concrete plinth behind palisade fencing.<br>**Note:** Filename suggested service 5. The photograph shows a bulk LPG tank, so it fills service 4. | 1200x900 | service-05-1200.webp (127 KB)<br>service-05-1200.jpg (166 KB) |
| `service-09.jpg` | Custom Projects & Developments | Row of locked steel gas cylinder cages with yellow safety signage beside marked reticulation pipework at a residential development.<br>**Note:** Filename suggested service 9. The photograph shows cylinder enclosures at a development, so it fills service 5. | 1200x900 | service-09-1200.webp (75 KB)<br>service-09-1200.jpg (122 KB) |
| `service-08.jpg` | Certificate of Conformity | A Certificate of Conformity on a clipboard beside a pressure gauge, valve and tools, with a technician working on a gas manifold behind.<br>**Note:** Filename suggested service 8. The photograph shows a Certificate of Conformity, so it fills service 6. | 1200x900 | service-08-1200.webp (58 KB)<br>service-08-1200.jpg (101 KB) |
| `service-02.jpg` | Gas System Maintenance | Wall-mounted gas water heater outside a home, with copper pipework and yellow tagged isolation valves marked gas inlet and hot water out.<br>**Note:** Filename suggested service 2. The photograph shows an installed gas water heater, so it fills service 7. | 1200x900 | service-02-1200.webp (79 KB)<br>service-02-1200.jpg (114 KB) |
| `service-07.jpg` | Gas Leak Detection & Emergency Repairs | Gloved hands holding an electronic gas leak detector against a copper pipe joint fitted with a yellow tag.<br>**Note:** Filename suggested service 7. The photograph shows electronic leak detection, so it fills service 8. | 1200x900 | service-07-1200.webp (44 KB)<br>service-07-1200.jpg (78 KB) |
| `service-03.jpg` | Basic Electrical & Gas System Support | Lit gas fireplace set into a dark plastered wall in a living room, with a timber shelf above it.<br>**Note:** Filename suggested service 3. The photograph shows a gas fireplace. CLOSEST AVAILABLE MATCH ONLY: no photograph in the supplied set shows electrical work. A photograph of an appliance isolator or control wiring would fit this service properly. | 1200x900 | service-03-1200.webp (50 KB)<br>service-03-1200.jpg (78 KB) |
| `compliance.jpg` | Compliance section | Pressure gauge on a gas test point with a yellow tag recording date, pressure and a pass result | 1600x1000 | compliance-1200.webp (48 KB)<br>compliance-1200.jpg (76 KB) |
| `about.jpg` | About section | Technician loading gas cylinders into a bakkie on a suburban street at dusk | 1600x1000 | about-1200.webp (149 KB)<br>about-1200.jpg (172 KB) |
| `contact.jpg` | Contact section | Technician handing completed paperwork to a client across a kitchen counter | 1600x1000 | contact-1200.webp (67 KB)<br>contact-1200.jpg (84 KB) |

## Reused photographs

- None. Each of the 13 slots is filled by a different photograph.

## Unused or rejected files

- None. Every photograph in `public/assets/img/` is used.

## Open point for the client

The photograph filling **Basic Electrical & Gas System Support** shows a gas fireplace.
It is the closest match in the supplied set, but nothing in the set shows electrical
work. A photograph of an appliance isolator, control wiring or a fan connection would
replace it properly. Drop the new file into `public/assets/img/`, point the `image`
field for that service in `src/data/site.js` at it, and rebuild.
