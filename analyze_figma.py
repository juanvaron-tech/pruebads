#!/usr/bin/env python3
"""
Script para analizar la estructura de un archivo Figma via MCP
"""
import json
import sys
import subprocess
import os

os.chdir('/Users/juan.varon/Documents/ds_prueba')
# Token should be set via environment variable
if 'FIGMA_ACCESS_TOKEN' not in os.environ:
    raise ValueError('FIGMA_ACCESS_TOKEN environment variable not set')

# Request al MCP
request = '{"id":2,"method":"tools/call","params":{"name":"figma_get_file","arguments":{"fileId":"G6gS8XGQEFxErCvDtGypFM"}}}'

try:
    # Ejecutar el servidor MCP
    proc = subprocess.Popen(['node', 'mcp/figma-mcp.js'], 
                          stdin=subprocess.PIPE,
                          stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE,
                          text=True)
    
    # Enviar request
    stdout, stderr = proc.communicate(input=request, timeout=10)
    
    # Parsear respuesta
    for line in stdout.split('\n'):
        if not line.strip():
            continue
        try:
            data = json.loads(line)
            if 'result' in data and 'content' in data['result']:
                content_text = data['result']['content'][0]['text']
                figma_data = json.loads(content_text)
                
                print("\n=== ESTRUCTURA DE TU ARCHIVO FIGMA ===\n")
                print(f"📁 Nombre del archivo: {figma_data.get('name', 'N/A')}")
                print(f"🆔 File ID: G6gS8XGQEFxErCvDtGypFM")
                
                print(f"\n--- PÁGINAS Y FRAMES PRINCIPALES ---\n")
                
                nodes = figma_data.get('nodes', [])
                
                # Filtrar y mostrar estructura
                document_node = None
                for node in nodes:
                    if node.get('type') == 'DOCUMENT':
                        document_node = node
                        break
                
                if document_node and 'children' in document_node:
                    for child in document_node['children']:
                        child_name = child.get('name', 'Sin nombre')
                        child_type = child.get('type', 'Unknown')
                        child_count = len(child.get('children', []))
                        
                        icon = "📄"
                        if child_type == 'CANVAS':
                            icon = "📄"
                        elif child_type == 'FRAME':
                            icon = "📦"
                        elif child_type == 'SECTION':
                            icon = "📋"
                        
                        if child_count > 0:
                            print(f"{icon} {child_name} [{child_count} elementos]")
                            # Mostrar frames/componentes dentro
                            for subchild in child.get('children', [])[:10]:
                                subname = subchild.get('name', 'Sin nombre')
                                subtype = subchild.get('type', 'Unknown')
                                sub_icon = "  ├─ 🧩" if subtype == 'COMPONENT' else "  ├─ 📦" if subtype == 'FRAME' else "  ├─"
                                print(f"{sub_icon} {subname}")
                            if len(child.get('children', [])) > 10:
                                print(f"  ... y {len(child.get('children', [])) - 10} elementos más")
                        else:
                            print(f"{icon} {child_name}")
                
                print(f"\n--- COMPONENTES GLOBALES ---\n")
                components = figma_data.get('components', {})
                if components:
                    comp_list = list(components.items())
                    for comp_id, comp_info in comp_list[:15]:
                        comp_name = comp_info.get('name', 'Sin nombre')
                        print(f"  🧩 {comp_name}")
                    if len(comp_list) > 15:
                        print(f"  ... y {len(comp_list) - 15} componentes más")
                else:
                    print("  (No hay componentes globales definidos)")
                
                print(f"\n--- ESTILOS ---\n")
                styles = figma_data.get('styles', {})
                if styles:
                    style_list = list(styles.items())
                    style_types = {}
                    for style_id, style_info in style_list:
                        style_type = style_info.get('styleType', 'UNKNOWN')
                        if style_type not in style_types:
                            style_types[style_type] = []
                        style_types[style_type].append(style_info.get('name', 'Sin nombre'))
                    
                    for stype, names in style_types.items():
                        print(f"  {stype}: {len(names)} estilos")
                        for name in names[:5]:
                            print(f"    • {name}")
                        if len(names) > 5:
                            print(f"    ... y {len(names) - 5} más")
                else:
                    print("  (No hay estilos definidos)")
                
                print("\n✅ Análisis completado\n")
                break
        except json.JSONDecodeError:
            pass
        except Exception as e:
            print(f"Error procesando: {e}")

except subprocess.TimeoutExpired:
    print("Error: Timeout al consultar Figma")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
