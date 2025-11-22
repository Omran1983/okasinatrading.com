/**
 * Meta (Facebook/Instagram) API Service
 * Handles posting to Facebook Pages and Instagram Business accounts
 */

const FB_APP_ID = '870341192189921';
const FB_API_VERSION = 'v18.0';

class MetaService {
    constructor() {
        this.accessToken = null;
        this.facebookPageId = null;
        this.instagramAccountId = null;
    }

    /**
     * Initialize Facebook SDK
     */
    initializeFacebookSDK() {
        return new Promise((resolve) => {
            // Load Facebook SDK
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: FB_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: FB_API_VERSION
                });
                resolve();
            };

            // Load SDK script
            if (!document.getElementById('facebook-jssdk')) {
                const script = document.createElement('script');
                script.id = 'facebook-jssdk';
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                document.body.appendChild(script);
            } else {
                resolve();
            }
        });
    }

    /**
     * Login with Facebook and get permissions
     */
    async loginWithFacebook() {
        await this.initializeFacebookSDK();

        return new Promise((resolve, reject) => {
            window.FB.login((response) => {
                if (response.authResponse) {
                    this.accessToken = response.authResponse.accessToken;
                    console.log('Facebook login successful');
                    resolve(response.authResponse);
                } else {
                    reject(new Error('Facebook login failed'));
                }
            }, {
                scope: 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish,business_management'
            });
        });
    }

    /**
     * Get user's Facebook Pages
     */
    async getFacebookPages() {
        if (!this.accessToken) {
            throw new Error('Not authenticated. Please login first.');
        }

        return new Promise((resolve, reject) => {
            window.FB.api('/me/accounts', { access_token: this.accessToken }, (response) => {
                if (response && !response.error) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error?.message || 'Failed to get pages'));
                }
            });
        });
    }

    /**
     * Set the active Facebook Page
     */
    setFacebookPage(pageId, pageAccessToken) {
        this.facebookPageId = pageId;
        this.accessToken = pageAccessToken; // Use page access token for posting
    }

    /**
     * Get Instagram Business Account linked to Facebook Page
     */
    async getInstagramAccount() {
        if (!this.facebookPageId || !this.accessToken) {
            throw new Error('Facebook page not set');
        }

        return new Promise((resolve, reject) => {
            window.FB.api(
                `/${this.facebookPageId}?fields=instagram_business_account`,
                { access_token: this.accessToken },
                (response) => {
                    if (response && !response.error) {
                        if (response.instagram_business_account) {
                            this.instagramAccountId = response.instagram_business_account.id;
                            resolve(response.instagram_business_account);
                        } else {
                            reject(new Error('No Instagram Business account linked to this page'));
                        }
                    } else {
                        reject(new Error(response.error?.message || 'Failed to get Instagram account'));
                    }
                }
            );
        });
    }

    /**
     * Post text and image to Facebook Page
     */
    async postToFacebook({ message, imageUrl }) {
        if (!this.facebookPageId || !this.accessToken) {
            throw new Error('Facebook page not configured');
        }

        const endpoint = imageUrl
            ? `/${this.facebookPageId}/photos`
            : `/${this.facebookPageId}/feed`;

        const params = imageUrl
            ? { url: imageUrl, caption: message, access_token: this.accessToken }
            : { message: message, access_token: this.accessToken };

        return new Promise((resolve, reject) => {
            window.FB.api(endpoint, 'POST', params, (response) => {
                if (response && !response.error) {
                    resolve({
                        success: true,
                        postId: response.id || response.post_id,
                        platform: 'facebook'
                    });
                } else {
                    reject(new Error(response.error?.message || 'Failed to post to Facebook'));
                }
            });
        });
    }

    /**
     * Post image to Instagram
     */
    async postToInstagram({ caption, imageUrl }) {
        if (!this.instagramAccountId || !this.accessToken) {
            throw new Error('Instagram account not configured');
        }

        if (!imageUrl) {
            throw new Error('Image URL is required for Instagram posts');
        }

        try {
            // Step 1: Create media container
            const containerResponse = await this.createInstagramContainer(imageUrl, caption);
            const creationId = containerResponse.id;

            // Step 2: Wait a moment for processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 3: Publish the container
            const publishResponse = await this.publishInstagramContainer(creationId);

            return {
                success: true,
                postId: publishResponse.id,
                platform: 'instagram'
            };
        } catch (error) {
            throw new Error(`Instagram posting failed: ${error.message}`);
        }
    }

    /**
     * Create Instagram media container
     */
    createInstagramContainer(imageUrl, caption) {
        return new Promise((resolve, reject) => {
            window.FB.api(
                `/${this.instagramAccountId}/media`,
                'POST',
                {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: this.accessToken
                },
                (response) => {
                    if (response && !response.error) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error?.message || 'Failed to create Instagram container'));
                    }
                }
            );
        });
    }

    /**
     * Publish Instagram media container
     */
    publishInstagramContainer(creationId) {
        return new Promise((resolve, reject) => {
            window.FB.api(
                `/${this.instagramAccountId}/media_publish`,
                'POST',
                {
                    creation_id: creationId,
                    access_token: this.accessToken
                },
                (response) => {
                    if (response && !response.error) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error?.message || 'Failed to publish Instagram post'));
                    }
                }
            );
        });
    }

    /**
     * Post to both Facebook and Instagram
     */
    async postToAll({ message, imageUrl }) {
        const results = [];
        const errors = [];

        // Post to Facebook
        try {
            const fbResult = await this.postToFacebook({ message, imageUrl });
            results.push(fbResult);
        } catch (error) {
            errors.push({ platform: 'facebook', error: error.message });
        }

        // Post to Instagram (only if image is provided)
        if (imageUrl) {
            try {
                const igResult = await this.postToInstagram({ caption: message, imageUrl });
                results.push(igResult);
            } catch (error) {
                errors.push({ platform: 'instagram', error: error.message });
            }
        }

        return {
            results,
            errors,
            success: results.length > 0
        };
    }

    /**
     * Get Facebook Page insights
     */
    async getPageInsights() {
        if (!this.facebookPageId || !this.accessToken) {
            throw new Error('Facebook page not configured');
        }

        return new Promise((resolve, reject) => {
            window.FB.api(
                `/${this.facebookPageId}/insights`,
                {
                    metric: 'page_impressions,page_engaged_users,page_post_engagements',
                    period: 'day',
                    access_token: this.accessToken
                },
                (response) => {
                    if (response && !response.error) {
                        resolve(response.data);
                    } else {
                        reject(new Error(response.error?.message || 'Failed to get insights'));
                    }
                }
            );
        });
    }

    /**
     * Check if user is logged in
     */
    isAuthenticated() {
        return !!this.accessToken;
    }

    /**
     * Logout
     */
    logout() {
        this.accessToken = null;
        this.facebookPageId = null;
        this.instagramAccountId = null;
        if (window.FB) {
            window.FB.logout();
        }
    }
}

// Export singleton instance
export const metaService = new MetaService();
export default metaService;
