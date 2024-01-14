docker exec -i cfgsvr1 sh init-mongo-int.sh
docker exec -i shard1svr1 sh init-mongo-int.sh

# wait for mongos to be ready
echo "Waiting for mongos to be ready..."
while ! docker exec -i mongos mongosh --quiet --eval "db.getMongo()"; do
    sleep 1
    echo -n "."
done
docker exec -i mongos sh init-mongo-int.sh
