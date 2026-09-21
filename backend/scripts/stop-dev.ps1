$pidFile = Join-Path (Get-Location) ".dev-logs/dev.pid"

if (-not (Test-Path $pidFile)) {
  Write-Host "No .dev-logs/dev.pid file found."
  exit 0
}

$rootPid = [int](Get-Content $pidFile)
$processes = Get-CimInstance Win32_Process
$toStop = New-Object System.Collections.Generic.HashSet[int]
[void]$toStop.Add($rootPid)

$changed = $true
while ($changed) {
  $changed = $false

  foreach ($process in $processes) {
    if (
      $process.ParentProcessId -and
      $toStop.Contains([int]$process.ParentProcessId) -and
      -not $toStop.Contains([int]$process.ProcessId)
    ) {
      [void]$toStop.Add([int]$process.ProcessId)
      $changed = $true
    }
  }
}

foreach ($id in ($toStop | Sort-Object -Descending)) {
  Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
}

Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
Write-Host "Stopped dev stack."
