import { Sponsor, SponsorTier } from "@/types";

export interface TierInfo {
  tier: SponsorTier;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
}

export const sponsorTiersInfo: TierInfo[] = [
  {
    tier: "title",
    title: "TITLE PARTNER",
    subtitle: "The Stark Industries Tier: Driving the primary vision and keynote stage of TECHNIX 8.0",
    badge: "Vibranium Clearance",
    badgeColor: "from-amber-400 to-yellow-600",
  },
  {
    tier: "powered-by",
    title: "POWERED BY PARTNERS",
    subtitle: "The Arc Reactor Tier: Empowering competitive infrastructure and tech hackathons",
    badge: "Arc Reactor Clearance",
    badgeColor: "from-cyan-400 to-blue-600",
  },
  {
    tier: "gold",
    title: "AVENGERS GOLD ALLIES",
    subtitle: "Providing high-performance workstations, cloud credits, and judging mentorship",
    badge: "Gold Clearance",
    badgeColor: "from-yellow-400 to-amber-500",
  },
  {
    tier: "silver",
    title: "S.H.I.E.L.D. SILVER ALLIES",
    subtitle: "Supporting student workshops, tournament prizes, and technical tooling",
    badge: "Silver Clearance",
    badgeColor: "from-slate-300 to-slate-500",
  },
  {
    tier: "partners",
    title: "ECOSYSTEM & MEDIA PARTNERS",
    subtitle: "Official media, community, beverage, and youth broadcasting networks",
    badge: "Alliance Partner",
    badgeColor: "from-red-400 to-rose-600",
  },
];

export const sponsorsData: Sponsor[] = [
  {
    id: "sp-title-1",
    name: "Apex Technologies (Placeholder)",
    tier: "title",
    role: "Official Title Sponsor & Keynote Partner",
    logo: "/images/sponsors/title-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Global cloud engineering and high-performance computing consortium.",
    isConfirmed: true,
    accentColor: "#F59E0B",
  },
  {
    id: "sp-powered-1",
    name: "Nexus Cloud Systems (Placeholder)",
    tier: "powered-by",
    role: "Official Cloud & Infrastructure Partner",
    logo: "/images/sponsors/powered-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Empowering scalable developer infrastructure for the hackathon tracks.",
    isConfirmed: true,
    accentColor: "#38BDF8",
  },
  {
    id: "sp-powered-2",
    name: "Hyperion Edge Computing (Placeholder)",
    tier: "powered-by",
    role: "Official AI & Innovation Partner",
    logo: "/images/sponsors/powered-2-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Accelerating neural inference and real-time edge processing.",
    isConfirmed: true,
    accentColor: "#00F0FF",
  },
  {
    id: "sp-gold-1",
    name: "Starlight Mediaworks (Placeholder)",
    tier: "gold",
    role: "Official Creative & Visual Partner",
    logo: "/images/sponsors/gold-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Pioneering motion graphics and post-production broadcasting.",
    isConfirmed: true,
    accentColor: "#E23636",
  },
  {
    id: "sp-gold-2",
    name: "Quantum Logic Corp (Placeholder)",
    tier: "gold",
    role: "Official DevTools & Security Partner",
    logo: "/images/sponsors/gold-2-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Enterprise cyber defense and static analysis tooling.",
    isConfirmed: true,
    accentColor: "#A855F7",
  },
  {
    id: "sp-silver-1",
    name: "Vanguard Gaming Gear (Placeholder)",
    tier: "silver",
    role: "Official Esports Peripherals Partner",
    logo: "/images/sponsors/silver-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Pro-tier mechanical keyboards, audio headsets, and low-latency mice.",
    isConfirmed: true,
    accentColor: "#22C55E",
  },
  {
    id: "sp-silver-2",
    name: "CodeCraft Academy (Placeholder)",
    tier: "silver",
    role: "Official Student Learning Partner",
    logo: "/images/sponsors/silver-2-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Empowering collegiate coders with interactive developer curriculums.",
    isConfirmed: true,
    accentColor: "#64748B",
  },
  {
    id: "sp-partner-1",
    name: "Campus Radio Network (Placeholder)",
    tier: "partners",
    role: "Official Student Media Partner",
    logo: "/images/sponsors/partner-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Connecting over 80+ collegiate campuses across South India.",
    isConfirmed: true,
    accentColor: "#FB7185",
  },
  {
    id: "sp-partner-2",
    name: "Glacier Energy Drink (Placeholder)",
    tier: "partners",
    role: "Official Energy & Hydration Partner",
    logo: "/images/sponsors/partner-2-placeholder.svg",
    websiteUrl: "https://example.com/sponsor-placeholder",
    description: "Keeping warriors fueled across 36 hours of relentless competition.",
    isConfirmed: true,
    accentColor: "#38BDF8",
  },
];

export const sponsorshipTiersPricing = [
  {
    name: "Vibranium Title Sponsor",
    amount: "₹1,50,000 (Placeholder)",
    perks: [
      "Sole naming rights: 'TECHNIX 8.0 Powered by [Brand]'",
      "Keynote stage address during opening ceremony (20 Mins)",
      "Dedicated prime exhibition booth in Main Quadrangle",
      "Prime logo placement across all event merchandise & banners",
      "Direct campus talent recruitment access and resume database",
    ],
    recommended: true,
  },
  {
    name: "Arc Reactor Powered By",
    amount: "₹75,000 (Placeholder)",
    perks: [
      "Prominent branding across 11 technical & cultural tracks",
      "10-Minute company presentation slot before hackathon finals",
      "Standard interactive exhibit booth space",
      "Logo inclusion in fest aftermovie and official media kits",
      "VIP access passes for company delegates",
    ],
    recommended: false,
  },
  {
    name: "Avengers Gold Ally",
    amount: "₹40,000 (Placeholder)",
    perks: [
      "Branding across official social media, website, and brochures",
      "Mentorship and jury panel representation in specific events",
      "Product sampling / promotional literature distribution",
      "Logo inclusion in sponsor wall and digital displays",
    ],
    recommended: false,
  },
];
