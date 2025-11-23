# Update Facebook Access Token in .env file
# Run this script to update your token

$newToken = "EAAlP9BVLIK8BQF8p2XUo4TRTjLKMLvgKZBktGm27dfEs2pSnIAlsviapklWLHLFZCZAvw2yaTQDMR195YpJCPtOUWZAB4iPrEtpXN8XnV9NosSjvshiB5AxPsRFEv9CdqZAWmDsDfMeiIS1ZAwujBWpYeprDPIyU8xZACxJufvIyUNaWd89n2cr26CxCW66DfnNDmQzIgQIZBTplhoLZCEPCbyAZDZD"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Facebook Access Token" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path .env) {
    Write-Host "✓ Found .env file" -ForegroundColor Green
    
    # Read current content
    $content = Get-Content .env -Raw
    
    # Update or add FB_ACCESS_TOKEN
    if ($content -match "FB_ACCESS_TOKEN=") {
        Write-Host "Updating existing FB_ACCESS_TOKEN..." -ForegroundColor Yellow
        $content = $content -replace "FB_ACCESS_TOKEN=.*", "FB_ACCESS_TOKEN=$newToken"
    }
    else {
        Write-Host "Adding FB_ACCESS_TOKEN..." -ForegroundColor Yellow
        $content += "`nFB_ACCESS_TOKEN=$newToken"
    }
    
    # Save updated content
    $content | Set-Content .env -NoNewline
    Write-Host "✓ .env file updated successfully!" -ForegroundColor Green
}
else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating new .env file..." -ForegroundColor Yellow
    "FB_ACCESS_TOKEN=$newToken" | Set-Content .env
    Write-Host "✓ Created .env file with token" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. ✓ Local .env updated" -ForegroundColor Green
Write-Host "2. Update Vercel environment variable:" -ForegroundColor White
Write-Host "   - Go to: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   - Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   - Edit FB_ACCESS_TOKEN" -ForegroundColor Gray
Write-Host "   - Paste: $newToken" -ForegroundColor Gray
Write-Host "3. Redeploy your site" -ForegroundColor White
Write-Host ""
Write-Host "Token has been copied to clipboard!" -ForegroundColor Green
$newToken | Set-Clipboard

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
