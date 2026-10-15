// lib/presets.js - Pre-configured demo items for instant testing and evaluation

export const PRESETS = [
  {
    id: 'vintage-leather-jacket',
    name: 'Vintage 1990s Heavyweight Leather Biker Jacket',
    category: 'Clothing & Outerwear',
    targetPlatform: 'all',
    suggestedPrice: 165,
    costOfGoods: 35,
    hints: {
      brand: 'Wilson Leather',
      era: '1990s',
      color: 'Black with brass hardware',
      material: '100% Genuine Heavyweight Cowhide',
      condition: 'Good Vintage Condition (natural distressing, buttery patina)',
      measurements: 'Pit to pit: 23", Length: 26", Sleeve: 25"'
    },
    images: [
      {
        name: 'jacket_front.svg',
        type: 'image/svg+xml',
        role: 'Front View',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <defs>
            <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1c1917"/>
              <stop offset="50%" stop-color="#292524"/>
              <stop offset="100%" stop-color="#0c0a09"/>
            </linearGradient>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="#f8fafc"/>
          <path d="M140,80 L200,120 L260,80 L320,130 L290,260 L260,340 L140,340 L110,260 L80,130 Z" fill="url(#leatherGrad)" stroke="#44403c" stroke-width="3"/>
          <path d="M140,80 L200,160 L180,340" stroke="url(#brassGrad)" stroke-width="4" fill="none" stroke-dasharray="2,2"/>
          <polygon points="140,80 180,140 200,110" fill="#292524" stroke="#44403c" stroke-width="2"/>
          <polygon points="260,80 220,140 200,110" fill="#292524" stroke="#44403c" stroke-width="2"/>
          <circle cx="160" cy="110" r="4" fill="url(#brassGrad)"/>
          <circle cx="240" cy="110" r="4" fill="url(#brassGrad)"/>
          <line x1="130" y1="240" x2="170" y2="250" stroke="url(#brassGrad)" stroke-width="3"/>
          <line x1="230" y1="250" x2="270" y2="240" stroke="url(#brassGrad)" stroke-width="3"/>
          <rect x="150" y="325" width="100" height="15" fill="#1c1917" stroke="#44403c"/>
          <rect x="190" y="322" width="20" height="20" fill="none" stroke="url(#brassGrad)" stroke-width="3"/>
          <text x="200" y="380" font-family="sans-serif" font-size="13" font-weight="bold" fill="#64748b" text-anchor="middle">Vintage 90s Leather Biker Jacket</text>
        </svg>`
      },
      {
        name: 'jacket_tag.svg',
        type: 'image/svg+xml',
        role: 'Brand Tag',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <rect width="400" height="400" fill="#e2e8f0"/>
          <rect x="80" y="100" width="240" height="180" rx="6" fill="#1e293b" stroke="#334155" stroke-width="3"/>
          <rect x="95" y="115" width="210" height="150" fill="none" stroke="#64748b" stroke-dasharray="4,4"/>
          <text x="200" y="155" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle">WILSONS LEATHER</text>
          <text x="200" y="180" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">GENUINE LEATHER / SHELL</text>
          <text x="200" y="200" font-family="monospace" font-size="14" font-weight="bold" fill="#f59e0b" text-anchor="middle">SIZE: L / G</text>
          <text x="200" y="225" font-family="monospace" font-size="10" fill="#94a3b8" text-anchor="middle">PROFESSIONAL LEATHER CLEAN ONLY</text>
          <text x="200" y="245" font-family="monospace" font-size="10" fill="#64748b" text-anchor="middle">MADE IN KOREA - RN 69423</text>
        </svg>`
      }
    ]
  },
  {
    id: 'ceramic-pourover',
    name: 'Artisan Speckled Ceramic Pour-Over Coffee Dripper',
    category: 'Home & Kitchen / Ceramics',
    targetPlatform: 'all',
    suggestedPrice: 48,
    costOfGoods: 12,
    hints: {
      brand: 'Studio Hand-thrown Original',
      era: 'Contemporary Artisan',
      color: 'Oatmeal beige with iron speckles, matte glaze',
      material: 'Stoneware Clay, Food-safe Non-toxic Glaze',
      condition: 'Brand New Handcrafted',
      measurements: 'Diameter: 4.5", Height: 3.75", Base fits mugs up to 3.8"'
    },
    images: [
      {
        name: 'dripper_main.svg',
        type: 'image/svg+xml',
        role: 'Studio Shot',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <defs>
            <radialGradient id="ceramicGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#f5f0eb"/>
              <stop offset="70%" stop-color="#e3d5c8"/>
              <stop offset="100%" stop-color="#c4b5a5"/>
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill="#fafaf9"/>
          <ellipse cx="200" cy="110" rx="100" ry="25" fill="#e3d5c8" stroke="#8c7a6b" stroke-width="2"/>
          <ellipse cx="200" cy="110" rx="85" ry="18" fill="#c4b5a5"/>
          <path d="M100,110 L150,260 L250,260 L300,110 Z" fill="url(#ceramicGrad)" stroke="#8c7a6b" stroke-width="2"/>
          <ellipse cx="200" cy="260" rx="75" ry="15" fill="#b09e8d" stroke="#8c7a6b" stroke-width="2"/>
          <ellipse cx="200" cy="285" rx="85" ry="12" fill="#d6c7b8" stroke="#8c7a6b" stroke-width="2"/>
          <!-- Speckles -->
          <circle cx="160" cy="160" r="2" fill="#5c4d3c"/>
          <circle cx="220" cy="140" r="1.5" fill="#5c4d3c"/>
          <circle cx="180" cy="210" r="2" fill="#5c4d3c"/>
          <circle cx="240" cy="190" r="1.5" fill="#5c4d3c"/>
          <circle cx="140" cy="180" r="2.5" fill="#5c4d3c"/>
          <circle cx="210" cy="235" r="1.5" fill="#5c4d3c"/>
          <text x="200" y="370" font-family="sans-serif" font-size="13" font-weight="bold" fill="#78716c" text-anchor="middle">Hand-thrown Speckled Dripper</text>
        </svg>`
      }
    ]
  },
  {
    id: 'vintage-casio-watch',
    name: 'Retro 1980s Gold-Tone Digital Alarm Chronograph Watch',
    category: 'Jewelry & Watches',
    targetPlatform: 'all',
    suggestedPrice: 75,
    costOfGoods: 15,
    hints: {
      brand: 'Casio (Illuminator A168 Style)',
      era: 'Late 1980s / 1990s Retro',
      color: 'Electroplated Yellow Gold, Stainless Steel back',
      material: 'Stainless Steel Bracelet, Acrylic Crystal, Mineral Glass',
      condition: 'Excellent Vintage (tested, new battery, faint micro-scratches on clasp)',
      measurements: 'Case width: 36mm, Lug to lug: 38mm, Adjustable link strap'
    },
    images: [
      {
        name: 'watch_front.svg',
        type: 'image/svg+xml',
        role: 'Face View',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <defs>
            <linearGradient id="goldCase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#eab308"/>
              <stop offset="100%" stop-color="#a16207"/>
            </linearGradient>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#d9f99d"/>
              <stop offset="100%" stop-color="#bef264"/>
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="#f1f5f9"/>
          <!-- Bracelet top & bottom -->
          <rect x="150" y="30" width="100" height="90" fill="url(#goldCase)" stroke="#854d0e"/>
          <rect x="150" y="280" width="100" height="90" fill="url(#goldCase)" stroke="#854d0e"/>
          <!-- Watch Case -->
          <rect x="120" y="100" width="160" height="200" rx="20" fill="url(#goldCase)" stroke="#854d0e" stroke-width="3"/>
          <!-- Bezel face -->
          <rect x="140" y="125" width="120" height="150" rx="10" fill="#0f172a"/>
          <!-- Brand text -->
          <text x="200" y="150" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc" text-anchor="middle">CASIO</text>
          <text x="200" y="165" font-family="sans-serif" font-size="8" fill="#38bdf8" text-anchor="middle">WATER RESIST • ILLUMINATOR</text>
          <!-- LCD screen -->
          <rect x="155" y="175" width="90" height="55" rx="4" fill="url(#screenGrad)" stroke="#4d7c0f"/>
          <!-- Digital numbers -->
          <text x="200" y="215" font-family="'Courier New', monospace" font-size="28" font-weight="bold" fill="#14532d" text-anchor="middle">10:58</text>
          <text x="235" y="195" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#14532d">36</text>
          <text x="200" y="260" font-family="sans-serif" font-size="8" fill="#f59e0b" text-anchor="middle">ALARM CHRONO</text>
          <!-- Buttons -->
          <rect x="110" y="145" width="10" height="18" rx="2" fill="#eab308"/>
          <rect x="110" y="225" width="10" height="18" rx="2" fill="#eab308"/>
          <rect x="280" y="225" width="10" height="18" rx="2" fill="#eab308"/>
        </svg>`
      }
    ]
  },
  {
    id: 'mid-century-lamp',
    name: 'Mid-Century Modern Sculptural Teak Table Lamp with Linen Shade',
    category: 'Home & Living / Lighting',
    targetPlatform: 'all',
    suggestedPrice: 220,
    costOfGoods: 45,
    hints: {
      brand: 'Danish Modern Unmarked (attributed to Holm Sorensen style)',
      era: '1960s Mid-Century Modern',
      color: 'Warm honey teak wood, natural textured off-white linen',
      material: 'Solid Teak Wood, Brass Finial & Fittings, Woven Oatmeal Linen Shade',
      condition: 'Excellent Vintage (rewired with safe period-correct twisted cord)',
      measurements: 'Total Height: 28", Base Diameter: 7", Shade Diameter: 14"'
    },
    images: [
      {
        name: 'lamp_profile.svg',
        type: 'image/svg+xml',
        role: 'Full Profile',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <defs>
            <linearGradient id="teakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#78350f"/>
              <stop offset="50%" stop-color="#b45309"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>
            <linearGradient id="linenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f5f5f4"/>
              <stop offset="50%" stop-color="#e7e5e4"/>
              <stop offset="100%" stop-color="#d6d3d1"/>
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="#fafaf9"/>
          <!-- Finial -->
          <circle cx="200" cy="50" r="8" fill="#d97706"/>
          <!-- Shade -->
          <polygon points="140,70 260,70 290,190 110,190" fill="url(#linenGrad)" stroke="#a8a29e" stroke-width="2"/>
          <!-- Lamp harp & neck -->
          <rect x="196" y="190" width="8" height="25" fill="#d97706"/>
          <!-- Sculptural Teak Base -->
          <path d="M190,215 Q150,280 180,330 L220,330 Q250,280 210,215 Z" fill="url(#teakGrad)" stroke="#451a03" stroke-width="2"/>
          <!-- Base disc -->
          <ellipse cx="200" cy="340" rx="60" ry="15" fill="#78350f" stroke="#451a03" stroke-width="2"/>
          <text x="200" y="385" font-family="sans-serif" font-size="13" font-weight="bold" fill="#78716c" text-anchor="middle">1960s Mid-Century Teak Lamp</text>
        </svg>`
      }
    ]
  },
  {
    id: 'y2k-distressed-jeans',
    name: 'Vintage Y2K Levi\'s 501 Button Fly Distressed Stonewash Jeans',
    category: 'Clothing / Denim',
    targetPlatform: 'all',
    suggestedPrice: 88,
    costOfGoods: 18,
    hints: {
      brand: 'Levi Strauss & Co. (501 Original)',
      era: 'Late 1990s - Early 2000s Y2K',
      color: 'Light Stonewash Indigo Blue',
      material: '100% Cotton Heavyweight Denim (Non-stretch)',
      condition: 'Naturally distressed, whiskering at thighs, authentic heel fray',
      measurements: 'Tag: 32x34, Actual: Waist 31", Inseam 33", Rise 11.5", Leg opening 8"'
    },
    images: [
      {
        name: 'jeans_flat.svg',
        type: 'image/svg+xml',
        role: 'Flat Lay',
        data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
          <defs>
            <linearGradient id="denimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#93c5fd"/>
              <stop offset="40%" stop-color="#60a5fa"/>
              <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="#f8fafc"/>
          <!-- Waistband -->
          <rect x="130" y="70" width="140" height="25" rx="3" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/>
          <!-- Legs -->
          <path d="M130,95 L110,340 L165,340 L195,170 L205,170 L235,340 L290,340 L270,95 Z" fill="url(#denimGrad)" stroke="#1d4ed8" stroke-width="2"/>
          <!-- Red tab & pocket stitch -->
          <rect x="255" y="115" width="12" height="6" fill="#ef4444"/>
          <path d="M150,110 Q165,130 180,110" stroke="#f59e0b" fill="none" stroke-width="1.5"/>
          <path d="M220,110 Q235,130 250,110" stroke="#f59e0b" fill="none" stroke-width="1.5"/>
          <!-- Whiskering / distress marks -->
          <line x1="140" y1="140" x2="185" y2="148" stroke="#dbeafe" stroke-width="3" stroke-linecap="round"/>
          <line x1="135" y1="160" x2="175" y2="170" stroke="#dbeafe" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="260" y1="140" x2="215" y2="148" stroke="#dbeafe" stroke-width="3" stroke-linecap="round"/>
          <line x1="265" y1="160" x2="225" y2="170" stroke="#dbeafe" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Knee distress -->
          <line x1="125" y1="240" x2="155" y2="242" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <text x="200" y="380" font-family="sans-serif" font-size="13" font-weight="bold" fill="#64748b" text-anchor="middle">Vintage Levi's 501 Button Fly</text>
        </svg>`
      }
    ]
  }
];
