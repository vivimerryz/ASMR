const askAI = require('../openai-request.cjs');

function fail(res, status, message, fix) {
  console.error(fix);
  return res.status(status).json({ error: { message, fix } });
}

module.exports = async function calm(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return fail(res, 405, 'Please send a check-in first.', 'Use the app’s Next button to send a check-in.');
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {
      return fail(res, 400, 'Please try your check-in again.', 'Send a valid check-in from the app.');
    }
  }
  const { message, choices } = body || {};
  if (typeof message !== 'string' || !message.trim() || message.length > 500) {
    return fail(res, 400, 'Please type a feeling, up to 500 characters.', 'Type a short check-in and try again.');
  }
  if (!Array.isArray(choices) || choices.length > 30 || choices.some(item => !item || typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.type !== 'string')) {
    return fail(res, 400, 'Please refresh and try again.', 'Refresh the app and try again.');
  }

  try {
    const answer = await askAI(message.trim(), choices);
    return res.status(200).json(answer);
  } catch (error) {
    return fail(res, 502, error?.message || 'The AI could not answer just now.', error?.fix || 'Check KEYGEN_URL and KEYGEN_TOKEN in Vercel settings, then try again.');
  }
};
