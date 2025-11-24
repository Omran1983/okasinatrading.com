export default function handler(req, res) {
    const url = process.env.VITE_SUPABASE_URL || 'NOT_SET';
    const key = process.env.VITE_SUPABASE_ANON_KEY || 'NOT_SET';

    // Mask the values for security, but show enough to identify the project
    const maskedUrl = url.replace(/^(https:\/\/)([^.]+)(\..+)$/, '$1$2***$3');
    const projectRef = url.split('.')[0].split('//')[1];

    res.status(200).json({
        supabaseUrl: maskedUrl,
        projectRef: projectRef,
        hasKey: key !== 'NOT_SET' && key.length > 10
    });
}
