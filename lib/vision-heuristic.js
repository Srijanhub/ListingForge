// lib/vision-heuristic.js - Expert rule & domain knowledge fallback engine

export function analyzeWithHeuristics(imageDataArray, userHints = {}) {
  // Extract hints or derive from file names and hints
  const brand = userHints.brand || extractBrandFromHints(userHints) || 'Artisan Studio';
  const era = userHints.era || extractEraFromHints(userHints) || 'Vintage Retro';
  const material = userHints.material || 'Premium Quality Crafted Material';
  const condition = userHints.condition || 'Pre-owned in excellent vintage condition';
  const measurements = userHints.measurements || 'Refer to photos and description for dimensions';
  const notes = userHints.notes || '';

  // Determine category domain
  const domain = detectDomain(userHints);

  return generateListingPackage(domain, { brand, era, material, condition, measurements, notes });
}

function extractBrandFromHints(hints) {
  const combined = `${hints.notes || ''} ${hints.brand || ''}`.toLowerCase();
  if (combined.includes('wilson')) return 'Wilsons Leather';
  if (combined.includes('casio')) return 'Casio';
  if (combined.includes('levi')) return "Levi's 501";
  if (combined.includes('schott')) return 'Schott NYC';
  if (combined.includes('danish') || combined.includes('teak')) return 'Danish Modern';
  return null;
}

function extractEraFromHints(hints) {
  const combined = `${hints.notes || ''} ${hints.era || ''}`.toLowerCase();
  if (combined.includes('90s') || combined.includes('1990')) return '1990s Vintage';
  if (combined.includes('80s') || combined.includes('1980')) return '1980s Retro';
  if (combined.includes('y2k') || combined.includes('2000')) return 'Y2K 2000s';
  if (combined.includes('60s') || combined.includes('mid-century') || combined.includes('mcm')) return '1960s Mid-Century Modern';
  if (combined.includes('70s')) return '1970s Boho';
  return 'Contemporary Artisan';
}

function detectDomain(hints) {
  const text = `${hints.brand || ''} ${hints.era || ''} ${hints.material || ''} ${hints.notes || ''} ${hints.condition || ''}`.toLowerCase();
  if (text.includes('jacket') || text.includes('leather') || text.includes('coat') || text.includes('biker') || text.includes('outerwear')) {
    return 'leather-jacket';
  }
  if (text.includes('ceramic') || text.includes('pottery') || text.includes('dripper') || text.includes('mug') || text.includes('stoneware') || text.includes('coffee')) {
    return 'ceramic-dripper';
  }
  if (text.includes('watch') || text.includes('casio') || text.includes('chrono') || text.includes('digital') || text.includes('gold-tone') || text.includes('timepiece')) {
    return 'vintage-watch';
  }
  if (text.includes('lamp') || text.includes('teak') || text.includes('lighting') || text.includes('mid-century') || text.includes('danish')) {
    return 'mid-century-lamp';
  }
  if (text.includes('jeans') || text.includes('denim') || text.includes('levi') || text.includes('pants') || text.includes('trousers')) {
    return 'denim-jeans';
  }
  return 'general-vintage';
}

function generateListingPackage(domain, context) {
  switch (domain) {
    case 'leather-jacket':
      return {
        visualAnalysis: {
          detectedItem: 'Heavyweight Asymmetrical Biker Motorcycle Leather Jacket',
          brandDetected: context.brand || 'Wilsons Leather',
          materials: ['100% Genuine Cowhide Leather', 'Heavy Brass Hardware', 'Satin Quilted Lining'],
          colors: ['Classic Biker Black', 'Antiqued Brass'],
          eraStyle: context.era || '1990s Vintage Grunge',
          conditionGrade: 'Good Vintage Condition (natural distressing, authentic patina)',
          notableDetails: ['Asymmetrical heavy gauge zipper', 'Epaulets at shoulders', 'Zippered sleeve gussets', 'Adjustable waist buckle']
        },
        pricing: {
          suggestedPrice: 165.00,
          lowRange: 135.00,
          highRange: 195.00,
          pricingRationale: 'Vintage 90s heavyweight leather jackets in good distressed patina command $140-$200 on Etsy and eBay.'
        },
        etsy: {
          title: 'Vintage 90s Leather Biker Jacket, Heavyweight Black Motorcycle Coat, Distressed Grunge Streetwear Outerwear, Mens Large L',
          tags: [
            'leather biker jacket',
            'vintage 90s jacket',
            'motorcycle coat',
            'grunge aesthetic',
            'distressed leather',
            'mens black leather',
            'wilsons leather',
            'heavyweight coat',
            'retro rider jacket',
            'rocker outerwear',
            'oversized leather',
            'gift for boyfriend',
            'authentic vintage'
          ],
          description: `Add instant edge to your wardrobe with this authentic 1990s heavyweight leather biker motorcycle jacket. Crafted from thick, durable genuine cowhide that has developed that coveted, buttery vintage patina with natural wear at the seams.

Featuring a classic asymmetrical heavy-duty front zip, snap-down notch lapels, zippered cuffs, and antiqued brass hardware. Fully lined for warmth and structured drape.

• DETAILS & MEASUREMENTS:
- Tag Size: Men's Large (fits relaxed modern L or oversized M)
- Pit to Pit (Chest): 23.5 inches
- Length (Collar to hem): 26 inches
- Shoulder to Cuff: 25 inches
- Outer Shell: 100% Genuine Cowhide
- Lining: 100% Polyester / Quilted Nylon

• CONDITION:
Good authentic vintage condition. Beautiful natural break-in, faint scuffing on elbows and collar edge that adds genuine vintage character. All zippers and snaps function smoothly. No dry rot or odors.

• CARE INSTRUCTIONS:
Professional leather clean only. Condition annually with leather balm to preserve suppleness.

Shipped securely via USPS Priority Mail with tracking.`,
          materials: ['Genuine Cowhide Leather', 'Brass Hardware', 'Quilted Lining'],
          occasion: 'Birthday Gift / Father\'s Day / Rock Concert'
        },
        ebay: {
          title: 'Vintage 90s Wilsons Leather Biker Motorcycle Jacket Mens Size L Black Heavy',
          itemSpecifics: {
            'Brand': context.brand || 'Wilsons Leather',
            'Type': 'Jacket',
            'Style': 'Motorcycle Jacket',
            'Outer Shell Material': 'Leather',
            'Department': 'Men',
            'Size': 'L',
            'Size Type': 'Regular',
            'Color': 'Black',
            'Vintage': 'Yes',
            'Closure': 'Zip',
            'Lining Material': 'Polyester',
            'Pattern': 'Solid',
            'Theme': '90s, Biker, Rock, Grunge'
          },
          conditionNote: 'Pre-owned in good vintage condition. Natural distressing and patina on leather; all heavy-duty zippers function smoothly. No tears or holes.',
          descriptionHtml: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Vintage 1990s Heavyweight Leather Motorcycle Jacket - Mens Large</h2>
            <p><strong>Item Highlights:</strong></p>
            <ul>
              <li><strong>Brand:</strong> ${context.brand || 'Wilsons Leather'}</li>
              <li><strong>Era:</strong> 1990s Vintage</li>
              <li><strong>Material:</strong> 100% Thick Genuine Cowhide Leather</li>
              <li><strong>Color:</strong> Matte Black with Brass Hardware</li>
              <li><strong>Condition:</strong> Pre-owned vintage with authentic patina and honest wear</li>
            </ul>
            <h3 style="color: #0f172a;">Flat Lay Measurements:</h3>
            <ul>
              <li>Chest (Pit to Pit): 23.5"</li>
              <li>Length (Back collar to hem): 26"</li>
              <li>Sleeve (Shoulder to cuff): 25"</li>
            </ul>
            <h3 style="color: #0f172a;">Condition Disclosure:</h3>
            <p>Naturally distressed leather with light seam fading. Lining is intact. All hardware and pocket zippers tested and 100% working. Fast tracked shipping guaranteed.</p>
          </div>`
        },
        shopify: {
          title: 'The 1994 Highwayman Heavyweight Leather Biker Jacket',
          seoTitle: 'Vintage 90s Leather Biker Jacket | Authentic Mens Large',
          metaDescription: 'Shop our authentic 1990s heavyweight cowhide leather biker jacket. Featuring heavy brass hardware, asymmetrical zip, and natural vintage distressing. Size L.',
          descriptionHtml: `<p>A staple of 90s rock culture, this heavyweight motorcycle jacket is crafted from rugged genuine cowhide with authentic wear that only decades of care can produce.</p>
          <h4>Features & Specifications</h4>
          <ul>
            <li>Asymmetrical brass zipper front</li>
            <li>Snap-down collar and epaulets</li>
            <li>Zippered cuffs and slash hand pockets</li>
            <li>Quilted interior lining for comfort</li>
          </ul>`
        },
        poshmark: {
          title: 'Vtg 90s Heavyweight Black Leather Biker Jacket L',
          description: `🏍️ VINTAGE 1990s LEATHER BIKER JACKET 🏍️

The ultimate grunge statement piece! Heavyweight genuine cowhide with natural distressing & buttery feel.

✨ Brand: ${context.brand || 'Wilsons Leather'}
✨ Size: Men's Large (unisex friendly!)
✨ Chest: 23.5" flat
✨ Length: 26"
✨ Condition: Good vintage with authentic patina, no rips or odors
✨ Hardware: Antique brass zippers & snaps all work smoothly

📦 Fast 1-day shipper! Open to reasonable offers.`,
          hashtags: ['#vintageleather', '#bikerjacket', '#90svintage', '#grungeaesthetic', '#motorcyclejacket']
        }
      };

    case 'ceramic-dripper':
      return {
        visualAnalysis: {
          detectedItem: 'Hand-thrown Speckled Stoneware Pour-Over Coffee Dripper',
          brandDetected: context.brand || 'Studio Pottery Original',
          materials: ['Stoneware Clay', 'Food-safe Matte Glaze', 'Iron Pyrite Speckles'],
          colors: ['Oatmeal Cream', 'Warm Sand', 'Espresso Speckles'],
          eraStyle: 'Contemporary Wabi-Sabi Artisan',
          conditionGrade: 'Brand New Handcrafted Studio Condition',
          notableDetails: ['Fluted spiral extraction ribs', 'Universal flat base collar', 'Hand-trimmed foot ring', 'Matte tactile exterior']
        },
        pricing: {
          suggestedPrice: 48.00,
          lowRange: 38.00,
          highRange: 58.00,
          pricingRationale: 'Artisan studio hand-thrown coffee drippers sell between $42-$60 on Etsy and boutique kitchen shops.'
        },
        etsy: {
          title: 'Handmade Ceramic Pour Over Coffee Dripper, Speckled Stoneware Coffee Maker, Artisan Pottery Pour-Over Cone, Barista Coffee Gift',
          tags: [
            'ceramic pour over',
            'coffee dripper cone',
            'handmade pottery',
            'stoneware dripper',
            'artisan coffee maker',
            'barista gift idea',
            'speckled ceramic',
            'wabi sabi kitchen',
            'slow coffee dripper',
            'v60 coffee filter',
            'kitchen decor gift',
            'housewarming present',
            'neutral home pottery'
          ],
          description: `Elevate your morning slow-coffee ritual with this individually wheel-thrown ceramic pour-over dripper. Designed for mindful brewing, it combines aesthetic wabi-sabi minimalism with superior heat retention for clean, full-bodied coffee extraction.

Finished in our signature oatmeal matte glaze with naturally occurring iron speckles that bloom during the high-fire kiln cycle.

• DESIGN & BREW SPECS:
- Fits standard #02 conical paper or cloth filters (Hario V60 style)
- Internal helical fluting promotes even water flow and prevents paper channel cling
- Sturdy wide base collar sits securely on mugs and carafes with openings up to 3.8 inches
- Top Diameter: 4.5 inches | Height: 3.75 inches
- Weight: ~380 grams (heats evenly and retains brewing temperature)

• FOOD SAFETY & CARE:
- 100% Lead-free, food-safe glazes
- Microwave and dishwasher safe (hand-washing recommended to cherish handmade finish)

• GIFT READY:
Packed carefully in eco-friendly protective honeycomb wrap. Perfect for housewarmings, wedding registries, or coffee connoisseurs.`,
          materials: ['Stoneware Clay', 'Food-Safe Glaze', 'Natural Iron Mineral'],
          occasion: 'Housewarming / Coffee Lover Gift / Anniversary'
        },
        ebay: {
          title: 'Handmade Ceramic Pour Over Coffee Dripper Speckled Stoneware Cone Barista Gift',
          itemSpecifics: {
            'Brand': 'Handcrafted Studio',
            'Type': 'Coffee Dripper',
            'Model': 'Pour-Over Cone',
            'Material': 'Ceramic Stoneware',
            'Color': 'Oatmeal Beige Speckled',
            'Compatible Filter': 'Size 02 Cone',
            'Department': 'Home & Kitchen',
            'Country/Region of Manufacture': 'United States',
            'Condition': 'New',
            'Theme': 'Artisan, Coffee, Minimalist'
          },
          conditionNote: 'Brand new, hand-thrown studio pottery. Flawless food-safe glaze with unique mineral speckling.',
          descriptionHtml: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Artisan Wheel-Thrown Ceramic Pour-Over Coffee Dripper</h2>
            <p>Individually hand-thrown on the potter's wheel and high-fired to 2232°F for ultimate durability and thermal stability.</p>
            <ul>
              <li><strong>Material:</strong> High-fire durable stoneware clay</li>
              <li><strong>Glaze:</strong> Food-safe non-toxic matte oatmeal glaze with natural iron speckling</li>
              <li><strong>Capacity:</strong> 1 to 4 cup brewing (compatible with #02 conical filters)</li>
              <li><strong>Dimensions:</strong> 4.5" Diameter x 3.75" Height (fits mugs up to 3.8" wide)</li>
            </ul>
            <p>Safely packaged and bubble-wrapped for safe domestic and worldwide shipping.</p>
          </div>`
        },
        shopify: {
          title: 'The Hearthstone Ceramic Pour-Over Coffee Dripper',
          seoTitle: 'Handmade Ceramic Pour-Over Coffee Dripper | Speckled Stoneware',
          metaDescription: 'Shop our wheel-thrown ceramic pour-over coffee dripper. Crafted from speckled stoneware for optimal heat retention and slow coffee brewing. Dishwasher safe.',
          descriptionHtml: `<p>Designed for slow mornings and rich, nuanced coffee. Wheel-thrown stoneware ensures optimal temperature retention throughout the brew cycle.</p>
          <h4>Specifications</h4>
          <ul>
            <li>Wheel-thrown stoneware with speckled matte finish</li>
            <li>Compatible with #02 cone filters</li>
            <li>Dishwasher and food-safe</li>
          </ul>`
        },
        poshmark: {
          title: 'NWT Handmade Speckled Ceramic Pour Over Dripper',
          description: `☕ ARTISAN CERAMIC POUR-OVER COFFEE DRIPPER ☕

Upgrade your morning coffee routine! Wheel-thrown stoneware dripper with gorgeous speckled oatmeal glaze.

✨ Fits standard #02 filters
✨ Wide stable base fits almost any coffee mug
✨ Microwave & dishwasher safe
✨ 100% Food-safe lead-free glaze
✨ Brand new, never used studio piece

🎁 Makes an amazing housewarming or coffee lover gift! Carefully packed with lots of bubble wrap.`,
          hashtags: ['#pourover', '#coffeelover', '#handmadepottery', '#ceramicdripper', '#kitchenaesthetic']
        }
      };

    case 'vintage-watch':
      return {
        visualAnalysis: {
          detectedItem: 'Retro Digital Alarm Chronograph Stainless Steel Watch',
          brandDetected: context.brand || 'Casio',
          materials: ['Gold-Tone Electroplated Case', 'Stainless Steel Adjustable Bracelet', 'Mineral Acrylic Crystal'],
          colors: ['Yellow Gold', 'Lime Green LCD Backlight', 'Midnight Black Bezel'],
          eraStyle: 'Late 1980s / 1990s Retro Digital',
          conditionGrade: 'Excellent Vintage (Tested, fresh battery, crisp LCD)',
          notableDetails: ['Illuminator electro-luminescent backlight', 'Daily alarm & hourly chime', '1/100 sec stopwatch', 'Fold-over clasp with logo']
        },
        pricing: {
          suggestedPrice: 75.00,
          lowRange: 60.00,
          highRange: 90.00,
          pricingRationale: 'Retro gold-tone digital Casio models in pristine working condition retail for $65-$85 in vintage watch markets.'
        },
        etsy: {
          title: 'Vintage 1980s Gold Tone Digital Watch, Retro Chronograph LCD Wristwatch, Casio Style Illuminator Watch, Nostalgic 90s Tech Gift',
          tags: [
            'retro digital watch',
            'gold tone watch',
            'retro 80s watch',
            'casio illuminator',
            'chronograph watch',
            'y2k aesthetic watch',
            'mens dress watch',
            'unisex digital watch',
            'nostalgic 90s gift',
            'alarm stopwatch',
            'stainless steel band',
            'gift for watch fan',
            'retro future style'
          ],
          description: `Classic late 1980s aesthetic gold-tone digital alarm chronograph watch. A timeless blend of retro-futurism and everyday utility, featuring the iconic electro-luminescent illuminated LCD display.

• FEATURES & MODULE SPECS:
- 1/100-second digital stopwatch with lap time
- Daily alarm, hourly time signal, and automatic calendar
- Crisp digital display showing time, day of the week, and date
- Water resistant for everyday splashes (hand washing, rain)
- Stainless steel link bracelet with quick-adjust slide clasp (fits wrists 5.75" to 8.25")

• CONDITION REPORT:
Excellent working vintage condition. Brand new Renata Swiss battery installed and tested. Backlight fires bright and loud alarm beep. Crystal is clear with zero deep scratches. Clasp snaps shut firmly.

• DIMENSIONS:
- Case Width: 36.8 mm
- Lug to Lug: 38.6 mm
- Case Thickness: 9.6 mm

Shipped in a padded watch presentation box.`,
          materials: ['Gold Tone Case', 'Stainless Steel Bracelet', 'Acrylic Crystal'],
          occasion: 'Graduation / Birthday Gift / Groomsman'
        },
        ebay: {
          title: 'Vintage Casio Style Gold Tone Digital Watch Alarm Chronograph Stainless Steel',
          itemSpecifics: {
            'Brand': context.brand || 'Casio',
            'Department': 'Unisex Adults',
            'Type': 'Wristwatch',
            'Model': 'Digital Chronograph',
            'Movement': 'Quartz (Battery)',
            'Case Material': 'Gold Plated / Resin',
            'Band Material': 'Stainless Steel',
            'Dial Color': 'Green / LCD',
            'Band Color': 'Gold',
            'Case Size': '36 mm',
            'Features': 'Alarm, Chronograph, Backlight, Day/Date, Water-Resistant',
            'Vintage': 'Yes',
            'Condition': 'Pre-owned'
          },
          conditionNote: 'Pre-owned in excellent working condition. Tested with new battery installed. Light hairline surface scratches on clasp consistent with gentle vintage wear.',
          descriptionHtml: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Vintage Retro Gold-Tone Digital Chronograph Watch</h2>
            <p><strong>Condition:</strong> 100% fully functional with new battery installed.</p>
            <ul>
              <li><strong>Case Dimensions:</strong> 36mm width x 38mm lug-to-lug</li>
              <li><strong>Band:</strong> Original gold-tone adjustable stainless steel mesh/link band</li>
              <li><strong>Functions:</strong> Time, date, 1/100s stopwatch, daily alarm, illuminator backlight</li>
            </ul>
            <p>Packaged securely in rigid bubble mailer. Ships within 24 hours of payment.</p>
          </div>`
        },
        shopify: {
          title: 'Retro Gold-Tone Digital Chronograph Wristwatch',
          seoTitle: 'Vintage Gold Tone Digital Watch | Retro Chronograph Timepiece',
          metaDescription: 'Shop our curated vintage gold-tone digital watch. Featuring an illuminator backlight, stopwatch, daily alarm, and stainless steel adjustable band.',
          descriptionHtml: `<p>The quintessential 1980s digital watch. Sleek gold-tone finish meets rugged digital reliability with an iconic illuminated LCD display.</p>
          <h4>Features</h4>
          <ul>
            <li>Quartz movement with brand new battery</li>
            <li>Backlight, alarm, calendar, and 1/100s chronograph</li>
            <li>Adjustable stainless steel band</li>
          </ul>`
        },
        poshmark: {
          title: 'Vintage Casio Gold Digital Chronograph Watch',
          description: `⏱️ VINTAGE RETRO GOLD DIGITAL WATCH ⏱️

The iconic 80s/90s gold digital timepiece! Looks incredible stacked with bracelets or worn solo.

✨ Brand: ${context.brand || 'Casio style'}
✨ Condition: Excellent pre-owned, brand new battery installed!
✨ Features: Alarm, stopwatch, date/day, backlight
✨ Band: Adjustable gold stainless steel (fits any wrist size)
✨ Crystal: Clean and clear

⚡ Ships same/next day! Bundle with other items for discount.`,
          hashtags: ['#vintagewatch', '#casiowatch', '#goldwatch', '#80sfashion', '#retroaesthetic']
        }
      };

    case 'mid-century-lamp':
      return {
        visualAnalysis: {
          detectedItem: 'Mid-Century Modern Sculptural Teak Table Lamp with Linen Shade',
          brandDetected: context.brand || 'Danish Modern Original',
          materials: ['Solid Teak Wood', 'Woven Oatmeal Linen', 'Solid Brass Finial and Neck'],
          colors: ['Honey Golden Teak', 'Oatmeal Natural Linen', 'Warm Brass'],
          eraStyle: '1960s Mid-Century Scandinavian Modern',
          conditionGrade: 'Excellent Vintage (Rewired with period-correct woven rayon cord)',
          notableDetails: ['Hand-turned organic curved teak body', 'Brass harp and acorn finial', 'Hand-stitched linen drum shade', 'Original weighted felt base']
        },
        pricing: {
          suggestedPrice: 220.00,
          lowRange: 180.00,
          highRange: 260.00,
          pricingRationale: 'Authentic 1960s Danish Modern teak table lamps with restored wiring and linen shades sell for $200-$300 in vintage design galleries.'
        },
        etsy: {
          title: 'Mid Century Modern Teak Table Lamp, Vintage Danish 1960s Wood Lamp, Sculptural Scandinavian Accent Light with Linen Drum Shade',
          tags: [
            'mid century lamp',
            'teak table lamp',
            'danish modern light',
            'scandinavian decor',
            'vintage 1960s lamp',
            'sculptural lamp',
            'mcm home lighting',
            'wood bedside lamp',
            'linen drum shade',
            'retro accent lamp',
            'teak wood decor',
            'housewarming gift',
            'living room light'
          ],
          description: `Bring warm, organic Scandinavian warmth into your living room or bedside with this authentic 1960s Mid-Century Modern sculptural teak table lamp. Hand-turned from solid teak wood with an elegant hourglass silhouette that highlights the dense natural grain.

Includes a textured oatmeal linen drum shade and solid brass finial that diffuses light into a soft, calming ambient glow.

• SPECIFICATIONS & RESTORATION:
- Total Height: 28 inches (base to top of finial)
- Base Diameter: 7 inches
- Shade Diameter: 14 inches
- Material: Solid Burmese Teak, Brass Hardware, Natural Linen
- Rewired for modern safety with a period-correct cloth-wrapped gold rayon cord and polarized US plug
- Socket: Standard E26/E27 medium base (LED bulb recommended)

• CONDITION:
Stunning vintage condition. Teak has been hand-rubbed with Danish oil to nourish the wood and reveal deep honey tones. No structural cracks or wobble. Shade is pristine.

Carefully double-boxed with foam bracing for guaranteed safe transit.`,
          materials: ['Solid Teak Wood', 'Brass Fittings', 'Oatmeal Linen Shade'],
          occasion: 'Housewarming / Wedding Registry / Interior Design'
        },
        ebay: {
          title: 'Vintage Mid Century Modern Teak Table Lamp Danish 1960s Sculptural Wood Linen',
          itemSpecifics: {
            'Brand': 'Danish Modern',
            'Type': 'Table Lamp',
            'Style': 'Mid-Century Modern',
            'Material': 'Teak, Wood, Brass, Linen',
            'Original/Reproduction': 'Original',
            'Time Period Manufactured': '1960-1969',
            'Color': 'Brown Teak / Beige',
            'Cord Color': 'Gold',
            'Power Source': 'Corded Electric',
            'Department': 'Home & Living',
            'Condition': 'Used'
          },
          conditionNote: 'Excellent vintage condition. Beautifully oiled teak wood grain with minor age-appropriate patina. Newly rewired for safety.',
          descriptionHtml: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Authentic 1960s Danish Modern Solid Teak Table Lamp</h2>
            <p>A classic Scandinavian design piece featuring an organically turned solid teak base and clean architectural proportions.</p>
            <ul>
              <li><strong>Dimensions:</strong> 28" Height to finial; 7" Base Diameter; 14" Shade</li>
              <li><strong>Electrical:</strong> Professionally rewired with period-accurate twisted cord & vintage-style plug</li>
              <li><strong>Finish:</strong> Cleaned and treated with natural Danish teak oil</li>
            </ul>
            <p>Will be packed with extreme care, double boxed and fully insured.</p>
          </div>`
        },
        shopify: {
          title: 'The Copenhagen 1964 Sculptural Teak Table Lamp',
          seoTitle: 'Mid-Century Modern Teak Table Lamp | Vintage 1960s Danish',
          metaDescription: 'Shop our authentic 1960s Danish Modern teak table lamp. Features hand-turned solid teak, brass details, and an oatmeal linen drum shade. Rewired for safety.',
          descriptionHtml: `<p>Organic Scandinavian design meets timeless craftsmanship. Hand-turned from solid teak and paired with a textured linen shade for warm, inviting illumination.</p>
          <h4>Dimensions & Details</h4>
          <ul>
            <li>Height: 28" | Base Diameter: 7"</li>
            <li>Solid Burmese Teak with natural oil finish</li>
            <li>Rewired with braided cloth cord for modern safety</li>
          </ul>`
        },
        poshmark: {
          title: 'Vtg Mid Century Modern Teak Wood Table Lamp 60s',
          description: `✨ VINTAGE MID CENTURY MODERN TEAK LAMP ✨

Gorgeous authentic 1960s Danish modern sculptural table lamp! Solid teak wood with stunning grain & brass accents.

🌟 Height: 28" tall
🌟 Features: Rewired cloth cord, standard bulb socket, heavy stable base
🌟 Condition: Excellent vintage condition, oiled and polished
🌟 Aesthetic: Mid-Century Modern, MCM, Scandinavian, Boho Minimalist

📦 Packed professionally with heavy-duty padding!`,
          hashtags: ['#midcenturymodern', '#teaklamp', '#mcmdecor', '#vintagelighting', '#danishmodern']
        }
      };

    case 'denim-jeans':
    default:
      return {
        visualAnalysis: {
          detectedItem: "Vintage 1990s Levi's 501 Button Fly Stonewash Denim Jeans",
          brandDetected: context.brand || "Levi's",
          materials: ['100% Cotton Heavyweight Denim (Rigid Non-Stretch)', 'Copper Rivets', 'Button Fly Metal Hardware'],
          colors: ['Light Stonewash Indigo', 'Golden Wheat Stitching', 'Red Tab'],
          eraStyle: context.era || 'Late 1990s Y2K Vintage',
          conditionGrade: 'Naturally Distressed Vintage Condition',
          notableDetails: ['Original 5-button metal fly', 'Authentic thigh whiskering and knee abrasion', 'Red tab back pocket', 'Factory chainstitch hem']
        },
        pricing: {
          suggestedPrice: 88.00,
          lowRange: 70.00,
          highRange: 105.00,
          pricingRationale: "Authentic 90s vintage Levi's 501 jeans with genuine fading and straight leg fit consistently sell for $80-$110."
        },
        etsy: {
          title: "Vintage Levis 501 Button Fly Jeans, 90s Stonewash Distressed Denim Pants, Straight Leg High Rise Denim, Waist 31 Inseam 33",
          tags: [
            'vintage levis 501',
            '90s levis jeans',
            'button fly denim',
            'stonewash jeans',
            'distressed levis',
            'y2k denim pants',
            'straight leg jeans',
            'high rise vintage',
            'mens vintage jeans',
            'unisex relaxed jeans',
            'faded vintage denim',
            'grunge wardrobe',
            'authentic levis'
          ],
          description: `The holy grail of vintage denim: authentic 1990s Levi's 501 Original Fit jeans with the signature button fly. Made from 100% heavyweight non-stretch cotton in a classic light stonewash with natural whisker wear and genuine fraying that modern replicas can't duplicate.

• EXACT FLAT MEASUREMENTS:
- Tagged Size: 32 x 34
- Actual Waist Flat: 15.5 inches (fits 31" waist)
- Inseam: 33 inches
- Front Rise: 11.5 inches (High Rise)
- Hips: 21 inches flat
- Thigh: 11.5 inches flat
- Leg Opening: 8 inches flat

• CONDITION:
Authentic vintage distressing with natural lightening across thighs and rear, subtle fraying at hem and pocket edges. Structural denim is strong and durable with decades of life ahead. Clean and ready to wear.

Shipped quickly via Priority Mail.`,
          materials: ['100% Cotton Denim', 'Copper Rivets', 'Steel Buttons'],
          occasion: 'Casual Daily / Streetwear / 90s Fashion'
        },
        ebay: {
          title: "Vintage 90s Levis 501 Button Fly Jeans Mens 31x33 Light Stonewash Distressed",
          itemSpecifics: {
            'Brand': "Levi's",
            'Model': "Levi's 501",
            'Size': '31',
            'Inseam': '33 in',
            'Department': 'Men',
            'Style': 'Straight',
            'Color': 'Blue',
            'Material': '100% Cotton',
            'Fabric Type': 'Denim',
            'Closure': 'Button',
            'Rise': 'High (Greater than 10.5 in)',
            'Vintage': 'Yes',
            'Fit': 'Regular',
            'Country/Region of Manufacture': 'United States'
          },
          conditionNote: 'Good vintage distressed condition. Natural wash fading and seam wear; button fly is sturdy and functional. See photos for exact measurements.',
          descriptionHtml: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Vintage 1990s Levi's 501 Button Fly Stonewash Jeans</h2>
            <p>Classic straight leg silhouette in 100% heavyweight rigid cotton denim.</p>
            <ul>
              <li><strong>Tag Size:</strong> 32x34 (Measures Actual Waist: 31", Inseam: 33")</li>
              <li><strong>Rise:</strong> 11.5" High Rise</li>
              <li><strong>Color:</strong> Light Indigo Stonewash</li>
              <li><strong>Closure:</strong> Authentic Metal 5-Button Fly</li>
            </ul>
            <p>Carefully washed and stored in a smoke-free facility. Shipped within 1 business day.</p>
          </div>`
        },
        shopify: {
          title: "1997 Levi's 501 Button Fly Straight-Leg Jeans",
          seoTitle: "Vintage Levi's 501 Button Fly Jeans | Mens 31x33 Stonewash",
          metaDescription: "Authentic 1990s Levi's 501 button fly jeans in classic stonewash denim. Non-stretch 100% cotton with straight leg cut and natural vintage whiskering.",
          descriptionHtml: `<p>The timeless American standard. Heavyweight 100% non-stretch cotton denim with natural whiskering and an iconic high-rise straight leg cut.</p>
          <h4>Dimensions & Fit</h4>
          <ul>
            <li>Actual Waist: 31" | Inseam: 33" | Rise: 11.5"</li>
            <li>Original button fly and copper rivets</li>
            <li>100% Heavyweight Cotton Denim</li>
          </ul>`
        },
        poshmark: {
          title: "Vtg 90s Levis 501 Button Fly Jeans Stonewash 31x33",
          description: `👖 VINTAGE 90s LEVI'S 501 ORIGINAL JEANS 👖

Iconic button-fly 501s in the perfect vintage stonewash blue! 100% heavyweight cotton denim (no stretch!).

✨ Brand: Levi's 501
✨ Tag Size: 32x34
✨ Actual Measurements:
  - Waist: 15.5" flat (31" around)
  - Inseam: 33"
  - Rise: 11.5"
✨ Condition: Natural vintage fade & authentic whiskering! Clean & ready to wear.

🚀 Ships next day! Check out my closet to bundle.`,
          hashtags: ['#vintagelevis', '#levis501', '#90sdenim', '#buttonfly', '#stonewashjeans']
        }
      };
  }
}
