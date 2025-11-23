# Facebook Long-Lived Token Generator
# This script converts a short-lived token to a long-lived page token

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Facebook Long-Lived Token Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# App credentials
$appId = "870341192189921"
$appSecret = "0b414443ca659ddf094aa7c84549960a"

# Prompt for short-lived token
Write-Host "Step 1: Get a short-lived token" -ForegroundColor Yellow
Write-Host "Go to: https://developers.facebook.com/tools/explorer/" -ForegroundColor Gray
Write-Host "1. Select your app: 'Okasina Trading'" -ForegroundColor Gray
Write-Host "2. Click 'Get Token' → 'Get Page Access Token'" -ForegroundColor Gray
Write-Host "3. Select your page and grant permissions" -ForegroundColor Gray
Write-Host "4. Copy the token" -ForegroundColor Gray
Write-Host ""

$shortToken = Read-Host "Paste your short-lived token here"

if ([string]::IsNullOrWhiteSpace($shortToken)) {
    Write-Host "❌ Error: No token provided!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 2: Exchanging for long-lived user token..." -ForegroundColor Yellow

try {
    $url1 = "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$shortToken"
    $response1 = Invoke-RestMethod -Uri $url1
    $longUserToken = $response1.access_token
    $expiresIn = $response1.expires_in
    $daysValid = [math]::Round($expiresIn / 86400)
    Write-Host "✓ Long-lived user token obtained (valid for ~$daysValid days)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting long-lived token!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 3: Getting Page token..." -ForegroundColor Yellow

try {
    $url2 = "https://graph.facebook.com/v19.0/me/accounts?access_token=$longUserToken"
    $response2 = Invoke-RestMethod -Uri $url2
    
    if ($response2.data.Count -eq 0) {
        Write-Host "❌ No pages found! Make sure you're an admin of a Facebook page." -ForegroundColor Red
        exit
    }
    
    $pageToken = $response2.data[0].access_token
    $pageName = $response2.data[0].name
    $pageId = $response2.data[0].id
    Write-Host "✓ Page token obtained for: $pageName (ID: $pageId)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting page token!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Your Long-Lived Page Token:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host $pageToken -ForegroundColor White
Write-Host ""
Write-Host "Page Name: $pageName" -ForegroundColor Gray
Write-Host "Page ID: $pageId" -ForegroundColor Gray
Write-Host ""
Write-Host "This token should work for months/years!" -ForegroundColor Green
Write-Host "It will only expire if you change your password or revoke permissions." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Copy the token above" -ForegroundColor White
Write-Host "2. Update your .env file:" -ForegroundColor White
Write-Host "   FB_ACCESS_TOKEN=$pageToken" -ForegroundColor Gray
Write-Host "3. Update Vercel environment variable" -ForegroundColor White
Write-Host "4. Redeploy your site" -ForegroundColor White
Write-Host ""

# Optionally save to file
$saveToFile = Read-Host "Save token to file? (y/n)"
if ($saveToFile -eq "y" -or $saveToFile -eq "Y") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "facebook_token_$timestamp.txt"
    @"
Facebook Long-Lived Page Token
Generated: $(Get-Date)
Page Name: $pageName
Page ID: $pageId

Token:
$pageToken

Environment Variable Format:
FB_ACCESS_TOKEN=$pageToken
"@ | Out-File -FilePath $filename -Encoding UTF8
    Write-Host "✓ Token saved to: $filename" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
