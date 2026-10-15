// lib/ollama-adapter.js - Client for local Ollama open-weight models

export async function checkOllamaStatus(host = 'http://127.0.0.1:11434') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${host}/api/tags`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { online: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    const allModels = (data.models || []).map(m => m.name);

    // Identify open-weight vision vs text models
    const visionKeywords = ['vision', 'vl', 'llava', 'moondream', 'minicpm', 'bakllava', 'multimodal'];
    const visionModels = allModels.filter(m => visionKeywords.some(kw => m.toLowerCase().includes(kw)));
    const textModels = allModels.filter(m => !visionModels.includes(m));

    return {
      online: true,
      host,
      allModels,
      visionModels,
      textModels,
      recommendedModel: visionModels[0] || allModels[0] || 'llama3.2-vision'
    };
  } catch (err) {
    return {
      online: false,
      host,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
      help: 'To run local models: install Ollama from ollama.com, then run: ollama run llama3.2-vision or ollama run moondream'
    };
  }
}

export async function generateWithOllama({
  host = 'http://127.0.0.1:11434',
  model,
  images = [],
  userPrompt,
  systemPrompt
}) {
  // Convert images into base64 clean strings (without data:image/...;base64, prefix if present)
  const cleanBase64Images = images.map(img => {
    if (typeof img === 'string') {
      const parts = img.split(',');
      return parts.length > 1 ? parts[1] : parts[0];
    }
    return img;
  }).filter(Boolean);

  const payload = {
    model: model || 'llama3.2-vision',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt,
        images: cleanBase64Images.length > 0 ? cleanBase64Images : undefined
      }
    ],
    format: 'json',
    stream: false,
    options: {
      temperature: 0.3,
      top_p: 0.9
    }
  };

  const response = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const rawContent = result.message?.content || '';

  // Parse JSON response safely
  try {
    return parseModelJsonResponse(rawContent);
  } catch (parseErr) {
    throw new Error(`Failed to parse structured JSON from Ollama (${model}): ${parseErr.message}\nRaw output: ${rawContent.slice(0, 200)}...`);
  }
}

function parseModelJsonResponse(text) {
  let cleaned = text.trim();
  // Strip markdown code fence if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}
