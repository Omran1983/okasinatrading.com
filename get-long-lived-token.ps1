$shortToken = "EAAMXkhmYBZBEBQDtkURCus7qJNEUidtJxlRKHi29LaEnGamvtcCNl4SjhombXhNOIm8Qrs6q2JaWlccEcM9BeZCDy6CJUFbXWx4b5CPC1FPtr2vJTZCZCDJUxZAvFX07WnpkbcYCOOUJ52crHxCmzFZAOU74hVNAJUPqj26e8m3yihZC1r2FG6lWfJmWuw4I4JlaAJq2v2HY9kAmjEbASLE7g6HKTjZCSIrlqhGN3mTs6ZCovnwLTZBnJ0hiTHcSVC4U0Gl8arNCDAb4orGZBVq43OlPoY7seZADdye6HoIZD"
$appId = "870341192189921"
$appSecret = "0b414443ca659ddf094aa7c84549960a"

Write-Host "Step 1: Exchanging for long-lived user token..." -ForegroundColor Yellow
$url1 = "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$shortToken"
$response1 = Invoke-RestMethod -Uri $url1
$longUserToken = $response1.access_token
Write-Host "✓ Long-lived user token obtained (expires in $($response1.expires_in) seconds = ~60 days)" -ForegroundColor Green

Write-Host "`nStep 2: Getting Page token..." -ForegroundColor Yellow
$url2 = "https://graph.facebook.com/v19.0/me/accounts?access_token=$longUserToken"
$response2 = Invoke-RestMethod -Uri $url2
$pageToken = $response2.data[0].access_token
$pageName = $response2.data[0].name
Write-Host "✓ Page token obtained for: $pageName" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "LONG-LIVED PAGE TOKEN (never expires):" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host $pageToken -ForegroundColor White
Write-Host "`nThis token will work for months/years!" -ForegroundColor Green
