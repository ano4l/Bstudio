$ErrorActionPreference = 'Stop'
$ThemeRoot = Split-Path -Parent $PSScriptRoot
$BuildRoot = Join-Path $ThemeRoot '.theme-package'
$ZipPath = Join-Path $ThemeRoot 'bambi-studio-theme.zip'
if (Test-Path -LiteralPath $BuildRoot) { Remove-Item -LiteralPath $BuildRoot -Recurse -Force }
New-Item -ItemType Directory -Path $BuildRoot | Out-Null
foreach ($Folder in @('config','layout','locales','sections','snippets','templates')) { Copy-Item -LiteralPath (Join-Path $ThemeRoot $Folder) -Destination $BuildRoot -Recurse }
$AssetOutput = Join-Path $BuildRoot 'assets'
New-Item -ItemType Directory -Path $AssetOutput | Out-Null
Get-ChildItem -LiteralPath (Join-Path $ThemeRoot 'assets') -Recurse -File |
  Where-Object { $_.Name -ne 'studio-hero.png' } |
  ForEach-Object {
    $RelativePath = $_.FullName.Substring((Join-Path $ThemeRoot 'assets').Length).TrimStart('\', '/')
    $Destination = Join-Path $AssetOutput $RelativePath
    $DestinationDirectory = Split-Path -Parent $Destination
    if (-not (Test-Path -LiteralPath $DestinationDirectory)) {
      New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null
    }
    Copy-Item -LiteralPath $_.FullName -Destination $Destination
  }
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
Compress-Archive -Path (Join-Path $BuildRoot '*') -DestinationPath $ZipPath -CompressionLevel Optimal
Remove-Item -LiteralPath $BuildRoot -Recurse -Force
Write-Output "Created $ZipPath"
