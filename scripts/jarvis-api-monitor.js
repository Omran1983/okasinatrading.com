#!/usr/bin/env node
/**
 * JARVIS API Usage Monitor
 * Tracks Gemini API usage and prevents billing
 */

import fs from 'fs';
import path from 'path';

const USAGE_FILE = '.jarvis/api-usage.json';
const MAX_REQUESTS_PER_DAY = 1000; // Well below free tier of 1,500
const MAX_REQUESTS_PER_MINUTE = 10; // Well below free tier of 15
const BILLING_THRESHOLD = 0.00; // Alert at $0.00

// Initialize usage tracking
function initUsageTracking() {
    const dir = path.dirname(USAGE_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(USAGE_FILE)) {
        const initialData = {
            dailyRequests: 0,
            lastReset: new Date().toISOString().split('T')[0],
            totalRequests: 0,
            requestHistory: []
        };
        fs.writeFileSync(USAGE_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Get current usage
function getUsage() {
    initUsageTracking();
    const data = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));

    // Reset daily counter if new day
    const today = new Date().toISOString().split('T')[0];
    if (data.lastReset !== today) {
        data.dailyRequests = 0;
        data.lastReset = today;
        fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
    }

    return data;
}

// Check if request is allowed
function canMakeRequest() {
    const usage = getUsage();

    if (usage.dailyRequests >= MAX_REQUESTS_PER_DAY) {
        console.error('🚨 DAILY LIMIT REACHED!');
        console.error(`   Used: ${usage.dailyRequests}/${MAX_REQUESTS_PER_DAY} requests`);
        console.error('   Wait until tomorrow or increase limit in .env');
        return false;
    }

    // Check rate limiting (last minute)
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = usage.requestHistory.filter(
        timestamp => new Date(timestamp).getTime() > oneMinuteAgo
    ).length;

    if (recentRequests >= MAX_REQUESTS_PER_MINUTE) {
        console.error('🚨 RATE LIMIT REACHED!');
        console.error(`   ${recentRequests}/${MAX_REQUESTS_PER_MINUTE} requests in last minute`);
        console.error('   Please wait 60 seconds');
        return false;
    }

    return true;
}

// Record a request
function recordRequest() {
    const usage = getUsage();

    usage.dailyRequests++;
    usage.totalRequests++;
    usage.requestHistory.push(new Date().toISOString());

    // Keep only last 100 requests in history
    if (usage.requestHistory.length > 100) {
        usage.requestHistory = usage.requestHistory.slice(-100);
    }

    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));

    // Show warning at 80% of daily limit
    if (usage.dailyRequests >= MAX_REQUESTS_PER_DAY * 0.8) {
        console.warn(`⚠️  WARNING: ${usage.dailyRequests}/${MAX_REQUESTS_PER_DAY} daily requests used (${Math.round(usage.dailyRequests / MAX_REQUESTS_PER_DAY * 100)}%)`);
    }
}

// Display usage stats
function displayUsage() {
    const usage = getUsage();

    console.log('📊 JARVIS API Usage Statistics\n');
    console.log(`Daily Requests: ${usage.dailyRequests}/${MAX_REQUESTS_PER_DAY} (${Math.round(usage.dailyRequests / MAX_REQUESTS_PER_DAY * 100)}%)`);
    console.log(`Total Requests: ${usage.totalRequests}`);
    console.log(`Last Reset: ${usage.lastReset}`);

    const remaining = MAX_REQUESTS_PER_DAY - usage.dailyRequests;
    console.log(`\n✅ Remaining Today: ${remaining} requests`);

    if (usage.dailyRequests >= MAX_REQUESTS_PER_DAY * 0.9) {
        console.log('\n🚨 WARNING: Approaching daily limit!');
    } else if (usage.dailyRequests >= MAX_REQUESTS_PER_DAY * 0.8) {
        console.log('\n⚠️  CAUTION: 80% of daily limit used');
    } else {
        console.log('\n✅ Usage is healthy');
    }

    console.log('\n💡 Gemini Free Tier: 1,500 requests/day');
    console.log('💡 JARVIS Limit: 1,000 requests/day (safety buffer)');
    console.log('💡 No billing possible without credit card\n');
}

// Export functions
export { canMakeRequest, recordRequest, displayUsage, getUsage };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    displayUsage();
}
