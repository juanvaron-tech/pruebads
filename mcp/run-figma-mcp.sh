#!/bin/bash
# Figma MCP Server Wrapper
export FIGMA_ACCESS_TOKEN="${FIGMA_ACCESS_TOKEN:-}"
if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
  echo "Error: FIGMA_ACCESS_TOKEN environment variable is required" >&2
  exit 2
fi
exec node "$(dirname "$0")/figma-mcp.js"
