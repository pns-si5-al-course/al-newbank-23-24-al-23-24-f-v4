# Function returning a random string
random_string() {
  tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w ${1:-32} | head -n 1
}

# Determine URL based on the first argument
if [ "$1" = "nginx" ]; then
  url="http://localhost:100/transaction_manager/payment"
else
  url="http://localhost:10001/payment"
fi

# Generate a random string
id=$(random_string)

# Ensure the string is not empty
while [ -z "$id" ]; do
    id=$(random_string)
done

# Make the POST request using curl
curl -X 'POST' \
  "$url" \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "'"$id"'",
  "idUser": 1,
  "amount": 1,
  "source_currency": "USD",
  "target_currency": "USD"
}'
