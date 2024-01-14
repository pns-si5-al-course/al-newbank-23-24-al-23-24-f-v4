# Build docker image with file Dockerfile.production
docker build -t transaction_manager -f Dockerfile .

# Initiate sharding cluster

cd sharding
./build.sh
cd ..