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





function prepare(){
    echo "Preparing $1"
    cd $1
    ./build.sh
    cd ..
    echo -e "done building${GREEN} $1 ${NC}"
}

echo "Creating network..."
docker network create neobank

echo "Compiling services..."

prepare "neo-bank-v4/"
prepare "trader/"
prepare "backend_transaction_processor/"
prepare "backend_transaction_validator/"
prepare "backend_transaction_transfer/"
prepare "stock_exchange/"
prepare "front_v2/"
prepare "transaction_manager/"
prepare "batch/"
prepare "batch_simulations/"



docker compose -p neobank up -d
docker compose -f transaction_manager/docker-compose.yml -p transaction_manager up -d


echo "Initiating sharding cluster"
cd transaction_manager/sharding
./init.sh
cd ../..


cd scenarios/
npm install && node scenario.js
cd ..

echo -e "${GREEN} --- All services ready --- ${NC}"