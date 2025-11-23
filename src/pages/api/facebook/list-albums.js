import crypto from 'crypto';

export default async function handler(req, res) {
    // Ensure we always return JSON
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { FB_PAGE_ID, FB_ACCESS_TOKEN, FB_APP_SECRET } = process.env;

    if (!FB_PAGE_ID || !FB_ACCESS_TOKEN || !FB_APP_SECRET) {
        console.error('Missing Env Vars:', {
            page: !!FB_PAGE_ID,
            token: !!FB_ACCESS_TOKEN,
            secret: !!FB_APP_SECRET
        });
        return res.status(500).json({ error: 'Missing FB env vars in Vercel' });
    }

    // Generate appsecret_proof to bypass some client-side restrictions
    // Proof = HMAC-SHA256(access_token, app_secret)
    const appSecretProof = crypto
        .createHmac('sha256', FB_APP_SECRET)
        .update(FB_ACCESS_TOKEN)
        .digest('hex');

    const url = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/albums?fields=id,name,count,cover_photo{picture}&access_token=${FB_ACCESS_TOKEN}&appsecret_proof=${appSecretProof}`;

    try {
        const fbRes = await fetch(url);

        // Check content type
        const contentType = fbRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await fbRes.text();
            console.error('Non-JSON response from FB:', text);
            return res.status(502).json({ error: 'Facebook API returned non-JSON', details: text.substring(0, 200) });
        }

        const data = await fbRes.json();

        if (data.error) {
            console.error('FB API Error:', data.error);
            return res.status(400).json({ error: data.error.message });
        }

        const albums = (data.data || []).map(a => ({
            id: a.id,
            name: a.name,
            count: a.count,
            coverUrl: a.cover_photo?.picture?.data?.url || null,
        }));

        return res.status(200).json({ albums });
    } catch (e) {
        console.error('Handler Crash:', e);
        return res.status(500).json({ error: 'Internal Server Error', details: e.message });
    }
}
