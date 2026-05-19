## Why

El weblog necesita permitir que los usuarios encuentren publicaciones por texto sin cargar ni filtrar grandes listados en Next.js. La búsqueda debe soportar un volumen superior a 500 mil publicaciones consultando OpenSearch desde el servidor y manteniendo la experiencia localizada del blog.

## What Changes

- Agregar un buscador en las páginas `/blog` y `/en/blog`.
- Usar búsqueda basada en URL con parámetros `q` y `page`, por ejemplo `/blog?q=react&page=1` y `/en/blog?q=react&page=1`.
- Aplicar debounce en el input antes de actualizar la URL de búsqueda.
- Consultar OpenSearch desde Server Components o servicios server-only; el navegador no debe conectarse directamente a OpenSearch.
- Buscar publicaciones solo por `title` e `intro`; el contenido completo del post queda fuera del alcance.
- Seleccionar el índice o alias de OpenSearch según el locale activo (`es` o `en`).
- Mostrar resultados paginados y conservar el listado actual de publicaciones cuando no exista `q`.
- Mostrar estados localizados para búsqueda sin resultados y errores de búsqueda.
- Tratar OpenSearch como read-only desde este frontend.
- Excluir del alcance la indexación desde AEM, webhooks de AEM, administración de índices/mappings/aliases y cualquier servicio Node indexer externo.

## Capabilities

### New Capabilities
- `blog-search`: Cubre la búsqueda URL-based de publicaciones en el blog, consulta read-only a OpenSearch por locale, búsqueda por `title` e `intro`, paginación, debounce del input y estados localizados de resultados.

### Modified Capabilities
- Ninguna. La navegación multilingüe existente se mantiene y la búsqueda se modela como una capacidad nueva del blog.

## Impact

- Afecta rutas App Router de blog en `app/blog/page.tsx` y `app/en/blog/page.tsx` para leer `searchParams`.
- Afecta renderizado de blog en `features/rendering/blog.tsx` para alternar entre listado normal y resultados de búsqueda.
- Agrega integración server-only con OpenSearch, probablemente bajo `integrations/search/`.
- Agrega servicio de búsqueda de posts, probablemente bajo `features/posts/`.
- Agrega componentes de UI para input de búsqueda con debounce, resultados y paginación.
- Afecta diccionarios/localización para textos de búsqueda en `lib/i18n.ts`.
- Requiere variables de entorno para conexión read-only a OpenSearch e índices/aliases por locale.
- No afecta el servicio externo de indexación ni las responsabilidades de AEM.
