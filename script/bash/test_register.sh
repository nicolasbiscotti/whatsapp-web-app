#!/bin/bash

# Source the test_data file to load variables
source "./env/test_data"

echo "Testing /register endpoint..."

# Send POST request to /register endpoint
response=$(curl -s -X POST "$BASE_URL/register" \
-H "Content-Type: application/json" \
-d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

echo "Response:"
echo $response
