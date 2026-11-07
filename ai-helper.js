const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PROJECT_ROOT = __dirname;
const PORT = Number(process.env.ASMR_HELPER_PORT || 8787);

function readEnvValue(name) {
  const envPath = path.join(PROJECT_ROOT, '.env');
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const line = lines.find((item) => item.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : '';
}

function readModelFromNotes() {
  const notes = fs.readFileSync(path.join(PROJECT_ROOT, 'NOTES.md'), 'utf8');
  const modelMatch = notes.match(/`([^`]*luna[^`]*)`/i);
  return modelMatch ? modelMatch[1].trim() : '';
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10000) {
        reject(new Error('Request is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function getResponseText(data) {
  if (typeof data.output_text === 'string') {
    return data.output_text.trim();
  }

  const textParts = [];
  for (const outputItem of data.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (contentItem.type === 'output_text' && typeof contentItem.text === 'string') {
        textParts.push(contentItem.text);
      }
    }
  }
  return textParts.join('\n').trim();
}

async function askOpenAI(message) {
  const apiKey = readEnvValue('OPENAI_API_KEY');
  const model = readModelFromNotes();
  if (!apiKey || apiKey === 'paste-your-key-here' || !model) {
    throw new Error('Missing local AI configuration.');
  }

  const brief = fs.readFileSync(path.join(PROJECT_ROOT, 'BRIEF.md'), 'utf8');
  const result = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: message,
      instructions: brief,
      max_output_tokens: 120,
      model,
      store: false,
    }),
  });

  if (!result.ok) {
    throw new Error(`OpenAI request failed with status ${result.status}.`);
  }

  const data = await result.json();
  const text = getResponseText(data);
  if (!text) {
    throw new Error('OpenAI returned no text.');
  }
  return text;
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method !== 'POST' || request.url !== '/calm') {
    sendJson(response, 404, { error: 'Not found.' });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request));
    if (typeof body.message !== 'string' || !body.message.trim()) {
      sendJson(response, 400, { error: 'Please share what is making you stressed.' });
      return;
    }

    const reply = await askOpenAI(body.message.trim());
    sendJson(response, 200, { reply });
  } catch {
    sendJson(response, 502, {
      error: 'I could not reach the AI. Check the key and make sure the helper is running.',
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ASMR AI helper listening on http://0.0.0.0:${PORT}`);
});
