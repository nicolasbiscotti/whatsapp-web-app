#!/bin/bash

# Source the test_data file to load variables
source "./env/test_data"

echo "Testing /login endpoint..."

# Send POST request to /login endpoint
response=$(curl -s -X POST "$BASE_URL/login" \
-H "Content-Type: application/json" \
-d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

echo "Response:"
echo $response > ./env/token.json

# Extract the token from the response (assuming it's in JSON format with key "token")
TOKEN=$(echo $response | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
    echo "Token: success"
else
    echo "Failed to retrieve token."
fi
