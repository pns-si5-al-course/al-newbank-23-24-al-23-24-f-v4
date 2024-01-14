# 1. Initiate config server
docker compose -f config-server/docker-compose.yaml up -d
# 2. Initiate shard1
docker compose -f shard1/docker-compose.yaml up -d
# 3. Initiate mongos
docker compose -f mongos/docker-compose.yaml up -d

# Run init script on config server
docker cp config-server/init-mongo-int.sh cfgsvr1:/init-mongo-int.sh

# Run init script on shard1
docker cp shard1/init-mongo-int.sh shard1svr1:/init-mongo-int.sh

# Run init script on mongos
docker cp mongos/init-mongo-int.sh mongos:/init-mongo-int.sh