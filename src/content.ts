// All copy lives here. Edit this file to change what the site says.

export const contact = {
  // TODO: replace these three before deploying.
  email: 'YOUR_EMAIL',
  linkedin: 'https://www.linkedin.com/in/YOUR_HANDLE',
  github: 'https://github.com/YOUR_HANDLE',
}

export const stack = [
  'Go', 'React', 'Svelte', 'Flutter', 'Swift', 'Laravel', 'PostgreSQL', 'Docker', 'Networking', 'PC building',
]

export const timeline = [
  { years: '2025 – now', org: 'National Group', role: 'Software Development Manager' },
  { years: '2023 – 2025', org: 'Star Insure', role: 'Full-stack developer, Auckland (remote)' },
  { years: '2021 – 2023', org: 'Caprimul', role: 'Founder and CTO' },
  { years: '2016 – 2020', org: 'Freelance', role: 'Web and mobile for small businesses and startups' },
]

export type NowItem = {
  name: string
  tag: string
  status: string
  warm?: boolean
  body: string
  link?: { label: string; href: string }
  note?: string
}

export const now: NowItem[] = [
  {
    name: 'Kote',
    tag: 'Head of division',
    status: 'Live',
    body: "A technology consultancy inside National Consulting. Private, on-premise AI that keeps a firm's data inside its own walls, plus legacy migration and office IT. I built it from zero: name, brand, website, services, go-to-market.",
    link: { label: 'kotetech.com', href: 'https://kotetech.com' },
  },
  {
    name: 'Molara',
    tag: 'Caprimul',
    status: 'In daily use',
    body: "Dental clinic management software, running at Dentelle. Native iPad and Mac client for staff, web admin, patient PWA. Offline-first, because a clinic can't stop when the internet does.",
    link: { label: 'dentelleclinic.com', href: 'https://dentelleclinic.com' },
  },
  {
    name: 'Tuorps',
    tag: 'Caprimul',
    status: 'In development',
    warm: true,
    body: 'Social media and WhatsApp management for Indian businesses. Go, PostgreSQL and Redis, written test-first.',
    note: "Coming when it's ready",
  },
]

export type WorkViz = 'calls' | 'phone' | 'mirror' | 'furniture'

export type WorkItem = {
  title: string
  meta: string
  body: string
  chips?: string[]
  viz: WorkViz
}

export const work: WorkItem[] = [
  {
    title: 'Star Insure',
    meta: 'Full-stack developer / 2023 – 2025',
    body: 'Internal portal for a New Zealand vehicle insurer. I shipped recoveries management, call transcription with AI analysis, a dealers portal, automatic quote generation and broker email processing, and migrated data off two legacy systems.',
    viz: 'calls',
  },
  {
    title: 'Okdok',
    meta: 'Caprimul / Canley Digital Healthcare, London',
    body: 'Telemedicine with separate apps for doctors and patients. I rebuilt the mobile clients in Flutter: HD video calls, encrypted records, secure prescriptions.',
    chips: ['5,000+ monthly active users', '60fps throughout'],
    viz: 'phone',
  },
  {
    title: 'Lenoajar',
    meta: 'Caprimul / Gifting store, Arabic + English',
    body: 'A gifting store where every screen had to be designed twice: right-to-left and left-to-right. Orders, a driver app, coupons, gift cards and WhatsApp in one system.',
    chips: ['10x return for the client in six months'],
    viz: 'mirror',
  },
  {
    title: 'CustomFurniture .Store',
    meta: 'Caprimul / formerly Planks',
    body: "One storefront for a city's scattered furniture makers. I built it twice: first as Planks, a Shopify store with a custom admin tool for sourcing and fulfilment, then again on Shopify's Storefront APIs with Strapi and ERPNext behind it.",
    viz: 'furniture',
  },
]

export type TinkerIcon = 'fan' | 'rack' | 'terminal' | 'home' | 'pad'

export type TinkerItem = {
  title: string
  body: string
  icon: TinkerIcon
  chips?: string[]
  wide?: boolean
}

export const tinkering: TinkerItem[] = [
  {
    title: 'PC building',
    body: 'I built my own rig and I know what every cable in it does. Scroll faster and the fan spins up.',
    icon: 'fan',
    chips: ['Ryzen 5 7600X', 'RTX 4060'],
    wide: true,
  },
  { title: 'Home lab', body: 'An always-on server running Coolify, Plex and a self-hosted stack over Tailscale.', icon: 'rack' },
  { title: 'Local AI', body: "I run open-weight LLMs on my own hardware instead of renting someone else's.", icon: 'terminal' },
  { title: 'Smart home', body: 'Home Assistant, cameras and automations I wired up myself.', icon: 'home' },
  { title: 'Gaming', body: 'PS5 and PC, with the PC streamed to the living room TV so I never have to sit at a desk to play.', icon: 'pad' },
]

export const offClock = {
  list: ['Manchester United, for better or worse', 'Formula 1', 'Specialty coffee', 'Malayalam and world cinema', 'One cat, several plants'],
  rowA: [
    { text: 'Manchester United, for better or worse' },
    { text: 'Formula 1', outline: true },
    { text: 'Specialty coffee', tone: 'acc' as const },
  ],
  rowB: [
    { text: 'Malayalam cinema', outline: true },
    { text: 'World cinema' },
    { text: 'One cat', tone: 'warm' as const },
    { text: 'Several plants', outline: true },
  ],
}
