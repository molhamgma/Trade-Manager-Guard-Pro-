$ErrorActionPreference = "Stop"
$outputFile = "C:\Users\Mohmmad Molhem\Downloads\Trade Manager Guard Pro V1.1\trade-manager-guard-pro-v1.3 (1)\Manual_And_SourceCode.md"
$projectRoot = "C:\Users\Mohmmad Molhem\Downloads\Trade Manager Guard Pro V1.1\trade-manager-guard-pro-v1.3 (1)"

Write-Host "Generating Documentation..."

# Create File with Header
Set-Content -Path $outputFile -Value "# Trade Manager Guard Pro V1.1 - Documentation" -Encoding UTF8
Add-Content -Path $outputFile -Value "Date: $(Get-Date -Format 'yyyy-MM-dd')" -Encoding UTF8
Add-Content -Path $outputFile -Value "`n## 1. Introduction`nTrade Manager Guard Pro is a custom Money Management System built with React and TypeScript." -Encoding UTF8
Add-Content -Path $outputFile -Value "`n## 2. Source Code" -Encoding UTF8

# Get Files
$files = Get-ChildItem -Path $projectRoot -Recurse -File -Include *.ts, *.tsx, *.css, *.html, *.json, *.js, *.bat
foreach ($file in $files) {
    # Filters
    if ($file.FullName -match "node_modules") { continue }
    if ($file.FullName -match "dist") { continue }
    if ($file.FullName -match "\.git") { continue }
    if ($file.Name -eq "package-lock.json") { continue }
    if ($file.FullName -eq $outputFile) { continue }

    $relativePath = $file.FullName.Replace($projectRoot, "")
    $ext = $file.Extension.Trim('.')
    
    # Write File Header
    Add-Content -Path $outputFile -Value "`n---" -Encoding UTF8
    Add-Content -Path $outputFile -Value "### File: $relativePath" -Encoding UTF8
    Add-Content -Path $outputFile -Value "```$ext" -Encoding UTF8
    
    # Write File Content
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        if ($content) {
            Add-Content -Path $outputFile -Value $content -Encoding UTF8
        }
    }
    catch {
        Add-Content -Path $outputFile -Value "[Error reading file]" -Encoding UTF8
    }

    # Close Code Block
    Add-Content -Path $outputFile -Value "```" -Encoding UTF8
    
    Write-Host "Processed: $relativePath"
}

Write-Host "Done! File saved to: $outputFile"
