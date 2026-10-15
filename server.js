// server.js - ListingForge Web & API Server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';

import { checkOllamaStatus } from './lib/ollama-adapter.js';
import { processListingGeneration } from './lib/ai-engine.js';
import { auditListing } from './lib/seo-scorer.js';
import { exportEtsyCsv, exportEbayCsv, exportShopifyCsv } from './lib/exporters.js';
import { PRESETS } from './lib/presets.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer memory storage for direct image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// 1. Health check & model discovery endpoint
app.get('/api/status', async (req, res) => {
  try {
    const ollamaStatus = await checkOllamaStatus(OLLAMA_HOST);
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      ollama: ollamaStatus,
      defaultEngine: ollamaStatus.online ? 'ollama' : 'heuristic'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Preset sample items for instant 1-click evaluation
app.get('/api/presets', (req, res) => {
  res.json({ presets: PRESETS });
});

// 3. File upload endpoint (converts uploaded files to base64 data URIs)
app.post('/api/upload', upload.array('photos', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const processedImages = req.files.map(file => {
      const mime = file.mimetype || 'image/jpeg';
      const base64 = file.buffer.toString('base64');
      return {
        name: file.originalname,
        mimeType: mime,
        size: file.size,
        data: `data:${mime};base64,${base64}`
      };
    });

    res.json({ images: processedImages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Primary listing generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      engine = 'auto',
      model = null,
      images = [],
      userHints = {},
      financials = {}
    } = req.body;

    const result = await processListingGeneration({
      engine,
      model,
      ollamaHost: OLLAMA_HOST,
      hfToken: process.env.HF_TOKEN || null,
      images,
      userHints,
      financials
    });

    res.json(result);
  } catch (err) {
    console.error('[API /api/generate error]', err);
    res.status(500).json({
      error: err.message,
      help: 'If running with local Ollama, verify that Ollama is started with `ollama serve` and your vision model is downloaded.'
    });
  }
});

// 5. Real-time listing audit and margin calculator endpoint
app.post('/api/audit', (req, res) => {
  try {
    const { listing, platform = 'etsy', financials = {} } = req.body;
    if (!listing) {
      return res.status(400).json({ error: 'Missing listing object to audit' });
    }

    const audit = auditListing(listing, platform, financials);
    res.json({ audit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Bulk batch processing endpoint
app.post('/api/batch', async (req, res) => {
  try {
    const { items = [], engine = 'auto', model = null } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Empty batch queue' });
    }

    const processed = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const result = await processListingGeneration({
        engine,
        model,
        ollamaHost: OLLAMA_HOST,
        hfToken: process.env.HF_TOKEN || null,
        images: item.images || [],
        userHints: item.hints || {},
        financials: {
          price: item.suggestedPrice || 45,
          costOfGoods: item.costOfGoods || 10
        }
      });
      processed.push({
        id: item.id || `batch-${i + 1}`,
        name: item.name || `Item ${i + 1}`,
        ...result
      });
    }

    res.json({ processed, count: processed.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Platform export endpoint (CSV generation)
app.post('/api/export/:platform', (req, res) => {
  try {
    const { platform } = req.params;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided for export' });
    }

    let csvContent = '';
    let filename = `listingforge_${platform}_${Date.now()}.csv`;

    switch (platform.toLowerCase()) {
      case 'etsy':
        csvContent = exportEtsyCsv(items);
        break;
      case 'ebay':
        csvContent = exportEbayCsv(items);
        break;
      case 'shopify':
        csvContent = exportShopifyCsv(items);
        break;
      default:
        return res.status(400).json({ error: `Unsupported platform export: ${platform}` });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🚀 ListingForge Server Running`);
  console.log(`  📍 Local Web Studio: http://localhost:${PORT}`);
  console.log(`  🤖 Local Ollama Host: ${OLLAMA_HOST}`);
  console.log(`======================================================\n`);
});
