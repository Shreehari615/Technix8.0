export type EventCategory = 'Technical' | 'Non-Technical' | 'Gaming' | 'Cultural';

export interface Coordinator {
  name: string;
  role: 'Faculty Coordinator' | 'Student Coordinator' | 'Event Lead';
  phone: string;
  email: string;
}

export interface EventRound {
  roundNumber: number;
  title: string;
  duration?: string;
  description: string;
}

export interface FestEvent {
  id: string;
  title: string;
  marvelCharacter: string;
  characterTitle: string;
  category: EventCategory;
  shortDescription: string;
  fullDescription: string;
  visualDirection: string;
  heroTheme: {
    accentColor: string; // e.g. '#E23636'
    glowColor: string; // e.g. 'rgba(226, 54, 54, 0.4)'
    badgeBg: string;
    heroGradient: string;
  };
  teamSize: {
    min: number;
    max: number;
    label: string; // e.g. "Individual or Team of 2"
  };
  feeAmount: number; // e.g. 150
  registrationFee: string; // e.g. "₹150 per team"
  winningPrize?: string; // e.g. "₹2,000"
  runnerUpPrize?: string; // e.g. "₹1,000"
  tagline?: string; // e.g. "Think. Code. Debug. Innovate."
  categoriesNote?: string; // e.g. "UG and PG (separate competitions)"
  maxEntries?: string; // e.g. "2 teams per college"
  eventFormat?: string; // e.g. "Virtual Cybersecurity Treasure Hunt"
  subtitle?: string;
  venue: string; // e.g. "Stark Tech Lab / Room 304"
  scheduleTime: string; // e.g. "Day 1 - 10:30 AM"
  rounds: EventRound[];
  rules: string[];
  eligibility: string;
  coordinators: Coordinator[];
  isTBD?: boolean;
  image: string;
  avatarIcon: string;
}

export type SponsorTier = 'title' | 'powered-by' | 'gold' | 'silver' | 'partners';

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  role: string; // e.g. "Official Cloud Partner"
  logo: string;
  websiteUrl?: string;
  description?: string;
  isConfirmed: boolean;
  accentColor?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Technical' | 'Cultural' | 'Gaming' | 'Behind The Scenes';
  imageUrl: string;
  description: string;
  year?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
}

export interface RegistrationSubmission {
  id: string;
  timestamp: string;
  eventId: string;
  eventTitle: string;
  teamName?: string;
  leadName: string;
  email: string;
  phone: string;
  collegeName: string;
  department: string;
  yearOfStudy: string;
  members: string[];
  passCode: string;
  feeAmount: number;
  paymentMethod?: 'UPI_QR';
  utrNumber?: string;
  screenshotUrl?: string;
  paymentStatus: 'paid_pending_verification' | 'completed' | 'on_hold';
}
