# Define colors
$GREEN = "`e[0;32m"
$NC = "`e[0m" # No Color

# Catching CTRL+C
trap {
    Write-Host "Stopping services..."
    docker compose -p neobank down
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

docker network create neobank

Prepare "neo-bank-v4/"
Prepare "trader/"
Prepare "backend_transaction_processor/"
Prepare "backend_transaction_validator/"
Prepare "backend_transaction_transfer/"
Prepare "stock_exchange/"
Prepare "transaction_manager/"
Prepare "front_v2/"
Prepare "batch/"


docker compose -p neobank up -d
docker compose -f transaction_manager/docker-compose.yml -p transaction_manager up -d

Set-Location scenarios/
npm install
node scenario.js
Set-Location ..

Write-Host "--- Done Building ---"
