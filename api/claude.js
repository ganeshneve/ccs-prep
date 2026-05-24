export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method Not Allowed' }); return; }

  try {
    const body = req.body;
    const apiKey = body.apiKey;
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      res.status(401).json({ error: 'Invalid API key format' }); return;
    }

    const payload = {
      model: body.model || 'claude-sonnet-4-5',
      max_tokens: body.max_tokens || 2000,
      temperature: body.temperature || 0.8,
      messages: body.messages,
    };
    if (body.system) payload.system = body.system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
