// public/js/app.js - Main Application Controller for ListingForge

document.addEventListener('DOMContentLoaded', () => {
  // Global App State
  const state = {
    uploadedImages: [], // array of { name, data, role, size }
    currentListing: null, // active listing object
    activePlatform: 'etsy',
    presets: [],
    batchQueue: [],
    ollamaStatus: null,
    auditDebounceTimer: null
  };

  // DOM Elements
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const thumbnailsGallery = document.getElementById('thumbnails-gallery');
  const clearPhotosBtn = document.getElementById('clear-photos-btn');
  const presetsContainer = document.getElementById('presets-container');
  const forgeBtn = document.getElementById('forge-btn');
  const addToQueueBtn = document.getElementById('add-to-queue-btn');
  const emptyState = document.getElementById('empty-state');
  const loadingState = document.getElementById('loading-state');
  const outputWorkspace = document.getElementById('output-workspace');

  // Accordion & Controls
  const contextToggleBtn = document.getElementById('context-toggle-btn');
  const contextContent = document.getElementById('context-content');
  const contextChevron = document.getElementById('context-chevron');
  const engineSelector = document.getElementById('engine-selector');
  const engineStatusBtn = document.getElementById('engine-status-btn');
  const engineStatusLabel = document.getElementById('engine-status-label');
  const engineDot = document.getElementById('engine-dot');

  // Modals
  const helpModal = document.getElementById('help-modal');
  const helpModalBtn = document.getElementById('help-modal-btn');
  const closeHelpModal = document.getElementById('close-help-modal');
  const batchModal = document.getElementById('batch-modal');
  const batchToggleBtn = document.getElementById('batch-toggle-btn');
  const closeBatchModal = document.getElementById('close-batch-modal');
  const batchCountBadge = document.getElementById('batch-count-badge');
  const batchModalCount = document.getElementById('batch-modal-count');
  const batchItemsList = document.getElementById('batch-items-list');
  const runBatchBtn = document.getElementById('run-batch-btn');
  const clearBatchBtn = document.getElementById('clear-batch-btn');

  // Audit Elements
  const auditBanner = document.getElementById('audit-banner');
  const auditScoreCircle = document.getElementById('audit-score-circle');
  const auditGradePill = document.getElementById('audit-grade-pill');
  const auditSummaryText = document.getElementById('audit-summary-text');
  const toggleAuditDetailsBtn = document.getElementById('toggle-audit-details-btn');
  const auditDetailsDrawer = document.getElementById('audit-details-drawer');
  const auditStrengthsList = document.getElementById('audit-strengths-list');
  const auditIssuesList = document.getElementById('audit-issues-list');

  // Initialize
  initApp();

  async function initApp() {
    setupEventListeners();
    await checkEngineStatus();
    await loadPresets();
    lucide.createIcons();
  }

  // Probe backend and local Ollama
  async function checkEngineStatus() {
    try {
      const data = await API.getStatus();
      state.ollamaStatus = data.ollama;

      if (data.ollama && data.ollama.online) {
        engineDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
        const modelName = data.ollama.recommendedModel || 'Local Ollama';
        engineStatusLabel.textContent = `Ollama: ${modelName}`;
        
        // Populate engine selector with local models
        const optGroup = document.createElement('optgroup');
        optGroup.label = 'Local Ollama Models';
        (data.ollama.allModels || []).forEach(m => {
          const opt = document.createElement('option');
          opt.value = `ollama:${m}`;
          opt.textContent = `Ollama: ${m} ${data.ollama.visionModels.includes(m) ? '(Vision)' : ''}`;
          optGroup.appendChild(opt);
        });
        engineSelector.appendChild(optGroup);
      } else {
        engineDot.className = 'w-2 h-2 rounded-full bg-sky-400';
        engineStatusLabel.textContent = 'Neural Heuristic Active';
      }
    } catch (err) {
      engineDot.className = 'w-2 h-2 rounded-full bg-amber-400';
      engineStatusLabel.textContent = 'Built-in Engine';
    }
  }

  // Load demo presets
  async function loadPresets() {
    try {
      const { presets } = await API.getPresets();
      state.presets = presets;
      renderPresetChips(presets);
    } catch (err) {
      presetsContainer.innerHTML = '<span class="text-xs text-red-400">Failed to load presets</span>';
    }
  }

  function renderPresetChips(presets) {
    presetsContainer.innerHTML = '';
    presets.forEach(preset => {
      const chip = document.createElement('button');
      chip.className = 'px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-emerald-500/20 hover:border-emerald-500/50 border border-slate-700 text-xs text-slate-300 font-medium transition-all flex items-center gap-1.5 active:scale-95';
      chip.innerHTML = `<span>⚡</span><span>${preset.name.split(' ').slice(0, 3).join(' ')}...</span>`;
      chip.title = preset.name;
      chip.addEventListener('click', () => loadPresetItem(preset));
      presetsContainer.appendChild(chip);
    });
  }

  function loadPresetItem(preset) {
    // Populate photos
    state.uploadedImages = preset.images.map(img => ({
      name: img.name,
      data: img.data,
      role: img.role || 'Angle'
    }));
    renderThumbnails();

    // Populate seller context inputs
    if (preset.hints) {
      document.getElementById('hint-brand').value = preset.hints.brand || '';
      document.getElementById('hint-era').value = preset.hints.era || '';
      document.getElementById('hint-material').value = preset.hints.material || '';
      document.getElementById('hint-condition').value = preset.hints.condition || '';
      document.getElementById('hint-measurements').value = preset.hints.measurements || '';
    }

    // Populate pricing
    if (preset.suggestedPrice) {
      document.getElementById('fin-price').value = preset.suggestedPrice;
    }
    if (preset.costOfGoods) {
      document.getElementById('fin-cog').value = preset.costOfGoods;
    }

    showToast(`Loaded preset: ${preset.name}`, 'info');

    // Automatically trigger generation for instant satisfaction!
    handleForgeClick();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Dropzone events
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
      });
    });

    dropzone.addEventListener('drop', handleFileDrop);

    clearPhotosBtn.addEventListener('click', () => {
      state.uploadedImages = [];
      renderThumbnails();
      fileInput.value = '';
    });

    // Context Accordion
    contextToggleBtn.addEventListener('click', () => {
      const isHidden = contextContent.classList.contains('hidden');
      if (isHidden) {
        contextContent.classList.remove('hidden');
        contextChevron.classList.add('rotate-180');
      } else {
        contextContent.classList.add('hidden');
        contextChevron.classList.remove('rotate-180');
      }
    });

    // Main Forge Button
    forgeBtn.addEventListener('click', handleForgeClick);

    // Platform Tab Switching
    document.querySelectorAll('.platform-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const platform = tab.dataset.platform;
        switchPlatformTab(platform);
      });
    });

    // Tag manager: input keydown (Enter to add)
    const newTagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagCharCounter = document.getElementById('tag-char-counter');

    newTagInput.addEventListener('input', (e) => {
      tagCharCounter.textContent = `${e.target.value.length}/20`;
      if (e.target.value.length >= 20) {
        tagCharCounter.classList.add('text-amber-400');
      } else {
        tagCharCounter.classList.remove('text-amber-400');
      }
    });

    newTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomTag();
      }
    });
    addTagBtn.addEventListener('click', addCustomTag);

    // Copy tags button
    document.getElementById('copy-tags-btn').addEventListener('click', () => {
      if (state.currentListing?.etsy?.tags) {
        const text = state.currentListing.etsy.tags.join(', ');
        copyToClipboard(text, 'All 13 Etsy tags copied to clipboard!');
      }
    });

    // Generic copy buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-btn');
      if (btn) {
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          copyToClipboard(targetEl.value || targetEl.textContent, 'Copied to clipboard!');
        }
      }
    });

    // Live Title & Price Change Watchers for Real-time Audit
    ['etsy-title', 'ebay-title', 'shopify-title', 'fin-price', 'fin-cog'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', scheduleLiveAudit);
      }
    });

    // Audit drawer toggle
    toggleAuditDetailsBtn.addEventListener('click', () => {
      auditDetailsDrawer.classList.toggle('hidden');
    });

    // Modals
    helpModalBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
    closeHelpModal.addEventListener('click', () => helpModal.classList.add('hidden'));

    batchToggleBtn.addEventListener('click', () => {
      renderBatchModal();
      batchModal.classList.remove('hidden');
    });
    closeBatchModal.addEventListener('click', () => batchModal.classList.add('hidden'));

    addToQueueBtn.addEventListener('click', addToBatchQueue);
    runBatchBtn.addEventListener('click', handleRunBatch);
    clearBatchBtn.addEventListener('click', () => {
      state.batchQueue = [];
      updateBatchBadge();
      renderBatchModal();
      showToast('Batch queue cleared', 'info');
    });

    // Export buttons
    document.getElementById('export-etsy-btn').addEventListener('click', () => exportPlatformCsv('etsy'));
    document.getElementById('export-ebay-btn').addEventListener('click', () => exportPlatformCsv('ebay'));
    document.getElementById('export-shopify-btn').addEventListener('click', () => exportPlatformCsv('shopify'));
    document.getElementById('export-json-btn').addEventListener('click', exportFullJson);
  }

  // Handle uploaded files
  async function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    await processFiles(files);
  }

  async function handleFileDrop(e) {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    await processFiles(files);
  }

  async function processFiles(files) {
    if (files.length === 0) return;

    for (const file of files) {
      if (state.uploadedImages.length >= 6) {
        showToast('Maximum 6 photos allowed', 'warning');
        break;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        state.uploadedImages.push({
          name: file.name,
          data: e.target.result,
          role: state.uploadedImages.length === 0 ? 'Primary' : `Angle ${state.uploadedImages.length + 1}`
        });
        renderThumbnails();
      };
      reader.readAsDataURL(file);
    }
  }

  function renderThumbnails() {
    if (state.uploadedImages.length === 0) {
      thumbnailsGallery.innerHTML = '';
      thumbnailsGallery.classList.add('hidden');
      clearPhotosBtn.classList.add('hidden');
      return;
    }

    thumbnailsGallery.classList.remove('hidden');
    clearPhotosBtn.classList.remove('hidden');
    thumbnailsGallery.innerHTML = '';

    state.uploadedImages.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'relative group aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900';
      thumb.innerHTML = `
        <img src="${img.data}" class="w-full h-full object-cover" alt="${img.name}">
        <span class="absolute bottom-1 left-1 bg-slate-900/80 backdrop-blur text-[9px] px-1.5 py-0.5 rounded text-slate-300 font-medium">${img.role}</span>
        <button class="remove-photo-btn absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-index="${idx}">
          ✕
        </button>
      `;

      thumb.querySelector('.remove-photo-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.uploadedImages.splice(idx, 1);
        renderThumbnails();
      });

      thumbnailsGallery.appendChild(thumb);
    });
  }

  // Forge listings with AI
  async function handleForgeClick() {
    if (state.uploadedImages.length === 0) {
      showToast('Please upload at least 1 product photo or pick a demo preset', 'warning');
      return;
    }

    // UI loading transition
    emptyState.classList.add('hidden');
    outputWorkspace.classList.add('hidden');
    loadingState.classList.remove('hidden');
    forgeBtn.disabled = true;

    // Collect user hints
    const userHints = {
      brand: document.getElementById('hint-brand').value.trim(),
      era: document.getElementById('hint-era').value.trim(),
      material: document.getElementById('hint-material').value.trim(),
      condition: document.getElementById('hint-condition').value.trim(),
      measurements: document.getElementById('hint-measurements').value.trim()
    };

    // Collect financials
    const financials = {
      price: parseFloat(document.getElementById('fin-price').value) || 45,
      costOfGoods: parseFloat(document.getElementById('fin-cog').value) || 10,
      shippingCost: parseFloat(document.getElementById('fin-shipping').value) || 0
    };

    // Determine engine & model
    let engine = engineSelector.value;
    let model = null;
    if (engine.startsWith('ollama:')) {
      model = engine.replace('ollama:', '');
      engine = 'ollama';
    }

    try {
      const response = await API.generateListing({
        engine,
        model,
        images: state.uploadedImages.map(img => img.data),
        userHints,
        financials
      });

      state.currentListing = response;
      renderListingOutput(response);
      showToast('Listing forged successfully with Open AI!', 'success');
    } catch (err) {
      showToast(`Generation failed: ${err.message}`, 'error');
      emptyState.classList.remove('hidden');
    } finally {
      loadingState.classList.add('hidden');
      forgeBtn.disabled = false;
    }
  }

  // Render listing outputs into the workspace
  function renderListingOutput(data) {
    outputWorkspace.classList.remove('hidden');

    // 1. Visual Inspection Card
    const vi = data.visualAnalysis || {};
    document.getElementById('vi-item').textContent = vi.detectedItem || 'Curated Item';
    document.getElementById('vi-brand').textContent = vi.brandDetected || 'Unbranded';
    document.getElementById('vi-era').textContent = vi.eraStyle || 'Vintage';
    document.getElementById('vi-condition').textContent = vi.conditionGrade || 'Good Condition';

    // Model badge
    document.getElementById('model-badge-used').textContent = data.metadata?.modelUsed || 'Open VLM';

    // Pricing & Margin
    const pricing = data.pricing || {};
    const priceVal = pricing.suggestedPrice || 45;
    document.getElementById('card-price').textContent = `$${priceVal.toFixed(2)}`;

    const audit = data.audits?.[state.activePlatform] || data.audits?.etsy;
    if (audit?.marginData) {
      document.getElementById('card-profit').textContent = `$${audit.marginData.netProfit} (${audit.marginData.marginPct}%)`;
    }

    // 2. Audit Banner & Score Ring
    renderAuditBanner(audit);

    // 3. Populate Etsy Fields
    const etsy = data.etsy || {};
    const etsyTitleInput = document.getElementById('etsy-title');
    etsyTitleInput.value = etsy.title || '';
    updateCharCounter('etsy-title-count', etsyTitleInput.value.length, 140);

    renderEtsyTags(etsy.tags || []);
    document.getElementById('etsy-desc').value = etsy.description || '';

    // 4. Populate eBay Fields
    const ebay = data.ebay || {};
    const ebayTitleInput = document.getElementById('ebay-title');
    ebayTitleInput.value = ebay.title || '';
    updateCharCounter('ebay-title-count', ebayTitleInput.value.length, 80);

    document.getElementById('ebay-condition').value = ebay.conditionNote || '';
    document.getElementById('ebay-html').value = ebay.descriptionHtml || '';
    renderEbaySpecifics(ebay.itemSpecifics || {});

    // 5. Populate Shopify Fields
    const shopify = data.shopify || {};
    document.getElementById('shopify-title').value = shopify.title || '';
    const shopifyMetaInput = document.getElementById('shopify-meta');
    shopifyMetaInput.value = shopify.metaDescription || '';
    updateCharCounter('shopify-meta-count', shopifyMetaInput.value.length, 160);
    document.getElementById('shopify-body').value = shopify.descriptionHtml || '';

    // 6. Populate Poshmark Fields
    const posh = data.poshmark || {};
    document.getElementById('posh-title').value = posh.title || '';
    document.getElementById('posh-desc').value = posh.description || '';
    renderPoshHashtags(posh.hashtags || []);

    // Refresh icons
    lucide.createIcons();
  }

  // Render Etsy Tags pills
  function renderEtsyTags(tags) {
    const container = document.getElementById('etsy-tags-container');
    container.innerHTML = '';

    tags.forEach((tag, idx) => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium';
      pill.innerHTML = `
        <span>${tag}</span>
        <span class="text-[10px] text-slate-500 font-mono">${tag.length}/20</span>
        <button class="remove-tag-btn text-slate-400 hover:text-red-400 font-bold ml-0.5" data-index="${idx}">✕</button>
      `;

      pill.querySelector('.remove-tag-btn').addEventListener('click', () => {
        state.currentListing.etsy.tags.splice(idx, 1);
        renderEtsyTags(state.currentListing.etsy.tags);
        scheduleLiveAudit();
      });

      container.appendChild(pill);
    });

    const badge = document.getElementById('etsy-tag-badge');
    badge.textContent = `${tags.length} / 13 slots used`;
    if (tags.length === 13) {
      badge.className = 'text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold';
    } else {
      badge.className = 'text-[10px] font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold';
    }
  }

  function addCustomTag() {
    const input = document.getElementById('new-tag-input');
    let val = input.value.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
    if (!val) return;

    if (val.length > 20) {
      val = val.slice(0, 20);
    }

    if (!state.currentListing.etsy) {
      state.currentListing.etsy = { tags: [] };
    }
    if (!state.currentListing.etsy.tags) {
      state.currentListing.etsy.tags = [];
    }

    if (state.currentListing.etsy.tags.length >= 13) {
      showToast('Etsy allows a maximum of 13 tags. Remove one first.', 'warning');
      return;
    }

    state.currentListing.etsy.tags.push(val);
    input.value = '';
    document.getElementById('tag-char-counter').textContent = '0/20';
    renderEtsyTags(state.currentListing.etsy.tags);
    scheduleLiveAudit();
  }

  // Render eBay Specifics
  function renderEbaySpecifics(specifics) {
    const grid = document.getElementById('ebay-specifics-grid');
    grid.innerHTML = '';

    Object.entries(specifics).forEach(([key, val]) => {
      const item = document.createElement('div');
      item.className = 'bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-xs';
      item.innerHTML = `
        <div class="text-[10px] text-slate-400 font-semibold uppercase">${key}</div>
        <div class="font-bold text-slate-200 truncate">${val}</div>
      `;
      grid.appendChild(item);
    });
  }

  // Render Poshmark Hashtags
  function renderPoshHashtags(hashtags) {
    const container = document.getElementById('posh-hashtags');
    container.innerHTML = '';
    hashtags.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-rose-300 font-medium';
      pill.textContent = tag.startsWith('#') ? tag : `#${tag}`;
      container.appendChild(pill);
    });
  }

  // Switch Platform Tabs
  function switchPlatformTab(platform) {
    state.activePlatform = platform;

    document.querySelectorAll('.platform-tab').forEach(tab => {
      if (tab.dataset.platform === platform) {
        tab.className = `platform-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20`;
      } else {
        tab.className = 'platform-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300';
      }
    });

    document.querySelectorAll('.platform-content').forEach(content => {
      content.classList.add('hidden');
    });

    const activeContent = document.getElementById(`tab-content-${platform}`);
    if (activeContent) {
      activeContent.classList.remove('hidden');
    }

    // Refresh audit for this platform
    scheduleLiveAudit();
  }

  // Render Audit Banner
  function renderAuditBanner(audit) {
    if (!audit) return;

    auditScoreCircle.textContent = audit.score;
    auditGradePill.textContent = `GRADE ${audit.grade}`;

    if (audit.score >= 90) {
      auditScoreCircle.className = 'w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0';
      auditGradePill.className = 'text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950';
    } else if (audit.score >= 75) {
      auditScoreCircle.className = 'w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-black text-lg flex items-center justify-center shrink-0';
      auditGradePill.className = 'text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950';
    } else {
      auditScoreCircle.className = 'w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 font-black text-lg flex items-center justify-center shrink-0';
      auditGradePill.className = 'text-[10px] font-black px-1.5 py-0.5 rounded bg-red-500 text-slate-950';
    }

    if (audit.strengths.length > 0) {
      auditSummaryText.textContent = audit.strengths.slice(0, 3).join(' • ');
    } else if (audit.issues.length > 0) {
      auditSummaryText.textContent = audit.issues[0].text;
    }

    // Populate drawer lists
    auditStrengthsList.innerHTML = audit.strengths.map(s => `<li>${s}</li>`).join('');
    auditIssuesList.innerHTML = audit.issues.map(i => `<li>${i.text}</li>`).join('');
  }

  // Debounced live audit update
  function scheduleLiveAudit() {
    clearTimeout(state.auditDebounceTimer);
    state.auditDebounceTimer = setTimeout(async () => {
      if (!state.currentListing) return;

      const platform = state.activePlatform;
      let listingData = {};

      if (platform === 'etsy') {
        const titleEl = document.getElementById('etsy-title');
        listingData = {
          title: titleEl ? titleEl.value : '',
          description: document.getElementById('etsy-desc')?.value || '',
          tags: state.currentListing.etsy?.tags || []
        };
        updateCharCounter('etsy-title-count', listingData.title.length, 140);
      } else if (platform === 'ebay') {
        const titleEl = document.getElementById('ebay-title');
        listingData = {
          title: titleEl ? titleEl.value : '',
          itemSpecifics: state.currentListing.ebay?.itemSpecifics || {},
          condition: document.getElementById('ebay-condition')?.value || ''
        };
        updateCharCounter('ebay-title-count', listingData.title.length, 80);
      } else if (platform === 'shopify') {
        const titleEl = document.getElementById('shopify-title');
        listingData = {
          title: titleEl ? titleEl.value : '',
          metaDescription: document.getElementById('shopify-meta')?.value || '',
          description: document.getElementById('shopify-body')?.value || ''
        };
        updateCharCounter('shopify-meta-count', listingData.metaDescription.length, 160);
      }

      const financials = {
        price: parseFloat(document.getElementById('fin-price').value) || 45,
        costOfGoods: parseFloat(document.getElementById('fin-cog').value) || 10,
        shippingCost: parseFloat(document.getElementById('fin-shipping').value) || 0
      };

      try {
        const res = await API.auditListing({
          listing: listingData,
          platform,
          financials
        });
        renderAuditBanner(res.audit);
      } catch (err) {
        // silent audit error
      }
    }, 300);
  }

  function updateCharCounter(id, current, max) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = `${current}/${max}`;
    if (current > max) {
      el.className = 'text-[11px] font-mono text-red-400 font-bold';
    } else {
      el.className = 'text-[11px] font-mono text-emerald-400';
    }
  }

  // Batch Queue Functions
  function addToBatchQueue() {
    if (!state.currentListing) {
      showToast('Generate a listing first before adding to queue', 'warning');
      return;
    }

    const item = {
      id: `queue-${Date.now()}`,
      name: state.currentListing.visualAnalysis?.detectedItem || 'Curated Item',
      listing: JSON.parse(JSON.stringify(state.currentListing)),
      images: [...state.uploadedImages],
      suggestedPrice: parseFloat(document.getElementById('fin-price').value) || 45,
      costOfGoods: parseFloat(document.getElementById('fin-cog').value) || 10
    };

    state.batchQueue.push(item);
    updateBatchBadge();
    showToast(`Added "${item.name}" to batch queue!`, 'success');
  }

  function updateBatchBadge() {
    const count = state.batchQueue.length;
    batchModalCount.textContent = `${count} items`;
    if (count > 0) {
      batchCountBadge.textContent = count;
      batchCountBadge.classList.remove('hidden');
    } else {
      batchCountBadge.classList.add('hidden');
    }
  }

  function renderBatchModal() {
    if (state.batchQueue.length === 0) {
      batchItemsList.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">Queue is currently empty. Add items using "Add Current Item to Batch Queue".</div>';
      runBatchBtn.disabled = true;
      return;
    }

    runBatchBtn.disabled = false;
    batchItemsList.innerHTML = '';

    state.batchQueue.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs';
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-mono font-bold text-slate-400">${idx + 1}</span>
          <div>
            <div class="font-bold text-white">${item.name}</div>
            <div class="text-[10px] text-slate-400">Price: $${item.suggestedPrice} • COG: $${item.costOfGoods}</div>
          </div>
        </div>
        <button class="remove-batch-item text-red-400 hover:text-red-300 font-bold p-1" data-index="${idx}">✕</button>
      `;

      el.querySelector('.remove-batch-item').addEventListener('click', () => {
        state.batchQueue.splice(idx, 1);
        updateBatchBadge();
        renderBatchModal();
      });

      batchItemsList.appendChild(el);
    });
  }

  async function handleRunBatch() {
    if (state.batchQueue.length === 0) return;

    runBatchBtn.disabled = true;
    runBatchBtn.textContent = 'Processing Batch...';

    try {
      const itemsToProcess = state.batchQueue.map(q => ({
        id: q.id,
        name: q.name,
        images: q.images.map(img => img.data),
        hints: q.hints || {},
        suggestedPrice: q.suggestedPrice,
        costOfGoods: q.costOfGoods
      }));

      const res = await API.runBatch(itemsToProcess);
      showToast(`Batch processed ${res.count} listings successfully!`, 'success');
      batchModal.classList.add('hidden');
    } catch (err) {
      showToast(`Batch failed: ${err.message}`, 'error');
    } finally {
      runBatchBtn.disabled = false;
      runBatchBtn.textContent = 'Process All with Open AI';
    }
  }

  // Export functions
  function exportPlatformCsv(platform) {
    if (!state.currentListing) {
      showToast('No listing to export', 'warning');
      return;
    }

    const itemToExport = state.currentListing;
    API.downloadExport(platform, [itemToExport])
      .then(() => showToast(`Downloaded ${platform.toUpperCase()} CSV`, 'success'))
      .catch(err => showToast(`Export failed: ${err.message}`, 'error'));
  }

  function exportFullJson() {
    if (!state.currentListing) {
      showToast('No listing to export', 'warning');
      return;
    }

    const blob = new Blob([JSON.stringify(state.currentListing, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `listingforge_bundle_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    showToast('Downloaded full JSON bundle', 'success');
  }

  // Clipboard helper
  function copyToClipboard(text, message = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message, 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-animate pointer-events-auto px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border';

    if (type === 'success') {
      toast.classList.add('bg-emerald-950', 'border-emerald-500/40', 'text-emerald-300');
      toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    } else if (type === 'warning') {
      toast.classList.add('bg-amber-950', 'border-amber-500/40', 'text-amber-300');
      toast.innerHTML = `<span>⚠️</span><span>${message}</span>`;
    } else if (type === 'error') {
      toast.classList.add('bg-rose-950', 'border-rose-500/40', 'text-rose-300');
      toast.innerHTML = `<span>✕</span><span>${message}</span>`;
    } else {
      toast.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-200');
      toast.innerHTML = `<span>ℹ️</span><span>${message}</span>`;
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease-out';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }
});
