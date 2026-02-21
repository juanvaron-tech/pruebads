#!/usr/bin/env node
// Minimal MCP server for debugging

process.stderr.write("MCP Server started\n");

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines[lines.length - 1];
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const req = JSON.parse(line);
      // Simple echo: just respond with the request back
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: req.id,
        result: { ok: true, received: req }
      }) + '\n');
    } catch (e) {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' }
      }) + '\n');
    }
  }
});

process.stdin.on('end', () => {
  process.stderr.write("MCP Server ending\n");
  process.exit(0);
});
