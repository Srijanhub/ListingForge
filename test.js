// test.js - Comprehensive test suite for ListingForge modules
import { PRESETS } from './lib/presets.js';
import { auditListing } from './lib/seo-scorer.js';
import { exportEtsyCsv, exportEbayCsv, exportShopifyCsv } from './lib/exporters.js';
import { analyzeWithHeuristics } from './lib/vision-heuristic.js';
import { processListingGeneration } from './lib/ai-engine.js';

console.log('🧪 Running ListingForge Test Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  // 1. Presets validation
  console.log('--- Testing Presets ---');
  assert(PRESETS.length === 5, `Expected 5 demo presets, got ${PRESETS.length}`);
  PRESETS.forEach(p => {
    assert(p.id && p.name && p.suggestedPrice > 0, `Preset ${p.id} has valid attributes`);
    assert(p.images && p.images.length > 0, `Preset ${p.id} has mockup images`);
  });

  // 2. Vision Heuristic & Domain Knowledge
  console.log('\n--- Testing Vision Heuristic Engine ---');
  for (const preset of PRESETS) {
    const listing = analyzeWithHeuristics(preset.images, preset.hints);
    assert(listing.visualAnalysis && listing.visualAnalysis.detectedItem, `${preset.id}: Visual analysis generated item`);
    assert(listing.etsy && listing.etsy.title.length <= 140, `${preset.id}: Etsy title <= 140 chars (${listing.etsy.title.length})`);
    assert(listing.etsy.tags.length === 13, `${preset.id}: Exactly 13 Etsy tags generated (${listing.etsy.tags.length})`);
    
    // Check Etsy tag length limit
    const longTags = listing.etsy.tags.filter(t => t.length > 20);
    assert(longTags.length === 0, `${preset.id}: All 13 Etsy tags <= 20 chars`);

    // Check eBay Title limit
    assert(listing.ebay && listing.ebay.title.length <= 80, `${preset.id}: eBay title <= 80 chars (${listing.ebay.title.length})`);
    assert(Object.keys(listing.ebay.itemSpecifics).length >= 5, `${preset.id}: eBay item specifics generated`);

    // Check Shopify Meta description
    assert(listing.shopify && listing.shopify.metaDescription.length <= 165, `${preset.id}: Shopify meta description valid`);

    // Check Poshmark
    assert(listing.poshmark && listing.poshmark.hashtags.length >= 3, `${preset.id}: Poshmark hashtags generated`);
  }

  // 3. SEO Scorer & Margin Calculation
  console.log('\n--- Testing SEO Scorer & Profit Estimator ---');
  const sampleListing = analyzeWithHeuristics([], { brand: 'Wilson', era: '1990s', notes: 'leather biker jacket' });
  const etsyAudit = auditListing(sampleListing.etsy, 'etsy', { price: 165, costOfGoods: 35, shippingCost: 0 });
  assert(etsyAudit.score >= 80, `Etsy listing receives high quality score (${etsyAudit.score}/100)`);
  assert(etsyAudit.marginData && etsyAudit.marginData.netProfit > 100, `Profit calculation correct ($${etsyAudit.marginData.netProfit})`);

  const ebayAudit = auditListing(sampleListing.ebay, 'ebay', { price: 165, costOfGoods: 35 });
  assert(ebayAudit.score >= 80, `eBay listing receives high quality score (${ebayAudit.score}/100)`);

  // Test violation catching
  const badEtsy = { title: 'Short', tags: ['one tag only', 'this tag is way too long for etsy to accept'] };
  const badAudit = auditListing(badEtsy, 'etsy', {});
  assert(badAudit.score < 70, `Penalized incomplete listing (${badAudit.score}/100)`);
  assert(badAudit.issues.length >= 2, `Detected multiple SEO compliance issues (${badAudit.issues.length})`);

  // 4. CSV Exporters
  console.log('\n--- Testing CSV Exporters ---');
  const items = [sampleListing];
  const etsyCsv = exportEtsyCsv(items);
  assert(etsyCsv.includes('Title,Description,Price'), 'Etsy CSV contains valid headers');
  assert(etsyCsv.includes('165'), 'Etsy CSV contains item price');

  const ebayCsv = exportEbayCsv(items);
  assert(ebayCsv.includes('*Action(SiteID=US'), 'eBay CSV contains File Exchange headers');

  const shopifyCsv = exportShopifyCsv(items);
  assert(shopifyCsv.includes('Handle,Title,Body (HTML)'), 'Shopify CSV contains valid headers');

  // 5. Unified AI Engine Coordinator
  console.log('\n--- Testing AI Coordinator Execution ---');
  const engineResult = await processListingGeneration({
    engine: 'heuristic',
    images: PRESETS[0].images,
    userHints: PRESETS[0].hints,
    financials: { price: 165, costOfGoods: 35 }
  });
  assert(engineResult.audits && engineResult.audits.etsy, 'AI Coordinator returns audits for Etsy');
  assert(engineResult.audits.ebay, 'AI Coordinator returns audits for eBay');
  assert(engineResult.metadata && engineResult.metadata.engineUsed, 'AI Coordinator attaches generation metadata');

  console.log(`\n==========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
