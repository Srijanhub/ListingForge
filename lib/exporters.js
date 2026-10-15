// lib/exporters.js - Generates platform-compliant CSVs and export packages

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvString(headers, rows) {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map(row => row.map(escapeCsvCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

export function exportEtsyCsv(items) {
  const headers = [
    'Title',
    'Description',
    'Price',
    'Quantity',
    'Tags',
    'Materials',
    'Who Made',
    'When Made',
    'Is Supply'
  ];

  const rows = items.map(item => {
    const listing = item.etsy || item;
    const tags = Array.isArray(listing.tags) ? listing.tags.slice(0, 13).join(', ') : '';
    const materials = Array.isArray(listing.materials) ? listing.materials.join(', ') : (listing.materials || '');

    return [
      listing.title || '',
      listing.description || '',
      item.pricing?.suggestedPrice || listing.price || '45.00',
      '1',
      tags,
      materials,
      listing.whoMade || 'someone_else',
      listing.whenMade || 'before_2005',
      'false'
    ];
  });

  return buildCsvString(headers, rows);
}

export function exportEbayCsv(items) {
  const headers = [
    '*Action(SiteID=US|Country=US|Currency=USD|Version=1193)',
    'CustomLabel',
    '*Title',
    '*Description',
    '*Format',
    '*Duration',
    '*StartPrice',
    '*Quantity',
    '*ConditionID',
    'ConditionDescription',
    'C:Brand',
    'C:Type',
    'C:Style',
    'C:Material',
    'C:Color',
    'C:Department'
  ];

  const rows = items.map((item, idx) => {
    const listing = item.ebay || item;
    const specifics = listing.itemSpecifics || {};

    return [
      'Add',
      `LF-${Date.now()}-${idx + 1}`,
      (listing.title || '').slice(0, 80),
      listing.descriptionHtml || listing.description || '',
      'FixedPrice',
      'GTC',
      item.pricing?.suggestedPrice || listing.price || '45.00',
      '1',
      listing.conditionId || '3000', // 3000 = Used/Pre-owned
      listing.conditionNote || listing.condition || 'Pre-owned in good condition',
      specifics.Brand || specifics.brand || 'Unbranded',
      specifics.Type || specifics.type || 'Clothing',
      specifics.Style || specifics.style || 'Vintage',
      specifics.Material || specifics.material || 'Mixed',
      specifics.Color || specifics.color || 'Multi-Color',
      specifics.Department || specifics.department || 'Unisex Adults'
    ];
  });

  return buildCsvString(headers, rows);
}

export function exportShopifyCsv(items) {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Type',
    'Tags',
    'Published',
    'Variant SKU',
    'Variant Price',
    'SEO Title',
    'SEO Description'
  ];

  const rows = items.map((item, idx) => {
    const listing = item.shopify || item;
    const title = listing.title || 'Product';
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `item-${idx}`;
    const tags = Array.isArray(listing.tags) ? listing.tags.join(', ') : (listing.tags || '');

    return [
      handle,
      title,
      listing.descriptionHtml || listing.description || '',
      listing.vendor || 'ListingForge Studio',
      listing.category || 'Vintage & Collectibles',
      tags,
      'TRUE',
      `LF-SKU-${idx + 1}`,
      item.pricing?.suggestedPrice || listing.price || '45.00',
      listing.seoTitle || title.slice(0, 60),
      listing.metaDescription || (listing.description || '').slice(0, 160)
    ];
  });

  return buildCsvString(headers, rows);
}
