# Define colors
$GREEN = "`e[0;32m"
$NC = "`e[0m" # No Color

# Catching CTRL+C
trap {
    Write-Host "Stopping services..."
    docker compose -p soa-marsy down
    Write-Host "Done"
    break
}

Write-Host "Compiling services..."

# Define the prepare function
function Prepare {
    Param (
        [string]$serviceName
    )
    Write-Host "Preparing $serviceName"
    Set-Location $serviceName
    ./build.ps1
    Set-Location ..
    Write-Host "done building $GREEN$serviceName$NC"
}

Prepare "neo-bank-v4/"
Prepare "trader/"
Prepare "transaction_manager/"
Prepare "backend_transaction_processor/"
Prepare "backend_transaction_validator/"
Prepare "stock_exchange/"
Prepare "front_v2/"

docker compose -p neobank up -d

Set-Location scenarios/
npm install
node scenario.js | Out-File scenario.log
Set-Location ..

Write-Host "--- Done Building ---"