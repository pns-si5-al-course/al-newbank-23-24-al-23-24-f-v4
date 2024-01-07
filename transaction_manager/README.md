# Transaction Manager Service


Made with NestJS 


- 1 Hot Replica
- Connected to one sharded mongodb cluster
- Nginx Reverse proxy
- **Prometheus and Grafana for metrics at localhost:9090**


- ### Send request to nginx proxy **'localhost:100/transaction_manager/'** and **not directly to 'localhost:3009/'**

### Receives requests of the following form

```
curl -X 'POST' \
  'http://localhost:100/transaction_manager/payment' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "fiiejfeijfe",
  "idUser": 1,
  "amount": 10,
  "source_currency": "EUR",
  "target_currency": "USD",
  "idCredited": "2"
}'
```