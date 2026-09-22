import { ServiceCardItem, HubOffice, TestimonialItem } from '../types.ts';

export const CLINICAL_SERVICES: ServiceCardItem[] = [
  {
    id: 'nursing-staff',
    title: 'Male & Female Nursing Staff',
    tag: 'Registered Nurses',
    tagType: 'GNM / B.Sc Certified',
    description: 'Professional registered nurses for vital monitoring, IV cannula/infusions, catheter insertion, Ryle\'s tube feeding, insulin administration, and post-surgical recovery.',
    metaLabel: 'Available in',
    metaValue: '12h & 24h Shifts',
    btnText: 'Book Nurse',
    image: 'https://carehealthnursing.com/images/gallery/016.jpg'
  },
  {
    id: 'icu-care',
    title: 'ICU Patient Care At Home',
    tag: 'Critical Care',
    tagType: 'Tracheostomy & BiPAP Care',
    description: 'High-dependency intensive care setups with ICU nurses trained in ventilator management, suctioning, tracheostomy protocol, telemetry, and critical drug titration.',
    metaLabel: 'Specialized Protocol',
    metaValue: 'Doctor Supervised',
    btnText: 'Book ICU Setup',
    image: 'https://carehealthnursing.com/images/gallery/005.jpg'
  },
  {
    id: 'elderly-care',
    title: 'Elderly & Senior Citizen Care',
    tag: 'Geriatric Care',
    tagType: 'Compassionate Support',
    description: 'Dignified daily living support for aging parents, dementia / Alzheimer\'s care, medication reminders, fall prevention, physical exercises, and warm emotional companionship.',
    metaLabel: 'Shift Format',
    metaValue: '12h / 24h Live-in',
    btnText: 'Book Elderly Care',
    image: 'https://carehealthnursing.com/images/gallery/001.jpg'
  },
  {
    id: 'male-attendant',
    title: 'Male Attendants (Ward Boys)',
    tag: 'Male Attendant',
    tagType: 'Mobility & Hygiene',
    description: 'Experienced male caregivers aiding bedridden patients, stroke recovery, wheelchair transfers, sponge bath, personal hygiene, and round-the-clock physical assistance.',
    metaLabel: 'Staffing Options',
    metaValue: 'Day / Night / 24 Hrs',
    btnText: 'Book Attendant',
    image: 'https://carehealthnursing.com/images/gallery/017.jpg'
  },
  {
    id: 'female-attendant',
    title: 'Female Attendants & Caregivers',
    tag: 'Female Attendant',
    tagType: 'Gentle Personal Care',
    description: 'Caring and respectful female attendants for female patients, post-operative care, diaper changing, feeding support, bathing, oral hygiene, and active daytime companioning.',
    metaLabel: 'Immediate Deployment',
    metaValue: '100% Police Verified',
    btnText: 'Book Female Attendant',
    image: 'https://carehealthnursing.com/images/gallery/018.jpg'
  },
  {
    id: 'post-op-care',
    title: 'Critical Patient & Surgical Recovery',
    tag: 'Post-Op Care',
    tagType: 'Sterile Dressing Care',
    description: 'Post-discharge monitoring, surgical wound dressing, catheter irrigation, drain maintenance, injection delivery, and cancer palliative nursing by certified clinicians.',
    metaLabel: 'Doctor Oversight',
    metaValue: 'Daily Vitals Log',
    btnText: 'Book Patient Care',
    image: 'https://carehealthnursing.com/images/gallery/002.jpg'
  }
];

export const REGIONAL_HUBS: HubOffice[] = [
  {
    id: 'east-delhi',
    name: 'Laxmi Nagar (East Delhi)',
    badge: 'HEAD OFFICE',
    address: '1/21 Gali No. 1 Lalita Park, Vikas Marg, Laxmi Nagar, New Delhi - 110092',
    servicingAreas: 'Servicing: Laxmi Nagar, Preet Vihar, Mayur Vihar, Anand Vihar, Vivek Vihar.',
    phone: '+91-9910531897',
    headOffice: true
  },
  {
    id: 'west-delhi',
    name: 'Janak Puri (West Delhi)',
    badge: 'WEST DELHI HUB',
    address: '604, 6th Floor, Kirti Shikhar Building, District Center, Janak Puri, N.D. - 110058',
    servicingAreas: 'Servicing: Janak Puri, Vikaspuri, Dwarka, Tilak Nagar, Rajouri Garden, Paschim Vihar.',
    phone: '+91-9999790231'
  },
  {
    id: 'ghaziabad',
    name: 'Indirapuram (Ghaziabad)',
    badge: 'GHAZIABAD HUB',
    address: 'LGF-17, Rajhans Plaza, Near Aditya Mall, Ahinsa Khand - 1, Indirapuram - 201014',
    servicingAreas: 'Servicing: Indirapuram, Vaishali, Vasundhara, Raj Nagar Ext., Crossings Republik.',
    phone: '+91-9625436163'
  },
  {
    id: 'noida',
    name: 'Noida & Greater Noida',
    badge: 'NOIDA HUB',
    address: 'BS-807, 8th Floor, Galaxy Diamond Plaza, Sector 62 & Gr. Noida, U.P. 201309',
    servicingAreas: 'Servicing: Sectors 50, 62, 76, 137, Greater Noida West & Pari Chowk.',
    phone: '+91-9999407473'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Rajesh Khanna',
    location: 'Janak Puri, New Delhi',
    initials: 'RK',
    rating: 5,
    quote: '"When my father suffered a cerebral stroke, we needed 24-hour ICU nursing immediately. Care Health Nurses sent Sister Priya within an hour. Her handling of the tracheostomy and feeds was phenomenal."'
  },
  {
    id: 'test-2',
    name: 'Sunita Mishra',
    location: 'Noida Sector 62',
    initials: 'SM',
    rating: 5,
    quote: '"The jabar caregiver provided for my newborn and wife after C-section was an angel. She managed all massage routines, bathing, and baby sleep schedules with utmost warmth and sterile care."'
  },
  {
    id: 'test-3',
    name: 'Anand Goyal',
    location: 'Indirapuram, Ghaziabad',
    initials: 'AG',
    rating: 5,
    quote: '"The motorized hospital bed and BiPAP machine arrived in under 2 hours in Ghaziabad. Flawless equipment setup and round-the-clock coordinator follow-up. Truly authentic medical service!"'
  }
];

export const MEDICAL_EQUIPMENT_LIST = [
  {
    id: 'icu-bed',
    title: 'Motorized / ICU Beds',
    subtitle: '2-Function & 5-Function Electric ICU Beds with Collapsible Railings & Cardiac Chair Position',
    specs: ['Remote control backrest & knee elevation', 'High grade ABS head/foot boards', 'Anti-static castor wheels with central locking'],
    rentPrice: '₹3,500 / month',
    buyPrice: '₹48,000'
  },
  {
    id: 'oxygen-conc',
    title: 'Oxygen Concentrators',
    subtitle: '5 Litre & 10 Litre High-Flow Medical Grade Units with 93% ± 3% Purity Output',
    specs: ['Philips EverFlo & DeVilbiss units', 'Integrated nebulizer port & dual flow option', 'Built-in oxygen purity sensor & quiet motor'],
    rentPrice: '₹4,000 / month',
    buyPrice: '₹42,000'
  },
  {
    id: 'bipap-cpap',
    title: 'BiPAP & CPAP Machines',
    subtitle: 'ResMed Lumis & Philips DreamStation with Heated Humidifier & Auto-titrating Modes',
    specs: ['EPAP/IPAP clinical titration presets', 'High-leak compensation & compliance reporting', 'Sterilized full face / nasal masks included'],
    rentPrice: '₹5,500 / month',
    buyPrice: '₹62,000'
  },
  {
    id: 'suction-wheelchair',
    title: 'Suction & Wheelchairs',
    subtitle: 'Electrical High-Vacuum Suction Machines, Commode Chairs & Lightweight Foldable Wheelchairs',
    specs: ['25L/min oil-free piston suction pump', 'Anti-overflow bottle with antimicrobial filter', 'Ergonomic chrome & aluminum transit chairs'],
    rentPrice: '₹1,800 / month',
    buyPrice: '₹9,500'
  }
];
