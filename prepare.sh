#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'


# catching CTRL+C
trap ctrl_c INT SIGINT SIGTERM

function ctrl_c() {
    echo "Stopping services..."
    docker compose -p soa-marsy down
    echo "Done"
    exit 0
}


echo "Compiling services..."



function prepare(){
    echo "Preparing $1"
    cd $1
    ./build.sh
    cd ..
    echo -e "done building${GREEN} $1 ${NC}"
}


docker network create neobank

prepare "neo-bank-v4/"
prepare "trader/"
prepare "transaction_manager/"
prepare "backend_transaction_processor/"
prepare "backend_transaction_validator/"
prepare "backend_transaction_transfer/"
prepare "stock_exchange/"
prepare "front_v2/"
prepare "batch/"


docker compose -p neobank up -d
docker compose -f transaction_manager/docker-compose.yml -p transaction_manager up -d

cd scenarios/
npm install && node scenario.js
cd ..

echo "--- Done Building ---"