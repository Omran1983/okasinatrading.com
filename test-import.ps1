$body = @{
    albumId        = "2893012654269842"
    albumName      = "TROUSERS AND DUPATTA"
    useAI          = $false
    createProducts = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://okasinatrading.com/api/facebook/import-album" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
