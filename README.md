# ListingForge ⚡
### Open-Weight AI E-Commerce Listing Studio for Etsy, eBay, Shopify & Poshmark

> **Turn product photos into polished, platform-optimized, top-ranking listings in seconds using 100% open-weight vision & language models.**

---

## 💡 Why Someone Would Actually Pay For This

Every day, millions of independent e-commerce sellers—vintage pickers, Etsy artisans, boutique owners, and full-time eBay resellers—face the same grueling bottleneck:

* **The Problem:** Photographing products is fast, but writing listings is excruciating. Crafting high-converting SEO titles, researching 13 Etsy search tags under 20 characters, filling out eBay's algorithmic Item Specifics, and writing dispute-proof condition notes takes **15 to 30 minutes per item**.
* **The Cost of Bad Listings:** Missing tags mean zero Etsy search impressions. Vague condition disclosures cause painful "Item Not As Described" returns. Suboptimal titles get buried by the eBay Cassini algorithm.
* **Why Cloud AI Fails Sellers:** Cloud APIs (GPT-4o, Claude Sonnet) cost \$0.15–\$0.25 per multi-photo item. For a seller listing 100 items a week, API bills eat into tight margins. Furthermore, sellers photographing proprietary handcrafted creations or rare collectibles refuse to upload unreleased designs to big-tech training silos.

### 💰 The Business Model & Willingness to Pay
* **The Value:** Cuts listing time from **20 minutes to 30 seconds** per product. For an active seller listing 25 items a week, ListingForge saves **7+ hours every single week**.
* **Pricing Model:**
  * **SaaS Subscription:** \$19 / month (Solopreneur) or \$39 / month (Power Reseller with unlimited batch queue).
  * **One-Time Desktop License:** \$49 lifetime license (similar to iconic Mac productivity utilities).
* **Zero Marginal Cost:** Because inference runs on **open-weight models locally** (via Ollama or local ONNX), operating cost per listing is virtually **\$0.00**.

---

## 🧠 Open-Weight & Open-Source AI Architecture

ListingForge is built from the ground up around open-source AI frameworks and open-weight models:

```
┌────────────────────────────────────────────────────────┐
│                   ListingForge Studio                  │
│       Multi-Photo Uploader • Batch Queue • Exporter    │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  Local Ollama Engine  │       │ Built-in Domain Engine│
│ (100% On-Device VLM)  │       │ (Zero-Setup Fallback) │
├───────────────────────┤       ├───────────────────────┤
│ • llama3.2-vision     │       │ • Visual Heuristics   │
│ • qwen2-vl            │       │ • Category Taxonomies │
│ • moondream           │       │ • 5 Instant Presets   │
│ • llava               │       │ • Margin Calculator   │
└───────────────────────┘       └───────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│              Marketplace Optimization Core             │
├────────────────────────────────────────────────────────┤
│ • Etsy 13-Tag Engine (Strict 20-char limit validation) │
│ • eBay Cassini Engine (Strict 80-char title limit)     │
│ • Dispute-Proof Condition Shield                       │
│ • Real-time SEO Listing Strength Score (0-100)         │
│ • Bulk CSV Exporters (Etsy / eBay MIP / Shopify)       │
└────────────────────────────────────────────────────────┘
```

1. **Local Ollama Inference**:
   - Integrates directly with local Ollama (`http://127.0.0.1:11434`).
   - Supports cutting-edge open-weight vision-language models: **Llama 3.2 Vision**, **Qwen2-VL**, **Moondream2**, and **LLaVA**.
   - Multi-modal base64 image ingestion directly analyzes textures, fabrics, markings, labels, and physical defects.
2. **Hugging Face Open-Weight Router**:
   - Direct connection to open-weight models hosted on Hugging Face (e.g. `Qwen/Qwen2-VL-7B-Instruct`).
3. **Built-in Domain Knowledge Engine**:
   - Features rich e-commerce heuristics, vintage dating rubrics, and category taxonomy rules.
   - Operates 100% out of the box with zero external downloads, providing immediate value for first-time evaluators.

---

## 🚀 Key Features

* **Platform-Tailored Listing Generation**:
  * **Etsy Studio**: Front-loaded SEO title, sensory storytelling description, care instructions, and **exactly 13 search tags** strictly validated under Etsy's 20-character limit.
  * **eBay Cassini Optimizer**: Keyword-dense title strictly capped at **80 characters**, structured **Item Specifics** table (Brand, Material, Color, Department, Style, Era), and a dispute-proof condition description to stop returns.
  * **Shopify & Standalone**: Google SERP meta title & 150-char meta description, plus formatted HTML product descriptions.
  * **Poshmark & Mercari**: Emoji-formatted mobile bullets with flat measurements and trending hashtags.
* **Listing Strength & SEO Quality Auditor (0-100 Score)**:
  * Grades listings (A through F) in real-time as you type.
  * Checks keyword density, character limits, tag counts, and condition disclosures.
* **Pricing & Profit Margin Calculator**:
  * Accounts for platform transaction fees (Etsy 6.5%, eBay ~13.25%, Shopify 2.9%), Cost of Goods (COG), and shipping to estimate true net profit and margin %.
* **Instant Demo Presets**:
  * 5 pre-configured demo products with SVG mockups for immediate 1-click evaluation:
    1. *Vintage 1990s Schott/Wilson Leather Biker Jacket*
    2. *Handmade Ceramic Speckled Pour-Over Dripper*
    3. *Retro 1980s Casio A168W Gold Digital Chronograph Watch*
    4. *1960s Mid-Century Modern Danish Teak Table Lamp*
    5. *Vintage Levi's 501 Stonewash Distressed Denim Jeans*
* **Batch Processing & Direct Export**:
  * Queue multiple items and process sequentially.
  * 1-Click export to **Etsy CSV**, **eBay File Exchange CSV**, **Shopify Products CSV**, or **Full JSON**.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- *(Optional for local AI)*: [Ollama](https://ollama.com) installed and running.

### 2. Installation
```bash
# Clone or navigate to the project directory
cd Hacktober

# Install dependencies
npm install
```

### 3. Run the Studio
```bash
npm start
```

Open your browser to:
👉 **`http://localhost:3000`**

---

## 🤖 Running with Local Open-Weight Models (Ollama)

To run 100% locally and offline:

1. Download and start [Ollama](https://ollama.com).
2. Pull any open-weight vision model:
   ```bash
   # Option A: Meta Llama 3.2 Vision (Recommended for highest accuracy)
   ollama run llama3.2-vision

   # Option B: Moondream2 (Ultra-fast, lightweight 1.8B model)
   ollama run moondream

   # Option C: Qwen2-VL
   ollama run qwen2-vl
   ```
3. Refresh `http://localhost:3000` — ListingForge will automatically detect your local model and switch to it!

---

## 🧪 Running Automated Tests

ListingForge includes a comprehensive 63-point test suite covering platform constraints, SEO audits, heuristic accuracy, and CSV formatting:

```bash
node test.js
```

Result:
```
==========================================
Test Results: 63 passed, 0 failed
==========================================
```

---

## 📂 Project Structure

```
Hacktober/
├── server.js               # Express API & Static Server
├── package.json            # Node.js manifest & dependencies
├── test.js                 # Automated 63-point test suite
├── README.md               # Documentation & architecture guide
├── .env.example            # Environment template
├── lib/
│   ├── ai-engine.js        # AI Coordinator (Ollama / HF / Heuristics)
│   ├── ollama-adapter.js   # Local Ollama client & model discovery
│   ├── hf-adapter.js       # Hugging Face open-weight router
│   ├── vision-heuristic.js # Expert domain knowledge & visual rules
│   ├── prompts.js          # Production prompt templates & constraints
│   ├── seo-scorer.js       # 0-100 Listing Strength & profit auditor
│   ├── exporters.js        # Etsy, eBay & Shopify CSV generators
│   └── presets.js          # 5 rich demo items with SVG mockups
└── public/
    ├── index.html          # Modern, responsive Studio UI
    ├── css/styles.css      # Custom styling, transitions, glassmorphism
    └── js/
        ├── api.js          # Frontend REST API client
        └── app.js          # UI controller, live audits, tag manager
```

---

## 📜 License
MIT License. Open-source and ready for commercial deployment.
