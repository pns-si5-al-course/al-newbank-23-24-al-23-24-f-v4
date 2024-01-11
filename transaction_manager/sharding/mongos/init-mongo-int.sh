#!/bin/bash

mongosh mongodb://mongos:27017 --eval '
sh.addShard("shard1rs/shard1svr1:27017,shard1svr1:27017,shard1svr1:27017");
'
