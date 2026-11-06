export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us', href: '#',
    children: [
      { label: 'About Company', href: '/about-company/' },
      { label: 'Careers', href: '/careers/' },
      { label: 'People', href: '/people/' },
    ],
  },
  {
    label: 'Find a Job', href: '#',
    children: [
      { label: 'Accounting', href: '/accounting/' },
      { label: 'Oil & Gas', href: '/oil-gas/' },
      { label: 'Restaurants (F&B)', href: '/restaurants-fb/' },
      { label: 'Healthcare Pharmaceuticals', href: '/healthcare-pharmaceuticals/' },
      { label: 'Environmental', href: '/environmental/' },
      { label: 'Mining', href: '/mining/' },
      { label: 'Hospitality', href: '/hospitality/' },
      { label: 'Public Safety', href: '/public-safety/' },
      { label: 'Telecommunications & Wireless', href: '/telecommunications-wireless/' },
      { label: 'Sports', href: '/sports/' },
      { label: 'Construction', href: '/construction/' },
      { label: 'Public Administration', href: '/public-administration/' },
      { label: 'Legal', href: '/legal/' },
      { label: 'Architecture', href: '/architecture/' },
      { label: 'Manufacturing', href: '/manufacturing/' },
      { label: 'Retail', href: '/retail/' },
      { label: 'Hardware & Networking', href: '/hardware-networking/' },
      { label: 'Airlines Aviation', href: '/airlines-aviation/' },
      { label: 'Mechanical', href: '/mechanical/' },
    ],
  },
  {
    label: 'Employers', href: '#',
    children: [
      { label: 'Services', href: '/services/' },
      { label: 'Why NeoVentraX', href: '/why-neoventrax/' },
      { label: 'Posting Clients Jobs or Request for Assistance', href: '/posting-clients-jobs-or-request-for-assistance/' },
      { label: 'Satisfied Clients', href: '/satisfied-clients/' },
      { label: 'Success Stories', href: '/success-stories/' },
    ],
  },
  {
    label: 'Employees', href: '#',
    children: [
      { label: 'Tips on Submitting Resumes', href: '/tips-on-submitting-resumes/' },
      { label: 'Effective Job Search', href: '/effective-job-search/' },
      { label: 'Preparing for Interview', href: '/preparing-interview/' },
      { label: 'Tips and Resources for Career Development', href: '/tips-and-resources-for-career-development/' },
      { label: 'Talent Grooming', href: '/talent-grooming/' },
      { label: 'Career Insights', href: '/career-insights/' },
      { label: 'Career Advice', href: '/career-advice/' },
      { label: 'Submit Your Resume', href: '/submit-your-resume/' },
    ],
  },
  {
    label: 'Services', href: '#',
    children: [
      { label: 'Recruitment Services', href: '/recruitment-services/' },
      { label: 'Product Support', href: '/product-support/' },
      { label: 'Payroll Services', href: '/payroll-services/' },
      { label: 'Product Development', href: '/product-development/' },
      { label: 'Accounting and Bookkeeping', href: '/accounting-and-bookkeeping/' },
    ],
  },
  { label: 'Contact Us', href: '/contact-us/' },
];

export const contact = {
  phone: '+1 (872) 227-9172',
  phoneHref: 'tel:+18722279172',
  email: 'hr@neoventrax.com',
  address: ['2501 Chatham Rd', 'Springfield, IL 62704, USA'],
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
