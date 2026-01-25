$extensionsJson = Get-Content -Path "$PSScriptRoot\extensions.json" | ConvertFrom-Json
$recommendations = $extensionsJson.recommendations

if ($recommendations.Count -gt 0) {
  foreach ($extension in $recommendations) {
    code --install-extension $extension
  }
} else {
  Write-Host "No recommended extensions found."
}
