# Figma MCP Server

Un servidor **Model Context Protocol (MCP)** local que actúa como proxy a la API REST de Figma.

## Características

- ✓ Inspecciona archivos de Figma (components, styles, documento)
- ✓ Integrado con Claude Code para acceso directo a diseños
- ✓ Protocolo MCP JSON-RPC 2.0 sobre stdio
- ✓ Token de acceso seguro via variable de entorno

## Instalación

### 1. Asegúrate que las dependencias están instaladas:

```bash
cd corporate-design-system
npm install
```

### 2. El servidor ya está registrado en Claude Code

Verifica el estado con:

```bash
cd /Users/juan.varon/Documents/ds_prueba
npx -p @anthropic-ai/claude-code claude mcp list
```

Deberías ver:

```
figma: node /Users/juan.varon/Documents/ds_prueba/mcp/figma-mcp.js - ✓ Connected
```

## Uso

### Desde Claude Code

1. El servidor está disponible como MCP `figma` en tu proyecto
2. Puedes usarlo para consultar archivos de Figma

### Métodos disponibles

- **`figma_get_file`** - Obtiene la estructura completa de un archivo Figma
  - Parámetro: `fileId` (ID del archivo Figma)
  - Retorna: componentes, estilos, nodos del documento

### Ejemplo CLI (prueba manual)

```bash
export FIGMA_ACCESS_TOKEN="YOUR_FIGMA_TOKEN_HERE"
node mcp/figma-mcp.js << 'EOF'
{"id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
{"id":2,"method":"tools/list","params":{}}
{"id":3,"method":"tools/call","params":{"name":"figma_get_file","arguments":{"fileId":"G6gS8XGQEFxErCvDtGypFM"}}}
EOF
```

## Arquitectura

`figma-mcp.js` implementa:
- JSON-RPC 2.0 sobre stdio
- Métodos MCP estándar: `initialize`, `tools/list`, `tools/call`
- Proxy de requests a la API de Figma (`https://api.figma.com/v1`)

## Token de acceso

### Configuración segura del token

1. **Obtén un token** en https://www.figma.com/developers/api#access-tokens
2. **Crea un archivo `.env`** con tu token (este archivo está en `.gitignore`):
   ```
   FIGMA_ACCESS_TOKEN=your_actual_token_here
   ```
3. **Carga el token en tu shell** antes de usar el MCP:
   ```bash
   export $(cat .env | xargs)
   ```

### Seguridad

⚠️ **IMPORTANTE:**
- Nunca hagas commit de tokens o valores sensibles
- Usa variables de entorno para credenciales
- El archivo `.env` está en `.gitignore` para tu protección
- Los tokens expuestos pueden ser revocados en Figma

## Próximos pasos

Con el MCP conectado, ahora puedes:
1. Inspeccionar la estructura de tu Design System en Figma
2. Usar Claude para ayudarte a generar componentes React con JSS basados en el diseño
3. Sincronizar automáticamente cambios desde Figma

¡Estás listo para empezar! 🚀
