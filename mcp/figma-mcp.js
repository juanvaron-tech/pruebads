#!/usr/bin/env node

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
if (!FIGMA_TOKEN) {
  process.stderr.write('ERROR: FIGMA_ACCESS_TOKEN environment variable is required.\n');
  process.exit(2);
}

let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  fetch = global.fetch;
}

if (!fetch) {
  process.stderr.write('ERROR: No fetch available\n');
  process.exit(1);
}

async function fetchFigmaFile(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) throw new Error(`Figma API error: ${res.status}`);
  return res.json();
}

function extractNodes(documentNode, acc = []) {
  if (!documentNode) return acc;
  const out = {
    id: documentNode.id,
    name: documentNode.name,
    type: documentNode.type,
  };
  if (documentNode.children && Array.isArray(documentNode.children)) {
    out.children = documentNode.children.map(c => ({ id: c.id, name: c.name, type: c.type }));
    documentNode.children.forEach(child => extractNodes(child, acc));
  }
  acc.push(out);
  return acc;
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

let initialized = false;

async function handleRequest(req) {
  const { id, method, params } = req;
  
  // Handle initialization
  if (method === 'initialize') {
    initialized = true;
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: { listChanged: false }
        },
        serverInfo: { name: 'figma-mcp', version: '1.0.0' }
      }
    });
    return;
  }

  // Handle method requests
  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'figma_get_file',
            description: 'Get Figma file data including components, styles and document structure',
            inputSchema: {
              type: 'object',
              properties: {
                fileId: { type: 'string', description: 'Figma file ID' }
              },
              required: ['fileId']
            }
          }
        ]
      }
    });
    return;
  }

  if (method === 'tools/call') {
    try {
      const { name, arguments: args } = params;
      if (name === 'figma_get_file') {
        const fileId = args?.fileId;
        if (!fileId) {
          send({ jsonrpc: '2.0', id, error: { code: -32602, message: 'fileId required' } });
          return;
        }
        const data = await fetchFigmaFile(fileId);
        const result = {
          fileId,
          name: data.name,
          components: data.components || {},
          styles: data.styles || {},
          nodes: extractNodes(data.document)
        };
        send({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            isError: false
          }
        });
        return;
      }
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown tool: ${name}` } });
    } catch (err) {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true
        }
      });
    }
    return;
  }

  // Unknown method
  send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } });
}

// Stdio handler
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
      handleRequest(req).catch(err => {
        send({
          jsonrpc: '2.0',
          id: req?.id || null,
          error: { code: -32603, message: err.message }
        });
      });
    } catch (e) {
      send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    }
  }
});

process.stdin.on('end', () => process.exit(0));
process.stderr.write('Figma MCP server ready\n');
