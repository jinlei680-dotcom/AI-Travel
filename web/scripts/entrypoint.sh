#!/bin/sh
set -e

# Source environment variables from .env.local if present
if [ -f ./.env.local ]; then
  # Export all non-comment lines as environment variables
  export $(grep -v '^#' ./.env.local | xargs)
fi

# Default port 3000 unless overridden by PORT env
PORT_TO_USE=${PORT:-3000}

echo "Starting Next.js server on port ${PORT_TO_USE}"
npm run start -- -p ${PORT_TO_USE}