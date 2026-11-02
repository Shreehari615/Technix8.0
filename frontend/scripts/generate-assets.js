const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '../public/images/events');
const sponsorsDir = path.join(__dirname, '../public/images/sponsors');
const heroDir = path.join(__dirname, '../public/images/hero');

[eventsDir, sponsorsDir, heroDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. IRON MAN - Stark Tech Code Protocol
const ironmanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2D0B0E" />
      <stop offset="60%" stop-color="#140507" />
      <stop offset="100%" stop-color="#070203" />
    </radialGradient>
    <radialGradient id="arcReactorGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#7DD3FC" />
      <stop offset="60%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
    <linearGradient id="starkGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#854D0E" />
    </linearGradient>
    <linearGradient id="starkRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="50%" stop-color="#B91C1C" />
      <stop offset="100%" stop-color="#7F1D1D" />
    </linearGradient>
    <pattern id="hexGrid" width="40" height="40" patternUnits="userSpaceOnUse" opacity="0.12">
      <path d="M 20 0 L 40 11.5 L 40 34.5 L 20 46 L 0 34.5 L 0 11.5 Z" fill="none" stroke="#E23636" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#bgGrad)" />
  <rect width="800" height="500" fill="url(#hexGrid)" />
  
  <!-- Holographic Stark HUD Circles -->
  <g transform="translate(400, 240)">
    <circle r="180" fill="none" stroke="#E23636" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.35" />
    <circle r="150" fill="none" stroke="#EAB308" stroke-width="1" stroke-dasharray="80 120" opacity="0.4" />
    <circle r="120" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.5" />
    
    <!-- Code Stream Holograms -->
    <text x="-320" y="-120" fill="#38BDF8" font-family="monospace" font-size="11" opacity="0.6">&gt; JARVIS.SYS: INITIALIZING PROTOCOL</text>
    <text x="-320" y="-100" fill="#E23636" font-family="monospace" font-size="11" opacity="0.6">&gt; RUNNING CODE_DIAGNOSTICS_8.0</text>
    <text x="-320" y="-80" fill="#FDE047" font-family="monospace" font-size="11" opacity="0.6">&gt; STATUS: 0 ERRORS // 100% READY</text>
    <text x="180" y="140" fill="#38BDF8" font-family="monospace" font-size="11" opacity="0.6">&gt; CORE: 3.2 GIGA-FLOPS</text>
    <text x="180" y="160" fill="#E23636" font-family="monospace" font-size="11" opacity="0.6">&gt; FIREWALL: STARK SECURE</text>

    <!-- Iron Man Helmet Graphic -->
    <path d="M-60,-110 C-60,-140 -35,-160 0,-160 C35,-160 60,-140 60,-110 C65,-50 70,10 50,50 C35,80 15,95 0,95 C-15,95 -35,80 -50,50 C-70,10 -65,-50 -60,-110 Z" fill="url(#starkRed)" stroke="#B91C1C" stroke-width="2" />
    <!-- Helmet Faceplate -->
    <path d="M-40,-95 C-25,-105 0,-105 40,-95 C45,-60 40,-10 32,35 C20,55 0,65 0,65 C0,65 -20,55 -32,35 C-40,-10 -45,-60 -40,-95 Z" fill="url(#starkGold)" stroke="#CA8A04" stroke-width="1.5" />
    <!-- Brow & Jaw Contours -->
    <path d="M-35,-55 L-12,-48 L12,-48 L35,-55 L28,-30 L-28,-30 Z" fill="#78350F" opacity="0.5" />
    <path d="M-25,20 L-10,35 L10,35 L25,20 L20,45 L-20,45 Z" fill="#78350F" opacity="0.4" />
    <!-- Glowing Slit Eyes -->
    <polygon points="-30,-45 -12,-42 -14,-36 -28,-38" fill="#E0F2FE" filter="drop-shadow(0 0 6px #38BDF8)" />
    <polygon points="30,-45 12,-42 14,-36 28,-38" fill="#E0F2FE" filter="drop-shadow(0 0 6px #38BDF8)" />
    
    <!-- Chest Arc Reactor -->
    <g transform="translate(0, 150)">
      <circle r="40" fill="url(#arcReactorGlow)" opacity="0.8" />
      <circle r="28" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2" />
      <circle r="18" fill="#E0F2FE" filter="drop-shadow(0 0 8px #38BDF8)" />
      <!-- Reactor Segments -->
      <line x1="-28" y1="0" x2="28" y2="0" stroke="#0284C7" stroke-width="2" />
      <line x1="0" y1="-28" x2="0" y2="28" stroke="#0284C7" stroke-width="2" />
      <line x1="-20" y1="-20" x2="20" y2="20" stroke="#0284C7" stroke-width="2" />
      <line x1="20" y1="-20" x2="-20" y2="20" stroke="#0284C7" stroke-width="2" />
    </g>
  </g>
  
  <!-- Cyber Corner Badges -->
  <path d="M 30 50 L 30 30 L 50 30" fill="none" stroke="#E23636" stroke-width="2" />
  <path d="M 770 50 L 770 30 L 750 30" fill="none" stroke="#E23636" stroke-width="2" />
  <path d="M 30 450 L 30 470 L 50 470" fill="none" stroke="#E23636" stroke-width="2" />
  <path d="M 770 450 L 770 470 L 750 470" fill="none" stroke="#E23636" stroke-width="2" />
  
  <!-- Event Watermark Text -->
  <text x="40" y="460" fill="#E23636" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">STARK INDUSTRIES // CODE PROTOCOL</text>
  <text x="760" y="460" fill="#EAB308" font-family="monospace" font-size="12" text-anchor="end">LEVEL: ARCHITECT</text>
</svg>`;

// 2. NICK FURY - S.H.I.E.L.D. Command Center
const nickfurySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="furyBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0F243A" />
      <stop offset="60%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#050811" />
    </radialGradient>
    <linearGradient id="tacticalCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#furyBg)" />
  
  <!-- Tactical Radar Grid -->
  <g transform="translate(400, 250)">
    <circle r="190" fill="none" stroke="#38BDF8" stroke-width="1" opacity="0.2" />
    <circle r="140" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.3" />
    <circle r="90" fill="none" stroke="#38BDF8" stroke-width="1" opacity="0.2" />
    <line x1="-220" y1="0" x2="220" y2="0" stroke="#38BDF8" stroke-width="1" opacity="0.3" />
    <line x1="0" y1="-200" x2="0" y2="200" stroke="#38BDF8" stroke-width="1" opacity="0.3" />
    
    <!-- Radar Sweep Sweep Wedge -->
    <path d="M 0 0 L 134 -134 A 190 190 0 0 1 190 0 Z" fill="url(#tacticalCyan)" opacity="0.12" />
    
    <!-- S.H.I.E.L.D. Stylized Eagle Emblem -->
    <g transform="translate(0, -20) scale(1.1)">
      <!-- Shield Outer Silhouette -->
      <path d="M 0 -85 L 65 -45 L 65 30 C 65 75 0 105 0 105 C 0 105 -65 75 -65 30 L -65 -45 Z" fill="#0E1E38" stroke="#38BDF8" stroke-width="2.5" />
      <!-- Tactical Eagle Wings -->
      <path d="M 0 -65 L 45 -35 L 50 15 L 35 15 L 20 -15 L 15 25 L 0 5 L -15 25 L -20 -15 L -35 15 L -50 15 L -45 -35 Z" fill="#38BDF8" opacity="0.9" />
      <!-- Director Eye Patch Icon Center -->
      <g transform="translate(0, 45)">
        <ellipse cx="0" cy="0" rx="20" ry="14" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5" />
        <line x1="-28" y1="-12" x2="28" y2="12" stroke="#38BDF8" stroke-width="2.5" />
        <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
      </g>
    </g>

    <!-- Tactical Telemetry Overlay -->
    <text x="-350" y="-140" fill="#38BDF8" font-family="monospace" font-size="11" opacity="0.75">&gt; DIRECTIVE: LEVEL 7 CLEARANCE</text>
    <text x="-350" y="-120" fill="#94A3B8" font-family="monospace" font-size="10" opacity="0.75">&gt; SECTOR: HELICARRIER COMMAND</text>
    <text x="-350" y="-100" fill="#38BDF8" font-family="monospace" font-size="10" opacity="0.75">&gt; THREAT CON: ALPHA STABLE</text>
    <text x="220" y="140" fill="#38BDF8" font-family="monospace" font-size="10" opacity="0.75">&gt; RESOURCE DEPLOYMENT: 98%</text>
    <text x="220" y="160" fill="#38BDF8" font-family="monospace" font-size="10" opacity="0.75">&gt; COORD: N 40° 42' 46" W 74° 0' 21"</text>
  </g>
  
  <text x="40" y="460" fill="#38BDF8" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">S.H.I.E.L.D. // STRATEGIC OPERATIONS</text>
  <text x="760" y="460" fill="#94A3B8" font-family="monospace" font-size="12" text-anchor="end">CLEARANCE: DIRECTOR ONLY</text>
</svg>`;

// 3. DOCTOR STRANGE - Multiverse of Minds
const doctorstrangeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="mysticBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2E1B02" />
      <stop offset="50%" stop-color="#190F02" />
      <stop offset="100%" stop-color="#090501" />
    </radialGradient>
    <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="80%" stop-color="#D97706" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#mysticBg)" />
  
  <!-- Glowing Golden Mystic Portal / Mandala -->
  <g transform="translate(400, 250)">
    <circle r="185" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="14 10" opacity="0.8" filter="drop-shadow(0 0 10px #F59E0B)" />
    <circle r="160" fill="none" stroke="#FDE047" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.9" />
    <circle r="130" fill="none" stroke="#EA580C" stroke-width="2" stroke-dasharray="25 35" opacity="0.75" />
    <circle r="95" fill="none" stroke="#FDE047" stroke-width="1.5" opacity="0.6" />
    
    <!-- Concentric Mystic Squares -->
    <rect x="-95" y="-95" width="190" height="190" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.7" />
    <rect x="-95" y="-95" width="190" height="190" fill="none" stroke="#FDE047" stroke-width="1.5" transform="rotate(45)" opacity="0.7" />
    <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="#D97706" stroke-width="1" transform="rotate(22.5)" opacity="0.6" />
    <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="#D97706" stroke-width="1" transform="rotate(67.5)" opacity="0.6" />
    
    <!-- Center Eye of Agamotto Emblem -->
    <path d="M -50 0 C -30 -30 30 -30 50 0 C 30 30 -30 30 -50 0 Z" fill="#1C1917" stroke="#F59E0B" stroke-width="2.5" />
    <circle cx="0" cy="0" r="16" fill="#10B981" filter="drop-shadow(0 0 8px #10B981)" />
    <circle cx="0" cy="0" r="8" fill="#A7F3D0" />
    
    <!-- Sparkling Mystic Portal Runes -->
    <circle cx="-135" cy="-75" r="4" fill="#FEF08A" filter="drop-shadow(0 0 4px #F59E0B)" />
    <circle cx="135" cy="-75" r="4" fill="#FEF08A" filter="drop-shadow(0 0 4px #F59E0B)" />
    <circle cx="-135" cy="75" r="4" fill="#FEF08A" filter="drop-shadow(0 0 4px #F59E0B)" />
    <circle cx="135" cy="75" r="4" fill="#FEF08A" filter="drop-shadow(0 0 4px #F59E0B)" />
  </g>
  
  <text x="40" y="460" fill="#F59E0B" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">SANCTUM SANCTORUM // MULTIVERSE OF MINDS</text>
  <text x="760" y="460" fill="#FEF08A" font-family="monospace" font-size="12" text-anchor="end">REALMS: 14,000,605</text>
</svg>`;

// 4. SPIDER-MAN - Daily Bugle Visual Chronicles
const spidermanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="spiderBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2A0B0E" />
      <stop offset="60%" stop-color="#0E1220" />
      <stop offset="100%" stop-color="#05060B" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#spiderBg)" />
  
  <!-- Web Lines Background -->
  <g transform="translate(400, 230)" opacity="0.35">
    <line x1="0" y1="0" x2="-350" y2="-200" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="-380" y2="0" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="-350" y2="200" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="0" y2="-230" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="0" y2="230" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="350" y2="-200" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="380" y2="0" stroke="#E2E8F0" stroke-width="1.2" />
    <line x1="0" y1="0" x2="350" y2="200" stroke="#E2E8F0" stroke-width="1.2" />
    
    <!-- Web Rings -->
    <circle r="70" fill="none" stroke="#E2E8F0" stroke-width="1" />
    <circle r="130" fill="none" stroke="#E2E8F0" stroke-width="1" />
    <circle r="190" fill="none" stroke="#E2E8F0" stroke-width="1" />
  </g>
  
  <!-- Central Camera Shutter / Spider Lens -->
  <g transform="translate(400, 230)">
    <circle r="90" fill="#0F172A" stroke="#EF4444" stroke-width="3" filter="drop-shadow(0 0 12px #EF4444)" />
    <!-- Camera Aperture Blades -->
    <g stroke="#38BDF8" stroke-width="1.5" opacity="0.75">
      <line x1="-35" y1="-45" x2="25" y2="-55" />
      <line x1="25" y1="-55" x2="55" y2="0" />
      <line x1="55" y1="0" x2="35" y2="55" />
      <line x1="35" y1="55" x2="-30" y2="50" />
      <line x1="-30" y1="50" x2="-55" y2="-10" />
      <line x1="-55" y1="-10" x2="-35" y2="-45" />
    </g>
    
    <!-- Iconic Spider Eyes -->
    <g transform="translate(0, -5)">
      <path d="M -48 -25 C -35 -40 -12 -35 -5 -15 C -15 -5 -35 -10 -48 -25 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="3.5" filter="drop-shadow(0 0 6px #F8FAFC)" />
      <path d="M 48 -25 C 35 -40 12 -35 5 -15 C 15 -5 35 -10 48 -25 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="3.5" filter="drop-shadow(0 0 6px #F8FAFC)" />
    </g>
    
    <!-- Camera Reticle Overlay -->
    <rect x="-65" y="-65" width="130" height="130" fill="none" stroke="#38BDF8" stroke-width="1" stroke-dasharray="15 25" opacity="0.6" />
    <text x="0" y="55" fill="#EF4444" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">REC ● [4K 60FPS]</text>
  </g>
  
  <text x="40" y="460" fill="#EF4444" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">DAILY BUGLE // VISUAL CHRONICLES</text>
  <text x="760" y="460" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="end">F/1.4 · 1/2000s · ISO 100</text>
</svg>`;

// 5. BLACK PANTHER - The Wakandan Relic Hunt
const blackpantherSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="wakandaBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#240D3A" />
      <stop offset="60%" stop-color="#0E0517" />
      <stop offset="100%" stop-color="#040107" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#wakandaBg)" />
  
  <!-- Vibranium Kinetic Circuit Lines -->
  <g transform="translate(400, 230)">
    <circle r="170" fill="none" stroke="#A855F7" stroke-width="1.5" stroke-dasharray="12 18" opacity="0.4" />
    <circle r="125" fill="none" stroke="#C084FC" stroke-width="2" stroke-dasharray="8 6" opacity="0.6" filter="drop-shadow(0 0 8px #A855F7)" />
    
    <!-- Wakandan Geometric Map Runes -->
    <path d="M -160 0 L 160 0 M 0 -160 L 0 160" stroke="#7E22CE" stroke-width="1" opacity="0.3" />
    <polygon points="0,-125 108,-62 108,62 0,125 -108,62 -108,-62" fill="none" stroke="#A855F7" stroke-width="1" opacity="0.5" />
    
    <!-- Black Panther Stylized Mask -->
    <path d="M 0 -85 C 35 -85 65 -60 70 -15 C 75 35 45 80 0 95 C -45 80 -75 35 -70 -15 C -65 -60 -35 -85 0 -85 Z" fill="#0F081D" stroke="#A855F7" stroke-width="3" filter="drop-shadow(0 0 10px #7E22CE)" />
    <!-- Ears -->
    <polygon points="-55,-60 -75,-105 -35,-80" fill="#0F081D" stroke="#A855F7" stroke-width="2" />
    <polygon points="55,-60 75,-105 35,-80" fill="#0F081D" stroke="#A855F7" stroke-width="2" />
    <!-- Glowing Purple Eyes -->
    <polygon points="-42,-22 -15,-18 -22,-8 -38,-10" fill="#E9D5FF" filter="drop-shadow(0 0 6px #C084FC)" />
    <polygon points="42,-22 15,-18 22,-8 38,-10" fill="#E9D5FF" filter="drop-shadow(0 0 6px #C084FC)" />
    <!-- Vibranium Claw Necklace Silhouette -->
    <g transform="translate(0, 95)">
      <polygon points="-45,-15 -35,15 -30,0" fill="#E9D5FF" />
      <polygon points="-25,-5 -18,22 -12,5" fill="#E9D5FF" />
      <polygon points="0,5 0,28 6,10" fill="#E9D5FF" />
      <polygon points="25,-5 18,22 12,5" fill="#E9D5FF" />
      <polygon points="45,-15 35,15 30,0" fill="#E9D5FF" />
    </g>
  </g>
  
  <text x="40" y="460" fill="#C084FC" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">WAKANDA CITADEL // THE RELIC HUNT</text>
  <text x="760" y="460" fill="#E9D5FF" font-family="monospace" font-size="12" text-anchor="end">KINETIC CHARGE: 100%</text>
</svg>`;

// 6. HULK - Hulk Smash Arena
const hulkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="gammaBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#093118" />
      <stop offset="60%" stop-color="#04160B" />
      <stop offset="100%" stop-color="#020804" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#gammaBg)" />
  
  <!-- Radioactive Gamma Seismic Waves -->
  <g transform="translate(400, 230)">
    <circle r="180" fill="none" stroke="#22C55E" stroke-width="2" stroke-dasharray="16 12" opacity="0.4" />
    <circle r="140" fill="none" stroke="#4ADE80" stroke-width="2.5" stroke-dasharray="8 8" opacity="0.6" filter="drop-shadow(0 0 10px #22C55E)" />
    
    <!-- Gamma Lightning Cracks -->
    <path d="M -140 -80 L -80 -40 L -110 20 L -40 60" stroke="#86EFAC" stroke-width="2" fill="none" opacity="0.8" />
    <path d="M 140 -80 L 80 -40 L 110 20 L 40 60" stroke="#86EFAC" stroke-width="2" fill="none" opacity="0.8" />
    
    <!-- Colossal Fist Silhouette Breaking Center -->
    <path d="M -50 70 L -60 -10 C -60 -50 -30 -70 0 -70 C 30 -70 60 -50 60 -10 L 50 70 Z" fill="#14532D" stroke="#22C55E" stroke-width="3" filter="drop-shadow(0 0 12px #22C55E)" />
    <!-- Knuckle Segments -->
    <rect x="-48" y="-45" width="22" height="35" rx="8" fill="#166534" stroke="#4ADE80" stroke-width="2" />
    <rect x="-24" y="-55" width="22" height="42" rx="8" fill="#166534" stroke="#4ADE80" stroke-width="2" />
    <rect x="0" y="-55" width="22" height="42" rx="8" fill="#166534" stroke="#4ADE80" stroke-width="2" />
    <rect x="24" y="-45" width="22" height="35" rx="8" fill="#166534" stroke="#4ADE80" stroke-width="2" />
    <!-- Radiation Hazard Symbol Small -->
    <circle cx="0" cy="15" r="14" fill="#22C55E" opacity="0.8" />
    <circle cx="0" cy="15" r="6" fill="#052E16" />
  </g>
  
  <text x="40" y="460" fill="#22C55E" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">GAMMA SECTOR // HULK SMASH ARENA</text>
  <text x="760" y="460" fill="#86EFAC" font-family="monospace" font-size="12" text-anchor="end">PWR: 100,000 RADS</text>
</svg>`;

// 7. STAR-LORD - Guardians Stage Showdown
const starlordSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="cosmicBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#3B0728" />
      <stop offset="50%" stop-color="#18072B" />
      <stop offset="100%" stop-color="#070212" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#cosmicBg)" />
  
  <!-- Audio Equalizer Spectrum & Stage Laser Cones -->
  <g transform="translate(400, 230)">
    <!-- Stage Spotlight Beams -->
    <polygon points="0,-180 -180,180 -120,180" fill="#F43F5E" opacity="0.2" />
    <polygon points="0,-180 180,180 120,180" fill="#06B6D4" opacity="0.2" />
    
    <!-- Audio Waveform Bars -->
    <g transform="translate(-150, 90)">
      <rect x="0" y="-30" width="10" height="40" fill="#F43F5E" />
      <rect x="20" y="-60" width="10" height="70" fill="#FB7185" />
      <rect x="40" y="-80" width="10" height="90" fill="#06B6D4" />
      <rect x="60" y="-45" width="10" height="55" fill="#38BDF8" />
      <rect x="230" y="-45" width="10" height="55" fill="#38BDF8" />
      <rect x="250" y="-80" width="10" height="90" fill="#06B6D4" />
      <rect x="270" y="-60" width="10" height="70" fill="#FB7185" />
      <rect x="290" y="-30" width="10" height="40" fill="#F43F5E" />
    </g>
    
    <!-- Star-Lord Helmet & Glowing Red Eyes -->
    <path d="M -45 -80 C -25 -95 25 -95 45 -80 L 50 15 C 50 50 25 70 0 75 C -25 70 -50 50 -50 15 Z" fill="#27272A" stroke="#71717A" stroke-width="2.5" />
    <!-- Dual Glowing Red Goggles -->
    <circle cx="-22" cy="-20" r="14" fill="#EF4444" filter="drop-shadow(0 0 10px #EF4444)" />
    <circle cx="22" cy="-20" r="14" fill="#EF4444" filter="drop-shadow(0 0 10px #EF4444)" />
    <circle cx="-22" cy="-20" r="6" fill="#FCA5A5" />
    <circle cx="22" cy="-20" r="6" fill="#FCA5A5" />
    <!-- Respirator Mesh Tubes -->
    <rect x="-30" y="20" width="60" height="25" rx="5" fill="#18181B" stroke="#06B6D4" stroke-width="1.5" />
  </g>
  
  <text x="40" y="460" fill="#F43F5E" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">THE MILANO // AWESOME STAGE SHOWDOWN</text>
  <text x="760" y="460" fill="#06B6D4" font-family="monospace" font-size="12" text-anchor="end">TRACK: AWESOME MIX VOL. 8</text>
</svg>`;

// 8. SHURI - Wakanda Digital Lab
const shuriSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="shuriBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#082939" />
      <stop offset="60%" stop-color="#061622" />
      <stop offset="100%" stop-color="#02080D" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#shuriBg)" />
  
  <!-- Digital Lab Hologram Workstation Nodes -->
  <g transform="translate(400, 230)">
    <circle r="175" fill="none" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="10 14" opacity="0.4" />
    <circle r="130" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6 6" opacity="0.6" filter="drop-shadow(0 0 8px #06B6D4)" />
    
    <!-- Holographic UI Wireframe Screens -->
    <rect x="-140" y="-85" width="90" height="60" rx="4" fill="none" stroke="#06B6D4" stroke-width="1.5" opacity="0.75" />
    <line x1="-130" y1="-70" x2="-60" y2="-70" stroke="#06B6D4" stroke-width="1" />
    <line x1="-130" y1="-55" x2="-80" y2="-55" stroke="#06B6D4" stroke-width="1" />
    <line x1="-130" y1="-40" x2="-90" y2="-40" stroke="#06B6D4" stroke-width="1" />
    
    <rect x="50" y="-85" width="90" height="60" rx="4" fill="none" stroke="#A855F7" stroke-width="1.5" opacity="0.75" />
    <circle cx="95" cy="-55" r="16" fill="none" stroke="#A855F7" stroke-width="1" />
    
    <!-- Shuri Vibranium Panther Gauntlet Silhouette -->
    <path d="M -35 60 L -45 -10 C -45 -40 -20 -60 0 -60 C 20 -60 45 -40 45 -10 L 35 60 Z" fill="#0E1E2C" stroke="#06B6D4" stroke-width="2.5" />
    <!-- Gauntlet Sonic Mouth -->
    <polygon points="-25,-15 0,-40 25,-15 15,10 -15,10" fill="#164E63" stroke="#67E8F9" stroke-width="1.5" />
    <circle cx="0" cy="-10" r="8" fill="#67E8F9" filter="drop-shadow(0 0 6px #67E8F9)" />
  </g>
  
  <text x="40" y="460" fill="#06B6D4" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">WAKANDAN LAB // DIGITAL WEB DESIGN</text>
  <text x="760" y="460" fill="#A855F7" font-family="monospace" font-size="12" text-anchor="end">SYSTEM: VIBRANIUM OS 8.0</text>
</svg>`;

// 9. LOKI - Loki's Mischief Protocol
const lokiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="lokiBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0E2F1F" />
      <stop offset="60%" stop-color="#06180F" />
      <stop offset="100%" stop-color="#020905" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#lokiBg)" />
  
  <!-- Branching Time Rifts & Illusion Glyphs -->
  <g transform="translate(400, 230)">
    <circle r="180" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="14 16" opacity="0.4" />
    <circle r="135" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.5" />
    
    <!-- Branching Timeline Curves -->
    <path d="M 0 160 C 20 80 -40 20 -80 -40 C -120 -80 -150 -120 -170 -160" stroke="#10B981" stroke-width="2" fill="none" opacity="0.6" filter="drop-shadow(0 0 6px #10B981)" />
    <path d="M 0 160 C -20 80 40 20 80 -40 C 120 -80 150 -120 170 -160" stroke="#34D399" stroke-width="2" fill="none" opacity="0.6" />
    
    <!-- Loki Golden Curved Horns & Crown -->
    <!-- Left Horn -->
    <path d="M -30 -30 C -45 -70 -75 -110 -110 -130 C -85 -100 -55 -60 -40 -15 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5" filter="drop-shadow(0 0 8px #FACC15)" />
    <!-- Right Horn -->
    <path d="M 30 -30 C 45 -70 75 -110 110 -130 C 85 -100 55 -60 40 -15 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5" filter="drop-shadow(0 0 8px #FACC15)" />
    <!-- Crown Diadem Headpiece -->
    <polygon points="-35,-25 0,-45 35,-25 25,25 0,40 -25,25" fill="#CA8A04" stroke="#FDE047" stroke-width="2" />
    <circle cx="0" cy="-5" r="10" fill="#10B981" filter="drop-shadow(0 0 6px #10B981)" />
  </g>
  
  <text x="40" y="460" fill="#34D399" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">TVA PROTOCOL // LOKI'S MISCHIEF</text>
  <text x="760" y="460" fill="#FDE047" font-family="monospace" font-size="12" text-anchor="end">TIMELINE: SACRED &amp; BRANCHING</text>
</svg>`;

// 10. CAPTAIN AMERICA - Project Avengers (TBD 1)
const captainamericaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="capBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0F2445" />
      <stop offset="60%" stop-color="#071224" />
      <stop offset="100%" stop-color="#02060E" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#capBg)" />
  
  <!-- Vibranium Shield Concentric Rings -->
  <g transform="translate(400, 230)">
    <!-- Outer Red Ring -->
    <circle r="160" fill="#B91C1C" stroke="#EF4444" stroke-width="3" filter="drop-shadow(0 0 15px rgba(239,68,68,0.4))" />
    <!-- Silver Ring -->
    <circle r="128" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2" />
    <!-- Inner Red Ring -->
    <circle r="96" fill="#B91C1C" stroke="#EF4444" stroke-width="2" />
    <!-- Blue Center Circle -->
    <circle r="64" fill="#1D4ED8" stroke="#3B82F6" stroke-width="2" />
    <!-- Center Five-Point Star -->
    <polygon points="0,-48 14,-15 48,-15 20,6 30,38 0,18 -30,38 -20,6 -48,-15 -14,-15" fill="#F8FAFC" filter="drop-shadow(0 0 8px #F8FAFC)" />
    
    <!-- Holographic CLASSIFIED / TBD Stamp Box -->
    <rect x="-140" y="-30" width="280" height="60" rx="6" fill="#020617" stroke="#38BDF8" stroke-width="2" opacity="0.92" filter="drop-shadow(0 0 12px #38BDF8)" />
    <text x="0" y="8" fill="#F8FAFC" font-family="sans-serif" font-weight="900" font-size="16" letter-spacing="4" text-anchor="middle">EVENT DETAILS COMING SOON</text>
  </g>
  
  <text x="40" y="460" fill="#38BDF8" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">PROJECT AVENGERS // CLASSIFIED DOSSIER</text>
  <text x="760" y="460" fill="#EF4444" font-family="monospace" font-size="12" text-anchor="end">STATUS: PENDING REVEAL</text>
</svg>`;

// 11. THANOS - Infinity Gauntlet Challenge (TBD 2)
const thanosSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <radialGradient id="thanosBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#341A05" />
      <stop offset="60%" stop-color="#140824" />
      <stop offset="100%" stop-color="#06020D" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#thanosBg)" />
  
  <!-- Cosmic Infinity Energy Rings -->
  <g transform="translate(400, 230)">
    <circle r="185" fill="none" stroke="#EAB308" stroke-width="1.5" stroke-dasharray="12 16" opacity="0.5" />
    <circle r="140" fill="none" stroke="#A855F7" stroke-width="2" stroke-dasharray="6 6" opacity="0.6" filter="drop-shadow(0 0 10px #A855F7)" />
    
    <!-- Golden Gauntlet Fist Silhouette -->
    <path d="M -50 80 L -60 -15 C -60 -60 -25 -75 0 -75 C 25 -75 60 -60 60 -15 L 50 80 Z" fill="#854D0E" stroke="#EAB308" stroke-width="3" filter="drop-shadow(0 0 14px #EAB308)" />
    
    <!-- The Six Glowing Infinity Stones -->
    <!-- Center Mind Stone (Yellow) -->
    <ellipse cx="0" cy="5" rx="14" ry="18" fill="#FDE047" filter="drop-shadow(0 0 10px #FDE047)" />
    <!-- Power Stone (Purple - Index) -->
    <ellipse cx="-40" cy="-35" rx="9" ry="12" fill="#A855F7" filter="drop-shadow(0 0 8px #A855F7)" />
    <!-- Space Stone (Blue - Middle) -->
    <ellipse cx="-15" cy="-52" rx="9" ry="12" fill="#38BDF8" filter="drop-shadow(0 0 8px #38BDF8)" />
    <!-- Reality Stone (Red - Ring) -->
    <ellipse cx="15" cy="-52" rx="9" ry="12" fill="#EF4444" filter="drop-shadow(0 0 8px #EF4444)" />
    <!-- Soul Stone (Orange - Pinky) -->
    <ellipse cx="40" cy="-35" rx="9" ry="12" fill="#F97316" filter="drop-shadow(0 0 8px #F97316)" />
    <!-- Time Stone (Green - Thumb) -->
    <ellipse cx="-55" cy="15" rx="9" ry="12" fill="#22C55E" filter="drop-shadow(0 0 8px #22C55E)" />
    
    <!-- Holographic CLASSIFIED / TBD Box -->
    <rect x="-140" y="-15" width="280" height="50" rx="6" fill="#020617" stroke="#EAB308" stroke-width="2" opacity="0.94" filter="drop-shadow(0 0 12px #EAB308)" />
    <text x="0" y="16" fill="#FDE047" font-family="sans-serif" font-weight="900" font-size="15" letter-spacing="4" text-anchor="middle">EVENT DETAILS COMING SOON</text>
  </g>
  
  <text x="40" y="460" fill="#EAB308" font-family="sans-serif" font-weight="900" font-size="14" letter-spacing="4">INFINITY GAUNTLET // THE FINAL SNAP</text>
  <text x="760" y="460" fill="#A855F7" font-family="monospace" font-size="12" text-anchor="end">STONES: 6 OF 6 CHARGED</text>
</svg>`;

const eventSvgs = {
  'ironman.svg': ironmanSvg,
  'nickfury.svg': nickfurySvg,
  'doctorstrange.svg': doctorstrangeSvg,
  'spiderman.svg': spidermanSvg,
  'blackpanther.svg': blackpantherSvg,
  'hulk.svg': hulkSvg,
  'starlord.svg': starlordSvg,
  'shuri.svg': shuriSvg,
  'loki.svg': lokiSvg,
  'captainamerica.svg': captainamericaSvg,
  'thanos.svg': thanosSvg
};

Object.entries(eventSvgs).forEach(([filename, svg]) => {
  fs.writeFileSync(path.join(eventsDir, filename), svg);
});

// Generate Clean Sponsor SVGs
const createSponsorLogo = (name, category, color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="400" height="160">
  <rect width="400" height="160" rx="12" fill="#0B101D" stroke="${color}" stroke-width="1.5" />
  <g transform="translate(40, 45)">
    <rect x="0" y="0" width="36" height="36" rx="8" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1.5" />
    <circle cx="18" cy="18" r="8" fill="${color}" />
    <text x="50" y="26" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="20">${name}</text>
    <text x="50" y="48" fill="#94A3B8" font-family="monospace" font-size="11" letter-spacing="1">${category}</text>
  </g>
  <path d="M 370 20 L 380 20 L 380 30" fill="none" stroke="${color}" stroke-width="1.5" />
</svg>`;

const sponsorSvgs = {
  'title-placeholder.svg': createSponsorLogo('APEX CLOUD', 'GLOBAL CLOUD INFRASTRUCTURE', '#F59E0B'),
  'powered-placeholder.svg': createSponsorLogo('NEXUS DEV', 'DEVELOPER TOOLING & APIS', '#38BDF8'),
  'powered-2-placeholder.svg': createSponsorLogo('HYPERION AI', 'NEURAL EDGE PLATFORMS', '#00F0FF'),
  'gold-placeholder.svg': createSponsorLogo('STARLIGHT FX', 'DIGITAL MEDIA & BROADCAST', '#E23636'),
  'gold-2-placeholder.svg': createSponsorLogo('QUANTUM SEC', 'CYBER DEFENSE & AUDITING', '#A855F7'),
  'silver-placeholder.svg': createSponsorLogo('VANGUARD PRO', 'ESPORTS HARDWARE & GEAR', '#22C55E'),
  'silver-2-placeholder.svg': createSponsorLogo('CODECRAFT', 'COLLEGIATE DEVELOPER ACADEMY', '#94A3B8'),
  'partner-placeholder.svg': createSponsorLogo('CAMPUS PULSE', 'YOUTH BROADCAST NETWORK', '#FB7185'),
  'partner-2-placeholder.svg': createSponsorLogo('GLACIER FUEL', 'PERFORMANCE HYDRATION', '#38BDF8'),
};

Object.entries(sponsorSvgs).forEach(([filename, svg]) => {
  fs.writeFileSync(path.join(sponsorsDir, filename), svg);
});

console.log("Assets generated successfully!");
