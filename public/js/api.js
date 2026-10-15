// public/js/api.js - Frontend API Client for ListingForge

const API = {
  async getStatus() {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status probe failed');
    return res.json();
  },

  async getPresets() {
    const res = await fetch('/api/presets');
    if (!res.ok) throw new Error('Failed to fetch presets');
    return res.json();
  },

  async uploadFiles(fileList) {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('photos', fileList[i]);
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }

    return res.json();
  },

  async generateListing({ engine, model, images, userHints, financials }) {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engine, model, images, userHints, financials })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Generation failed');
    }

    return res.json();
  },

  async auditListing({ listing, platform, financials }) {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing, platform, financials })
    });

    if (!res.ok) throw new Error('Audit failed');
    return res.json();
  },

  async downloadExport(platform, items) {
    const res = await fetch(`/api/export/${platform}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    if (!res.ok) throw new Error(`Export failed for ${platform}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `listingforge_${platform}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async runBatch(items, engine = 'auto', model = null) {
    const res = await fetch('/api/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, engine, model })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Batch processing failed');
    }

    return res.json();
  }
};
