const fs = require('node:fs');
const path = require('node:path');

let cached = null;

class KeySetupError extends Error {
  constructor(message, fix) {
    super(message);
    this.name = 'KeySetupError';
    this.fix = fix;
  }
}

function readSettings() {
  const values = {};
  if (process.env.VERCEL) {
    values.KEYGEN_URL = process.env.KEYGEN_URL;
    values.KEYGEN_TOKEN = process.env.KEYGEN_TOKEN;
  } else {
    let contents;
    try {
      contents = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    } catch {
      throw new KeySetupError('The AI key service is not set up yet.', 'Create .env with KEYGEN_URL and KEYGEN_TOKEN from MindDo.');
    }
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (match) values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  if (!values.KEYGEN_URL || values.KEYGEN_URL === 'paste-here' || !values.KEYGEN_TOKEN || values.KEYGEN_TOKEN === 'paste-here') {
    const fix = process.env.VERCEL
      ? 'Add KEYGEN_URL and KEYGEN_TOKEN to the Vercel project environment variables, then redeploy.'
      : 'Replace both paste-here values in .env with your MindDo settings.';
    throw new KeySetupError('The AI key service is not set up yet.', fix);
  }
  let endpoint;
  try {
    const base = new URL(values.KEYGEN_URL);
    if (!['https:', 'http:'].includes(base.protocol)) throw new Error();
    endpoint = `${values.KEYGEN_URL.replace(/\/+$/, '')}/api/lookup-key`;
  } catch {
    throw new KeySetupError('The MindDo address in .env is not valid.', 'Check KEYGEN_URL in .env and use the full MindDo service address.');
  }
  return { endpoint, token: values.KEYGEN_TOKEN };
}

async function getKey() {
  if (cached && Date.now() < cached.expiresAt) return cached.apiKey;
  cached = null;
  const { endpoint, token } = readSettings();
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new KeySetupError('MindDo could not be reached.', 'Check the internet connection and KEYGEN_URL in .env, then try again.');
  }
  if (!response.ok) {
    throw new KeySetupError('MindDo could not provide an AI key.', 'Check KEYGEN_URL and KEYGEN_TOKEN in .env, then try again.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new KeySetupError('MindDo sent an unreadable reply.', 'Check that KEYGEN_URL points to the MindDo key service.');
  }
  const expiresAt = Date.parse(data?.expiresAt);
  if (typeof data?.apiKey !== 'string' || !data.apiKey || !Number.isFinite(expiresAt)) {
    throw new KeySetupError('MindDo sent an incomplete key reply.', 'Check that the MindDo key service returns apiKey and expiresAt.');
  }
  cached = { apiKey: data.apiKey, expiresAt };
  return cached.apiKey;
}

function invalidateKey() {
  cached = null;
}

module.exports = { getKey, invalidateKey };
