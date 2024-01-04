$startTime = Get-Date

$duration = 2
$index = 1

do {
    curl http://localhost:100/transaction_manager/
    Write-Host "" $index
    $index++
    Start-Sleep -Seconds 2
} while ((Get-Date) - $startTime -lt (New-TimeSpan -Minutes $duration))

# Fin du script
Write-Host "Exécution de curl terminée après 2 minutes."
