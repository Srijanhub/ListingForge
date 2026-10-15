// lib/hf-adapter.js - Hugging Face open-weight model client

export async function generateWithHuggingFace({
  model = 'Qwen/Qwen2-VL-7B-Instruct',
  token,
  images = [],
  userPrompt,
  systemPrompt
}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Open-weight VLM models on HuggingFace router
  const endpoint = `https://api-inference.huggingface.co/models/${model}`;

  const payload = {
    inputs: `${systemPrompt}\n\n${userPrompt}`,
    parameters: {
      max_new_tokens: 1024,
      return_full_text: false,
      temperature: 0.3
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  let generatedText = '';

  if (Array.isArray(result) && result[0]?.generated_text) {
    generatedText = result[0].generated_text;
  } else if (result.generated_text) {
    generatedText = result.generated_text;
  } else {
    generatedText = JSON.stringify(result);
  }

  // Parse JSON
  let cleaned = generatedText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}
