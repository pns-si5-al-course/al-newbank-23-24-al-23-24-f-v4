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

prepare "neo-bank-v4/"
prepare "trader/"
prepare "transaction_manager/"
prepare "backend_transaction_processor/"
prepare "backend_transaction_validator/"
prepare "stock_exchange/"
prepare "front_v2/"

docker compose -p neobank up -d

cd scenarios/
node scenario.js > scenario.log
cd ..

echo "--- Done Building ---"