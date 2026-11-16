import { industryHref, type Industry } from './industries';

export type NavItem = { label: string; href: string; children?: NavItem[]; desc?: string; icon?: string };

/** Recruitment services (all on /services/) */
export const services = [
  { id: 'direct-hire', label: 'Direct Hire Recruitment', icon: 'user', text: 'Find qualified professionals for permanent positions within your organization.' },
  { id: 'contract-staffing', label: 'Contract Staffing', icon: 'calendar', text: 'Recruitment support for temporary and project-based workforce requirements.' },
  { id: 'contract-to-hire', label: 'Contract-to-Hire', icon: 'users', text: 'Flexible staffing arrangements that can provide an opportunity for longer-term employment.' },
  { id: 'executive-search', label: 'Executive Search', icon: 'briefcase', text: 'Targeted search support for senior-level and specialized leadership positions.' },
];

/** Main menu; the Industries submenu lists the live sectors (Astro.locals.site.industries). */
export const buildNav = (industries: Industry[]): NavItem[] => [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-company/' },
  { label: 'Services', href: '/services/', children: services.map((s) => ({ label: s.label, href: `/services/#${s.id}`, icon: s.icon })) },
  { label: 'Industries', href: '/industries/', children: industries.map((i) => ({ label: i.title, href: industryHref(i.slug), icon: i.icon, desc: i.roleLine })) },
  { label: 'Our Process', href: '/our-process/' },
  { label: 'Success Stories', href: '/success-stories/' },
  { label: 'Insights', href: '/insights/' },
];

export const contact = {
  phone: '+1 (872) 227-9172',
  phoneHref: 'tel:+18722279172',
  email: 'hr@neoventrax.com',
  address: ['2501 Chatham Rd', 'Springfield, IL 62704, USA'],
  hours: 'Mon – Fri: 9:00 AM – 6:00 PM (CT)', // TODO: confirm office hours
};

export const socials = [
  { name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/neoventrax-inc/' },
  { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1JTeiFU8H9/' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/xneoventra?igsh=MWV2cDcxZ2xwdDUydQ==' },
  { name: 'x', label: 'X (Twitter)', href: 'https://x.com/XNeoventra?t=Dz0U0S_vXtvi_5U5xUFWHQ&s=09' },
];

export const mapEmbed =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3066.5825334488068!2d-89.68739235000001!3d39.77148054999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x887538896b106a3f%3A0xa912a7c49097b355!2s2501%20Chatham%20Rd%2C%20Springfield%2C%20IL%2062704%2C%20USA!5e0!3m2!1sen!2sin!4v1758966532466!5m2!1sen!2sin';

/** Where forms are sent. Set PUBLIC_FORM_ENDPOINT (e.g. a Formspree / Web3Forms / your own API URL) in .env */
export const formEndpoint: string | undefined = import.meta.env.PUBLIC_FORM_ENDPOINT;
