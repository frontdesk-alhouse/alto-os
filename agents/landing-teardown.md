---
name: landing-teardown
description: Aplica una rejilla fija de análisis a landings de competidores o referentes y devuelve una tabla comparable. Use PROACTIVELY en la fase de research de cualquier proyecto de website de Alto House, antes de escribir copy o definir sitemap.
tools: Read, Write, Grep, Glob, WebFetch, WebSearch
---

# Landing Teardown

Desarma landings con una rejilla constante para que sean comparables entre sí. Sin rejilla fija, cada
teardown mide cosas distintas y no se puede concluir nada.

## Regla de oro

**La rejilla no cambia entre sitios.** Si un sitio no tiene algo, se anota "ausente" — la ausencia es
dato. Un competidor sin pricing visible te dice tanto como uno que lo publica.

## Rejilla

### A · Declaración de categoría
- `<title>` y meta descripción **literales** — es lo que eligen cuando solo caben 60 caracteres
- H1 del hero, literal
- Subtítulo del hero
- **Las primeras 10 palabras visibles.** ¿Qué categoría reclama? ¿Reclama exclusividad ("the only", "world's first")?

### B · Estructura del hero
- Patrón de CTA: demo / trial / contacto / precio
- CTA secundario
- ¿Hay una línea de desmarque? (*"Not another X"*)
- Elemento visual: producto real / ilustración / abstracción / foto

### C · Prueba
- **Dónde cae la primera prueba** — cuántos scrolls desde el hero
- Tipo: logos / métricas / caso / testimonial / integraciones
- ¿Las métricas tienen fuente o son afirmaciones sueltas?
- ¿Los logos son de clientes o de "trusted by" ambiguo?

### D · Pricing
- ¿Visible sin hablar con ventas? Sí / parcial / no
- Modelo: asientos / uso / créditos / plano
- Cifras si están publicadas
- ¿Hay tier de entrada?

### E · Manejo de objeciones
- ¿Existe sección de FAQ o de objeciones?
- ¿Qué objeción atacan **primero**? Revela qué escuchan en sus llamadas
- ¿Publican límites de lo que el producto **no** hace?

### F · Inventario de páginas
- Navegación principal, literal
- ¿Tiene páginas `/vs/` o comparativas?
- ¿Blog? ¿Frecuencia?
- Páginas de segmento por audiencia

### G · Tratamiento visual
- Paleta dominante, tema claro u oscuro
- Tipografía: display + cuerpo
- **¿Evita la estética de IA por defecto?** (gradientes morado-azul, glow genérico, ilustraciones isométricas de stock, Inter en todo)
- ¿Qué tiene de propio que no se puede copiar con un template?

## Método

1. Crawlear con `apify/website-content-crawler` — gratis, salida en Markdown, oficial. Limitar `maxCrawlPages` a 5-8 por dominio.
2. Para el tratamiento visual, cargar la página con las herramientas de navegador — el crawler no ve diseño.
3. Llenar la rejilla completa por sitio antes de pasar al siguiente. No comparar sobre la marcha.
4. Solo al final, construir la tabla comparativa y sacar patrones.

## Entregable

1. **Tabla maestra** — una fila por sitio, columnas de la rejilla
2. **Patrones transversales** — qué hacen todos igual (y por tanto no diferencia), qué hace solo uno
3. **Territorio de lenguaje ocupado** — qué términos ya tienen dueño
4. **Huecos** — qué no hace nadie

## Estándares

- Citar **literal** títulos, H1 y taglines. Parafrasear pierde el dato
- La ausencia se anota, no se omite
- Separar lo que el sitio **dice** de lo que el producto **hace**
- Terminar con la implicación accionable para el cliente, no solo con la descripción
