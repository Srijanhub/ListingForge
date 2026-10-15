// lib/seo-scorer.js - Evaluates listing quality, SEO strength, and compliance

export function auditListing(listing, platform = 'etsy', financials = {}) {
  const issues = [];
  const strengths = [];
  let score = 100;

  const title = (listing.title || '').trim();
  const description = (listing.description || '').trim();
  const tags = Array.isArray(listing.tags) ? listing.tags : [];
  const specifics = listing.itemSpecifics || {};
  const condition = (listing.condition || listing.conditionNote || '').trim();

  // Platform-specific scoring
  if (platform === 'etsy') {
    // Title checks
    if (!title) {
      score -= 30;
      issues.push({ severity: 'critical', text: 'Missing listing title' });
    } else {
      if (title.length < 60) {
        score -= 15;
        issues.push({ severity: 'warning', text: `Title is short (${title.length}/140 chars). Front-load more search keywords.` });
      } else if (title.length > 140) {
        score -= 20;
        issues.push({ severity: 'critical', text: `Title exceeds Etsy limit (${title.length}/140 chars). Will be truncated.` });
      } else {
        strengths.push(`Optimal Etsy title length (${title.length}/140 characters)`);
      }

      if (!title.includes(',') && !title.includes('|') && !title.includes(' - ')) {
        issues.push({ severity: 'info', text: 'Consider separating primary keyword phrases with commas or pipes for readability.' });
      }
    }

    // Tag checks - The golden rule of Etsy
    if (tags.length === 0) {
      score -= 35;
      issues.push({ severity: 'critical', text: 'No search tags provided. Etsy search requires tags.' });
    } else if (tags.length < 13) {
      const missing = 13 - tags.length;
      score -= (missing * 2.5);
      issues.push({ severity: 'warning', text: `Using ${tags.length}/13 tags. Add ${missing} more to maximize Etsy search placement.` });
    } else {
      strengths.push('All 13/13 Etsy tag slots utilized');
    }

    // Tag length checks (strict 20 chars on Etsy)
    const invalidTags = tags.filter(t => t.length > 20);
    if (invalidTags.length > 0) {
      score -= (invalidTags.length * 5);
      issues.push({
        severity: 'critical',
        text: `${invalidTags.length} tag(s) exceed Etsy's strict 20-character limit: ${invalidTags.slice(0, 2).map(t => `"${t}"`).join(', ')}`
      });
    }

    // Description checks
    if (!description || description.length < 100) {
      score -= 15;
      issues.push({ severity: 'warning', text: 'Description is too brief. Include materials, dimensions, and styling suggestions.' });
    } else {
      strengths.push('Rich, descriptive listing story');
      if (description.toLowerCase().includes('dimension') || description.toLowerCase().includes('size') || description.toLowerCase().includes('measure')) {
        strengths.push('Includes exact measurements/sizing');
      } else {
        issues.push({ severity: 'info', text: 'Add exact measurements or sizing specs to reduce return questions.' });
      }
    }

  } else if (platform === 'ebay') {
    // eBay Title: strictly 80 chars max
    if (!title) {
      score -= 35;
      issues.push({ severity: 'critical', text: 'Missing eBay title' });
    } else if (title.length > 80) {
      score -= 30;
      issues.push({ severity: 'critical', text: `Title exceeds eBay 80-char limit (${title.length}/80). eBay Cassini will reject or truncate.` });
    } else if (title.length < 50) {
      score -= 15;
      issues.push({ severity: 'warning', text: `eBay title has unused space (${title.length}/80 chars). Every character is SEO real estate.` });
    } else {
      strengths.push(`Excellent eBay title length (${title.length}/80 chars)`);
    }

    // eBay Item Specifics
    const specCount = Object.keys(specifics).length;
    if (specCount < 4) {
      score -= 20;
      issues.push({ severity: 'warning', text: `Only ${specCount} item specifics. Fill in Brand, Material, Color, Size, and Era for top Cassini ranking.` });
    } else {
      strengths.push(`Complete Item Specifics (${specCount} attributes defined)`);
    }

    // Condition note
    if (!condition || condition.length < 10) {
      score -= 15;
      issues.push({ severity: 'warning', text: 'Condition description missing. A detailed condition note prevents returns and "Item Not As Described" disputes.' });
    } else {
      strengths.push('Explicit condition disclosures included');
    }

  } else if (platform === 'shopify') {
    if (!title) {
      score -= 30;
      issues.push({ severity: 'critical', text: 'Missing product title' });
    } else {
      strengths.push('Clean e-commerce product title');
    }

    if (!listing.metaDescription || listing.metaDescription.length < 60) {
      score -= 15;
      issues.push({ severity: 'warning', text: 'Meta description missing or short. Optimal length is 130-160 characters for Google SERP.' });
    } else if (listing.metaDescription.length > 165) {
      score -= 10;
      issues.push({ severity: 'warning', text: `Meta description is ${listing.metaDescription.length} chars (Google truncates past 160).` });
    } else {
      strengths.push('Google SEO meta description optimized');
    }
  }

  // Financial health / Margin check
  const price = Number(financials.price || listing.price || 0);
  const cog = Number(financials.costOfGoods || 0);
  const shipping = Number(financials.shippingCost || 0);

  let marginData = null;
  if (price > 0) {
    let platformFeePct = 0.065; // Etsy ~6.5% + payment
    let fixedFee = 0.45;
    if (platform === 'ebay') {
      platformFeePct = 0.1325; // eBay ~13.25%
      fixedFee = 0.30;
    } else if (platform === 'shopify') {
      platformFeePct = 0.029; // Stripe 2.9%
      fixedFee = 0.30;
    }

    const estimatedFees = (price * platformFeePct) + fixedFee;
    const totalCost = cog + shipping + estimatedFees;
    const netProfit = price - totalCost;
    const marginPct = (netProfit / price) * 100;

    marginData = {
      price,
      costOfGoods: cog,
      shipping,
      estimatedFees: Number(estimatedFees.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      marginPct: Number(marginPct.toFixed(1))
    };

    if (marginPct < 25 && cog > 0) {
      issues.push({ severity: 'warning', text: `Estimated profit margin is low (${marginPct.toFixed(1)}%). Consider pricing higher to protect profits.` });
    } else if (marginPct >= 50) {
      strengths.push(`Strong projected profit margin (${marginPct.toFixed(1)}%)`);
    }
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  let grade = 'A';
  if (finalScore < 60) grade = 'F';
  else if (finalScore < 70) grade = 'D';
  else if (finalScore < 80) grade = 'C';
  else if (finalScore < 90) grade = 'B';

  return {
    score: finalScore,
    grade,
    platform,
    strengths,
    issues,
    marginData
  };
}
