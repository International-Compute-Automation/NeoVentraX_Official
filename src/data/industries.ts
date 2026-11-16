import type { Card } from '../lib/content';

/**
 * The sectors NeoVentraX recruits for.
 * Source of truth: the Strapi CMS (separate NeoVentraX-CMS project), which writes the published sectors to the
 * site database; the website server reads them live (src/lib/site-content.ts). The built-in list below is only
 * used when no site database is configured (and to seed the CMS).
 * `roles` entries either reuse a role write-up from the old site ({ from: [oldPageSlug, titleContains] })
 * or define a new role ({ title, text }).
 */
export type RoleRef = { from: [string, string] } | { title: string; text: string };
export type Industry = {
  slug: string;
  title: string;
  icon: string;
  image: string;
  /** short list shown in the menu and on cards ("Mechanical, Civil, Chemical, Structural") */
  roleLine: string;
  intro: string[];
  /** every position we recruit for, grouped by seniority */
  levels: { label: string; roles: string[] }[];
  /** detailed role cards (with Apply buttons) */
  roles: RoleRef[];
  /** ready-made role cards (from the CMS); when present they replace `roles` */
  roleCards?: Card[];
  /** sector page title / hero lead / meta description (from the CMS; defaults in industries-page.ts) */
  pageTitle?: string;
  heroLead?: string;
  seoDescription?: string;
};

const builtIn: Industry[] = [
  {
    slug: 'engineering',
    title: 'Engineering',
    icon: 'wrench',
    image: '/uploads/2025-09-1-Mechanical-Engineer.webp',
    roleLine: 'Mechanical, Civil, Chemical, Structural.',
    intro: [
      'Engineering projects succeed when the right specialists are in place before the schedule starts to slip. We recruit mechanical, civil, chemical and structural engineers for design, construction, infrastructure and industrial work.',
      'Our search focuses on licensing (PE/EIT), discipline-specific experience and project scale — from HVAC and MEP design to heavy civil, process and structural engineering.',
    ],
    levels: [
      { label: 'Early Career', roles: ['CAD Technician', 'Junior Engineer / EIT', 'Civil Engineer I', 'Project Coordinator', 'Mechanical Engineer I', 'Structural Designer', 'Quality Inspector', 'Process Engineer I'] },
      { label: 'Professional', roles: ['Structural Engineer', 'Project Engineer', 'Mechanical Engineer', 'Quality Engineer', 'Chemical Engineer', 'Manufacturing Engineer', 'Civil Engineer', 'Controls Engineer'] },
      { label: 'Senior & Lead', roles: ['Principal Engineer', 'Senior Civil Engineer', 'Engineering Manager', 'Lead Structural Engineer', 'Quality Manager', 'Senior Mechanical Engineer', 'Project Manager – Engineering'] },
      { label: 'Leadership', roles: ['Chief Engineer', 'Director of Engineering', 'VP of Engineering'] },
    ],
    roles: [
      { from: ['mechanical', 'Mechanical Engineer (All sorts'] },
      { from: ['mechanical', 'Mechanical Engineer (with HVAC'] },
      { from: ['mechanical', 'Mechanical Engineer (MEP'] },
      { from: ['construction', 'Heavy Civil Engineer'] },
      { from: ['construction', 'Structural Engineer'] },
      { title: 'Chemical Engineer', text: 'Designs, optimises and scales chemical processes, ensuring safety, quality and regulatory compliance from lab to plant.' },
      { from: ['manufacturing', 'Process Engineer'] },
      { from: ['construction', 'Infrastructure Engineer'] },
      { from: ['construction', 'Roadway Engineers'] },
      { from: ['construction', 'Environmental Engineer'] },
      { from: ['construction', 'Commercial / Residential Project Manager'] },
      { from: ['construction', 'Construction Estimator'] },
    ],
  },
  {
    slug: 'legal-compliance',
    title: 'Legal & Compliance',
    icon: 'shield',
    image: '/uploads/2025-09-1--Civil-Litigation-Attorney.webp',
    roleLine: 'General Counsel, compliance, regulatory.',
    intro: [
      'Legal and compliance leaders protect the business, its reputation and its licence to operate. We recruit in-house counsel, attorneys and compliance professionals who combine sound judgement with commercial awareness.',
      'Candidates are assessed on practice area, jurisdiction and regulatory frameworks — so they can advise confidently from day one.',
    ],
    levels: [
      { label: 'Early Career', roles: ['Legal Assistant', 'Compliance Analyst', 'Paralegal', 'Contract Specialist', 'Legal Coordinator', 'Junior In-House Counsel', 'Regulatory Affairs Analyst'] },
      { label: 'Professional', roles: ['Compliance Manager', 'Employment Counsel', 'Associate General Counsel', 'Privacy Manager', 'Contract Manager', 'Senior Counsel', 'Regulatory Affairs Manager'] },
      { label: 'Senior & Lead', roles: ['Head of Legal', 'Director of Compliance', 'Senior Corporate Counsel', 'Deputy General Counsel', 'VP Legal', 'Chief Compliance Officer'] },
      { label: 'Leadership', roles: ['Chief Legal Officer', 'General Counsel', 'EVP Legal Affairs'] },
    ],
    roles: [
      { title: 'General Counsel', text: 'Leads the legal function, advises the executive team and board, and manages contracts, disputes and outside counsel.' },
      { title: 'Corporate Counsel', text: 'Provides day-to-day legal advice on commercial contracts, employment matters, corporate governance and risk.' },
      { title: 'Compliance Manager', text: 'Owns compliance programmes, policies and training, and is the point of contact for regulators and external auditors.' },
      { title: 'Regulatory Specialist', text: 'Prepares regulatory submissions, tracks changing requirements and keeps products, processes and documentation compliant.' },
      { from: ['environmental', 'Environmental Compliance Specialist'] },
      { from: ['legal', 'Corporate Law'] },
      { from: ['legal', 'Civil Litigation Attorney'] },
      { from: ['legal', 'Labor Law Litigation Attorney'] },
      { from: ['legal', 'Plaintiff Employment Attorney'] },
      { from: ['legal', 'Associate Attorney'] },
    ],
  },
  {
    slug: 'taxation-finance',
    title: 'Taxation & Finance',
    icon: 'coins',
    image: '/uploads/2025-09-Accounting-scaled.webp',
    roleLine: 'CFOs, Tax Directors, Controllers.',
    intro: [
      'Accurate numbers, sound controls and smart tax planning underpin every business decision. We recruit finance, accounting and tax professionals from staff accountant to CFO.',
      'Candidates are evaluated on technical accuracy, systems experience and the industry context they bring — so they can contribute from their first close.',
    ],
    levels: [
      { label: 'Early Career', roles: ['Accounts Payable Specialist', 'Staff Accountant', 'Budget Analyst', 'General Ledger Clerk', 'Financial Analyst', 'Junior Auditor', 'Payroll Specialist', 'Accounting Assistant'] },
      { label: 'Professional', roles: ['FP&A Manager', 'Accounting Manager', 'Tax Manager', 'Treasury Analyst', 'Finance Manager', 'Cost Accountant', 'Internal Auditor'] },
      { label: 'Senior & Lead', roles: ['Tax Director', 'Audit Manager', 'Financial Controller', 'Risk Manager', 'Treasury Manager', 'VP Finance', 'Compliance Director'] },
      { label: 'Leadership', roles: ['Chief Accounting Officer', 'Chief Financial Officer', 'VP Finance & Controller'] },
    ],
    roles: [
      { from: ['accounting', 'CFO'] },
      { title: 'Tax Director', text: 'Leads federal, state and international tax strategy, compliance and provisioning, and manages relationships with tax advisors and authorities.' },
      { title: 'Tax Manager', text: 'Manages tax compliance, filings and planning, and supports audits and tax-provision reporting.' },
      { title: 'Controller', text: 'Owns the close, financial reporting and internal controls, and leads the accounting team through audits and budgeting.' },
      { from: ['accounting', 'Accounting Manager'] },
      { from: ['accounting', 'Senior Accountant'] },
      { from: ['accounting', 'Financial Analyst'] },
      { from: ['accounting', 'Auditor'] },
      { from: ['accounting', 'Accountant'] },
      { title: 'Payroll Specialist', text: 'Processes multi-state payroll accurately and on time, maintains employee records and ensures tax and benefit compliance.' },
    ],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    icon: 'settings',
    image: '/uploads/2025-09-1-Manufacturing-Engineer-Supervisor-Technician.webp',
    roleLine: 'Plant Managers, Quality Engineers.',
    intro: [
      'Manufacturers depend on people who keep lines running safely, efficiently and to specification. We recruit plant leaders, engineers, quality professionals and skilled technicians who understand the realities of the plant floor.',
      'From a single critical hire to building out a full shift, we focus on hands-on experience, certifications and the reliability your operation depends on.',
    ],
    levels: [
      { label: 'Early Career', roles: ['Process Technician', 'Quality Inspector', 'Production Technician', 'Assembly Supervisor', 'Maintenance Technician', 'Industrial Engineer I', 'Manufacturing Engineer I'] },
      { label: 'Professional', roles: ['Quality Engineer', 'Production Supervisor', 'Process Engineer', 'Safety Manager', 'Lean Manufacturing Engineer', 'Maintenance Manager', 'Manufacturing Engineer', 'Production Manager'] },
      { label: 'Senior & Lead', roles: ['Operations Manager', 'Plant Manager', 'Continuous Improvement Director', 'Site Director', 'Quality Director', 'Engineering Manager'] },
      { label: 'Leadership', roles: ['Director of Operations', 'VP of Manufacturing', 'VP of Operations', 'Chief Operating Officer'] },
    ],
    roles: [
      { from: ['manufacturing', 'Production/Plant Manager'] },
      { from: ['manufacturing', 'Quality Control/Quality Assurance'] },
      { from: ['manufacturing', 'Production Manager'] },
      { from: ['manufacturing', 'Manufacturing Engineer'] },
      { from: ['manufacturing', 'Industrial Engineer'] },
      { from: ['manufacturing', 'Controls Engineer'] },
      { title: 'CNC Machinist', text: 'Sets up and operates CNC mills and lathes, reads blueprints and GD&T, and holds tight tolerances across production runs.' },
      { title: 'Quality Inspector', text: 'Inspects parts and assemblies against drawings and specifications using precision measuring tools, and documents non-conformances.' },
      { title: 'Maintenance Technician', text: 'Troubleshoots, repairs and maintains production equipment — mechanical, electrical, hydraulic and pneumatic — to minimise downtime.' },
      { from: ['manufacturing', 'Maintenance/EHS/Safety'] },
    ],
  },
  {
    slug: 'supply-chain',
    title: 'Supply Chain',
    icon: 'truck',
    image: '/uploads/2025-09-5-Supply-Chain-Manager.webp',
    roleLine: 'Procurement, logistics, planning.',
    intro: [
      'Resilient supply chains are built by people who plan ahead, negotiate well and keep goods moving. We recruit procurement, planning, logistics and warehouse professionals across manufacturing, distribution and logistics.',
      'We look for hands-on experience with ERP and WMS systems, supplier management and the metrics that matter — cost, service level and inventory accuracy.',
    ],
    levels: [
      { label: 'Early Career', roles: ['Logistics Coordinator', 'Buyer', 'Inventory Analyst', 'Demand Planner', 'Purchasing Coordinator', 'Supply Chain Analyst', 'Warehouse Supervisor', 'Procurement Analyst'] },
      { label: 'Professional', roles: ['Category Manager', 'Procurement Manager', 'Senior Buyer', 'Materials Manager', 'Logistics Manager', 'Inventory Manager', 'Supply Chain Manager'] },
      { label: 'Senior & Lead', roles: ['Head of Procurement', 'Director of Supply Chain', 'Global Sourcing Director', 'VP of Logistics', 'Director of Procurement'] },
      { label: 'Leadership', roles: ['Chief Procurement Officer', 'VP of Supply Chain', 'SVP Supply Chain & Operations', 'Chief Supply Chain Officer'] },
    ],
    roles: [
      { from: ['manufacturing', 'Supply Chain Manager'] },
      { title: 'Procurement Manager', text: 'Leads sourcing strategy, supplier negotiations and contracts, and delivers cost savings while managing supply risk.' },
      { from: ['manufacturing', 'Purchaser/Buyer'] },
      { title: 'Logistics Manager', text: 'Plans inbound and outbound transportation, manages carriers and 3PLs, and improves delivery cost and reliability.' },
      { title: 'Demand Planner', text: 'Builds demand forecasts with sales and operations, and balances inventory against service-level targets.' },
      { title: 'Material Planner', text: 'Plans material requirements against production schedules, places replenishment orders and keeps inventory levels balanced.' },
      { from: ['retail', 'Inventory Control Specialist'] },
      { title: 'Warehouse Supervisor', text: 'Leads warehouse teams across receiving, picking, packing and shipping, with a focus on safety, accuracy and productivity.' },
    ],
  },
  {
    slug: 'human-resources',
    title: 'Human Resources',
    icon: 'users',
    image: '/uploads/2025-09-1-Our-People-Team.webp',
    roleLine: 'HRBPs, L&D, TA Directors, CHROs.',
    intro: [
      'The right HR leaders shape culture, capability and growth. We recruit HR business partners, talent acquisition, learning and development, and HR leadership professionals.',
      'We assess candidates on the size and complexity of the organisations they have supported, their employment-law knowledge and their track record of partnering with the business.',
    ],
    levels: [
      { label: 'Early Career', roles: ['Recruiter', 'HR Coordinator', 'Onboarding Specialist', 'HRIS Analyst', 'Benefits Administrator', 'L&D Coordinator', 'HR Analyst'] },
      { label: 'Professional', roles: ['HR Generalist', 'Talent Acquisition Manager', 'HR Business Partner', 'Compensation & Benefits Manager', 'Senior Recruiter', 'L&D Manager', 'HR Manager'] },
      { label: 'Senior & Lead', roles: ['Head of Talent Acquisition', 'Senior HRBP', 'HR Director', 'Total Rewards Director', 'Director of L&D', 'VP of People Operations'] },
      { label: 'Leadership', roles: ['Chief People Officer', 'CHRO', 'SVP People & Culture', 'VP of Human Resources'] },
    ],
    roles: [
      { title: 'Chief Human Resources Officer (CHRO)', text: 'Sets people strategy, leads the HR function and partners with the CEO and board on culture, leadership and organisational design.' },
      { title: 'HR Business Partner (HRBP)', text: 'Partners with business leaders on workforce planning, employee relations, performance and organisational change.' },
      { title: 'Talent Acquisition Director', text: 'Leads recruitment strategy, employer brand and the TA team, and owns hiring metrics across the organisation.' },
      { title: 'Learning & Development Manager', text: 'Designs and delivers training, leadership development and onboarding programmes that build capability.' },
      { title: 'HR Manager', text: 'Runs day-to-day HR operations — policies, employee relations, compliance and HR administration.' },
      { title: 'Compensation & Benefits Manager', text: 'Designs pay structures and benefits programmes that are competitive, fair and compliant.' },
      { title: 'HR Generalist', text: 'Supports the full employee lifecycle, from onboarding and records to employee queries and compliance.' },
    ],
  },
  {
    slug: 'executive-search',
    title: 'Executive Search',
    icon: 'briefcase',
    image: '/uploads/2025-09-6-Chief-Administrative-Officer.webp',
    roleLine: 'C-suite and board-level mandates.',
    intro: [
      'Leadership hires shape the direction of a business for years. Our executive search practice runs confidential, research-led searches for C-suite, senior leadership and board-level positions.',
      'We map the market, approach passive candidates discreetly and evaluate leadership track record, cultural fit and long-term potential — keeping you closely involved throughout.',
    ],
    levels: [
      { label: 'Vice President', roles: ['VP of Operations', 'VP of Human Resources', 'VP of Finance', 'VP of Supply Chain', 'VP of Legal', 'VP of Engineering'] },
      { label: 'Senior Vice President & GM', roles: ['Managing Director', 'SVP of Operations', 'President & General Manager', 'SVP of Engineering', 'SVP of Finance'] },
      { label: 'C-Suite & Board', roles: ['Chief Operating Officer', 'Board Director', 'Chief Financial Officer', 'Chief People Officer', 'Chief Executive Officer', 'Chief Legal Officer'] },
    ],
    roles: [
      { title: 'Chief Executive Officer (CEO)', text: 'Leads the organisation’s strategy, performance and culture, and reports to the board.' },
      { title: 'Chief Operating Officer (COO)', text: 'Runs day-to-day operations and turns strategy into scalable, efficient execution.' },
      { from: ['accounting', 'CFO'] },
      { title: 'Chief Human Resources Officer (CHRO)', text: 'Owns people strategy, leadership development and organisational design at executive level.' },
      { title: 'VP / Director of Operations', text: 'Leads multi-site operations, budgets and operational excellence programmes.' },
      { title: 'General Manager', text: 'Holds full P&L responsibility for a business unit, site or region.' },
      { title: 'Board Member / Non-Executive Director', text: 'Brings independent oversight, governance and sector expertise to the board.' },
    ],
  },
];

/** the built-in list: fallback when no site database is configured, and seed data for the CMS */
export const builtInIndustries = builtIn;

export const industryHref = (slug: string) => `/industries/${slug}/`;
