#!/bin/bash

# Source the test_data file to load variables
source "./env/test_data"

# Replace this with the token obtained from the /login endpoint
TOKEN=$(jq -r '.token' ./env/token.json)

echo "Testing /protected endpoint..."

# Send GET request to /protected endpoint
response=$(curl -s -X GET "$BASE_URL/protected" \
-H "Authorization: Bearer $TOKEN")

echo $response > ./env/protected_response.json

echo "Response:"
echo $response
