# Gotchas de Framer (MCP + interfaz)

**Conexión**
- El MCP (unframer) se conecta con el plugin **Tommy's MCP**: ⌘K → «Tommy» → Enter, en la pestaña del editor. Cerrar o navegar la pestaña lo desconecta. Solo trabaja sobre **un proyecto** a la vez (el que tiene el plugin abierto).
- Solo la página **enfocada** se lee/edita fiable; las demás salen aplanadas («Node is not a text node», `position="absolute"` falsos). Enfocar la página antes de editar.

**Lo que el MCP no ve ni toca**
- Interactions (On Tap, Overlay, Hover), Effects, Pointer, links de instancias, zIndex/pins de instancias. → interfaz en Chrome.
- Fuentes subidas (CUSTOMV2) en `searchFonts`/`manageTextStyle`; usar los estilos existentes por `inlineTextStyle`.
- Campos de galería del CMS.

**Escritura**
- `updateXmlForNode` **re-parenta** todo lo que va dentro del wrapper: para editar textos, mandar cada nodo como raíz de su llamada.
- Props por breakpoint: Tablet/Phone son réplicas con su propio valor; editar `<idBreakpoint><idNodo>` uno por uno.
- Color fijo por capa tapa el del estilo; se reemplaza en la interfaz (Select → Text layers → Selection Colors).
- `backgroundColor="linear-gradient(...)"` en un Frame nuevo puede pintar negro: usar sólido o imagen.
- Imágenes: el MCP no sube a páginas no enfocadas y rechaza hosts lentos; en Chrome, parchear `HTMLInputElement.prototype.click` y usar `file_upload` sobre el `input[type=file]` de Framer.
- Code files grandes: pegar en Monaco con `ClipboardEvent('paste')`, cmd+S.

**CMS**
- `createCMSCollection` crea colecciones **gestionadas por el plugin** (el usuario no edita campos). Para colecciones del usuario: crear en la interfaz o **importar CSV** (Framer infiere los campos; luego se ajustan tipos).
- `upsertCMSItem`: siempre `draft: true` en borradores (si no, publica el ítem); reenviar referencias en cada update (`collectionReference` null, multi-ref con IDs, no slugs).
- Custom code de páginas CMS acepta `{{Campo}}` → JSON-LD por ítem sin JS. Title/description de la plantilla aceptan `{{Campo}}`.

**Publicación**
- Publish = producción (y la URL `.framer.app` con el mismo deploy). Ramas: construir en rama y que la persona fusione.
- Suscripción inactiva del workspace → modal «Reactivate»; el proyecto puede quedar read-only: recargar, cerrar aviso y relanzar plugin.

## Sesión 2026-10-29 (construcción de /recursos)
- **XML parcial con hijos existentes por nodeId los conserva**, pero si mandas SOLO algunos hijos, Framer los REORDENA. Manda siempre la lista completa de hijos en su orden.
- **Links solo se guardan si la página destino existe.** Crea la página primero (createPage {name:"/ruta", type:"web"}), luego el link.
- **padding acepta 1 o 4 valores.** "6px 8px" se descarta en silencio.
- **stackDistribution por defecto = center.** Declara "start" explícito en sidebars y listas.
- **left="calc(...)" no existe:** se convierte en centerX. centerX = posición del CENTRO en % del padre (50% = centrado), no un offset.
- **Anclar ventanas a orillas (left/right fijos) aguanta mejor 1200–1440 que centerX.** Para limpiar un pin: atributo vacío (left="").
- **Al crear un nodo absoluto con bottom, a veces sale top=0:** revisa el diff y corrige con top="" bottom="Npx".
- **No hay atributo de sombra.** Solo borderWidth/borderStyle/borderColor. Las sombras se ponen en la UI.
- **backgroundImage solo se sube con URL externa y en un nodo NUEVO sin hijos** (sale como <Image>). Las URLs de framerusercontent se ignoran; un Frame existente no se convierte en Image. Para una imagen local: get_screenshot de Figma → su URL temporal sirve como fuente.
- **Peligro: el campo de nombre del proyecto.** Escribir con el foco en la barra superior RENOMBRÓ el proyecto ("900"). Se restaura con clic en el nombre → campo Name. No uses los campos W/H del Preview a ciegas; verifica el foco antes de escribir.
- **CRASH: crear un nodo NUEVO dentro de un breakpoint no primario (Phone/Tablet) tumba el proyecto** («Assertion Error: Original id must not be empty»). En réplicas solo se cambian atributos (id = breakpoint + id original, p. ej. Y2y6lxpYd + gBfYD5ZvX). Los nodos solo-móvil se crean en Desktop con visible="false" y se prenden en la réplica.
- **Texto dentro de un Stack nuevo creado dentro de un padre existente a veces cae en la raíz del Desktop.** Crear primero el contenedor; luego añadir los textos con la lista completa de hijos.
- **El MCP sí edita páginas no enfocadas** (updateXmlForNode por nodeId de otra página funcionó en 2026-10-29).
- **Copiar/pegar capas entre páginas** (Layers → clic en hijo → cmd+A → cmd+C → otra página → clic en la barra «Desktop» → cmd+V): los nodos ocultos no viajan y los absolutos llegan como relativos; restaurar pins por MCP.
- **CRASH 2: con un breakpoint extra ya creado, CUALQUIER nodo nuevo por MCP (aunque sea en Desktop) tumba el proyecto.** Orden obligatorio: construir TODO en Desktop (lo solo-móvil con visible="false") → agregar el breakpoint en la UI → solo atributos en réplicas. Tras un crash: abrir el proyecto en pestaña NUEVA (la vieja queda colgada por beforeunload), Dismiss al aviso de suscripción, relanzar Tommy.
- **Image props on instances (and pins on instances) do NOT apply via MCP** (it reports "unchanged"). Working trick in the UI: in the page console, patch `HTMLInputElement.prototype.click` so that for `type=file` it injects a `File` (fetched with `fetch(url).blob()`) via `DataTransfer` and dispatches `input`/`change`; then select the instance → Image control → click the popover preview. «Image has been uploaded». Synthetic drag-and-drop does NOT work (it creates a loose layer). Pins: type into the T/L/R/B field and Framer pins that side and releases the opposite one.
- **Copying layers between projects works** (cmd+C in one tab, select the Desktop breakpoint in the other, cmd+V): it brings over components and code (Nav, Logotype, ShaderGradient).
- **Clicking the plugin panel's X closes the plugin**; to hide it use the ^ arrow, not the X.

- **Pasar un archivo al navegador:** no transcribas un base64 largo a mano porque llega truncado y la imagen sale cortada. Pártelo en trozos de unos 3.3 KB, pásalos en llamadas separadas y compara la longitud y la suma de códigos de cada trozo contra la que da Bash. Tampoco sirve hacer `fetch` a un servidor en `http://127.0.0.1` desde framer.com: el renderer se queda colgado (probablemente esperando el permiso de red local).
- **Cambiar texto por MCP sin moverlo:** si mandas `<Padre nodeId=X><Texto nodeId=Y>nuevo</Texto></Padre>` y Y no es hijo directo de X, el MCP lo re-parenta a X. Para cambiar solo el texto, llama con `nodeId` = el propio texto y el XML solo de ese nodo. Los `Input` de un Form no salen en el XML: si un texto acaba después de su input, se arregla en la UI con clic derecho → Move → Send to back (atajo `[`); `cmd+[` es «atrás» en la navegación, no reordena.
- **Textos ligados a variables de componente** (badge morado con el nombre del campo, p. ej. «Work Title»): el MCP responde «unchanged». En la variante primaria se editan con doble clic en el lienzo. En una variante NO: lo que escribes ahí se va a la primaria. Para la variante: selecciona el texto en Layers → Content → «×» (desliga) → escribe en el campo Content del panel. Los ids replica son `idVariante + idOriginal` y sí aceptan atributos (visible, props de instancia), no texto ligado.

## Agregar secciones a un componente con variantes (2026-10-30)
- En un **componente** (no en página con breakpoints) el MCP sí crea nodos: `<Stack ...>` crea el frame, pero los textos solo se crean con la etiqueta `<Text>`; con nombres inventados (`<H2PorQue>`) los crea sueltos en otro padre. Revisar el XML después.
- Lo creado en la variante primaria aparece en todas. Texto propio por variante: `updateXmlForNode` sobre la réplica (`variantId+nodeId`) con `<Text nodeId=...>` funciona porque el texto nuevo no está ligado a variable.
- Para ocultarlo en otras variantes: `visible="false"` en las réplicas; el error "Cannot set parent of a replica node" al reordenar es inofensivo.

## Réplica fiel de una ventana compleja: componente de código (2026-10-30)
- El XML del MCP ignora `boxShadow`, `border*` y `<SVG>`; `createComponent` falla («createComponentNode is not a function»). Para igualar Figma con íconos, bordes y sombras, un componente de código (`createCodeFile`) es más fiel y rápido que nodo por nodo. Imágenes: prop `ControlType.ResponsiveImage` + subida por el interceptor de `input[type=file]`; los assets de Figma (`/api/mcp/asset/...`) se pueden `fetch` desde la pestaña de framer.com.
- **No usar efectos de expresión** (`useEffect(() => ref.current?.scrollTo(...))`): en sitios con scroll suave `scrollTo` devuelve algo, React lo toma como limpieza y al desmontar (cerrar overlay) truena con «c is not a function» y la página entera queda en «Error». Siempre cuerpo en bloque.
- `ControlType.EventHandler` ligado a «Close Overlay» desde dentro de un componente también tronó; más robusto: dejar el control de cierre nativo debajo y hacer los semáforos del código `pointer-events: none` (incluidos los envoltorios de Framer, subiendo por `parentElement` mientras sea hijo único).
- Insertar el código en la variante primaria de un componente con 14 variantes: ocultarlo por réplica (`variantId+nodeId visible=false`) en las que no aplica. NO ocultar hermanos en la primaria: el `visible=false` se hereda a todas las variantes sin override.
- Las ventanas de overlay del Dock viven en la página bajo `DockNav > Dock-navigation > *-Overlay`; el MCP no las lista: seleccionarlas en Layers y leer con `getSelectedNodesXml`.

## Ronda Blog CMS (2026-10-30)
- **Overrides por capa sobreviven al cambio de estilo.** Un texto que viene de plantilla trae color/alineación propios (p. ej. #999999 centrado) encima del text style; `manageTextStyle update` no los toca y el XML no los muestra. Se quitan en la UI: Text → Color "×" y Align. Con varios textos seleccionados (Enter sobre el padre) se limpian de una.
- **Rich text (formattedText) tiene ranuras por etiqueta** (Paragraph, H1–H3, Link, Spacing) que el XML no expone. Si vienen de plantilla con "Display Large" el nodo mide 20 000 px y "desaparece" el artículo. Arreglar en Text → Paragraph/Heading 2.
- **`duplicateNode` del MCP pierde los bindings CMS** de los textos dentro de un Collection List. Duplicar con cmd+D en la UI (seleccionando la lista, no el ítem) los conserva.
- **Collection List:** Insert → CMS → Collections → clic en la colección con un nodo seleccionado la crea suelta en el canvas; luego se re-parenta por XML sin perder nada. Filtro: Filters → campo → Static → valor. El select de campo del filtro es nativo: usar `form_input`.
- **Rebind de un texto:** Content → ícono de variable → Set variable → campo (hover sobre el submenú antes de clicar).
- **Truncar a 1 línea:** Text → "+" → Truncate.
- **Un fondo `linear-gradient(...)` pegado entre páginas puede renderizar negro** aunque el XML lo muestre bien; ocultarlo y usar el color sólido del Desktop.
- **Botón dentro de fila flex se encoge** aunque sea fit-content: dar ancho fijo.
- **Preview se queda en blanco** tras varios cambios: botón de recarga del preview (no recargar la pestaña).
- **Mover una página CMS de carpeta** (p. ej. /blog → /recursos/blog): drag instantáneo y "Settings" del menú contextual no respondieron; queda manual.
- **Interacción sin overrides:** el MCP no asigna code overrides. Patrón que sí funciona: componente de código (insertado por XML con `ComponentInstance insertUrl="...js@ver#Export"`) que filtra el DOM buscando `data-framer-name` de capas nombradas por XML (`name="Nota"`). Leer texto con `textContent` de cada `p` (innerText de un nodo oculto no trae saltos de línea).
- **Renombrar capas:** atributo `name` en updateXmlForNode.
- **Overlay nativo:** fila → Overlays + → hover y clic en "Fixed". El contenido se mete cortando (cmd+X) y pegando (cmd+V) tras clicar la etiqueta "Editing overlay". Centrar con los botones de alinear del panel (XML no centra). Z-index máximo 10 en la UI. El formulario insertado crea su propio "Button N": editarlo no toca otros formularios.
- **Escape en Preview** sale del Preview: no usarlo para probar campos.
