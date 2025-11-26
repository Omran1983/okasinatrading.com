$envContent = Get-Content .env -Raw
$tokenLine = $envContent -split "`n" | Where-Object { $_ -match "^FB_ACCESS_TOKEN=" }
$token = $tokenLine -replace "^FB_ACCESS_TOKEN=", ""
$token = $token.Trim()

Write-Host "Token length: $($token.Length)"
Write-Host "First 50 chars: $($token.Substring(0, [Math]::Min(50, $token.Length)))"

# Update Vercel
vercel env rm FB_ACCESS_TOKEN production --yes
Start-Sleep -Seconds 2
echo $token | vercel env add FB_ACCESS_TOKEN production
