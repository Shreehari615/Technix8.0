export const festConfig = {
  name: "TECHNIX 8.0",
  edition: "8.0",
  type: "Intercollegiate Technical & Cultural Fest",
  tagline: "ONE UNIVERSE. LIMITLESS POSSIBILITIES.",
  supportingTagline: "Assemble. Innovate. Conquer.",
  heroCopy: "Where technology meets imagination. Assemble your team and take on the ultimate challenge.",
  
  // Event Date (Set for upcoming fest countdown)
  // Can be easily changed by coordinators here
  eventDate: "2026-11-17T09:00:00+05:30",
  eventDateDisplay: "November 17–18, 2026",
  
  // Institutional Information
  institution: {
    collegeName: "BMS Institute of Technology and Management (BMSIT)",
    universityName: "BMSIT",
    campus: "BMSIT, Yelahanka, Bengaluru",
    city: "Yelahanka, Bengaluru",
    address: "BMS Institute of Technology & Management, Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, Karnataka 560064",
    coordinates: "13.1332° N, 77.5678° E",
  },

  // Key Fest Stats / Highlights
  highlights: [
    {
      label: "Galactic Events",
      value: "9",
      numericValue: 9,
      suffix: "",
      subtext: "Technical, Gaming & Cultural",
      iconName: "Zap",
      color: "from-amber-400 to-red-500",
      status: "confirmed",
    },
    {
      label: "Colleges Assembling",
      value: "45+",
      numericValue: 45,
      suffix: "+",
      subtext: "Intercollegiate delegations",
      iconName: "Shield",
      color: "from-blue-400 to-indigo-500",
      status: "pending",
    },
    {
      label: "Warriors Expected",
      value: "1,500+",
      numericValue: 1500,
      suffix: "+",
      subtext: "Student competitors",
      iconName: "Users",
      color: "from-emerald-400 to-cyan-500",
      status: "pending",
    },
    {
      label: "Bounty & Honors",
      value: "₹1,00,000+",
      numericValue: 100000,
      suffix: "+",
      subtext: "Prize pool & certificates",
      iconName: "Trophy",
      color: "from-yellow-400 to-amber-600",
      status: "pending",
    },
  ],

  // Leadership & Committee Placeholders
  coordination: {
    patron: "Dr. K. S. Ramanathan, Principal & Dean of Technology",
    convenor: "Prof. Ananya Sen, Head of Department",
    facultyCoordinators: [
      { name: "Dr. Drakshaveni G", phone: "+91 99728 84530", email: "drakshaveni.g@bmsit.in" },
      { name: "Prof. Nirupama B K", phone: "+91 96867 73741", email: "nirupama.bk@bmsit.in" },
    ],
    studentPresidents: [
      { name: "Arjun Sharma", role: "Student President", phone: "+91 98450 12345" },
      { name: "Pooja Hegde", role: "Vice President & General Secretary", phone: "+91 98450 67890" },
    ],
  },

  // Official Contacts
  contact: {
    officialEmail: "technix8.0@technixfest.org",
    inquiryEmail: "helpdesk@technixfest.org",
    sponsorshipEmail: "sponsors@technixfest.org",
    phonePrimary: "+91 98765 43210",
    phoneSecondary: "+91 98450 12345",
    whatsappSupport: "+91 98765 43210",
    instagram: "https://instagram.com/technix_fest",
    linkedin: "https://linkedin.com/company/technix-fest",
    youtube: "https://youtube.com/@technix_fest",
    github: "https://github.com/technix-fest",
  },

  // UPI Payment Gateway Configuration
  upiPayment: {
    vpa: "shreeharisvbhat2005@oksbi",
    payeeName: "Shreehari S V",
    qrImage: "/images/upi-qr-scanner.png",
    merchantCode: "5399",
    currency: "INR",
    supportContact: "+91 98765 43210",
    bankName: "State Bank of India (SBI UPI)",
  },

  // Theme Disclaimer
  disclaimer:
    "TECHNIX 8.0 is an intercollegiate college festival created by student organizers with a Marvel Cinematic Universe-inspired aesthetic. This event is not sponsored, endorsed, or directly affiliated with Marvel Studios, LLC, Marvel Characters, Inc., or The Walt Disney Company. All Marvel character references are strictly creative tributes for educational and celebratory fest themes.",
};
