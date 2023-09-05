#!/bin/bash

echo "🌀 Generating favicons bundle..."
echo

# Check if MASTER_URL is provided
if [ -z "$MASTER_URL" ]; then
  echo "🛑 Error: MASTER_URL variable is not provided."
  exit 1
fi

# Check if API_KEY is provided
if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY variable is not provided."
  exit 1
fi

# Mask the API_KEY to display only the first 4 characters
API_KEY_MASKED="${API_KEY:0:8}***"
echo "🆗 The following variables are provided:"
echo "      MASTER_URL: $MASTER_URL"
echo "      API_KEY: $API_KEY_MASKED"
echo

# RealFaviconGenerator API endpoint URL
API_URL="https://realfavicongenerator.net/api/favicon"

# Target folder for the downloaded assets
TARGET_FOLDER="./output"

# Path to the config JSON template file
CONFIG_TEMPLATE_FILE="config.template.json"

# Path to the generated config JSON file
CONFIG_FILE="config.json"

# Replace <api_key> and <master_url> placeholders in the JSON template file
API_KEY_VALUE="$API_KEY"
sed -e "s|<api_key>|$API_KEY_VALUE|" -e "s|<master_url>|$MASTER_URL|" "$CONFIG_TEMPLATE_FILE" > "$CONFIG_FILE"

# Make the API POST request with JSON data from the config file
echo "⏳ Making request to API..."
API_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d @"$CONFIG_FILE" "$API_URL")

# Check if the API response is valid JSON and contains success status
if ! jq -e '.favicon_generation_result.result.status == "success"' <<< "$API_RESPONSE" >/dev/null; then
  echo "🛑 Error: API response does not contain the expected structure or has an error status."
  exit 1
fi
echo "🆗 API responded with success status."

# Create the response.json file with the API response
echo "$API_RESPONSE" > response.json

# Parse the JSON response to extract the file URL and remove backslashes
FILE_URL=$(echo "$API_RESPONSE" | jq -r '.favicon_generation_result.favicon.package_url' | tr -d '\\')

# Check if FILE_URL is empty
if [ -z "$FILE_URL" ]; then
  echo "🛑 File URL not found in JSON response."
  exit 1
fi

echo "🆗 Found following file URL in the response: $FILE_URL"
echo

# Generate a filename based on the URL
FILE_NAME=$(basename "$FILE_URL")

# Check if the target folder exists and clear its contents if it does
if [ -d "$TARGET_FOLDER" ]; then
  rm -r "$TARGET_FOLDER"/*
else
  mkdir -p "$TARGET_FOLDER"
fi

# Download the file
echo "⏳ Trying to download the file..."
curl -s -L "$FILE_URL" -o "$FILE_NAME"

# Check if the download was successful
if [ $? -eq 0 ]; then
  echo "🆗 File downloaded successfully."
  echo
else
  echo "🛑 Error: Failed to download the file."
  exit 1
fi

# Unzip the downloaded file to the target folder
echo "⏳ Unzipping the file..."
unzip -q "$FILE_NAME" -d "$TARGET_FOLDER"

# Check if the unzip operation was successful
if [ $? -eq 0 ]; then
  echo "🆗 File unzipped successfully."
  echo
else
  echo "🛑 Failed to unzip the file."
  exit 1
fi

# Clean up - remove the JSON response file and temporary JSON config file
rm response.json "$CONFIG_FILE"

echo "✅ Done."
echo