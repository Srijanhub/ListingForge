// lib/ai-engine.js - Unified Open AI Engine Coordinator

import { checkOllamaStatus, generateWithOllama } from './ollama-adapter.js';
import { generateWithHuggingFace } from './hf-adapter.js';
import { analyzeWithHeuristics } from './vision-heuristic.js';
import { SYSTEM_VISION_PROMPT, buildUserPrompt } from './prompts.js';
import { auditListing } from './seo-scorer.js';

export async function processListingGeneration({
  engine = 'auto',
  model = null,
  ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
  hfToken = process.env.HF_TOKEN || null,
  images = [],
  userHints = {},
  financials = {}
}) {
  let result = null;
  let engineUsed = engine;
  let modelUsed = model;

  const userPrompt = buildUserPrompt(userHints);

  // Auto-detect engine if requested
  if (engine === 'auto') {
    const ollamaStatus = await checkOllamaStatus(ollamaHost);
    if (ollamaStatus.online && (ollamaStatus.visionModels.length > 0 || ollamaStatus.allModels.length > 0)) {
      engine = 'ollama';
      model = model || ollamaStatus.recommendedModel;
    } else {
      engine = 'heuristic';
    }
  }

  // Execute selected engine with smart fallback
  if (engine === 'ollama') {
    try {
      result = await generateWithOllama({
        host: ollamaHost,
        model: model || 'llama3.2-vision',
        images,
        userPrompt,
        systemPrompt: SYSTEM_VISION_PROMPT
      });
      engineUsed = 'ollama';
      modelUsed = model || 'llama3.2-vision';
    } catch (ollamaErr) {
      console.warn(`[ListingForge] Ollama call failed (${ollamaErr.message}). Falling back to Neural Heuristic Engine.`);
      result = analyzeWithHeuristics(images, userHints);
      engineUsed = 'heuristic (fallback)';
      modelUsed = 'Domain Knowledge Rule Engine';
    }
  } else if (engine === 'hf') {
    try {
      result = await generateWithHuggingFace({
        model: model || 'Qwen/Qwen2-VL-7B-Instruct',
        token: hfToken,
        images,
        userPrompt,
        systemPrompt: SYSTEM_VISION_PROMPT
      });
      engineUsed = 'hf';
      modelUsed = model || 'Qwen/Qwen2-VL-7B-Instruct';
    } catch (hfErr) {
      console.warn(`[ListingForge] Hugging Face call failed (${hfErr.message}). Falling back to Neural Heuristic Engine.`);
      result = analyzeWithHeuristics(images, userHints);
      engineUsed = 'heuristic (fallback)';
      modelUsed = 'Domain Knowledge Rule Engine';
    }
  } else {
    // Neural Heuristic Engine
    result = analyzeWithHeuristics(images, userHints);
    engineUsed = 'heuristic';
    modelUsed = 'Domain Knowledge Rule Engine';
  }

  // Ensure robust fallback data for missing fields
  result = normalizeListingOutput(result, userHints);

  // Compute live SEO & Marketplace strength scores
  const etsyAudit = auditListing(result.etsy, 'etsy', {
    price: financials.price || result.pricing?.suggestedPrice,
    costOfGoods: financials.costOfGoods,
    shippingCost: financials.shippingCost
  });

  const ebayAudit = auditListing(result.ebay, 'ebay', {
    price: financials.price || result.pricing?.suggestedPrice,
    costOfGoods: financials.costOfGoods,
    shippingCost: financials.shippingCost
  });

  const shopifyAudit = auditListing(result.shopify, 'shopify', {
    price: financials.price || result.pricing?.suggestedPrice,
    costOfGoods: financials.costOfGoods,
    shippingCost: financials.shippingCost
  });

  return {
    ...result,
    metadata: {
      generatedAt: new Date().toISOString(),
      engineUsed,
      modelUsed,
      imageCount: images.length
    },
    audits: {
      etsy: etsyAudit,
      ebay: ebayAudit,
      shopify: shopifyAudit
    }
  };
}

function normalizeListingOutput(data, userHints) {
  const norm = { ...data };

  norm.visualAnalysis = norm.visualAnalysis || {
    detectedItem: userHints.brand ? `${userHints.brand} Item` : 'Handcrafted Vintage Item',
    brandDetected: userHints.brand || 'Unbranded',
    materials: userHints.material ? [userHints.material] : ['Mixed Materials'],
    colors: ['Neutral'],
    eraStyle: userHints.era || 'Vintage',
    conditionGrade: userHints.condition || 'Pre-owned Good Condition',
    notableDetails: ['Clean finish', 'Well preserved']
  };

  norm.pricing = norm.pricing || {
    suggestedPrice: 45.00,
    lowRange: 35.00,
    highRange: 60.00,
    pricingRationale: 'Estimated based on average category sales.'
  };

  norm.etsy = norm.etsy || {
    title: 'Vintage Handcrafted Item, Unique Retro Piece, Perfect Gift',
    tags: ['vintage gift', 'retro item', 'handmade decor', 'unique find', 'artisan piece', 'rare collectible', 'retro aesthetic', 'special gift', 'curated vintage', 'gift for home', 'statement piece', 'sustainable style', 'eclectic decor'],
    description: 'A beautiful item carefully inspected and packaged.',
    materials: norm.visualAnalysis.materials,
    occasion: 'Everyday / Gift'
  };

  // Enforce Etsy tag rules: strictly 13 tags, each <= 20 chars
  if (Array.isArray(norm.etsy.tags)) {
    norm.etsy.tags = norm.etsy.tags
      .map(t => String(t).trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 20))
      .filter(t => t.length > 0)
      .slice(0, 13);
  }

  // Enforce Etsy title length <= 140
  if (norm.etsy.title && norm.etsy.title.length > 140) {
    norm.etsy.title = norm.etsy.title.slice(0, 140);
  }

  norm.ebay = norm.ebay || {
    title: 'Vintage Item Good Condition Retro Collectible',
    itemSpecifics: {
      'Brand': norm.visualAnalysis.brandDetected || 'Unbranded',
      'Type': 'Item',
      'Condition': 'Pre-owned'
    },
    conditionNote: 'Pre-owned in good condition.',
    descriptionHtml: '<p>Quality vintage piece. Please view photos.</p>'
  };

  // Enforce eBay title <= 80 chars
  if (norm.ebay.title && norm.ebay.title.length > 80) {
    norm.ebay.title = norm.ebay.title.slice(0, 80);
  }

  norm.shopify = norm.shopify || {
    title: norm.etsy.title ? norm.etsy.title.split(',')[0] : 'Curated Vintage Piece',
    seoTitle: 'Curated Vintage Collectible | Shop Online',
    metaDescription: 'Shop our curated collection of vintage and artisan goods. Fast shipping and guaranteed authenticity.',
    descriptionHtml: `<p>${norm.etsy.description}</p>`
  };

  norm.poshmark = norm.poshmark || {
    title: (norm.ebay.title || 'Curated Vintage Item').slice(0, 50),
    description: `✨ CURATED ITEM ✨\n\n${norm.etsy.description.slice(0, 300)}...\n\n📦 Ships fast!`,
    hashtags: ['#vintage', '#resale', '#curated', '#sustainablefashion', '#thriftfind']
  };

  return norm;
}
