# Build docker image with file Dockerfile.production
docker build -t transaction_manager -f Dockerfile .

# Initiate sharding cluster
# 1. Initiate config server
docker-compose -f sharding/config-server/docker-compose.yaml up -d

# Run init script on config server
docker exec -i cfgsvr1 bash -c 'sh' | Get-Content sharding/config-server/init-mongo.sh

# 2. Initiate shard1
docker-compose -f sharding/shard1/docker-compose.yaml up -d

# Run init script on shard1
docker exec -i shard1svr1 bash -c 'sh' | Get-Content sharding/shard1/init-mongo.sh

# 3. Initiate mongos
docker-compose -f sharding/mongos/docker-compose.yaml up -d

# Run init script on mongos
docker exec -i mongos bash -c 'sh' | Get-Content sharding/mongos/init-mongo.sh
