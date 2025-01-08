#!/bin/bash

# Define the URL of your WhatsApp Web App
URL="http://localhost:3000/get_messages"

# Define the group name
GROUP_NAME="Gorda"

# Make the POST request with curl
curl -X POST $URL \
     -H "Content-Type: application/json" \
     -d '{"group_name": "'$GROUP_NAME'"}'

# Print a message indicating the request has been made
echo "POST request sent to $URL for group name '$GROUP_NAME'"
