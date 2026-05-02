export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { batch_id, results } = req.query;
  if (!batch_id) return res.status(400).json({ error: 'batch_id required' });
  try {
    const url = results === 'true' ? `https://api.anthropic.com/v1/messages/batches/${batch_id}/results` : `https://api.anthropic.com/v1/messages/batches/${batch_id}`;
    const response = await fetch(url, { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'message-batches-2024-09-24' } });
    if (!response.ok) { const data = await response.json(); return res.status(response.status).json(data); }
    if (results === 'true') { const text = await response.text(); const lines = text.trim().split('\n').filter(Boolean); const parsed = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); return res.status(200).json({ results: parsed }); }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
