export const config = { api: { bodyParser: false, responseLimit: '10mb' } };
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });
  let parsedUrl;
  try { parsedUrl = new URL(url); } catch { return res.status(400).json({ error: 'invalid url' }); }
  const allowedHosts = ['i.i2br.com', 'i2br.com'];
  if (!allowedHosts.some(h => parsedUrl.hostname.endsWith(h))) return res.status(403).json({ error: 'host not allowed' });
  try {
    const response = await fetch(url, { headers: { 'Referer': 'https://portal.useei.icu/', 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) return res.status(response.status).json({ error: 'upstream error' });
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buffer);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
