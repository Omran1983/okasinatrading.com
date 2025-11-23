export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    const { FB_ACCESS_TOKEN, FB_PAGE_ID } = process.env;
    const COVER_ALBUM_ID = '480369384124723';

    const results = {
        env: {
            hasToken: !!FB_ACCESS_TOKEN,
            hasPageId: !!FB_PAGE_ID,
            pageId: FB_PAGE_ID
        },
        tests: {}
    };

    try {
        // Test 1: Check Album Photos
        const photosUrl = `https://graph.facebook.com/v19.0/${COVER_ALBUM_ID}/photos?fields=images,id,created_time&limit=5&access_token=${FB_ACCESS_TOKEN}`;
        const photosStart = Date.now();
        const photosRes = await fetch(photosUrl);
        const photosData = await photosRes.json();
        results.tests.albumPhotos = {
            status: photosRes.status,
            duration: Date.now() - photosStart,
            data: photosData
        };

        // Test 2: Check Metrics (Split calls)
        const periodicUrl = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/insights?metric=page_impressions,page_post_engagements,page_views_total&period=days_28&access_token=${FB_ACCESS_TOKEN}`;
        const periodicRes = await fetch(periodicUrl);
        const periodicData = await periodicRes.json();

        const fansUrl = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/insights?metric=page_fans&period=lifetime&access_token=${FB_ACCESS_TOKEN}`;
        const fansRes = await fetch(fansUrl);
        const fansData = await fansRes.json();

        results.tests.metrics = {
            periodic: periodicData,
            fans: fansData
        };

        return res.status(200).json(results);

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack,
            results
        });
    }
}
