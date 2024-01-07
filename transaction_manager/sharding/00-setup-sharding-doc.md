## Set up Sharding using Docker Containers

## Create networks

docker network create mongo-cluster

### Config servers
Start config servers (3 member replica set)
```
docker compose -f config-server/docker-compose.yaml up -d
```
Initiate replica set
```
mongosh mongodb://localhost:40001
```
```
rs.initiate(
  {
    _id: "cfgrs",
    configsvr: true,
    members: [
      { _id : 0, host : "cfgsvr1:27017" },
      { _id : 1, host : "cfgsvr2:27017" },
      { _id : 2, host : "cfgsvr3:27017" }
    ]
  }
)

rs.status()
```

### Shard 1 servers
Start shard 1 servers (3 member replicas set)
```
docker-compose -f shard1/docker-compose.yaml up -d
```
Initiate replica set
```
mongosh mongodb://localhost:50001
```
```
rs.initiate(
  {
    _id: "shard1rs",
    members: [
      { _id : 0, host : "shard1svr1:27017" },
      { _id : 1, host : "shard1svr2:27017" },
      { _id : 2, host : "shard1svr3:27017" }
    ]
  }
)

rs.status()
```

### Mongos Router
Start mongos query router
```
docker-compose -f mongos/docker-compose.yaml up -d
```

### Add shard to the cluster
Connect to mongos
```
mongosh mongodb://localhost:60000
```
Add shard
```
sh.addShard("shard1rs/shard1svr1:27017,shard1svr1:27017,shard1svr1:27017")
sh.status()
```
