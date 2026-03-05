$ErrorActionPreference = 'Stop'

$RepoUrl = 'https://github.com/BTMorton/dnd-5e-srd'
$TargetDir = 'reference/srd/dnd-5e-srd'

if (-not (Test-Path (Join-Path $TargetDir '.git'))) {
    Write-Host "Cloning SRD dataset into $TargetDir..."
    git clone $RepoUrl $TargetDir
}
else {
    Write-Host "Updating existing SRD dataset in $TargetDir..."
    Push-Location $TargetDir
    try {
        git pull
    }
    finally {
        Pop-Location
    }
}
