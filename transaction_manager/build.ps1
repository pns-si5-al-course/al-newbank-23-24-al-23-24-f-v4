# Build docker image with file Dockerfile.production
docker build -t transaction_manager -f Dockerfile .

# Initiate sharding cluster
# 1. Initiate config server
docker compose -f sharding/config-server/docker-compose.yaml up -d

# Run init script on config server
docker cp sharding/config-server/init-mongo-int.sh cfgsvr1:/init-mongo-int.sh
docker exec cfgsvr1 sh init-mongo-int.sh

# 2. Initiate shard1
docker compose -f sharding/shard1/docker-compose.yaml up -d

# Run init script on shard1
docker cp sharding/shard1/init-mongo-int.sh shard1svr1:/init-mongo-int.sh
docker exec shard1svr1 sh init-mongo-int.sh

# 3. Initiate mongos
docker compose -f sharding/mongos/docker-compose.yaml up -d

# Run init script on mongos
docker cp sharding/mongos/init-mongo-int.sh mongos:/init-mongo-int.sh
docker exec mongos sh init-mongo-int.sh
