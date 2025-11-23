export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    const { FB_ACCESS_TOKEN } = process.env;

    if (!FB_ACCESS_TOKEN) {
        return res.status(500).json({ error: 'No Access Token found in env' });
    }

    try {
        // 1. Get User Info
        const meRes = await fetch(`https://graph.facebook.com/me?access_token=${FB_ACCESS_TOKEN}`);
        const me = await meRes.json();

        // 2. Get Accounts (Pages) this user manages
        const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${FB_ACCESS_TOKEN}`);
        const accounts = await accountsRes.json();

        return res.status(200).json({
            token_user: me,
            pages_found: accounts.data || [],
            hint: "Use the 'id' from 'pages_found' as your FB_PAGE_ID"
        });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
